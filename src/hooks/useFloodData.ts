import { useEffect, useState, useCallback } from 'react';
import { 
  floodAPI, 
  FloodDashboard, 
  BasinStatus, 
  BasinTrend, 
  District, 
  FloodForecast 
} from '../services/api';

interface FloodDataCache {
  dashboard?: FloodDashboard;
  basinStatus?: BasinStatus[];
  basinTrend?: BasinTrend;
  districts?: District[];
  forecasts?: FloodForecast[];
  lastFetch?: Record<string, number>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let floodDataCache: FloodDataCache = {};

/**
 * Hook for fetching and caching flood data
 * Handles loading states, errors, and automatic refetching
 */
export function useFloodData() {
  const [dashboard, setDashboard] = useState<FloodDashboard | null>(null);
  const [basinStatus, setBasinStatus] = useState<BasinStatus[]>([]);
  const [basinTrend, setBasinTrend] = useState<BasinTrend | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [forecasts, setForecasts] = useState<FloodForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCacheValid = useCallback((key: string) => {
    const lastFetch = floodDataCache.lastFetch?.[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  }, []);

  const fetchFloodData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [dashboardRes, basinStatusRes, basinTrendRes, districtsRes, forecastsRes] = await Promise.all([
        !isCacheValid('dashboard') 
          ? floodAPI.getDashboard().catch(() => null)
          : Promise.resolve(floodDataCache.dashboard),
        !isCacheValid('basinStatus')
          ? floodAPI.getBasinStatus().catch(() => [])
          : Promise.resolve(floodDataCache.basinStatus),
        !isCacheValid('basinTrend')
          ? floodAPI.getBasinTrend().catch(() => null)
          : Promise.resolve(floodDataCache.basinTrend),
        !isCacheValid('districts')
          ? floodAPI.getDistricts().then(res => res?.districts || []).catch(() => [])
          : Promise.resolve(floodDataCache.districts),
        !isCacheValid('forecasts')
          ? floodAPI.getForecasts().catch(() => [])
          : Promise.resolve(floodDataCache.forecasts),
      ]);

      // Update cache
      floodDataCache.lastFetch = floodDataCache.lastFetch || {};
      
      if (dashboardRes) {
        floodDataCache.dashboard = dashboardRes;
        floodDataCache.lastFetch.dashboard = Date.now();
        setDashboard(dashboardRes);
      }
      
      if (basinStatusRes) {
        floodDataCache.basinStatus = basinStatusRes;
        floodDataCache.lastFetch.basinStatus = Date.now();
        setBasinStatus(basinStatusRes);
      }
      
      if (basinTrendRes) {
        floodDataCache.basinTrend = basinTrendRes;
        floodDataCache.lastFetch.basinTrend = Date.now();
        setBasinTrend(basinTrendRes);
      }
      
      if (districtsRes) {
        floodDataCache.districts = districtsRes;
        floodDataCache.lastFetch.districts = Date.now();
        setDistricts(districtsRes);
      }
      
      if (forecastsRes) {
        floodDataCache.forecasts = forecastsRes;
        floodDataCache.lastFetch.forecasts = Date.now();
        setForecasts(forecastsRes);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flood data';
      setError(errorMessage);
      console.error('Flood data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  useEffect(() => {
    fetchFloodData();
  }, [fetchFloodData]);

  const refetch = useCallback(() => {
    // Clear cache
    floodDataCache = {};
    fetchFloodData();
  }, [fetchFloodData]);

  return {
    dashboard,
    basinStatus,
    basinTrend,
    districts,
    forecasts,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching a specific basin trend
 */
export function useBasinTrend(basin?: string) {
  const [data, setData] = useState<BasinTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await floodAPI.getBasinTrend(basin);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch basin trend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [basin]);

  return { data, loading, error };
}

/**
 * Hook for fetching flood forecasts
 */
export function useFloodForecasts(date?: string) {
  const [data, setData] = useState<FloodForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await floodAPI.getForecasts(date);
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecasts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return { data, loading, error };
}
