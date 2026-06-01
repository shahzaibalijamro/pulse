import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      {children ? <p className="mt-2 max-w-md text-sm text-slate-500">{children}</p> : null}
    </div>
  );
}
