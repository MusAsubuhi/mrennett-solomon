import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for journal and legal copy:
 * paragraphs, ## / ### headings, bullet and numbered lists, **bold**, *italic*, [links](url).
 * Output is plain React elements, so nothing is injected as raw HTML.
 */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("*")) out.push(<em key={i++}>{tok.slice(1, -1)}</em>);
    else {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(
        <a key={i++} href={href} className="text-violet-700 underline underline-offset-4">
          {label}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushPara = () => {
    if (para.length) blocks.push(<p key={key++}>{inline(para.join(" "))}</p>);
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={key++}>
        {list.items.map((t, i) => (
          <li key={i}>{inline(t)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
    } else if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push(
        <h3 key={key++} className="mt-6 text-2xl">
          {inline(line.replace(/^###\s+/, ""))}
        </h3>,
      );
    } else if (/^##\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push(<h2 key={key++}>{inline(line.replace(/^##\s+/, ""))}</h2>);
    } else if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(line.replace(/^[-*]\s+/, ""));
    } else if (/^\d+\.\s+/.test(line)) {
      flushPara();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s+/, ""));
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return <div className="prose-mrennett">{blocks}</div>;
}
