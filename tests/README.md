# Playwright Test Suite

This directory contains comprehensive end-to-end tests for the PropertyFinder Pro application using Playwright.

## Test Structure

### Test Files

- **`auth.spec.ts`** - Authentication flow tests (register, login, logout)
- **`wizard.spec.ts`** - Property wizard flow tests
- **`properties.spec.ts`** - Property list and favorites tests
- **`profile.spec.ts`** - Profile page tests
- **`e2e-user-flow.spec.ts`** - Complete end-to-end user journey tests

### Utilities

- **`utils/test-helpers.ts`** - Common test utilities and helper functions
- **`utils/test-data.ts`** - Test data, selectors, and expected values
- **`setup/test-setup.ts`** - Custom test fixtures and setup

## Test Coverage

### Authentication Flow
- ✅ User registration with validation
- ✅ User login with validation
- ✅ Password visibility toggle
- ✅ Form validation errors
- ✅ Authentication state management
- ✅ Protected route access
- ✅ Logout functionality

### Property Wizard
- ✅ Multi-step wizard navigation
- ✅ Budget preferences
- ✅ Property type selection
- ✅ Lifestyle preferences
- ✅ Form validation
- ✅ Progress indicators
- ✅ Back/forward navigation
- ✅ Mobile responsiveness

### Property List & Favorites
- ✅ Property list display
- ✅ Filtering by price, type, features
- ✅ Sorting by ideality score
- ✅ List/Map view toggle
- ✅ Property card interactions
- ✅ Add/remove favorites
- ✅ Pagination
- ✅ Error handling

### Profile Management
- ✅ Profile page access
- ✅ User information display
- ✅ Favorites management
- ✅ Remove favorites
- ✅ Navigate to property details
- ✅ Logout functionality
- ✅ Mobile responsiveness

### End-to-End User Journey
- ✅ Complete flow: Register → Login → Wizard → Properties → Favorites → Profile
- ✅ Multiple favorites management
- ✅ Wizard preferences with filtered results
- ✅ Cross-page state persistence

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Test Commands

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test auth.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests in parallel
npx playwright test --workers=4
```

### Test Configuration

The tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## Test Data

### Test Users
- **Valid user**: `test@example.com` / `TestPassword123!`
- **Invalid user**: `invalid@example.com` / `wrongpassword`
- **Existing user**: `existing@example.com` / `ExistingPassword123!`

### Test Properties
- House: $350k, 3 bed, 2 bath, 2000 sqft
- Apartment: $250k, 2 bed, 1 bath, 1200 sqft
- Condo: $500k, 2 bed, 2 bath, 1500 sqft

### Wizard Preferences
- **Budget**: $200k - $500k
- **Luxury**: $500k - $1M
- **Affordable**: $100k - $250k

## Test Utilities

### TestHelpers Class

```typescript
const helpers = new TestHelpers(page);

// Generate test data
const email = helpers.generateTestEmail();
const password = helpers.generateTestPassword();

// Wait for elements
await helpers.waitForPageLoad();
await helpers.waitForProperties();

// Form interactions
await helpers.fillField('input[name="email"]', email);
await helpers.waitAndClick('button[type="submit"]');

// Navigation
await helpers.waitForNavigation();

// State management
await helpers.clearAuthState();
const isLoggedIn = await helpers.isLoggedIn();
```

### Custom Fixtures

```typescript
// Use authenticated page fixture
test('test with authenticated user', async ({ authenticatedPage }) => {
  const { page, helpers, testEmail, testPassword } = authenticatedPage;
  // Test code here
});
```

## Best Practices

### Test Organization
- Each test file focuses on a specific feature/flow
- Tests are grouped by functionality using `test.describe()`
- Setup and teardown are handled in `beforeEach`/`afterEach`

### Test Isolation
- Each test starts with a clean state
- Authentication state is cleared between tests
- Unique test data is generated for each test run

### Error Handling
- Tests include error scenarios and edge cases
- API errors are mocked and tested
- Loading states are verified

### Performance
- Tests run in parallel when possible
- Long-running operations are optimized
- Unnecessary waits are avoided

## Debugging Tests

### Debug Mode
```bash
npx playwright test --debug
```

### Screenshots and Videos
- Screenshots are automatically taken on test failure
- Videos are recorded for failed tests
- Traces are available for debugging

### Test Reports
- HTML report: `playwright-report/index.html`
- JSON results: `test-results/results.json`
- JUnit results: `test-results/results.xml`

## CI/CD Integration

### GitHub Actions
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test
```

### Environment Variables
- `CI=true` - Enables CI-specific settings
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - For map functionality
- `JWT_SECRET` - For authentication

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in `playwright.config.ts`
   - Check if dev server is running
   - Verify network connectivity

2. **Element not found**
   - Check if element selectors are correct
   - Verify page has loaded completely
   - Use `page.waitForSelector()` for dynamic content

3. **Authentication failures**
   - Verify test user exists in database
   - Check JWT secret configuration
   - Clear browser state between tests

4. **Flaky tests**
   - Add proper waits for dynamic content
   - Use `page.waitForLoadState('networkidle')`
   - Avoid hard-coded timeouts

### Debug Tips

1. **Use Playwright Inspector**
   ```bash
   npx playwright test --debug
   ```

2. **Add console logs**
   ```typescript
   await page.evaluate(() => console.log('Debug info'));
   ```

3. **Take screenshots manually**
   ```typescript
   await page.screenshot({ path: 'debug.png' });
   ```

4. **Check network requests**
   ```typescript
   page.on('request', request => console.log(request.url()));
   ```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Include both positive and negative test cases
4. Add proper error handling
5. Update this README if needed
6. Ensure tests are isolated and repeatable
