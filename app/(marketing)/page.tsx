import { Suspense } from 'react';
import PropertyCard from '@/components/PropertyCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import MapboxMap from '@/components/MapboxMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Map, List, Filter } from 'lucide-react';

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

async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/properties?limit=12`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PropertyFinder Pro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/properties" className="text-gray-600 hover:text-gray-900">Properties</a>
              <a href="/wizard" className="text-gray-600 hover:text-gray-900">Find My Home</a>
              <a href="/login" className="text-gray-600 hover:text-gray-900">Sign In</a>
              <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Property
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover properties with our intelligent scoring system and interactive maps
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Search className="w-5 h-5 mr-2" />
              Browse Properties
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Take the Quiz
            </Button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by location, property type, or features..."
                className="w-full"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <FiltersSidebar />
            </div>

            {/* Properties Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Featured Properties
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button variant="outline" size="sm">
                    <Map className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                </div>
              </div>

              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </Suspense>

              {properties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No properties found</p>
                  <p className="text-gray-400">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PropertyFinder Pro?
            </h3>
            <p className="text-xl text-gray-600">
              Advanced features to help you find your ideal property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Smart Search</h4>
              <p className="text-gray-600">
                Find properties that match your exact preferences with our intelligent filtering system
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Interactive Maps</h4>
              <p className="text-gray-600">
                Explore neighborhoods with detailed maps and property locations
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Ideality Scoring</h4>
              <p className="text-gray-600">
                Get personalized scores for each property based on your preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who found their perfect property
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Your Search
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">PropertyFinder Pro</h4>
              <p className="text-gray-400">
                The smartest way to find your perfect property
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Property Search</a></li>
                <li><a href="#" className="hover:text-white">Interactive Maps</a></li>
                <li><a href="#" className="hover:text-white">Ideality Scoring</a></li>
                <li><a href="#" className="hover:text-white">PDF Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyFinder Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
