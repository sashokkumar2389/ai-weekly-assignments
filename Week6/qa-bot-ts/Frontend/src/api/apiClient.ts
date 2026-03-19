import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "@/hooks/useToast";

// Create toast function if not already imported
const showCriticalToast = (message: string) => {
    console.error(message);
};

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for error classification
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 503) {
            showCriticalToast("Service unavailable. Please try again later.");
        }
        if (!error.response) {
            showCriticalToast("Network connection lost. Check your connection.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
