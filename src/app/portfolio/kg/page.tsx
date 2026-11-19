import type { Metadata } from "next";
import { PortfolioDeck } from "@/components/portfolio/PortfolioDeck";
import { PF } from "@/components/portfolio/text";

export const metadata: Metadata = {
  title: { absolute: "Курак: агенттиктин портфолиосу" },
  description: PF.meta.description.ky,
  robots: { index: false, follow: false },
  alternates: { canonical: "/portfolio/kg", languages: { ru: "/portfolio", ky: "/portfolio/kg" } },
};

export default function Page() {
  return <PortfolioDeck lang="ky" />;
}
