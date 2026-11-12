import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // CSS сайта небольшой: встраиваем в HTML, чтобы не блокировал первую отрисовку на мобильных
    inlineCss: false,
  },
};

export default nextConfig;
