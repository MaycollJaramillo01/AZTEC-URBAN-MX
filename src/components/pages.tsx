import Link from "next/link";
import { brand } from "@/data/brand";
import {
  locations,
  activeLocations,
  comingLocation,
  fullAddress,
  directionsUrl,
  type Location,
} from "@/data/locations";
import { dictionary, pathFor, type Locale } from "@/lib/i18n";
import { Photo, getImage } from "./photo";
import { Icon } from "./icons";
import { ActionLink, CopyAddress } from "./interactions";
import { LocationCard } from "./location-card";
import { MenuSelector } from "./menu-selector";
import { Gallery } from "./gallery";
import { ContactForm } from "./contact-form";

export function HomePage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{t.home.eyebrow}</p>
            <h1>{t.home.title}</h1>
            <p className="hero-intro">{t.home.intro}</p>
            <div className="hero-ctas">
              <Link
                href={pathFor(locale, "menu")}
                className="button button-gold"
              >
                {t.common.menus}
                <Icon name="arrow" />
              </Link>
              <Link href={pathFor(locale, "locations")} className="text-link">
                {t.common.locations}
                <Icon name="external" />
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Photo
              id="grill-board"
              locale={locale}
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 640px"
            />
          </div>
        </div>
      </section>
      <section className="section home-locations">
        <div className="container">
          <div className="section-heading compact">
            <h2>{t.home.locationTitle}</h2>
            <p>{t.home.locationIntro}</p>
          </div>
          <div className="locations-grid">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section flavor-section">
        <div className="container">
          <div className="section-heading">
            <h2>{t.home.flavorTitle}</h2>
            <p>{t.home.flavorIntro}</p>
          </div>
          <div className="flavor-grid">
            <figure className="flavor-main">
              <Photo id="tacos-board" locale={locale} />
              <figcaption>
                <h3>{t.home.tacos}</h3>
              </figcaption>
            </figure>
            <figure className="flavor-side">
              <Photo id="table-flavors" locale={locale} />
              <figcaption>
                <h3>{t.home.share}</h3>
              </figcaption>
            </figure>
            <figure className="flavor-small">
              <Photo id="grill-board" locale={locale} />
              <figcaption>
                <h3>{t.home.grill}</h3>
              </figcaption>
            </figure>
          </div>
          <div className="flavor-bottom">
            <p className="small-text">{t.common.vary}</p>
            <Link href={pathFor(locale, "menu")} className="text-link">
              {t.common.menus}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <section className="experience-section">
        <div className="container experience-grid">
          <div className="experience-copy">
            <h2>{t.home.experienceTitle}</h2>
            <p>{t.home.experienceIntro}</p>
            <Link
              href={pathFor(locale, "locations")}
              className="button button-cream"
            >
              {t.common.locations}
              <Icon name="arrow" />
            </Link>
          </div>
          <Photo id="aztec-interior" locale={locale} />
        </div>
      </section>
      <section className="section roots-section">
        <div className="container roots-grid">
          <h2>{t.home.storyTitle}</h2>
          <div>
            <p>{t.story.body}</p>
            <Link className="text-link" href={pathFor(locale, "story")}>
              {t.home.storyLink}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <section className="drinks-section">
        <div className="container drinks-grid">
          <Photo id="green-cocktail" locale={locale} />
          <div className="drinks-copy">
            <p className="eyebrow">{t.common.drinks}</p>
            <h2>{t.home.drinksTitle}</h2>
            <p>{t.home.drinksIntro}</p>
            <Link
              href={pathFor(locale, "menu")}
              className="button button-cream"
            >
              {t.common.menus}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <ComingBanner locale={locale} />
      <section className="section community-section">
        <div className="container">
          <div className="section-heading">
            <h2>{t.home.communityTitle}</h2>
            <p>{t.home.communityIntro}</p>
          </div>
          <div className="community-grid">
            {[
              "tacos-board",
              "green-cocktail",
              "aztec-interior",
              "table-flavors",
              "cocktail-pour",
              "grilled-seafood",
            ].map((id) => (
              <a
                key={id}
                href={getImage(id).sourcePostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="community-photo"
                data-event="click_social"
                aria-label={`${t.common.source}: ${locale === "es" ? getImage(id).altEs : getImage(id).altEn}`}
              >
                <Photo
                  id={id}
                  locale={locale}
                  sizes="(max-width: 767px) 50vw, 20vw"
                />
              </a>
            ))}
          </div>
          <div className="community-bottom">
            <Link className="text-link" href={pathFor(locale, "gallery")}>
              {t.common.gallery}
              <Icon name="arrow" />
            </Link>
            <div className="social-inline">
              {brand.socials.slice(0, 3).map((social) => (
                <ActionLink
                  href={social.url}
                  key={social.name}
                  external
                  locale={locale}
                  event="click_social"
                >
                  {social.name}
                  <Icon name="external" size={16} />
                </ActionLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ComingBanner({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="coming-banner">
      <div className="container coming-grid">
        <div>
          <span className="coming-label">{t.common.coming}</span>
          <h2>{t.home.comingTitle}</h2>
          <p>{t.home.comingIntro}</p>
          <Link
            className="text-link"
            href={pathFor(locale, "locations/fifth-street")}
          >
            {t.common.opening}
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="coming-address">
          <span className="coming-five" aria-hidden="true">
            5TH
          </span>
          <p>{fullAddress(comingLocation)}</p>
          <ActionLink
            href={brand.socials[0].url}
            locale={locale}
            external
            event="click_social"
            locationId="fifth-street"
            className="text-link"
          >
            {t.common.follow}
            <Icon name="external" />
          </ActionLink>
        </div>
      </div>
    </section>
  );
}

export function PageHeading({
  title,
  intro,
  eyebrow,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </div>
  );
}
export function MenusPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <div className="menu-page">
      <div className="container">
        <PageHeading title={t.menu.title} intro={t.menu.intro} />
        <div className="menu-page-grid">
          <MenuSelector locale={locale} />
          <aside className="menu-photo">
            <Photo id="tacos-board" locale={locale} priority />
            <p>{t.home.flavorIntro}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
export function LocationsPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <section className="locations-page section">
        <div className="container">
          <PageHeading title={t.locations.title} intro={t.locations.intro} />
          <div className="locations-grid">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                locale={locale}
                headingLevel={2}
              />
            ))}
          </div>
          <div className="locations-invitation">
            <h2>{t.locations.visitTitle}</h2>
            <p>{t.locations.visitIntro}</p>
            <Link className="text-link" href={pathFor(locale, "menu")}>
              {t.common.menus}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <ComingBanner locale={locale} />
    </>
  );
}
export function LocationPage({
  locale,
  location,
}: {
  locale: Locale;
  location: Location;
}) {
  const t = dictionary(locale);
  if (location.status === "coming_soon")
    return (
      <>
        <section className="future-page">
          <div className="container">
            <Link
              className="text-link backlink"
              href={pathFor(locale, "locations")}
            >
              <Icon name="left" />
              {t.common.back}
            </Link>
            <span className="coming-label">{t.common.coming}</span>
            <PageHeading
              title={t.home.comingTitle}
              intro={t.locations.futureBody}
            />
            <div className="future-address">
              <Icon name="pin" size={26} />
              <p>{fullAddress(location)}</p>
              <CopyAddress address={fullAddress(location)} locale={locale} />
            </div>
            <ActionLink
              href={location.socialLinks[0]}
              locale={locale}
              external
              event="click_social"
              locationId={location.id}
              className="button button-cream"
            >
              {t.locations.futureLink}
              <Icon name="external" />
            </ActionLink>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <h2>{t.locations.other}</h2>
              <p>{t.locations.otherBody}</p>
            </div>
            <div className="locations-grid two">
              {activeLocations.map((item) => (
                <LocationCard key={item.id} location={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  return (
    <>
      <section className="location-detail">
        <div className="container">
          <Link
            className="text-link backlink"
            href={pathFor(locale, "locations")}
          >
            <Icon name="left" />
            {t.common.back}
          </Link>
          <PageHeading
            eyebrow={brand.name}
            title={location.name}
            intro={t.locations.visitIntro}
          />
          <div className="visit-grid">
            <div className="visit-info">
              <span className="operational-label">{t.common.operational}</span>
              <div>
                <h2>{t.common.address}</h2>
                <address>{fullAddress(location)}</address>
                <CopyAddress address={fullAddress(location)} locale={locale} />
              </div>
              <div>
                <h2>{t.common.phone}</h2>
                <ActionLink
                  href={location.phoneHref}
                  locale={locale}
                  event="click_phone"
                  locationId={location.id}
                  className="phone-display"
                >
                  {location.phone}
                  <Icon name="phone" size={24} />
                </ActionLink>
              </div>
              <div>
                <h2>{t.locations.hoursTitle}</h2>
                <ActionLink
                  href={location.phoneHref}
                  locale={locale}
                  event="click_phone"
                  locationId={location.id}
                  className="text-link"
                >
                  {t.common.hours}
                  <Icon name="external" />
                </ActionLink>
              </div>
              <ActionLink
                href={directionsUrl(location)}
                locale={locale}
                external
                event="click_directions"
                locationId={location.id}
                className="button"
              >
                {t.common.directions}
                <Icon name="external" />
              </ActionLink>
            </div>
            <div className="visit-menu">
              <Icon name="pin" size={46} />
              <h2>
                {t.menu.menuTitle}
                <br />
                {location.name}
              </h2>
              <p>{t.menu.missing}</p>
              <p>{t.locations.menuIntro}</p>
              <ActionLink
                href={pathFor(locale, `menu?location=${location.id}`)}
                locale={locale}
                className="button button-cream"
                event="view_menu"
                locationId={location.id}
                selectLocation={location.id}
              >
                {t.common.menu}
                <Icon name="arrow" />
              </ActionLink>
              <ActionLink
                href={location.socialLinks[0]}
                locale={locale}
                external
                event="click_social"
                locationId={location.id}
                className="text-link"
              >
                {new URL(location.socialLinks[0]).pathname
                  .replaceAll("/", "@")
                  .replace(/@$/, "")}
                <Icon name="external" />
              </ActionLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export function StoryPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <>
      <section className="story-hero section">
        <div className="container">
          <PageHeading title={t.story.title} intro={t.story.intro} />
          <div className="story-body">
            <Photo id="tacos-board" locale={locale} priority />
            <div>
              <h2>{t.home.storyTitle}</h2>
              <p>{t.story.body}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="story-values section">
        <div className="container">
          <h2>{t.story.togetherTitle}</h2>
          <p>{t.story.togetherBody}</p>
          <div className="values-list">
            {[1, 2, 3].map((number) => (
              <div key={number}>
                <h3>
                  {t.story[`value${number}` as "value1" | "value2" | "value3"]}
                </h3>
                <p>
                  {
                    t.story[
                      `value${number}body` as
                        "value1body" | "value2body" | "value3body"
                    ]
                  }
                </p>
              </div>
            ))}
          </div>
          <Link
            className="button button-cream"
            href={pathFor(locale, "locations")}
          >
            {t.common.locations}
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
export function GalleryPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="gallery-page section">
      <div className="container">
        <PageHeading title={t.gallery.title} intro={t.gallery.intro} />
        <Gallery locale={locale} />
      </div>
    </section>
  );
}
export function ContactPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="section contact-page">
      <div className="container">
        <PageHeading title={t.contact.title} intro={t.contact.intro} />
        {brand.features.contactForm && <ContactForm locale={locale} />}
        <div className="contact-grid">
          <div className="contact-email">
            <Icon name="email" size={36} />
            <h2>{t.contact.emailTitle}</h2>
            <p>{t.contact.emailBody}</p>
            <ActionLink
              href={`mailto:${brand.email}`}
              className="email-display"
              locale={locale}
              event="click_email"
            >
              {brand.email}
              <Icon name="external" size={25} />
            </ActionLink>
          </div>
          <div className="contact-phones">
            <h2>{t.contact.phoneTitle}</h2>
            {activeLocations.map((location) => (
              <div key={location.id}>
                <h3>
                  <Link href={pathFor(locale, `locations/${location.slug}`)}>
                    {location.name}
                  </Link>
                </h3>
                <p>{fullAddress(location)}</p>
                <ActionLink
                  href={location.phoneHref}
                  className="text-link"
                  locale={locale}
                  event="click_phone"
                  locationId={location.id}
                >
                  <Icon name="phone" />
                  {location.phone}
                </ActionLink>
              </div>
            ))}
          </div>
          <div className="contact-social">
            <h2>{t.contact.socialTitle}</h2>
            <p>{t.contact.socialIntro}</p>
            {brand.socials.map((social) => (
              <ActionLink
                key={social.name}
                href={social.url}
                locale={locale}
                external
                event="click_social"
                className="text-link"
              >
                {social.name}
                <Icon name="external" />
              </ActionLink>
            ))}
          </div>
          <div className="contact-future">
            <span className="coming-label">{t.common.coming}</span>
            <h2>{t.contact.nextTitle}</h2>
            <p>{fullAddress(comingLocation)}</p>
            <Link
              className="text-link"
              href={pathFor(locale, "locations/fifth-street")}
            >
              {t.common.opening}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  return (
    <section className="section">
      <div className="container privacy-content">
        <PageHeading title={t.privacy.title} intro={t.privacy.intro} />
        <p className="small-text">{t.privacy.review}</p>
        {(
          ["local", "analytics", "external", "contact", "hosting"] as const
        ).map((key) => (
          <section key={key}>
            <h2>{t.privacy[`${key}Title`]}</h2>
            <p>{t.privacy[`${key}Body`]}</p>
          </section>
        ))}
        <ActionLink
          href={`mailto:${brand.email}`}
          className="text-link"
          event="click_email"
          locale={locale}
        >
          {brand.email}
          <Icon name="external" />
        </ActionLink>
      </div>
    </section>
  );
}
