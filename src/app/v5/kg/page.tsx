import type { Metadata } from "next";
import { V5Page } from "@/components/v5/V5Page";
import { V5 } from "@/content/v5";

export const metadata: Metadata = {
  title: V5.meta.title.ky,
  description: V5.meta.description.ky,
  alternates: { canonical: "/v5/kg", languages: { ru: "/v5", ky: "/v5/kg" } },
};

export default function Page() {
  return <V5Page lang="ky" />;
}
