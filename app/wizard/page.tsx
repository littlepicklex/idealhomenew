'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, Building, Building2 } from 'lucide-react';

interface WizardData {
  minPrice: string;
  maxPrice: string;
  propertyTypes: string[];
  beds: string;
  baths: string;
  minSqft: string;
}

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    minPrice: '',
    maxPrice: '',
    propertyTypes: [],
    beds: '',
    baths: '',
    minSqft: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (data.minPrice) params.set('minPrice', data.minPrice);
    if (data.maxPrice) params.set('maxPrice', data.maxPrice);
    if (data.propertyTypes.length > 0) params.set('type', data.propertyTypes.join(','));
    if (data.beds) params.set('beds', data.beds);
    if (data.baths) params.set('baths', data.baths);
    if (data.minSqft) params.set('minSqft', data.minSqft);

    // Redirect to properties page with query parameters
    router.push(`/properties?${params.toString()}`);
  };

  const updateData = (field: keyof WizardData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const togglePropertyType = (type: string) => {
    const newTypes = data.propertyTypes.includes(type)
      ? data.propertyTypes.filter(t => t !== type)
      : [...data.propertyTypes, type];
    updateData('propertyTypes', newTypes);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.minPrice && data.maxPrice && parseInt(data.minPrice) < parseInt(data.maxPrice);
      case 2:
        return data.propertyTypes.length > 0;
      case 3:
        return data.beds && data.baths && data.minSqft;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget</h2>
              <p className="text-gray-600">What's your price range?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minPrice">Minimum Price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="200000"
                  value={data.minPrice}
                  onChange={(e) => updateData('minPrice', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Maximum Price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="500000"
                  value={data.maxPrice}
                  onChange={(e) => updateData('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {data.minPrice && data.maxPrice && parseInt(data.minPrice) >= parseInt(data.maxPrice) && (
              <p className="text-red-600 text-sm">Maximum price must be greater than minimum price</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Type</h2>
              <p className="text-gray-600">What type of property are you looking for?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'house', label: 'House', icon: Home, description: 'Single-family home' },
                { type: 'apartment', label: 'Apartment', icon: Building, description: 'Multi-unit building' },
                { type: 'condo', label: 'Condo', icon: Building2, description: 'Individually owned unit' },
              ].map(({ type, label, icon: Icon, description }) => (
                <Card
                  key={type}
                  className={`cursor-pointer transition-all ${
                    data.propertyTypes.includes(type)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => togglePropertyType(type)}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold text-lg mb-2">{label}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {data.propertyTypes.length === 0 && (
              <p className="text-red-600 text-sm text-center">Please select at least one property type</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle Preferences</h2>
              <p className="text-gray-600">Tell us about your ideal home</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="beds">Bedrooms</Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="3"
                  value={data.beds}
                  onChange={(e) => updateData('beds', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="baths">Bathrooms</Label>
                <Input
                  id="baths"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  placeholder="2"
                  value={data.baths}
                  onChange={(e) => updateData('baths', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="minSqft">Minimum Square Feet</Label>
                <Input
                  id="minSqft"
                  type="number"
                  min="500"
                  placeholder="1500"
                  value={data.minSqft}
                  onChange={(e) => updateData('minSqft', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Consider your family size when choosing bedrooms</li>
                <li>• More bathrooms can increase property value</li>
                <li>• Square footage affects both comfort and maintenance costs</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions to get personalized property recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!isStepValid()}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              Find Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Summary */}
        {currentStep === totalSteps && (
          <Card className="mt-8 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Your Preferences Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Budget:</span> ${data.minPrice} - ${data.maxPrice}
                </div>
                <div>
                  <span className="font-medium">Property Types:</span> {data.propertyTypes.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Bedrooms:</span> {data.beds}
                </div>
                <div>
                  <span className="font-medium">Bathrooms:</span> {data.baths}
                </div>
                <div>
                  <span className="font-medium">Minimum Sqft:</span> {data.minSqft}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}