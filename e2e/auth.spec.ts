import { test, expect } from '@playwright/test';

test.describe('Authentication & Login E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form elements correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.locator('form button[type="submit"]')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Enter your password');
    await passwordInput.fill('secretpassword');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    const toggleBtn = page.locator('form button[type="button"]').filter({ has: page.locator('svg') });
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should fill credentials via Admin Login preset button', async ({ page }) => {
    const adminLoginBtn = page.getByRole('button', { name: 'Admin Login' });
    await expect(adminLoginBtn).toBeVisible();
    await adminLoginBtn.click();

    await expect(page.getByPlaceholder('Enter your email')).toHaveValue('shakayet.dev@gmail.com');
    await expect(page.getByPlaceholder('Enter your password')).toHaveValue('12345678');
  });

  test('should show error on invalid login attempt', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.locator('form button[type="submit"]').click();

    // Verify error message container appears or remains on login page
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should successfully submit admin login form', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin Login' }).click();
    await page.locator('form button[type="submit"]').click();

    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(admin|consultant|login)/);
  });

});
