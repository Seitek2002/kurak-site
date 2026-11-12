/**
 * Публикация на GitHub Pages: статическая сборка → ветка gh-pages.
 * Запуск: npm run deploy:pages
 * Сайт: https://seitek2002.github.io/kurak-site/
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const out = (cmd, opts = {}) => execSync(cmd, { encoding: "utf8", ...opts }).trim();

const root = process.cwd();
const dir = join(root, "out");
const remote = out("git remote get-url origin");
const sha = out("git rev-parse --short HEAD");
const dirty = out("git status --porcelain") ? " + незакоммиченные правки" : "";

if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
const noPush = process.argv.includes("--no-push");
run("npx next build", {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seitek2002.github.io/kurak-site",
  },
});

/**
 * Next 16 кладёт данные предзагрузки сегментов в папки вида komanda/__next.komanda/__PAGE__.txt,
 * а клиент запрашивает плоское имя komanda/__next.komanda.__PAGE__.txt. На статическом хостинге
 * это 404 в консоли при наведении на ссылку. Дублируем файлы под плоскими именами.
 */
function flattenSegments(d) {
  for (const name of readdirSync(d)) {
    const full = join(d, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      const walk = (x) => {
        for (const n of readdirSync(x)) {
          const f = join(x, n);
          if (statSync(f).isDirectory()) walk(f);
          else copyFileSync(f, join(d, `${name}.${relative(full, f).split(sep).join(".")}`));
        }
      };
      walk(full);
    } else if (name !== "_next") flattenSegments(full);
  }
}
flattenSegments(dir);

// Без .nojekyll GitHub Pages прячет папку _next
writeFileSync(join(dir, ".nojekyll"), "");

if (noPush) {
  console.log("\nСборка в out/, публикация пропущена (--no-push)");
  process.exit(0);
}

const git = (args) => run(`git ${args}`, { cwd: dir });
git("init -q -b gh-pages");
git("add -A");
git(`commit -q -m "Deploy ${sha}${dirty}"`);
git(`push -f ${remote} gh-pages`);
rmSync(join(dir, ".git"), { recursive: true, force: true });
console.log("\nОпубликовано: https://seitek2002.github.io/kurak-site/");
