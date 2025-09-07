import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';
import { z } from 'zod';

const FavoriteSchema = z.object({
  propertyId: z.string(),
  action: z.enum(['add', 'remove']),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      favorites: favorites.map(fav => fav.property),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, action } = FavoriteSchema.parse(body);

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (action === 'add') {
      // Check if already favorited
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
      });

      if (existingFavorite) {
        return NextResponse.json(
          { error: 'Property already in favorites' },
          { status: 400 }
        );
      }

      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          propertyId,
        },
      });

      return NextResponse.json({ message: 'Property added to favorites' });
    } else {
      // Remove from favorites
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
      });

      if (!favorite) {
        return NextResponse.json(
          { error: 'Property not in favorites' },
          { status: 400 }
        );
      }

      await prisma.favorite.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
      });

      return NextResponse.json({ message: 'Property removed from favorites' });
    }
  } catch (error) {
    console.error('Error managing favorite:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to manage favorite' },
      { status: 500 }
    );
  }
}