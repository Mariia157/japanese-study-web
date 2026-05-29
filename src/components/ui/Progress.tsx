import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-primary-soft overflow-hidden", className)}>
      <div
        className={cn("h-full bg-primary rounded-full transition-all duration-300", barClassName)}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
