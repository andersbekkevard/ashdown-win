import { RecordMatchForm } from "@/components/record-match-form";

export const dynamic = "force-dynamic";

export default function NewMatchPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Record match</h1>
      <RecordMatchForm />
    </div>
  );
}
