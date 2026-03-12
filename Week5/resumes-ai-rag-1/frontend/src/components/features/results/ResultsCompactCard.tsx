import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SearchResult, SearchMode } from '@/types/search.types';

interface ResultsCompactCardProps {
  results: SearchResult[];
  query: string;
  searchType: SearchMode;
  duration: number;
  rerankUsed: boolean;
}

const getTierEmoji = (tier: string): string => {
  switch (tier.toUpperCase()) {
    case 'EXCEPTIONAL':
      return '🌟';
    case 'STRONG':
      return '✨';
    case 'GOOD':
      return '👍';
    default:
      return '•';
  }
};

const getRecommendationText = (recommendation: string): string => {
  if (recommendation.toLowerCase().includes('strong')) {
    return '✅ Strong interview candidate';
  }
  if (recommendation.toLowerCase().includes('worth')) {
    return '✅ Worth considering';
  }
  if (recommendation.toLowerCase().includes('screening')) {
    return '✅ Requires screening call';
  }
  return `✅ ${recommendation}`;
};

const searchTypeLabels: Record<SearchMode, string> = {
  vector: 'Vector',
  bm25: 'BM25',
  hybrid: 'Hybrid',
};

export function ResultsCompactCard({
  results,
  query,
  searchType,
  duration,
  rerankUsed,
}: ResultsCompactCardProps) {
  const totalTime = duration;
  const displayResults = results.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-white/[0.08] bg-gradient-to-br from-background to-background/50">
        <div className="p-6 space-y-0">
          {/* Header */}
          <div className="pb-4 mb-4 border-b border-white/[0.08]">
            <h3 className="text-base font-semibold text-text-primary">
              🔍 &quot;{query}&quot; - {results.length} Results Found
            </h3>
          </div>

          {/* Results Grid */}
          <div className="space-y-2">
            {displayResults.map((result, idx) => {
              const emoji = getTierEmoji(result.tier);
              const isPrimary = idx === 0;

              return (
                <div
                  key={result.resumeId || idx}
                  className={`text-sm transition-colors px-3 py-2 rounded ${isPrimary
                    ? 'bg-white/[0.05] border border-primary/20'
                    : 'hover:bg-white/[0.02]'
                    }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          #{idx + 1}
                        </span>
                        <span className="text-primary font-semibold">
                          [{result.score}]
                        </span>
                        <span className="text-xs uppercase tracking-wide text-text-muted">
                          {result.tier}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 line-clamp-1">
                        {result.keyMatches.join(' • ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-green-400 ml-7">
                    {getRecommendationText(result.recommendations)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <div className="text-xs text-text-muted flex items-center justify-between">
              <span>
                ⏱️ {searchTypeLabels[searchType]} · {Math.round(totalTime)}ms
              </span>
              <span>
                {rerankUsed ? '🤖 AI Reranked ✓' : ''}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
