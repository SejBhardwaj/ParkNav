
import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

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
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-parknav-orange text-white text-[10px]">
                3
              </Badge>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 p-0 dark:bg-gray-800">
            <div className="p-2 border-b dark:border-gray-700">
              <h3 className="font-semibold text-sm">Recent Notifications</h3>
            </div>
            <div className="max-h-[300px] overflow-auto">
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                <p className="text-sm font-medium">Your spot reservation is confirmed</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                <p className="text-sm font-medium">New parking available near you</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <p className="text-sm font-medium">50% discount on BKC Parking</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User profile">
              <User className="h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 p-0 dark:bg-gray-800">
            <div className="p-4 flex items-center gap-3 border-b dark:border-gray-700">
              <div className="h-10 w-10 rounded-full bg-parknav-blue text-white flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Guest User</p>
                <p className="text-xs text-muted-foreground">guest@example.com</p>
              </div>
            </div>
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9">Profile</Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9">My Bookings</Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9">Saved Locations</Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-red-500 dark:text-red-400 h-9">Sign Out</Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

export default Header;
