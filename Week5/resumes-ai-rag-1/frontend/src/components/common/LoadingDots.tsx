export function LoadingDots() {
  return (
    <div className="flex gap-1 items-center">
      <span className="h-2 w-2 bg-primary rounded-full animate-dot-bounce" />
      <span className="h-2 w-2 bg-primary rounded-full animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
      <span className="h-2 w-2 bg-primary rounded-full animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}
