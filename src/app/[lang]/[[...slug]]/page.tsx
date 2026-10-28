import { notFound } from "next/navigation";
import { isLocale, pageSlugs, type PageSlug } from "@/lib/i18n";
import { pageMetadata, structuredData } from "@/lib/seo";
import { locations } from "@/data/locations";
import { validateContent } from "@/lib/validate-content";
import {
  HomePage,
  MenusPage,
  LocationsPage,
  LocationPage,
  StoryPage,
  GalleryPage,
  ContactPage,
  PrivacyPage,
} from "@/components/pages";
type Props = { params: Promise<{ lang: string; slug?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug: slug ? slug.split("/") : [] }));
}
export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, slug?.join("/") || "");
}
export default async function Page({ params }: Props) {
  validateContent();
  const { lang, slug: segments } = await params;
  const slug = segments?.join("/") || "";
  if (!isLocale(lang) || !pageSlugs.includes(slug as PageSlug)) notFound();
  let content;
  switch (slug) {
    case "":
      content = <HomePage locale={lang} />;
      break;
    case "menu":
      content = <MenusPage locale={lang} />;
      break;
    case "locations":
      content = <LocationsPage locale={lang} />;
      break;
    case "story":
      content = <StoryPage locale={lang} />;
      break;
    case "gallery":
      content = <GalleryPage locale={lang} />;
      break;
    case "contact":
      content = <ContactPage locale={lang} />;
      break;
    case "privacy":
      content = <PrivacyPage locale={lang} />;
      break;
    default: {
      const location = locations.find(
        (item) => slug === `locations/${item.slug}`,
      );
      if (!location) notFound();
      content = <LocationPage locale={lang} location={location} />;
    }
  }
  const jsonLd = structuredData(lang, slug);
  return (
    <div className="page-content">
      {content}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
