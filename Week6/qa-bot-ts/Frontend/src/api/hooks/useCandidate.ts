import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { CandidateProfile } from "../types";

export const useCandidate = (candidateId: string) => {
    return useQuery({
        queryKey: ["candidate", candidateId],
        queryFn: async () => {
            if (!candidateId) {
                throw new Error("Candidate ID is required");
            }
            const response = await apiClient.get<{ data: CandidateProfile }>(
                `${ENDPOINTS.CANDIDATE}/${candidateId}`
            );

            // Extract and validate the data
            const candidateData = response.data?.data;
            if (!candidateData) {
                console.error("Invalid response structure:", response.data);
                throw new Error("Server returned invalid candidate data");
            }

            return candidateData;
        },
        enabled: !!candidateId,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};
