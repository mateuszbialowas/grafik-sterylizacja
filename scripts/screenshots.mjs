import { chromium } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

const employees = [
  { id: 1, name: "Anna Kowalska" },
  { id: 2, name: "Jan Nowak" },
  { id: 3, name: "Maria Wiśniewska" },
  { id: 4, name: "Piotr Zieliński" },
  { id: 5, name: "Katarzyna Wójcik" },
];

const monthData = {
  shifts: {
    1: {
      2: "D", 3: "D", 4: "R", 5: "D", 6: "D",
      9: "R", 10: "D", 11: "D", 12: "R", 13: "D",
      16: "D", 17: "D", 19: "R", 20: "D",
      23: "C:07:00-08:20",
    },
    2: {
      2: "R", 3: "D", 4: "D", 5: "R", 6: "D",
      9: "D", 10: "R", 11: "D", 12: "D", 13: "R",
      16: "R", 17: "D", 18: "R", 19: "D",
      23: "R", 24: "C:07:00-09:35",
    },
    3: {
      2: "R", 3: "R", 4: "D", 5: "D*", 6: "R",
      9: "D", 10: "R", 11: "D*", 12: "R", 13: "D",
      16: "R", 17: "D", 18: "R", 19: "D", 20: "R",
      24: "C:07:00-14:00",
    },
    4: {
      2: "D", 3: "D", 5: "D", 6: "D",
      9: "D", 10: "D", 12: "D", 13: "D",
      16: "D", 17: "D", 19: "D", 20: "D",
      23: "C:07:00-14:40",
    },
    5: {
      2: "D", 3: "R", 4: "D", 5: "D", 6: "R",
      9: "D", 10: "D", 11: "R", 12: "D", 13: "D",
      16: "R", 17: "D", 18: "D", 19: "D",
      24: "C:07:00-08:20",
    },
  },
  overtime: {
    1: { 7: "15:00-19:00", 21: "19:00-23:00" },
    3: { 14: "14:00-18:00" },
  },
  requests: {
    2: { 27: "Urlop wypoczynkowy" },
    4: { 4: "Szkolenie BHP", 11: "Szkolenie BHP", 18: "Szkolenie BHP" },
  },
  workingDaysOverride: null,
  normOverrides: {},
};

const seedStorage = [
  ["grafik-shared", JSON.stringify({ employees })],
  ["grafik-2026-01", JSON.stringify(monthData)],
  ["grafik-current", JSON.stringify({ year: 2026, month: 1 })],
];

const PORT = process.env.PORT || "5173";
const URL = `http://localhost:${PORT}`;

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript((data) => {
    for (const [key, value] of data) localStorage.setItem(key, value);
  }, seedStorage);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // 1. Full schedule overview
  await page.screenshot({
    path: path.join(screenshotsDir, "schedule-overview.png"),
    fullPage: true,
  });
  console.log("  schedule-overview.png");

  // 2. Header
  const header = page.locator(".bg-white.rounded-\\[10px\\]").first();
  await header.screenshot({ path: path.join(screenshotsDir, "header.png") });
  console.log("  header.png");

  // 3. Context menu (static)
  const cell = page.locator("tbody tr").first().locator("td").nth(4);
  await cell.click({ button: "right" });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(screenshotsDir, "context-menu.png"),
    fullPage: true,
  });
  console.log("  context-menu.png");
  await page.locator(".fixed.inset-0").click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(200);

  // 4. Export menu (static)
  const moreBtn = page.locator("button.size-\\[32px\\]");
  await moreBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(screenshotsDir, "export-menu.png"),
    clip: { x: 0, y: 0, width: 1440, height: 200 },
  });
  console.log("  export-menu.png");
  await page.click("body", { position: { x: 10, y: 400 } });
  await page.waitForTimeout(200);

  // 5. Legend
  const legendSection = page
    .locator("text=Legenda i skróty klawiszowe")
    .locator("xpath=ancestor::div[contains(@class,'mt-3')]");
  const isOpen = await page.locator("text=Rodzaje zmian").isVisible().catch(() => false);
  if (!isOpen) {
    await page.locator("text=Legenda i skróty klawiszowe").click();
    await page.waitForTimeout(300);
  }
  await legendSection.screenshot({ path: path.join(screenshotsDir, "legend.png") });
  console.log("  legend.png");

  await context.close();
  await browser.close();

  console.log("\nAll screenshots saved to ./screenshots/");
  console.log("\nGIFs needed (not generated):");
  console.log("  - shift-cycling.gif       — clicking cells to cycle through shift types");
  console.log("  - context-menu.gif        — right-click cell, hover menu items, select one");
  console.log("  - edit-name.gif           — right-click employee name, edit, confirm");
  console.log("  - edit-norm.gif           — right-click norm cell, type new value, confirm");
  console.log("  - edit-working-days.gif   — right-click working days number, change, confirm");
  console.log("  - month-navigation.gif    — clicking prev/next month arrows");
  console.log("  - export-menu.gif         — opening export dropdown, hovering items");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
