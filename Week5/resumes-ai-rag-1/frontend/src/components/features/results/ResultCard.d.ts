import { SearchResult, SearchMode } from '@/types/search.types';
interface ResultCardProps {
    result: SearchResult;
    rank: number;
    searchType: SearchMode;
    onSelect: (candidateId: string) => void;
}
export declare function ResultCard({ result, rank, searchType, onSelect }: ResultCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ResultCard.d.ts.map