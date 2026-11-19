import type { Metadata } from "next";
import { V3Page } from "@/components/v3/V3Page";

export const metadata: Metadata = {
  title: { absolute: "Курак — маркетинговое агентство полного цикла в Бишкеке" },
  description: "Стратегия, SMM и реклама, PR, ивенты, брендинг, продажи и сайты. Ответьте на три вопроса и получите план для вашего бизнеса, скачайте портфолио в PDF.",
  alternates: { canonical: "/v3", languages: { ru: "/v3", ky: "/v3/kg" } },
};

export default function Page() {
  return <V3Page lang="ru" />;
}
