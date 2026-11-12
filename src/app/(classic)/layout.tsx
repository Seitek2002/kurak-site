import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SelectionDrawer } from "@/components/SelectionDrawer";

/** Вариант 1 «Меню-курак»: светлая страница, шапка-полоса, подвал со швом. */
export default function ClassicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SelectionDrawer />
    </>
  );
}
