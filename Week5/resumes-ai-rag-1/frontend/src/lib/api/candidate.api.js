import apiClient from './client';
export const candidateApi = {
    async getCandidate(id) {
        const response = await apiClient.get(`/v1/candidate/${id}`);
        return response.data;
    },
};
//# sourceMappingURL=candidate.api.js.map