
import * as mapboxgl from 'mapbox-gl';

declare module 'mapbox-gl' {
  interface Geometry {
    coordinates: number[];
    type: string;
  }
  
  namespace GeoJSON {
    interface Geometry {
      coordinates: number[];
      type: string;
    }
    
    interface Feature {
      geometry: {
        coordinates: number[];
        type: string;
      };
      properties: {
        [name: string]: any;
      };
    }
  }

  interface GeoJSONFeature {
    properties: {
      [name: string]: any;
    };
  }
}
