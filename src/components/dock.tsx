import type { ReactNode } from "react";

/** Bottom action bar. Primary actions live here, within thumb reach. */
export function Dock({ children, one = false }: { children: ReactNode; one?: boolean }) {
  return (
    <div className="dock">
      <div className={`group${one ? " one" : ""}`}>{children}</div>
    </div>
  );
}
