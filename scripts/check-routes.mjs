import assert from "node:assert/strict";
const origin = process.argv[2] || "http://127.0.0.1:3000";
const slugs = [
  "",
  "menu",
  "locations",
  "locations/broadway-7918",
  "locations/broadway-2127",
  "locations/fifth-street",
  "story",
  "gallery",
  "contact",
  "privacy",
];
const titles = new Set();
const assets = new Set();
let count = 0;
for (const lang of ["en", "es"])
  for (const slug of slugs) {
    const route = `/${lang}${slug ? "/" + slug : ""}`;
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes(`<html lang="${lang}"`), `SSR language: ${route}`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `One H1: ${route}`);
    assert.ok(
      /<meta name="robots" content="noindex, nofollow"/.test(html),
      `Preview robots: ${route}`,
    );
    assert.ok(html.includes("info@aztecmx.com"));
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `Unique title: ${route}`);
    titles.add(title);
    assert.ok(!/href="#"/.test(html), `No empty links: ${route}`);
    for (const match of html.matchAll(
      /(?:src|href)="(\/images\/aztec\/[^\"]+)"/g,
    ))
      assets.add(match[1]);
    count++;
  }
const root = await fetch(origin, { redirect: "manual" });
assert.ok([307, 308].includes(root.status), "Root redirect status");
assert.equal(root.headers.get("location"), "/en");
for (const route of ["/fr", "/en/missing-page"])
  assert.equal((await fetch(origin + route)).status, 404, route);
for (const asset of assets)
  assert.equal((await fetch(origin + asset)).status, 200, asset);
assert.ok(
  (await (await fetch(origin + "/robots.txt")).text()).includes("Disallow: /"),
);
console.log(
  `${count} bilingual pages, redirect, 404s, preview robots and ${assets.size} image fallbacks passed.`,
);
