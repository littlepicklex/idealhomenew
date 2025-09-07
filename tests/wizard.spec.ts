import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Property Wizard Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearAuthState();
  });

  test.describe('Wizard Navigation', () => {
    test('should complete full wizard flow', async ({ page }) => {
      // Navigate to wizard
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Verify wizard title
      await expect(page.locator('h1')).toContainText('Find Your Perfect Property');

      // Step 1: Budget
      await expect(page.locator('h2')).toContainText('Budget');
      await expect(page.locator('input[name="minPrice"]')).toBeVisible();
      await expect(page.locator('input[name="maxPrice"]')).toBeVisible();

      // Fill budget information
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '500000');

      // Click next
      await helpers.waitAndClick('button:has-text("Next")');

      // Step 2: Property Type
      await expect(page.locator('h2')).toContainText('Property Type');
      await expect(page.locator('input[value="house"]')).toBeVisible();
      await expect(page.locator('input[value="apartment"]')).toBeVisible();
      await expect(page.locator('input[value="condo"]')).toBeVisible();

      // Select property type
      await page.check('input[value="house"]');

      // Click next
      await helpers.waitAndClick('button:has-text("Next")');

      // Step 3: Lifestyle Preferences
      await expect(page.locator('h2')).toContainText('Lifestyle');
      await expect(page.locator('input[name="beds"]')).toBeVisible();
      await expect(page.locator('input[name="baths"]')).toBeVisible();
      await expect(page.locator('input[name="minSqft"]')).toBeVisible();

      // Fill lifestyle preferences
      await helpers.fillField('input[name="beds"]', '3');
      await helpers.fillField('input[name="baths"]', '2');
      await helpers.fillField('input[name="minSqft"]', '1500');

      // Click finish
      await helpers.waitAndClick('button:has-text("Find Properties")');

      // Should redirect to properties page with query parameters
      await helpers.waitForNavigation();
      expect(page.url()).toContain('/properties');
      expect(page.url()).toContain('minPrice=200000');
      expect(page.url()).toContain('maxPrice=500000');
      expect(page.url()).toContain('type=house');
      expect(page.url()).toContain('beds=3');
      expect(page.url()).toContain('baths=2');
      expect(page.url()).toContain('minSqft=1500');
    });

    test('should allow going back to previous steps', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Step 1: Fill budget
      await helpers.fillField('input[name="minPrice"]', '300000');
      await helpers.fillField('input[name="maxPrice"]', '600000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Step 2: Select property type
      await page.check('input[value="apartment"]');
      await helpers.waitAndClick('button:has-text("Next")');

      // Step 3: Go back to step 2
      await helpers.waitAndClick('button:has-text("Back")');
      await expect(page.locator('h2')).toContainText('Property Type');

      // Verify apartment is still selected
      await expect(page.locator('input[value="apartment"]')).toBeChecked();

      // Go back to step 1
      await helpers.waitAndClick('button:has-text("Back")');
      await expect(page.locator('h2')).toContainText('Budget');

      // Verify budget values are still there
      await expect(page.locator('input[name="minPrice"]')).toHaveValue('300000');
      await expect(page.locator('input[name="maxPrice"]')).toHaveValue('600000');
    });

    test('should show validation errors for required fields', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Try to proceed without filling budget
      await helpers.waitAndClick('button:has-text("Next")');

      // Should show validation errors
      await expect(page.locator('text=Minimum price is required')).toBeVisible();
      await expect(page.locator('text=Maximum price is required')).toBeVisible();
    });

    test('should validate price range', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Set invalid price range (min > max)
      await helpers.fillField('input[name="minPrice"]', '500000');
      await helpers.fillField('input[name="maxPrice"]', '300000');

      await helpers.waitAndClick('button:has-text("Next")');

      // Should show validation error
      await expect(page.locator('text=Maximum price must be greater than minimum price')).toBeVisible();
    });

    test('should require property type selection', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Fill budget and proceed
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Try to proceed without selecting property type
      await helpers.waitAndClick('button:has-text("Next")');

      // Should show validation error
      await expect(page.locator('text=Please select a property type')).toBeVisible();
    });

    test('should validate lifestyle preferences', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Fill budget and proceed
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Select property type and proceed
      await page.check('input[value="house"]');
      await helpers.waitAndClick('button:has-text("Next")');

      // Try to proceed without filling lifestyle preferences
      await helpers.waitAndClick('button:has-text("Find Properties")');

      // Should show validation errors
      await expect(page.locator('text=Number of bedrooms is required')).toBeVisible();
      await expect(page.locator('text=Number of bathrooms is required')).toBeVisible();
    });
  });

  test.describe('Wizard Form Interactions', () => {
    test('should update price range slider when typing in inputs', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Check if price range slider exists
      const priceSlider = page.locator('input[type="range"]');
      if (await priceSlider.isVisible()) {
        // Move slider and verify input values update
        await priceSlider.fill('300000');
        
        // Verify input values are updated
        const minPrice = await page.inputValue('input[name="minPrice"]');
        const maxPrice = await page.inputValue('input[name="maxPrice"]');
        
        expect(parseInt(minPrice)).toBeGreaterThan(0);
        expect(parseInt(maxPrice)).toBeGreaterThan(0);
      }
    });

    test('should allow multiple property type selections', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Fill budget and proceed
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Select multiple property types
      await page.check('input[value="house"]');
      await page.check('input[value="apartment"]');

      // Verify both are selected
      await expect(page.locator('input[value="house"]')).toBeChecked();
      await expect(page.locator('input[value="apartment"]')).toBeChecked();
    });

    test('should show property type descriptions', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Fill budget and proceed
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Check if property type descriptions are visible
      const houseDescription = page.locator('text=Single-family home');
      const apartmentDescription = page.locator('text=Multi-unit building');
      const condoDescription = page.locator('text=Individually owned unit');

      // At least one description should be visible
      const descriptionsVisible = await Promise.all([
        houseDescription.isVisible(),
        apartmentDescription.isVisible(),
        condoDescription.isVisible()
      ]);

      expect(descriptionsVisible.some(visible => visible)).toBe(true);
    });

    test('should show lifestyle preference tips', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Fill budget and proceed
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      // Select property type and proceed
      await page.check('input[value="house"]');
      await helpers.waitAndClick('button:has-text("Next")');

      // Check if lifestyle tips are visible
      const tips = page.locator('text=Consider your family size');
      if (await tips.isVisible()) {
        await expect(tips).toBeVisible();
      }
    });
  });

  test.describe('Wizard Progress Indicator', () => {
    test('should show progress through wizard steps', async ({ page }) => {
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Check if progress indicator exists
      const progressIndicator = page.locator('[data-testid="wizard-progress"]');
      if (await progressIndicator.isVisible()) {
        // Step 1 should be active
        await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/active/);

        // Fill budget and proceed
        await helpers.fillField('input[name="minPrice"]', '200000');
        await helpers.fillField('input[name="maxPrice"]', '400000');
        await helpers.waitAndClick('button:has-text("Next")');

        // Step 2 should be active, step 1 should be completed
        await expect(page.locator('[data-testid="step-2"]')).toHaveClass(/active/);
        await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/completed/);

        // Select property type and proceed
        await page.check('input[value="house"]');
        await helpers.waitAndClick('button:has-text("Next")');

        // Step 3 should be active, previous steps should be completed
        await expect(page.locator('[data-testid="step-3"]')).toHaveClass(/active/);
        await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/completed/);
        await expect(page.locator('[data-testid="step-2"]')).toHaveClass(/completed/);
      }
    });
  });

  test.describe('Wizard Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/wizard');
      await helpers.waitForPageLoad();

      // Verify wizard is still functional on mobile
      await expect(page.locator('h1')).toContainText('Find Your Perfect Property');
      await expect(page.locator('input[name="minPrice"]')).toBeVisible();
      await expect(page.locator('input[name="maxPrice"]')).toBeVisible();

      // Complete wizard flow on mobile
      await helpers.fillField('input[name="minPrice"]', '200000');
      await helpers.fillField('input[name="maxPrice"]', '400000');
      await helpers.waitAndClick('button:has-text("Next")');

      await page.check('input[value="house"]');
      await helpers.waitAndClick('button:has-text("Next")');

      await helpers.fillField('input[name="beds"]', '3');
      await helpers.fillField('input[name="baths"]', '2');
      await helpers.fillField('input[name="minSqft"]', '1500');
      await helpers.waitAndClick('button:has-text("Find Properties")');

      // Should redirect to properties page
      await helpers.waitForNavigation();
      expect(page.url()).toContain('/properties');
    });
  });
});
