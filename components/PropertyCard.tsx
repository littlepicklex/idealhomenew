'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeartIcon, MapPinIcon, HomeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Property {
  id: string;
  title: string;
  price: number;
  sqft: number;
  yearBuilt: number;
  beds: number;
  baths: number;
  lat: number;
  lng: number;
  type: string;
  locationScore: number;
  safetyScore: number;
  schoolScore: number;
  commuteMinutes: number;
  idealityScore: number;
  createdAt: string;
}

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  className?: string;
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export default function PropertyCard({
  property,
  onClick,
  className = '',
  showFavoriteButton = true,
  isFavorited = false,
  onFavoriteToggle,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Property Image Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <HomeIcon className="w-16 h-16 text-blue-400" />
          </div>
          
          {/* Ideality Score Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={`${getScoreColor(property.idealityScore)} font-semibold`}
              variant="outline"
            >
              {property.idealityScore}/100
            </Badge>
          </div>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
              )}
            </button>
          )}

          {/* Property Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {property.type}
            </Badge>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>

          <div className="text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(property.price)}
          </div>

          {/* Property Features */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <HomeIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
            </div>
                <div className="flex items-center text-sm text-gray-600">
                  <HomeIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                </div>
            <div className="flex items-center text-sm text-gray-600">
              <HomeIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span>{property.yearBuilt}</span>
            </div>
          </div>

          {/* Location and Commute */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
              <span>{property.commuteMinutes} min commute</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">{property.locationScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${property.locationScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Safety</span>
              <span className="font-medium">{property.safetyScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${property.safetyScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Schools</span>
              <span className="font-medium">{property.schoolScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-yellow-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${property.schoolScore}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}