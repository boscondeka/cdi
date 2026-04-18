import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { stationsAPI } from '../services/api';

/**
 * Custom hook to fetch and manage weather stations data
 * Integrates with global Zustand store
 */
export function useStationsData() {
  const {
    stationsData,
    stationsLoading,
    stationsError,
    setStationsData,
    setStationsLoading,
    setStationsError,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      setStationsLoading(true);
      try {
        const data = await stationsAPI.getAll();
        setStationsData(data);
        setStationsError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stations data';
        setStationsError(errorMessage);
        console.error(errorMessage);
      } finally {
        setStationsLoading(false);
      }
    };

    fetchData();
  }, [setStationsData, setStationsLoading, setStationsError]);

  return {
    data: stationsData,
    loading: stationsLoading,
    error: stationsError,
  };
}
