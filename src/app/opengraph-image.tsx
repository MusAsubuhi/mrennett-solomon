import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";

export const alt = "Mrennett. Your moment, Mrennett.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Stand-in share image: wordmark and tagline on violet with a gold frame. Replace via the brand.og slot. */
export default function OgImage() {
  const { brand } = getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#3B2463,#523977 55%,#2A1745)",
          padding: 36,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #D1AA74",
            color: "#D1AA74",
          }}
        >
          <div style={{ fontSize: 150, fontFamily: "Georgia, serif", fontWeight: 600 }}>{brand.name}</div>
          <div style={{ fontSize: 40, color: "#FAF6EF", marginTop: 8, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{brand.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
