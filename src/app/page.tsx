import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Bundles } from "@/components/Bundles";
import { Principles } from "@/components/Principles";
import { Cases } from "@/components/Cases";
import { TeamPreview } from "@/components/TeamPreview";
import { Reviews } from "@/components/Reviews";
import { Faq } from "@/components/Faq";
import { Brief } from "@/components/Brief";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Bundles />
      <Principles />
      <Cases />
      <TeamPreview />
      <Reviews />
      <Faq />
      <Brief />
    </>
  );
}
