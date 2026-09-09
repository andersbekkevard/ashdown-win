import { notFound } from "next/navigation";
import { CelebrationPreview } from "./preview";

/** Development-only motion workbench. Never writes players or matches. */
export default function CelebrationPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CelebrationPreview />;
}
