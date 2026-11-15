import type { Metadata } from "next";
import { V11Page } from "@/components/v11/V11Page";
import { V11 } from "@/content/v11";

export const metadata: Metadata = {
  title: V11.meta.title.ru,
  description: V11.meta.description.ru,
  alternates: { canonical: "/v11", languages: { ru: "/v11", ky: "/v11/kg" } },
};

export default function Page() {
  return <V11Page lang="ru" />;
}
