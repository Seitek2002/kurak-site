import type { Metadata } from "next";
import { V9Page } from "@/components/v9/V9Page";
import { V9 } from "@/content/v9";

export const metadata: Metadata = {
  title: { absolute: V9.meta.title.ru },
  description: V9.meta.description.ru,
  alternates: { canonical: "/v9", languages: { ru: "/v9", ky: "/v9/kg" } },
};

export default function Page() {
  return <V9Page lang="ru" />;
}
