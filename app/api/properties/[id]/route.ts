import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { computeIdeality } from '@/lib/computeIdeality';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Calculate ideality score and breakdown
    const idealityResult = computeIdeality(property);

    // Return property with score breakdown
    const result = {
      ...property,
      idealityScore: idealityResult.score,
      scoreBreakdown: idealityResult.breakdown,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}