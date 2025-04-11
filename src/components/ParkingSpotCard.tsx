
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ParkingSpotProps {
  spot: {
    id: string;
    name: string;
    type: string;
    available: number;
    total: number;
    price: number;
    distance?: string;
    address?: string;
    coordinates: [number, number];
  };
  onNavigate: (coordinates: [number, number]) => void;
  onReport: (id: string) => void;
}

const ParkingSpotCard: React.FC<ParkingSpotProps> = ({ spot, onNavigate, onReport }) => {
  const availabilityPercentage = (spot.available / spot.total) * 100;
  let availabilityColor = 'bg-red-500';
  
  if (availabilityPercentage > 60) {
    availabilityColor = 'bg-green-500';
  } else if (availabilityPercentage > 30) {
    availabilityColor = 'bg-amber-500';
  }

  return (
    <Card className="w-full shadow-md mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {spot.name}
              <Badge 
                variant={spot.type === 'garage' ? 'default' : 'secondary'} 
                className="ml-2"
              >
                {spot.type === 'garage' ? 'Garage' : 'Street'}
              </Badge>
            </CardTitle>
            {spot.address && (
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {spot.address}
              </div>
            )}
          </div>
          {spot.distance && (
            <div className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {spot.distance}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Availability</span>
          <span className="text-sm font-bold">
            {spot.available}/{spot.total} spots
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${availabilityColor} h-2 rounded-full`} 
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-medium">Price</span>
          <span className="text-sm font-bold">₹{spot.price}/hr</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          className="text-xs" 
          size="sm"
          onClick={() => onReport(spot.id)}
        >
          Update Availability
        </Button>
        <Button 
          className="text-xs bg-parknav-blue hover:bg-blue-600" 
          size="sm"
          onClick={() => onNavigate(spot.coordinates)}
        >
          <Navigation className="h-3 w-3 mr-1" />
          Navigate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParkingSpotCard;
