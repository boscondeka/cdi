import * as L from 'leaflet';

declare module 'leaflet' {
  interface SimpleMapScreenshoterOptions {
    hidden?: boolean;
  }
  
  namespace control {
    function simpleMapScreenshoter(options?: SimpleMapScreenshoterOptions): Control;
  }
}

declare module 'leaflet-simple-map-screenshoter' {
  // This module extends Leaflet's L namespace
}
