import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-md border border-hairline bg-canvas shadow-level3",
        "dark:border-white/[0.06] dark:bg-card",
        "transition-[box-shadow,border-color] duration-200",
        className
      )}
      {...props}
    />
  );
}

