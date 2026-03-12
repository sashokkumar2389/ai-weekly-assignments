import apiClient from './client';
import { SearchRequest, SearchResponse } from '@/types/search.types';

export const searchApi = {
    async searchResumes(params: SearchRequest): Promise<SearchResponse> {
        const response = await apiClient.post('/v1/search', params);
        return response.data;
    },

    async searchBm25(params: Omit<SearchRequest, 'searchType'>): Promise<SearchResponse> {
        const response = await apiClient.post('/v1/search/bm25', params);
        return response.data;
    },

    async searchVector(params: Omit<SearchRequest, 'searchType'>): Promise<SearchResponse> {
        const response = await apiClient.post('/v1/search/vector', params);
        return response.data;
    },

    async searchHybrid(params: SearchRequest): Promise<SearchResponse> {
        const response = await apiClient.post('/v1/search/hybrid', params);
        return response.data;
    },
};
