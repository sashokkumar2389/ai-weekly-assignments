import { create } from 'zustand';
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

export const useSearchStore = create<SearchState>((set) => ({
    searchType: 'vector',
    bm25Weight: 50,
    vectorWeight: 50,
    topK: 5,
    results: [],
    isSearching: false,
    lastQuery: '',
    searchDuration: 0,
    bm25Count: 0,
    vectorCount: 0,
    mergedCount: 0,
    rerankUsed: false,
    setSearchType: (mode) => set({ searchType: mode }),
    setWeights: (bm25, vector) => set({ bm25Weight: bm25, vectorWeight: vector }),
    setTopK: (k) => set({ topK: k }),
    setResults: (results, query, duration, bm25Count = 0, vectorCount = 0, mergedCount = 0, rerankUsed = false) => set({ results, lastQuery: query, searchDuration: duration, bm25Count, vectorCount, mergedCount, rerankUsed }),
    setSearching: (v) => set({ isSearching: v }),
    clearResults: () => set({ results: [], lastQuery: '', searchDuration: 0, bm25Count: 0, vectorCount: 0, mergedCount: 0, rerankUsed: false }),
}));
