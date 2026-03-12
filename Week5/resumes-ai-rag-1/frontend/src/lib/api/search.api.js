import apiClient from './client';
export const searchApi = {
    async searchResumes(params) {
        const response = await apiClient.post('/v1/search', params);
        return response.data;
    },
    async searchBm25(params) {
        const response = await apiClient.post('/v1/search/bm25', params);
        return response.data;
    },
    async searchVector(params) {
        const response = await apiClient.post('/v1/search/vector', params);
        return response.data;
    },
    async searchHybrid(params) {
        const response = await apiClient.post('/v1/search/hybrid', params);
        return response.data;
    },
};
//# sourceMappingURL=search.api.js.map