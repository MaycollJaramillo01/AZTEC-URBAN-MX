import type { ActiveLocationId } from "./locations";
import type { Locale } from "@/lib/i18n";

export type Menu = {
  id: string;
  locationId: ActiveLocationId;
  locale: Locale;
  version: string;
  confirmedAt: string;
  pdfUrl: string | null;
  categories: {
    name: string;
    items: { name: string; description?: string; price: string }[];
  }[];
};
// Add only client-approved, location-specific menus here. No sample menu in production data.
export const menus: Menu[] = [];
export function getMenu(
  locationId: ActiveLocationId,
  locale: Locale,
): Menu | undefined {
  return menus.find(
    (menu) => menu.locationId === locationId && menu.locale === locale,
  );
}
