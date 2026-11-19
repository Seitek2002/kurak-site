import type { Metadata } from "next";
import { PortfolioDeck } from "@/components/portfolio/PortfolioDeck";
import { PF } from "@/components/portfolio/text";

export const metadata: Metadata = {
  title: { absolute: "Курак: портфолио агентства" },
  description: PF.meta.description.ru,
  robots: { index: false, follow: false },
  alternates: { canonical: "/portfolio", languages: { ru: "/portfolio", ky: "/portfolio/kg" } },
};

export default function Page() {
  return <PortfolioDeck lang="ru" />;
}
