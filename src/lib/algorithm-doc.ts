/**
 * Renders docs/algorithm.md to HTML with KaTeX. Called from a static page,
 * so it runs at build time; the site's algorithm page cannot drift from the
 * doc because it is the doc.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const ALGORITHM_DOC_PATH = path.join(
  process.cwd(),
  "docs",
  "algorithm.md",
);

export async function renderAlgorithmDoc(): Promise<string> {
  const source = await readFile(ALGORITHM_DOC_PATH, "utf8");
  const file = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex, { strict: true, throwOnError: true })
    .use(rehypeStringify)
    .process(source);
  return String(file);
}
