"use client";

import type { DatePreset } from "@/lib/types";
import { cn } from "@/lib/utils";

const options: Array<{ value: DatePreset; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" }
];

export function DateRangePicker({ value, onChange }: { value: DatePreset; onChange: (value: DatePreset) => void }) {
  return (
    <div className="grid grid-cols-3 rounded-md border border-slate-200 bg-white p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-8 rounded px-3 text-sm font-medium text-slate-600 transition",
            value === option.value && "bg-ink-950 text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
