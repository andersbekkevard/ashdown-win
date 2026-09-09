"use client";

import Link from "next/link";
import { Dock } from "@/components/dock";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <div className="form-card slab pop-in">
        <h2 className="shout">The table wobbled</h2>
        <p className="hint">
          Something went wrong loading this page. Nothing you recorded is lost, because every
          match is written before it is shown. Try again in a moment.
        </p>
      </div>
      <Dock>
        <Link href="/" className="btn ghost">
          Board
        </Link>
        <button type="button" className="btn" onClick={() => reset()}>
          Try again
        </button>
      </Dock>
    </>
  );
}
