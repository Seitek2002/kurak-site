import type { Metadata } from "next";
import { V3Page } from "@/components/v3/V3Page";

export const metadata: Metadata = {
  title: { absolute: "Курак — Бишкектеги толук циклдүү маркетинг агенттиги" },
  description: "Стратегия, SMM жана жарнама, PR, иш-чаралар, брендинг, сатуу жана сайттар. Үч суроого жооп берип, бизнесиңизге план алыңыз, портфолиону PDF кылып жүктөп алыңыз.",
  alternates: { canonical: "/v3/kg", languages: { ru: "/v3", ky: "/v3/kg" } },
};

export default function Page() {
  return <V3Page lang="ky" />;
}
