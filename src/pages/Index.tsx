
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Map from '@/components/Map';
import SearchBar from '@/components/SearchBar';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import ReportDialog from '@/components/ReportDialog';
import SplashScreen from '@/components/SplashScreen';
import { searchParkingSpots, navigateToParkingSpot, getParkingSpotById } from '@/lib/api';
import { MapPin } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [spotToReport, setSpotToReport] = useState<{id: string, name: string, totalSpots: number} | null>(null);

  useEffect(() => {
    // Initial data loading after splash screen
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const spots = await searchParkingSpots('');
        setParkingSpots(spots);
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
      setParkingSpots(results);
      
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

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              title="Find Parking" 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            />
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
              <div className="w-full md:w-96 flex flex-col gap-4 order-2 md:order-1">
                <SearchBar onSearch={handleSearch} />
                
                <div className="bg-white rounded-lg shadow-md p-4 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Nearby Parking</h2>
                    {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
                  </div>
                  
                  {parkingSpots.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
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
                            distance: "10 min away" // This would be calculated in a real app
                          }}
                          onNavigate={handleNavigate}
                          onReport={handleReport}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden order-1 md:order-2 h-[400px] md:h-auto">
                <Map onSpotSelect={handleSpotSelect} />
              </div>
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
        </div>
      )}
    </>
  );
};

export default Index;
