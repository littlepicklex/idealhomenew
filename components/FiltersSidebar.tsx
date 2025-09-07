'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Facets {
  minPrice: number;
  maxPrice: number;
  minSqft: number;
  maxSqft: number;
  minYear: number;
  maxYear: number;
}

interface Filters {
  minPrice: string;
  maxPrice: string;
  minSqft: string;
  maxSqft: string;
  minYear: string;
  maxYear: string;
  type: string;
  beds: string;
  baths: string;
}

interface FiltersSidebarProps {
  facets?: Facets | null;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FiltersSidebar({
  facets,
  filters,
  onFiltersChange,
}: FiltersSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      minSqft: '',
      maxSqft: '',
      minYear: '',
      maxYear: '',
      type: '',
      beds: '',
      baths: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder={facets ? formatPrice(facets.minPrice) : 'Min'}
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder={facets ? formatPrice(facets.maxPrice) : 'Max'}
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Square Footage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Square Footage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minSqft">Min Sqft</Label>
              <Input
                id="minSqft"
                type="number"
                placeholder={facets ? facets.minSqft.toString() : 'Min'}
                value={localFilters.minSqft}
                onChange={(e) => handleFilterChange('minSqft', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxSqft">Max Sqft</Label>
              <Input
                id="maxSqft"
                type="number"
                placeholder={facets ? facets.maxSqft.toString() : 'Max'}
                value={localFilters.maxSqft}
                onChange={(e) => handleFilterChange('maxSqft', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year Built */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Year Built</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minYear">Min Year</Label>
              <Input
                id="minYear"
                type="number"
                placeholder={facets ? facets.minYear.toString() : 'Min'}
                value={localFilters.minYear}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxYear">Max Year</Label>
              <Input
                id="maxYear"
                type="number"
                placeholder={facets ? facets.maxYear.toString() : 'Max'}
                value={localFilters.maxYear}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={localFilters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Bedrooms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bedrooms</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={localFilters.beds}
            onValueChange={(value) => handleFilterChange('beds', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Bathrooms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bathrooms</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={localFilters.baths}
            onValueChange={(value) => handleFilterChange('baths', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="1.5">1.5+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="2.5">2.5+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}