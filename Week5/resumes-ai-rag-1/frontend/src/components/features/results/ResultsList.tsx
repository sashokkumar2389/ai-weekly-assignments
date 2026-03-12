import { SearchResult, SearchMode } from '@/types/search.types';
import { ResultSummary } from './ResultSummary';
import { ResultCard } from './ResultCard';
import { EmptyState } from '@/components/common/EmptyState';

interface ResultsListProps {
    results: SearchResult[];
    searchType: SearchMode;
    duration: number;
    query: string;
    onSelectCandidate: (candidateId: string) => void;
}

export function ResultsList({
    results,
    searchType,
    duration,
    query,
    onSelectCandidate,
}: ResultsListProps) {
    if (!results || results.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            <ResultSummary
                resultCount={results.length}
                searchType={searchType}
                duration={duration}
                query={query}
            />
            <div className="space-y-3">
                {results.map((result, idx) => (
                    <ResultCard
                        key={result.candidateId || result.resumeId || idx}
                        result={result}
                        rank={idx + 1}
                        searchType={searchType}
                        onSelect={onSelectCandidate}
                    />
                ))}
            </div>
        </div>
    );
}
