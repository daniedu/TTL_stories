import { test, expect } from "@playwright/test";
import path from "path";

const SCREENSHOTS_DIR = path.resolve(__dirname, "output");

test.use({
  baseURL: "http://localhost:3000",
  viewport: { width: 390, height: 844 }, // iPhone 14 Pro
});

async function waitForMapReady(page: import("@playwright/test").Page) {
  await page.waitForSelector(".leaflet-container", { timeout: 30_000 });
  await page.waitForSelector(".leaflet-tile-loaded", { timeout: 15_000 });
  await page.waitForTimeout(1000);
}

async function mockGoto(page: import("@playwright/test").Page, pathname: string) {
  await page.addInitScript(() => {
    window.__MOCK_MODE__ = true;
  });
  await page.goto(`${pathname}?mock`, { waitUntil: "domcontentloaded" });
}

test.describe("TTL Stories screenshots", () => {
  test("01 - Map view - Local mode", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "01-map-local.png"),
      fullPage: false,
    });
  });

  test("02 - Map view - Local mode (scrolled/zoomed)", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.evaluate(() => {
      // simulate zoom in a bit
      const map = (window as any).__leaflet_map;
      if (map) map.setZoom(14);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "02-map-local-zoomed.png"),
      fullPage: false,
    });
  });

  test("03 - Map view - Global mode", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    // click Global tab
    await page.getByRole("button", { name: "Global" }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "03-map-global.png"),
      fullPage: false,
    });
  });

  test("04 - Post form overlay", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.locator(".leaflet-container").click({ position: { x: 200, y: 300 } });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "04-post-form.png"),
      fullPage: false,
    });
  });

  test("05 - Post form with text", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.locator(".leaflet-container").click({ position: { x: 200, y: 300 } });
    await page.waitForTimeout(500);
    await page.locator("textarea").fill("Just saw the fog roll over the bridge — magical ✨");
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "05-post-form-filled.png"),
      fullPage: false,
    });
  });

  test("07 - Feed view - Local", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Feed" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "07-feed-local.png"),
      fullPage: false,
    });
  });

  test("08 - Feed view - Global", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Global" }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Feed" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "08-feed-global.png"),
      fullPage: false,
    });
  });

  test("09 - Feed - expanded story interaction", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Feed" }).click();
    await page.waitForTimeout(500);
    // hover over first story to show actions
    const firstStory = page.locator("div.space-y-2 > div").first();
    await firstStory.hover();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "09-feed-hover.png"),
      fullPage: false,
    });
  });

  test("10 - Auth panel - login form", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "10-auth-login-form.png"),
      fullPage: false,
    });
  });

  test("11 - Auth panel - register form", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "11-auth-register-form.png"),
      fullPage: false,
    });
  });

  test("12 - Story feed scrolled", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    await page.getByRole("button", { name: "Global" }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Feed" }).click();
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const container = document.querySelector(".overflow-y-auto");
      if (container) container.scrollTop = 300;
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "12-feed-scrolled.png"),
      fullPage: false,
    });
  });

  test("13 - Popup open on map", async ({ page }) => {
    await mockGoto(page, "/");
    await waitForMapReady(page);
    // click a story marker to open its popup
    const marker = page.locator(".leaflet-marker-icon").first();
    if (await marker.isVisible()) {
      await marker.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "13-map-popup.png"),
      fullPage: false,
    });
  });
});
