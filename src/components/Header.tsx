
import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white dark:bg-gray-900 py-4 px-4 shadow-sm flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">
            <span className="text-parknav-orange">Park</span>
            <span className="text-parknav-blue">Nav</span>
            {title && <span className="text-parknav-dark dark:text-white"> | {title}</span>}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="User profile">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
