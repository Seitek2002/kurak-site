import type { Metadata } from "next";
import { V6Page } from "@/components/v6/V6Page";
import { V6_META } from "@/content/v6";

export const metadata: Metadata = {
  title: V6_META.title.ru,
  description: V6_META.description.ru,
  alternates: { canonical: "/v6", languages: { ru: "/v6", ky: "/v6/kg" } },
};

export default function Page() {
  return <V6Page lang="ru" />;
}
