
import * as mapboxgl from 'mapbox-gl';

declare module 'mapbox-gl' {
  interface Geometry {
    coordinates?: number[];
  }
}
