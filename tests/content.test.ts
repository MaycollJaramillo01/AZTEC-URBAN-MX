import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  activeLocations,
  comingLocation,
  directionsUrl,
  fullAddress,
  isActiveLocationId,
  locations,
  type Location,
} from "@/data/locations";
import { getMenu, menus, type Menu } from "@/data/menus";
import { brand } from "@/data/brand";
import images from "@/data/images.json";
import {
  alternateLanguagePath,
  dictionary,
  locales,
  pageSlugs,
  pathFor,
} from "@/lib/i18n";
import { validateContent } from "@/lib/validate-content";
import { pageMetadata, structuredData } from "@/lib/seo";

test("location contact data and map destinations remain bound to the correct address", () => {
  const expected = [
    ["broadway-7918", "75703", "tel:+19036302661"],
    ["broadway-2127", "75701", "tel:+19032669005"],
  ];
  for (const [id, zip, phone] of expected) {
    const location = activeLocations.find((item) => item.id === id)!;
    assert.equal(location.phoneHref, phone);
    assert.equal(location.address.postalCode, zip);
    assert.equal(
      new URL(directionsUrl(location)).searchParams.get("destination"),
      fullAddress(location),
    );
  }
  assert.equal(brand.email, "info@aztecmx.com");
});

test("5th Street cannot become a selectable menu location or inherit operational data", () => {
  assert.equal(isActiveLocationId("fifth-street"), false);
  assert.equal(isActiveLocationId("invalid"), false);
  assert.equal(comingLocation.status, "coming_soon");
  assert.equal(comingLocation.phone, null);
  assert.equal(comingLocation.hours, null);
  assert.deepEqual(comingLocation.menuReferences, []);
  const invalid = {
    ...comingLocation,
    phone: "903-630-2661",
  } as unknown as Location;
  assert.throws(() => validateContent([invalid], []), /operational data/);
  const badMenu = { id: "bad", locationId: "fifth-street" } as unknown as Menu;
  assert.throws(
    () => validateContent(locations, [badMenu]),
    /no active location/,
  );
});

test("menu lookup isolates both the location and the language", () => {
  const fixture: Menu = {
    id: "test-only",
    locationId: "broadway-7918",
    locale: "en",
    version: "test",
    confirmedAt: "2026-10-28",
    pdfUrl: null,
    categories: [{ name: "Test fixture", items: [] }],
  };
  menus.push(fixture);
  try {
    assert.equal(getMenu("broadway-7918", "en"), fixture);
    assert.equal(getMenu("broadway-2127", "en"), undefined);
    assert.equal(getMenu("broadway-7918", "es"), undefined);
    assert.throws(
      () =>
        validateContent(locations, [fixture, { ...fixture, id: "duplicate" }]),
      /Duplicate current menu/,
    );
  } finally {
    menus.splice(menus.indexOf(fixture), 1);
  }
  assert.equal(menus.length, 0);
});

test("all required routes switch language while preserving location and query", () => {
  assert.equal(pageSlugs.length, 10);
  for (const slug of pageSlugs) {
    const source = pathFor("en", slug);
    assert.equal(alternateLanguagePath(source, "es"), pathFor("es", slug));
    assert.equal(
      alternateLanguagePath(`${source}?location=broadway-2127`, "es"),
      `${pathFor("es", slug)}?location=broadway-2127`,
    );
  }
  function keys(value: unknown, prefix = ""): string[] {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, item]) =>
        typeof item === "string"
          ? [`${prefix}${key}`]
          : keys(item, `${prefix}${key}.`),
    );
  }
  assert.deepEqual(keys(dictionary("en")), keys(dictionary("es")));
});

test("preview SEO stays unindexed and does not publish unapproved images or restaurant schema", () => {
  const oldUrl = process.env.SITE_URL;
  const oldIndex = process.env.SITE_INDEXABLE;
  delete process.env.SITE_URL;
  process.env.SITE_INDEXABLE = "false";
  try {
    const titles = new Set();
    for (const locale of locales)
      for (const slug of pageSlugs) {
        const meta = pageMetadata(locale, slug);
        assert.deepEqual(meta.robots, { index: false, follow: false });
        assert.equal(meta.alternates, undefined);
        assert.ok(!("images" in (meta.openGraph || {})));
        assert.equal(titles.has(meta.title), false);
        titles.add(meta.title);
      }
    assert.equal(structuredData("en", ""), null);
    process.env.SITE_URL = "https://approved.example";
    process.env.SITE_INDEXABLE = "true";
    const data = structuredData("en", "locations/fifth-street")!;
    assert.ok(data["@graph"].every((item) => item["@type"] !== "Restaurant"));
    assert.equal(
      structuredData("en", "")!["@graph"].filter(
        (item) => item["@type"] === "Restaurant",
      ).length,
      2,
    );
  } finally {
    if (oldUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = oldUrl;
    if (oldIndex === undefined) delete process.env.SITE_INDEXABLE;
    else process.env.SITE_INDEXABLE = oldIndex;
  }
});

test("all photo variants exist, preserve original hashes and stay within source resolution", () => {
  for (const photo of images) {
    const originalPath = path.resolve("..", photo.originalFile);
    const source = fs.readFileSync(
      fs.existsSync(originalPath)
        ? originalPath
        : path.resolve("originals", photo.originalFile),
    );
    assert.equal(
      crypto.createHash("sha256").update(source).digest("hex"),
      photo.sourceSha256,
    );
    assert.equal(photo.locationId, null);
    assert.equal(photo.approvedForPublication, false);
    assert.ok(photo.altEn && photo.altEs && photo.sourcePostUrl);
    for (const variant of photo.variants) {
      assert.ok(variant.width <= photo.width);
      assert.ok(fs.existsSync(path.join("public", variant.webp)));
      assert.ok(fs.existsSync(path.join("public", variant.jpeg)));
    }
  }
  assert.ok(
    images
      .find((photo) => photo.id === "grill-board")!
      .variants.every((item) => item.bytes < 350000),
  );
  validateContent();
});
