import { Collection } from "mongodb";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ResumeVectorStore } from "../../lib/vectorstore/index.js";
import { KeywordSearchEngine } from "./keywordSearch.js";
import { VectorSearchEngine } from "./vectorSearch.js";
import { HybridSearchEngine, HybridSearchConfig } from "./hybridSearch.js";
import { LLMReranker, ResumeMatch } from "./llmReranker.js";
import { SearchResultItem, SearchMetadata } from "./types.js";

/**
 * Configuration for LLM re-ranking
 */
export interface LLMRerankConfig {
  enabled: boolean;
  retrievalTopK: number; // Number of candidates to retrieve before LLM filtering
}

/**
 * Main retrieval pipeline orchestrating all search types with optional LLM re-ranking
 * 
 * Pipeline Flow:
 * 1. Initial Retrieval (keyword/vector/hybrid) → Get top N candidates
 * 2. LLM Re-ranking (optional) → Filter & rank based on semantic criteria
 * 3. Return final results
 */
export class RetrievalPipeline {
  private keywordEngine: KeywordSearchEngine;
  private vectorEngine: VectorSearchEngine;
  private hybridEngine: HybridSearchEngine;
  private llmReranker?: LLMReranker;
  private llmRerankConfig: LLMRerankConfig;
  private isInitialized = false;

  constructor(
    collection: Collection,
    vectorStore: ResumeVectorStore,
    hybridConfig: HybridSearchConfig,
    chatModel?: BaseChatModel,
    llmRerankConfig?: Partial<LLMRerankConfig>
  ) {
    // Initialize search engines
    this.keywordEngine = new KeywordSearchEngine(collection);
    this.vectorEngine = new VectorSearchEngine(vectorStore);
    this.hybridEngine = new HybridSearchEngine(
      this.keywordEngine,
      this.vectorEngine,
      hybridConfig
    );

    // Initialize LLM re-ranker if model provided
    this.llmRerankConfig = {
      enabled: chatModel ? (llmRerankConfig?.enabled ?? true) : false,
      retrievalTopK: llmRerankConfig?.retrievalTopK ?? 10,
    };

    if (chatModel && this.llmRerankConfig.enabled) {
      this.llmReranker = new LLMReranker(chatModel);
    }

    this.isInitialized = true;
    console.log("[Retrieval Pipeline] Initialized successfully");
    console.log(`[Retrieval Pipeline] Hybrid weights: vector=${hybridConfig.vectorWeight}, keyword=${hybridConfig.keywordWeight}`);
    console.log(`[Retrieval Pipeline] LLM re-ranking: ${this.llmRerankConfig.enabled ? 'ENABLED ✓' : 'DISABLED'}`);

    if (this.llmRerankConfig.enabled) {
      console.log(`[Retrieval Pipeline] LLM retrieval top-K: ${this.llmRerankConfig.retrievalTopK}`);
    }
  }

