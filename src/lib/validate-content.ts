import { locations, isActiveLocationId, type Location } from "@/data/locations";
import { menus, type Menu } from "@/data/menus";
import images from "@/data/images.json";
import { isLocale } from "./i18n";

export function validateContent(
  locationData: Location[] = locations,
  menuData: Menu[] = menus,
) {
  const locationIds = new Set(locationData.map((location) => location.id));
  if (locationIds.size !== locationData.length)
    throw new Error("Duplicate location identifier");
  for (const location of locationData) {
    if (
      location.status === "coming_soon" &&
      (location.phone ||
        location.phoneHref ||
        location.hours ||
        location.menuReferences.length)
    )
      throw new Error(
        `Coming-soon location has operational data: ${location.id}`,
      );
    if (
      location.status === "open" &&
      (!location.phone || !location.phoneHref?.startsWith("tel:+1"))
    )
      throw new Error(
        `Operational location needs a valid phone: ${location.id}`,
      );
    for (const id of location.imageIds) {
      const image = images.find((item) => item.id === id);
      if (!image || image.locationId !== location.id)
        throw new Error(`Unverified location photograph: ${id}`);
    }
    for (const id of location.menuReferences) {
      if (
        !menuData.some(
          (menu) => menu.id === id && menu.locationId === location.id,
        )
      )
        throw new Error(`Invalid menu reference: ${id}`);
    }
  }
  const keys = new Set<string>();
  for (const menu of menuData) {
    if (
      !locationIds.has(menu.locationId) ||
      !isActiveLocationId(menu.locationId)
    )
      throw new Error(`Menu has no active location: ${menu.id}`);
    if (
      !isLocale(menu.locale) ||
      !menu.version ||
      !menu.confirmedAt ||
      !menu.categories.length
    )
      throw new Error(`Incomplete approved menu: ${menu.id}`);
    const key = `${menu.locationId}:${menu.locale}`;
    if (keys.has(key)) throw new Error(`Duplicate current menu for ${key}`);
    keys.add(key);
  }
}
