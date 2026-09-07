import "katex/dist/katex.min.css";
import { renderAlgorithmDoc } from "@/lib/algorithm-doc";

export const dynamic = "force-static";

export default async function AlgorithmPage() {
  const html = await renderAlgorithmDoc();
  return (
    <article
      className="algorithm [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_p]:mb-3 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
