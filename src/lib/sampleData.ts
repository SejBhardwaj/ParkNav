
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

// Delhi-based sample parking spots
export const sampleParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Connaught Place Multi-Level",
    type: "garage",
    latitude: 28.6304,
    longitude: 77.2177,
    price: 60,
    spotsAvailable: 85,
    totalSpots: 150,
    rating: 4.6,
    reviews: 208,
    features: ['CCTV', '24/7', 'Covered', 'Security', 'Car Wash'],
    securityLevel: 'high'
  },
  {
    id: "2",
    name: "Rajiv Chowk Metro Station",
    type: "street",
    latitude: 28.6333,
    longitude: 77.2196,
    price: 40,
    spotsAvailable: 12,
    totalSpots: 30,
    rating: 3.9,
    reviews: 125,
    features: ['Open Air', 'Security', 'Metro Access'],
    securityLevel: 'medium'
  },
  {
    id: "3",
    name: "Select Citywalk Mall",
    type: "garage",
    latitude: 28.5293,
    longitude: 77.2195,
    price: 50,
    spotsAvailable: 220,
    totalSpots: 350,
    rating: 4.4,
    reviews: 312,
    features: ['CCTV', '24/7', 'Covered', 'Security', 'EV Charging'],
    securityLevel: 'high'
  },
  {
    id: "4",
    name: "Karol Bagh Market",
    type: "street",
    latitude: 28.6542,
    longitude: 77.1901,
    price: 30,
    spotsAvailable: 8,
    totalSpots: 25,
    rating: 3.5,
    reviews: 87,
    features: ['Open Air', 'Market Access'],
    securityLevel: 'low'
  },
  {
    id: "5",
    name: "DLF Emporio Vasant Kunj",
    type: "garage",
    latitude: 28.5253,
    longitude: 77.1576,
    price: 70,
    spotsAvailable: 120,
    totalSpots: 200,
    rating: 4.7,
    reviews: 178,
    features: ['CCTV', '24/7', 'Covered', 'Security', 'Valet', 'Premium'],
    securityLevel: 'high'
  },
  {
    id: "6",
    name: "Nehru Place Tech Hub",
    type: "garage",
    latitude: 28.5484,
    longitude: 77.2508,
    price: 40,
    spotsAvailable: 65,
    totalSpots: 120,
    rating: 4.1,
    reviews: 156,
    features: ['CCTV', 'Covered', 'Security'],
    securityLevel: 'medium'
  },
  {
    id: "7",
    name: "India Gate Circle",
    type: "street",
    latitude: 28.6129,
    longitude: 77.2295,
    price: 50,
    spotsAvailable: 15,
    totalSpots: 40,
    rating: 4.2,
    reviews: 193,
    features: ['Tourist Spot', 'Open Air', 'Security'],
    securityLevel: 'medium'
  },
  {
    id: "8",
    name: "Lajpat Nagar Central Market",
    type: "street",
    latitude: 28.5703,
    longitude: 77.2396,
    price: 35,
    spotsAvailable: 22,
    totalSpots: 50,
    rating: 3.7,
    reviews: 124,
    features: ['Open Air', 'Market Access'],
    securityLevel: 'medium'
  }
];

export const generateETA = (spot: ParkingSpot, userLocation: [number, number]): number => {
  // Calculate rough distance-based ETA (simplified for demo)
  const [userLng, userLat] = userLocation;
  
  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  // Haversine formula for more accurate distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(spot.latitude - userLat);
  const dLon = toRadians(spot.longitude - userLng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(userLat)) * Math.cos(toRadians(spot.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Calculate ETA based on distance (assume average speed of 30 km/h in Delhi traffic)
  // Convert to minutes
  const averageSpeedKmPerHour = 30;
  const timeHours = distance / averageSpeedKmPerHour;
  const timeMinutes = Math.round(timeHours * 60);
  
  // Add some randomness to account for traffic conditions (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
  return Math.max(1, Math.round(timeMinutes * randomFactor));
};
