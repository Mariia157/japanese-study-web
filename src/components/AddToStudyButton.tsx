"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Plus } from "lucide-react";

export function AddToStudyButton({
  itemType,
  itemId,
  inQueue,
  size = "sm",
}: {
  itemType: "kanji" | "vocab" | "grammar";
  itemId: number;
  inQueue: boolean;
  size?: "sm" | "md";
}) {
  const [added, setAdded] = useState(inQueue);
  const [loading, setLoading] = useState(false);

  async function add() {
    setLoading(true);
    await fetch("/api/srs/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, itemId }),
    });
    setAdded(true);
    setLoading(false);
  }

  if (added) {
    return (
      <Button variant="soft" size={size} disabled>
        <Check className="w-4 h-4" />
        In queue
      </Button>
    );
  }
  return (
    <Button variant="outline" size={size} onClick={add} disabled={loading}>
      <Plus className="w-4 h-4" />
      Study
    </Button>
  );
}
