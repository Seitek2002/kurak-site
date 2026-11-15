import type { Metadata } from "next";
import { V8Page } from "@/components/v8/V8Page";

export const metadata: Metadata = {
  title: "Меню маркетинга для бизнеса в Бишкеке",
  description:
    "Курак: маркетинговое агентство полного цикла в Бишкеке. SMM, PR, ивенты, брендинг, продажи, сайты, найм и инвестиции. Выберите услуги из меню, и мы соберём их в одну систему.",
  alternates: { canonical: "/v8", languages: { ru: "/v8", ky: "/v8/kg" } },
};

export default function Page() {
  return <V8Page lang="ru" />;
}
