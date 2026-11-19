import { pfSans } from "../_fonts/portfolio";
import "./portfolio.css";

/** Демо-портфолио: печатная вёрстка 16:9, из неё scripts/build-portfolio.mjs собирает PDF. */
export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`pf-theme ${pfSans.variable}`}>{children}</div>;
}
