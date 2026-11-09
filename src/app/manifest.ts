import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  const { brand } = getSite();
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#523977",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
