'use client';

import { useEffect, useRef } from 'react';

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

interface MapboxMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

export default function MapboxMap({
  properties,
  selectedProperty,
  onPropertySelect,
  className = '',
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple map placeholder
    mapContainer.current.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        text-align: center;
        border-radius: 8px;
      ">
        <div>
          <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
          <div>Interactive Map</div>
          <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
            ${properties.length} properties
          </div>
        </div>
      </div>
    `;
  }, [properties]);

  return (
    <div 
      ref={mapContainer}
      className={`w-full h-full ${className}`}
    />
  );
}