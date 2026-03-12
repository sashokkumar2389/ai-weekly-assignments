import { jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@/components/ui/badge';
import { formatScore } from '@/lib/utils/formatters';
import { getScoreLabel } from '@/lib/utils/constants';
export function ScorePill({ score, searchType }) {
    return (_jsxs(Badge, { variant: searchType, className: "font-mono", children: [formatScore(score), " ", getScoreLabel(searchType).split(' ')[0]] }));
}
//# sourceMappingURL=ScorePill.js.map