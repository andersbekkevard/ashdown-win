import { RecordMatchForm } from "@/components/record-match-form";

export const dynamic = "force-dynamic";

export default function NewMatchPage() {
  return (
    <>
      <h1 className="shout">Record a match</h1>
      <RecordMatchForm />
    </>
  );
}
