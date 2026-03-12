import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { RankBadge } from './RankBadge';
import { ScorePill } from './ScorePill';
import { SearchResult, SearchMode } from '@/types/search.types';
import { truncateText } from '@/lib/utils/formatters';

interface ResultCardProps {
  result: SearchResult;
  rank: number;
  searchType: SearchMode;
  onSelect: (candidateId: string) => void;
}

export function ResultCard({ result, rank, searchType, onSelect }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
    >
      <Card
        className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-white/[0.12]"
        onClick={() => onSelect(result.candidateId || result.resumeId || '')}
      >
        <div className="p-4 space-y-3">
          {/* Header: Rank, Tier/Score */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <RankBadge rank={rank} />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary truncate">
                  Candidate #{rank}
                </h3>
                <p className="text-xs text-text-muted">{result.tier}</p>
              </div>
            </div>
            <ScorePill score={result.score} searchType={searchType} />
          </div>

          {/* Key Matches */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-muted">Key Matches:</p>
            <div className="flex flex-wrap gap-1">
              {result.keyMatches.map((match, idx) => (
                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {match}
                </span>
              ))}
            </div>
          </div>

          {/* Rationale */}
          <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
            {truncateText(result.rationale, 200)}
          </p>

          {/* Gaps (if any) */}
          {result.gaps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-muted">Gaps:</p>
              <ul className="text-xs text-red-400 list-disc list-inside space-y-0.5">
                {result.gaps.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
