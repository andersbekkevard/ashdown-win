import "katex/dist/katex.min.css";
import Link from "next/link";
import { Dock } from "@/components/dock";
import { renderAlgorithmDoc } from "@/lib/algorithm-doc";

export const dynamic = "force-static";

export default async function AlgorithmPage() {
  const html = await renderAlgorithmDoc();
  return (
    <>
      <article className="prose-card slab pop-in" dangerouslySetInnerHTML={{ __html: html }} />
      <Dock one>
        <Link href="/" className="btn ghost">
          Back to the board
        </Link>
      </Dock>
    </>
  );
}
