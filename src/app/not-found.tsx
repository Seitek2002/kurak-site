import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Patch } from "@/components/Patch";
import { dela } from "./_fonts/dela";

export default function NotFound() {
  return (
    <div className={`${dela.variable} dela-fonts`}>
      <Header />
      <main id="main">
        <section className="section" aria-labelledby="nf-title" style={{ paddingBottom: "var(--section-gap)" }}>
          <div className="container" style={{ display: "grid", gap: "var(--space-lg)", justifyItems: "start" }}>
            <span data-cat="events" style={{ width: 96, height: 96, display: "block" }} aria-hidden="true">
              <Patch cat="events" />
            </span>
            <h1 id="nf-title" className="h-section">Этот лоскут потерялся</h1>
            <p className="lead">Страницы нет или она переехала. Начните с меню услуг.</p>
            <Link href="/#uslugi" className="btn">Открыть меню услуг</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
