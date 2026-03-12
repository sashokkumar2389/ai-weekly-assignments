import { create } from 'zustand';
export const useSearchStore = create((set) => ({
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
//# sourceMappingURL=search.store.js.map