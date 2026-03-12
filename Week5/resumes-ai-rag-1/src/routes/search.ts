import { Router } from 'express';
import { SearchService } from '../services/SearchService';
import { LLMService } from '../services/LLMService';
import { ResumeRepository } from '../repositories/ResumeRepository';
import { validateSearchQuery, validateSummarizeRequest } from '../middleware/validators';
import { validateAndRespond, getErrorMessage, measureTime } from '../utils/requestHandler';
import { formatBM25Response, formatVectorResponse, formatHybridResponse, formatErrorResponse } from '../utils/responseFormatter';

const router = Router();
const searchService = new SearchService();
const llmService = new LLMService();
const resumeRepository = new ResumeRepository();

// BM25 Search Endpoint
router.post('/bm25', validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;

    if (!validateAndRespond(filters, res)) return;

    try {
        const { result: results, durationMs } = await measureTime(
            () => searchService.bm25Search(query, filters, topK)
        );
        res.json(formatBM25Response(results, { query, durationMs }));
    } catch (error) {
        res.status(500).json(formatErrorResponse('BM25 search failed', getErrorMessage(error)));
    }
});

// Simple Search Endpoint (Fallback without text index)
router.post('/simple', validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;

    if (!validateAndRespond(filters, res)) return;

    try {
        const { result: results, durationMs } = await measureTime(
            () => resumeRepository.simpleSearch(query, filters, topK)
        );
        res.json(formatBM25Response(results, { query, durationMs }));
    } catch (error) {
        res.status(500).json(formatErrorResponse('Simple search failed', getErrorMessage(error)));
    }
});

// Vector Search Endpoint
router.post('/vector', validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;

    if (!validateAndRespond(filters, res)) return;

    try {
        const { result: results, durationMs } = await measureTime(
            () => searchService.vectorSearch(query, filters, topK)
        );
        res.json(formatVectorResponse(results, { query, durationMs }));
    } catch (error) {
        res.status(500).json(formatErrorResponse('Vector search failed', getErrorMessage(error)));
    }
});

// Hybrid Search Endpoint
router.post('/hybrid', validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters } = req.body;

    if (!validateAndRespond(filters, res)) return;

    try {
        const { result: results, durationMs } = await measureTime(
            () => searchService.hybridSearch(query, filters, { topK })
        );
        res.json(formatHybridResponse(results.bm25Results, results.vectorResults, { durationMs }));
    } catch (error) {
        res.status(500).json(formatErrorResponse('Hybrid search failed', getErrorMessage(error)));
    }
});

// LLM Re-Ranking Endpoint
router.post('/rerank', async (req, res) => {
    const { query, candidates, topK = 8 } = req.body;

    if (!candidates || candidates.length === 0) {
        return res.status(400).json(formatErrorResponse('No candidates provided', 'candidates array is required'));
    }

    try {
        const { result, durationMs } = await measureTime(
            () => llmService.rerankCandidates(query, candidates, topK)
        );
        res.json({
            method: 'rerank',
            query,
            candidatesCount: candidates.length,
            resultCount: result.rankedCandidates.length,
            durationMs,
            rankedCandidates: result.rankedCandidates
        });
    } catch (error) {
        res.status(500).json(formatErrorResponse('Re-ranking failed', getErrorMessage(error)));
    }
});

// Summarization Endpoint
router.post('/summarize', validateSummarizeRequest, async (req, res) => {
    const { query, candidate, style = 'short', maxTokens } = req.body;

    try {
        const { result: { summary, score }, durationMs } = await measureTime(
            () => llmService.summarizeCandidateFit(query, candidate, { style, maxTokens })
        );
        res.json({
            method: 'summarize',
            query,
            resumeId: candidate.resumeId || candidate._id,
            style,
            score,
            durationMs,
            summary
        });
    } catch (error) {
        res.status(500).json(formatErrorResponse('Summarization failed', getErrorMessage(error)));
    }
});

// End-to-End Search Pipeline - Redesigned response format
router.post('/', validateSearchQuery, async (req, res) => {
    const { query, topK = 10, filters, options = {}, searchType, bm25Weight, vectorWeight } = req.body;

    if (!validateAndRespond(filters, res)) return;

    try {
        const { result: searchData, durationMs } = await measureTime(
            () => searchService.endToEndSearch(query, filters, {
                ...options,
                topK,
                searchType: searchType || 'hybrid',
                bm25Weight: bm25Weight || 0.5,
                vectorWeight: vectorWeight || 0.5,
                summarize: options.summarize || false,
                summarizeStyle: options.summarizeStyle || 'short',
                summarizeMaxTokens: options.summarizeMaxTokens || 150
            })
        );

        res.json({
            ok: true,
            query,
            counts: searchData.counts,
            rerankUsed: searchData.rerankUsed,
            componentTimings: searchData.componentTimings,
            results: searchData.results
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: getErrorMessage(error),
            query,
            results: []
        });
    }
});

export default router;