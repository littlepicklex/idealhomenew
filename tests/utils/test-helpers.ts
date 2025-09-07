import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Generate a random email for testing
   */
  generateTestEmail(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test-${random}-${timestamp}@example.com`;
  }

  /**
   * Generate a random password for testing
   */
  generateTestPassword(): string {
    return 'TestPassword123!';
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('body');
  }

  /**
   * Clear all cookies and local storage
   */
  async clearAuthState(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for an element to be visible and clickable
   */
  async waitAndClick(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  /**
   * Fill a form field and verify the value
   */
  async fillField(selector: string, value: string): Promise<void> {
    await this.page.waitForSelector(selector);
    await this.page.fill(selector, value);
    
    // Verify the value was set correctly
    const fieldValue = await this.page.inputValue(selector);
    expect(fieldValue).toBe(value);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForURL('**/*');
    await this.waitForPageLoad();
  }

  /**
   * Check if user is logged in by looking for auth indicators
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for profile link or user menu
      const profileLink = this.page.locator('a[href="/profile"]');
      const userMenu = this.page.locator('[data-testid="user-menu"]');
      
      return await profileLink.isVisible() || await userMenu.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for properties to load on the page
   */
  async waitForProperties(): Promise<void> {
    await this.page.waitForSelector('[data-testid="property-card"]', { 
      timeout: 10000 
    });
  }

  /**
   * Get the count of properties on the current page
   */
  async getPropertyCount(): Promise<number> {
    const propertyCards = this.page.locator('[data-testid="property-card"]');
    return await propertyCards.count();
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string): Promise<any> {
    const response = await this.page.waitForResponse(response => 
      response.url().includes(urlPattern)
    );
    return response.json();
  }

  /**
   * Mock API responses for testing
   */
  async mockAPIResponse(urlPattern: string, mockData: any): Promise<void> {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });
  }

  /**
   * Check if an element has a specific class
   */
  async hasClass(selector: string, className: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const classes = await element.getAttribute('class');
    return classes?.includes(className) || false;
  }

  /**
   * Wait for a specific text to appear on the page
   */
  async waitForText(text: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Check if a button is disabled
   */
  async isButtonDisabled(selector: string): Promise<boolean> {
    const button = this.page.locator(selector);
    return await button.isDisabled();
  }

  /**
   * Get the text content of an element
   */
  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  /**
   * Wait for a specific number of elements to be present
   */
  async waitForElementCount(selector: string, count: number): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, count }) => {
        return document.querySelectorAll(selector).length >= count;
      },
      { selector, count }
    );
  }
}
