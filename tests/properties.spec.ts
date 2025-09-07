import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Property List and Favorites', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearAuthState();
  });

  test.describe('Property List Page', () => {
    test('should display properties list with filters', async ({ page }) => {
      // Navigate to properties page
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Verify page title and filters
      await expect(page.locator('h1')).toContainText('Properties');
      await expect(page.locator('[data-testid="filters-sidebar"]')).toBeVisible();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Verify property cards are displayed
      const propertyCount = await helpers.getPropertyCount();
      expect(propertyCount).toBeGreaterThan(0);

      // Verify property card structure
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      await expect(firstProperty.locator('[data-testid="property-title"]')).toBeVisible();
      await expect(firstProperty.locator('[data-testid="property-price"]')).toBeVisible();
      await expect(firstProperty.locator('[data-testid="property-beds"]')).toBeVisible();
      await expect(firstProperty.locator('[data-testid="property-baths"]')).toBeVisible();
      await expect(firstProperty.locator('[data-testid="property-sqft"]')).toBeVisible();
      await expect(firstProperty.locator('[data-testid="ideality-score"]')).toBeVisible();
    });

    test('should filter properties by price range', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();
      const initialCount = await helpers.getPropertyCount();

      // Apply price filter
      await helpers.fillField('input[name="minPrice"]', '300000');
      await helpers.fillField('input[name="maxPrice"]', '500000');
      await helpers.waitAndClick('button:has-text("Apply Filters")');

      // Wait for filtered results
      await helpers.waitForProperties();
      const filteredCount = await helpers.getPropertyCount();

      // Should have fewer or equal properties
      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      // Verify all displayed properties are within price range
      const propertyCards = page.locator('[data-testid="property-card"]');
      const count = await propertyCards.count();
      
      for (let i = 0; i < count; i++) {
        const priceText = await propertyCards.nth(i).locator('[data-testid="property-price"]').textContent();
        const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
        expect(price).toBeGreaterThanOrEqual(300000);
        expect(price).toBeLessThanOrEqual(500000);
      }
    });

    test('should filter properties by property type', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Apply property type filter
      await page.selectOption('select[name="type"]', 'house');
      await helpers.waitAndClick('button:has-text("Apply Filters")');

      // Wait for filtered results
      await helpers.waitForProperties();

      // Verify all displayed properties are houses
      const propertyCards = page.locator('[data-testid="property-card"]');
      const count = await propertyCards.count();
      
      for (let i = 0; i < count; i++) {
        const typeText = await propertyCards.nth(i).locator('[data-testid="property-type"]').textContent();
        expect(typeText?.toLowerCase()).toContain('house');
      }
    });

    test('should sort properties by ideality score', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Sort by ideality score (should be default)
      const sortSelect = page.locator('select[name="sortBy"]');
      await sortSelect.selectOption('ideality_score');

      // Wait for sorted results
      await helpers.waitForProperties();

      // Verify properties are sorted by ideality score (highest first)
      const propertyCards = page.locator('[data-testid="property-card"]');
      const count = await propertyCards.count();
      
      if (count > 1) {
        const firstScore = await propertyCards.first().locator('[data-testid="ideality-score"]').textContent();
        const secondScore = await propertyCards.nth(1).locator('[data-testid="ideality-score"]').textContent();
        
        const firstScoreNum = parseInt(firstScore?.replace(/[^0-9]/g, '') || '0');
        const secondScoreNum = parseInt(secondScore?.replace(/[^0-9]/g, '') || '0');
        
        expect(firstScoreNum).toBeGreaterThanOrEqual(secondScoreNum);
      }
    });

    test('should toggle between list and map view', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Should start in list view
      await expect(page.locator('[data-testid="property-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-container"]')).not.toBeVisible();

      // Switch to map view
      await helpers.waitAndClick('button:has-text("Map")');

      // Should show map view
      await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
      await expect(page.locator('[data-testid="property-list"]')).not.toBeVisible();

      // Switch back to list view
      await helpers.waitAndClick('button:has-text("List")');

      // Should show list view again
      await expect(page.locator('[data-testid="property-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-container"]')).not.toBeVisible();
    });

    test('should highlight property on map when hovering over card', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Switch to map view
      await helpers.waitAndClick('button:has-text("Map")');

      // Wait for map to load
      await expect(page.locator('[data-testid="map-container"]')).toBeVisible();

      // Hover over first property card
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      await firstProperty.hover();

      // Check if map marker is highlighted (this would depend on map implementation)
      // For now, just verify the hover state is applied to the card
      await expect(firstProperty).toHaveClass(/hover/);
    });

    test('should navigate to property detail page', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Click on first property card
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const propertyTitle = await firstProperty.locator('[data-testid="property-title"]').textContent();
      
      await firstProperty.click();

      // Should navigate to property detail page
      await helpers.waitForNavigation();
      expect(page.url()).toMatch(/\/property\/[a-zA-Z0-9-]+/);

      // Verify property detail page content
      await expect(page.locator('h1')).toContainText(propertyTitle || '');
    });
  });

  test.describe('Property Favorites (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await helpers.waitForPageLoad();

      await helpers.fillField('input[type="email"]', 'test@example.com');
      await helpers.fillField('input[type="password"]', 'TestPassword123!');
      await helpers.waitAndClick('button[type="submit"]');
      await helpers.waitForNavigation();
    });

    test('should add property to favorites', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Find first property with favorite button
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      
      // Click favorite button
      await favoriteButton.click();

      // Verify favorite button state changed
      await expect(favoriteButton).toHaveClass(/favorited/);

      // Navigate to profile to verify favorite was added
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should show the favorited property
      await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();
    });

    test('should remove property from favorites', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Add property to favorites first
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      
      await favoriteButton.click();
      await expect(favoriteButton).toHaveClass(/favorited/);

      // Click favorite button again to remove
      await favoriteButton.click();

      // Verify favorite button state changed back
      await expect(favoriteButton).not.toHaveClass(/favorited/);

      // Navigate to profile to verify favorite was removed
      await page.goto('/profile');
      await helpers.waitForPageLoad();

      // Should not show the property in favorites
      const favoriteProperties = page.locator('[data-testid="favorite-property"]');
      const count = await favoriteProperties.count();
      expect(count).toBe(0);
    });

    test('should show favorite status on property cards', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Add first property to favorites
      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      
      await favoriteButton.click();

      // Navigate away and back to verify state persists
      await page.goto('/');
      await page.goto('/properties');
      await helpers.waitForProperties();

      // First property should still show as favorited
      const firstPropertyAgain = page.locator('[data-testid="property-card"]').first();
      const favoriteButtonAgain = firstPropertyAgain.locator('[data-testid="favorite-button"]');
      
      await expect(favoriteButtonAgain).toHaveClass(/favorited/);
    });

    test('should handle favorite button loading state', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      const firstProperty = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstProperty.locator('[data-testid="favorite-button"]');
      
      // Click favorite button
      await favoriteButton.click();

      // Should show loading state briefly
      await expect(favoriteButton.locator('[data-testid="loading-spinner"]')).toBeVisible();
      
      // Loading state should disappear
      await expect(favoriteButton.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    });
  });

  test.describe('Property List Pagination', () => {
    test('should handle pagination correctly', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Check if pagination exists
      const pagination = page.locator('[data-testid="pagination"]');
      if (await pagination.isVisible()) {
        // Get initial property count
        const initialCount = await helpers.getPropertyCount();

        // Click next page
        const nextButton = pagination.locator('button:has-text("Next")');
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          await helpers.waitForProperties();

          // Should load new properties
          const newCount = await helpers.getPropertyCount();
          expect(newCount).toBeGreaterThan(0);

          // Click previous page
          const prevButton = pagination.locator('button:has-text("Previous")');
          await prevButton.click();
          await helpers.waitForProperties();

          // Should be back to original page
          const finalCount = await helpers.getPropertyCount();
          expect(finalCount).toBe(initialCount);
        }
      }
    });

    test('should show page information', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Wait for properties to load
      await helpers.waitForProperties();

      // Check if page info is displayed
      const pageInfo = page.locator('[data-testid="page-info"]');
      if (await pageInfo.isVisible()) {
        const pageText = await pageInfo.textContent();
        expect(pageText).toMatch(/Page \d+ of \d+/);
      }
    });
  });

  test.describe('Property List Error Handling', () => {
    test('should show error message when no properties found', async ({ page }) => {
      await page.goto('/properties');
      await helpers.waitForPageLoad();

      // Apply very restrictive filters
      await helpers.fillField('input[name="minPrice"]', '10000000');
      await helpers.fillField('input[name="maxPrice"]', '20000000');
      await helpers.waitAndClick('button:has-text("Apply Filters")');

      // Should show no properties found message
      await expect(page.locator('text=No properties found')).toBeVisible();
      await expect(page.locator('text=Try adjusting your filters')).toBeVisible();
    });

    test('should show loading state while fetching properties', async ({ page }) => {
      await page.goto('/properties');
      
      // Should show loading state initially
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
      
      // Wait for properties to load
      await helpers.waitForProperties();
      
      // Loading state should disappear
      await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    });
  });
});
