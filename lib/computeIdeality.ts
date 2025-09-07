interface PropertyData {
  price: number;
  sqft: number;
  yearBuilt: number;
  beds: number;
  baths: number;
  locationScore: number;
  safetyScore: number;
  schoolScore: number;
  commuteMinutes: number;
}

interface UserWeights {
  price: number;
  features: number;
  location: number;
  safety: number;
  schools: number;
  commute: number;
}

interface ScoreBreakdown {
  price: number;
  features: number;
  location: number;
  safety: number;
  schools: number;
  commute: number;
}

interface IdealityResult {
  score: number;
  breakdown: ScoreBreakdown;
}

const DEFAULT_WEIGHTS: UserWeights = {
  price: 0.25,
  features: 0.20,
  location: 0.20,
  safety: 0.15,
  schools: 0.10,
  commute: 0.10,
};

const CONFIG = {
  // Price scoring (lower is better, normalized to 0-100)
  priceRanges: {
    min: 100000,
    max: 2000000,
  },
  
  // Feature scoring weights
  featureWeights: {
    sqftPerBed: 0.4,    // Square feet per bedroom
    bathRatio: 0.3,     // Bathroom to bedroom ratio
    yearBuilt: 0.3,     // Year built (newer is better)
  },
  
  // Commute scoring (lower is better)
  commuteRanges: {
    min: 5,
    max: 120,
  },
};

export function computeIdeality(
  propertyData: PropertyData,
  userWeights: Partial<UserWeights> = {},
  config = CONFIG
): IdealityResult {
  // Merge user weights with defaults
  const weights = { ...DEFAULT_WEIGHTS, ...userWeights };
  
  // Calculate individual scores
  const priceScore = calculatePriceScore(propertyData.price, config.priceRanges);
  const featuresScore = calculateFeaturesScore(propertyData, config.featureWeights);
  const locationScore = propertyData.locationScore;
  const safetyScore = propertyData.safetyScore;
  const schoolScore = propertyData.schoolScore;
  const commuteScore = calculateCommuteScore(propertyData.commuteMinutes, config.commuteRanges);
  
  // Calculate weighted total
  const totalScore = 
    priceScore * weights.price +
    featuresScore * weights.features +
    locationScore * weights.location +
    safetyScore * weights.safety +
    schoolScore * weights.schools +
    commuteScore * weights.commute;
  
  // Normalize to 0-100 range
  const normalizedScore = Math.round(Math.max(0, Math.min(100, totalScore)));
  
  return {
    score: normalizedScore,
    breakdown: {
      price: Math.round(priceScore),
      features: Math.round(featuresScore),
      location: Math.round(locationScore),
      safety: Math.round(safetyScore),
      schools: Math.round(schoolScore),
      commute: Math.round(commuteScore),
    },
  };
}

function calculatePriceScore(price: number, ranges: { min: number; max: number }): number {
  // Lower price = higher score (inverted scoring)
  const normalizedPrice = (price - ranges.min) / (ranges.max - ranges.min);
  const invertedScore = 1 - normalizedPrice;
  return Math.max(0, Math.min(100, invertedScore * 100));
}

function calculateFeaturesScore(
  property: PropertyData,
  weights: { sqftPerBed: number; bathRatio: number; yearBuilt: number }
): number {
  // Square feet per bedroom score
  const sqftPerBed = property.sqft / property.beds;
  const sqftScore = Math.min(100, (sqftPerBed / 500) * 100); // 500 sqft per bed = 100 points
  
  // Bathroom ratio score
  const bathRatio = property.baths / property.beds;
  const bathScore = Math.min(100, (bathRatio / 1.5) * 100); // 1.5 baths per bed = 100 points
  
  // Year built score (newer is better)
  const currentYear = new Date().getFullYear();
  const age = currentYear - property.yearBuilt;
  const yearScore = Math.max(0, 100 - (age / 2)); // Lose 1 point per 2 years
  
  // Weighted combination
  return (
    sqftScore * weights.sqftPerBed +
    bathScore * weights.bathRatio +
    yearScore * weights.yearBuilt
  );
}

function calculateCommuteScore(commuteMinutes: number, ranges: { min: number; max: number }): number {
  // Lower commute = higher score (inverted scoring)
  const normalizedCommute = (commuteMinutes - ranges.min) / (ranges.max - ranges.min);
  const invertedScore = 1 - normalizedCommute;
  return Math.max(0, Math.min(100, invertedScore * 100));
}

// Utility function to get preset user weights based on lifestyle
export function getPresetWeights(lifestyle: 'budget' | 'luxury' | 'family' | 'urban'): UserWeights {
  switch (lifestyle) {
    case 'budget':
      return {
        price: 0.40,
        features: 0.15,
        location: 0.15,
        safety: 0.15,
        schools: 0.10,
        commute: 0.05,
      };
    
    case 'luxury':
      return {
        price: 0.10,
        features: 0.30,
        location: 0.25,
        safety: 0.20,
        schools: 0.10,
        commute: 0.05,
      };
    
    case 'family':
      return {
        price: 0.20,
        features: 0.25,
        location: 0.15,
        safety: 0.20,
        schools: 0.15,
        commute: 0.05,
      };
    
    case 'urban':
      return {
        price: 0.25,
        features: 0.15,
        location: 0.25,
        safety: 0.10,
        schools: 0.10,
        commute: 0.15,
      };
    
    default:
      return DEFAULT_WEIGHTS;
  }
}