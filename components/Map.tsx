'use client';

import { useEffect, useRef } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  lat: number;
  lng: number;
  type: string;
  idealityScore: number;
}

interface MapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

export default function Map({ properties, selectedProperty, onPropertySelect, className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for map integration
    // In a real application, you would integrate with Google Maps, Mapbox, or another mapping service
    
    if (mapRef.current) {
      // Create a simple placeholder map
      mapRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e5f3ff 0%, #f0f9ff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-family: system-ui, sans-serif;
        ">
          <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 300px;
          ">
            <div style="
              width: 64px;
              height: 64px;
              background: #3b82f6;
              border-radius: 50%;
              margin: 0 auto 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
            ">🗺️</div>
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">
              Interactive Map
            </h3>
            <p style="font-size: 14px; line-height: 1.5; margin-bottom: 1rem;">
              ${properties.length} properties found
            </p>
            <p style="font-size: 12px; color: #6b7280;">
              Integrate with Google Maps, Mapbox, or OpenStreetMap
            </p>
          </div>
        </div>
      `;
    }
  }, [properties]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-sm border border-gray-200 transition-colors">
          <span className="text-sm font-medium">+</span>
        </button>
        <button className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-sm border border-gray-200 transition-colors">
          <span className="text-sm font-medium">−</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Property Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">House</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Condo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Townhouse</span>
          </div>
        </div>
      </div>
    </div>
  );
}
