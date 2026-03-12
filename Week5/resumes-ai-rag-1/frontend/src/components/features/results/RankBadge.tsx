interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  const bgColor =
    rank <= 3
      ? 'bg-gradient-to-br from-primary to-accent text-white'
      : 'bg-white/[0.05] text-text-muted';

  return (
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${bgColor} flex-shrink-0`}
    >
      #{rank}
    </div>
  );
}
