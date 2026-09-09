import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local dev is reached over loopback and the Tailnet; production ignores this.
  allowedDevOrigins: ["127.0.0.1", "localhost", "100.100.56.45", "europa.tailbcf03b.ts.net"],
  /* config options here */
};

export default nextConfig;
