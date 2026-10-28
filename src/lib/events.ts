import type { ActiveLocationId, LocationId } from "@/data/locations";
import type { Locale } from "./i18n";
export type InteractionName =
  | "select_location"
  | "view_menu"
  | "click_phone"
  | "click_directions"
  | "click_email"
  | "click_social";
// Browser-only events. No network, persistent event log, or analytics integration.
export function interaction(
  name: InteractionName,
  language: Locale,
  location_id: LocationId | null = null,
) {
  window.dispatchEvent(
    new CustomEvent("aztec:interaction", {
      detail: { name, language, location_id },
    }),
  );
}
export const preferenceKey = "aztec:location";
export function saveLocation(locationId: ActiveLocationId) {
  try {
    localStorage.setItem(preferenceKey, locationId);
  } catch {
    /* The selector still works when storage is disabled. */
  }
}
