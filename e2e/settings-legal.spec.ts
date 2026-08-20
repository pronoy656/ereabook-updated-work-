import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Settings & Legal E2E Tests (Real API)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load Admin Settings page and verify Full Name input field', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page).toHaveURL(/\/admin\/settings/);
    const nameInput = page.getByLabel('Full Name');
    await expect(nameInput).toBeVisible();
    
    const saveBtn = page.getByRole('button', { name: /Save Changes|Save|Update/i });
    await expect(saveBtn).toBeVisible();
  });

  test('should load Support page', async ({ page }) => {
    await page.goto('/admin/support');
    await expect(page).toHaveURL(/\/admin\/support/);
  });

  test('should load Payments page', async ({ page }) => {
    await page.goto('/admin/payments');
    await expect(page).toHaveURL(/\/admin\/payments/);
  });

  test('should add new Legal Terms and Conditions entry successfully', async ({ page }) => {
    await page.goto('/admin/legal');
    await expect(page).toHaveURL(/\/admin\/legal/);

    const termTitle = `Auto Terms ${Date.now()}`;
    const termContent = `These are automated terms created by Playwright E2E testing framework.`;

    // Click Add terms and condition button
    await page.getByRole('button', { name: /Add terms and condition/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill Title and Content
    await page.getByPlaceholder('e.g. Privacy and Data Usage').fill(termTitle);
    await page.getByPlaceholder('Write the legal content here...').fill(termContent);

    // Save Term
    await page.getByRole('button', { name: 'Save Term' }).click();

    // Verify created terms title is rendered in table
    await expect(page.getByText(termTitle)).toBeVisible({ timeout: 10000 });
  });

});
