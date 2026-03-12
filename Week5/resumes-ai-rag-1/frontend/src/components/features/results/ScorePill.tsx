import { Badge } from '@/components/ui/badge';
import { SearchMode } from '@/types/search.types';
import { formatScore } from '@/lib/utils/formatters';
import { getScoreLabel } from '@/lib/utils/constants';

interface ScorePillProps {
  score: number;
  searchType: SearchMode;
}

export function ScorePill({ score, searchType }: ScorePillProps) {
  return (
    <Badge variant={searchType as any} className="font-mono">
      {formatScore(score)} {getScoreLabel(searchType).split(' ')[0]}
    </Badge>
  );
}
