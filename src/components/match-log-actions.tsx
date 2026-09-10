"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMatch, restoreMatch } from "@/app/actions";

/**
 * Delete with a confirm step, or restore. Both append to the log; nothing is
 * ever removed, so a wrong tap is always reversible.
 */
export function MatchLogActions({ matchId, deleted }: { matchId: number; deleted: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, done: string) {
    setError(null);
    setStatus(null);
    start(async () => {
      const result = await action();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      else setStatus(done);
      setConfirming(false);
      router.refresh();
    });
  }

  // The note is a full-width line under the row, never inside the button column.
  const note = status && <div className="status pop-in" role="status">{status}</div>;

  if (deleted) {
    return (
      <>
        <div className="actions">
          <button
            type="button"
            className="mini restore"
            disabled={pending}
            onClick={() => run(() => restoreMatch(matchId), `Match #${matchId} counts again. Ratings recomputed.`)}
          >
            {pending ? "…" : "Restore"}
          </button>
          {error && <span className="mini-error" role="alert">{error}</span>}
        </div>
        {note}
      </>
    );
  }

  if (!confirming) {
    return (
      <>
        <div className="actions">
          <button type="button" className="mini" onClick={() => setConfirming(true)}>
            Delete
          </button>
          {error && <span className="mini-error" role="alert">{error}</span>}
        </div>
        {note}
      </>
    );
  }

  return (
    <div className="actions confirm pop-in">
      <span>Delete this match?</span>
      <button type="button" className="mini danger" disabled={pending} onClick={() => run(() => deleteMatch(matchId), `Match #${matchId} is void. Ratings recomputed. Restore is right here if that was a mistake.`)}>
        {pending ? "…" : "Yes, delete"}
      </button>
      <button type="button" className="mini" disabled={pending} onClick={() => setConfirming(false)}>
        Keep
      </button>
    </div>
  );
}
