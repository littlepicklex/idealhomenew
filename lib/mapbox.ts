// Mapbox configuration and utilities
export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  defaultCenter: [-74.006, 40.7128] as [number, number], // New York City
  defaultZoom: 10,
};

// Property marker colors based on ideality score
export const getMarkerColor = (score: number): string => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

// Property marker size based on price
export const getMarkerSize = (price: number): number => {
  if (price >= 1000000) return 12;
  if (price >= 500000) return 10;
  if (price >= 250000) return 8;
  return 6;
};

// Create marker HTML element
export const createMarkerElement = (property: {
  id: string;
  price: number;
  idealityScore: number;
  type: string;
}) => {
  const marker = document.createElement('div');
  marker.className = 'property-marker';
  marker.style.cssText = `
    width: ${getMarkerSize(property.price)}px;
    height: ${getMarkerSize(property.price)}px;
    background-color: ${getMarkerColor(property.idealityScore)};
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  `;
  
  marker.setAttribute('data-property-id', property.id);
  marker.setAttribute('data-property-type', property.type);
  
  return marker;
};

// Create popup content
export const createPopupContent = (property: {
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  idealityScore: number;
  type: string;
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return `
    <div class="mapbox-popup-content">
      <div class="popup-header">
        <h3 class="popup-title">${property.title}</h3>
        <div class="popup-score">${property.idealityScore}/100</div>
      </div>
      <div class="popup-price">${formatPrice(property.price)}</div>
      <div class="popup-details">
        <span>${property.beds} bed${property.beds !== 1 ? 's' : ''}</span>
        <span>${property.baths} bath${property.baths !== 1 ? 's' : ''}</span>
        <span>${property.sqft.toLocaleString()} sqft</span>
      </div>
      <div class="popup-type">${property.type}</div>
    </div>
  `;
};
