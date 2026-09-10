"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/**
 * iOS only raises the keyboard for a focus() that happens inside a tap. A
 * page that opens with a focused field cannot satisfy that on its own, so
 * this link focuses a hidden field during the tap and navigates; the
 * destination's autofocus then moves the already-open keyboard over.
 */
export function FocusLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const ghost = document.getElementById("ghost-focus") as HTMLInputElement | null;
        ghost?.focus({ preventScroll: true });
        router.push(href);
      }}
    >
      {children}
    </Link>
  );
}

/** Rendered once in the layout. Invisible, but focusable during a tap. */
export function GhostInput() {
  return (
    <input
      id="ghost-focus"
      type="text"
      aria-hidden="true"
      tabIndex={-1}
      readOnly
      className="ghost-focus"
      autoComplete="off"
    />
  );
}
