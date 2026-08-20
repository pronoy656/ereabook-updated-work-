import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Admin Login' }).click();
  await page.locator('form button[type="submit"]').click();
  
  // Wait until navigation to admin overview completes
  await page.waitForURL(/\/(admin|consultant)/, { timeout: 15000 });
}
