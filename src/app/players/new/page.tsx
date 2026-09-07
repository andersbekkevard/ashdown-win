import { CreatePlayerForm } from "@/components/create-player-form";

export const dynamic = "force-dynamic";

export default async function NewPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string | string[] }>;
}) {
  const { name } = await searchParams;
  const initialName = typeof name === "string" ? name : "";
  return <CreatePlayerForm initialName={initialName} />;
}
