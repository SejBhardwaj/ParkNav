
// This is a mock API service for demonstration purposes
// In a real app, this would connect to a backend service

interface ParkingSpot {
  id: string;
  name: string;
  type: 'street' | 'garage' | 'premium';
  latitude: number;
  longitude: number;
  spotsAvailable: number;
  totalSpots: number;
  price: number;
  address?: string;
  features?: string[];
  openTime?: string;
  closeTime?: string;
  securityCamera?: boolean;
  isCovered?: boolean;
  hasElectricCharging?: boolean;
  discountAvailable?: boolean;
  operatedBy?: string;
}

// Enhanced sample data for Indian cities (Mumbai focus)
const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    name: 'Phoenix Mall Parking',
    type: 'garage',
    latitude: 19.0760,
    longitude: 72.8777,
    spotsAvailable: 45,
    totalSpots: 100,
    price: 60,
    address: 'Lower Parel, Mumbai',
    features: ['Security cameras', 'Covered', 'Valet service'],
    openTime: '09:00',
    closeTime: '23:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: true,
    operatedBy: 'Phoenix Malls Ltd.'
  },
  {
    id: '2',
    name: 'Marine Drive Street Parking',
    type: 'street',
    latitude: 18.9442,
    longitude: 72.8228,
    spotsAvailable: 8,
    totalSpots: 30,
    price: 40,
    address: 'Marine Drive, Mumbai',
    features: ['Sea view', 'Night parking'],
    openTime: '00:00',
    closeTime: '23:59',
    securityCamera: false,
    isCovered: false,
    operatedBy: 'Mumbai Municipal Corporation'
  },
  {
    id: '3',
    name: 'Bandra Kurla Complex Parking',
    type: 'premium',
    latitude: 19.0630,
    longitude: 72.8682,
    spotsAvailable: 120,
    totalSpots: 200,
    price: 80,
    address: 'BKC, Mumbai',
    features: ['Covered', 'Security', 'EV charging', 'Car wash'],
    openTime: '06:00',
    closeTime: '00:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: true,
    discountAvailable: true,
    operatedBy: 'BKC Developments'
  },
  {
    id: '4',
    name: 'Juhu Beach Parking',
    type: 'street',
    latitude: 19.0883,
    longitude: 72.8264,
    spotsAvailable: 5,
    totalSpots: 25,
    price: 30,
    address: 'Juhu, Mumbai',
    features: ['Beach view', 'Night lighting'],
    openTime: '06:00',
    closeTime: '23:00',
    securityCamera: false,
    isCovered: false,
    operatedBy: 'Juhu Beach Authority'
  },
  {
    id: '5',
    name: 'Powai Lake Parking',
    type: 'street',
    latitude: 19.1273,
    longitude: 72.9048,
    spotsAvailable: 15,
    totalSpots: 40,
    price: 20,
    address: 'Powai, Mumbai',
    features: ['Lake view', 'Near restaurants'],
    openTime: '08:00',
    closeTime: '22:00',
    securityCamera: false,
    isCovered: false,
    operatedBy: 'Powai Lake Management'
  },
  {
    id: '6',
    name: 'Inorbit Mall Parking',
    type: 'garage',
    latitude: 19.1359,
    longitude: 72.8296,
    spotsAvailable: 70,
    totalSpots: 150,
    price: 50,
    address: 'Malad West, Mumbai',
    features: ['Covered', 'Security', 'Mall access'],
    openTime: '10:00',
    closeTime: '22:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: false,
    discountAvailable: true,
    operatedBy: 'Inorbit Malls'
  },
  {
    id: '7',
    name: 'Gateway of India Parking',
    type: 'premium',
    latitude: 18.9217,
    longitude: 72.8347,
    spotsAvailable: 25,
    totalSpots: 60,
    price: 70,
    address: 'Colaba, Mumbai',
    features: ['Tourist spot', 'Security', 'Valet'],
    openTime: '08:00',
    closeTime: '23:00',
    securityCamera: true,
    isCovered: false,
    hasElectricCharging: false,
    operatedBy: 'Gateway Tourism Department'
  },
  {
    id: '8',
    name: 'Dadar Station Parking',
    type: 'street',
    latitude: 19.0178,
    longitude: 72.8478,
    spotsAvailable: 10,
    totalSpots: 20,
    price: 25,
    address: 'Dadar, Mumbai',
    features: ['Near station', '24/7 security'],
    openTime: '00:00',
    closeTime: '23:59',
    securityCamera: true,
    isCovered: false,
    operatedBy: 'Central Railways'
  },
  // Add spots in other Indian cities
  {
    id: '9',
    name: 'Connaught Place Parking',
    type: 'garage',
    latitude: 28.6315,
    longitude: 77.2167,
    spotsAvailable: 55,
    totalSpots: 120,
    price: 60,
    address: 'Connaught Place, New Delhi',
    features: ['Central location', 'Underground', 'CCTV'],
    openTime: '08:00',
    closeTime: '22:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: true,
    operatedBy: 'NDMC'
  },
  {
    id: '10',
    name: 'MG Road Parking',
    type: 'street',
    latitude: 12.9716,
    longitude: 77.5946,
    spotsAvailable: 12,
    totalSpots: 30,
    price: 40,
    address: 'MG Road, Bangalore',
    features: ['Shopping area', 'Metered'],
    openTime: '09:00',
    closeTime: '21:00',
    securityCamera: false,
    isCovered: false,
    operatedBy: 'Bangalore Municipal Corporation'
  },
  {
    id: '11',
    name: 'Cyber Hub Parking',
    type: 'premium',
    latitude: 28.4949,
    longitude: 77.0905,
    spotsAvailable: 80,
    totalSpots: 200,
    price: 75,
    address: 'DLF Cyber City, Gurgaon',
    features: ['Valet', 'Corporate', 'EV charging'],
    openTime: '08:00',
    closeTime: '00:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: true,
    discountAvailable: true,
    operatedBy: 'DLF Cyber City'
  },
  {
    id: '12',
    name: 'Lulu Mall Parking',
    type: 'garage',
    latitude: 10.0090,
    longitude: 76.3074,
    spotsAvailable: 95,
    totalSpots: 250,
    price: 40,
    address: 'Edappally, Kochi',
    features: ['Multi-level', 'Air-conditioned', 'Family spots'],
    openTime: '09:00',
    closeTime: '22:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: false,
    discountAvailable: true,
    operatedBy: 'Lulu Group'
  },
  {
    id: '13',
    name: 'Taj Mahal East Gate Parking',
    type: 'premium',
    latitude: 27.1751,
    longitude: 78.0421,
    spotsAvailable: 30,
    totalSpots: 50,
    price: 100,
    address: 'East Gate, Taj Mahal, Agra',
    features: ['Tourist spot', 'Secure', 'Guide available'],
    openTime: '06:00',
    closeTime: '19:00',
    securityCamera: true,
    isCovered: false,
    hasElectricCharging: false,
    operatedBy: 'Agra Development Authority'
  },
  {
    id: '14',
    name: 'Park Street Parking',
    type: 'street',
    latitude: 22.5550,
    longitude: 88.3512,
    spotsAvailable: 18,
    totalSpots: 35,
    price: 35,
    address: 'Park Street, Kolkata',
    features: ['Entertainment district', 'Night parking'],
    openTime: '10:00',
    closeTime: '02:00',
    securityCamera: false,
    isCovered: false,
    operatedBy: 'Kolkata Municipal Corporation'
  },
  {
    id: '15',
    name: 'Elante Mall Parking',
    type: 'garage',
    latitude: 30.7046,
    longitude: 76.8011,
    spotsAvailable: 110,
    totalSpots: 300,
    price: 50,
    address: 'Industrial Area, Chandigarh',
    features: ['Multi-level', 'Covered', 'Family spots'],
    openTime: '10:00',
    closeTime: '22:00',
    securityCamera: true,
    isCovered: true,
    hasElectricCharging: true,
    discountAvailable: true,
    operatedBy: 'Elante Mall Management'
  },
];

