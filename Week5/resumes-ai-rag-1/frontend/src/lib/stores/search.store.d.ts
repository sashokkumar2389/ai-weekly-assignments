import { SearchMode, SearchResult } from '@/types/search.types';
interface SearchState {
    searchType: SearchMode;
    bm25Weight: number;
    vectorWeight: number;
    topK: number;
    results: SearchResult[];
    isSearching: boolean;
    lastQuery: string;
    searchDuration: number;
    bm25Count: number;
    vectorCount: number;
    mergedCount: number;
    rerankUsed: boolean;
    setSearchType: (mode: SearchMode) => void;
    setWeights: (bm25: number, vector: number) => void;
    setTopK: (k: number) => void;
    setResults: (results: SearchResult[], query: string, duration: number, bm25Count?: number, vectorCount?: number, mergedCount?: number, rerankUsed?: boolean) => void;
    setSearching: (v: boolean) => void;
    clearResults: () => void;
}
export declare const useSearchStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SearchState>>;
export {};
//# sourceMappingURL=search.store.d.ts.map