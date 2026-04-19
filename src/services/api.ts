/**
 * Centralized API service for all weather/disaster data fetching
 * Uses environment variables for endpoints
 */

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://multihazard.rosewillbome.space/api/v1/";

// interface ApiResponse<T> {
//   data: T;
//   error: string | null;
//   loading: boolean;
// }

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchData<T>(
  endpoint: string,
  options?: FetchOptions,
): Promise<T> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Overview API
 */
export const overviewAPI = {
  getModuleStats: async () => {
    return fetchData("overview/modules/");
  },

  getQuickStats: async () => {
    return fetchData("overview/quick-stats/");
  },
};

/**
 * Alerts API
 */
export const alertsAPI = {
  getRecent: async (limit: number = 5) => {
    return fetchData(`alerts/recent/?limit=${limit}`);
  },
};

/**
 * Weather/Dashboard API
 */
export const weatherAPI = {
  getDashboard: async (districtId?: number) => {
    const endpoint = districtId
      ? `weather/dashboard/?district_id=${districtId}`
      : "weather/dashboard/";
    return fetchData(endpoint);
  },

  getForecastHourly: async (districtId?: number) => {
    const endpoint = districtId
      ? `weather/forecast/hourly?district_id=${districtId}`
      : "weather/hourly";
    return fetchData(endpoint);
  },
  getForecastDaily: async (districtId?: number) => {
    const endpoint = districtId
      ? `weather/forecast/forecast?district_id=${districtId}`
      : "weather/forecast";
    return fetchData(endpoint);
  },
  getExportData: async (districtId?: number) => {
    const endpoint = districtId
      ? `weather/export?district_id=${districtId}`
      : "weather/export";

    const url = `${API_BASE}${endpoint}`;
    return fetch(url); // return raw Response, not fetchData()
  },
};

/**
 * Drought API
 */
export const droughtAPI = {
  getData: async (districtId?: number) => {
    const endpoint = districtId
      ? `${import.meta.env.VITE_API_DROUGHT_ENDPOINT || "drought/data"}?district_id=${districtId}`
      : import.meta.env.VITE_API_DROUGHT_ENDPOINT || "drought/data";
    return fetchData(endpoint);
  },

  getRegions: async () => {
    return fetchData("drought/regions");
  },
};

/**
 * Flood API
 */
export const floodAPI = {
  getData: async (districtId?: number) => {
    const endpoint = districtId
      ? `${import.meta.env.VITE_API_FLOOD_ENDPOINT || "flood/data"}?district_id=${districtId}`
      : import.meta.env.VITE_API_FLOOD_ENDPOINT || "flood/data";
    return fetchData(endpoint);
  },

  getAreas: async () => {
    return fetchData("flood/areas");
  },
};

/**
 * Weather Stations API
 */
export const stationsAPI = {
  getAll: async () => {
    return fetchData(
      import.meta.env.VITE_API_STATIONS_ENDPOINT || "stations/data",
    );
  },

  getById: async (stationId: string | number) => {
    return fetchData(`stations/${stationId}`);
  },

  getStatus: async () => {
    return fetchData("stations/status");
  },
};

/**
 * GeoJSON data fetching (for boundaries, maps, etc.)
 */
export const geoAPI = {
  getUgandaBoundary: async () => {
    return fetchData(
      "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries/UGA.geojson",
    );
  },

  getDistricts: async () => {
    return fetchData("geojson/districts");
  },

  getWaterAreas: async () => {
    return fetchData("geojson/water-areas");
  },
};

export default {
  overviewAPI,
  alertsAPI,
  weatherAPI,
  droughtAPI,
  floodAPI,
  stationsAPI,
  geoAPI,
};
