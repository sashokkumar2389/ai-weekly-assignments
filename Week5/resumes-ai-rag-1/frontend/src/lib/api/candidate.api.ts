import apiClient from './client';
import { CandidateProfile } from '@/types/candidate.types';

export const candidateApi = {
  async getCandidate(id: string): Promise<CandidateProfile> {
    const response = await apiClient.get(`/v1/candidate/${id}`);
    return response.data;
  },
};
