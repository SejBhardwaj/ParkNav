import { useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Navigation, Car, Video, Shield, Zap, MapPin } from 'lucide-react';
import { AdvancedMap } from '@/components/ui/interactive-map';
import type { MapMarker } from '@/components/ui/interactive-map';
import type { ParkingSpot } from '../../types/parking';

interface Props {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  available: 'green',
  limited: 'orange',
  full: 'red',
};

const ParkingMap = memo(({ spots, selectedSpot, onSpotSelect }: Props) => {
  // Delhi NCR center
  const center: [number, number] = useMemo(() => [28.6139, 77.2090], []);

  const markers: MapMarker[] = useMemo(() =>
    spots.map(spot => ({
      id: spot.id,
      position: [spot.lat, spot.lng] as [number, number],
      color: STATUS_COLORS[spot.status] ?? 'blue',
      size: 'medium' as const,
      popup: {
        title: spot.name,
        content: `₹${spot.price}/hr · ${spot.availableSpots} spots · ⭐ ${spot.rating}`,
      },
    })),
    [spots]
  );

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const spot = spots.find(s => s.id === marker.id);
    if (spot) onSpotSelect(selectedSpot?.id === spot.id ? null : spot);
  }, [spots, onSpotSelect, selectedSpot]);

  const handleClose = useCallback(() => onSpotSelect(null), [onSpotSelect]);

  return (
    <div className="relative w-full h-full">
      {/* Real Leaflet map */}
      <AdvancedMap
        center={center}
        zoom={12}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        enableClustering={true}
        enableSearch={true}
        enableControls={true}
        style={{ height: '100%', width: '100%' }}
      />

      {/* Availability legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-md border border-slate-200 text-xs z-[1000]">
        <div className="font-semibold text-slate-700 mb-1.5">Availability</div>
        {[
          { color: '#10B981', label: 'Available' },
          { color: '#F59E0B', label: 'Limited' },
          { color: '#EF4444', label: 'Full' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 mb-1 last:mb-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-slate-600">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Selected spot detail panel */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[1000]"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedSpot.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedSpot.address}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="font-bold text-blue-500 text-lg">₹{selectedSpot.price}/hr</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin size={11} /> {selectedSpot.distance} km
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> {selectedSpot.rating}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                {selectedSpot.features.covered && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Car size={9} /> Covered</span>}
                {selectedSpot.features.cctv && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Video size={9} /> CCTV</span>}
                {selectedSpot.features.security && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Shield size={9} /> Security</span>}
                {selectedSpot.features.evCharging && <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg"><Zap size={9} /> EV</span>}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedSpot.status === 'full'}
                >
                  {selectedSpot.status === 'full' ? 'Spot Full' : 'Book Now'}
                </button>
                <button className="flex items-center gap-1 px-3 py-2.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors">
                  <Navigation size={13} /> Directions
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
ParkingMap.displayName = 'ParkingMap';

export default ParkingMap;
