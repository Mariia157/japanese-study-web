import { Check } from "lucide-react";

export function InQueueBadge({ added, addedLabel = "Added to deck", inDeckLabel = "In your deck" }: { added: boolean; addedLabel?: string; inDeckLabel?: string }) {
  if (added) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-navy text-white text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        {addedLabel}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-soft text-primary text-xs font-medium">
      <Check className="w-3.5 h-3.5" />
      {inDeckLabel}
    </div>
  );
}
