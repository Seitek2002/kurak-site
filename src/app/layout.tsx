import type { Metadata, Viewport } from "next";
import { onest } from "./_fonts/onest";
import { ClientBoot } from "@/components/ClientBoot";
import { Analytics } from "@/components/Analytics";
import { PatchDefs } from "@/components/Patch";
import { SITE } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Курак: маркетинговое агентство полного цикла в Бишкеке",
    template: "%s | Курак",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Курак",
    title: "Курак: сшиваем маркетинг в одну систему",
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a3d",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Курак",
  description: SITE.description,
  url: SITE.url,
  areaServed: "KG",
  address: { "@type": "PostalAddress", addressLocality: "Бишкек", addressCountry: "KG" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={onest.variable} suppressHydrationWarning>
      <head>
        {/* .js ставится до отрисовки: проявки прячут контент только при работающем скрипте */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <PatchDefs />
        <a className="skip" href="#main">К содержанию</a>
        {children}
        <ClientBoot />
        <Analytics />
      </body>
    </html>
  );
}
