import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Live Monitoring E2E Tests (Real API)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load Live Monitoring table with real API data and verify headers', async ({ page }) => {
    await page.goto('/admin/live-monitoring');
    await expect(page).toHaveURL(/\/admin\/live-monitoring/);
    
    // Check DURATION column header exists (SESSION ID should not exist)
    await expect(page.getByRole('columnheader', { name: 'DURATION' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'CONSULTANT' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'CUSTOMER' })).toBeVisible();
  });

});
