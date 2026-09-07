"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createPlayer, type ActionResult } from "@/app/actions";
import { MAX_NAME_LENGTH } from "@/lib/config";

type State = ActionResult<{ id: number; name: string }> | null;

export function CreatePlayerForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await createPlayer(formData.get("name"));
      if (result.ok) {
        router.push(`/players/${result.value.id}`);
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span>Full name</span>
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          maxLength={MAX_NAME_LENGTH}
          required
          autoFocus
          className="rounded border px-2 py-1"
        />
      </label>

      <details className="text-sm">
        <summary className="cursor-pointer underline">
          I&apos;d rather not use my full name
        </summary>
        <div className="mt-2 flex flex-col gap-2">
          <p>
            Use your MIT username instead, the part of your email before the
            @. It is unique, so nobody else can take it.
          </p>
          <p>
            Or use any other name you know to be unique. Others must be able
            to find it when they record a match against you, so pick
            something they will recognise.
          </p>
        </div>
      </details>

      {state && !state.ok && (
        <div className="text-sm text-red-700" role="alert">
          <p>{state.error}</p>
          {state.existing && (
            <p>
              Did you mean{" "}
              <Link
                href={`/players/${state.existing.id}`}
                className="underline"
              >
                {state.existing.name}
              </Link>
              ?
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded border px-3 py-1"
      >
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
