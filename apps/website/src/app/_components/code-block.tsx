import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

interface Props {
  children: string;
  lang: BundledLanguage;
}

export async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "github-light",
  });

  return (
    <div
      className="overflow-x-scroll"
      dangerouslySetInnerHTML={{ __html: out }}
    />
  );
}
