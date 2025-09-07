import { test as base, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

// Extend the base test with custom fixtures
export const test = base.extend<{
  helpers: TestHelpers;
  authenticatedPage: any;
}>({
  helpers: async ({ page }, use) => {
    const helpers = new TestHelpers(page);
    await use(helpers);
  },

  authenticatedPage: async ({ page, helpers }, use) => {
    // Login before each test that uses this fixture
    const testEmail = helpers.generateTestEmail();
    const testPassword = helpers.generateTestPassword();

    // Register user
    await page.goto('/register');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[name="password"]', testPassword);
    await helpers.fillField('input[name="confirmPassword"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Login
    await page.goto('/login');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[type="password"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Verify login
    const isLoggedIn = await helpers.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    await use({ page, helpers, testEmail, testPassword });
  },
});

export { expect } from '@playwright/test';
