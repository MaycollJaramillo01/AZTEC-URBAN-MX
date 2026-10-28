import type { MetadataRoute } from "next";
import { isIndexable, productionOrigin } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return isIndexable()
    ? {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${productionOrigin()}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
