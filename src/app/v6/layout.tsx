import { plex } from "../_fonts/v6";
import "./v6.css";

/** Вариант 6 «Эсеп»: маркетинг, который считают в сомах. Светлый отчёт, чернила, красный Курака как сигнал. */
export default function V6Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v6-theme ${plex.variable}`}>{children}</div>;
}
