"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
import { activeLocations } from "@/data/locations";
import { careersDictionary } from "@/data/careers-translations";
import {
  cvAccept,
  positions,
  validateApplication,
  type ApplicationField,
} from "@/lib/careers";
import { pathFor, type Locale } from "@/lib/i18n";
import { ActionLink } from "./interactions";
import { Icon } from "./icons";

export function CareersForm({ locale }: { locale: Locale }) {
  const t = careersDictionary(locale);
  const form = useRef<HTMLFormElement>(null);
  const pending = useRef(false);
  const [availability, setAvailability] = useState<
    "checking" | "ready" | "unavailable"
  >("checking");
  const [challenge, setChallenge] = useState<{
    question: string;
    token: string;
  } | null>(null);
  // Bumped whenever the server spends or rejects the current challenge.
  const [round, setRound] = useState(0);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ApplicationField[]>([]);
  const [feedback, setFeedback] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/careers", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        const ready =
          response.ok &&
          data.available === true &&
          typeof data.challenge?.token === "string";
        setChallenge(ready ? data.challenge : null);
        setAvailability(ready ? "ready" : "unavailable");
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("unavailable");
      });
    return () => controller.abort();
  }, [round]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || availability !== "ready" || !challenge) return;
    const data = new FormData(event.currentTarget);
    data.set("locale", locale);
    data.set("captchaToken", challenge.token);
    const result = validateApplication(data);
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
    let spent = true;
    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        body: data,
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
        // Only a verified challenge or a failed delivery uses up the token.
        spent = code === "captcha" || code === "send_failed";
        setFeedback({ text: t.errors[code], success: false });
        if (Array.isArray(answer.fields))
          setErrors(
            answer.fields.filter((field: ApplicationField) =>
              Object.hasOwn(t.errors, field),
            ),
          );
        if (code === "unavailable") setAvailability("unavailable");
      }
    } catch {
      setFeedback({ text: t.errors.send_failed, success: false });
    } finally {
      pending.current = false;
      setSending(false);
      if (spent) {
        const captcha = form.current?.elements.namedItem("captcha");
        if (captcha instanceof HTMLInputElement) captcha.value = "";
        setChallenge(null);
        setRound((value) => value + 1);
      }
    }
  }
  function fieldError(field: ApplicationField) {
    return errors.includes(field) ? (
      <span id={`careers-${field}-error`} className="field-error">
        {t.errors[field]}
      </span>
    ) : null;
  }
  function attributes(field: ApplicationField, hint?: string) {
    const described = [
      hint,
      errors.includes(field) && `careers-${field}-error`,
    ].filter(Boolean);
    return {
      "aria-invalid": errors.includes(field),
      "aria-describedby": described.join(" ") || undefined,
    };
  }
  return (
    <section
      id="apply"
      className="contact-form-section"
      aria-labelledby="careers-form-heading"
    >
      <div className="form-intro">
        <h2 id="careers-form-heading">{t.formTitle}</h2>
        <p>{t.formIntro}</p>
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
          <legend className="sr-only">{t.formTitle}</legend>
          <div className="form-fields-row">
            <div className="form-field">
              <label htmlFor="careers-name">{t.name}</label>
              <input
                id="careers-name"
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
              <label htmlFor="careers-email">{t.email}</label>
              <input
                id="careers-email"
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
          <div className="form-fields-row">
            <div className="form-field">
              <label htmlFor="careers-phone">{t.phone}</label>
              <input
                id="careers-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                required
                {...attributes("phone")}
              />
              {fieldError("phone")}
            </div>
            <div className="form-field">
              <label htmlFor="careers-position">{t.position}</label>
              <select
                id="careers-position"
                name="position"
                defaultValue=""
                required
                {...attributes("position")}
              >
                <option value="" disabled>
                  {t.choosePosition}
                </option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {t.positions[position]}
                  </option>
                ))}
              </select>
              {fieldError("position")}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="careers-location">{t.locationId}</label>
            <select
              id="careers-location"
              name="locationId"
              {...attributes("locationId")}
            >
              <option value="">{t.anyLocation}</option>
              {activeLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {fieldError("locationId")}
          </div>
          <div className="form-field">
            <label htmlFor="careers-message">{t.message}</label>
            <textarea
              id="careers-message"
              name="message"
              rows={4}
              maxLength={2000}
              {...attributes("message")}
            />
            {fieldError("message")}
          </div>
          <div className="form-field">
            <label htmlFor="careers-cv">{t.cv}</label>
            <input
              id="careers-cv"
              name="cv"
              type="file"
              accept={cvAccept}
              required
              {...attributes("cv", "careers-cv-hint")}
            />
            <span id="careers-cv-hint" className="field-hint">
              {t.cvHint}
            </span>
            {fieldError("cv")}
          </div>
          <div className="form-field">
            <label htmlFor="careers-captcha">{t.captcha}</label>
            <div className="captcha-row">
              <span id="careers-captcha-question" className="captcha-question">
                {challenge ? `${challenge.question} =` : "…"}
              </span>
              <input
                id="careers-captcha"
                name="captcha"
                inputMode="numeric"
                autoComplete="off"
                maxLength={3}
                required
                {...attributes("captcha", "careers-captcha-question")}
              />
            </div>
            {fieldError("captcha")}
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="careers-website">{t.honeypot}</label>
            <input
              id="careers-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="consent-field">
            <label htmlFor="careers-consent">
              <input
                id="careers-consent"
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
