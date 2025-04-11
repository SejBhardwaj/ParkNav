
// This is a mock API service for demonstration purposes
// In a real app, this would connect to a backend service

interface ParkingSpot {
  id: string;
  name: string;
  type: 'street' | 'garage';
  latitude: number;
  longitude: number;
  spotsAvailable: number;
  totalSpots: number;
  price: number;
  address?: string;
}

// Sample data for Indian cities (Mumbai focus)
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
    address: 'Lower Parel, Mumbai'
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
    address: 'Marine Drive, Mumbai'
  },
  {
    id: '3',
    name: 'Bandra Kurla Complex Parking',
    type: 'garage',
    latitude: 19.0630,
    longitude: 72.8682,
    spotsAvailable: 120,
    totalSpots: 200,
    price: 80,
    address: 'BKC, Mumbai'
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
    address: 'Juhu, Mumbai'
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
    address: 'Powai, Mumbai'
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
    address: 'Malad West, Mumbai'
  },
  {
    id: '7',
    name: 'Gateway of India Parking',
    type: 'garage',
    latitude: 18.9217,
    longitude: 72.8347,
    spotsAvailable: 25,
    totalSpots: 60,
    price: 70,
    address: 'Colaba, Mumbai'
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
    address: 'Dadar, Mumbai'
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
    address: 'Connaught Place, New Delhi'
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
    address: 'MG Road, Bangalore'
  }
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
    } else if (filter === 'Free') {
      filteredSpots = filteredSpots.filter(spot => spot.price === 0);
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
