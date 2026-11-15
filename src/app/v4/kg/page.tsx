import type { Metadata } from "next";
import { V4Page } from "@/components/v4/V4Page";
import { V4 } from "@/content/v4";

export const metadata: Metadata = {
  title: { absolute: V4.meta.title.ky },
  description: V4.meta.description.ky,
  alternates: { canonical: "/v4/kg", languages: { ru: "/v4", ky: "/v4/kg" } },
};

export default function Page() {
  return <V4Page lang="ky" />;
}
