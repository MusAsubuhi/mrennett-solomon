"use client";
import { useClientValue } from "@/lib/useMounted";

type Conn = { saveData?: boolean; effectiveType?: string };

/** True unless the visitor wants less motion, has Save-Data on, or is on a slow connection. */
function motionAllowed(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && /^(slow-2g|2g|3g)$/.test(c.effectiveType)) return false;
  return true;
}

const DROPS = Array.from({ length: 10 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  delay: -((i * 1.7) % 9),
  duration: 8 + ((i * 3) % 6),
  scale: 0.7 + ((i * 13) % 6) / 10,
}));

/**
 * Hero extras: a few drifting water droplets (at most 12) and an optional
 * looping video. Both are skipped for reduced motion, Save-Data and slow connections.
 */
export function HeroEffects({ videoMp4, videoWebm }: { videoMp4?: string; videoWebm?: string }) {
  const ok = useClientValue(motionAllowed, false);
  if (!ok) return null;
  return (
    <>
      {videoMp4 && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {DROPS.map((d, i) => (
          <span
            key={i}
            className="droplet"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              transform: `scale(${d.scale})`,
            }}
          />
        ))}
      </div>
    </>
  );
}
