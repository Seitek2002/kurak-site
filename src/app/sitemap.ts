import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/komanda`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/v2`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/v3`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/v3/kg`, changeFrequency: "monthly", priority: 0.8 },
    // Варианты 4–13 с новым логотипом: у каждого русская и кыргызская страница
    ...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].flatMap((n) => [
      { url: `${SITE.url}/v${n}`, changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${SITE.url}/v${n}/kg`, changeFrequency: "monthly" as const, priority: 0.8 },
    ]),
  ];
}
