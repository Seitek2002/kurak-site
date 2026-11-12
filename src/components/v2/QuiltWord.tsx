import type { CategoryId } from "@/content/services";

const CATS: CategoryId[] = ["smm", "pr", "events", "brand", "sales"];

/** Слово КУРАК, где каждая буква сшита из треугольников своего направления. Декоративное. */
export function QuiltWord({ className, letterClass }: { className?: string; letterClass?: string }) {
  return (
    <div className={["v2-word", className].filter(Boolean).join(" ")} aria-hidden="true">
      {"КУРАК".split("").map((ch, i) => (
        <span key={i} className="v2-letter-mask">
          <span className={["v2-letter", letterClass].filter(Boolean).join(" ")} data-cat={CATS[i]} style={{ "--i": i } as React.CSSProperties}>
            {ch}
          </span>
        </span>
      ))}
    </div>
  );
}
