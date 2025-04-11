
import React from 'react';
import { Home, Map, Clock, Settings, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              <span className="text-parknav-orange">Park</span>
              <span className="text-parknav-blue">Nav</span>
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Map className="mr-2 h-5 w-5" />
                  Explore
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4">
            <Button className="w-full bg-parknav-blue hover:bg-blue-600">
              <Plus className="mr-2 h-5 w-5" />
              Report Parking
            </Button>
          </div>
          
          <div className="p-4 text-xs text-center text-gray-500">
            <p>ParkNav India v1.0</p>
            <p>© 2025 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
