import type { Metadata } from "next";
import { V10Page } from "@/components/v10/V10Page";
import { V10 } from "@/content/v10";

export const metadata: Metadata = {
  title: V10.meta.title.ru,
  description: V10.meta.description.ru,
  alternates: { canonical: "/v10", languages: { ru: "/v10", ky: "/v10/kg" } },
};

export default function Page() {
  return <V10Page lang="ru" />;
}
