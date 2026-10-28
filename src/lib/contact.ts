import { isActiveLocationId, type ActiveLocationId } from "@/data/locations";
import { isLocale, type Locale } from "./i18n";

export type ContactField =
  "name" | "email" | "message" | "consent" | "locationId";
export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  consent: true;
  locale: Locale;
  locationId: ActiveLocationId | null;
  website: string;
};
export type ContactResult =
  { ok: true; data: ContactPayload } | { ok: false; fields: ContactField[] };
export function validEmail(value: string) {
  return (
    value.length <= 254 &&
    /^[^\s@<>(),:;"\\[\]]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value)
  );
}
export function validateContact(value: unknown): ContactResult {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { ok: false, fields: ["name", "email", "message", "consent"] };
  const input = value as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const message =
    typeof input.message === "string"
      ? input.message.trim().replace(/\r\n/g, "\n")
      : "";
  const fields: ContactField[] = [];
  if (name.length < 2 || name.length > 100 || /[\r\n\x00-\x1f\x7f]/.test(name))
    fields.push("name");
  if (!validEmail(email)) fields.push("email");
  if (
    message.length < 10 ||
    message.length > 4000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)
  )
    fields.push("message");
  if (input.consent !== true) fields.push("consent");
  const locationId =
    input.locationId === "" || input.locationId === null
      ? null
      : input.locationId;
  if (locationId !== null && !isActiveLocationId(locationId))
    fields.push("locationId");
  if (
    fields.length ||
    !isLocale(String(input.locale)) ||
    typeof input.website !== "string" ||
    input.website.trim()
  )
    return { ok: false, fields };
  return {
    ok: true,
    data: {
      name,
      email,
      message,
      consent: true,
      locale: input.locale as Locale,
      locationId: locationId as ActiveLocationId | null,
      website: "",
    },
  };
}
