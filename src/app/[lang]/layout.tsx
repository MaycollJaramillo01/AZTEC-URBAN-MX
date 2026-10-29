import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import Script from "next/script";
import "@/app/globals.css";
import { isLocale, locales } from "@/lib/i18n";
import { Header, Footer } from "@/components/shell";
import { InteractionObserver } from "@/components/interactions";
import { EntranceAnimations } from "@/components/entrance-animations";
const displayFont = localFont({
  src: "../fonts/barlow-condensed-latin-600-normal.woff2",
  weight: "600",
  variable: "--font-display",
  display: "swap",
});
const bodyFont = localFont({
  src: [
    { path: "../fonts/dm-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/dm-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <Header locale={lang} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={lang} />
        <InteractionObserver locale={lang} />
        <EntranceAnimations />
        <Script src="https://inkindscript.com/inkind.js" />
      </body>
    </html>
  );
}
