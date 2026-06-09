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
    <div className="grid grid-cols-3 rounded-sm border border-hairline dark:border-white/[0.08] bg-canvas dark:bg-white/[0.03] p-0.5 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-sm px-3 font-mono text-xs font-medium text-mute transition-colors",
            value === option.value
              ? "bg-[#171717] text-white dark:bg-white dark:text-black"
              : "hover:bg-canvas-soft-2 dark:hover:bg-white/[0.06] hover:text-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}


