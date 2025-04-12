
import React, { useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdvancedFilters from './AdvancedFilters';

interface SearchBarProps {
  onSearch: (query: string, filter: string) => void;
  onAdvancedFilter?: (filters: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAdvancedFilter }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [location, setLocation] = useState('Current Location');

  const handleSearch = () => {
    onSearch(query, filter);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdvancedFilters = (filters: any) => {
    if (onAdvancedFilter) {
      onAdvancedFilter(filters);
    }
  };

  const popularLocations = [
    'Current Location',
    'Mumbai Central',
    'Bandra West',
    'Andheri East',
    'Powai',
    'Worli',
    'Dadar',
    'Juhu'
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 space-y-2 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 dark:text-gray-300 shrink-0">
              <MapPin className="h-4 w-4" />
              <span className="max-w-[100px] truncate hidden sm:inline">{location}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 dark:bg-gray-800">
            {popularLocations.map((loc) => (
              <DropdownMenuItem 
                key={loc} 
                onClick={() => setLocation(loc)}
                className="cursor-pointer"
              >
                {loc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for parking location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 dark:text-gray-300">
              {filter} <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-gray-800">
            <DropdownMenuItem onClick={() => setFilter('All')}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('Street')}>
              Street Parking
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('Garage')}>
              Garage Parking
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('Free')}>
              Free Parking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between items-center px-1">
        <AdvancedFilters onApplyFilters={handleAdvancedFilters} />
        
        <Button 
          onClick={handleSearch}
          className="bg-parknav-blue hover:bg-blue-600 text-sm"
          size="sm"
        >
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
