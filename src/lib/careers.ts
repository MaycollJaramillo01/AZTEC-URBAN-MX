import { isActiveLocationId, type ActiveLocationId } from "@/data/locations";
import { validEmail } from "./contact";
import { isLocale, type Locale } from "./i18n";

export const positions = [
  "kitchen",
  "service",
  "bar",
  "host",
  "management",
  "other",
] as const;
export type Position = (typeof positions)[number];
// ponytail: 4 MiB keeps the whole multipart request under Vercel's 4.5 MB function body limit.
export const maxCvBytes = 4 * 1024 * 1024;
// The server trusts these leading bytes, never the file name or the browser's type.
export const cvFormats = [
  { extension: "pdf", type: "application/pdf", magic: "255044462d" },
  {
    extension: "docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: "504b0304",
  },
  { extension: "doc", type: "application/msword", magic: "d0cf11e0a1b11ae1" },
  { extension: "jpg", type: "image/jpeg", magic: "ffd8ff" },
  { extension: "png", type: "image/png", magic: "89504e470d0a1a0a" },
] as const;
export const cvAccept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
export type ApplicationField =
  | "name"
  | "email"
  | "phone"
  | "position"
  | "locationId"
  | "message"
  | "cv"
  | "consent"
  | "captcha";
export type ApplicationPayload = {
  name: string;
  email: string;
  phone: string;
  position: Position;
  locationId: ActiveLocationId | null;
  message: string;
  locale: Locale;
};
export type ApplicationResult =
  | { ok: true; data: ApplicationPayload; cv: File }
  | { ok: false; fields: ApplicationField[] };
// Shared by the browser and the API, so both reject the same multipart form.
export function validateApplication(form: FormData): ApplicationResult {
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = text("name");
  const email = text("email");
  const phone = text("phone");
  const position = text("position") as Position;
  const locationId = text("locationId") || null;
  const message = text("message").replace(/\r\n/g, "\n");
  const cv = form.get("cv");
  const digits = phone.replace(/\D/g, "").length;
  const fields: ApplicationField[] = [];
  if (name.length < 2 || name.length > 100 || /[\x00-\x1f\x7f]/.test(name))
    fields.push("name");
  if (!validEmail(email)) fields.push("email");
  if (!/^[+\d\s().-]{7,25}$/.test(phone) || digits < 7 || digits > 15)
    fields.push("phone");
  if (!positions.includes(position)) fields.push("position");
  if (locationId !== null && !isActiveLocationId(locationId))
    fields.push("locationId");
  if (
    message.length > 2000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)
  )
    fields.push("message");
  if (
    typeof cv === "string" ||
    !cv ||
    cv.size < 1 ||
    cv.size > maxCvBytes ||
    !/\.(pdf|docx?|jpe?g|png)$/i.test(cv.name)
  )
    fields.push("cv");
  if (form.get("consent") !== "on") fields.push("consent");
  if (!/^\d{1,3}$/.test(text("captcha"))) fields.push("captcha");
  if (fields.length || !isLocale(text("locale")) || text("website"))
    return { ok: false, fields };
  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      position,
      locationId: locationId as ActiveLocationId | null,
      message,
      locale: text("locale") as Locale,
    },
    cv: cv as File,
  };
}
