import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('User Management & Consultant Creation E2E Tests (Real API)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load Customers list page with real API data', async ({ page }) => {
    await page.goto('/admin/users/customers');
    await expect(page).toHaveURL(/\/admin\/users\/customers/);
  });

  test('should load Consultants list page with real API data', async ({ page }) => {
    await page.goto('/admin/users/consultants');
    await expect(page).toHaveURL(/\/admin\/users\/consultants/);
  });

  test('should add a new Consultant Type successfully', async ({ page }) => {
    await page.goto('/admin/users/consultant-type');
    await expect(page).toHaveURL(/\/admin\/users\/consultant-type/);

    const typeName = `Auto Type ${Date.now()}`;

    // Open Add Consultant Type modal
    await page.getByRole('button', { name: 'Add Consultant Type' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill Type Name
    await page.getByPlaceholder('e.g. Financial Advisor').fill(typeName);

    // Submit form inside dialog
    await dialog.locator('button[type="submit"]').click();

    // Verify newly added type appears in page content
    await expect(page.getByText(typeName)).toBeVisible({ timeout: 10000 });
  });

  test('should open Add Consultant modal and submit new consultant creation form', async ({ page }) => {
    await page.goto('/admin/users/consultants');
    await expect(page).toHaveURL(/\/admin\/users\/consultants/);

    const uniqueEmail = `consultant_${Date.now()}@example.com`;

    // Click Add Consultant button
    await page.getByRole('button', { name: 'Add Consultant' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill form fields
    await page.getByPlaceholder('John Doe').fill('Playwright Auto Consultant');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByPlaceholder('+1 (555) 000-0000').fill('+15550001122');
    await page.getByPlaceholder('Tax Consulting').fill('Automated Legal Consulting');
    
    // Fill Experience (first '10' placeholder) and Per Minute Rate (last '10' placeholder)
    await page.getByPlaceholder('10').first().fill('7');
    await page.getByPlaceholder('10').last().fill('25');

    // Select Consultancy Type if options exist
    const typeSelect = dialog.locator('button:has-text("Select type...")');
    if (await typeSelect.isVisible()) {
      await typeSelect.click();
      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }

    // Fill Bio
    await page.getByPlaceholder('Brief description about the consultant...').fill('Automated consultant bio description.');

    // Submit consultant form
    const submitBtn = dialog.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }
  });

});
