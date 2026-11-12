import type { Metadata } from "next";
import { SelectionDrawer } from "@/components/SelectionDrawer";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { SmoothScroll } from "@/components/v2/SmoothScroll";
import { Cursor } from "@/components/v2/Cursor";
import "./v2.css";

export const metadata: Metadata = {
  title: "Полотно: маркетинг, сшитый на скролле",
  description:
    "Курак, вариант 2: маркетинговое агентство полного цикла в Бишкеке. Восемь направлений, одна команда, один договор.",
  alternates: { canonical: "/v2" },
};

/** Вариант 2 «Полотно»: ночная тема, плавный скролл, сцены на ScrollTrigger. */
export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="v2-theme">
      <V2Header />
      <main id="main" className="v2-main">
        {children}
      </main>
      <V2Footer />
      <SelectionDrawer />
      <SmoothScroll />
      <Cursor />
    </div>
  );
}
