"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  dictionary,
  alternateLanguagePath,
  navSlugs,
  pathFor,
  type Locale,
} from "@/lib/i18n";
import { interaction, saveLocation, type InteractionName } from "@/lib/events";
import type { ActiveLocationId, LocationId } from "@/data/locations";
import { Icon } from "./icons";
import { keepFocusInDialog } from "@/lib/dialog";

export function ActionLink({
  href,
  children,
  event,
  locale,
  locationId = null,
  className = "",
  external = false,
  selectLocation,
}: {
  href: string;
  children: ReactNode;
  event?: InteractionName;
  locale: Locale;
  locationId?: LocationId | null;
  className?: string;
  external?: boolean;
  selectLocation?: ActiveLocationId;
}) {
  return (
    <Link
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => {
        if (selectLocation) saveLocation(selectLocation);
        if (event) interaction(event, locale, locationId);
      }}
    >
      {children}
    </Link>
  );
}

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = dictionary(locale);
  return (
    <div className="language-switch" aria-label={t.nav.language}>
      {(["en", "es"] as const).map((lang) => (
        <a
          key={lang}
          href={alternateLanguagePath(pathname, lang)}
          onClick={(event) => {
            event.currentTarget.href =
              alternateLanguagePath(window.location.pathname, lang) +
              window.location.search +
              window.location.hash;
          }}
          lang={lang}
          hrefLang={lang}
          aria-label={
            lang === "es" ? "ES: Cambiar a español" : "EN: Switch to English"
          }
          aria-current={locale === lang ? "true" : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

export function MobileMenu({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);
  return (
    <div className="mobile-navigation">
      <button
        className="icon-button"
        ref={trigger}
        aria-label={t.nav.open}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        <Icon name="menu" size={26} />
      </button>
      <dialog
        ref={dialog}
        id="mobile-nav"
        className="mobile-dialog"
        aria-label={t.nav.label}
        onKeyDown={keepFocusInDialog}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="mobile-dialog-top">
          <span className="wordmark">
            AZTEC <small>URBAN MX</small>
          </span>
          <button
            className="icon-button"
            aria-label={t.nav.close}
            onClick={close}
            autoFocus
          >
            <Icon name="close" size={28} />
          </button>
        </div>
        <nav aria-label={t.nav.label}>
          {navSlugs.map((slug) => (
            <Link key={slug} href={pathFor(locale, slug)} onClick={close}>
              {t.nav[slug]}
              <Icon name="arrow" />
            </Link>
          ))}
        </nav>
        <LanguageSwitch locale={locale} />
      </dialog>
    </div>
  );
}

export function CopyAddress({
  address,
  locale,
}: {
  address: string;
  locale: Locale;
}) {
  const t = dictionary(locale);
  const [message, setMessage] = useState("");
  return (
    <div className="copy-control">
      <button
        className="text-link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setMessage(t.common.copied);
          } catch {
            setMessage(t.common.copyFailed);
          }
        }}
      >
        <Icon name="copy" size={17} />
        {t.common.copy}
      </button>
      <span className="copy-status" role="status">
        {message}
      </span>
    </div>
  );
}

export function InteractionObserver({ locale }: { locale: Locale }) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[data-event]")
          : null;
      if (link?.dataset.event)
        interaction(
          link.dataset.event as InteractionName,
          locale,
          (link.dataset.location as LocationId) || null,
        );
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [locale]);
  return null;
}
