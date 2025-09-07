import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Complete User Flow: Register → Login → Wizard → Properties → Favorites → Profile', () => {
  let helpers: TestHelpers;
  let testEmail: string;
  let testPassword: string;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearAuthState();
    
    // Generate unique test credentials for each test
    testEmail = helpers.generateTestEmail();
    testPassword = helpers.generateTestPassword();
  });

  test('Complete user journey from registration to viewing favorites', async ({ page }) => {
    // Step 1: User Registration
    console.log('Step 1: User Registration');
    await page.goto('/register');
    await helpers.waitForPageLoad();

    // Verify registration page
    await expect(page.locator('h1')).toContainText('Create Account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Fill registration form
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[name="password"]', testPassword);
    await helpers.fillField('input[name="confirmPassword"]', testPassword);

    // Submit registration
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Should redirect to login page after successful registration
    expect(page.url()).toContain('/login');

    // Step 2: User Login
    console.log('Step 2: User Login');
    await helpers.waitForPageLoad();

    // Verify login page
    await expect(page.locator('h1')).toContainText('Sign In');

    // Fill login form
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[type="password"]', testPassword);

    // Submit login
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Verify successful login
    const isLoggedIn = await helpers.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    // Should redirect to dashboard or properties page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|properties|profile)/);

    // Step 3: Property Wizard
    console.log('Step 3: Property Wizard');
    await page.goto('/wizard');
    await helpers.waitForPageLoad();

    // Verify wizard page
    await expect(page.locator('h1')).toContainText('Find Your Perfect Property');

    // Step 1: Budget
    await expect(page.locator('h2')).toContainText('Budget');
    await helpers.fillField('input[name="minPrice"]', '250000');
    await helpers.fillField('input[name="maxPrice"]', '450000');
    await helpers.waitAndClick('button:has-text("Next")');

    // Step 2: Property Type
    await expect(page.locator('h2')).toContainText('Property Type');
    await page.check('input[value="house"]');
    await helpers.waitAndClick('button:has-text("Next")');

    // Step 3: Lifestyle Preferences
    await expect(page.locator('h2')).toContainText('Lifestyle');
    await helpers.fillField('input[name="beds"]', '3');
    await helpers.fillField('input[name="baths"]', '2');
    await helpers.fillField('input[name="minSqft"]', '1500');

    // Complete wizard
    await helpers.waitAndClick('button:has-text("Find Properties")');
    await helpers.waitForNavigation();

    // Should redirect to properties page with query parameters
    expect(page.url()).toContain('/properties');
    expect(page.url()).toContain('minPrice=250000');
    expect(page.url()).toContain('maxPrice=450000');
    expect(page.url()).toContain('type=house');
    expect(page.url()).toContain('beds=3');
    expect(page.url()).toContain('baths=2');
    expect(page.url()).toContain('minSqft=1500');

    // Step 4: Property List and Filtering
    console.log('Step 4: Property List and Filtering');
    await helpers.waitForPageLoad();

    // Verify properties page
    await expect(page.locator('h1')).toContainText('Properties');
    await expect(page.locator('[data-testid="filters-sidebar"]')).toBeVisible();

    // Wait for properties to load
    await helpers.waitForProperties();

    // Verify properties are displayed
    const propertyCount = await helpers.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);

    // Verify property cards have required information
    const firstProperty = page.locator('[data-testid="property-card"]').first();
    await expect(firstProperty.locator('[data-testid="property-title"]')).toBeVisible();
    await expect(firstProperty.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(firstProperty.locator('[data-testid="property-beds"]')).toBeVisible();
    await expect(firstProperty.locator('[data-testid="property-baths"]')).toBeVisible();
    await expect(firstProperty.locator('[data-testid="ideality-score"]')).toBeVisible();

    // Test filtering
    await helpers.fillField('input[name="minPrice"]', '300000');
    await helpers.fillField('input[name="maxPrice"]', '400000');
    await helpers.waitAndClick('button:has-text("Apply Filters")');
    await helpers.waitForProperties();

    // Verify filtered results
    const filteredCount = await helpers.getPropertyCount();
    expect(filteredCount).toBeLessThanOrEqual(propertyCount);

    // Test sorting
    const sortSelect = page.locator('select[name="sortBy"]');
    await sortSelect.selectOption('ideality_score');
    await helpers.waitForProperties();

    // Verify sorting worked (first property should have highest score)
    if (filteredCount > 1) {
      const firstScore = await page.locator('[data-testid="property-card"]').first().locator('[data-testid="ideality-score"]').textContent();
      const secondScore = await page.locator('[data-testid="property-card"]').nth(1).locator('[data-testid="ideality-score"]').textContent();
      
      const firstScoreNum = parseInt(firstScore?.replace(/[^0-9]/g, '') || '0');
      const secondScoreNum = parseInt(secondScore?.replace(/[^0-9]/g, '') || '0');
      
      expect(firstScoreNum).toBeGreaterThanOrEqual(secondScoreNum);
    }

    // Step 5: Add Property to Favorites
    console.log('Step 5: Add Property to Favorites');
    
    // Find first property with favorite button
    const firstPropertyCard = page.locator('[data-testid="property-card"]').first();
    const favoriteButton = firstPropertyCard.locator('[data-testid="favorite-button"]');
    
    // Get property title for later verification
    const propertyTitle = await firstPropertyCard.locator('[data-testid="property-title"]').textContent();
    
    // Click favorite button
    await favoriteButton.click();

    // Verify favorite button state changed
    await expect(favoriteButton).toHaveClass(/favorited/);

    // Test map view toggle
    await helpers.waitAndClick('button:has-text("Map")');
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
    
    // Switch back to list view
    await helpers.waitAndClick('button:has-text("List")');
    await expect(page.locator('[data-testid="property-list"]')).toBeVisible();

    // Step 6: Navigate to Property Detail
    console.log('Step 6: Navigate to Property Detail');
    
    // Click on first property card
    await firstPropertyCard.click();
    await helpers.waitForNavigation();

    // Verify property detail page
    expect(page.url()).toMatch(/\/property\/[a-zA-Z0-9-]+/);
    await expect(page.locator('h1')).toContainText(propertyTitle || '');

    // Verify property detail content
    await expect(page.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-features"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="ideality-score-breakdown"]')).toBeVisible();

    // Test PDF report generation
    const downloadButton = page.locator('button:has-text("Download PDF")');
    if (await downloadButton.isVisible()) {
      // Note: In a real test, you might want to mock the PDF generation
      // or test it in a separate test to avoid long execution times
      console.log('PDF download button is available');
    }

    // Step 7: Navigate to Profile
    console.log('Step 7: Navigate to Profile');
    
    // Navigate to profile page
    await page.goto('/profile');
    await helpers.waitForPageLoad();

    // Verify profile page
    await expect(page.locator('h1')).toContainText('Profile');
    await expect(page.locator('[data-testid="user-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toContainText(testEmail);

    // Verify favorited property is displayed
    await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();
    
    const favoriteProperty = page.locator('[data-testid="favorite-property"]').first();
    await expect(favoriteProperty.locator('[data-testid="property-title"]')).toContainText(propertyTitle || '');
    await expect(favoriteProperty.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(favoriteProperty.locator('[data-testid="ideality-score"]')).toBeVisible();

    // Test removing from favorites
    const removeButton = favoriteProperty.locator('[data-testid="remove-favorite"]');
    await removeButton.click();

    // Verify property was removed from favorites
    await expect(page.locator('text=No favorites yet')).toBeVisible();
    await expect(page.locator('[data-testid="favorite-property"]')).not.toBeVisible();

    // Step 8: Logout
    console.log('Step 8: Logout');
    
    // Click logout button
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();
    await helpers.waitForNavigation();

    // Verify logout
    expect(page.url()).toContain('/login');
    const isLoggedIn = await helpers.isLoggedIn();
    expect(isLoggedIn).toBe(false);

    console.log('Complete user flow test passed!');
  });

  test('User flow with multiple favorites and profile management', async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[name="password"]', testPassword);
    await helpers.fillField('input[name="confirmPassword"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    await page.goto('/login');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[type="password"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Navigate to properties and add multiple favorites
    await page.goto('/properties');
    await helpers.waitForPageLoad();
    await helpers.waitForProperties();

    const propertyCards = page.locator('[data-testid="property-card"]');
    const propertyCount = await propertyCards.count();

    // Add first property to favorites
    await propertyCards.first().locator('[data-testid="favorite-button"]').click();
    
    // Add second property to favorites if available
    if (propertyCount > 1) {
      await propertyCards.nth(1).locator('[data-testid="favorite-button"]').click();
    }

    // Navigate to profile
    await page.goto('/profile');
    await helpers.waitForPageLoad();

    // Verify multiple favorites are displayed
    const favoriteProperties = page.locator('[data-testid="favorite-property"]');
    const favoriteCount = await favoriteProperties.count();
    expect(favoriteCount).toBeGreaterThan(0);

    // Test navigation to property detail from favorites
    if (favoriteCount > 0) {
      const firstFavorite = favoriteProperties.first();
      const favoriteTitle = await firstFavorite.locator('[data-testid="property-title"]').textContent();
      
      await firstFavorite.click();
      await helpers.waitForNavigation();
      
      expect(page.url()).toMatch(/\/property\/[a-zA-Z0-9-]+/);
      await expect(page.locator('h1')).toContainText(favoriteTitle || '');
    }

    // Navigate back to profile
    await page.goto('/profile');
    await helpers.waitForPageLoad();

    // Remove all favorites
    const removeButtons = page.locator('[data-testid="remove-favorite"]');
    const removeCount = await removeButtons.count();
    
    for (let i = 0; i < removeCount; i++) {
      await removeButtons.first().click();
    }

    // Verify no favorites remain
    await expect(page.locator('text=No favorites yet')).toBeVisible();
    await expect(page.locator('[data-testid="favorite-property"]')).not.toBeVisible();
  });

  test('User flow with wizard preferences and filtered results', async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[name="password"]', testPassword);
    await helpers.fillField('input[name="confirmPassword"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    await page.goto('/login');
    await helpers.waitForPageLoad();
    await helpers.fillField('input[type="email"]', testEmail);
    await helpers.fillField('input[type="password"]', testPassword);
    await helpers.waitAndClick('button[type="submit"]');
    await helpers.waitForNavigation();

    // Complete wizard with specific preferences
    await page.goto('/wizard');
    await helpers.waitForPageLoad();

    // Budget: High-end properties
    await helpers.fillField('input[name="minPrice"]', '500000');
    await helpers.fillField('input[name="maxPrice"]', '1000000');
    await helpers.waitAndClick('button:has-text("Next")');

    // Property Type: Multiple selections
    await page.check('input[value="house"]');
    await page.check('input[value="condo"]');
    await helpers.waitAndClick('button:has-text("Next")');

    // Lifestyle: Luxury preferences
    await helpers.fillField('input[name="beds"]', '4');
    await helpers.fillField('input[name="baths"]', '3');
    await helpers.fillField('input[name="minSqft"]', '2500');

    await helpers.waitAndClick('button:has-text("Find Properties")');
    await helpers.waitForNavigation();

    // Verify filtered results match wizard preferences
    expect(page.url()).toContain('minPrice=500000');
    expect(page.url()).toContain('maxPrice=1000000');
    expect(page.url()).toContain('beds=4');
    expect(page.url()).toContain('baths=3');
    expect(page.url()).toContain('minSqft=2500');

    await helpers.waitForPageLoad();
    await helpers.waitForProperties();

    // Verify properties match criteria
    const propertyCards = page.locator('[data-testid="property-card"]');
    const count = await propertyCards.count();
    
    if (count > 0) {
      // Check first few properties meet criteria
      for (let i = 0; i < Math.min(3, count); i++) {
        const priceText = await propertyCards.nth(i).locator('[data-testid="property-price"]').textContent();
        const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
        expect(price).toBeGreaterThanOrEqual(500000);
        expect(price).toBeLessThanOrEqual(1000000);
      }
    }

    // Add a property to favorites
    await propertyCards.first().locator('[data-testid="favorite-button"]').click();

    // Navigate to profile and verify favorite
    await page.goto('/profile');
    await helpers.waitForPageLoad();
    await expect(page.locator('[data-testid="favorite-property"]')).toBeVisible();
  });
});
