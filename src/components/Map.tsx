import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/components/ui/use-toast';
import { sampleParkingSpots, generateETA, ParkingSpot } from '@/lib/sampleData';
import { Car, Navigation, Clock, Compass, Info, Filter } from 'lucide-react';

// Temporary public token for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNsb3BzZ2l6MzBrb2Eya3BpaDJpMnExcXEifQ.QcJVXaXzOQrfFrbuHlJQqw';

interface MapProps {
  onSpotSelect: (spot: any) => void;
}

// Delhi default center coordinates
const DEFAULT_CENTER = (window as any).defaultMapCenter || {
  latitude: 28.6139,
  longitude: 77.2090,
  zoom: 12
};

const Map: React.FC<MapProps> = ({ onSpotSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeDisplayed, setRouteDisplayed] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<mapboxgl.GeoJSONSource | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  
  // Default coordinates (Delhi)
  const [lng, setLng] = useState(DEFAULT_CENTER.longitude);
  const [lat, setLat] = useState(DEFAULT_CENTER.latitude);
  const [zoom, setZoom] = useState(DEFAULT_CENTER.zoom);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [nearbySpotsOnly, setNearbySpotsOnly] = useState(true);
  const [visibleSpots, setVisibleSpots] = useState<ParkingSpot[]>([]);

  const animateCarMovement = (userLocation: [number, number]) => {
    if (!userMarker.current || !map.current) return;
    
    const angle = Math.random() * 360; // Random direction
    const distance = 0.0002; // Small movement distance
    
    const newLng = userLocation[0] + Math.cos(angle) * distance;
    const newLat = userLocation[1] + Math.sin(angle) * distance;
    
    // Animate the movement
    userMarker.current.setLngLat([newLng, newLat])
      .setRotation(angle * (180 / Math.PI));
      
    return [newLng, newLat] as [number, number];
  };

  // Sort parking spots by distance to user
  const sortSpotsByProximity = (spots: ParkingSpot[], userLoc: [number, number] | null): ParkingSpot[] => {
    if (!userLoc) return spots;
    
    return [...spots].sort((a, b) => {
      const distA = calculateDistance(userLoc, [a.longitude, a.latitude]);
      const distB = calculateDistance(userLoc, [b.longitude, b.latitude]);
      return distA - distB;
    });
  };

  // Filter spots to only show nearby ones (within 5km by default)
  const filterNearbySpots = (spots: ParkingSpot[], userLoc: [number, number] | null, radius: number = 5): ParkingSpot[] => {
    if (!userLoc || !nearbySpotsOnly) return spots;
    
    return spots.filter(spot => {
      const distance = calculateDistance(userLoc, [spot.longitude, spot.latitude]);
      return distance <= radius;
    });
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with a more animated style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 45, // Add tilt for a more 3D effect
      bearing: 0,
      antialias: true, // Smooth edges for a better visual
      attributionControl: false // Hide attribution for cleaner UI
    });

    // Add attribution control in a custom position
    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
      }),
      'top-right'
    );

    // Add geolocate control (to find user location)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocateControl);

    map.current.on('load', () => {
      setMapReady(true);
      
      // Add 3D building layer for enhanced visuals
      map.current?.setFog({
        'color': 'rgb(186, 210, 235)', 
        'horizon-blend': 0.02
      });
      
      // Add 3D buildings - only appears at certain zoom levels
      if (!map.current?.getLayer('3d-buildings')) {
        map.current?.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 14,
          'paint': {
            'fill-extrusion-color': [
              'match',
              ['get', 'type'],
              'commercial', '#6B7DB3',
              'residential', '#D1C0A8',
              '#aaa'
            ],
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              14, 0,
              16, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              14, 0,
              16, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }
      
      // Attempt to geolocate the user automatically
      geolocateControl.trigger();
      
      // Listen for position updates from the geolocate control
      geolocateControl.on('geolocate', (e: any) => {
        const position = [e.coords.longitude, e.coords.latitude] as [number, number];
        setUserLocation(position);
        
        // Create animated car marker for user's position if it doesn't exist
        if (!userMarker.current) {
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'car-marker';
          el.innerHTML = `<div class="p-2 bg-blue-500 rounded-full shadow-lg animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>`;
          
          // Create the marker and add it to the map
          userMarker.current = new mapboxgl.Marker({
            element: el,
            rotationAlignment: 'map'
          })
            .setLngLat(position)
            .addTo(map.current!);
          
          // Fly to user location with animation
          map.current?.flyTo({
            center: position,
            essential: true,
            zoom: 15,
            speed: 0.8,
            curve: 1
          });
        } else {
          // Update the marker position
          userMarker.current.setLngLat(position);
        }
      });
      
      // Set up event listeners
      map.current?.on('move', () => {
        if (map.current) {
          const center = map.current.getCenter();
          setLng(Number(center.lng.toFixed(4)));
          setLat(Number(center.lat.toFixed(4)));
          setZoom(Number(map.current.getZoom().toFixed(2)));
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !map.current) return;
    
    // Update spots with ETAs and apply sorting and filtering
    let processedSpots = [...sampleParkingSpots];
    
    // Add ETAs if user location exists
    if (userLocation) {
      processedSpots = processedSpots.map(spot => ({
        ...spot,
        etaMinutes: generateETA(spot, userLocation)
      }));
      
      // Filter nearby spots if enabled
      processedSpots = filterNearbySpots(processedSpots, userLocation);
      
      // Sort by proximity to user
      processedSpots = sortSpotsByProximity(processedSpots, userLocation);
    }
    
    // Save visible spots for later use
    setVisibleSpots(processedSpots);

    // Add parking spots to map
    if (!map.current.getSource('parking-spots')) {
      map.current.addSource('parking-spots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: processedSpots.map(spot => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [spot.longitude, spot.latitude]
            },
            properties: {
              ...spot,
              id: spot.id,
              name: spot.name,
              type: spot.type,
              latitude: spot.latitude,
              longitude: spot.longitude,
              available: spot.spotsAvailable,
              total: spot.totalSpots,
              price: spot.price,
              rating: spot.rating,
              reviews: spot.reviews,
              features: spot.features,
              securityLevel: spot.securityLevel
            }
          }))
        }
      });

      // Add marker layer with custom styling
      map.current.addLayer({
        id: 'parking-spots-layer',
        type: 'circle',
        source: 'parking-spots',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 6,
            16, 12
          ],
          'circle-color': [
            'match',
            ['get', 'type'],
            'street', '#FF6B35',
            'garage', '#2E7BFF',
            '#888'
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'available'],
            0, 0.4,
            10, 0.8
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add pulsing effect layer
      map.current.addLayer({
        id: 'parking-spots-pulse',
        type: 'circle',
        source: 'parking-spots',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 10,
            16, 20
          ],
          'circle-color': [
            'match',
            ['get', 'type'],
            'street', '#FF6B35',
            'garage', '#2E7BFF',
            '#888'
          ],
          'circle-opacity': 0.2,
          'circle-stroke-width': 0,
          'circle-blur': 1
        }
      });
    } else {
      // Update existing source with new data
      const source = map.current.getSource('parking-spots') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'FeatureCollection',
        features: processedSpots.map(spot => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [spot.longitude, spot.latitude]
          },
          properties: {
            ...spot,
            id: spot.id,
            name: spot.name,
            type: spot.type,
            latitude: spot.latitude,
            longitude: spot.longitude,
            available: spot.spotsAvailable,
            total: spot.totalSpots,
            price: spot.price,
            rating: spot.rating,
            reviews: spot.reviews,
            features: spot.features,
            securityLevel: spot.securityLevel
          }
        }))
      });
    }

    // Handle click events
    if (!map.current.listenerCount('click', 'parking-spots-layer')) {
      map.current.on('click', 'parking-spots-layer', (e) => {
        if (!e.features?.length) return;
        
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice() as [number, number];
        const properties = feature.properties as any;
        
        // Set the selected spot ID
        setSelectedSpotId(properties.id);
        
        // Calculate ETA if user location exists
        const eta = userLocation ? generateETA({
          id: properties.id,
          name: properties.name,
          type: properties.type,
          latitude: properties.latitude,
          longitude: properties.longitude,
          price: properties.price,
          spotsAvailable: properties.available,
          totalSpots: properties.total,
          rating: properties.rating,
          reviews: properties.reviews,
          features: Array.isArray(properties.features) ? properties.features : properties.features.split(','),
          securityLevel: properties.securityLevel || 'medium'
        } as ParkingSpot, userLocation) : undefined;
        
        // Create a popup with more detailed information
        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: '300px',
          className: 'custom-popup'
        })
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-3 dark:bg-gray-800">
              <h3 class="font-semibold text-lg">${properties.name}</h3>
              <div class="flex items-center mt-1 text-sm">
                <span class="text-yellow-500">★</span> 
                <span class="ml-1">${properties.rating.toFixed(1)}</span>
                <span class="text-gray-500 ml-1">(${properties.reviews} reviews)</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full ${properties.available > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2"></div>
                  <span>${properties.available}/${properties.total} spots</span>
                </div>
                <div class="flex items-center">
                  <span class="font-semibold">₹${properties.price}/hr</span>
                </div>
                ${eta ? `
                <div class="flex items-center col-span-2 mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>ETA: ~${eta} mins</span>
                </div>` : ''}
              </div>
              <div class="mt-2 text-sm flex flex-wrap gap-1">
                ${typeof properties.features === 'string' 
                  ? properties.features.split(',').map((feature: string) => 
                      `<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">${feature}</span>`
                    ).join('')
                  : properties.features.map((feature: string) => 
                      `<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">${feature}</span>`
                    ).join('')
                }
              </div>
              <button id="get-directions" class="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Get Directions
              </button>
            </div>
          `)
          .addTo(map.current);
        
        // Convert properties to ParkingSpot format before passing to onSpotSelect
        const completeSpot: ParkingSpot = {
          id: properties.id,
          name: properties.name,
          type: properties.type,
          latitude: properties.latitude,
          longitude: properties.longitude,
          price: properties.price,
          spotsAvailable: properties.available,
          totalSpots: properties.total,
          rating: properties.rating,
          reviews: properties.reviews,
          features: Array.isArray(properties.features) ? properties.features : properties.features.split(','),
          securityLevel: properties.securityLevel || 'medium',
          etaMinutes: eta
        };
        
        // Pass selected spot to parent with the correct type
        onSpotSelect({
          ...completeSpot,
          coordinates
        });
        
        // Add event listener to the "Get Directions" button
        setTimeout(() => {
          const directionButton = document.getElementById('get-directions');
          if (directionButton && userLocation) {
            directionButton.addEventListener('click', () => {
              calculateAndDisplayRoute(userLocation, coordinates);
            });
          }
        }, 100);
      });
    }
  }, [mapReady, userLocation, nearbySpotsOnly]);

  // Toggle nearby spots filter
  const toggleNearbyFilter = () => {
    setNearbySpotsOnly(!nearbySpotsOnly);
    toast({
      title: nearbySpotsOnly ? "Showing all parking spots" : "Showing nearby spots only",
      description: nearbySpotsOnly ? "Displaying parking spots across Delhi" : "Filtered to spots within 5km of your location",
    });
  };

  // Simulate car movement for demo purposes
  useEffect(() => {
    if (!userLocation || !userMarker.current || !map.current) return;
    
    // Simulate movement by slightly changing position every few seconds
    const interval = setInterval(() => {
      if (userLocation && userMarker.current) {
        const newLocation = animateCarMovement(userLocation);
        setUserLocation(newLocation);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [userLocation]);

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate and display a route from start to end
  const calculateAndDisplayRoute = (start: [number, number], end: [number, number]) => {
    if (!map.current) return;

    // In a real app, this would call a routing API
    // For this demo, we'll create a simple route with intermediate points
    
    // Remove existing route if present
    if (routeDisplayed) {
      if (map.current.getLayer('route-layer')) {
        map.current.removeLayer('route-layer');
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
      setRouteDisplayed(false);
    }
    
    // Create a simple direct route (in a real app, use a routing API)
    const distance = calculateDistance(start, end);
    
    // Create some intermediate points for a more realistic route
    const points = 5; // Number of intermediate points
    const route = [start];
    
    // Add some randomness to make route look more natural
    for (let i = 1; i <= points; i++) {
      const ratio = i / (points + 1);
      const lat = start[1] + (end[1] - start[1]) * ratio;
      const lng = start[0] + (end[0] - start[0]) * ratio;
      
      // Add some randomness
      const offset = 0.001 * Math.sin(i * Math.PI); // Creates slight curve
      route.push([lng + offset, lat + offset * 2] as [number, number]);
    }
    
    route.push(end);
    
    // Add the route source
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
    });
    
    // Add animated route layer
    map.current.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#2E7BFF',
        'line-width': 4,
        'line-opacity': 0.8,
        'line-dasharray': [0, 2, 1] // Makes the line appear to flow
      }
    });
    
    // Animate the line dash to create a flowing effect
    let dashOffset = 0;
    function animateDashArray() {
      dashOffset = (dashOffset + 1) % 4;
      map.current?.setPaintProperty('route-layer', 'line-dasharray', [0, dashOffset, 1]);
      requestAnimationFrame(animateDashArray);
    }
    
    requestAnimationFrame(animateDashArray);
    
    // Calculate estimated duration (simple calculation)
    const speedKmPerHour = 30; // Assuming average city speed
    const durationHours = distance / speedKmPerHour;
    const durationMinutes = Math.round(durationHours * 60);
    
    // Set state
    setRouteDisplayed(true);
    setRouteDistance(parseFloat(distance.toFixed(1)));
    setRouteDuration(durationMinutes);
    
    // Show route information in a toast
    toast({
      title: "Route Calculated",
      description: `Distance: ${distance.toFixed(1)} km • ETA: ~${durationMinutes} mins`,
      duration: 5000,
    });
    
    // Fit map to show route with padding
    const bounds = new mapboxgl.LngLatBounds()
      .extend(start)
      .extend(end);
      
    map.current.fitBounds(bounds, {
      padding: 100,
      duration: 1000
    });
  };

  return (
    <div className="relative w-full h-full flex-1">
      <div ref={mapContainer} className="absolute inset-0 rounded-md overflow-hidden" />
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-md shadow-md text-xs">
        <div>
          Delhi, India • {userLocation ? 'Live Location Active' : 'Locating...'}
        </div>
      </div>
      
      {/* Filter control */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md shadow-md text-sm ${
            nearbySpotsOnly ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
          }`}
          onClick={toggleNearbyFilter}
        >
          <Filter size={14} />
          {nearbySpotsOnly ? 'Nearby Only' : 'All Spots'}
        </button>
      </div>
      
      {userLocation && (
        <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-md shadow-md flex items-center gap-2 text-sm animate-fade-in">
          <Car size={16} className="text-blue-500" />
          <span>Live location active</span>
        </div>
      )}
      
      {routeDisplayed && routeDistance && routeDuration && (
        <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-md shadow-md flex flex-col gap-1 animate-fade-in">
          <h4 className="font-semibold text-sm flex items-center">
            <Navigation size={14} className="mr-1 text-blue-500" />
            Route Information
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center">
              <Compass size={12} className="mr-1" />
              {routeDistance} km
            </span>
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              ~{routeDuration} mins
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
