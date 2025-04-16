
export interface ParkingSpot {
  id: string;
  name: string;
  type: 'street' | 'garage';
  latitude: number;
  longitude: number;
  price: number;
  spotsAvailable: number;
  totalSpots: number;
  rating: number;
  reviews: number;
  features: string[];
  securityLevel: 'high' | 'medium' | 'low';
  etaMinutes?: number;
}

// Mumbai-based sample parking spots
export const sampleParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "BKC Premium Parking",
    type: "garage",
    latitude: 19.0695,
    longitude: 72.8693,
    price: 60,
    spotsAvailable: 45,
    totalSpots: 100,
    rating: 4.5,
    reviews: 128,
    features: ['CCTV', '24/7', 'Covered', 'Security'],
    securityLevel: 'high'
  },
  {
    id: "2",
    name: "Kurla Station West",
    type: "street",
    latitude: 19.0726,
    longitude: 72.8795,
    price: 30,
    spotsAvailable: 5,
    totalSpots: 20,
    rating: 3.8,
    reviews: 85,
    features: ['Open Air', 'Security'],
    securityLevel: 'medium'
  },
  {
    id: "3",
    name: "Phoenix Marketcity Garage",
    type: "garage",
    latitude: 19.0867,
    longitude: 72.8892,
    price: 50,
    spotsAvailable: 120,
    totalSpots: 200,
    rating: 4.2,
    reviews: 256,
    features: ['CCTV', '24/7', 'Covered', 'Security', 'EV Charging'],
    securityLevel: 'high'
  },
  {
    id: "4",
    name: "Santacruz Station East",
    type: "street",
    latitude: 19.0850,
    longitude: 72.8422,
    price: 25,
    spotsAvailable: 8,
    totalSpots: 15,
    rating: 3.5,
    reviews: 42,
    features: ['Open Air'],
    securityLevel: 'low'
  },
  {
    id: "5",
    name: "Bandra Kurla Complex P2",
    type: "garage",
    latitude: 19.0657,
    longitude: 72.8685,
    price: 70,
    spotsAvailable: 85,
    totalSpots: 150,
    rating: 4.7,
    reviews: 312,
    features: ['CCTV', '24/7', 'Covered', 'Security', 'Valet', 'Car Wash'],
    securityLevel: 'high'
  }
];

export const generateETA = (spot: ParkingSpot, userLocation: [number, number]): number => {
  // Calculate rough distance-based ETA (simplified for demo)
  const [userLng, userLat] = userLocation;
  const distance = Math.sqrt(
    Math.pow(spot.latitude - userLat, 2) + Math.pow(spot.longitude - userLng, 2)
  );
  
  // Convert rough distance to minutes (simplified calculation)
  return Math.round(distance * 100);
};

