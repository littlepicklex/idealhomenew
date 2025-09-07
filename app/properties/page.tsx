'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import MapboxMap from '@/components/MapboxMap';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ListBulletIcon, 
  MapIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline';

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

interface Facets {
  minPrice: number;
  maxPrice: number;
  minSqft: number;
  maxSqft: number;
  minYear: number;
  maxYear: number;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState('ideality_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minSqft: searchParams.get('minSqft') || '',
    maxSqft: searchParams.get('maxSqft') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    type: searchParams.get('type') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      // Add sorting
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      params.set('limit', '20');

      const response = await fetch(`/api/properties?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  const fetchFacets = useCallback(async () => {
    try {
      const response = await fetch('/api/facets');
      if (response.ok) {
        const data = await response.json();
        setFacets(data);
      }
    } catch (err) {
      console.error('Failed to fetch facets:', err);
    }
  }, []);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    router.push(`/property/${property.id}`);
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredProperty(property);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    const newUrl = params.toString() ? `/properties?${params.toString()}` : '/properties';
    router.replace(newUrl);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
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
    setFilters(clearedFilters);
    router.replace('/properties');
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
              <p className="text-gray-600">
                {properties.length} properties found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideality_score">Ideality Score</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="sqft">Square Feet</SelectItem>
                    <SelectItem value="yearBuilt">Year Built</SelectItem>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSortOrderToggle}
                  className="px-2"
                >
                  {sortOrder === 'desc' ? (
                    <ArrowDownIcon className="w-4 h-4" />
                  ) : (
                    <ArrowUpIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <ListBulletIcon className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filters
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              
              <FiltersSidebar
                facets={facets}
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {viewMode === 'list' ? (
              /* List View */
              <div className="space-y-6">
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        onMouseEnter={() => handlePropertyHover(property)}
                        onMouseLeave={() => handlePropertyHover(null)}
                      >
                        <PropertyCard
                          property={property}
                          onClick={() => handlePropertySelect(property)}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FunnelIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Load More Button */}
                {properties.length > 0 && (
                  <div className="text-center pt-6">
                    <Button
                      variant="outline"
                      onClick={fetchProperties}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Properties'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Map View */
              <div className="flex-1">
                <MapboxMap
                  properties={properties}
                  selectedProperty={selectedProperty || hoveredProperty}
                  onPropertySelect={handlePropertySelect}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}