import { Glyph } from "./Art";
import { Person } from "./People";

/** Иллюстрации к блокам «О нас»: те же фигуры логотипа и та же тёплая палитра, что в меню */

function OwnPeople({ className }: { className?: string }) {
  const ids = ["oksana", "bibinur", "nurchik", "smm-lead", "pr-lead"];
  return (
    <span className={className} aria-hidden="true">
      {ids.map((id) => (
        <Person key={id} id={id} bust />
      ))}
    </span>
  );
}

const Report = () => (
  <svg viewBox="0 0 240 160" aria-hidden="true" focusable="false">
    <rect x="66" y="22" width="96" height="124" rx="12" className="f-white" transform="rotate(6 114 84)" opacity="0.6" />
    <rect x="66" y="18" width="100" height="128" rx="12" className="f-white" />
    <rect x="80" y="32" width="44" height="8" rx="4" className="f-ink" />
    <Glyph i={0} x={140} y={30} s={0.16} c="f-red" />
    <rect x="80" y="96" width="14" height="30" rx="3" className="f-pink" />
    <rect x="100" y="80" width="14" height="46" rx="3" className="f-coral" />
    <rect x="120" y="60" width="14" height="66" rx="3" className="f-red" />
    <rect x="80" y="50" width="30" height="5" rx="2.5" className="f-grey" />
    <rect x="80" y="134" width="60" height="5" rx="2.5" className="f-grey" />
    <circle cx="176" cy="122" r="22" className="f-mint" />
    <path d="M166 122l7 7 13-14" className="s-white" strokeWidth="5" />
  </svg>
);

const Kitchen = () => (
  <svg viewBox="0 0 240 160" aria-hidden="true" focusable="false">
    <rect x="64" y="10" width="112" height="146" rx="20" className="f-ink" />
    <rect x="72" y="22" width="96" height="122" rx="12" className="f-white" />
    <rect x="80" y="32" width="58" height="22" rx="11" className="f-cream" />
    <rect x="102" y="60" width="58" height="22" rx="11" className="f-mint" />
    <rect x="80" y="88" width="46" height="22" rx="11" className="f-cream" />
    <rect x="94" y="116" width="66" height="20" rx="10" className="f-mint" />
    <circle cx="46" cy="58" r="20" className="f-sun" />
    <circle cx="46" cy="58" r="8" className="f-white" />
    <circle cx="46" cy="58" r="4" className="f-ink" />
    <path d="M24 58q22-26 44 0q-22 26-44 0z" className="s-ink" strokeWidth="3" />
    <circle cx="196" cy="40" r="16" className="f-red" />
    <rect x="194" y="32" width="4" height="12" rx="2" className="f-white" />
    <circle cx="196" cy="48" r="2" className="f-white" />
  </svg>
);

const Talk = () => (
  <svg viewBox="0 0 240 160" aria-hidden="true" focusable="false">
    <rect x="30" y="26" width="110" height="64" rx="30" className="f-red" />
    <path d="M56 84l-8 22 28-18z" className="f-red" />
    <circle cx="64" cy="58" r="6" className="f-white" />
    <circle cx="85" cy="58" r="6" className="f-white" />
    <circle cx="106" cy="58" r="6" className="f-white" />
    <rect x="104" y="72" width="104" height="60" rx="28" className="f-white" />
    <path d="M182 126l10 20-28-16z" className="f-white" />
    <path d="M128 100h56M128 112h36" className="s-ink" strokeWidth="5" opacity="0.25" />
  </svg>
);

export function AboutArt({ id, className }: { id: string; className?: string }) {
  if (id === "own") return <OwnPeople className={className} />;
  return <span className={className}>{id === "report" ? <Report /> : id === "kitchen" ? <Kitchen /> : <Talk />}</span>;
}
