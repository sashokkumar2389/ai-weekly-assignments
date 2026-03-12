import { SearchResult, SearchMode } from '@/types/search.types';
interface ResultsListProps {
    results: SearchResult[];
    searchType: SearchMode;
    duration: number;
    query: string;
    onSelectCandidate: (candidateId: string) => void;
}
export declare function ResultsList({ results, searchType, duration, query, onSelectCandidate, }: ResultsListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ResultsList.d.ts.map