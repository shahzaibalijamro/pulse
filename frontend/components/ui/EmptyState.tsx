import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.02] p-12 text-center shadow-level2">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {children ? <p className="mt-2 max-w-md text-sm text-body">{children}</p> : null}
    </div>
  );
}