// Add a delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all parking spots
export const getParkingSpots = async (): Promise<ParkingSpot[]> => {
  await delay(800); // Simulate network delay
  return mockParkingSpots;
};

// Get a specific parking spot by ID
export const getParkingSpotById = async (id: string): Promise<ParkingSpot | undefined> => {
  await delay(500);
  return mockParkingSpots.find(spot => spot.id === id);
};

// Search for parking spots
export const searchParkingSpots = async (query: string, filter?: string): Promise<ParkingSpot[]> => {
  await delay(600);
  
  let filteredSpots = mockParkingSpots;
  
  // Apply text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredSpots = filteredSpots.filter(spot => 
      spot.name.toLowerCase().includes(lowerQuery) || 
      (spot.address && spot.address.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Apply filter
  if (filter && filter !== 'All') {
    if (filter === 'Street') {
      filteredSpots = filteredSpots.filter(spot => spot.type === 'street');
    } else if (filter === 'Garage') {
      filteredSpots = filteredSpots.filter(spot => spot.type === 'garage');
    } else if (filter === 'Premium') {
      filteredSpots = filteredSpots.filter(spot => spot.type === 'premium');
    } else if (filter === 'Free') {
      filteredSpots = filteredSpots.filter(spot => spot.price === 0);
    } else if (filter === 'EV Charging') {
      filteredSpots = filteredSpots.filter(spot => spot.hasElectricCharging);
    }
  }
  
  return filteredSpots;
};

// Report parking availability
export const reportParkingAvailability = async (spotId: string, availableSpots: number): Promise<void> => {
  await delay(1000);
  
  const spotIndex = mockParkingSpots.findIndex(spot => spot.id === spotId);
  if (spotIndex !== -1) {
    mockParkingSpots[spotIndex].spotsAvailable = availableSpots;
  } else {
    throw new Error('Parking spot not found');
  }
};

// Navigate to a parking spot (mock function)
export const navigateToParkingSpot = async (spotId: string): Promise<{success: boolean, message: string}> => {
  await delay(700);
  return {
    success: true,
    message: 'Navigation started. Follow the directions on the map.'
  };
};

// Get parking statistics (mock function for dashboard)
export const getParkingStatistics = async (): Promise<any> => {
  await delay(800);
  
  // Generate some mock statistics
  return {
    totalParking: mockParkingSpots.length,
    totalAvailableSpots: mockParkingSpots.reduce((sum, spot) => sum + spot.spotsAvailable, 0),
    totalCapacity: mockParkingSpots.reduce((sum, spot) => sum + spot.totalSpots, 0),
    averagePrice: Math.round(mockParkingSpots.reduce((sum, spot) => sum + spot.price, 0) / mockParkingSpots.length),
    cityData: [
      { city: 'Mumbai', count: 8 },
      { city: 'Delhi', count: 2 },
      { city: 'Bangalore', count: 1 },
      { city: 'Kolkata', count: 1 },
      { city: 'Others', count: 3 }
    ],
    typeDistribution: [
      { type: 'Street', count: mockParkingSpots.filter(spot => spot.type === 'street').length },
      { type: 'Garage', count: mockParkingSpots.filter(spot => spot.type === 'garage').length },
      { type: 'Premium', count: mockParkingSpots.filter(spot => spot.type === 'premium').length }
    ],
    hourlyOccupancy: [
      {time: '6 AM', occupancyRate: 10},
      {time: '9 AM', occupancyRate: 45},
      {time: '12 PM', occupancyRate: 65},
      {time: '3 PM', occupancyRate: 80},
      {time: '6 PM', occupancyRate: 95},
      {time: '9 PM', occupancyRate: 70},
      {time: '12 AM', occupancyRate: 30}
    ]
  };
};

// Generate recommendations based on location (mock function)
export const getRecommendedSpots = async (latitude: number, longitude: number): Promise<ParkingSpot[]> => {
  await delay(600);
  
  // In a real app, this would use geospatial calculations
  // For the demo, just return a few random spots
  const shuffled = [...mockParkingSpots].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};
