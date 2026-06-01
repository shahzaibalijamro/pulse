import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-pulse-600 text-white shadow-sm hover:bg-pulse-700",
        variant === "secondary" && "border border-slate-200 bg-white text-ink-900 hover:bg-slate-50",
        variant === "ghost" && "text-ink-700 hover:bg-slate-100",
        variant === "danger" && "border border-red-200 bg-white text-red-700 hover:bg-red-50",
        className
      )}
      {...props}
    />
  );
}
