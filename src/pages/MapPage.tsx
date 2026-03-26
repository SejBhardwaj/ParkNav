import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockParkingSpots } from '../data/mockParkingData';
import ParkingMap from '../components/Map/ParkingMap';
import BottomNav from '../components/Navigation/BottomNav';
import type { ParkingSpot } from '../types/parking';

const SpotListItem = memo(({ spot, selected, onSelect }: { spot: ParkingSpot; selected: boolean; onSelect: (spot: ParkingSpot | null) => void }) => {
  const handleClick = useCallback(() => {
    onSelect(selected ? null : spot);
  }, [spot, selected, onSelect]);

  return (
    <motion.div
      whileHover={{ x: 3 }}
      onClick={handleClick}
      className={`p-3 rounded-xl cursor-pointer border transition-all ${
        selected
          ? 'border-blue-500 bg-blue-950/40'
          : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
          backgroundColor: spot.status === 'available' ? '#10B981' : spot.status === 'limited' ? '#F59E0B' : '#EF4444',
        }} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{spot.name}</div>
          <div className="text-xs text-gray-500">{spot.distance}km · ₹{spot.price}/hr</div>
        </div>
      </div>
    </motion.div>
  );
});
SpotListItem.displayName = 'SpotListItem';

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <MapPin size={16} color="white" />
            </div>
            <span className="font-bold text-white">Map View</span>
          </div>
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search on map..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-xl text-gray-400 hover:bg-gray-700 transition-colors flex-shrink-0">
            <Filter size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex flex-col w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold text-gray-300 text-sm">Nearby Spots</h3>
          </div>
          <div className="p-3 space-y-2">
            {mockParkingSpots.map(spot => (
              <SpotListItem
                key={spot.id}
                spot={spot}
                selected={selectedSpot?.id === spot.id}
                onSelect={setSelectedSpot}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <ParkingMap spots={mockParkingSpots} selectedSpot={selectedSpot} onSpotSelect={setSelectedSpot} />
        </div>
      </div>

      <BottomNav active="map" />
    </div>
  );
}
