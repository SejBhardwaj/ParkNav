
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  IndianRupee, 
  Info,
  Battery, 
  ShieldCheck,
  Home,
  Umbrella
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

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
    features?: string[];
    securityCamera?: boolean;
    isCovered?: boolean;
    hasElectricCharging?: boolean;
    discountAvailable?: boolean;
    openTime?: string;
    closeTime?: string;
    operatedBy?: string;
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

  // Format type badge style based on type
  const getTypeBadge = () => {
    switch(spot.type) {
      case 'premium':
        return <Badge variant="default" className="ml-2 bg-purple-500 hover:bg-purple-600">Premium</Badge>;
      case 'garage':
        return <Badge variant="default" className="ml-2">Garage</Badge>;
      case 'street':
      default:
        return <Badge variant="secondary" className="ml-2">Street</Badge>;
    }
  };

  // Time formatting helper
  const formatTime = (time?: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Format opening hours
  const getOpeningHours = () => {
    if (!spot.openTime || !spot.closeTime) return 'Hours not specified';
    if (spot.openTime === '00:00' && spot.closeTime === '23:59') return '24 hours';
    return `${formatTime(spot.openTime)} - ${formatTime(spot.closeTime)}`;
  };

  return (
    <Card className="w-full shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {spot.name}
              {getTypeBadge()}
              {spot.discountAvailable && (
                <Badge variant="outline" className="ml-2 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                  Discount
                </Badge>
              )}
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

        {/* Opening hours */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Hours</span>
          <span className="text-sm font-medium">
            {getOpeningHours()}
          </span>
        </div>

        {/* Features section */}
        {spot.features && spot.features.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-200 dark:border-gray-700">
            {spot.hasElectricCharging && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                <Battery className="h-3 w-3 mr-1" />EV Charging
              </Badge>
            )}
            {spot.securityCamera && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <ShieldCheck className="h-3 w-3 mr-1" />Security
              </Badge>
            )}
            {spot.isCovered && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                <Umbrella className="h-3 w-3 mr-1" />Covered
              </Badge>
            )}
          </div>
        )}

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

        {/* Operated by info */}
        {spot.operatedBy && (
          <div className="text-xs text-muted-foreground flex items-center pt-1">
            <Home className="h-3 w-3 mr-1" />
            Operated by: {spot.operatedBy}
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
      
      {/* Detailed info hover card */}
      <HoverCard openDelay={300}>
        <HoverCardTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute bottom-1 right-1 h-6 w-6 p-0 rounded-full"
          >
            <Info className="h-3 w-3" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 dark:bg-gray-800">
          <div className="space-y-3">
            <h4 className="font-semibold">{spot.name} - Detailed Info</h4>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{spot.type.charAt(0).toUpperCase() + spot.type.slice(1)}</span>
              
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">{spot.address}</span>
              
              <span className="text-muted-foreground">Availability:</span>
              <span className="font-medium">{spot.available} of {spot.total} spots</span>
              
              <span className="text-muted-foreground">Price per hour:</span>
              <span className="font-medium">₹{spot.price}</span>
              
              <span className="text-muted-foreground">Hours:</span>
              <span className="font-medium">{getOpeningHours()}</span>
              
              {spot.operatedBy && (
                <>
                  <span className="text-muted-foreground">Operator:</span>
                  <span className="font-medium">{spot.operatedBy}</span>
                </>
              )}
              
              {spot.features && spot.features.length > 0 && (
                <>
                  <span className="text-muted-foreground">Features:</span>
                  <span className="font-medium">{spot.features.join(', ')}</span>
                </>
              )}
            </div>
            
            <div className="flex justify-center pt-2">
              <Button 
                size="sm"
                variant="outline"
                className="text-xs mr-2"
                onClick={() => onReport(spot.id)}
              >
                Update Availability
              </Button>
              <Button 
                size="sm"
                className="text-xs bg-parknav-blue hover:bg-blue-600"
                onClick={() => onNavigate(spot.coordinates)}
              >
                Navigate
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </Card>
  );
};

export default ParkingSpotCard;
