import { KURAK_PATHS } from "@/components/brand/KurakLogo";

/**
 * Иллюстрации услуг варианта 8: каждая услуга подаётся на круглой кремовой «тарелке», как товар в меню.
 * Предметы собраны из простых фигур, за ними одна фигура логотипа (блок K, полукруг U, чаша R, треугольник A).
 * Цвета только классами f-* / s-* из v8.css, то есть из блока токенов.
 */

const OX = [0, 88, 181, 251.5, 361] as const;

/** Фигура логотипа как деталь иллюстрации: 0 K, 1 U, 2 R, 3 A */
export function Glyph({ i, x, y, s, r = 0, c }: { i: 0 | 1 | 2 | 3; x: number; y: number; s: number; r?: number; c: string }) {
  return <path d={KURAK_PATHS[i]} className={c} transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(${-OX[i]} 0)`} />;
}

function Plate() {
  return (
    <>
      <circle cx="100" cy="104" r="88" className="f-rim" />
      <circle cx="100" cy="104" r="77" className="f-cream" />
    </>
  );
}

const lines = (x: number, ys: number[], w: number[], h = 5) =>
  ys.map((y, k) => <rect key={y} x={x} y={y} width={w[k] ?? w[0]} height={h} rx={h / 2} className="f-grey" />);

const ART: Record<string, React.ReactNode> = {
  /* SMM */
  "smm-strategy": (
    <>
      <Glyph i={1} x={40} y={50} s={0.6} c="f-blush" />
      <rect x="64" y="38" width="72" height="128" rx="16" className="f-red" />
      <rect x="71" y="50" width="58" height="104" rx="8" className="f-white" />
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={76 + c * 17} y={58 + r * 17} width="14" height="14" rx="4" className={["f-pink", "f-sun", "f-coral", "f-sky", "f-red", "f-butter", "f-mint", "f-pink", "f-sun"][r * 3 + c]} />
        )),
      )}
      {lines(77, [117, 127, 137], [40, 30, 22])}
      <circle cx="146" cy="62" r="20" className="f-coral" />
      <path d="M146 72c-11-7-12-15-6-17 3-1 5 1 6 3 1-2 3-4 6-3 6 2 5 10-6 17z" className="f-white" />
    </>
  ),
  "smm-content": (
    <>
      <Glyph i={3} x={92} y={40} s={0.62} c="f-blush" />
      <rect x="62" y="62" width="46" height="24" rx="8" className="f-red" />
      <rect x="38" y="76" width="124" height="82" rx="18" className="f-red" />
      <rect x="46" y="68" width="16" height="12" rx="4" className="f-coral" />
      <circle cx="100" cy="117" r="34" className="f-white" />
      <circle cx="100" cy="117" r="25" className="f-ink" />
      <circle cx="100" cy="117" r="14" className="f-sky" />
      <circle cx="93" cy="110" r="5" className="f-white" />
      <rect x="134" y="88" width="18" height="11" rx="4" className="f-butter" />
    </>
  ),
  "smm-target": (
    <>
      <Glyph i={0} x={44} y={50} s={0.5} c="f-blush" />
      <circle cx="96" cy="112" r="58" className="f-white" />
      <circle cx="96" cy="112" r="46" className="f-red" />
      <circle cx="96" cy="112" r="32" className="f-white" />
      <circle cx="96" cy="112" r="18" className="f-red" />
      <circle cx="96" cy="112" r="6" className="f-white" />
      <path d="M98 110 L158 50" className="s-ink" strokeWidth="6" />
      <path d="M150 46 L162 26 L168 42 Z M154 58 L174 52 L158 40 Z" className="f-sun" />
    </>
  ),
  "smm-bloggers": (
    <>
      <Glyph i={1} x={34} y={104} s={0.5} c="f-blush" />
      <circle cx="100" cy="92" r="46" className="s-sun" strokeWidth="14" />
      <path d="M100 140 V168 M100 168 L78 186 M100 168 L122 186" className="s-ink" strokeWidth="5" />
      <rect x="84" y="66" width="32" height="54" rx="8" className="f-ink" />
      <rect x="88" y="73" width="24" height="40" rx="4" className="f-pink" />
      <path d="M100 100c-7-4-8-10-4-11 2 0 3 1 4 2 1-1 2-2 4-2 4 1 3 7-4 11z" className="f-white" />
      <path d="M152 36 L156 48 L168 52 L156 56 L152 68 L148 56 L136 52 L148 48 Z" className="f-coral" />
      <path d="M40 58 L42 64 L48 66 L42 68 L40 74 L38 68 L32 66 L38 64 Z" className="f-sun" />
    </>
  ),

  /* PR */
  "pr-media": (
    <>
      <Glyph i={3} x={36} y={44} s={0.56} c="f-blush" />
      <g transform="rotate(-6 100 108)">
        <rect x="46" y="52" width="112" height="114" rx="8" className="f-white" />
        <rect x="56" y="62" width="92" height="13" rx="4" className="f-ink" />
        <rect x="56" y="84" width="42" height="38" rx="5" className="f-sky" />
        <circle cx="68" cy="95" r="6" className="f-butter" />
        <path d="M56 122 L74 102 L84 112 L90 106 L98 114 V122 Z" className="f-mint" />
        {lines(104, [86, 96, 106, 116], [44, 40, 44, 30])}
        {lines(56, [132, 142, 152], [92, 92, 60])}
      </g>
      <circle cx="152" cy="58" r="15" className="f-red" />
      <path d="M145 58 l5 5 9-10" className="s-white" strokeWidth="4" />
    </>
  ),
  "pr-personal": (
    <>
      <rect x="28" y="38" width="92" height="60" rx="28" className="f-blush" />
      <path d="M52 92 L44 112 L70 96 Z" className="f-blush" />
      <circle cx="56" cy="68" r="6" className="f-coral" />
      <circle cx="74" cy="68" r="6" className="f-coral" />
      <circle cx="92" cy="68" r="6" className="f-coral" />
      <rect x="100" y="50" width="42" height="64" rx="21" className="f-grey" />
      <path d="M108 66 H134 M106 78 H136 M108 90 H134" className="s-white" strokeWidth="3" />
      <rect x="100" y="98" width="42" height="9" className="f-red" />
      <rect x="113" y="112" width="16" height="26" rx="5" className="f-ink" />
      <path d="M121 138 V170" className="s-ink" strokeWidth="6" />
      <ellipse cx="121" cy="173" rx="28" ry="7" className="f-ink" />
    </>
  ),
  "pr-crisis": (
    <>
      <path d="M36 98 A64 64 0 0 1 164 98 Z" className="f-red" />
      <path d="M100 34 Q76 60 68 98 H100 Z" className="f-coral" />
      {[52, 84, 116, 148].map((cx) => (
        <circle key={cx} cx={cx} cy="98" r="16" className="f-cream" />
      ))}
      <circle cx="100" cy="31" r="5" className="f-ink" />
      <path d="M100 82 V150 a11 11 0 0 1 -22 0" className="s-ink" strokeWidth="6" />
      {(
        [
          [40, 132],
          [154, 128],
          [146, 164],
          [58, 168],
        ] as const
      ).map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y - 13}c6 9 8 13 0 17c-8-4-6-8 0-17z`} className="f-sky" />
      ))}
    </>
  ),

  /* Ивенты */
  "ev-brand": (
    <>
      <path d="M78 98 Q86 128 104 150 M118 90 Q112 124 104 150 M140 112 Q126 132 104 150" className="s-ink" strokeWidth="2.5" />
      <ellipse cx="78" cy="70" rx="24" ry="29" className="f-red" />
      <ellipse cx="120" cy="62" rx="24" ry="29" className="f-sun" />
      <ellipse cx="140" cy="88" rx="20" ry="25" className="f-pink" />
      <path d="M74 98 h8 l-4 -5z M116 90 h8 l-4 -5z M136 112 h8 l-4 -5z" className="f-ink" />
      <ellipse cx="70" cy="60" rx="5" ry="8" className="f-white" opacity="0.6" />
      <ellipse cx="112" cy="52" rx="5" ry="8" className="f-white" opacity="0.6" />
      <rect x="30" y="146" width="140" height="12" rx="3" className="f-coral" />
      <path d="M104 152 L80 136 L80 168 Z M104 152 L128 136 L128 168 Z" className="f-red" />
      <circle cx="104" cy="152" r="7" className="f-red" />
    </>
  ),
  "ev-forum": (
    <>
      <rect x="38" y="40" width="124" height="74" rx="10" className="f-sky" />
      <Glyph i={0} x={84} y={52} s={0.4} c="f-white" />
      <path d="M68 114 V128 M132 114 V128" className="s-ink" strokeWidth="5" />
      <rect x="78" y="120" width="44" height="9" rx="3" className="f-ink" />
      <path d="M84 129 H116 L112 164 H88 Z" className="f-red" />
      {[
        [46, 158, "f-ink"],
        [64, 170, "f-coral"],
        [136, 170, "f-sun"],
        [154, 158, "f-ink"],
      ].map(([x, y, c]) => (
        <g key={`${x}`}>
          <circle cx={x as number} cy={(y as number) - 14} r="9" className={c as string} />
          <path d={`M${(x as number) - 14} ${y} a14 12 0 0 1 28 0z`} className={c as string} />
        </g>
      ))}
    </>
  ),
  "ev-corporate": (
    <>
      <ellipse cx="100" cy="160" rx="76" ry="17" className="f-blush" />
      <path d="M58 88 a17 17 0 0 0 0 34" className="s-red" strokeWidth="7" />
      <path d="M124 106 Q148 100 152 76 L162 79 Q158 116 126 124 Z" className="f-red" />
      <ellipse cx="92" cy="110" rx="40" ry="34" className="f-red" />
      <ellipse cx="92" cy="78" rx="22" ry="7" className="f-red" />
      <circle cx="92" cy="69" r="6" className="f-ink" />
      <circle cx="78" cy="108" r="6" className="f-white" />
      <circle cx="98" cy="120" r="6" className="f-white" />
      <circle cx="106" cy="98" r="4" className="f-white" />
      <circle cx="84" cy="127" r="3" className="f-white" />
      <path d="M112 150 H150 A19 19 0 0 1 112 150 Z" className="f-white" />
      <rect x="112" y="147" width="38" height="5" rx="2" className="f-sun" />
      <path d="M40 154 H72 A16 16 0 0 1 40 154 Z" className="f-white" />
      <rect x="40" y="151" width="32" height="5" rx="2" className="f-sun" />
      <path d="M128 136 q4 -6 0 -12 M136 136 q4 -6 0 -12" className="s-coral" strokeWidth="3" />
    </>
  ),

  /* Брендинг */
  "br-position": (
    <>
      <Glyph i={3} x={104} y={104} s={0.46} r={-8} c="f-blush" />
      <circle cx="100" cy="104" r="58" className="f-white" />
      <circle cx="100" cy="104" r="58" className="s-ink" strokeWidth="6" />
      <circle cx="100" cy="40" r="8" className="s-ink" strokeWidth="5" />
      <path d="M100 54 V62 M100 146 V154 M50 104 H58 M142 104 H150" className="s-ink" strokeWidth="5" />
      <path d="M100 62 L112 104 H88 Z" className="f-red" />
      <path d="M100 146 L112 104 H88 Z" className="f-grey" />
      <circle cx="100" cy="104" r="7" className="f-ink" />
    </>
  ),
  "br-identity": (
    <>
      <rect x="100" y="46" width="40" height="92" rx="9" className="f-sun" transform="rotate(22 120 138)" />
      <rect x="100" y="46" width="40" height="92" rx="9" className="f-sky" transform="rotate(10 120 138)" />
      <rect x="100" y="46" width="40" height="92" rx="9" className="f-pink" transform="rotate(-2 120 138)" />
      <rect x="40" y="52" width="82" height="108" rx="9" className="f-red" />
      <rect x="40" y="52" width="12" height="108" rx="5" className="f-coral" />
      <Glyph i={0} x={64} y={74} s={0.44} c="f-white" />
      <rect x="64" y="128" width="40" height="6" rx="3" className="f-blush" />
      <rect x="64" y="140" width="26" height="6" rx="3" className="f-blush" />
    </>
  ),

  /* Продажи */
  "sa-dept": (
    <>
      <rect x="98" y="40" width="62" height="40" rx="20" className="f-blush" />
      <path d="M112 76 L108 90 L126 78 Z" className="f-blush" />
      <circle cx="114" cy="60" r="5" className="f-coral" />
      <circle cx="129" cy="60" r="5" className="f-coral" />
      <circle cx="144" cy="60" r="5" className="f-coral" />
      <path d="M52 118 A46 46 0 0 1 144 118" className="s-ink" strokeWidth="10" />
      <rect x="38" y="104" width="28" height="48" rx="13" className="f-red" />
      <rect x="130" y="104" width="28" height="48" rx="13" className="f-red" />
      <path d="M50 150 Q54 176 94 174" className="s-ink" strokeWidth="5" />
      <circle cx="100" cy="174" r="8" className="f-ink" />
    </>
  ),
  "sa-crm": (
    <>
      <rect x="32" y="44" width="136" height="110" rx="14" className="f-white" />
      {[44, 87, 130].map((x) => (
        <rect key={x} x={x} y="56" width="28" height="6" rx="3" className="f-grey" />
      ))}
      <rect x="44" y="70" width="28" height="20" rx="5" className="f-pink" />
      <rect x="44" y="96" width="28" height="20" rx="5" className="f-pink" />
      <rect x="44" y="122" width="28" height="20" rx="5" className="f-pink" />
      <rect x="87" y="70" width="28" height="20" rx="5" className="f-butter" />
      <rect x="87" y="96" width="28" height="20" rx="5" className="f-butter" />
      <rect x="130" y="70" width="28" height="20" rx="5" className="f-mint" />
      <path d="M137 80 l5 5 9-9" className="s-white" strokeWidth="3.5" />
      <circle cx="150" cy="150" r="22" className="f-mint" />
      <path d="M140 164 L136 176 L150 168 Z" className="f-mint" />
      <circle cx="141" cy="150" r="3.5" className="f-white" />
      <circle cx="150" cy="150" r="3.5" className="f-white" />
      <circle cx="159" cy="150" r="3.5" className="f-white" />
    </>
  ),
  "sa-auto": (
    <>
      <g transform="translate(140 66)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect key={a} x="-6" y="-36" width="12" height="16" rx="3" className="f-sun" transform={`rotate(${a})`} />
        ))}
        <circle r="26" className="f-sun" />
        <circle r="10" className="f-cream" />
      </g>
      <rect x="70" y="134" width="56" height="38" rx="12" className="f-red" />
      <circle cx="98" cy="153" r="7" className="f-butter" />
      <path d="M97 72 V54" className="s-ink" strokeWidth="4" />
      <circle cx="97" cy="50" r="7" className="f-red" />
      <rect x="50" y="92" width="12" height="24" rx="5" className="f-red" />
      <rect x="132" y="92" width="12" height="24" rx="5" className="f-red" />
      <rect x="58" y="72" width="78" height="62" rx="20" className="f-white" />
      <rect x="67" y="82" width="60" height="40" rx="13" className="f-ink" />
      <circle cx="86" cy="98" r="6" className="f-mint" />
      <circle cx="108" cy="98" r="6" className="f-mint" />
      <path d="M88 110 q9 6 18 0" className="s-mint" strokeWidth="3.5" />
    </>
  ),

  /* Сайты и приложения */
  "di-site": (
    <>
      <rect x="32" y="48" width="136" height="108" rx="12" className="f-white" />
      <path d="M32 60 a12 12 0 0 1 12 -12 H156 a12 12 0 0 1 12 12 V68 H32 Z" className="f-grey" />
      <circle cx="45" cy="58" r="3.5" className="f-red" />
      <circle cx="56" cy="58" r="3.5" className="f-sun" />
      <circle cx="67" cy="58" r="3.5" className="f-mint" />
      <rect x="42" y="78" width="62" height="44" rx="7" className="f-sky" />
      <circle cx="56" cy="90" r="6" className="f-butter" />
      <path d="M42 122 L62 100 L74 112 L82 104 L104 122 Z" className="f-mint" />
      <rect x="112" y="82" width="46" height="7" rx="3.5" className="f-ink" />
      {lines(112, [95, 103], [42, 34], 4)}
      <rect x="112" y="111" width="32" height="11" rx="5.5" className="f-red" />
      <rect x="42" y="130" width="34" height="16" rx="5" className="f-blush" />
      <rect x="83" y="130" width="34" height="16" rx="5" className="f-blush" />
      <rect x="124" y="130" width="34" height="16" rx="5" className="f-blush" />
      <path d="M146 130 L146 158 L153 151 L159 164 L165 161 L159 148 L168 148 Z" className="f-ink" />
    </>
  ),
  "di-app": (
    <>
      <rect x="64" y="32" width="72" height="136" rx="18" className="f-ink" />
      <rect x="71" y="44" width="58" height="112" rx="10" className="f-white" />
      {[0, 1, 2].flatMap((r) =>
        [0, 1].map((c) => (
          <rect key={`${r}${c}`} x={79 + c * 24} y={54 + r * 26} width="18" height="18" rx="6" className={["f-red", "f-sun", "f-sky", "f-mint", "f-pink", "f-coral"][r * 2 + c]} />
        )),
      )}
      {lines(79, [136, 145], [42, 28], 4)}
      <g transform="rotate(12 148 126)">
        <rect x="128" y="104" width="42" height="42" rx="13" className="f-sun" />
        <path d="M149 135c-10-6-11-13-6-15 3-1 5 1 6 3 1-2 3-4 6-3 5 2 4 9-6 15z" className="f-white" />
      </g>
      <circle cx="134" cy="36" r="12" className="f-red" />
      <rect x="132" y="30" width="4" height="12" rx="2" className="f-white" />
    </>
  ),

  /* Найм */
  "te-hire": (
    <>
      <Glyph i={3} x={40} y={46} s={0.42} c="f-blush" />
      <path d="M48 160 a36 34 0 0 1 72 0 Z" className="f-coral" />
      <circle cx="84" cy="100" r="22" className="f-skin-b" />
      <path d="M62 98 a22 22 0 0 1 44 -4 q-14 -10 -30 -2 q-8 4 -14 6z" className="f-hair-a" />
      <circle cx="122" cy="104" r="30" className="f-white" opacity="0.55" />
      <circle cx="122" cy="104" r="30" className="s-ink" strokeWidth="8" />
      <path d="M144 126 L166 150" className="s-ink" strokeWidth="12" />
      <circle cx="58" cy="62" r="13" className="f-mint" />
      <path d="M52 62 l4 4 8-8" className="s-white" strokeWidth="3.5" />
    </>
  ),
  "te-hrbrand": (
    <>
      <g transform="rotate(-8 58 146)">
        <rect x="28" y="124" width="62" height="44" rx="8" className="f-white" />
        {lines(36, [134, 144, 154], [44, 36, 26], 4)}
      </g>
      <path d="M152 78 Q166 104 152 130" className="s-sun" strokeWidth="6" />
      <path d="M164 64 Q186 104 164 144" className="s-sun" strokeWidth="6" />
      <rect x="48" y="86" width="20" height="30" rx="7" className="f-ink" />
      <path d="M66 88 L136 54 V154 L66 114 Z" className="f-red" />
      <ellipse cx="136" cy="104" rx="10" ry="50" className="f-coral" />
      <rect x="82" y="114" width="13" height="30" rx="5" className="f-ink" transform="rotate(-10 88 114)" />
    </>
  ),

  /* Инвестиции */
  "in-pitch": (
    <>
      <path d="M72 132 L58 176 M128 132 L142 176 M100 132 V172" className="s-ink" strokeWidth="5" />
      <rect x="40" y="44" width="120" height="90" rx="10" className="f-white" />
      <rect x="58" y="100" width="18" height="24" rx="3" className="f-pink" />
      <rect x="84" y="84" width="18" height="40" rx="3" className="f-coral" />
      <rect x="110" y="64" width="18" height="60" rx="3" className="f-red" />
      <path d="M56 90 L82 72 L104 78 L134 54" className="s-ink" strokeWidth="4" />
      <path d="M138 50 L124 52 L134 62 Z" className="f-ink" />
      <ellipse cx="146" cy="152" rx="14" ry="5.5" className="f-sun" />
      <ellipse cx="146" cy="145" rx="14" ry="5.5" className="f-butter" />
      <ellipse cx="146" cy="138" rx="14" ry="5.5" className="f-sun" />
    </>
  ),
};

/** Тарелка с иллюстрацией услуги. Декоративная: подпись рядом в тексте карточки */
export function ServiceArt({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <Plate />
      {ART[id] ?? <Glyph i={0} x={66} y={64} s={0.82} c="f-red" />}
    </svg>
  );
}

/** Пустая тарелка с буквой K: пустая заявка */
export function EmptyPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <Plate />
      <Glyph i={0} x={72} y={66} s={0.68} c="f-rim" />
    </svg>
  );
}
