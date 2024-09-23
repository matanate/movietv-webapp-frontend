'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';

import type { Genre } from '@/types/genre';
import type { Review } from '@/types/review';
import type { Title } from '@/types/title';
import useAxios from '@/hooks/use-axios';

// Types

export type RecordType = 'title' | 'review' | 'genre';

// Define a mapping of RecordType to the corresponding data type
interface RecordDataMap {
  title: Title;
  review: Review;
  genre: Genre;
}

interface RecordState<T> {
  id: number | null;
  data: T | null;
  loading: boolean;
  error: string | null;
  mounted: boolean;
}

interface RecordAction<T> {
  type: 'SET_ID' | 'SET_DATA' | 'SET_LOADING' | 'SET_ERROR' | 'SET_MOUNTED';
  recordType: RecordType;
  payload?: T | number | string | boolean;
}

interface ContextValue {
  state: RecordStates;
  setData: <T extends RecordType>(recordType: T, data: RecordDataMap[T]) => void;
  setLoading: (recordType: RecordType, loading: boolean) => void;
  setError: (recordType: RecordType, error: string) => void;
  fetchData: (recordType: RecordType) => void;
  setMounted: (recordType: RecordType, mounted: boolean) => void;
  setId: (recordType: RecordType, id: number) => void;
}

// Use the RecordDataMap to define the RecordStates type
type RecordStates = {
  [K in RecordType]: RecordState<RecordDataMap[K]>;
};

interface UseRecordReturnValues<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  fetchData: () => void;
}

// Initial State
const initialState: RecordStates = {
  title: { id: null, data: null, loading: true, error: null, mounted: false },
  review: { id: null, data: null, loading: true, error: null, mounted: false },
  genre: { id: null, data: null, loading: true, error: null, mounted: false },
};

// Reducer
const recordReducer = <T,>(state: RecordStates, action: RecordAction<T>): RecordStates => {
  const { recordType, type, payload } = action;
  const recordState = state[recordType];

  switch (type) {
    case 'SET_ID':
      return { ...state, [recordType]: { ...recordState, id: payload as number } };
    case 'SET_DATA':
      return { ...state, [recordType]: { ...recordState, data: payload as T, loading: false, error: null } };
    case 'SET_LOADING':
      return { ...state, [recordType]: { ...recordState, loading: payload as boolean } };
    case 'SET_ERROR':
      return { ...state, [recordType]: { ...recordState, loading: false, error: payload as string, data: null } };
    case 'SET_MOUNTED':
      return { ...state, [recordType]: { ...recordState, mounted: payload as boolean } };
    default:
      return state;
  }
};

// Context
const RecordContext = createContext<ContextValue | undefined>(undefined);

// Provider
function RecordProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(recordReducer, initialState);
  const api = useAxios();

  // Memoize the apiEndpoints to prevent it from being recreated on every render
  const apiEndpoints: Record<RecordType, string> = {
    title: 'titles/',
    review: 'reviews/',
    genre: 'genres/',
  };

  // Fetch data from API
  const fetchData = async (recordType: RecordType): Promise<void> => {
    setLoading(recordType, true);
    try {
      const response = await api.get(`${apiEndpoints[recordType]}${state[recordType].id?.toString() ?? ''}/`);
      const responseData = (await response.data) as RecordDataMap[typeof recordType];
      setData(recordType, responseData);
    } catch (error) {
      setError(recordType, "Error: Couldn't fetch data");
    }
  };

  // Create effect for each record type
  const useCreateEffect = (recordType: RecordType): void => {
    // Extract dependencies into a variable
    const { id } = state[recordType];

    useEffect(() => {
      if (id) {
        void fetchData(recordType);
      }
    }, [id]);
  };

  useCreateEffect('title');
  useCreateEffect('review');
  useCreateEffect('genre');

  // Dispatch actions
  const setId = (recordType: RecordType, id: number): void => {
    dispatch({ type: 'SET_ID', recordType, payload: id });
  };
  const setData = (recordType: RecordType, data: RecordDataMap[RecordType]): void => {
    dispatch({ type: 'SET_DATA', recordType, payload: data });
  };
  const setLoading = (recordType: RecordType, loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', recordType, payload: loading });
  };
  const setError = (recordType: RecordType, error: string): void => {
    dispatch({ type: 'SET_ERROR', recordType, payload: error });
  };
  const setMounted = (recordType: RecordType, mounted: boolean): void => {
    dispatch({ type: 'SET_MOUNTED', recordType, payload: mounted });
  };

  return (
    <RecordContext.Provider value={{ state, setData, setLoading, setError, fetchData, setMounted, setId }}>
      {children}
    </RecordContext.Provider>
  );
}

// Custom Hooks
const useRecordContext = (): ContextValue => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error('useRecordContext must be used within a RecordProvider');
  }
  return context;
};

const useRecord = <T extends RecordType>(recordType: T, id: number): UseRecordReturnValues<RecordDataMap[T]> => {
  const { state, setData, setLoading, setError, fetchData, setId } = useRecordContext();
  const recordState = state[recordType];

  useEffect(() => {
    if (!recordState.id || recordState.id !== id) {
      setId(recordType, id);
    }
  }, []);

  return {
    data: recordState.data,
    loading: recordState.loading,
    error: recordState.error,
    setData: (data) => {
      setData(recordType, data);
    },
    setLoading: (loading) => {
      setLoading(recordType, loading);
    },
    setError: (error) => {
      setError(recordType, error);
    },
    fetchData: () => {
      fetchData(recordType);
    },
  };
};

export { RecordProvider, useRecordContext, useRecord };
