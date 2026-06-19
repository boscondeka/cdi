/**
 * Central configuration for all environment-dependent URLs.
 *
 * Set these in your .env file:
 *   VITE_API_URL          — Backend REST API base (with trailing slash)
 *   VITE_GEOSERVER_URL    — GeoServer base URL (no trailing slash)
 *
 * Defaults are for local development.
 */

/** Backend REST API base URL */
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api/v1/";

/** GeoServer base URL (no workspace, no trailing slash) */
export const GEOSERVER_BASE: string =
  (import.meta.env.VITE_GEOSERVER_URL as string) ||
  "http://localhost:8090/geoserver";

// Drought base URL

export const DROUGHT_BASE: string =
  (import.meta.env.VITE_DROUGHT_URL as string) ||
  "https://droughtbackend.rosewillbome.co.ke/";

/** GeoServer WMS endpoint for the wfews workspace (boundaries, floods, geodata) */
export const GEOSERVER_WFEWS_WMS = `${GEOSERVER_BASE}/wfews/wms`;

/** GeoServer WMS endpoint for the uganda_weather workspace (ICON, GFS, IMERG) */
export const GEOSERVER_WEATHER_WMS = `${GEOSERVER_BASE}/uganda_weather/wms`;

/** GeoServer WCS endpoint for the uganda_weather workspace (raw GeoTIFF downloads) */
export const GEOSERVER_WEATHER_WCS = `${GEOSERVER_BASE}/uganda_weather/wcs`;

// drougth endpoint assesment count
export const DROUGHT_ASSESMENT_COUNT = `${DROUGHT_BASE}data/district/assessment/count`;

// drought endpoint images

export const DROUGHT_CDI_IMAGE = `${DROUGHT_BASE}data/all/cdi`;
