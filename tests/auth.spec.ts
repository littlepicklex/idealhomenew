import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Authentication Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearAuthState();
  });

  test.describe('User Registration', () => {
    test('should register a new user successfully', async ({ page }) => {
      const email = helpers.generateTestEmail();
      const password = helpers.generateTestPassword();

      // Navigate to registration page
      await page.goto('/register');
      await helpers.waitForPageLoad();

      // Verify registration form is visible
      await expect(page.locator('h1')).toContainText('Create Account');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Fill registration form
      await helpers.fillField('input[type="email"]', email);
      await helpers.fillField('input[name="password"]', password);
      await helpers.fillField('input[name="confirmPassword"]', password);

      // Submit form
      await helpers.waitAndClick('button[type="submit"]');

      // Wait for redirect to login or dashboard
      await helpers.waitForNavigation();

      // Verify successful registration (should redirect to login or show success message)
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(login|dashboard|properties)/);
    });

    test('should show validation errors for invalid registration', async ({ page }) => {
      await page.goto('/register');
      await helpers.waitForPageLoad();

      // Try to submit empty form
      await helpers.waitAndClick('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show error for password mismatch', async ({ page }) => {
      const email = helpers.generateTestEmail();
      const password = helpers.generateTestPassword();

      await page.goto('/register');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', email);
      await helpers.fillField('input[name="password"]', password);
      await helpers.fillField('input[name="confirmPassword"]', 'DifferentPassword123!');

      await helpers.waitAndClick('button[type="submit"]');

      // Should show password mismatch error
      await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });

    test('should show error for existing email', async ({ page }) => {
      const email = 'existing@example.com';
      const password = helpers.generateTestPassword();

      await page.goto('/register');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', email);
      await helpers.fillField('input[name="password"]', password);
      await helpers.fillField('input[name="confirmPassword"]', password);

      await helpers.waitAndClick('button[type="submit"]');

      // Should show email already exists error
      await expect(page.locator('text=Email already exists')).toBeVisible();
    });
  });

  test.describe('User Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      const email = 'test@example.com';
      const password = 'TestPassword123!';

      // Navigate to login page
      await page.goto('/login');
      await helpers.waitForPageLoad();

      // Verify login form is visible
      await expect(page.locator('h1')).toContainText('Sign In');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Fill login form
      await helpers.fillField('input[type="email"]', email);
      await helpers.fillField('input[type="password"]', password);

      // Submit form
      await helpers.waitAndClick('button[type="submit"]');

      // Wait for redirect
      await helpers.waitForNavigation();

      // Verify successful login
      const isLoggedIn = await helpers.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Should redirect to dashboard or properties page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(dashboard|properties|profile)/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'invalid@example.com');
      await helpers.fillField('input[type="password"]', 'wrongpassword');

      await helpers.waitAndClick('button[type="submit"]');

      // Should show invalid credentials error
      await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');
      await helpers.waitForPageLoad();

      // Try to submit empty form
      await helpers.waitAndClick('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      await helpers.waitForPageLoad();

      const passwordField = page.locator('input[type="password"]');
      const toggleButton = page.locator('button[data-testid="password-toggle"]');

      // Initially password should be hidden
      await expect(passwordField).toHaveAttribute('type', 'password');

      // Click toggle button
      await toggleButton.click();

      // Password should be visible
      await expect(passwordField).toHaveAttribute('type', 'text');

      // Click toggle again
      await toggleButton.click();

      // Password should be hidden again
      await expect(passwordField).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Authentication State', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
      // Try to access profile page without being logged in
      await page.goto('/profile');
      await helpers.waitForNavigation();

      // Should redirect to login page
      expect(page.url()).toContain('/login');
    });

    test('should redirect to dashboard when accessing auth pages while logged in', async ({ page }) => {
      // First login
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();

      // Now try to access login page again
      await page.goto('/login');
      await helpers.waitForNavigation();

      // Should redirect to dashboard
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/login');
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();

      // Verify we're logged in
      let isLoggedIn = await helpers.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Find and click logout button
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();

      // Wait for redirect
      await helpers.waitForNavigation();

      // Verify we're logged out
      isLoggedIn = await helpers.isLoggedIn();
      expect(isLoggedIn).toBe(false);

      // Should redirect to login or home page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(login|$)/);
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate between login and register pages', async ({ page }) => {
      // Start at login page
      await page.goto('/login');
      await helpers.waitForPageLoad();

      // Click link to register page
      const registerLink = page.locator('a:has-text("Create account")');
      await registerLink.click();
      await helpers.waitForNavigation();

      // Should be on register page
      expect(page.url()).toContain('/register');
      await expect(page.locator('h1')).toContainText('Create Account');

      // Click link back to login page
      const loginLink = page.locator('a:has-text("Sign in")');
      await loginLink.click();
      await helpers.waitForNavigation();

      // Should be back on login page
      expect(page.url()).toContain('/login');
      await expect(page.locator('h1')).toContainText('Sign In');
    });
  });
});
