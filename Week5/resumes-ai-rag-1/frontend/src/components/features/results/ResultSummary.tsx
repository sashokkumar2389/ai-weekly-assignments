import { Badge } from '@/components/ui/badge';
import { SearchMode } from '@/types/search.types';
import { formatDuration } from '@/lib/utils/formatters';

interface ResultSummaryProps {
    resultCount: number;
    searchType: SearchMode;
    duration: number;
    query: string;
}

export function ResultSummary({
    resultCount,
    searchType,
    duration,
    query,
}: ResultSummaryProps) {
    const modeLabels: Record<SearchMode, string> = {
        vector: 'Vector Search',
        bm25: 'BM25 Keyword',
        hybrid: 'Hybrid Search',
    };

    return (
        <div className="text-xs text-text-muted space-y-2">
            <p>
                Found <span className="text-text-primary font-semibold">{resultCount}</span> candidate
                {resultCount !== 1 ? 's' : ''} ·
                <Badge variant={searchType as any} className="ml-2 inline">
                    {modeLabels[searchType]}
                </Badge>
                {' '}· {formatDuration(duration)}
            </p>
            <p className="text-text-muted italic">Query: "{query}"</p>
        </div>
    );
}
