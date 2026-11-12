import { V2Hero } from "@/components/v2/V2Hero";
import { Assembly } from "@/components/v2/Assembly";
import { ServicesRail } from "@/components/v2/ServicesRail";
import { Marquee } from "@/components/v2/Marquee";
import { Manifesto } from "@/components/v2/Manifesto";
import { CaseStack } from "@/components/v2/CaseStack";
import { V2Team } from "@/components/v2/V2Team";
import { Finale } from "@/components/v2/Finale";
import { Faq } from "@/components/Faq";
import { Brief } from "@/components/Brief";

/** Вариант 2 «Полотно»: история на скролле, где курак сшивается у посетителя на глазах. */
export default function CanvasPage() {
  return (
    <>
      <V2Hero />
      <Assembly />
      <ServicesRail />
      <Marquee />
      <Manifesto />
      <CaseStack />
      <V2Team />
      <Faq />
      <Finale />
      <Brief />
    </>
  );
}
