import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SelectionDrawer } from "@/components/SelectionDrawer";
import { dela } from "../_fonts/dela";

/** Вариант 1 «Меню-курак»: светлая страница, шапка-полоса, подвал со швом. */
export default function ClassicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${dela.variable} dela-fonts`}>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SelectionDrawer />
    </div>
  );
}
