import type { Metadata } from "next";
import { V7Page } from "@/components/v7/V7Page";
import { V7 } from "@/content/v7";

export const metadata: Metadata = {
  title: { absolute: V7.meta.title.ru },
  description: V7.meta.description.ru,
  alternates: { canonical: "/v7", languages: { ru: "/v7", ky: "/v7/kg" } },
};

export default function Page() {
  return <V7Page lang="ru" />;
}
