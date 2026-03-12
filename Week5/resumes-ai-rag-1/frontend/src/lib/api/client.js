import axios from 'axios';
import toast from 'react-hot-toast';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
apiClient.interceptors.request.use((config) => {
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
}, (error) => Promise.reject(error));
// Response interceptor
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || 'An error occurred';
        if (status === 404) {
            toast.error(`Not found: ${message}`);
        }
        else if (status === 500) {
            toast.error('Server error. Please try again later.');
        }
        else if (status === 422 || status === 400) {
            toast.error(`Invalid request: ${message}`);
        }
        else {
            toast.error(message);
        }
    }
    else if (error.request) {
        toast.error('Network error. Check your connection.');
    }
    else {
        toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
});
export default apiClient;
//# sourceMappingURL=client.js.map