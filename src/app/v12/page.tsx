import type { Metadata } from "next";
import { V12Page } from "@/components/v12/V12Page";
import { V12 } from "@/content/v12";

export const metadata: Metadata = {
  title: { absolute: V12.meta.title.ru },
  description: V12.meta.description.ru,
  alternates: { canonical: "/v12", languages: { ru: "/v12", ky: "/v12/kg" } },
};

export default function Page() {
  return <V12Page lang="ru" />;
}
