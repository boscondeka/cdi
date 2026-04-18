import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { droughtAPI } from '../services/api';

/**
 * Custom hook to fetch and manage drought data
 * Integrates with global Zustand store
 */
export function useDroughtData(districtId?: number) {
  const {
    droughtData,
    droughtLoading,
    droughtError,
    setDroughtData,
    setDroughtLoading,
    setDroughtError,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      setDroughtLoading(true);
      try {
        const data = await droughtAPI.getData(districtId);
        setDroughtData(data);
        setDroughtError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load drought data';
        setDroughtError(errorMessage);
        console.error(errorMessage);
      } finally {
        setDroughtLoading(false);
      }
    };

    fetchData();
  }, [districtId, setDroughtData, setDroughtLoading, setDroughtError]);

  return {
    data: droughtData,
    loading: droughtLoading,
    error: droughtError,
  };
}
