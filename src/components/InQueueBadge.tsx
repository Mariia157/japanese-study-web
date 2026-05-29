import { Check, Sparkles } from "lucide-react";

export function InQueueBadge({ added }: { added: boolean }) {
  if (added) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-koi-gradient text-white text-xs font-medium shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        Added to deck
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-soft text-primary text-xs font-medium">
      <Check className="w-3.5 h-3.5" />
      In your deck
    </div>
  );
}
