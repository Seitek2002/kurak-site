#!/usr/bin/env node
/**
 * Собирает демо-портфолио в PDF из страниц /portfolio (русский) и /portfolio/kg (кыргызский).
 *
 *   npm run dev                       # дев-сервер на http://localhost:3210 (или любой другой запущенный сайт)
 *   npm run build:portfolio           # → public/portfolio/kurak-portfolio.pdf и kurak-portfolio-ky.pdf
 *   node scripts/build-portfolio.mjs --base http://localhost:3000
 *
 * Нужны Google Chrome и puppeteer-core (локальный из node_modules или глобальный из npm -g).
 * Пути можно переопределить: CHROME_PATH=..., PUPPETEER_CORE=... .
 * Страницы печатаются в формате 16:9 из CSS (@page 338.67 × 190.5 мм), с фонами и кликабельными ссылками.
 */
import { createRequire } from "node:module";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "portfolio");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const GLOBAL_PUPPETEER = process.env.PUPPETEER_CORE || "C:/Users/seite/AppData/Roaming/npm/node_modules/puppeteer-core";

const TARGETS = [
  { route: "/portfolio", file: "kurak-portfolio.pdf" },
  { route: "/portfolio/kg", file: "kurak-portfolio-ky.pdf" },
];

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.slice(name.length + 3) : fallback;
}

function loadPuppeteer() {
  const require = createRequire(import.meta.url);
  for (const id of ["puppeteer-core", GLOBAL_PUPPETEER]) {
    try {
      return require(id);
    } catch {
      /* пробуем следующий */
    }
  }
  throw new Error(`puppeteer-core не найден. Установите его глобально (npm i -g puppeteer-core) или укажите PUPPETEER_CORE=путь.`);
}

const base = arg("base", "http://localhost:3210").replace(/\/$/, "");
const puppeteer = loadPuppeteer();

await mkdir(OUT_DIR, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--font-render-hinting=none", "--disable-gpu"],
});

let failed = false;
try {
  for (const t of TARGETS) {
    const url = `${base}${t.route}`;
    const out = path.join(OUT_DIR, t.file);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 180_000 });
    if (!res || !res.ok()) throw new Error(`${url}: HTTP ${res ? res.status() : "нет ответа"}`);
    await page.emulateMediaType("print");

    // Все начертания и подмножества (в т.ч. cyrillic-ext с Ң Ү Ө) должны загрузиться до печати
    const fonts = await page.evaluate(async () => {
      await Promise.all([...document.fonts].map((f) => f.load().catch(() => null)));
      await document.fonts.ready;
      // Служебные оверлеи дев-сервера не должны попасть в PDF
      document.querySelectorAll("nextjs-portal, [data-nextjs-toast]").forEach((n) => n.remove());
      const faces = [...document.fonts];
      return { loaded: faces.filter((f) => f.status === "loaded").length, total: faces.length };
    });
    const pages = await page.$$eval("[data-tone]", (n) => n.length);

    await page.pdf({
      path: out,
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
      timeout: 180_000,
    });
    await page.close();

    const pdf = await readFile(out, "latin1");
    const pdfPages = (pdf.match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
    const size = (await stat(out)).size;
    const mb = (size / 1024 / 1024).toFixed(2);
    const ok = pdfPages === pages;
    if (!ok) failed = true;
    console.log(
      `${ok ? "ok " : "!! "} ${path.relative(ROOT, out)}  ${mb} МБ, страниц PDF ${pdfPages} (в вёрстке ${pages}), шрифты ${fonts.loaded}/${fonts.total}`,
    );
    if (size > 3 * 1024 * 1024) console.warn(`    файл больше 3 МБ`);
  }
} finally {
  await browser.close();
}
if (failed) {
  console.error("Число страниц PDF не совпало с вёрсткой: где-то страница переполнена.");
  process.exit(1);
}
