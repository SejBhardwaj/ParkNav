
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Map from '@/components/Map';
import SearchBar from '@/components/SearchBar';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import ReportDialog from '@/components/ReportDialog';
import SplashScreen from '@/components/SplashScreen';
import AuthDialog from '@/components/AuthDialog';
import { searchParkingSpots, navigateToParkingSpot, getParkingSpotById } from '@/lib/api';
import { MapPin, CircleSlash, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [spotToReport, setSpotToReport] = useState<{id: string, name: string, totalSpots: number} | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);

  useEffect(() => {
    // Initial data loading after splash screen
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const spots = await searchParkingSpots('');
        
        // Add mock ratings and ETA to spots
        const spotsWithRatings = spots.map(spot => ({
          ...spot,
          rating: (3 + Math.random() * 2), // Rating between 3 and 5
          reviews: Math.floor(10 + Math.random() * 90), // Reviews between 10 and 100
          etaMinutes: Math.floor(5 + Math.random() * 20) // ETA between 5 and 25 minutes
        }));
        
        setParkingSpots(spotsWithRatings);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          title: "Error",
          description: "Could not load parking data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (!showSplash) {
      loadInitialData();
    }
  }, [showSplash]);

  const handleSearch = async (query: string, filter: string) => {
    try {
      setLoading(true);
      const results = await searchParkingSpots(query, filter);
      
      // Add mock ratings and ETA to spots
      const resultsWithRatings = results.map(spot => ({
        ...spot,
        rating: (3 + Math.random() * 2), // Rating between 3 and 5
        reviews: Math.floor(10 + Math.random() * 90), // Reviews between 10 and 100
        etaMinutes: Math.floor(5 + Math.random() * 20) // ETA between 5 and 25 minutes
      }));
      
      setParkingSpots(resultsWithRatings);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term or filter.",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Could not perform search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedFilters = (filters: any) => {
    setAdvancedFilters(filters);
    toast({
      title: "Filters Applied",
      description: `Showing results with ${filters.parkingType !== 'all' ? filters.parkingType + ' parking, ' : ''}max price ₹${filters.maxPrice}/hr`,
    });
    
    // Mock implementation - in real app would call API with filters
    setLoading(true);
    setTimeout(() => {
      // Filter the existing spots based on the criteria
      const filteredSpots = parkingSpots.filter(spot => 
        spot.price <= filters.maxPrice &&
        (filters.parkingType === 'all' || spot.type === filters.parkingType) &&
        ((spot.available / spot.total) * 100) >= filters.minAvailability
      );
      
      setParkingSpots(filteredSpots);
      setLoading(false);
    }, 800);
  };

  const handleSpotSelect = (spot: any) => {
    setSelectedSpot(spot);
  };

  const handleNavigate = async (coordinates: [number, number]) => {
    try {
      toast({
        title: "Navigation Started",
        description: "Follow directions on the map to reach your destination.",
      });
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Failed",
        description: "Could not start navigation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReport = async (spotId: string) => {
    try {
      const spot = await getParkingSpotById(spotId);
      if (spot) {
        setSpotToReport({
          id: spot.id,
          name: spot.name,
          totalSpots: spot.totalSpots
        });
        setReportDialogOpen(true);
      }
    } catch (error) {
      console.error('Error getting spot details:', error);
      toast({
        title: "Error",
        description: "Could not load spot details. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReserve = (spotId: string) => {
    // Check if user is authenticated
    const isAuthenticated = false; // This would be a real check in production

    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    // Mock reservation
    toast({
      title: "Spot Reserved",
      description: "Your parking spot has been reserved for 30 minutes.",
    });
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              title="Find Parking" 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            />
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
              <motion.div 
                className="w-full md:w-96 flex flex-col gap-4 order-2 md:order-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SearchBar 
                  onSearch={handleSearch} 
                  onAdvancedFilter={handleAdvancedFilters}
                />
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex-1 overflow-y-auto transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Nearby Parking</h2>
                    {loading && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="animate-rotate h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                        Loading...
                      </div>
                    )}
                  </div>
                  
                  {parkingSpots.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      <CircleSlash className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No parking spots found.</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or location.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {parkingSpots.map(spot => (
                        <ParkingSpotCard 
                          key={spot.id} 
                          spot={{
                            ...spot,
                            coordinates: [spot.longitude, spot.latitude],
                            distance: spot.etaMinutes ? `${spot.etaMinutes} min away` : "10 min away"
                          }}
                          onNavigate={handleNavigate}
                          onReport={handleReport}
                          onReserve={handleReserve}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden order-1 md:order-2 h-[400px] md:h-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Map onSpotSelect={handleSpotSelect} />
              </motion.div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-2 text-center text-xs text-muted-foreground flex justify-center items-center gap-1 transition-colors duration-300">
              <Info className="h-3 w-3" />
              <span>Data is crowdsourced. Help other drivers by reporting availability changes.</span>
            </div>
          </div>
          
          {spotToReport && (
            <ReportDialog 
              isOpen={reportDialogOpen}
              onClose={() => setReportDialogOpen(false)}
              spotId={spotToReport.id}
              spotName={spotToReport.name}
              totalSpots={spotToReport.totalSpots}
            />
          )}
          
          <AuthDialog
            isOpen={authDialogOpen}
            onClose={() => setAuthDialogOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Index;
