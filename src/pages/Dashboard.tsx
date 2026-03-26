import { useState, useMemo, lazy, Suspense, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Star, Car, Zap, Shield, Video, Navigation,
  X, Filter, Clock, SlidersHorizontal
} from 'lucide-react';
import { mockParkingSpots } from '../data/mockParkingData';
import type { ParkingSpot, ParkingStatus } from '../types/parking';
import BottomNav from '../components/Navigation/BottomNav';
import { GridPattern, genRandomPattern } from '@/components/ui/grid-feature-cards';

// Lazy load heavy components
const ParkingMap = lazy(() => import('../components/Map/ParkingMap'));

type SortOption = 'distance' | 'price' | 'rating' | 'availability';
type FilterStatus = 'all' | ParkingStatus;

const StatusBadge = memo(({ status }: { status: ParkingStatus }) => {
  const config = {
    available: { label: 'Available', bg: 'bg-green-900/50', text: 'text-green-400', dot: 'bg-green-400' },
    limited: { label: 'Limited', bg: 'bg-amber-900/50', text: 'text-amber-400', dot: 'bg-amber-400' },
    full: { label: 'Full', bg: 'bg-red-900/50', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const SpotCard = memo(({ spot, onSelect, selected }: { spot: ParkingSpot; onSelect: (s: ParkingSpot) => void; selected: boolean }) => {
  const gridPattern = useMemo(() => genRandomPattern(6), []);
  const handleClick = useCallback(() => onSelect(spot), [onSelect, spot]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all border ${
        selected ? 'border-blue-500 bg-gray-900 shadow-lg shadow-blue-950' : 'border-gray-800 bg-gray-900 hover:border-gray-600'
      }`}
    >
      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/3 to-white/1 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={gridPattern}
            className="absolute inset-0 h-full w-full fill-white/5 stroke-white/10 mix-blend-overlay"
          />
        </div>
      </div>

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-bold text-white text-sm leading-tight truncate">{spot.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{spot.address}</p>
          </div>
          <StatusBadge status={spot.status} />
        </div>

        <div className="flex items-center gap-4 mb-3">
          <span className="font-bold text-blue-400 text-base">₹{spot.price}/hr</span>
          <span className="text-gray-500 text-xs flex items-center gap-1"><MapPin size={11} /> {spot.distance} km</span>
          <span className="text-gray-500 text-xs flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" /> {spot.rating}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {spot.features.covered && <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/80 border border-gray-700/50 px-2.5 py-1 rounded-lg"><Car size={10} /> Covered</span>}
          {spot.features.cctv && <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/80 border border-gray-700/50 px-2.5 py-1 rounded-lg"><Video size={10} /> CCTV</span>}
          {spot.features.security && <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/80 border border-gray-700/50 px-2.5 py-1 rounded-lg"><Shield size={10} /> Security</span>}
          {spot.features.evCharging && <span className="flex items-center gap-1 text-xs text-green-400 bg-green-950/60 border border-green-900/50 px-2.5 py-1 rounded-lg"><Zap size={10} /> EV</span>}
        </div>

        <div className="flex gap-2">
          <button
            disabled={spot.status === 'full'}
            className="flex-1 py-2.5 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 disabled:cursor-not-allowed transition-colors"
            onClick={e => e.stopPropagation()}
          >
            {spot.status === 'full' ? 'Spot Full' : 'Book Now'}
          </button>
          <Link
            to="/map"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-700 text-gray-400 text-xs font-medium rounded-xl hover:bg-gray-800 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <Navigation size={12} /> Go
          </Link>
        </div>
      </div>
    </motion.div>
  );
});
SpotCard.displayName = 'SpotCard';

const BookingModal = memo(({ spot, onClose }: { spot: ParkingSpot; onClose: () => void }) => {
  const [hours, setHours] = useState(2);
  const [booked, setBooked] = useState(false);
  const total = hours * spot.price;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Book Parking Spot</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {!booked ? (
          <>
            <div className="bg-gray-800 rounded-2xl p-4 mb-5">
              <h3 className="font-semibold text-white">{spot.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{spot.address}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-blue-400 font-bold">₹{spot.price}/hr</span>
                <span className="text-gray-500 flex items-center gap-1"><MapPin size={12} /> {spot.distance} km</span>
                <StatusBadge status={spot.status} />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <Clock size={14} /> Duration (hours)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 6, 8].map(h => (
                  <button key={h} onClick={() => setHours(h)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      hours === h ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Parking charge</span>
                <span className="text-white">₹{spot.price} × {hours}h</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">Service fee</span>
                <span className="text-white">₹10</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-700 pt-3">
                <span className="text-white">Total</span>
                <span className="text-blue-400 text-lg">₹{total + 10}</span>
              </div>
            </div>

            <button onClick={() => setBooked(true)}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-950">
              Confirm & Pay ₹{total + 10}
            </button>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
            <div className="w-20 h-20 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <Car size={36} className="text-green-400" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-gray-500 text-sm mb-4">{spot.name}</p>
            <div className="bg-gray-800 rounded-2xl p-5 mb-5">
              <div className="text-gray-400 text-sm mb-2">QR Entry Code</div>
              <div className="grid grid-cols-5 gap-1 mx-auto w-fit">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-sm"
                    style={{ backgroundColor: Math.random() > 0.5 ? '#e2e8f0' : '#1e293b' }} />
                ))}
              </div>
              <div className="text-gray-500 text-xs mt-3 font-mono">PKN-{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">Done</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});
BookingModal.displayName = 'BookingModal';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSpotSelect = useCallback((spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setBookingSpot(spot);
  }, []);

  const filtered = useMemo(() => {
    let spots = mockParkingSpots;
    if (search) {
      const q = search.toLowerCase();
      spots = spots.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') spots = spots.filter(s => s.status === filterStatus);
    return [...spots].sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'availability') return b.availableSpots - a.availableSpots;
      return 0;
    });
  }, [search, sortBy, filterStatus]);

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 z-20 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <Link to="/home" className="flex items-center gap-3 flex-shrink-0 min-w-fit">
            <img src="/logo.png" alt="ParkNav Logo" className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-tight">ParkNav</span>
              <span className="text-xs text-gray-500 leading-tight">Park Smarter, Not Harder</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 flex-1 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search location or parking spot..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all flex-shrink-0 ${
                showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <Link to="/profile"
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all flex-shrink-0">
            U
          </Link>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="max-w-7xl mx-auto pt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><Filter size={12} /> Status:</span>
                  {(['all', 'available', 'limited', 'full'] as FilterStatus[]).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                        filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border-none outline-none cursor-pointer">
                    <option value="distance">Distance</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="availability">Availability</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full sm:w-80 lg:w-96 flex-shrink-0 overflow-y-auto bg-gray-950 border-r border-gray-800">
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">{filtered.length} spots found</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-500">Live updates</span>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No parking spots found</p>
              </div>
            ) : (
              filtered.map(spot => (
                <SpotCard key={spot.id} spot={spot}
                  onSelect={handleSpotSelect}
                  selected={selectedSpot?.id === spot.id} />
              ))
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-1 relative">
          <Suspense fallback={<div className="w-full h-full bg-gray-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <ParkingMap spots={filtered} selectedSpot={selectedSpot} onSpotSelect={setSelectedSpot} />
          </Suspense>
        </div>
      </div>

      <BottomNav active="dashboard" />

      <AnimatePresence>
        {bookingSpot && <BookingModal spot={bookingSpot} onClose={() => setBookingSpot(null)} />}
      </AnimatePresence>
    </div>
  );
}
