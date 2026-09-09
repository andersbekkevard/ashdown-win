import { RecordMatchForm } from "@/components/record-match-form";
import { playerRoster } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewMatchPage() {
  const roster = (await playerRoster()).map((p) => ({ id: p.id, name: p.name }));
  return (
    <>
      <h1 className="shout">Record a match</h1>
      <RecordMatchForm roster={roster} />
    </>
  );
}
