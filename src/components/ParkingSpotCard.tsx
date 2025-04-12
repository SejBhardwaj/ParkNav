
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin, Clock, Star, Users, IndianRupee } from 'lucide-react';
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
    rating?: number;
    reviews?: number;
    etaMinutes?: number;
  };
  onNavigate: (coordinates: [number, number]) => void;
  onReport: (id: string) => void;
  onReserve?: (id: string) => void;
}

const ParkingSpotCard: React.FC<ParkingSpotProps> = ({ 
  spot, 
  onNavigate, 
  onReport,
  onReserve 
}) => {
  const availabilityPercentage = (spot.available / spot.total) * 100;
  let availabilityColor = 'bg-red-500 dark:bg-red-600';
  
  if (availabilityPercentage > 60) {
    availabilityColor = 'bg-green-500 dark:bg-green-600';
  } else if (availabilityPercentage > 30) {
    availabilityColor = 'bg-amber-500 dark:bg-amber-600';
  }

  return (
    <Card className="w-full shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 animate-fade-in">
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
      <CardContent className="py-2 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Availability</span>
          <span className="text-sm font-bold">
            {spot.available}/{spot.total} spots
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${availabilityColor} h-2 rounded-full transition-all duration-300`} 
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Price</span>
          <span className="text-sm font-bold flex items-center">
            <IndianRupee className="h-3 w-3 mr-1" />{spot.price}/hr
          </span>
        </div>

        {/* Rating section */}
        {spot.rating && (
          <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14}
                  className={i < Math.floor(spot.rating || 0) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300 dark:text-gray-600"
                  } 
                />
              ))}
              <span className="ml-1 text-sm font-medium">{spot.rating.toFixed(1)}</span>
            </div>
            {spot.reviews && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {spot.reviews} reviews
              </div>
            )}
          </div>
        )}

        {/* ETA information */}
        {spot.etaMinutes && (
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>ETA: <strong>{spot.etaMinutes} min</strong></span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 gap-2">
        <Button 
          variant="outline" 
          className="text-xs flex-1" 
          size="sm"
          onClick={() => onReport(spot.id)}
        >
          Update
        </Button>
        {onReserve && (
          <Button 
            variant="secondary"
            className="text-xs flex-1" 
            size="sm"
            onClick={() => onReserve(spot.id)}
          >
            Reserve
          </Button>
        )}
        <Button 
          className="text-xs bg-parknav-blue hover:bg-blue-600 flex-1" 
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
