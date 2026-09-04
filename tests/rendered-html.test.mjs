import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("exports a deployable application homepage", async () => {
  const html = await readFile(new URL("out/index.html", projectRoot), "utf8");

  assert.match(html, /<title>KERLA DOŞ/);
  assert.match(html, /KERLA DOŞ/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps core application assets in the static export", async () => {
  await Promise.all([
    access(new URL("out/kerla-dos-logo.png", projectRoot)),
    access(new URL("out/illustrations", projectRoot)),
    access(new URL("out/audio", projectRoot)),
  ]);
});

test("leaves the category library when a lesson is opened", async () => {
  const source = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.match(
    source,
    /function open\(cat: Category, resumeAt\?: number\) \{\s*setHomeView\(null\);\s*setActive\(cat\);/,
  );
});
