import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "aw_device";

/**
 * Anonymous per-device label stored with every write. It names no one; it
 * only lets the log show when several actions came from the same phone. The
 * cookie is a random token; only a truncated hash of it is stored.
 */
export async function deviceLabel(): Promise<string> {
  const jar = await cookies();
  let token = jar.get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    token = randomBytes(16).toString("hex");
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return createHash("sha256").update(token).digest("hex").slice(0, 12);
}
