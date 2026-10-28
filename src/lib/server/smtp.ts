import nodemailer, { type SendMailOptions } from "nodemailer";
import { brand } from "@/data/brand";
import { activeLocations } from "@/data/locations";
import { validEmail, type ContactPayload } from "@/lib/contact";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};
export function readSmtpConfig(
  env: Record<string, string | undefined> = process.env,
): SmtpConfig | null {
  if (!brand.features.contactForm || env.CONTACT_FORM_ENABLED !== "true")
    return null;
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.SMTP_FROM?.trim();
  const to = env.SMTP_TO?.trim() || brand.email;
  const port = Number(env.SMTP_PORT || "587");
  if (
    !host ||
    /[\s/@\x00-\x1f]/.test(host) ||
    !user ||
    !pass ||
    !from ||
    !validEmail(from) ||
    !validEmail(to) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    port === 25
  )
    return null;
  if (env.SMTP_SECURE && !["true", "false"].includes(env.SMTP_SECURE))
    return null;
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465;
  if (port === 465 && !secure) return null;
  return { host, port, secure, user, pass, from, to };
}
export function buildContactEmail(
  config: SmtpConfig,
  payload: ContactPayload,
): SendMailOptions {
  const location = activeLocations.find(
    (item) => item.id === payload.locationId,
  );
  return {
    from: { name: brand.name, address: config.from },
    to: config.to,
    replyTo: { name: payload.name, address: payload.email },
    subject: `${brand.name}: ${location ? location.name : "General inquiry"}`,
    text: [
      "Website contact / Contacto web",
      `Name / Nombre: ${payload.name}`,
      `Email / Correo: ${payload.email}`,
      `Location / Sucursal: ${location?.name || "General"}`,
      `Language / Idioma: ${payload.locale}`,
      "Contact consent / Consentimiento de contacto: yes / sí",
      "",
      payload.message,
    ].join("\n"),
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export function smtpTransport(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.pass },
    pool: false,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    logger: false,
    debug: false,
  });
}
export async function deliverContact(
  config: SmtpConfig,
  payload: ContactPayload,
): Promise<void> {
  const transport = smtpTransport(config);
  try {
    const result = await transport.sendMail(buildContactEmail(config, payload));
    if (!result.accepted?.length || result.rejected?.length)
      throw new Error("SMTP recipient not accepted");
  } finally {
    transport.close();
  }
}
