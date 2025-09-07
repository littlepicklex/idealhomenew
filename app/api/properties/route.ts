import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const PropertiesQuerySchema = z.object({
  minPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  minSqft: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxSqft: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  minYear: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxYear: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  type: z.string().optional(),
  beds: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  baths: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  sortBy: z.enum(['ideality_score', 'price', 'sqft', 'yearBuilt', 'createdAt']).default('ideality_score'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  cursor: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = PropertiesQuerySchema.parse(query);
    
    // Build where clause
    const where: any = {};
    
    if (validatedQuery.minPrice !== undefined || validatedQuery.maxPrice !== undefined) {
      where.price = {};
      if (validatedQuery.minPrice !== undefined) {
        where.price.gte = validatedQuery.minPrice;
      }
      if (validatedQuery.maxPrice !== undefined) {
        where.price.lte = validatedQuery.maxPrice;
      }
    }
    
    if (validatedQuery.minSqft !== undefined || validatedQuery.maxSqft !== undefined) {
      where.sqft = {};
      if (validatedQuery.minSqft !== undefined) {
        where.sqft.gte = validatedQuery.minSqft;
      }
      if (validatedQuery.maxSqft !== undefined) {
        where.sqft.lte = validatedQuery.maxSqft;
      }
    }
    
    if (validatedQuery.minYear !== undefined || validatedQuery.maxYear !== undefined) {
      where.yearBuilt = {};
      if (validatedQuery.minYear !== undefined) {
        where.yearBuilt.gte = validatedQuery.minYear;
      }
      if (validatedQuery.maxYear !== undefined) {
        where.yearBuilt.lte = validatedQuery.maxYear;
      }
    }
    
    if (validatedQuery.type) {
      where.type = validatedQuery.type;
    }
    
    if (validatedQuery.beds !== undefined) {
      where.beds = validatedQuery.beds;
    }
    
    if (validatedQuery.baths !== undefined) {
      where.baths = validatedQuery.baths;
    }
    
    // Cursor pagination
    if (validatedQuery.cursor) {
      where.id = {
        gt: validatedQuery.cursor,
      };
    }
    
    // Build orderBy clause
    const orderBy: any = {};
    orderBy[validatedQuery.sortBy] = validatedQuery.sortOrder;
    
    // Fetch properties
    const properties = await prisma.property.findMany({
      where,
      orderBy,
      take: validatedQuery.limit + 1, // Take one extra to check if there are more
    });
    
    // Check if there are more results
    const hasMore = properties.length > validatedQuery.limit;
    if (hasMore) {
      properties.pop(); // Remove the extra item
    }
    
    // Get the cursor for the next page
    const nextCursor = hasMore ? properties[properties.length - 1]?.id : null;
    
    // Convert Decimal fields to numbers
    const convertedProperties = properties.map(property => ({
      ...property,
      price: Number(property.price),
      lat: Number(property.lat),
      lng: Number(property.lng),
    }));

    return NextResponse.json({
      properties: convertedProperties,
      pagination: {
        hasMore,
        nextCursor,
        limit: validatedQuery.limit,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}