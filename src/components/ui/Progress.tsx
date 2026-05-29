import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
  emptyClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  emptyClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full overflow-hidden", emptyClassName ?? "bg-primary-soft", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-300", barClassName ?? "bg-primary")}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
