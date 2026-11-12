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
  ];
}
