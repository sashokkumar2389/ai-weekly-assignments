import { useCallback } from 'react';
import { searchApi } from '@/lib/api/search.api';
import { useSearchStore } from '@/lib/stores/search.store';
import { useChatStore } from '@/lib/stores/chat.store';
import { SearchMode } from '@/types/search.types';
import { ResultsCompactCard } from '@/components/features/results/ResultsCompactCard';

export function useSearch() {
    const { searchType, bm25Weight, vectorWeight, topK, setSearching, setResults } =
        useSearchStore();
    const { addUserMessage, addBotMessage } = useChatStore();

    const submitQuery = useCallback(
        async (query: string) => {
            if (!query.trim()) return;

            addUserMessage(query);
            setSearching(true);

            try {
                const searchTypeMap: Record<SearchMode, 'vector' | 'keyword' | 'hybrid'> = {
                    vector: 'vector',
                    bm25: 'keyword',
                    hybrid: 'hybrid',
                };

                const data = await searchApi.searchResumes({
                    query: query.trim(),
                    searchType: searchTypeMap[searchType],
                    topK,
                    bm25Weight: bm25Weight / 100,
                    vectorWeight: vectorWeight / 100,
                });

                const totalApiTime =
                    data.componentTimings.bm25Ms +
                    data.componentTimings.vectorMs +
                    data.componentTimings.rerankMs;

                setResults(
                    data.results,
                    data.query,
                    totalApiTime,
                    data.counts.bm25,
                    data.counts.vector,
                    data.counts.merged,
                    data.rerankUsed
                );

                const card = ResultsCompactCard({
                    results: data.results,
                    query: data.query,
                    searchType: searchType,
                    duration: totalApiTime,
                    rerankUsed: data.rerankUsed,
                });

                addBotMessage(card);
            } catch (error) {
                console.error('Search error:', error);
                addBotMessage('Search failed. Please try again.');
            } finally {
                setSearching(false);
            }
        },
        [
            searchType,
            bm25Weight,
            vectorWeight,
            topK,
            setSearching,
            setResults,
            addUserMessage,
            addBotMessage,
        ]
    );

    return { submitQuery };
}
