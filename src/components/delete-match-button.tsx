"use client";

import { useActionState } from "react";
import { deleteMatch, type ActionResult } from "@/app/actions";

type State = ActionResult<{ id: number }> | null;

export function DeleteMatchButton({ matchId }: { matchId: number }) {
  const [state, formAction, pending] = useActionState(
    async (): Promise<State> => deleteMatch(matchId),
    null,
  );

  return (
    <form action={formAction} className="inline">
      <button
        type="submit"
        disabled={pending}
        className="text-sm underline disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state && !state.ok && (
        <span className="ml-2 text-sm text-red-700" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}
