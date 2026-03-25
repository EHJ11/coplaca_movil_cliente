import { useState, useCallback } from 'react';

export interface AsyncState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseAsyncReturn extends AsyncState {
  execute: <T,>(
    asyncFunction: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void
  ) => Promise<T | null>;
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
}

export function useAsync(): UseAsyncReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async <T,>(
      asyncFunction: () => Promise<T>,
      onSuccess?: (data: T) => void,
      onError?: (error: any) => void
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await asyncFunction();

        setSuccess(true);
        setLoading(false);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        const errorMessage = err?.message || 'Ocurrió un error';
        setError(errorMessage);
        setSuccess(false);
        setLoading(false);

        if (onError) {
          onError(err);
        }

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    execute,
    reset,
    setLoading,
    setError,
    setSuccess,
  };
}
