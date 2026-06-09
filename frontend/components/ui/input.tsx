import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-hairline dark:border-white/[0.08] bg-canvas dark:bg-white/[0.03] px-3 py-2 text-sm text-ink file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mute focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink dark:focus-visible:ring-white/20 dark:focus-visible:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


