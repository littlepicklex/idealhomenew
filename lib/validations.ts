import { z } from 'zod';

// Property validation schemas
export const PropertyFiltersSchema = z.object({
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minSqft: z.coerce.number().min(0).optional(),
  maxSqft: z.coerce.number().min(0).optional(),
  minYearBuilt: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
  maxYearBuilt: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
  type: z.string().optional(),
  beds: z.coerce.number().min(0).optional(),
  baths: z.coerce.number().min(0).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const PropertyIdSchema = z.object({
  id: z.string().cuid(),
});

export const FavoriteSchema = z.object({
  propertyId: z.string().cuid(),
  action: z.enum(['add', 'remove']),
});

export const AuthRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const AuthLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Response schemas
export const FacetsResponseSchema = z.object({
  price: z.object({
    min: z.number(),
    max: z.number(),
  }),
  sqft: z.object({
    min: z.number(),
    max: z.number(),
  }),
  yearBuilt: z.object({
    min: z.number(),
    max: z.number(),
  }),
});

export const PropertyResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  sqft: z.number(),
  yearBuilt: z.number(),
  beds: z.number(),
  baths: z.number(),
  lat: z.number(),
  lng: z.number(),
  type: z.string(),
  locationScore: z.number(),
  safetyScore: z.number(),
  schoolScore: z.number(),
  commuteMinutes: z.number(),
  idealityScore: z.number(),
  createdAt: z.date(),
});

export const PropertyDetailResponseSchema = PropertyResponseSchema.extend({
  scoreBreakdown: z.object({
    locationScore: z.number(),
    safetyScore: z.number(),
    schoolScore: z.number(),
    commuteMinutes: z.number(),
    idealityScore: z.number(),
  }),
});

export const PaginatedPropertiesResponseSchema = z.object({
  properties: z.array(PropertyResponseSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
});

export const FavoriteResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  propertyId: z.string(),
  createdAt: z.date(),
  property: PropertyResponseSchema,
});

export const FavoritesResponseSchema = z.array(FavoriteResponseSchema);

// Type exports
export type PropertyFilters = z.infer<typeof PropertyFiltersSchema>;
export type PropertyId = z.infer<typeof PropertyIdSchema>;
export type FavoriteRequest = z.infer<typeof FavoriteSchema>;
export type FacetsResponse = z.infer<typeof FacetsResponseSchema>;
export type PropertyResponse = z.infer<typeof PropertyResponseSchema>;
export type PropertyDetailResponse = z.infer<typeof PropertyDetailResponseSchema>;
export type PaginatedPropertiesResponse = z.infer<typeof PaginatedPropertiesResponseSchema>;
export type FavoriteResponse = z.infer<typeof FavoriteResponseSchema>;
export type FavoritesResponse = z.infer<typeof FavoritesResponseSchema>;
