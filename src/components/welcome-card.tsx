"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WhatsAppRow } from "./whatsapp-row";

/** Shown once, right after a player creates themselves. Dismissible. */
export function WelcomeCard() {
  const router = useRouter();
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div className="welcome pop-in" role="status">
      <button
        type="button"
        className="welcome-x"
        aria-label="Dismiss"
        onClick={() => {
          setGone(true);
          router.replace(window.location.pathname, { scroll: false });
        }}
      >
        ×
      </button>
      <b>You&apos;re on board.</b> Find someone to play in the group.
      <WhatsAppRow text="Ashdown ping-pong on WhatsApp" />
    </div>
  );
}
