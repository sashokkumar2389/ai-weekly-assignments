import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { HealthResponse } from "../types";

export const useHealthCheck = () => {
    return useQuery({
        queryKey: ["health"],
        queryFn: async () => {
            const response = await apiClient.get<HealthResponse>(ENDPOINTS.HEALTH);
            return response.data;
        },
        refetchInterval: 30 * 1000,
        retry: 3,
    });
};
