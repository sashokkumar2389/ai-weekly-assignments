import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMemoryManager } from "./memory/index.js";
import { RetrievalPipeline } from "../pipelines/index.js";
import { SearchResultItem } from "../types/index.js";

/**
 * System prompt for conversational RAG (Resume search with memory)
 */
const RAG_CONVERSATION_SYSTEM_PROMPT = `You are an expert AI assistant specializing in resume search and candidate analysis.

You help users find and filter candidates from a resume database. You maintain context across multiple questions:
- Remember user names and preferences mentioned earlier
- Build upon previous search queries and results
- Apply filters progressively (e.g., "filter those results" means use the previous search context)
- Provide specific, data-driven answers based on search results

When users ask follow-up questions like "filter those" or "from those results", refer to the previous search context.

IMPORTANT: When listing candidate results, follow this EXACT format:
1. Start with: "Here are X results (search_type)"
2. List candidates sorted by score (highest first): Name | Email · Phone | Top 3 skills
3. Add ONE summary sentence highlighting key commonality or trend
4. NO verbose descriptions, tables, explanations, or "Next steps"
5. ONLY show the 3-5 top scoring candidates
6. Keep the entire response to 5-7 lines maximum

Example format:
Here are 3 results (hybrid search)

1. Divya N | divyan4519@gmail.com · 7645843345 | Functional Testing, Automation Testing, Core Banking
2. Sathish B | sathish0708rk@gmail.com · 7912345427 | Selenium WebDriver, Automation & Manual Testing, Java
3. Monisha Vijayan | monishvijayan10@gmail.com · 6381234582 | Playwright, Functional Testing, Automation

All 3 candidates demonstrate strong functional and automation testing skills with 5+ years experience.

Maintain a professional, helpful tone throughout the conversation.`;

/**
 * Prompt template for RAG with chat history
 */
const RAG_CONVERSATION_PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
  ["system", RAG_CONVERSATION_SYSTEM_PROMPT],
  ["placeholder", "{chat_history}"],
  ["human", `Question: {input}

Search Type: {search_type}
Search Results (sorted by score):
{search_results}

---

Format your response EXACTLY like this:
Here are X results (search_type)

1. Candidate Name | email@email.com · 1234567890 | Skill1, Skill2, Skill3
2. Another Name | another@email.com · 0987654321 | SkillA, SkillB, SkillC

Summary sentence about what these candidates have in common.

Based on the search results above, provide the answer using this exact format.`],
]);

/**
 * Format search results for the prompt
 */
function formatSearchResults(results: SearchResultItem[]): string {
  if (results.length === 0) {
    return "No matching candidates found.";
  }

  // Sort by score descending
  const sorted = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Format for LLM: Name | Email · Phone | Top 3 skills
  return sorted
    .slice(0, 10) // Limit to top 10 for context
    .map((result, idx) => {
      // Extract top 3 skills from extractedInfo
      const skills = (result as any).extractedInfo?.skills || [];
      const topSkills = Array.isArray(skills)
        ? skills.slice(0, 3).join(", ")
        : (skills || "");

      // Fallback: extract from content if no skills available
      const displaySkills =
        topSkills ||
        `Score: ${((result.score || 0) * 100).toFixed(0)}%`;

      return `${idx + 1}. ${result.name} | ${result.email} · ${result.phoneNumber} | ${displaySkills}`;
    })
    .join("\n");
}

/**
 * Conversational RAG Chain Manager
 * Combines chat memory with resume search retrieval
 */
export class ConversationalRAGChainManager {
  private chain: RunnableSequence<any, string>;
  private memoryManager: ChatMemoryManager;
  private retrievalPipeline: RetrievalPipeline;
  private model: BaseChatModel;
  private lastSearchResults: SearchResultItem[] = [];
  private lastQuery: string = "";

