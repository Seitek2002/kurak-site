import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";
import { ClientBoot } from "@/components/ClientBoot";
import { Analytics } from "@/components/Analytics";
import { PatchDefs } from "@/components/Patch";
import { SITE } from "@/content/site";
import "./globals.css";

/**
 * Dela Gothic One (OFL, src/fonts/DelaGothicOne-OFL.txt), урезан до латиницы и кириллицы:
 * 13 КБ вместо сотен японских кусков, которые тянет Google Fonts.
 * В шрифте нет кыргызских ң ү ө: для кыргызской версии заголовков нужен другой акцидент.
 */
const dela = localFont({
  src: "../fonts/DelaGothicOne-kurak.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
  // optional: заголовок не перерисовывается при поздней подгрузке шрифта (стабильный LCP на мобильных);
  // файл 13 КБ и в preload, поэтому почти всегда успевает к первой отрисовке
  display: "optional",
  fallback: ["Arial Black", "sans-serif"],
  adjustFontFallback: "Arial",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600"],
  variable: "--font-onest",
  display: "swap",
});

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
    <html lang="ru" className={`${dela.variable} ${onest.variable}`} suppressHydrationWarning>
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
