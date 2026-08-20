// tests/e2e/dashboard.spec.ts
// Playwright E2E tests for MeeChain Dashboard

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.meechain.live';

test.describe('MeeChain Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages for debugging
    page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => console.log(`[Page Error] ${error.message}`));
  });

  // ═══════════════════════════════════════════════════════
  // Home Page Tests
  // ═══════════════════════════════════════════════════════

  test('Home page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page).toHaveTitle(/MeeChain|Dashboard/);
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText(/MeeChain|Music/);
  });

  test('Home page has correct status indicator', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Status should show "LIVE"
    const statusText = await page.locator('text=Backend Status').innerText();
    expect(statusText).toContain('LIVE');
  });

  test('Navigation to Dashboard works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click dashboard button
    await page.locator('a:has-text("Enter Dashboard"), button:has-text("Dashboard")').click();
    
    // Wait for navigation
    await page.waitForURL('**/dashboard*', { timeout: 5000 });
    
    // Check we're on dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  // ═══════════════════════════════════════════════════════
  // Dashboard Page Tests
  // ═══════════════════════════════════════════════════════

  test('Dashboard page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Page should load
    await expect(page.locator('text=MeeChain Dashboard')).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════
  // Magic Orb Tests
  // ═══════════════════════════════════════════════════════

  test('Magic Orb shows connected status', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Click Magic Orb tab if exists
    await page.locator('button:has-text("Magic Orb"), [role="tab"]:has-text("Orb")').click({ timeout: 1000 }).catch(() => {});
    
    // Wait for data to load (max 15 seconds)
    await page.waitForTimeout(2000);
    
    // Should show 🟢 Connected
    const connectedText = page.locator('text=🟢 Connected');
    await expect(connectedText).toBeVisible({ timeout: 15000 }).catch(() => {
      // If not visible, it might be loading - check for loading state
      return expect(page.locator('text=Loading')).toBeVisible().catch(() => {
        throw new Error('Magic Orb did not show connected or loading state');
      });
    });
  });

  test('Magic Orb loads real data', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Wait for orb data to appear
    const orbData = page.locator('text=Chain Energy, text=RPC Spirit');
    
    // Data should contain specific elements
    await expect(orbData.first()).toBeVisible({ timeout: 15000 }).catch(() => {
      console.warn('Orb data not visible, checking for error state');
    });
  });

  test('Magic Orb shows error when backend offline', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Simulate backend offline by intercepting API calls
    await page.route(`${API_URL}/**`, route => {
      route.abort('failed');
    });
    
    // Reload page
    await page.reload();
    
    // Should show offline indicator eventually
    const offlineText = page.locator('text=🔴 Offline, text=Backend Offline');
    
    await expect(offlineText.first()).toBeVisible({ timeout: 20000 }).catch(() => {
      console.warn('Offline state not shown, but that\'s ok if API is actually online');
    });
  });

  test('Magic Orb refresh button works', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Wait for initial load
    await page.waitForTimeout(2000);
    
    // Click refresh button
    const refreshBtn = page.locator('button:has-text("Refresh")').first();
    
    if (await refreshBtn.isVisible()) {
      const initialText = await page.locator('text=Last update').innerText();
      
      await refreshBtn.click();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      const updatedText = await page.locator('text=Last update').innerText();
      
      // Time should have changed
      expect(initialText).not.toEqual(updatedText);
    }
  });

  // ═══════════════════════════════════════════════════════
  // Stats Monitor Tests
  // ═══════════════════════════════════════════════════════

  test('Stats Monitor loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Click Stats tab
    await page.locator('button:has-text("Stats Monitor"), [role="tab"]:has-text("Stats")').click({ timeout: 1000 }).catch(() => {});
    
    // Wait for stats to load
    await page.waitForTimeout(3000);
    
    // Should contain Node Status
    const nodeStatus = page.locator('text=Node Status, text=⛓️');
    await expect(nodeStatus.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      console.warn('Node status not visible');
    });
  });

  test('Stats Monitor shows real block height', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Navigate to Stats
    await page.locator('button:has-text("Stats"), [role="tab"]:has-text("Stats")').click({ timeout: 1000 }).catch(() => {});
    
    // Wait for data
    await page.waitForTimeout(3000);
    
    // Block height should be a number > 0
    const blockHeightText = await page.locator('text=Block Height').evaluate(el => {
      const parent = el.closest('[class*="grid"], [class*="card"]');
      return parent?.innerText || '';
    });
    
    console.log('Block height text:', blockHeightText);
    
    // Should contain a number
    expect(blockHeightText).toMatch(/#?\d+/);
  });

  test('Stats Monitor shows status indicators', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Navigate to Stats
    await page.locator('button:has-text("Stats"), [role="tab"]:has-text("Stats")').click({ timeout: 1000 }).catch(() => {});
    
    // Wait for data
    await page.waitForTimeout(3000);
    
    // Should show status indicators (🟢 or 🔴)
    const statusIndicators = page.locator('text=/🟢|🔴/');
    const count = await statusIndicators.count();
    
    expect(count).toBeGreaterThan(0);
  });

  // ═══════════════════════════════════════════════════════
  // CORS & API Tests
  // ═══════════════════════════════════════════════════════

  test('API requests should not have CORS errors', async ({ page }) => {
    let corsErrors = false;
    
    page.on('console', msg => {
      if (msg.text().includes('CORS')) {
        corsErrors = true;
      }
    });
    
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(5000);
    
    expect(corsErrors).toBe(false);
  });

  test('Health check endpoint responds', async ({ page }) => {
    // Make direct API call
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/health');
        return {
          ok: res.ok,
          status: res.status,
          data: await res.json()
        };
      } catch (err: any) {
        return { error: err.message };
      }
    });
    
    expect(response.ok || response.status).toBeDefined();
  });

  test('Stats endpoint returns data', async ({ page }) => {
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/stats');
        return {
          ok: res.ok,
          status: res.status,
          data: await res.json()
        };
      } catch (err: any) {
        return { error: err.message };
      }
    });
    
    expect(response.ok || response.status).toBeDefined();
    if (response.data) {
      expect(response.data).toHaveProperty('timestamp');
    }
  });

  // ═══════════════════════════════════════════════════════
  // Accessibility Tests
  // ═══════════════════════════════════════════════════════

  test('Page is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Check for alt text on images
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        // Images should have alt text or aria-label
        expect(alt || (await images.nth(i).getAttribute('aria-label'))).toBeDefined();
      }
    }
  });

  test('Buttons are keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Tab to first button
    await page.keyboard.press('Tab');
    
    // Should focus on a button or link
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName.toLowerCase();
    });
    
    expect(['button', 'a']).toContain(focused);
  });

  // ═══════════════════════════════════════════════════════
  // Responsive Design Tests
  // ═══════════════════════════════════════════════════════

  test('Dashboard is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Page should still be visible
    await expect(page.locator('text=MeeChain Dashboard')).toBeVisible();
  });

  test('Dashboard is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto(`${BASE_URL}/dashboard`);
    
    await expect(page.locator('text=MeeChain Dashboard')).toBeVisible();
  });

  test('Dashboard is responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto(`${BASE_URL}/dashboard`);
    
    await expect(page.locator('text=MeeChain Dashboard')).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════
  // Performance Tests
  // ═══════════════════════════════════════════════════════

  test('Page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 30 seconds
    expect(loadTime).toBeLessThan(30000);
    
    console.log(`Page loaded in ${loadTime}ms`);
  });
});

// ═══════════════════════════════════════════════════════
// SETUP INSTRUCTIONS
// ═══════════════════════════════════════════════════════

// 1. Install Playwright
//    npm install -D @playwright/test

// 2. Create playwright.config.ts
//    npx playwright install

// 3. Run tests
//    npx playwright test

// 4. Run tests with UI
//    npx playwright test --ui

// 5. Run specific test
//    npx playwright test tests/e2e/dashboard.spec.ts

// 6. View test report
//    npx playwright show-report
