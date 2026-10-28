import type { MetadataRoute } from "next";
import { locales, pageSlugs, pathFor } from "@/lib/i18n";
import { isIndexable, productionOrigin } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  const origin = productionOrigin()!;
  return locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({
      url: `${origin}${pathFor(locale, slug)}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${origin}${pathFor(lang, slug)}`]),
        ),
      },
    })),
  );
}
