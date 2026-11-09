import type { ReactNode } from "react";

export type AccordionItem = { id: string; title: string; content: ReactNode };

/** Native <details> disclosure: keyboard accessible and works without JavaScript. */
export function Accordion({ items, defaultOpenFirst = false }: { items: AccordionItem[]; defaultOpenFirst?: boolean }) {
  return (
    <div className="divide-y divide-violet-700/20 border-y border-violet-700/20">
      {items.map((item, i) => (
        <details key={item.id} className="group" open={defaultOpenFirst && i === 0}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-xl font-semibold text-violet-700 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span aria-hidden="true" className="text-2xl leading-none transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="prose-mrennett pb-5 text-ink-900">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
