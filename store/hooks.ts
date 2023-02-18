import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from '@/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

interface Options {
  url: string;
}
export const useFetch = (options: Options) => {
  // TODO: Fix the backend to return an standard response (any is ugly as hell)
  const [response, setResponse] = useState(null as any);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(options.url) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const res = await fetch(options.url);
          const json = await res.json();
          setResponse(json);
          setLoading(false);
        } catch (error: any) {
          setError(error.message || "useFetch: Something went wrong");
        }
      };
      fetchData();
    }
  }, [options.url]);

  return { response, error, loading };
}