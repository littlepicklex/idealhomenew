import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get min/max values for price, sqft, and year_built
    const facets = await prisma.property.aggregate({
      _min: {
        price: true,
        sqft: true,
        yearBuilt: true,
      },
      _max: {
        price: true,
        sqft: true,
        yearBuilt: true,
      },
    });

    const result = {
      minPrice: facets._min.price ? Number(facets._min.price) : 0,
      maxPrice: facets._max.price ? Number(facets._max.price) : 0,
      minSqft: facets._min.sqft || 0,
      maxSqft: facets._max.sqft || 0,
      minYear: facets._min.yearBuilt || 1900,
      maxYear: facets._max.yearBuilt || new Date().getFullYear(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching facets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facets' },
      { status: 500 }
    );
  }
}