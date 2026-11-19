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
/** Скачать: стрелка в лоток */
export const IconDownload = () => (
  <svg {...base} aria-hidden="true">
    <path d="M10 3v9.5M6 8.5l4 4 4-4M4 13.5V16h12v-2.5" />
  </svg>
);
/** Поделиться: стрелка из коробки */
export const IconShare = () => (
  <svg {...base} aria-hidden="true">
    <path d="M10 12.5V3.5M6.5 7L10 3.5 13.5 7M7 10H4.5v6.5h11V10H13" />
  </svg>
);
/** WhatsApp: облачко разговора с хвостиком внизу слева */
export const IconChat = () => (
  <svg {...base} aria-hidden="true">
    <path d="M10 3.5a6.5 6.5 0 0 1 0 13c-1.1 0-2.2-.3-3.1-.8L3.5 16.5l.9-3.3A6.5 6.5 0 0 1 10 3.5z" strokeLinejoin="round" />
  </svg>
);
/** Telegram: бумажный самолётик */
export const IconSend = () => (
  <svg {...base} aria-hidden="true">
    <path d="M17 3.5L2.8 9.2l5 1.8M17 3.5l-3 13-6.2-5.5M17 3.5L7.8 11v4.5l2.6-2.4" strokeLinejoin="round" />
  </svg>
);
/** Телефон: трубка */
export const IconPhone = () => (
  <svg {...base} aria-hidden="true">
    <path
      d="M6.6 3.5H4.2c-.4 0-.7.3-.7.7C3.5 11 9 16.5 15.8 16.5c.4 0 .7-.3.7-.7v-2.4l-3.2-1.2-1.5 1.5a8.6 8.6 0 0 1-3.8-3.8l1.5-1.5-1-3.4z"
      strokeLinejoin="round"
    />
  </svg>
);
