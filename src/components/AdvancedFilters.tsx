
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Filter, Gauge, IndianRupee, Clock, MapPin } from 'lucide-react';

interface AdvancedFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onApplyFilters }) => {
  const [maxPrice, setMaxPrice] = useState(100);
  const [minAvailability, setMinAvailability] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [parkingType, setParkingType] = useState('all');
  const [hasEV, setHasEV] = useState(false);
  const [hasCCTV, setHasCCTV] = useState(false);
  const [hasRoof, setHasRoof] = useState(false);
  const [sortBy, setSortBy] = useState('distance');

  const handleApply = () => {
    const filters = {
      maxPrice,
      minAvailability,
      maxDistance,
      parkingType,
      features: {
        hasEV,
        hasCCTV,
        hasRoof,
      },
      sortBy,
    };
    
    onApplyFilters(filters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[300px] sm:max-w-md overflow-y-auto dark:bg-gray-900">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Customize your search to find the perfect parking spot
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center">
                <IndianRupee className="h-4 w-4 mr-2" />
                <span>Maximum Price per Hour</span>
              </Label>
              <span className="font-medium">₹{maxPrice}</span>
            </div>
            <Slider
              value={[maxPrice]}
              onValueChange={(values) => setMaxPrice(values[0])}
              min={0}
              max={300}
              step={10}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹300</span>
            </div>
          </div>
          
          {/* Minimum Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                <span>Minimum Availability</span>
              </Label>
              <span className="font-medium">{minAvailability}%</span>
            </div>
            <Slider
              value={[minAvailability]}
              onValueChange={(values) => setMinAvailability(values[0])}
              min={0}
              max={100}
              step={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Maximum Distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Maximum Distance</span>
              </Label>
              <span className="font-medium">{maxDistance} km</span>
            </div>
            <Slider
              value={[maxDistance]}
              onValueChange={(values) => setMaxDistance(values[0])}
              min={0.5}
              max={10}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5 km</span>
              <span>10 km</span>
            </div>
          </div>
          
          {/* Parking Type */}
          <div className="space-y-2">
            <Label>Parking Type</Label>
            <RadioGroup value={parkingType} onValueChange={setParkingType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Types</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="street" id="street" />
                <Label htmlFor="street">Street Parking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="garage" id="garage" />
                <Label htmlFor="garage">Garage Parking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free Parking Only</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">EV Charging</span>
              <Switch checked={hasEV} onCheckedChange={setHasEV} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CCTV Surveillance</span>
              <Switch checked={hasCCTV} onCheckedChange={setHasCCTV} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Covered Parking</span>
              <Switch checked={hasRoof} onCheckedChange={setHasRoof} />
            </div>
          </div>
          
          {/* Sort By */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Sort Results By</span>
            </Label>
            <RadioGroup value={sortBy} onValueChange={setSortBy} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distance" id="distance" />
                <Label htmlFor="distance">Distance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price" id="price" />
                <Label htmlFor="price">Price (Low to High)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="availability" id="availability" />
                <Label htmlFor="availability">Availability</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="rating" />
                <Label htmlFor="rating">Rating</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Reset</Button>
          <Button 
            className="bg-parknav-blue hover:bg-blue-600"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
