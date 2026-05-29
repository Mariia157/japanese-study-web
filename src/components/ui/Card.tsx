import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative bg-surface border border-border",
        className
      )}
      {...props}
    />
  );
}

/** Decorative tri-color band that lives at the top of a Card */
export function CardBand({ variant = "tri" }: { variant?: "tri" | "wave" | "dot" }) {
  if (variant === "wave") return <div className="wave-band" aria-hidden />;
  if (variant === "dot") return <div className="dot-band" aria-hidden />;
  return <div className="tri-band" aria-hidden />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-5", className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-bold text-lg tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted mt-1", className)} {...props} />;
}
