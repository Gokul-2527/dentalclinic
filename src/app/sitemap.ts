import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/api/client";
import { siteUrl } from "@/lib/seo/metadata";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getSiteContent();
  return [{ url: siteUrl }, ...c.treatments.map((t) => ({ url: `${siteUrl}/treatments/${t.slug}` }))];
}
