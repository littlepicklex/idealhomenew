'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG, createMarkerElement, createPopupContent, getMarkerColor, getMarkerSize } from '@/lib/mapbox';
import { cn } from '@/lib/utils';

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
  hoveredProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  className?: string;
  height?: string;
}

export default function MapboxMap({
  properties,
  selectedProperty,
  hoveredProperty,
  onPropertySelect,
  className = '',
  height = '100%'
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    if (!MAPBOX_CONFIG.accessToken) {
      console.warn('Mapbox access token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.');
      return;
    }

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: MAPBOX_CONFIG.defaultCenter,
      zoom: MAPBOX_CONFIG.defaultZoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Handle map load
    map.current.on('load', () => {
      setIsLoaded(true);
    });

    // Handle map click
    map.current.on('click', (e) => {
      // Check if click is on a marker
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['property-markers']
      });
      
      if (features.length > 0) {
        const propertyId = features[0].properties?.id;
        const property = properties.find(p => p.id === propertyId);
        if (property && onPropertySelect) {
          onPropertySelect(property);
        }
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Add new markers
    properties.forEach(property => {
      const markerElement = createMarkerElement(property);
      
      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      }).setHTML(createPopupContent(property));

      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([property.lng, property.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      // Add hover handlers
      markerElement.addEventListener('mouseenter', () => {
        markerElement.classList.add('highlighted');
        popup.addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.classList.remove('highlighted');
        popup.remove();
      });

      markers.current.set(property.id, marker);
    });

    // Fit map to show all properties if there are any
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(property => {
        bounds.extend([property.lng, property.lat]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [properties, isLoaded, onPropertySelect]);

  // Handle selected property
  useEffect(() => {
    if (!map.current || !selectedProperty) return;

    const marker = markers.current.get(selectedProperty.id);
    if (marker) {
      // Fly to selected property
      map.current.flyTo({
        center: [selectedProperty.lng, selectedProperty.lat],
        zoom: 15,
        duration: 1000
      });

      // Open popup
      marker.getPopup().addTo(map.current);
    }
  }, [selectedProperty]);

  // Handle hovered property
  useEffect(() => {
    if (!map.current) return;

    // Remove all highlights
    markers.current.forEach((marker, propertyId) => {
      const element = marker.getElement();
      element.classList.remove('highlighted');
    });

    // Highlight hovered property
    if (hoveredProperty) {
      const marker = markers.current.get(hoveredProperty.id);
      if (marker) {
        const element = marker.getElement();
        element.classList.add('highlighted');
      }
    }
  }, [hoveredProperty]);

  // Show fallback if no access token
  if (!MAPBOX_CONFIG.accessToken) {
    return (
      <div className={cn("mapbox-container bg-muted flex items-center justify-center", className)} style={{ height }}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗺️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {properties.length} properties found
          </p>
          <p className="text-xs text-muted-foreground">
            Add your Mapbox access token to enable the interactive map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mapbox-container", className)} style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
        <h4 className="text-sm font-medium mb-2">Property Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">High Score (80+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Good Score (60-79)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground">Low Score (&lt;60)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
