import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { floodAPI } from '../services/api';

/**
 * Custom hook to fetch and manage flood data
 * Integrates with global Zustand store
 */
export function useFloodData(districtId?: number) {
  const {
    floodData,
    floodLoading,
    floodError,
    setFloodData,
    setFloodLoading,
    setFloodError,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      setFloodLoading(true);
      try {
        const data = await floodAPI.getData(districtId);
        setFloodData(data);
        setFloodError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load flood data';
        setFloodError(errorMessage);
        console.error(errorMessage);
      } finally {
        setFloodLoading(false);
      }
    };

    fetchData();
  }, [districtId, setFloodData, setFloodLoading, setFloodError]);

  return {
    data: floodData,
    loading: floodLoading,
    error: floodError,
  };
}
