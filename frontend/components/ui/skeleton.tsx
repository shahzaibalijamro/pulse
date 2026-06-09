import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-md bg-[#3e3e3e45]", className)} {...props} />;
}

export { Skeleton };
