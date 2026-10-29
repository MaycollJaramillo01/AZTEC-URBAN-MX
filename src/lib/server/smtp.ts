import nodemailer, { type SendMailOptions } from "nodemailer";
import { brand } from "@/data/brand";
import { careersDictionary } from "@/data/careers-translations";
import { activeLocations } from "@/data/locations";
import type { ApplicationPayload } from "@/lib/careers";
import { validEmail, type ContactPayload } from "@/lib/contact";
import { emailHtml, mailto } from "./email-template";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  // Optional visible copy (Cc) of job applications.
  careersCc?: string;
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
  const careersCc = env.CAREERS_CC?.trim() || undefined;
  const port = Number(env.SMTP_PORT || "587");
  if (
    !host ||
    /[\s/@\x00-\x1f]/.test(host) ||
    !user ||
    !pass ||
    !from ||
    !validEmail(from) ||
    !validEmail(to) ||
    (careersCc && !validEmail(careersCc)) ||
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
  return { host, port, secure, user, pass, from, to, careersCc };
}
export function buildContactEmail(
  config: SmtpConfig,
  payload: ContactPayload,
): SendMailOptions {
  const location = activeLocations.find(
    (item) => item.id === payload.locationId,
  );
  const subject = `${brand.name}: ${location ? location.name : "General inquiry"}`;
  return {
    from: { name: brand.name, address: config.from },
    to: config.to,
    replyTo: { name: payload.name, address: payload.email },
    subject,
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
    html: emailHtml({
      preheader: `${payload.name} · ${location?.name || "General"}`,
      eyebrow: "Website message · Mensaje del sitio web",
      title: payload.name,
      rows: [
        {
          label: "Email · Correo",
          value: payload.email,
          href: mailto(payload.email),
        },
        { label: "Location · Sucursal", value: location?.name || "General" },
        {
          label: "Language · Idioma",
          value: payload.locale === "es" ? "Español" : "English",
        },
        { label: "Consent · Consentimiento", value: "Yes · Sí" },
      ],
      message: { label: "Message · Mensaje", text: payload.message },
      actions: [
        {
          label: "Reply · Responder",
          href: mailto(payload.email, `Re: ${subject}`),
        },
      ],
      footer: `Sent from the contact form on the ${brand.name} website. · Enviado desde el formulario de contacto del sitio web de ${brand.name}.`,
    }),
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export type CvAttachment = { content: Buffer; extension: string; type: string };
export function buildApplicationEmail(
  config: SmtpConfig,
  payload: ApplicationPayload,
  cv: CvAttachment,
): SendMailOptions {
  const location = activeLocations.find(
    (item) => item.id === payload.locationId,
  );
  // The attachment name is rebuilt from the validated name; the uploaded file name is never used.
  const slug = payload.name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const filename = `CV-${slug || "applicant"}.${cv.extension}`;
  const area = `${careersDictionary("en").positions[payload.position]} / ${careersDictionary("es").positions[payload.position]}`;
  const place = location?.name || "Any / Cualquiera";
  const tel = `tel:${payload.phone.replace(/[^\d+]/g, "")}`;
  return {
    from: { name: brand.name, address: config.from },
    to: config.to,
    cc: config.careersCc,
    replyTo: { name: payload.name, address: payload.email },
    subject: `${brand.name}: Job application / Solicitud de empleo - ${payload.name}`,
    text: [
      "Job application / Solicitud de empleo",
      `Name / Nombre: ${payload.name}`,
      `Email / Correo: ${payload.email}`,
      `Phone / Teléfono: ${payload.phone}`,
      `Area / Área: ${area}`,
      `Location / Sucursal: ${place}`,
      `Language / Idioma: ${payload.locale}`,
      "Application consent / Consentimiento de solicitud: yes / sí",
      "",
      payload.message,
    ].join("\n"),
    html: emailHtml({
      preheader: `${payload.name} · ${area} · ${place}`,
      eyebrow: "New job application · Nueva solicitud de empleo",
      title: payload.name,
      rows: [
        {
          label: "Email · Correo",
          value: payload.email,
          href: mailto(payload.email),
        },
        { label: "Phone · Teléfono", value: payload.phone, href: tel },
        { label: "Area · Área", value: area },
        { label: "Preferred location · Sucursal", value: place },
        {
          label: "Language · Idioma",
          value: payload.locale === "es" ? "Español" : "English",
        },
        { label: "Consent · Consentimiento", value: "Yes · Sí" },
      ],
      message: {
        label: "Experience and availability · Experiencia y disponibilidad",
        text: payload.message,
      },
      note: `CV attached at the end of this email (${cv.extension.toUpperCase()}) · CV adjunto al final de este correo`,
      actions: [
        {
          label: "Reply · Responder",
          href: mailto(
            payload.email,
            payload.locale === "es"
              ? `Tu solicitud en ${brand.name}`
              : `Your application at ${brand.name}`,
          ),
        },
        { label: "Call · Llamar", href: tel },
      ],
      footer: `Sent from the ${brand.name} careers form. It contains personal data: share it only with the hiring team. · Enviado desde el formulario de empleo de ${brand.name}. Contiene datos personales: compártelo solo con el equipo de selección.`,
    }),
    attachments: [
      { filename, content: cv.content, contentType: cv.type },
    ],
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
async function send(config: SmtpConfig, mail: SendMailOptions) {
  const transport = smtpTransport(config);
  try {
    const result = await transport.sendMail(mail);
    if (!result.accepted?.length || result.rejected?.length)
      throw new Error("SMTP recipient not accepted");
  } finally {
    transport.close();
  }
}
export async function deliverContact(
  config: SmtpConfig,
  payload: ContactPayload,
): Promise<void> {
  await send(config, buildContactEmail(config, payload));
}
export async function deliverApplication(
  config: SmtpConfig,
  payload: ApplicationPayload,
  cv: CvAttachment,
): Promise<void> {
  await send(config, buildApplicationEmail(config, payload, cv));
}
