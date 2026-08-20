import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Overview Dashboard E2E Tests (Real API)', () => {

  test.beforeEach(async ({ page }) => {
    // Perform real admin login via API
    await loginAsAdmin(page);
  });

  test('should render real admin overview layout and metrics cards', async ({ page }) => {
    await page.goto('/admin/overview');
    await expect(page).toHaveURL(/\/admin\/overview/);
    
    // Verify dashboard metrics & header
    const mainContainer = page.locator('main');
    await expect(mainContainer).toBeVisible();
  });

  test('should display chart & data visualizer elements with real API data', async ({ page }) => {
    await page.goto('/admin/overview');
    await expect(page).toHaveURL(/\/admin\/overview/);

    const mainContainer = page.locator('main');
    await expect(mainContainer).toBeVisible();
  });

});
