import { test, expect } from "@playwright/test";

test.describe("MeeChain Dashboard", () => {
  test("Health check shows Connected", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("🟢 Connected")).toBeVisible();
  });

  test("MagicOrb loads real data", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("🟢 Connected")).toBeVisible();
    await expect(page.locator("text=Orb")).toContainText("blockHeight");
  });

  test("StatsMonitor shows RPC block height", async ({ page }) => {
    await page.goto("/dashboard");
    const blockHeight = await page.locator("text=Block Height").innerText();
    expect(Number(blockHeight)).toBeGreaterThan(0);
  });

  test("Offline state when backend down", async ({ page }) => {
    // จำลอง backend ปิด
    await page.route("**/api/health", route => route.abort());
    await page.goto("/dashboard");
    await expect(page.getByText("🔴 Backend Offline")).toBeVisible();
  });
});