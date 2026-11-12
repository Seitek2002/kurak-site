import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true: статический экспорт для https://seitek2002.github.io/kurak-site/
 * (npm run deploy:pages). На Pages нет сервера, поэтому API-роут заявки
 * (route.api.ts) в эту сборку не попадает, а форма честно говорит, что не подключена.
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/kurak-site" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath,
  ...(pages ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  // route.api.ts — серверный обработчик заявки, существует только в серверной сборке
  pageExtensions: pages ? ["tsx", "ts"] : ["tsx", "ts", "api.ts"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_LEAD_ENDPOINT: process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? (pages ? "" : "/api/lead"),
  },
  experimental: {
    // встраивание CSS проверяли: на мобильном Lighthouse хуже (CSS дублируется в RSC), оставляем файлами
    inlineCss: false,
  },
};

export default nextConfig;
