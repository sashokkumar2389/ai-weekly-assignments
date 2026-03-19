import { create } from "zustand";

interface SettingsState {
    searchType: "keyword" | "vector" | "hybrid";
    topK: number;
    hybridVectorWeight: number;

    setSearchType: (type: "keyword" | "vector" | "hybrid") => void;
    setTopK: (k: number) => void;
    setHybridVectorWeight: (weight: number) => void;
    resetDefaults: () => void;
}

const DEFAULT_SEARCH_TYPE: "keyword" | "vector" | "hybrid" = "hybrid";
const DEFAULT_TOP_K = 5;
const DEFAULT_HYBRID_VECTOR_WEIGHT = 50;

export const useSettingsStore = create<SettingsState>((set) => ({
    searchType: DEFAULT_SEARCH_TYPE,
    topK: DEFAULT_TOP_K,
    hybridVectorWeight: DEFAULT_HYBRID_VECTOR_WEIGHT,

    setSearchType: (type) => set({ searchType: type }),
    setTopK: (k) => set({ topK: Math.min(Math.max(k, 1), 10) }),
    setHybridVectorWeight: (weight) =>
        set({ hybridVectorWeight: Math.min(Math.max(weight, 0), 100) }),
    resetDefaults: () =>
        set({
            searchType: DEFAULT_SEARCH_TYPE,
            topK: DEFAULT_TOP_K,
            hybridVectorWeight: DEFAULT_HYBRID_VECTOR_WEIGHT,
        }),
}));
