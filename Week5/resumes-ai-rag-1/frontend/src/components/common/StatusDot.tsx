import { Circle } from 'lucide-react';

export function StatusDot() {
  return (
    <div className="flex items-center gap-1">
      <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-status-pulse" />
      <span className="text-xs text-text-muted">Online</span>
    </div>
  );
}
