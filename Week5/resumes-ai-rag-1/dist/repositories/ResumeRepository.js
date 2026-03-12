"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeRepository = void 0;
const mongodb_1 = require("mongodb");
const filterConverter_1 = require("../utils/filterConverter");
class ResumeRepository {
    constructor(mongoUri, dbName, collectionName) {
        this.connected = false;
        const actualUri = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const actualDbName = dbName || process.env.MONGODB_DB_NAME || 'resumes';
        const actualCollectionName = collectionName || process.env.MONGODB_COLLECTION || 'resumes';
        this.client = new mongodb_1.MongoClient(actualUri, {
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        this.dbName = actualDbName;
        this.collectionName = actualCollectionName;
    }
    async ensureConnected() {
        if (!this.connected) {
            try {
                await this.connect();
                await this.ensureTextIndex();
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`Failed to connect to MongoDB: ${message}`);
            }
        }
    }
    async ensureTextIndex() {
        try {
            const collection = this.client.db(this.dbName).collection(this.collectionName);
            // Check if text index exists
            const indexInfo = await collection.indexInformation();
            const hasTextIndex = Object.values(indexInfo).some((index) => {
                return index.key?.some((key) => key[0] === 'text');
            });
            if (!hasTextIndex) {
                // Create a text index on multiple fields
                await collection.createIndex({
                    text: 'text',
                    skills: 'text',
                    role: 'text',
                    experienceSummary: 'text'
                }, { name: 'text_index' });
                console.log('Text index created successfully');
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.warn(`Warning: Could not ensure text index: ${message}`);
        }
    }
    async connect() {
        if (!this.connected) {
            await this.client.connect();
            this.connected = true;
        }
    }
    async disconnect() {
        if (this.connected) {
            await this.client.close();
            this.connected = false;
        }
    }
    async create(resume) {
        await this.ensureConnected();
        const result = await this.client.db(this.dbName).collection(this.collectionName).insertOne(resume);
        return { ...resume, _id: result.insertedId };
    }
    async findById(id) {
        await this.ensureConnected();
        return await this.client.db(this.dbName).collection(this.collectionName).findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    async update(id, resume) {
        await this.ensureConnected();
        await this.client.db(this.dbName).collection(this.collectionName).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: resume });
        return this.findById(id);
    }
    async delete(id) {
        await this.ensureConnected();
        const result = await this.client.db(this.dbName).collection(this.collectionName).deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return result.deletedCount === 1;
    }
    async search(query, filters, topK = 10) {
        await this.ensureConnected();
        return this.bm25Search(query, filters, topK);
    }
    async bm25Search(query, filters, topK = 10) {
        // BM25 full-text search using MongoDB Atlas Search
        try {
            await this.ensureConnected();
            const collection = this.client.db(this.dbName).collection(this.collectionName);
            // Check if collection has data
            const totalDocs = await collection.countDocuments();
            console.log(`BM25 Search: Collection has ${totalDocs} documents, searching for "${query}"`);
            // Convert user-friendly filters to MongoDB query format
            const mongoFilters = (0, filterConverter_1.convertFilters)(filters);
            // Split multi-word queries into individual terms for better BM25 matching
            // MongoDB BM25 works better with individual keywords than full phrases
            const queryTerms = query
                .toLowerCase()
                .split(/\s+/)
                .filter(term => term.length > 0);
            const searchQuery = queryTerms.length > 1
                ? queryTerms.join(' ') // Multiple terms with implicit OR
                : query; // Single term as-is
            // Build aggregation pipeline for Atlas Search BM25
            const pipeline = [
                {
                    $search: {
                        bm25: {
                            query: searchQuery,
                            path: [
                                'text',
                                'skills',
                                'role',
                                'experienceSummary',
                                'name',
                                'company',
                                'location',
                                'email'
                            ]
                        }
                    }
                }
            ];
            // Add filters if provided
            if (mongoFilters && Object.keys(mongoFilters).length > 0) {
                console.log(`BM25 Search: Applying filters:`, JSON.stringify(mongoFilters));
                pipeline.push({ $match: mongoFilters });
            }
            // Add result limit
            pipeline.push({ $limit: topK });
            const results = await collection
                .aggregate(pipeline)
                .toArray();
            console.log(`BM25 Search: Returned ${results.length} results`);
            // If no results found with BM25, try falling back to simple search
            if (results.length === 0) {
                console.log(`BM25 Search: No results found, attempting fallback to simple search...`);
                return this.simpleSearch(query, filters, topK);
            }
            return results;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            if (message.includes('search not found') || message.includes('no such command') || message.includes('unrecognized pipeline stage')) {
                console.warn(`BM25 Search not available via Atlas Search index: ${message}`);
                console.warn('Falling back to simple regex search...');
                return this.simpleSearch(query, filters, topK);
            }
            console.error('BM25 search error:', message);
            // Fallback to simple search if Atlas Search is not available
            try {
                return await this.simpleSearch(query, filters, topK);
            }
            catch (fallbackError) {
                const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
                throw new Error(`BM25 search failed: ${fallbackMessage}`);
            }
        }
    }
    async simpleSearch(query, filters, topK = 10) {
        // Simple regex-based search (fallback when text index is unavailable)
        try {
            await this.ensureConnected();
            const collection = this.client.db(this.dbName).collection(this.collectionName);
            // Split multi-word queries into individual terms for better matching
            const queryTerms = query
                .toLowerCase()
                .split(/\s+/)
                .filter(term => term.length > 0);
            // Convert user-friendly filters to MongoDB query format
            const mongoFilters = (0, filterConverter_1.convertFilters)(filters);
            // Build $or query that matches ANY of the terms in searchable fields
            const orConditions = [];
            for (const term of queryTerms) {
                const termRegex = { $regex: term, $options: 'i' };
                orConditions.push({ text: termRegex }, { skills: termRegex }, { role: termRegex }, { experienceSummary: termRegex }, { name: termRegex }, { company: termRegex });
            }
            const searchQuery = {
                $or: orConditions.length > 0 ? orConditions : [{ text: { $exists: true } }]
            };
            // Apply additional filters if provided
            const finalQuery = mongoFilters && Object.keys(mongoFilters).length > 0
                ? { ...searchQuery, ...mongoFilters }
                : searchQuery;
            if (Object.keys(mongoFilters).length > 0) {
                console.log(`Simple Search: Applying filters:`, JSON.stringify(mongoFilters));
            }
            const results = await collection
                .find(finalQuery)
                .limit(topK)
                .toArray();
            console.log(`Simple Search: Returned ${results.length} results`);
            return results;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Simple search error:', message);
            throw new Error(`Simple search failed: ${message}`);
        }
    }
    async vectorSearch(embedding, filters, topK = 10) {
        // Vector similarity search using MongoDB Atlas Vector Search
        try {
            await this.ensureConnected();
            const collection = this.client.db(this.dbName).collection(this.collectionName);
            console.log(`Vector Search: Searching with embedding of ${embedding.length} dimensions, topK=${topK}`);
            // Convert user-friendly filters to MongoDB query format (outside try block for fallback access)
            const mongoFilters = (0, filterConverter_1.convertFilters)(filters);
            // MongoDB Atlas Vector Search aggregation pipeline with vectorSearch operator
            // This uses cosine similarity for semantic search (no knnBeta)
            const pipeline = [
                {
                    $search: {
                        cosmosSearch: {
                            vector: embedding,
                            k: topK
                        },
                        returnStoredSource: true
                    }
                },
                {
                    $project: {
                        similarityScore: { $meta: 'searchScore' },
                        document: '$$ROOT'
                    }
                }
            ];
            // Add filters if provided (must come after $search)
            if (mongoFilters && Object.keys(mongoFilters).length > 0) {
                console.log(`Vector Search: Applying filters:`, JSON.stringify(mongoFilters));
                pipeline.push({ $match: mongoFilters });
            }
            // Limit final results
            pipeline.push({ $limit: topK });
            const results = await collection.aggregate(pipeline).toArray();
            // Map results to Resume objects with similarity scores
            const mappedResults = results.map((r) => {
                const doc = r.document || r;
                return {
                    ...doc,
                    _id: doc._id,
                    resumeId: doc._id, // Ensure resumeId is set for compatibility
                    similarityScore: r.similarityScore
                };
            });
            console.log(`Vector Search: Returned ${mappedResults.length} results with cosine similarity`);
            return mappedResults;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Vector search error:', message);
            // Graceful fallback: Return documents without vector similarity scoring
            // This works when vector index is not available
            try {
                console.log('Vector Search: Falling back to simple document retrieval (no vector index)');
                await this.ensureConnected();
                const collection = this.client.db(this.dbName).collection(this.collectionName);
                // Use converted mongoFilters, not raw filters
                const mongoFilters = (0, filterConverter_1.convertFilters)(filters);
                const searchQuery = mongoFilters && Object.keys(mongoFilters).length > 0 ? mongoFilters : {};
                const results = await collection
                    .find(searchQuery)
                    .limit(topK)
                    .toArray();
                console.log(`Vector Search Fallback: Returned ${results.length} results`);
                return results.map((doc) => ({
                    ...doc,
                    _id: doc._id,
                    resumeId: doc._id
                }));
            }
            catch (fallbackError) {
                const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
                console.error('Vector search fallback error:', fallbackMessage);
                throw new Error(`Vector search failed: ${fallbackMessage}`);
            }
        }
    }
}
exports.ResumeRepository = ResumeRepository;
