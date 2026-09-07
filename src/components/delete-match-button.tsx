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
    <form action={formAction}>
      <button type="submit" className="mini" disabled={pending}>
        {pending ? "…" : "Delete"}
      </button>
      {state && !state.ok && (
        <span className="error" role="alert" style={{ display: "block", margin: "6px 0 0" }}>
          {state.error}
        </span>
      )}
    </form>
  );
}
