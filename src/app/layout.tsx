import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartDrawerLoader } from "@/components/CartDrawerLoader";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Toaster } from "@/components/Toast";
import { getSite } from "@/lib/content";
import { ANALYTICS_ID, SITE_URL } from "@/lib/env";
import { getProductViews } from "@/lib/images";
import { ogImage } from "@/lib/seo";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.brand.metaTitle, template: `%s | ${site.brand.name}` },
  description: site.brand.metaDescription,
  applicationName: site.brand.name,
  openGraph: {
    type: "website",
    siteName: site.brand.name,
    title: site.brand.metaTitle,
    description: site.brand.metaDescription,
    images: [{ url: ogImage() }],
    locale: "en",
  },
  twitter: { card: "summary_large_image", images: [ogImage()] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#523977",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const views = getProductViews();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="absolute left-2 top-2 z-[70] -translate-y-24 rounded-sm bg-violet-700 px-4 py-3 text-cream-50 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawerLoader views={views} prompt={site.ordering.whatsappPrompt} />
        <Toaster />
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.brand.name,
              url: SITE_URL,
              ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
            },
            { "@context": "https://schema.org", "@type": "WebSite", name: site.brand.name, url: SITE_URL, inLanguage: "en" },
          ]}
        />
        {ANALYTICS_ID && (
          <Script defer data-domain={ANALYTICS_ID} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
