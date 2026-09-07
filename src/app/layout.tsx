import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ashdown.win",
  description: "The table tennis ladder for Ashdown House at MIT.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-2xl p-4">
        <header className="mb-6 flex items-baseline justify-between border-b pb-2">
          <Link href="/" className="text-xl font-bold">
            ashdown.win
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/log" className="underline">
              Log
            </Link>
            <Link href="/algorithm" className="underline">
              Algorithm
            </Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
