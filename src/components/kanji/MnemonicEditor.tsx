"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, Save, X } from "lucide-react";

export function MnemonicEditor({ kanjiId, initial }: { kanjiId: number; initial: string }) {
  const [text, setText] = useState(initial);
  const [editing, setEditing] = useState(!initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/kanji/${kanjiId}/mnemonic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mnemonic: text }),
    });
    setSaving(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="space-y-3">
        <p className="text-sm whitespace-pre-wrap">{text || <span className="text-muted italic">No mnemonic yet.</span>}</p>
        <Button variant="soft" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Story / image that helps you remember this kanji…"
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={saving}>
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setText(initial); setEditing(false); }}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
