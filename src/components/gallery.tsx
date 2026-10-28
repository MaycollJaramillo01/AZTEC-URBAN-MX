"use client";
import { useRef, useState, useEffect } from "react";
import { dictionary, type Locale } from "@/lib/i18n";
import { Photo, galleryImages } from "./photo";
import { Icon } from "./icons";
import { ActionLink } from "./interactions";
import { keepFocusInDialog } from "@/lib/dialog";
type Category = "all" | "food" | "drinks" | "atmosphere";

export function Gallery({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const [filter, setFilter] = useState<Category>("all");
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photos = galleryImages.filter(
    (photo) => filter === "all" || photo.category === filter,
  );
  const photo = photos[index];
  const categories = (["all", "food", "drinks", "atmosphere"] as const).filter(
    (category) =>
      category === "all" ||
      galleryImages.some((photo) => photo.category === category),
  );
  function close() {
    dialog.current?.close();
    setIsOpen(false);
    opener.current?.focus();
  }
  function step(direction: number) {
    setIndex(
      (current) => (current + direction + photos.length) % photos.length,
    );
  }
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  return (
    <>
      <div className="gallery-toolbar">
        <div className="filter-group" role="group" aria-label={t.gallery.label}>
          {categories.map((category) => (
            <button
              key={category}
              className={filter === category ? "active" : ""}
              aria-pressed={filter === category}
              onClick={() => {
                setFilter(category);
                setIndex(0);
              }}
            >
              {category === "all" ? t.common.all : t.common[category]}
            </button>
          ))}
        </div>
        <p className="small-text" role="status">
          {photos.length} {t.gallery.count}
        </p>
      </div>
      <div className="gallery-grid">
        {photos.map((item, i) => (
          <button
            className={`gallery-item gallery-${item.category}`}
            key={item.id}
            aria-label={`${t.common.photo}: ${locale === "es" ? item.altEs : item.altEn}`}
            aria-haspopup="dialog"
            onClick={(event) => {
              opener.current = event.currentTarget;
              setIndex(i);
              dialog.current?.showModal();
              setIsOpen(true);
            }}
          >
            <Photo
              id={item.id}
              locale={locale}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
            <span className="gallery-zoom">
              <Icon name="plus" size={22} />
            </span>
          </button>
        ))}
      </div>
      {!photos.length && <p role="status">{t.common.noResults}</p>}
      <p className="small-text gallery-note">{t.gallery.captionNote}</p>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={t.nav.gallery}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          keepFocusInDialog(event);
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        <div className="lightbox-top">
          <p role="status">
            {t.gallery.position} {index + 1} {t.gallery.of} {photos.length}
          </p>
          <button
            autoFocus
            className="icon-button"
            aria-label={t.common.close}
            onClick={close}
          >
            <Icon name="close" size={28} />
          </button>
        </div>
        {photo && (
          <>
            <div className="lightbox-stage">
              <button
                className="icon-button"
                aria-label={t.common.previous}
                onClick={() => step(-1)}
              >
                <Icon name="left" size={30} />
              </button>
              <Photo
                key={photo.id}
                id={photo.id}
                locale={locale}
                sizes="(max-width: 767px) 80vw, 640px"
              />
              <button
                className="icon-button"
                aria-label={t.common.next}
                onClick={() => step(1)}
              >
                <Icon name="right" size={30} />
              </button>
            </div>
            <div className="lightbox-caption">
              <p>{locale === "es" ? photo.altEs : photo.altEn}</p>
              <ActionLink
                href={photo.sourcePostUrl}
                external
                locale={locale}
                className="text-link"
                event="click_social"
              >
                {t.common.source}
                <Icon name="external" />
              </ActionLink>
              <span className="small-text">@{photo.sourceAccount}</span>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
