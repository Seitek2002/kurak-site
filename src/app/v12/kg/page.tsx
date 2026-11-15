import type { Metadata } from "next";
import { V12Page } from "@/components/v12/V12Page";
import { V12 } from "@/content/v12";

export const metadata: Metadata = {
  title: { absolute: V12.meta.title.ky },
  description: V12.meta.description.ky,
  alternates: { canonical: "/v12/kg", languages: { ru: "/v12", ky: "/v12/kg" } },
};

export default function Page() {
  return <V12Page lang="ky" />;
}
