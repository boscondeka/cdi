import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { weatherAPI } from '../services/api';

/**
 * Custom hook to fetch and manage weather dashboard data
 * Integrates with global Zustand store
 */
export function useWeatherData() {
  const {
    weatherData,
    weatherLoading,
    weatherError,
    setWeatherData,
    setWeatherLoading,
    setWeatherError,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      setWeatherLoading(true);
      try {
        const data = await weatherAPI.getDashboard();
        setWeatherData(data);
        setWeatherError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data';
        setWeatherError(errorMessage);
        console.error(errorMessage);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchData();
  }, [setWeatherData, setWeatherLoading, setWeatherError]);

  return {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  };
}
