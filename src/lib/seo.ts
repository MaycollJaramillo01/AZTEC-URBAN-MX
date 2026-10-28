import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { activeLocations, fullAddress } from "@/data/locations";
import { dictionary, locales, pathFor, type Locale } from "./i18n";

export function productionOrigin(): string | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
export function isIndexable() {
  return process.env.SITE_INDEXABLE === "true" && Boolean(productionOrigin());
}
export function pageMetadata(locale: Locale, slug: string): Metadata {
  const t = dictionary(locale);
  const location = activeLocations.find(
    (item) => slug === `locations/${item.slug}`,
  );
  const titleMap: Record<string, string> = {
    menu: t.meta.menu,
    locations: t.meta.locations,
    story: t.meta.story,
    gallery: t.meta.gallery,
    contact: t.meta.contact,
    privacy: t.meta.privacy,
    "locations/fifth-street": t.meta.future,
  };
  const title = !slug
    ? t.meta.home
    : `${location ? `${locale === "es" ? "Visita" : "Visit"} ${location.name}, Tyler` : titleMap[slug] || t.meta.locations} | ${brand.name}`;
  const descriptions: Record<string, string> =
    locale === "en"
      ? {
          menu: "Choose your Aztec Urban MX Broadway location in Tyler to ask about current menus, food, drinks, and availability.",
          locations:
            "Find Aztec Urban MX at 7918 or 2127 S. Broadway in Tyler, Texas. Get directions and phone numbers, and follow our future 5th Street opening.",
          story:
            "Get to know Aztec Urban MX, where Mexican cultural traditions and contemporary energy bring people together in Tyler, Texas.",
          gallery:
            "Explore real photographs of Aztec Urban MX food, cocktails, and restaurant atmosphere, with links to their original Instagram posts.",
          contact:
            "Contact Aztec Urban MX at info@aztecmx.com or call your Broadway restaurant in Tyler for current menus and hours.",
          privacy:
            "Learn about local menu preferences, external links, and information handling on the Aztec Urban MX website.",
          "locations/fifth-street":
            "Aztec Urban MX is coming soon to 1125 E. 5th Street, Tyler, TX 75701. Follow our brand account for opening updates.",
        }
      : {
          menu: "Elige tu sucursal de Aztec Urban MX en Broadway, Tyler, para consultar el menú, la comida, las bebidas y la disponibilidad vigente.",
          locations:
            "Encuentra Aztec Urban MX en 7918 o 2127 S. Broadway, Tyler, Texas. Consulta direcciones y teléfonos y sigue la futura apertura en 5th Street.",
          story:
            "Conoce Aztec Urban MX, donde las tradiciones culturales mexicanas y la energía contemporánea reúnen a las personas en Tyler, Texas.",
          gallery:
            "Explora fotografías reales de la comida, los cocteles y el ambiente de Aztec Urban MX, con enlaces a sus publicaciones originales en Instagram.",
          contact:
            "Contacta a Aztec Urban MX en info@aztecmx.com o llama a tu sucursal de Broadway en Tyler para consultar el menú y los horarios vigentes.",
          privacy:
            "Conoce cómo este sitio maneja la preferencia de sucursal, los enlaces externos y la información de sus visitantes.",
          "locations/fifth-street":
            "Aztec Urban MX llegará próximamente a 1125 E. 5th Street, Tyler, TX 75701. Sigue las novedades de apertura en nuestra cuenta de marca.",
        };
  const description = location
    ? locale === "en"
      ? `Visit Aztec Urban MX at ${fullAddress(location)}. Call ${location.phone} for current hours and menu information.`
      : `Visita Aztec Urban MX en ${fullAddress(location)}. Llama al ${location.phone} para consultar el menú y los horarios vigentes.`
    : descriptions[slug] || t.meta.description;
  const origin = productionOrigin();
  return {
    title,
    description,
    robots: { index: isIndexable(), follow: isIndexable() },
    ...(origin
      ? {
          metadataBase: new URL(origin),
          alternates: {
            canonical: `${origin}${pathFor(locale, slug)}`,
            languages: Object.fromEntries(
              locales.map((lang) => [lang, `${origin}${pathFor(lang, slug)}`]),
            ),
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
      siteName: brand.name,
    },
    // No social image is emitted until its publication rights are approved.
  };
}
export function structuredData(locale: Locale, slug: string) {
  const origin = productionOrigin();
  if (!isIndexable() || !origin) return null;
  const organization = {
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: brand.name,
    url: origin,
    email: brand.email,
    sameAs: brand.socials.map((social) => social.url),
  };
  const selected = slug.startsWith("locations/")
    ? activeLocations.filter(
        (location) => slug === `locations/${location.slug}`,
      )
    : slug === "" || slug === "locations"
      ? activeLocations
      : [];
  const restaurants = selected.map((location) => ({
    "@type": "Restaurant",
    "@id": `${origin}/#${location.id}`,
    name: `${brand.name} - ${location.name}`,
    url: `${origin}${pathFor(locale, `locations/${location.slug}`)}`,
    telephone: location.phoneHref.replace("tel:", ""),
    servesCuisine: "Mexican",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address.street,
      addressLocality: "Tyler",
      addressRegion: "TX",
      postalCode: location.address.postalCode,
      addressCountry: "US",
    },
    parentOrganization: { "@id": `${origin}/#organization` },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [organization, ...restaurants],
  };
}
