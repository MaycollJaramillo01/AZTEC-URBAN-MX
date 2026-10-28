"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
import { activeLocations } from "@/data/locations";
import { contactDictionary } from "@/data/contact-translations";
import { validateContact, type ContactField } from "@/lib/contact";
import { pathFor, type Locale } from "@/lib/i18n";
import { ActionLink } from "./interactions";
import { Icon } from "./icons";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = contactDictionary(locale);
  const form = useRef<HTMLFormElement>(null);
  const pending = useRef(false);
  const [availability, setAvailability] = useState<
    "checking" | "ready" | "unavailable"
  >("checking");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ContactField[]>([]);
  const [feedback, setFeedback] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/contact", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        setAvailability(
          response.ok && data.available === true ? "ready" : "unavailable",
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("unavailable");
      });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || availability !== "ready") return;
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      locationId: data.get("locationId"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
      locale,
    };
    const result = validateContact(payload);
    setErrors([]);
    setFeedback(null);
    if (!result.ok) {
      setErrors(result.fields);
      setFeedback({ text: t.errors.invalid, success: false });
      (
        form.current?.elements.namedItem(result.fields[0]) as HTMLElement | null
      )?.focus();
      return;
    }
    pending.current = true;
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const answer = await response.json();
      if (response.ok && answer.ok === true) {
        form.current?.reset();
        setFeedback({ text: t.success, success: true });
      } else {
        const code =
          typeof answer.code === "string" &&
          Object.hasOwn(t.errors, answer.code)
            ? (answer.code as keyof typeof t.errors)
            : "send_failed";
        setFeedback({ text: t.errors[code], success: false });
        if (Array.isArray(answer.fields))
          setErrors(
            answer.fields.filter((field: ContactField) =>
              ["name", "email", "message", "consent", "locationId"].includes(
                field,
              ),
            ),
          );
        if (code === "unavailable") setAvailability("unavailable");
      }
    } catch {
      setFeedback({ text: t.errors.send_failed, success: false });
    } finally {
      pending.current = false;
      setSending(false);
    }
  }
  function fieldError(field: ContactField) {
    return errors.includes(field) ? (
      <span id={`contact-${field}-error`} className="field-error">
        {t.errors[field]}
      </span>
    ) : null;
  }
  function attributes(field: ContactField) {
    return {
      "aria-invalid": errors.includes(field),
      "aria-describedby": errors.includes(field)
        ? `contact-${field}-error`
        : undefined,
    };
  }
  return (
    <section
      className="contact-form-section"
      aria-labelledby="contact-form-heading"
    >
      <div className="form-intro">
        <h2 id="contact-form-heading">{t.title}</h2>
        <p>{t.intro}</p>
        <ActionLink
          href={`mailto:${brand.email}`}
          locale={locale}
          event="click_email"
          className="text-link"
        >
          {brand.email}
          <Icon name="external" />
        </ActionLink>
      </div>
      <form
        ref={form}
        className="contact-form"
        onSubmit={submit}
        noValidate
        aria-busy={sending}
      >
        {availability !== "ready" && (
          <p className="form-availability" role="status">
            {availability === "checking" ? t.checking : t.unavailable}
          </p>
        )}
        <fieldset disabled={availability !== "ready" || sending}>
          <legend className="sr-only">{t.title}</legend>
          <div className="form-fields-row">
            <div className="form-field">
              <label htmlFor="contact-name">{t.name}</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                required
                {...attributes("name")}
              />
              {fieldError("name")}
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">{t.email}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                {...attributes("email")}
              />
              {fieldError("email")}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-location">{t.locationId}</label>
            <select
              id="contact-location"
              name="locationId"
              {...attributes("locationId")}
            >
              <option value="">{t.general}</option>
              {activeLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {fieldError("locationId")}
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">{t.message}</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              minLength={10}
              maxLength={4000}
              required
              {...attributes("message")}
            />
            {fieldError("message")}
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{t.honeypot}</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="consent-field">
            <label htmlFor="contact-consent">
              <input
                id="contact-consent"
                name="consent"
                type="checkbox"
                required
                {...attributes("consent")}
              />
              <span>{t.consent}</span>
            </label>
            {fieldError("consent")}
            <Link
              href={pathFor(locale, "privacy")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.privacy}
              <Icon name="external" size={14} />
            </Link>
          </div>
          <button type="submit" className="button" disabled={sending}>
            {sending ? t.sending : t.submit}
            <Icon name="arrow" />
          </button>
        </fieldset>
        {feedback && (
          <p
            className={`form-feedback ${feedback.success ? "is-success" : "is-error"}`}
            role={feedback.success ? "status" : "alert"}
          >
            {feedback.text}
          </p>
        )}
      </form>
    </section>
  );
}
