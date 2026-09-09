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
  const [pending, start] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const result = await action();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      setConfirming(false);
      router.refresh();
    });
  }

  if (deleted) {
    return (
      <div className="actions">
        <button type="button" className="mini restore" disabled={pending} onClick={() => run(() => restoreMatch(matchId))}>
          {pending ? "…" : "Restore"}
        </button>
        {error && <span className="mini-error" role="alert">{error}</span>}
      </div>
    );
  }

  if (!confirming) {
    return (
      <div className="actions">
        <button type="button" className="mini" onClick={() => setConfirming(true)}>
          Delete
        </button>
        {error && <span className="mini-error" role="alert">{error}</span>}
      </div>
    );
  }

  return (
    <div className="actions confirm pop-in">
      <span>Delete this match?</span>
      <button type="button" className="mini danger" disabled={pending} onClick={() => run(() => deleteMatch(matchId))}>
        {pending ? "…" : "Yes, delete"}
      </button>
      <button type="button" className="mini" disabled={pending} onClick={() => setConfirming(false)}>
        Keep
      </button>
    </div>
  );
}
