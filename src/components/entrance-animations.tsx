"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = [
  ".hero-copy > *",
  ".hero-art",
  ".page-heading > *",
  ".section-heading",
  ".location-card",
  ".flavor-grid > figure",
  ".experience-grid > *",
  ".roots-grid > *",
  ".drinks-grid > *",
  ".coming-grid > *",
  ".community-grid > a",
  ".story-body > *",
  ".values-list > div",
  ".contact-grid > div",
  ".contact-form-section > *",
  ".gallery-grid > button",
  ".menu-experience",
  ".menu-photo",
  ".visit-grid > *",
  ".locations-invitation",
].join(",");

// Progressive enhancement: server-rendered content remains visible without JS or animation support.
export function EntranceAnimations() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector("main .page-content");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate)
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    function stop() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    function start() {
      stop();
      if (preference.matches) return;
      const siblings = new Map<Element | null, number>();
      const delays = new WeakMap<Element, number>();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.unobserve(entry.target);
            const hero = Boolean(entry.target.closest(".hero"));
            const animation = entry.target.animate(
              [
                { opacity: hero ? 0.65 : 0, transform: "translateY(14px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 250,
                delay: delays.get(entry.target) || 0,
                easing: "cubic-bezier(.2,.65,.3,1)",
                fill: "backwards",
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      root!.querySelectorAll(targets).forEach((element) => {
        const index = siblings.get(element.parentElement) || 0;
        siblings.set(element.parentElement, index + 1);
        delays.set(element, Math.min(index, 3) * 40);
        observer!.observe(element);
      });
    }
    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, [pathname]);
  return null;
}
