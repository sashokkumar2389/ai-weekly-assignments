import { cn } from "@/lib/utils";

interface MatchTypeBadgeProps {
  matchType: "keyword" | "vector" | "hybrid";
  className?: string;
}

export const MatchTypeBadge = ({ matchType, className }: MatchTypeBadgeProps) => {
  const colorMap = {
    keyword: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    vector:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    hybrid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const labelMap = {
    keyword: "Keyword",
    vector: "Vector",
    hybrid: "Hybrid",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colorMap[matchType],
        className
      )}
    >
      {labelMap[matchType]}
    </div>
  );
};
