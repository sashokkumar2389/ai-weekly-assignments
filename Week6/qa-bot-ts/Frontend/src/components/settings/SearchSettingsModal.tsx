import { useUIStore } from "@/stores/uiStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { X } from "lucide-react";

export const SearchSettingsModal = () => {
    const { isSettingsModalOpen, closeSettingsModal } = useUIStore();
    const { searchType, topK, hybridVectorWeight, setSearchType, setTopK, setHybridVectorWeight, resetDefaults } =
        useSettingsStore();

    if (!isSettingsModalOpen) return null;

    const keywordWeight = 100 - hybridVectorWeight;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Search Settings
                    </h2>
                    <button
                        onClick={closeSettingsModal}
                        className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search Type */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Search Type
                    </h3>
                    <div className="space-y-2">
                        {["keyword", "vector", "hybrid"].map((type) => (
                            <label
                                key={type}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <input
                                    type="radio"
                                    name="searchType"
                                    value={type}
                                    checked={searchType === type}
                                    onChange={(e) =>
                                        setSearchType(
                                            e.target.value as "keyword" | "vector" | "hybrid"
                                        )
                                    }
                                    className="h-4 w-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {type}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {type === "keyword" &&
                                            "Exact text matching (BM25)"}
                                        {type === "vector" &&
                                            "Semantic similarity search"}
                                        {type === "hybrid" &&
                                            "Combined search (recommended)"}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Hybrid Weight Control */}
                {searchType === "hybrid" && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            Hybrid Search Balance
                        </h3>

                        {/* Weight Display */}
                        <div className="mb-4 flex items-center justify-between text-sm">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Vector (Semantic)</span>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {hybridVectorWeight}%
                                </span>
                            </div>
                            <div className="h-12 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Keyword (BM25)</span>
                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                    {keywordWeight}%
                                </span>
                            </div>
                        </div>

                        {/* Slider */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="25"
                            value={hybridVectorWeight}
                            onChange={(e) => setHybridVectorWeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-blue-500 cursor-pointer"
                        />

                        {/* Quick Select Buttons */}
                        <div className="mt-4 flex gap-2 justify-between">
                            {[0, 25, 50, 75, 100].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => setHybridVectorWeight(value)}
                                    className={`flex-1 py-2 px-2 rounded text-xs font-semibold transition-colors ${hybridVectorWeight === value
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {value === 0 && "KW"}
                                    {value === 25 && "25V"}
                                    {value === 50 && "50/50"}
                                    {value === 75 && "75V"}
                                    {value === 100 && "Vec"}
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                            {hybridVectorWeight === 0 && "Pure keyword search: Exact text matching only"}
                            {hybridVectorWeight === 25 && "Mostly keyword with light semantic understanding"}
                            {hybridVectorWeight === 50 && "Balanced: Equal weight for exact and semantic match"}
                            {hybridVectorWeight === 75 && "Mostly semantic with keyword precision"}
                            {hybridVectorWeight === 100 && "Pure semantic search: Similarity-based matching"}
                        </p>
                    </div>
                )}

                {/* Top K */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Number of Results
                    </h3>
                    <select
                        value={topK}
                        onChange={(e) => setTopK(parseInt(e.target.value))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                                {n} result{n !== 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => resetDefaults()}
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Reset Defaults
                    </button>
                    <button
                        onClick={closeSettingsModal}
                        className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};
