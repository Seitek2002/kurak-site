/** Значки варианта 2: рисованы линией 1.75 в рамке 24 × 24, цвет = currentColor. Декоративные. */
export type IconName = "whatsapp" | "telegram" | "phone" | "instagram" | "download" | "share" | "check";

const PATHS: Record<IconName, React.ReactNode> = {
  whatsapp: (
    <>
      <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" />
      <path d="M9.1 7.9c.3 0 .5 0 .7.5l.7 1.7c.1.2 0 .4-.1.6l-.6.7c.6 1.2 1.6 2.2 2.9 2.8l.7-.7c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.3.6-.2.9-1 1.6-2 1.6-2.9-.3-5.5-2.8-5.8-5.8 0-1 .5-1.9 1.5-2.4" />
    </>
  ),
  telegram: (
    <>
      <path d="M20.6 4.3 3.4 11c-.7.3-.7 1.2 0 1.5l4.2 1.5 1.6 5.1c.2.6 1 .8 1.4.3l2.4-2.3 4.4 3.2c.5.4 1.3.1 1.4-.6l2.9-13.3c.2-.8-.5-1.4-1.1-1.1Z" />
      <path d="m7.6 14 9.3-6.2-6.6 7.4-.6 3.4" />
    </>
  ),
  phone: <path d="M6.4 3.5h2.7l1.6 4.4-2.1 1.4a11.5 11.5 0 0 0 6.1 6.1l1.4-2.1 4.4 1.6v2.7c0 1.1-.9 2-2 1.9A16.2 16.2 0 0 1 4.5 5.5c-.1-1.1.8-2 1.9-2Z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.4" />
    </>
  ),
  download: <path d="M12 3.8v11.4m-4.6-4.6 4.6 4.6 4.6-4.6M4.5 19.8h15" />,
  share: <path d="M12 14.6V3.9m-4 4 4-4 4 4M8.6 10.4H6.2v9.4h11.6v-9.4h-2.4" />,
  check: <path d="m5 12.5 4.4 4.3L19 7.2" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
