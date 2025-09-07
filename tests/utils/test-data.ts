// Test data for Playwright tests

export const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'TestPassword123!',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  existing: {
    email: 'existing@example.com',
    password: 'ExistingPassword123!',
  },
};

export const testProperties = {
  house: {
    title: 'Beautiful Family Home',
    price: 350000,
    sqft: 2000,
    beds: 3,
    baths: 2,
    type: 'house',
  },
  apartment: {
    title: 'Modern Downtown Apartment',
    price: 250000,
    sqft: 1200,
    beds: 2,
    baths: 1,
    type: 'apartment',
  },
  condo: {
    title: 'Luxury Condo with City Views',
    price: 500000,
    sqft: 1500,
    beds: 2,
    baths: 2,
    type: 'condo',
  },
};

export const wizardPreferences = {
  budget: {
    minPrice: 200000,
    maxPrice: 500000,
  },
  luxury: {
    minPrice: 500000,
    maxPrice: 1000000,
  },
  affordable: {
    minPrice: 100000,
    maxPrice: 250000,
  },
};

export const filterOptions = {
  priceRanges: [
    { min: 100000, max: 250000, label: 'Under $250k' },
    { min: 250000, max: 400000, label: '$250k - $400k' },
    { min: 400000, max: 600000, label: '$400k - $600k' },
    { min: 600000, max: 1000000, label: '$600k - $1M' },
    { min: 1000000, max: 2000000, label: 'Over $1M' },
  ],
  propertyTypes: ['house', 'apartment', 'condo', 'townhouse'],
  bedrooms: [1, 2, 3, 4, 5],
  bathrooms: [1, 1.5, 2, 2.5, 3, 3.5, 4],
};

export const expectedPageTitles = {
  home: 'PropertyFinder Pro',
  login: 'Sign In',
  register: 'Create Account',
  wizard: 'Find Your Perfect Property',
  properties: 'Properties',
  profile: 'Profile',
};

export const expectedErrorMessages = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    emailExists: 'Email already exists',
    passwordMismatch: 'Passwords do not match',
  },
  wizard: {
    minPriceRequired: 'Minimum price is required',
    maxPriceRequired: 'Maximum price is required',
    priceRangeInvalid: 'Maximum price must be greater than minimum price',
    propertyTypeRequired: 'Please select a property type',
    bedsRequired: 'Number of bedrooms is required',
    bathsRequired: 'Number of bathrooms is required',
  },
  properties: {
    noPropertiesFound: 'No properties found',
    tryAdjustingFilters: 'Try adjusting your filters',
  },
  profile: {
    noFavorites: 'No favorites yet',
    startExploring: 'Start exploring properties',
  },
};

export const apiEndpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  properties: {
    list: '/api/properties',
    detail: '/api/properties/[id]',
    facets: '/api/facets',
  },
  favorites: {
    list: '/api/favorites',
    add: '/api/favorites',
    remove: '/api/favorites',
  },
  reports: {
    generate: '/api/report/[id]',
  },
};

export const testSelectors = {
  auth: {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    confirmPasswordInput: 'input[name="confirmPassword"]',
    submitButton: 'button[type="submit"]',
    loginLink: 'a:has-text("Sign in")',
    registerLink: 'a:has-text("Create account")',
  },
  wizard: {
    minPriceInput: 'input[name="minPrice"]',
    maxPriceInput: 'input[name="maxPrice"]',
    propertyTypeInput: 'input[value="{type}"]',
    bedsInput: 'input[name="beds"]',
    bathsInput: 'input[name="baths"]',
    minSqftInput: 'input[name="minSqft"]',
    nextButton: 'button:has-text("Next")',
    backButton: 'button:has-text("Back")',
    finishButton: 'button:has-text("Find Properties")',
  },
  properties: {
    propertyCard: '[data-testid="property-card"]',
    propertyTitle: '[data-testid="property-title"]',
    propertyPrice: '[data-testid="property-price"]',
    propertyBeds: '[data-testid="property-beds"]',
    propertyBaths: '[data-testid="property-baths"]',
    propertySqft: '[data-testid="property-sqft"]',
    idealityScore: '[data-testid="ideality-score"]',
    favoriteButton: '[data-testid="favorite-button"]',
    filtersSidebar: '[data-testid="filters-sidebar"]',
    propertyList: '[data-testid="property-list"]',
    mapContainer: '[data-testid="map-container"]',
    listViewButton: 'button:has-text("List")',
    mapViewButton: 'button:has-text("Map")',
  },
  profile: {
    userInfo: '[data-testid="user-info"]',
    userEmail: '[data-testid="user-email"]',
    favoriteProperty: '[data-testid="favorite-property"]',
    removeFavorite: '[data-testid="remove-favorite"]',
    logoutButton: 'button:has-text("Logout")',
    browsePropertiesLink: 'a:has-text("Browse Properties")',
  },
  common: {
    loadingSpinner: '[data-testid="loading-spinner"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',
  },
};
