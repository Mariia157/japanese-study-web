"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
