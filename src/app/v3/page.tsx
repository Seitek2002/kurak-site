import type { Metadata } from "next";
import { V3Page } from "@/components/v3/V3Page";

export const metadata: Metadata = {
  title: "Кеңеш: маркетинг для бизнеса в Кыргызстане",
  description: "Курак, вариант 3: подберём услуги для вашего бизнеса за минуту. Instagram, реклама, открытие и сайт. Объясняем простыми словами, на русском и кыргызском.",
  alternates: { canonical: "/v3", languages: { ru: "/v3", ky: "/v3/kg" } },
};

export default function Page() {
  return <V3Page lang="ru" />;
}
