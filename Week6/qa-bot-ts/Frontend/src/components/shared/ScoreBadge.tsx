import { cn, getScoreBadgeColor, formatScore } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export const ScoreBadge = ({ score, className }: ScoreBadgeProps) => {
  const color = getScoreBadgeColor(score);
  const colorMap = {
    green:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colorMap[color],
        className
      )}
      title={`Relevance score: ${formatScore(score)}%`}
    >
      {formatScore(score)}%
    </div>
  );
};
