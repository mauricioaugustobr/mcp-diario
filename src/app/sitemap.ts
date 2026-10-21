import type { MetadataRoute } from "next";
import { listDays, SITE } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE, changeFrequency: "daily", priority: 1 }, { url: `${SITE}/arquivo`, changeFrequency: "daily" },
    ...listDays().map((d) => ({ url: `${SITE}/dia/${d}`, lastModified: new Date(`${d}T23:59:00-03:00`) }))];
}
