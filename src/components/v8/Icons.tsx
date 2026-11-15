/** Иконки интерфейса варианта 8: штрих 2px, скругления, цвет = currentColor */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const IconBag = () => (
  <svg {...base}>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const IconClose = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconMenu = () => (
  <svg {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconCheck = () => (
  <svg {...base}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IconPlus = () => (
  <svg {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconBack = () => (
  <svg {...base}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const IconUp = () => (
  <svg {...base}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

/** Соцсети в подвале: круглые плашки, простые знаки без фирменных логотипов */
export const IconWhatsApp = () => (
  <svg {...base}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8.6 19L4 20z" />
    <path d="M9 9.5c.3 2.3 2.2 4.3 4.6 4.8l1.2-1.2 1.8.8c-.2 1-1.1 1.6-2 1.6A6.6 6.6 0 0 1 8 8.9c0-1 .7-1.8 1.6-2l.8 1.8L9 9.5z" />
  </svg>
);
export const IconTelegram = () => (
  <svg {...base}>
    <path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" />
    <path d="M9 13l12-9" />
  </svg>
);
export const IconInstagram = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17" cy="7" r="0.6" fill="currentColor" />
  </svg>
);
export const IconPhone = () => (
  <svg {...base}>
    <path d="M6 3h3l1.5 5-2 1.5a11 11 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z" />
  </svg>
);
