
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/components/ui/use-toast';
import { getParkingSpots } from '@/lib/api';

// Temporary public token for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNsb3BzZ2l6MzBrb2Eya3BpaDJpMnExcXEifQ.QcJVXaXzOQrfFrbuHlJQqw';

interface MapProps {
  onSpotSelect: (spot: any) => void;
}

const Map: React.FC<MapProps> = ({ onSpotSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Default coordinates (Mumbai)
  const [lng, setLng] = useState(72.8777);
  const [lat, setLat] = useState(19.0760);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
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
      
      // Attempt to geolocate the user automatically
      geolocateControl.trigger();
      
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
        
        // Add layer for parking spots
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
            'circle-stroke-color': '#fff'
          }
        });
        
        // Add click event for parking spots
        map.current.on('click', 'parking-spots-layer', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
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

  return (
    <div className="relative w-full h-full flex-1">
      <div ref={mapContainer} className="absolute inset-0 rounded-md overflow-hidden" />
      <div className="absolute top-4 left-4 bg-white p-2 rounded-md shadow-md text-xs">
        <div>
          Longitude: {lng} | Latitude: {lat}
        </div>
        <div>Zoom: {zoom}</div>
      </div>
    </div>
  );
};

export default Map;
