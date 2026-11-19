import type { Metadata } from "next";
import { V13Page } from "@/components/v13/V13Page";
import { V13_META } from "@/content/v13";

export const metadata: Metadata = {
  title: { absolute: V13_META.title.ru },
  description: V13_META.description.ru,
  alternates: { canonical: "/v13", languages: { ru: "/v13", ky: "/v13/kg" } },
};

export default function Page() {
  return <V13Page lang="ru" />;
}
