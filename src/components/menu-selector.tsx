"use client";
import { useEffect, useState } from "react";
import {
  activeLocations,
  isActiveLocationId,
  fullAddress,
  directionsUrl,
  type ActiveLocationId,
} from "@/data/locations";
import { getMenu } from "@/data/menus";
import { dictionary, pathFor, type Locale } from "@/lib/i18n";
import { preferenceKey, saveLocation, interaction } from "@/lib/events";
import { Icon } from "./icons";
import { ActionLink } from "./interactions";

export function MenuSelector({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const [selected, setSelected] = useState<ActiveLocationId | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let candidate: unknown = params.get("location");
    if (!params.has("location")) {
      try {
        candidate = localStorage.getItem(preferenceKey);
      } catch {
        /* Browser storage is optional. */
      }
    }
    if (isActiveLocationId(candidate)) {
      // Hydrate a browser-only preference after the server renders the neutral selector.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(candidate);
      saveLocation(candidate);
      interaction("view_menu", locale, candidate);
    }
  }, [locale]);
  const location = activeLocations.find((item) => item.id === selected);
  const menu = selected ? getMenu(selected, locale) : undefined;
  function choose(id: ActiveLocationId) {
    setSelected(id);
    saveLocation(id);
    const url = new URL(window.location.href);
    url.searchParams.set("location", id);
    window.history.replaceState(null, "", url);
    interaction("select_location", locale, id);
    interaction("view_menu", locale, id);
  }
  return (
    <div className="menu-experience">
      <fieldset className="location-picker">
        <legend>{t.common.change}</legend>
        <div className="location-options">
          {activeLocations.map((item) => (
            <label
              className={`location-option ${selected === item.id ? "is-selected" : ""}`}
              key={item.id}
            >
              <input
                type="radio"
                name="menu-location"
                value={item.id}
                checked={selected === item.id}
                onChange={() => choose(item.id)}
              />
              <span>
                <strong>{item.name}</strong>
                <span>Tyler, TX {item.address.postalCode}</span>
              </span>
              <Icon name="pin" size={24} />
            </label>
          ))}
        </div>
      </fieldset>
      <section
        className="menu-result"
        aria-live="polite"
        aria-atomic="true"
        aria-label={t.common.selected}
      >
        {!location ? (
          <div className="menu-neutral">
            <Icon name="pin" size={40} />
            <p>{t.menu.choose}</p>
          </div>
        ) : (
          <>
            <div className="selected-location">
              <span className="small-label">{t.common.selected}</span>
              <h2>{location.name}</h2>
              <p>{fullAddress(location)}</p>
            </div>
            {menu ? (
              <div className="approved-menu">
                <p className="small-text">
                  {t.menu.confirmed}: {menu.confirmedAt} / {t.menu.version}:{" "}
                  {menu.version}
                </p>
                {menu.categories.map((category) => (
                  <section key={category.name}>
                    <h3>{category.name}</h3>
                    <dl>
                      {category.items.map((item) => (
                        <div key={item.name}>
                          <dt>
                            {item.name}
                            {item.description && <p>{item.description}</p>}
                          </dt>
                          <dd>{item.price}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
                {menu.pdfUrl && (
                  <a href={menu.pdfUrl} className="text-link" download>
                    {t.menu.pdf}
                    <Icon name="external" />
                  </a>
                )}
              </div>
            ) : (
              <div className="menu-unavailable">
                <h3>{t.menu.missing}</h3>
                <p>{t.menu.missingBody}</p>
                <ActionLink
                  href={location.phoneHref}
                  className="button"
                  event="click_phone"
                  locale={locale}
                  locationId={location.id}
                >
                  <Icon name="phone" />
                  {t.menu.callPrefix} {location.phone}
                </ActionLink>
              </div>
            )}
            <div className="menu-location-links">
              <ActionLink
                href={pathFor(locale, `locations/${location.slug}`)}
                locale={locale}
                className="text-link"
              >
                {t.menu.locationLink}
                <Icon name="arrow" />
              </ActionLink>
              <ActionLink
                href={directionsUrl(location)}
                locale={locale}
                className="text-link"
                event="click_directions"
                locationId={location.id}
                external
              >
                {t.common.directions}
                <Icon name="external" />
              </ActionLink>
            </div>
          </>
        )}
      </section>
      <p className="small-text menu-note">{t.common.vary}</p>
    </div>
  );
}
