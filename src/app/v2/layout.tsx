import type { Metadata, Viewport } from "next";
import { SelectionDrawer } from "@/components/SelectionDrawer";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { SmoothScroll } from "@/components/v2/SmoothScroll";
import { Cursor } from "@/components/v2/Cursor";
import { dela } from "../_fonts/dela";
import "./v2.css";

export const metadata: Metadata = {
  title: "Маркетинг, сшитый в одно полотно",
  description:
    "Курак — маркетинговое агентство полного цикла в Бишкеке: стратегия, SMM и реклама, PR, ивенты, брендинг, продажи и сайты. Оставьте заявку или скачайте портфолио в PDF.",
  alternates: { canonical: "/v2" },
};

/** Цвет панели браузера = крем логотипа (--color-paper в v2.css) */
export const viewport: Viewport = { themeColor: "#FDF4E3" };

/** Вариант 2 «Полотно»: гамма логотипа (крем, красный, чернила, марена), плавный скролл, сцены на ScrollTrigger. */
export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v2-theme dela-fonts ${dela.variable}`}>
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
