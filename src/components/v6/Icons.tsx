/** Один набор значков варианта 6: тонкая линия 1.5, квадрат 20 × 20, цвет из currentColor */
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  focusable: false,
};

export const IconPlus = () => (
  <svg {...base} aria-hidden="true">
    <path d="M10 4v12M4 10h12" />
  </svg>
);
export const IconCheck = () => (
  <svg {...base} aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);
export const IconClose = () => (
  <svg {...base} aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);
export const IconMenu = () => (
  <svg {...base} aria-hidden="true">
    <path d="M3 6h14M3 10h14M3 14h14" />
  </svg>
);
