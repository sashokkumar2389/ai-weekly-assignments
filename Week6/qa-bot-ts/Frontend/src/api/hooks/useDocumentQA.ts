import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import { DocumentQARequest, DocumentQAResponse } from "../types";

export const useDocumentQA = () => {
    return useMutation({
        mutationFn: async (params: DocumentQARequest) => {
            const response = await apiClient.post<DocumentQAResponse>(
                ENDPOINTS.DOCUMENT_QA,
                params
            );
            return response.data;
        },
    });
};
