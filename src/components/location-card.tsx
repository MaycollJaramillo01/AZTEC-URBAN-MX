import Link from "next/link";
import { fullAddress, directionsUrl, type Location } from "@/data/locations";
import { dictionary, pathFor, type Locale } from "@/lib/i18n";
import { ActionLink } from "./interactions";
import { Icon } from "./icons";

export function LocationCard({
  location,
  locale,
  headingLevel = 3,
}: {
  location: Location;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const t = dictionary(locale);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={`location-card ${location.status === "coming_soon" ? "location-coming" : ""}`}
    >
      <div className="location-card-status">
        <Icon name="pin" size={21} />
        <span>
          {location.status === "coming_soon"
            ? t.common.coming
            : t.common.operational}
        </span>
      </div>
      <Heading>
        <Link href={pathFor(locale, `locations/${location.slug}`)}>
          {location.name}
        </Link>
      </Heading>
      <p className="location-address">{fullAddress(location)}</p>
      {location.status === "open" ? (
        <>
          <ActionLink
            href={pathFor(locale, `menu?location=${location.id}`)}
            className="text-link location-menu"
            locale={locale}
            event="view_menu"
            locationId={location.id}
            selectLocation={location.id}
          >
            {t.common.menu}
            <Icon name="arrow" />
          </ActionLink>
          <div className="location-card-bottom">
            <ActionLink
              href={directionsUrl(location)}
              external
              locale={locale}
              event="click_directions"
              locationId={location.id}
            >
              <Icon name="external" size={18} />
              {t.common.directions}
            </ActionLink>
            <ActionLink
              href={location.phoneHref}
              locale={locale}
              event="click_phone"
              locationId={location.id}
            >
              <Icon name="phone" size={17} />
              {location.phone}
            </ActionLink>
          </div>
        </>
      ) : (
        <>
          <p className="future-card-note">{t.locations.futureIntro}</p>
          <Link
            className="text-link"
            href={pathFor(locale, `locations/${location.slug}`)}
          >
            {t.common.opening}
            <Icon name="arrow" />
          </Link>
        </>
      )}
    </article>
  );
}
