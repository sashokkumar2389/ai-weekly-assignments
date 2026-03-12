import { ResumeRepository } from '../repositories/ResumeRepository';
import { EmbeddingService } from './EmbeddingService';
import { LLMService } from './LLMService';
import { Resume } from '../types/resume';

export class SearchService {
    private resumeRepository: ResumeRepository;
    private embeddingService: EmbeddingService;
    private llmService: LLMService;

    constructor() {
        this.resumeRepository = new ResumeRepository();
        this.embeddingService = new EmbeddingService();
        this.llmService = new LLMService();
    }

    /**
     * BM25 full-text search
     */
    async bm25Search(query: string, filters: any, topK: number) {
        return await this.resumeRepository.bm25Search(query, filters, topK);
    }

    /**
     * Vector semantic search with embeddings
     */
    async vectorSearch(query: string, filters: any, topK: number) {
        const embedding = await this.embeddingService.generateEmbedding(query);
        return await this.resumeRepository.vectorSearch(embedding, filters, topK);
    }

    /**
     * Hybrid search combining BM25 and vector search
     */
    async hybridSearch(query: string, filters: any, options: any) {
        try {
            const [bm25Results, vectorResults] = await Promise.all([
                this.bm25Search(query, filters, options.topK),
                this.vectorSearch(query, filters, options.topK)
            ]);

            return {
                bm25Results: bm25Results || [],
                vectorResults: vectorResults || []
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Hybrid search error:', message);

            // Graceful degradation: try BM25 only if vector fails
            try {
                const bm25Results = await this.bm25Search(query, filters, options.topK);
                return {
                    bm25Results,
                    vectorResults: [],
                    warning: 'Vector search unavailable, returning BM25 results only'
                };
            } catch {
                return {
                    bm25Results: [],
                    vectorResults: [],
                    error: 'Both BM25 and vector search failed'
                };
            }
        }
    }

    /**
     * End-to-end search pipeline with detailed tracking:
     * BM25 + Vector → Combine → LLM Rerank → Optional Summarization
     * Returns: { results, timings, counts, rerankUsed }
     */
    async endToEndSearch(query: string, filters: any, options: any) {
        const componentTimings: any = {};
        const counts: any = {};

        try {
            // Step 1: Run both searches in parallel with timing
            let bm25Start = Date.now();
            const embedding = await this.embeddingService.generateEmbedding(query);
            console.log(`Generated embedding with ${embedding.length} dimensions`);

            const [bm25Results, vectorResults] = await Promise.all([
                this.resumeRepository.bm25Search(query, filters, options.topK),
                this.resumeRepository.vectorSearch(embedding, filters, options.topK)
            ]);

            const bm25Ms = Date.now() - bm25Start;
            const vectorMs = Date.now() - bm25Start - bm25Ms;

            componentTimings.bm25Ms = bm25Ms;
            componentTimings.vectorMs = vectorMs;
            counts.bm25 = bm25Results.length;
            counts.vector = vectorResults.length;

            console.log(`BM25: ${bm25Results.length} results (${bm25Ms}ms), Vector: ${vectorResults.length} results (${vectorMs}ms)`);

            // Step 2: Combine and deduplicate results, tracking sources
            const mergedData = this.combineAndDeduplicateWithSources(bm25Results, vectorResults);
            const combinedResults = mergedData.results;
            const sourcesMap = mergedData.sourcesMap;

            counts.merged = combinedResults.length;
            console.log(`Combined: ${combinedResults.length} unique candidates`);

            // Step 3: LLM re-ranking
            const candidatesForReranking = combinedResults.map(result => ({
                resumeId: result._id || result.resumeId || '',
                text: result.text || '',
                snippet: (result.text || '').substring(0, 500)
            }));

            console.log(`Reranking ${candidatesForReranking.length} candidates...`);
            const rerankStart = Date.now();
            const rerankResponse = await this.llmService.rerankCandidates(
                query,
                candidatesForReranking,
                options.topK || 10
            );
            const rerankMs = Date.now() - rerankStart;
            componentTimings.rerankMs = rerankMs;

            let results = (rerankResponse.rankedCandidates || []).map((candidate: any) => {
                const resumeId = candidate.resumeId || '';
                const originalResume = combinedResults.find(
                    r => (r._id || r.resumeId || '') === resumeId
                );

                return {
                    ...candidate,
                    _id: resumeId,
                    resumeId,
                    sources: sourcesMap[resumeId] || { bm25: null, vector: null },
                    ...(originalResume && {
                        name: originalResume.name,
                        email: originalResume.email,
                        phone: originalResume.phone,
                        location: originalResume.location,
                        company: originalResume.company,
                        role: originalResume.role,
                        education: originalResume.education,
                        totalExperience: originalResume.totalExperience,
                        relevantExperience: originalResume.relevantExperience,
                        text: originalResume.text
                    })
                };
            });

            // Step 4: Optional summarization
            if (options.summarize) {
                console.log(`Generating summaries for ${results.length} candidates`);
                const summarizeStart = Date.now();
                results = await Promise.all(
                    results.map(async (candidate: any) => {
                        try {
                            const summary = await this.llmService.summarizeCandidateFit(
                                query,
                                {
                                    resumeId: candidate.resumeId,
                                    snippet: candidate.text || '',
                                    text: candidate.text
                                },
                                { style: options.summarizeStyle || 'short', maxTokens: options.summarizeMaxTokens }
                            );
                            return { ...candidate, summary };
                        } catch (error) {
                            console.error(`Failed to summarize ${candidate.resumeId}:`, error);
                            return candidate;
                        }
                    })
                );
                const summarizeMs = Date.now() - summarizeStart;
                componentTimings.summarizeMs = summarizeMs;
            }

            console.log(`End-to-end search completed with ${results.length} final results`);

            return {
                results,
                counts,
                componentTimings,
                rerankUsed: true
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('End-to-end search error:', message);
            throw new Error(`End-to-end search failed: ${message}`);
        }
    }

    /**
     * Combine BM25 and vector results, tracking sources for each result
     */
    private combineAndDeduplicateWithSources(
        bm25Results: any[],
        vectorResults: any[]
    ): { results: any[]; sourcesMap: any } {
        const uniqueMap = new Map<string, any>();
        const sourcesMap: any = {};

        // Track BM25 results
        for (const result of bm25Results) {
            const id = result._id || result.resumeId || '';
            if (id) {
                uniqueMap.set(id, result);
                if (!sourcesMap[id]) sourcesMap[id] = { bm25: null, vector: null };
                sourcesMap[id].bm25 = { score: result.bm25Score || 1 };
            }
        }

        // Track vector results
        for (const result of vectorResults) {
            const id = result._id || result.resumeId || '';
            if (id) {
                if (!uniqueMap.has(id)) {
                    uniqueMap.set(id, result);
                }
                if (!sourcesMap[id]) sourcesMap[id] = { bm25: null, vector: null };
                sourcesMap[id].vector = { score: result.similarityScore || 0 };
            }
        }

        return {
            results: Array.from(uniqueMap.values()),
            sourcesMap
        };
    }
}