  constructor(
    model: BaseChatModel,
    memoryManager: ChatMemoryManager,
    retrievalPipeline: RetrievalPipeline
  ) {
    this.model = model;
    this.memoryManager = memoryManager;
    this.retrievalPipeline = retrievalPipeline;

    // Build the RAG chain
    this.chain = RunnableSequence.from([
      RAG_CONVERSATION_PROMPT_TEMPLATE,
      model,
      new StringOutputParser(),
    ]);
  }

  /**
   * Process a conversational query with RAG
   * 
   * @param input - User query
   * @param searchType - Type of search to perform (keyword/vector/hybrid)
   * @param topK - Number of results to retrieve
   * @param traceId - Request trace ID for logging
   * @param hybridVectorWeight - Optional hybrid weight in 0-100 scale (100 = 100% vector)
   */
  async chat(
    input: string,
    searchType: "keyword" | "vector" | "hybrid" = "hybrid",
    topK: number = 10,
    traceId?: string,
    hybridVectorWeight?: number
  ): Promise<{ response: string; searchResults: SearchResultItem[] }> {
    const requestId = traceId || `chat_${Date.now()}`;

    console.log(`\n[ConversationalRAG:${requestId}] User: ${input}`);

    // Determine if this is a follow-up query (filter/refine previous results)
    const isFollowUp = this.isFollowUpQuery(input);

    let searchResults: SearchResultItem[];

    if (isFollowUp && this.lastSearchResults.length > 0) {
      // Use previous search results for follow-up questions
      console.log(`[ConversationalRAG:${requestId}] Detected follow-up query, using previous ${this.lastSearchResults.length} results`);
      searchResults = this.lastSearchResults;
    } else {
      // Perform new search
      console.log(`[ConversationalRAG:${requestId}] Performing ${searchType} search with topK=${topK}`);
      if (hybridVectorWeight !== undefined) {
        console.log(`[ConversationalRAG:${requestId}] Hybrid weight: ${hybridVectorWeight}% vector`);
      }

      searchResults = await this.retrievalPipeline.search(
        input,
        searchType,
        topK,
        requestId,
        hybridVectorWeight
      );
      console.log(`[ConversationalRAG:${requestId}] Retrieved ${searchResults.length} results`);

      // Store for potential follow-up
      this.lastSearchResults = searchResults;
      this.lastQuery = input;
    }

    // Format search results for prompt
    const formattedResults = formatSearchResults(searchResults);

    // Load chat history
    const memory = this.memoryManager.getMemory();
    const memoryVariables = await memory.loadMemoryVariables({});

    // Invoke chain with history and search results
    const response = await this.chain.invoke({
      input,
      chat_history: memoryVariables.chat_history || [],
      search_results: formattedResults,
      search_type: searchType,
    });

    console.log(`[ConversationalRAG:${requestId}] AI: ${response.substring(0, 100)}...`);

    // Save exchange to memory
    await this.memoryManager.addExchange(input, response);

    return { response, searchResults };
  }

  /**
   * Detect if query is a follow-up (filter/refinement of previous results)
   */
  private isFollowUpQuery(input: string): boolean {
    const followUpPatterns = [
      /filter\s+(only\s+)?(those|these|them|the|that)/i,
      /from\s+(those|these|the|that)\s+results/i,
      /narrow\s+down/i,
      /refine\s+(those|these|the|that)/i,
      /only\s+(show|list|get)\s+(those|candidates|profiles)/i,
      /exclude\s+(those|these|candidates)/i,
    ];

    return followUpPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Get chat history
   */
  async getChatHistory(): Promise<any[]> {
    return await this.memoryManager.getMessages();
  }

  /**
   * Log chat history for debugging
   */
  async logHistory(): Promise<void> {
    await this.memoryManager.logHistory();
  }

  /**
   * Clear conversation memory
   */
  async clear(): Promise<void> {
    await this.memoryManager.clear();
    this.lastSearchResults = [];
    this.lastQuery = "";
  }

  /**
   * Get last search results
   */
  getLastSearchResults(): SearchResultItem[] {
    return this.lastSearchResults;
  }
}
