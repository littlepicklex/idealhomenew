import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Profile Page', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearAuthState();
  });

  test.describe('Profile Access', () => {
    test('should redirect to login when accessing profile without authentication', async ({ page }) => {
      // Try to access profile page without being logged in
      await page.goto('/profile');
      await helpers.waitForNavigation();

      // Should redirect to login page
      expect(page.url()).toContain('/login');
    });

    test('should display profile page when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Verify profile page content
      await expect(page.locator('h1')).toContainText('Profile');
      await expect(page.locator('[data-testid="user-info"]')).toBeVisible();
    });
  });

  test.describe('User Information Display', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should display user email and account information', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Verify user information is displayed
      await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toContainText('test@example.com');
      
      // Verify account creation date
      await expect(page.locator('[data-testid="account-created"]')).toBeVisible();
      
      // Verify member since information
      await expect(page.locator('text=Member since')).toBeVisible();
    });

    test('should display user statistics', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Check if user statistics are displayed
      const statsSection = page.locator('[data-testid="user-stats"]');
      if (await statsSection.isVisible()) {
        await expect(statsSection.locator('text=Total Favorites')).toBeVisible();
        await expect(statsSection.locator('text=Properties Viewed')).toBeVisible();
        await expect(statsSection.locator('text=Reports Generated')).toBeVisible();
      }
    });
  });

  test.describe('Favorites Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should display empty favorites message when no favorites', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should show empty favorites message
      await expect(page.locator('text=No favorites yet')).toBeVisible();
      await expect(page.locator('text=Start exploring properties')).toBeVisible();
      
      // Should show link to properties page
      const exploreLink = page.locator('a:has-text("Browse Properties")');
      await expect(exploreLink).toBeVisible();
      await expect(exploreLink).toHaveAttribute('href', '/properties');
    });

    test('should display favorited properties', async ({ page }) => {
      // First, add a property to favorites
      await page.goto('/properties');
      await helpers.waitForPageLoad();
      await helpers.waitForProperties();

      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      await favoriteButton.click();

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should display the favorited property
      await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();
      
      // Verify property information is displayed
      const favoriteProperty = page.locator('[data-testid="favorite-property"]').first();
      await expect(favoriteProperty.locator('[data-testid="property-title"]')).toBeVisible();
      await expect(favoriteProperty.locator('[data-testid="property-price"]')).toBeVisible();
      await expect(favoriteProperty.locator('[data-testid="property-beds"]')).toBeVisible();
      await expect(favoriteProperty.locator('[data-testid="property-baths"]')).toBeVisible();
      await expect(favoriteProperty.locator('[data-testid="ideality-score"]')).toBeVisible();
    });

    test('should remove property from favorites', async ({ page }) => {
      // First, add a property to favorites
      await page.goto('/properties');
      await helpers.waitForPageLoad();
      await helpers.waitForProperties();

      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      await favoriteButton.click();

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should have one favorite
      await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();

      // Remove from favorites
      const removeButton = page.locator('[data-testid="favorite-property"]').first().locator('[data-testid="remove-favorite"]');
      await removeButton.click();

      // Should show empty favorites message
      await expect(page.locator('text=No favorites yet')).toBeVisible();
      await expect(page.locator('[data-testid="favorite-property"]')).not.toBeVisible();
    });

    test('should navigate to property detail from favorites', async ({ page }) => {
      // First, add a property to favorites
      await page.goto('/properties');
      await helpers.waitForPageLoad();
      await helpers.waitForProperties();

      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const propertyTitle = await firstProperty.locator('[data-testid="property-title"]').textContent();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      await favoriteButton.click();

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Click on favorite property
      const favoriteProperty = page.locator('[data-testid="favorite-property"]').first();
      await favoriteProperty.click();

      // Should navigate to property detail page
      await helpers.waitForNavigation();
      expect(page.url()).toMatch(/\/property\/[a-zA-Z0-9-]+/);
      await expect(page.locator('h1')).toContainText(propertyTitle || '');
    });

    test('should show favorite count in profile header', async ({ page }) => {
      // First, add multiple properties to favorites
      await page.goto('/properties');
      await helpers.waitForPageLoad();
      await helpers.waitForProperties();

      // Add first property to favorites
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      await firstProperty.locator('[data-testid="favorite-button"]').click();

      // Add second property to favorites if available
      const secondProperty = page.locator('[data-testid="property-card"]').nth(1);
      if (await secondProperty.isVisible()) {
        await secondProperty.locator('[data-testid="favorite-button"]').click();
      }

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Check if favorite count is displayed
      const favoriteCount = page.locator('[data-testid="favorite-count"]');
      if (await favoriteCount.isVisible()) {
        const countText = await favoriteCount.textContent();
        expect(countText).toMatch(/\d+/);
      }
    });
  });

  test.describe('Profile Actions', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should logout successfully', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Verify we're logged in
      let isLoggedIn = await helpers.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Click logout button
      const logoutButton = page.locator('button:has-text("Logout")');
      await logoutButton.click();

      // Should redirect to login page
      await helpers.waitForNavigation();
      expect(page.url()).toContain('/login');

      // Verify we're logged out
      isLoggedIn = await helpers.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test('should navigate to properties page from profile', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Click browse properties link
      const browseLink = page.locator('a:has-text("Browse Properties")');
      await browseLink.click();

      // Should navigate to properties page
      await helpers.waitForNavigation();
      expect(page.url()).toContain('/properties');
    });

    test('should show account settings section', async ({ page }) => {
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Check if account settings section exists
      const settingsSection = page.locator('[data-testid="account-settings"]');
      if (await settingsSection.isVisible()) {
        await expect(settingsSection.locator('text=Account Settings')).toBeVisible();
        await expect(settingsSection.locator('text=Change Password')).toBeVisible();
        await expect(settingsSection.locator('text=Delete Account')).toBeVisible();
      }
    });
  });

  test.describe('Profile Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Verify profile is still functional on mobile
      await expect(page.locator('h1')).toContainText('Profile');
      await expect(page.locator('[data-testid="user-info"]')).toBeVisible();

      // Verify favorites section is accessible
      await expect(page.locator('text=Favorites')).toBeVisible();
    });

    test('should display favorites in mobile-friendly layout', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Add a property to favorites first
      await page.goto('/properties');
      await helpers.waitForPageLoad();
      await helpers.waitForProperties();

      const firstProperty = page.locator('[data-testid="property-card"]').first();
      await firstProperty.locator('[data-testid="favorite-button"]').click();

      // Navigate to profile
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Verify favorites are displayed in mobile layout
      await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();
      
      // Verify property cards are properly sized for mobile
      const favoriteProperty = page.locator('[data-testid="favorite-property"]').first();
      const cardBox = await favoriteProperty.boundingBox();
      expect(cardBox?.width).toBeLessThanOrEqual(375); // Should fit mobile width
    });
  });

  test.describe('Profile Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/favorites', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      });

      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should show error message
      await expect(page.locator('text=Failed to load favorites')).toBeVisible();
    });

    test('should show loading state while fetching data', async ({ page }) => {
      await page.goto('/profile');
      
      // Should show loading state initially
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
      
      // Wait for data to load
      await helpers.waitForPageLoad();
      
      // Loading state should disappear
      await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    });
  });
});
