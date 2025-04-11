
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/components/ui/use-toast';
import { getParkingSpots } from '@/lib/api';
import { Car, NavigationIcon } from 'lucide-react';

// Temporary public token for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNsb3BzZ2l6MzBrb2Eya3BpaDJpMnExcXEifQ.QcJVXaXzOQrfFrbuHlJQqw';

interface MapProps {
  onSpotSelect: (spot: any) => void;
}

const Map: React.FC<MapProps> = ({ onSpotSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeDisplayed, setRouteDisplayed] = useState(false);
  
  // Default coordinates (Mumbai)
  const [lng, setLng] = useState(72.8777);
  const [lat, setLat] = useState(19.0760);
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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
      antialias: true // Smooth edges for a better visual
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add geolocate control (to find user location)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
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
            'fill-extrusion-color': '#aaa',
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

  // Load parking spots when map is ready
  useEffect(() => {
    if (mapReady && map.current) {
      loadParkingSpots();
    }
  }, [mapReady]);

  // Simulate car movement for demo purposes
  useEffect(() => {
    if (!userLocation || !userMarker.current || !map.current) return;
    
    // Simulate movement by slightly changing position every few seconds
    const interval = setInterval(() => {
      if (userLocation && userMarker.current) {
        // Random small movement
        const newLng = userLocation[0] + (Math.random() - 0.5) * 0.0005;
        const newLat = userLocation[1] + (Math.random() - 0.5) * 0.0005;
        const newLocation: [number, number] = [newLng, newLat];
        
        // Animate movement
        userMarker.current.setLngLat(newLocation);
        setUserLocation(newLocation);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [userLocation]);

  const loadParkingSpots = async () => {
    try {
      const spots = await getParkingSpots();
      
      if (!map.current) return;
      
      // Add source for parking spots
      if (!map.current.getSource('parking-spots')) {
        map.current.addSource('parking-spots', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: spots.map(spot => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [spot.longitude, spot.latitude]
              },
              properties: {
                id: spot.id,
                name: spot.name,
                type: spot.type,
                available: spot.spotsAvailable,
                total: spot.totalSpots,
                price: spot.price,
              }
            }))
          }
        });
        
        // Add layer for parking spots with animated appearance
        map.current.addLayer({
          id: 'parking-spots-layer',
          type: 'circle',
          source: 'parking-spots',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              10, 4,
              15, 8
            ],
            'circle-color': [
              'match',
              ['get', 'type'],
              'street', '#FF6B35',
              'garage', '#2E7BFF',
              '#888'
            ],
            'circle-opacity': 0.9,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-pitch-alignment': 'map'
          }
        });
        
        // Add a pulsing circle animation layer
        map.current.addLayer({
          id: 'parking-spots-pulse',
          type: 'circle',
          source: 'parking-spots',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 10,
              15, 20
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
              0, 0.1,
              5, 0.3,
              10, 0.5
            ],
            'circle-stroke-width': 0,
            'circle-blur': 0.5
          }
        });
        
        // Add click event for parking spots
        map.current.on('click', 'parking-spots-layer', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice() as [number, number];
            const properties = feature.properties;
            
            // Create popup
            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(`
                <div>
                  <h3 class="font-semibold">${properties.name}</h3>
                  <p class="text-sm">Available: <span class="font-semibold">${properties.available}/${properties.total}</span></p>
                  <p class="text-sm">Price: <span class="font-semibold">₹${properties.price}/hr</span></p>
                </div>
              `)
              .addTo(map.current!);
            
            // Draw a simple route from user location to parking spot if available
            if (userLocation && !routeDisplayed) {
              drawSimpleRoute(userLocation, coordinates);
              setRouteDisplayed(true);
              
              // Calculate estimated time of arrival (simple estimate)
              const distance = calculateDistance(userLocation, coordinates);
              const estimatedMinutes = Math.round(distance * 20); // Simple formula: ~20 mins per km
              
              toast({
                title: "Route Calculated",
                description: `Estimated arrival time: ${estimatedMinutes} minutes (${distance.toFixed(2)} km)`,
              });
            }
            
            // Pass the selected spot up to parent
            onSpotSelect({
              id: properties.id,
              name: properties.name,
              type: properties.type,
              available: properties.available,
              total: properties.total,
              price: properties.price,
              coordinates: coordinates
            });
          }
        });
        
        // Change cursor on hover
        map.current.on('mouseenter', 'parking-spots-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'parking-spots-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }
    } catch (error) {
      console.error('Error loading parking spots:', error);
      toast({
        title: "Error",
        description: "Failed to load parking spots. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  // Draw a simple route from user to parking spot
  const drawSimpleRoute = (start: [number, number], end: [number, number]) => {
    if (!map.current) return;
    
    // Remove existing route if there is one
    if (map.current.getSource('route')) {
      map.current.removeLayer('route-layer');
      map.current.removeSource('route');
    }
    
    // Add simple route source and layer
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [start, end]
        }
      }
    });
    
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
        'line-dasharray': [0.5, 1.5] // For animated dashed line effect
      }
    });
    
    // Fit map to show both points
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
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-md shadow-md text-xs">
        <div>
          Longitude: {lng} | Latitude: {lat}
        </div>
        <div>Zoom: {zoom}</div>
      </div>
      {userLocation && (
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-md shadow-md flex items-center gap-2 text-sm animate-fade-in">
          <Car size={16} className="text-blue-500" />
          <span>Live location active</span>
        </div>
      )}
    </div>
  );
};

export default Map;
