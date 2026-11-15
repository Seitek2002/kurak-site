import type { Metadata } from "next";
import { V8Page } from "@/components/v8/V8Page";

export const metadata: Metadata = {
  title: "Бишкектеги бизнес үчүн маркетинг менюсу",
  description:
    "Курак: Бишкектеги толук циклдүү маркетинг агенттиги. SMM, PR, иш-чаралар, брендинг, сатуу, сайттар, кызматкер тандоо жана инвестициялар. Менюдан кызматтарды тандаңыз, биз аларды бир системага чогултабыз.",
  alternates: { canonical: "/v8/kg", languages: { ru: "/v8", ky: "/v8/kg" } },
};

export default function Page() {
  return <V8Page lang="ky" />;
}
