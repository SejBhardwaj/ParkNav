
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchBarProps {
  onSearch: (query: string, filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const handleSearch = () => {
    onSearch(query, filter);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-2 flex items-center">
      <Search className="h-5 w-5 text-gray-400 mx-2" />
      <Input
        type="text"
        placeholder="Search for parking location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
            {filter} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
  );
};

export default SearchBar;
