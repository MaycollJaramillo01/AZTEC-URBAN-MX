import Link from "next/link";
import { brand } from "@/data/brand";
import { locations, fullAddress } from "@/data/locations";
import { dictionary, pathFor, type Locale } from "@/lib/i18n";
import { Icon } from "./icons";
import { LanguageSwitch, MobileMenu, ActionLink } from "./interactions";

export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link
      className="wordmark"
      href={pathFor(locale)}
      aria-label={`${brand.name}, ${dictionary(locale).nav.home}`}
    >
      AZTEC <small>URBAN MX</small>
    </Link>
  );
}
export function Header({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Wordmark locale={locale} />
          <nav className="desktop-nav" aria-label={t.nav.label}>
            {(
              ["menu", "locations", "story", "gallery", "contact"] as const
            ).map((slug) => (
              <Link key={slug} href={pathFor(locale, slug)}>
                {t.nav[slug]}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSwitch locale={locale} />
            <Link
              className="button header-cta"
              href={pathFor(locale, "locations")}
            >
              {t.nav.find}
              <Icon name="external" size={18} />
            </Link>
            <MobileMenu locale={locale} />
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark locale={locale} />
            <p>{t.footer.description}</p>
            <ActionLink
              href={`mailto:${brand.email}`}
              event="click_email"
              locale={locale}
              className="text-link"
            >
              {brand.email}
              <Icon name="external" size={18} />
            </ActionLink>
          </div>
          <div className="footer-locations">
            {locations.map((location) => (
              <div key={location.id}>
                <Link
                  className="footer-location-title"
                  href={pathFor(locale, `locations/${location.slug}`)}
                >
                  {location.name}
                </Link>
                <p>{fullAddress(location)}</p>
                {location.status === "open" ? (
                  <ActionLink
                    href={location.phoneHref}
                    event="click_phone"
                    locale={locale}
                    locationId={location.id}
                  >
                    {location.phone}
                  </ActionLink>
                ) : (
                  <span className="footer-coming">{t.common.coming}</span>
                )}
              </div>
            ))}
          </div>
          <div className="footer-social">
            <h2>{t.footer.social}</h2>
            {brand.socials.map((social) => (
              <ActionLink
                key={social.name}
                href={social.url}
                external
                event="click_social"
                locale={locale}
              >
                {social.name}
                <Icon name="external" size={16} />
              </ActionLink>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {brand.name}. {t.common.copyright}
          </p>
          <nav aria-label={t.footer.explore}>
            <Link href={pathFor(locale, "contact")}>{t.nav.contact}</Link>
            <Link href={pathFor(locale, "privacy")}>{t.nav.privacy}</Link>
            <LanguageSwitch locale={locale} />
          </nav>
        </div>
      </div>
    </footer>
  );
}
