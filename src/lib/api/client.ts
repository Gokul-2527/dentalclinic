import type { SiteContent } from "@/types/content";
import { mockContent } from "./mock";
const BASE = process.env.CONTENT_API_BASE_URL;
/** Contract: GET {BASE}/site-content -> SiteContent. Uses the mock adapter when BASE is unset. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!BASE) return mockContent;
  const res = await fetch(`${BASE}/site-content`, { next: { revalidate: 300, tags: ["site-content"] } });
  if (!res.ok) throw new Error(`Content API failed: ${res.status}`);
  return (await res.json()) as SiteContent;
}
