import type { Metadata } from "next";
import { V13Page } from "@/components/v13/V13Page";
import { V13_META } from "@/content/v13";

export const metadata: Metadata = {
  title: { absolute: V13_META.title.ky },
  description: V13_META.description.ky,
  alternates: { canonical: "/v13/kg", languages: { ru: "/v13", ky: "/v13/kg" } },
};

export default function Page() {
  return <V13Page lang="ky" />;
}
