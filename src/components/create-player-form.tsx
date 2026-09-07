"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createPlayer, type ActionResult } from "@/app/actions";
import { MAX_NAME_LENGTH } from "@/lib/config";
import { Dock } from "./dock";

type State = ActionResult<{ id: number; name: string }> | null;

export function CreatePlayerForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await createPlayer(formData.get("name"));
      if (result.ok) {
        router.push(`/players/${result.value.id}`);
        router.refresh();
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction}>
      <div className="form-card slab pop-in">
        <h2 className="shout">New player</h2>
        <label htmlFor="name">Your name</label>
        <div className="field plain">
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={initialName}
            maxLength={MAX_NAME_LENGTH}
            required
            autoFocus
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Full name"
          />
        </div>
        <p className="hint">
          Once is enough. You start at 1000, and anyone can record a match against you by
          finding this name.
        </p>
        <details>
          <summary>I&apos;d rather not use my full name</summary>
          <div className="altbox">
            <p>
              Use your MIT username instead, the part of your email before the @. It is unique,
              so nobody else can take it.
            </p>
            <p>
              Or any other name you know to be unique. Remember that the people who record
              matches against you will have to find it.
            </p>
          </div>
        </details>

        {state && !state.ok && (
          <div className="error" role="alert">
            <p style={{ margin: 0 }}>{state.error}</p>
            {state.existing && (
              <p style={{ margin: "6px 0 0" }}>
                Did you mean{" "}
                <Link href={`/players/${state.existing.id}`} style={{ textDecoration: "underline" }}>
                  {state.existing.name}
                </Link>
                ?
              </p>
            )}
          </div>
        )}
      </div>

      <Dock>
        <Link href="/" className="btn ghost">
          Cancel
        </Link>
        <button type="submit" className="btn lilac" disabled={pending}>
          {pending ? "Creating…" : "Create"}
        </button>
      </Dock>
    </form>
  );
}
