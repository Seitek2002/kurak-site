import type { Metadata } from "next";
import { V3Page } from "@/components/v3/V3Page";

export const metadata: Metadata = {
  title: "Кеңеш: Кыргызстандагы бизнес үчүн маркетинг",
  description: "Курак, 3-вариант: бизнесиңизге кызматтарды бир мүнөттө тандайбыз. Instagram, жарнама, ачылыш жана сайт. Жөнөкөй тил менен, кыргызча жана орусча.",
  alternates: { canonical: "/v3/kg", languages: { ru: "/v3", ky: "/v3/kg" } },
};

export default function Page() {
  return <V3Page lang="ky" />;
}
