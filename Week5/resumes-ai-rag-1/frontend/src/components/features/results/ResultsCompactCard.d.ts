import { SearchResult, SearchMode } from '@/types/search.types';
interface ResultsCompactCardProps {
    results: SearchResult[];
    query: string;
    searchType: SearchMode;
    duration: number;
    rerankUsed: boolean;
}
export declare function ResultsCompactCard({ results, query, searchType, duration, rerankUsed, }: ResultsCompactCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ResultsCompactCard.d.ts.map