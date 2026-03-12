"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SearchService_1 = require("../services/SearchService");
const LLMService_1 = require("../services/LLMService");
const ResumeRepository_1 = require("../repositories/ResumeRepository");
const validators_1 = require("../middleware/validators");
const requestHandler_1 = require("../utils/requestHandler");
const responseFormatter_1 = require("../utils/responseFormatter");
const router = (0, express_1.Router)();
const searchService = new SearchService_1.SearchService();
const llmService = new LLMService_1.LLMService();
const resumeRepository = new ResumeRepository_1.ResumeRepository();
// BM25 Search Endpoint
router.post('/bm25', validators_1.validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;
    if (!(0, requestHandler_1.validateAndRespond)(filters, res))
        return;
    try {
        const { result: results, durationMs } = await (0, requestHandler_1.measureTime)(() => searchService.bm25Search(query, filters, topK));
        res.json((0, responseFormatter_1.formatBM25Response)(results, { query, durationMs }));
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('BM25 search failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// Simple Search Endpoint (Fallback without text index)
router.post('/simple', validators_1.validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;
    if (!(0, requestHandler_1.validateAndRespond)(filters, res))
        return;
    try {
        const { result: results, durationMs } = await (0, requestHandler_1.measureTime)(() => resumeRepository.simpleSearch(query, filters, topK));
        res.json((0, responseFormatter_1.formatBM25Response)(results, { query, durationMs }));
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Simple search failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// Vector Search Endpoint
router.post('/vector', validators_1.validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;
    if (!(0, requestHandler_1.validateAndRespond)(filters, res))
        return;
    try {
        const { result: results, durationMs } = await (0, requestHandler_1.measureTime)(() => searchService.vectorSearch(query, filters, topK));
        res.json((0, responseFormatter_1.formatVectorResponse)(results, { query, durationMs }));
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Vector search failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// Hybrid Search Endpoint
router.post('/hybrid', validators_1.validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;
    if (!(0, requestHandler_1.validateAndRespond)(filters, res))
        return;
    try {
        const { result: results, durationMs } = await (0, requestHandler_1.measureTime)(() => searchService.hybridSearch(query, filters, { topK }));
        res.json((0, responseFormatter_1.formatHybridResponse)(results.bm25Results, results.vectorResults, { durationMs }));
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Hybrid search failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// LLM Re-Ranking Endpoint
router.post('/rerank', async (req, res) => {
    const { query, candidates, topK = 8 } = req.body;
    if (!candidates || candidates.length === 0) {
        return res.status(400).json((0, responseFormatter_1.formatErrorResponse)('No candidates provided', 'candidates array is required'));
    }
    try {
        const { result, durationMs } = await (0, requestHandler_1.measureTime)(() => llmService.rerankCandidates(query, candidates, topK));
        res.json({
            method: 'rerank',
            query,
            candidatesCount: candidates.length,
            resultCount: result.rankedCandidates.length,
            durationMs,
            rankedCandidates: result.rankedCandidates
        });
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Re-ranking failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// Summarization Endpoint
router.post('/summarize', validators_1.validateSummarizeRequest, async (req, res) => {
    const { query, candidate, style = 'short', maxTokens } = req.body;
    try {
        const { result: { summary, score }, durationMs } = await (0, requestHandler_1.measureTime)(() => llmService.summarizeCandidateFit(query, candidate, { style, maxTokens }));
        res.json({
            method: 'summarize',
            query,
            resumeId: candidate.resumeId || candidate._id,
            style,
            score,
            durationMs,
            summary
        });
    }
    catch (error) {
        res.status(500).json((0, responseFormatter_1.formatErrorResponse)('Summarization failed', (0, requestHandler_1.getErrorMessage)(error)));
    }
});
// End-to-End Search Pipeline - Redesigned response format
router.post('/', validators_1.validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters, options = {}, searchType, bm25Weight, vectorWeight } = req.body;
    if (!(0, requestHandler_1.validateAndRespond)(filters, res))
        return;
    try {
        const { result: searchData, durationMs } = await (0, requestHandler_1.measureTime)(() => searchService.endToEndSearch(query, filters, {
            ...options,
            topK,
            searchType: searchType || 'hybrid',
            bm25Weight: bm25Weight || 0.5,
            vectorWeight: vectorWeight || 0.5,
            summarize: options.summarize || false,
            summarizeStyle: options.summarizeStyle || 'short',
            summarizeMaxTokens: options.summarizeMaxTokens || 150
        }));
        res.json({
            ok: true,
            query,
            counts: searchData.counts,
            rerankUsed: searchData.rerankUsed,
            componentTimings: searchData.componentTimings,
            results: searchData.results
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: (0, requestHandler_1.getErrorMessage)(error),
            query,
            results: []
        });
    }
});
exports.default = router;
