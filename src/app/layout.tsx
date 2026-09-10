import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Crown } from "@/components/crown";
import { CelebrationProvider } from "@/components/celebration";
import { GhostInput } from "@/components/focus-link";
import { LivePill } from "@/components/live-pill";
import { WhatsAppGlyph } from "@/components/whatsapp-row";
import { WHATSAPP_GROUP_URL } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "ashdown.win",
  description: "The table tennis ladder for Ashdown House at MIT.",
};

export const viewport: Viewport = {
  themeColor: "#00b5fe",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app router root layout, loads once */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Titan+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CelebrationProvider>
        <div className="phone">
          <header className="topbar">
            <Link href="/" className="logo" aria-label="ashdown.win home">
              <Crown />
              ashdown.win
            </Link>
            <nav className="chips">
              <LivePill />
              <a href={WHATSAPP_GROUP_URL} className="chip wa" target="_blank" rel="noopener" aria-label="Join the WhatsApp group">
                <WhatsAppGlyph className="wa-mini" />
                Chat
              </a>
            </nav>
          </header>
          <main>{children}</main>
          <GhostInput />
        </div>
        </CelebrationProvider>
      </body>
    </html>
  );
}
