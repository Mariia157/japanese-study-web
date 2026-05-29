import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export function ExercisePreviewCard({
  href,
  title,
  imageUrl,
  badge,
  startLabel,
}: {
  href: string;
  title: string;
  imageUrl?: string | null;
  badge?: string;
  startLabel: string;
}) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link href={href} className="group block">
        {imageUrl ? (
          <div className="relative w-full aspect-[16/9] bg-primary-soft">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            {badge && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-white">
                {badge}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary-soft to-primary-soft-2 flex items-center justify-center text-primary text-4xl">
            ★
          </div>
        )}
      </Link>
      <div className="flex-1 flex flex-col gap-3 p-4">
        <h3 className="font-semibold text-base line-clamp-2 flex-1">{title}</h3>
        <Link href={href}>
          <Button size="sm" className="w-full">
            <Sparkles className="w-4 h-4" />
            {startLabel}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
