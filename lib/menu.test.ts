// Run with: node --test lib/
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parseCsv, toMenu, byCategory } from "./menu.ts";
import { canSeat, nextOn, todayInShop, formatTime } from "./hours.ts";

test("parseCsv keeps commas and doubled quotes inside quoted fields", () => {
  assert.deepEqual(parseCsv('a,b\r\n1,"x, ""y"""\n'), [["a", "b"], ["1", 'x, "y"']]);
});

test("menu CSV becomes 20 items in 4 categories, 5 favourites, all with images", () => {
  const items = toMenu(readFileSync("docs/design/menu-items.csv", "utf-8"));
  assert.equal(items.length, 20);
  assert.deepEqual(byCategory(items).map((s) => s.title), ["Espresso drinks", "Pastries", "Sandwiches", "Cold drinks"]);
  assert.equal(items.filter((i) => i.favorite).length, 5);
  assert.equal(items.find((i) => i.name === "Turkey Pesto on Ciabatta")?.price, 1050);
  assert.ok(items.every((i) => existsSync(`public${i.image.src}`)));
});

test("reservation hours", () => {
  assert.equal(canSeat("2026-10-16", "20:30"), true); // Friday, open till 22:00
  assert.equal(canSeat("2026-10-16", "21:30"), false); // last seating is an hour before close
  assert.equal(canSeat("2026-10-18", "07:30"), false); // Sunday opens at 08:00
  assert.equal(canSeat("2026-10-18", "7pm"), false);
});

test("dates", () => {
  assert.equal(nextOn(5, "2026-10-16"), "2026-10-16"); // Friday → same day
  assert.equal(nextOn(6, "2026-10-16"), "2026-10-17");
  assert.equal(nextOn(5, "2026-10-17"), "2026-10-23");
  assert.equal(todayInShop(new Date("2026-10-17T02:00:00Z")), "2026-10-16"); // still Friday in Brooklyn
  assert.equal(formatTime("19:00"), "7pm");
  assert.equal(formatTime("09:30"), "9:30am");
});
