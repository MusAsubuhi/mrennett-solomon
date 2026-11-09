/**
 * Original single-stroke botanical line art, drawn for this build.
 * PLACEHOLDER ART: the owner may supply the real label illustrations later.
 * Colour comes from `currentColor`, so set it with a text colour class (e.g. text-gold-500).
 */
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function Lavender(props: Props) {
  const buds = Array.from({ length: 6 }, (_, i) => 26 + i * 9);
  return (
    <svg viewBox="0 0 60 120" {...base} {...props}>
      <path d="M30 118 C30 90 30 60 30 24" />
      <path d="M30 104 C19 96 13 84 11 72" />
      <path d="M30 104 C41 96 47 84 49 72" />
      <ellipse cx="30" cy="14" rx="3" ry="7" />
      {buds.map((y) => (
        <g key={y}>
          <ellipse cx="24" cy={y} rx="3" ry="6.5" transform={`rotate(-28 24 ${y})`} />
          <ellipse cx="36" cy={y} rx="3" ry="6.5" transform={`rotate(28 36 ${y})`} />
        </g>
      ))}
    </svg>
  );
}

export function Jasmine(props: Props) {
  return (
    <svg viewBox="0 0 100 100" {...base} {...props}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="50" cy="26" rx="7" ry="15" transform={`rotate(${deg} 50 42)`} />
      ))}
      <circle cx="50" cy="42" r="2.5" />
      <path d="M50 58 C50 76 46 90 40 98" />
      <path d="M47 82 C57 70 72 70 80 74 C73 84 58 88 47 82Z" />
      <path d="M47 82 C58 78 68 76 76 75" />
    </svg>
  );
}

export function Eucalyptus(props: Props) {
  const leaves = [
    { y: 100, s: -1 },
    { y: 84, s: 1 },
    { y: 68, s: -1 },
    { y: 52, s: 1 },
    { y: 36, s: -1 },
    { y: 22, s: 1 },
  ];
  return (
    <svg viewBox="0 0 60 120" {...base} {...props}>
      <path d="M30 118 C28 92 34 60 30 10" />
      {leaves.map(({ y, s }) => (
        <ellipse key={y} cx={30 + s * 11} cy={y} rx="10" ry="7" transform={`rotate(${s * -18} ${30 + s * 11} ${y})`} />
      ))}
      <ellipse cx="30" cy="8" rx="5" ry="5" />
    </svg>
  );
}

export function Orchid(props: Props) {
  return (
    <svg viewBox="0 0 100 100" {...base} {...props}>
      <ellipse cx="50" cy="24" rx="9" ry="17" />
      <ellipse cx="33" cy="52" rx="9" ry="17" transform="rotate(-50 33 52)" />
      <ellipse cx="67" cy="52" rx="9" ry="17" transform="rotate(50 67 52)" />
      <ellipse cx="28" cy="36" rx="15" ry="10" transform="rotate(-20 28 36)" />
      <ellipse cx="72" cy="36" rx="15" ry="10" transform="rotate(20 72 36)" />
      <path d="M42 50 C42 62 46 66 50 66 C54 66 58 62 58 50 C54 54 46 54 42 50Z" />
      <path d="M50 66 C52 80 46 90 42 98" />
    </svg>
  );
}

const ART = { lavender: Lavender, jasmine: Jasmine, eucalyptus: Eucalyptus, orchid: Orchid };
export type BotanicalName = keyof typeof ART;

export function Botanical({ name, ...props }: Props & { name: BotanicalName }) {
  const C = ART[name];
  return <C {...props} />;
}

/** A thin gold rule with a small leaf at the centre. Use as a section divider. */
export function SprigDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 24" className={`mx-auto h-6 w-72 max-w-full text-gold-500 ${className}`} {...base} strokeWidth={1}>
      <path d="M0 12 H132" />
      <path d="M188 12 H320" />
      <path d="M160 20 C160 14 160 10 160 4" />
      <path d="M160 14 C150 14 146 8 146 4 C154 4 160 8 160 14Z" />
      <path d="M160 14 C170 14 174 8 174 4 C166 4 160 8 160 14Z" />
    </svg>
  );
}