  /**
   * Execute search based on type with optional LLM re-ranking
   * 
   * Flow:
   * 1. Retrieve initial candidates using specified search type
   * 2. If LLM re-ranking enabled: filter & rank candidates semantically
   * 3. Return final results limited to topK
   * 
   * @param query - The search query
   * @param searchType - Type of search: keyword, vector, or hybrid
   * @param topK - Maximum number of results to return
   * @param traceId - Request trace ID for logging
   * @param hybridVectorWeight - Optional hybrid weight (0-100, where 100 = 100% vector; converted to 0-1)
   */
  async search(
    query: string,
    searchType: "keyword" | "vector" | "hybrid",
    topK: number,
    traceId: string,
    hybridVectorWeight?: number
  ): Promise<SearchResultItem[]> {
    if (!this.isInitialized) {
      throw new Error("Retrieval pipeline not initialized");
    }

    const metadata: SearchMetadata = {
      traceId,
      startTime: Date.now(),
      searchType,
    };

    console.log(`[${traceId}] [Retrieval Pipeline] Executing ${searchType} search`);

    // Determine retrieval count: if LLM re-ranking enabled, get more candidates
    const retrievalCount = this.llmRerankConfig.enabled
      ? this.llmRerankConfig.retrievalTopK
      : topK;

    console.log(
      `[${traceId}] [Retrieval Pipeline] Retrieving ${retrievalCount} candidates ` +
      `(final topK: ${topK})${this.llmRerankConfig.enabled ? ' → LLM filtering' : ''}`
    );

    // Stage 1: Initial Retrieval
    let results: SearchResultItem[];

    switch (searchType) {
      case "keyword":
        results = await this.keywordEngine.search(query, retrievalCount, metadata);
        break;

      case "vector":
        results = await this.vectorEngine.search(query, retrievalCount, metadata);
        break;

      case "hybrid": {
        // Use dynamic hybrid weight if provided, otherwise use default config
        let hybridEngine = this.hybridEngine;

        if (hybridVectorWeight !== undefined) {
          // Convert 0-100 scale to 0-1 decimal
          const vectorWeightDecimal = Math.max(0, Math.min(1, hybridVectorWeight / 100));
          const keywordWeightDecimal = 1 - vectorWeightDecimal;

          console.log(
            `[${traceId}] [Retrieval Pipeline] Using dynamic hybrid weights: ` +
            `vector=${vectorWeightDecimal.toFixed(2)}, keyword=${keywordWeightDecimal.toFixed(2)}`
          );

          // Create temporary engine with override weights
          hybridEngine = new HybridSearchEngine(
            this.keywordEngine,
            this.vectorEngine,
            {
              vectorWeight: vectorWeightDecimal,
              keywordWeight: keywordWeightDecimal,
            }
          );
        }

        results = await hybridEngine.search(query, retrievalCount, metadata);
        break;
      }

      default:
        throw new Error(`Unknown search type: ${searchType}`);
    }

    console.log(`[${traceId}] [Retrieval Pipeline] Stage 1 complete: ${results.length} candidates retrieved`);

    // For vector mode, gracefully degrade to keyword retrieval when vector returns no hits.
    if (searchType === "vector" && results.length === 0) {
      console.warn(
        `[${traceId}] [Retrieval Pipeline] Vector search returned 0 results, ` +
        `falling back to keyword search`
      );
      results = await this.keywordEngine.search(query, retrievalCount, {
        ...metadata,
        searchType: "keyword-fallback",
      });
      console.log(
        `[${traceId}] [Retrieval Pipeline] Fallback complete: ${results.length} keyword candidates retrieved`
      );
    }

    // For keyword mode, gracefully degrade to vector retrieval when keyword returns no hits.
    if (searchType === "keyword" && results.length === 0) {
      console.warn(
        `[${traceId}] [Retrieval Pipeline] Keyword search returned 0 results, ` +
        `falling back to vector search`
      );
      results = await this.vectorEngine.search(query, retrievalCount, {
        ...metadata,
        searchType: "vector-fallback",
      });
      console.log(
        `[${traceId}] [Retrieval Pipeline] Fallback complete: ${results.length} vector candidates retrieved`
      );
    }

    // For hybrid mode, gracefully degrade to vector retrieval when hybrid returns no hits.
    if (searchType === "hybrid" && results.length === 0) {
      console.warn(
        `[${traceId}] [Retrieval Pipeline] Hybrid search returned 0 results, ` +
        `falling back to vector search`
      );
      results = await this.vectorEngine.search(query, retrievalCount, {
        ...metadata,
        searchType: "vector-fallback",
      });
      console.log(
        `[${traceId}] [Retrieval Pipeline] Fallback (vector) complete: ${results.length} candidates retrieved`
      );

      // If vector also returns nothing, try keyword as last resort
      if (results.length === 0) {
        console.warn(
          `[${traceId}] [Retrieval Pipeline] Vector fallback also returned 0 results, ` +
          `trying keyword search as last resort`
        );
        results = await this.keywordEngine.search(query, retrievalCount, {
          ...metadata,
          searchType: "keyword-fallback",
        });
        console.log(
          `[${traceId}] [Retrieval Pipeline] Fallback (keyword) complete: ${results.length} candidates retrieved`
        );
      }
    }

    // Stage 2: LLM Re-ranking (if enabled)
    let llmAnalysis: { summary: string; matches: ResumeMatch[] } | undefined;

    if (this.llmRerankConfig.enabled && this.llmReranker && results.length > 0) {
      console.log(`[${traceId}] [Retrieval Pipeline] Stage 2: LLM re-ranking & filtering`);

      const rerankedData = await this.llmReranker.rerankAndFilter(query, results, traceId);
      results = rerankedData.results;
      llmAnalysis = rerankedData.llmAnalysis;

      console.log(`[${traceId}] [Retrieval Pipeline] Stage 2 complete: ${results.length} candidates after LLM filtering`);
    }

    // Limit to requested topK
    results = results.slice(0, topK);

    const duration = Date.now() - metadata.startTime;
    console.log(
      `[${traceId}] [Retrieval Pipeline] ✓ Search completed in ${duration}ms, ` +
      `returning ${results.length} final results`
    );

    // Attach LLM analysis metadata to results if available
    if (llmAnalysis) {
      results.forEach(result => {
        const matchInfo = llmAnalysis.matches.find(m => m.name === result.name);
        if (matchInfo) {
          // @ts-ignore - Add LLM metadata
          result.llmAnalysis = {
            reasoning: matchInfo.reasoning,
            extractedInfo: matchInfo.extractedInfo,
          };
        }
      });
    }

    return results;
  }

  /**
   * Perform keyword search
   */
  async keywordSearch(query: string, topK: number, traceId: string): Promise<SearchResultItem[]> {
    return this.search(query, "keyword", topK, traceId);
  }

  /**
   * Perform vector search)
   */
  async vectorSearch(query: string, topK: number, traceId: string): Promise<SearchResultItem[]> {
    return this.search(query, "vector", topK, traceId);
  }

  /**
   * Perform hybrid search
   */
  async hybridSearch(query: string, topK: number, traceId: string): Promise<SearchResultItem[]> {
    return this.search(query, "hybrid", topK, traceId);
  }

  /**
   * Update hybrid search weights dynamically
   */
  updateHybridWeights(vectorWeight: number, keywordWeight: number): void {
    this.hybridEngine.updateWeights(vectorWeight, keywordWeight);
  }

  /**
   * Get current hybrid weights
   */
  getHybridWeights(): HybridSearchConfig {
    return this.hybridEngine.getWeights();
  }

  /**
   * Check if pipeline is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}
