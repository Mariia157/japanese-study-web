import { getReviewQueue } from "@/lib/srs/queue";
import { ReviewSession } from "@/components/srs/ReviewSession";
import { Card, CardBody } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const queue = await getReviewQueue(30);

  if (queue.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody className="text-center py-16 space-y-3">
            <div className="text-5xl">🌸</div>
            <h2 className="text-xl font-semibold">Nothing due right now</h2>
            <p className="text-muted text-sm">
              Add new vocabulary, kanji, or grammar to your study queue from their pages.
              Come back tomorrow for scheduled reviews.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ReviewSession
        initial={queue.map((q) => ({
          cardId: q.cardId,
          itemType: q.itemType,
          itemId: q.itemId,
          state: q.state,
          payload: q.payload,
        }))}
      />
    </div>
  );
}
