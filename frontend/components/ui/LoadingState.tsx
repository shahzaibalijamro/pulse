export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-80 items-center justify-center text-sm text-slate-500">
      <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-pulse-500" />
      {label}
    </div>
  );
}
