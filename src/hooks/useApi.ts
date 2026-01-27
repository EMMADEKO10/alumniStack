'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

/**
 * Hook personnalisé pour les appels API avec cache côté client
 */
export function useApi<T>(
  url: string | null,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    initialData = null,
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Utiliser le cache navigateur pour réduire les requêtes
        cache: 'force-cache',
        next: { revalidate: 60 }, // Revalider après 60 secondes
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [url, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch automatique si spécifié
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(fetchData, refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
}

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables>(
  url: string,
  options: {
    method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { method = 'POST', onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
          cache: 'no-store', // Ne pas cacher les mutations
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue');
        setError(error);

        if (onError) {
          onError(error);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  return {
    mutate,
    loading,
    error,
  };
}

/**
 * Hook pour paginer les données
 */
export function usePagination<T>(
  baseUrl: string,
  itemsPerPage: number = 20
) {
  const [page, setPage] = useState(1);
  const url = `${baseUrl}?page=${page}&limit=${itemsPerPage}`;

  const result = useApi<{ data: T[]; totalCount: number; page: number; limit: number }>(url);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  return {
    ...result,
    page,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: result.data ? result.data.data.length === itemsPerPage : false,
    hasPrevPage: page > 1,
  };
}
