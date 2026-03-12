import { SearchRequest, SearchResponse } from '@/types/search.types';
export declare const searchApi: {
    searchResumes(params: SearchRequest): Promise<SearchResponse>;
    searchBm25(params: Omit<SearchRequest, "searchType">): Promise<SearchResponse>;
    searchVector(params: Omit<SearchRequest, "searchType">): Promise<SearchResponse>;
    searchHybrid(params: SearchRequest): Promise<SearchResponse>;
};
//# sourceMappingURL=search.api.d.ts.map