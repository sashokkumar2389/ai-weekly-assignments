import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { AIMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";

/**
 * Message metadata for tracking and context
 */
export interface MessageMetadata {
  timestamp: number;
  messageIndex: number;
  exchangeIndex: number; // Which user-AI exchange this belongs to
  tokens?: number; // Estimated token count
}

/**
 * Configuration for chat memory
 */
export interface ChatMemoryConfig {
  memoryKey?: string;
  inputKey?: string;
  outputKey?: string;
  returnMessages?: boolean;
  maxMessages?: number; // Limit number of messages to keep
  windowSize?: number; // Sliding window size for context (in message pairs)
  bufferStrategy?: "sliding" | "fixed"; // How to manage buffer overflow
}

/**
 * Chat Buffer Memory Manager
 * Implements a sliding window buffer for conversation memory with:
 * - Automatic message buffering and windowing
 * - Message metadata tracking
 * - Configurable buffer strategies (sliding/fixed)
 * - Integration with LangChain's BufferMemory
 */
export class ChatMemoryManager {
  private memory: BufferMemory;
  private messageMetadata: Map<number, MessageMetadata> = new Map();
  private maxMessages: number;
  private windowSize: number; // Number of message pairs to keep in context
  private bufferStrategy: "sliding" | "fixed";
  private conversationId: string;
  private totalExchanges: number = 0; // Track total exchanges for metadata
  private lastSearchResults: any[] = [];

  constructor(conversationId: string, config?: ChatMemoryConfig) {
    this.conversationId = conversationId;
    this.maxMessages = config?.maxMessages ?? 10; // Default: keep last 10 messages (5 exchanges)
    this.windowSize = config?.windowSize ?? 5; // Default: keep last 5 message pairs in active context
    this.bufferStrategy = config?.bufferStrategy ?? "sliding"; // Use sliding window by default

    // Initialize BufferMemory with chat history
    this.memory = new BufferMemory({
      memoryKey: config?.memoryKey ?? "chat_history",
      inputKey: config?.inputKey ?? "input",
      outputKey: config?.outputKey ?? "output",
      returnMessages: config?.returnMessages ?? true,
      chatHistory: new ChatMessageHistory(),
    });

    console.log(
      `[ChatBuffer:${conversationId}] Initialized with strategy="${this.bufferStrategy}" ` +
      `maxMessages=${this.maxMessages} windowSize=${this.windowSize}`
    );
  }

  /**
   * Add a user message and AI response to memory with metadata tracking
   */
  async addExchange(userInput: string, aiOutput: string): Promise<void> {
    this.totalExchanges++;
    const exchangeIndex = this.totalExchanges;

    // Save exchange to memory
    await this.memory.saveContext(
      { input: userInput },
      { output: aiOutput }
    );

    // Get all messages and update metadata for new messages
    const messages = await this.getMessages();
    const newUserMsgIdx = messages.length - 2;
    const newAiMsgIdx = messages.length - 1;

    // Track metadata for new messages
    const now = Date.now();
    this.messageMetadata.set(newUserMsgIdx, {
      timestamp: now,
      messageIndex: newUserMsgIdx,
      exchangeIndex: exchangeIndex,
    });
    this.messageMetadata.set(newAiMsgIdx, {
      timestamp: now,
      messageIndex: newAiMsgIdx,
      exchangeIndex: exchangeIndex,
    });

    // Apply buffer management strategy
    if (this.bufferStrategy === "sliding") {
      await this.applySlidingWindow();
    } else {
      await this.trimMessages();
    }

    const messageCount = await this.getMessageCount();
    console.log(
      `[ChatBuffer:${this.conversationId}] Exchange #${exchangeIndex} added. ` +
      `Total messages: ${messageCount} (${Math.ceil(messageCount / 2)} exchanges)`
    );
  }

  /**
   * Get all messages from memory
   */
  async getMessages(): Promise<BaseMessage[]> {
    const memoryVariables = await this.memory.loadMemoryVariables({});
    const messages = memoryVariables.chat_history as BaseMessage[];
    return messages || [];
  }

  /**
   * Get chat history as formatted string for logging
   */
  async getChatHistoryString(): Promise<string> {
    const messages = await this.getMessages();

    if (messages.length === 0) {
      return "  (No messages yet)";
    }

    return messages
      .map((msg, idx) => {
        const type = msg instanceof HumanMessage ? "👤" : "🤖";
        const content = msg.content.toString().substring(0, 80);
        const metadata = this.messageMetadata.get(idx);
        const exchange = metadata ? `#${metadata.exchangeIndex}` : "?";
        return `  ${idx + 1}. [${type} EX${exchange}]: ${content}${msg.content.toString().length > 80 ? "..." : ""
          }`;
      })
      .join("\n");
  }

  /**
   * Get buffer statistics
   */
  async getBufferStats(): Promise<{
    messageCount: number;
    exchangeCount: number;
    windowSize: number;
    bufferStrategy: string;
    cacheSize: number;
  }> {
    const messageCount = await this.getMessageCount();
    return {
      messageCount,
      exchangeCount: Math.ceil(messageCount / 2),
      windowSize: this.windowSize,
      bufferStrategy: this.bufferStrategy,
      cacheSize: this.lastSearchResults.length,
    };
  }

  /**
   * Get the number of messages in memory
   */
  async getMessageCount(): Promise<number> {
    const messages = await this.getMessages();
    return messages.length;
  }

  /**
   * Clear all messages from memory
   */
  async clear(): Promise<void> {
    await this.memory.clear();
    console.log(`[ChatMemory:${this.conversationId}] Memory cleared`);
  }

  /**
   * Get the underlying BufferMemory instance (for chain integration)
   */
  getMemory(): BufferMemory {
    return this.memory;
  }

  /**
   * Trim messages to stay within maxMessages limit
   * Keeps most recent messages
   */
  private async trimMessages(): Promise<void> {
    const messages = await this.getMessages();

    if (messages.length > this.maxMessages) {
      const toRemove = messages.length - this.maxMessages;

      // Get the chat history and remove oldest messages
      const chatHistory = this.memory.chatHistory;

      // Clear and re-add only the recent messages
      await chatHistory.clear();
      const recentMessages = messages.slice(toRemove);

      for (const msg of recentMessages) {
        await chatHistory.addMessage(msg);
      }

      // Clean up old metadata
      for (let i = 0; i < toRemove; i++) {
        this.messageMetadata.delete(i);
      }

      console.log(
        `[ChatBuffer:${this.conversationId}] Trimmed ${toRemove} old messages. ` +
        `Keeping ${recentMessages.length} recent messages.`
      );
    }
  }

  /**
   * Apply sliding window strategy to maintain context window
   * Keeps only the most recent N message exchanges
   */
  private async applySlidingWindow(): Promise<void> {
    const messages = await this.getMessages();
    const currentExchanges = Math.ceil(messages.length / 2);

    if (currentExchanges > this.windowSize) {
      // Calculate how many messages to remove (keeping only windowSize exchanges)
      const messagesToKeep = this.windowSize * 2;
      const toRemove = messages.length - messagesToKeep;

      const chatHistory = this.memory.chatHistory;
      await chatHistory.clear();

      // Re-add only windowed messages
      const windowedMessages = messages.slice(toRemove);
      for (const msg of windowedMessages) {
        await chatHistory.addMessage(msg);
      }

      // Clean up old metadata
      for (let i = 0; i < toRemove; i++) {
        this.messageMetadata.delete(i);
      }

      console.log(
        `[ChatBuffer:${this.conversationId}] 📊 Sliding window applied: ` +
        `keeping last ${this.windowSize} exchanges (${messagesToKeep} messages), ` +
        `removed ${toRemove} messages`
      );
    }
  }

  /**
   * Log current chat history with buffer statistics (for debugging)
   */
  async logHistory(): Promise<void> {
    const stats = await this.getBufferStats();
    console.log(`\n[ChatBuffer:${this.conversationId}] === BUFFER STATE ===`);
    console.log(`  Strategy: ${stats.bufferStrategy} window`);
    console.log(`  Window Size: ${stats.windowSize} exchanges`);
    console.log(`  Messages: ${stats.messageCount} (${stats.exchangeCount} exchanges)`);
    console.log(`  Cached Results: ${stats.cacheSize}`);
    console.log(`\n[ChatBuffer:${this.conversationId}] === CHAT HISTORY ===`);
    const historyString = await this.getChatHistoryString();
    console.log(historyString);
    console.log(`[ChatBuffer:${this.conversationId}] Total: ${stats.messageCount} messages`);
    console.log(`[ChatBuffer:${this.conversationId}] Cached search results: ${stats.cacheSize}`);
    console.log(`===================================\n`);
  }

  /**
   * Store search results for conversational filtering
   */
  setLastSearchResults(results: any[]): void {
    this.lastSearchResults = results;
    console.log(
      `[ChatMemory:${this.conversationId}] Cached ${results.length} search results for filtering`
    );
  }

  /**
   * Get cached search results
   */
  getLastSearchResults(): any[] {
    return this.lastSearchResults;
  }

  /**
   * Check if there are cached search results
   */
  hasSearchResults(): boolean {
    return this.lastSearchResults.length > 0;
  }

  /**
   * Clear cached search results
   */
  clearSearchResults(): void {
    this.lastSearchResults = [];
    console.log(`[ChatMemory:${this.conversationId}] Cleared cached search results`);
  }
}

/**
 * Global conversation buffer store
 * Maps conversation IDs to ChatMemoryManager (ChatBuffer) instances
 * Manages lifecycle of conversation buffers with automatic cleanup
 */
class ConversationStore {
  private conversations = new Map<string, ChatMemoryManager>();
  private conversationTimestamps = new Map<string, number>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour inactivity timeout

  constructor() {
    // Start periodic cleanup of inactive conversations
    this.startCleanupTimer();
  }

  /**
   * Start background cleanup of inactive conversations
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveConversations();
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  /**
   * Clean up inactive conversations older than INACTIVITY_TIMEOUT
   */
  private cleanupInactiveConversations(): void {
    const now = Date.now();
    const expired: string[] = [];

    for (const [convId, timestamp] of this.conversationTimestamps.entries()) {
      if (now - timestamp > this.INACTIVITY_TIMEOUT) {
        expired.push(convId);
      }
    }

    if (expired.length > 0) {
      for (const convId of expired) {
        this.conversations.delete(convId);
        this.conversationTimestamps.delete(convId);
        console.log(`[ConversationStore] 🧹 Cleaned up inactive conversation: ${convId}`);
      }
      console.log(`[ConversationStore] Cleaned up ${expired.length} inactive conversations`);
    }
  }

  /**
   * Get or create a ChatBuffer for a conversation
   */
  getOrCreate(conversationId: string, config?: ChatMemoryConfig): ChatMemoryManager {
    if (!this.conversations.has(conversationId)) {
      const manager = new ChatMemoryManager(conversationId, config);
      this.conversations.set(conversationId, manager);
      this.conversationTimestamps.set(conversationId, Date.now());
      console.log(`[ConversationStore] 📝 Created new buffer: ${conversationId}`);
    } else {
      // Update last access timestamp
      this.conversationTimestamps.set(conversationId, Date.now());
    }
    return this.conversations.get(conversationId)!;
  }

  /**
   * Check if conversation exists
   */
  has(conversationId: string): boolean {
    return this.conversations.has(conversationId);
  }

  /**
   * Delete a conversation buffer
   */
  delete(conversationId: string): boolean {
    const deleted = this.conversations.delete(conversationId);
    if (deleted) {
      this.conversationTimestamps.delete(conversationId);
      console.log(`[ConversationStore] 🗑️ Deleted buffer: ${conversationId}`);
    }
    return deleted;
  }

  /**
   * Get all conversation IDs
   */
  getConversationIds(): string[] {
    return Array.from(this.conversations.keys());
  }

  /**
   * Get statistics for all conversations
   */
  async getStatistics(): Promise<any> {
    const stats = {
      totalConversations: this.conversations.size,
      conversations: [] as any[],
      totalMessages: 0,
      totalExchanges: 0,
    };

    for (const [convId, manager] of this.conversations.entries()) {
      const bufferStats = await manager.getBufferStats();
      stats.conversations.push({
        id: convId,
        ...bufferStats,
        lastAccessed: new Date(this.conversationTimestamps.get(convId) || 0).toISOString(),
      });
      stats.totalMessages += bufferStats.messageCount;
      stats.totalExchanges += bufferStats.exchangeCount;
    }

    return stats;
  }

  /**
   * Clear all conversations
   */
  async clear(): Promise<void> {
    const count = this.conversations.size;
    this.conversations.clear();
    this.conversationTimestamps.clear();
    console.log(`[ConversationStore] 🧹 Cleared all ${count} buffers`);
  }

  /**
   * Get conversation count
   */
  size(): number {
    return this.conversations.size;
  }

  /**
   * Stop cleanup timer (for graceful shutdown)
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      console.log(`[ConversationStore] ⏹️ Cleanup timer stopped`);
    }
  }
}

// Export singleton instance
export const conversationStore = new ConversationStore();
