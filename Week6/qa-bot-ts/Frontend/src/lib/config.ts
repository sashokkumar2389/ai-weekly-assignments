import { QueryClient } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

const config: QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
        mutations: {
            retry: 1,
        },
    },
};

export const createQueryClient = (): QueryClient => {
    return new QueryClient(config);
};
