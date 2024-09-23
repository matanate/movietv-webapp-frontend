'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import _ from 'lodash';

import type { Genre } from '@/types/genre';
import type { Review } from '@/types/review';
import type { Title } from '@/types/title';
import objectToUrlParams from '@/lib/object-to-url-params';
import useAxios from '@/hooks/use-axios';

// Types
export type RecordType = 'title' | 'review' | 'genre';
export type RecordVariant = 'all' | 'title' | 'movie' | 'tv' | 'search' | 'searchBar';

// Define the API response interface
interface ApiResponse<T> {
  results: T;
  count: number;
}

// Define a mapping of RecordType to the corresponding data type
export interface RecordsDataMap {
  title: Title[];
  review: Review[];
  genre: Genre[];
}

export interface TitleFilters {
  search?: string;
  genres?: number[];
  yearRange?: [number, number];
  ratingRange?: [number, number];
}
export interface ReviewsFilters {
  title?: number;
}
export interface GenresFilters {
  ids?: number[];
}

export interface FiltersDataMap {
  title: TitleFilters;
  review: ReviewsFilters;
  genre: GenresFilters;
}

export interface RecordsState<T extends RecordType> {
  data: RecordsDataMap[T] | null;
  filters: FiltersDataMap[T];
  page?: number;
  pageSize: number | 'all';
  count: number;
  orderBy: string;
  isAscending: boolean;
  movieOrTv?: 'movie' | 'tv' | 'all';
  loading: boolean;
  error: string | null;
  mounted: boolean;
}

interface ContextValue {
  state: RecordsStates;
  setData: <T extends RecordType>(recordType: T, recordVariant: RecordVariant, data: RecordsDataMap[T]) => void;
  setLoading: (recordType: RecordType, recordVariant: RecordVariant, loading: boolean) => void;
  setError: (recordType: RecordType, recordVariant: RecordVariant, error: string | null) => void;
  setFilters: <T extends RecordType>(recordType: T, recordVariant: RecordVariant, filters: FiltersDataMap[T]) => void;
  setPage: (recordType: RecordType, recordVariant: RecordVariant, page: number) => void;
  setPageSize: (recordType: RecordType, recordVariant: RecordVariant, pageSize: number | 'all') => void;
  setOrderBy: (recordType: RecordType, recordVariant: RecordVariant, orderBy: string) => void;
  setIsAscending: (recordType: RecordType, recordVariant: RecordVariant, isAscending: boolean) => void;
  setMovieOrTv: (recordType: RecordType, recordVariant: RecordVariant, movieOrTv: 'movie' | 'tv' | 'all') => void;
  setCount: (recordType: RecordType, recordVariant: RecordVariant, count: number) => void;
  fetchData: (recordType: RecordType, recordVariant: RecordVariant) => void;
  setMounted: (recordType: RecordType, recordVariant: RecordVariant, mounted: boolean) => void;
}

interface RecordsAction<T> {
  type:
    | 'SET_DATA'
    | 'SET_LOADING'
    | 'SET_ERROR'
    | 'SET_FILTERS'
    | 'SET_PAGE'
    | 'SET_PAGE_SIZE'
    | 'SET_ORDER_BY'
    | 'SET_IS_ASCENDING'
    | 'SET_MOVIE_OR_TV'
    | 'SET_COUNT'
    | 'SET_MOUNTED';
  recordType: RecordType;
  recordVariant: RecordVariant;
  payload?: T | number | string | boolean | null;
}

export interface RecordsStates {
  'title-all': RecordsState<'title'>;
  'review-all': RecordsState<'review'>;
  'genre-all': RecordsState<'genre'>;
  'title-movie': RecordsState<'title'>;
  'title-tv': RecordsState<'title'>;
  'review-title': RecordsState<'review'>;
  'genre-title': RecordsState<'genre'>;
  'title-search': RecordsState<'title'>;
  'title-searchBar': RecordsState<'title'>;
}

interface UseRecordsReturn<T extends RecordType> {
  setFilters: (filters: FiltersDataMap[T]) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number | 'all') => void;
  setOrderBy: (orderBy: string) => void;
  setIsAscending: (isAscending: boolean) => void;
  setMovieOrTv: (movieOrTv: 'movie' | 'tv' | 'all') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void; // Updated to accept null
  fetchData: () => void;
}

type UseRecordsReturnValues<T extends RecordType> = UseRecordsReturn<T> & RecordsState<T>;

// Initial State
const initialState: RecordsStates = {
  'title-all': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'bestMatch',
    isAscending: false,
    movieOrTv: 'all',
    loading: true,
    error: null,
    mounted: false,
  },
  'review-all': {
    data: null,
    filters: {},
    pageSize: 'all',
    count: 0,
    orderBy: 'datePosted',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
  'genre-all': {
    data: null,
    filters: {},
    pageSize: 'all',
    count: 0,
    orderBy: 'id',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
  'title-movie': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'rating',
    isAscending: false,
    movieOrTv: 'movie',
    loading: true,
    error: null,
    mounted: false,
  },
  'title-tv': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'rating',
    isAscending: false,
    movieOrTv: 'tv',
    loading: true,
    error: null,
    mounted: false,
  },
  'review-title': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'datePosted',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
  'genre-title': {
    data: null,
    filters: {},
    pageSize: 'all',
    count: 0,
    orderBy: 'id',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
  'title-search': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'bestMatch',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
  'title-searchBar': {
    data: null,
    filters: {},
    page: 1,
    pageSize: 10,
    count: 0,
    orderBy: 'bestMatch',
    isAscending: false,
    loading: true,
    error: null,
    mounted: false,
  },
};

// Context
const RecordsContext = createContext<ContextValue | undefined>(undefined);

// Reducer
const recordsReducer = <T,>(state: RecordsStates, action: RecordsAction<T>): RecordsStates => {
  const { recordType, recordVariant, type, payload } = action;
  const recordKey = `${recordType}-${recordVariant}` as keyof RecordsStates;
  const recordsState = state[recordKey];

  switch (type) {
    case 'SET_DATA':
      return {
        ...state,
        [recordKey]: { ...recordsState, data: payload as RecordsDataMap[typeof recordType], loading: false },
      };
    case 'SET_LOADING':
      return { ...state, [recordKey]: { ...recordsState, loading: payload as boolean } };
    case 'SET_ERROR':
      return { ...state, [recordKey]: { ...recordsState, error: payload as string | null, loading: false } };
    case 'SET_FILTERS':
      return {
        ...state,
        [recordKey]: { ...recordsState, filters: payload as FiltersDataMap[typeof recordType], page: 1 },
      };
    case 'SET_PAGE':
      return { ...state, [recordKey]: { ...recordsState, page: payload as number } };
    case 'SET_PAGE_SIZE':
      return { ...state, [recordKey]: { ...recordsState, pageSize: payload as number | 'all', page: 1 } };
    case 'SET_ORDER_BY':
      return { ...state, [recordKey]: { ...recordsState, orderBy: payload as string, page: 1 } };
    case 'SET_IS_ASCENDING':
      return { ...state, [recordKey]: { ...recordsState, isAscending: payload as boolean, page: 1 } };
    case 'SET_MOVIE_OR_TV':
      return { ...state, [recordKey]: { ...recordsState, movieOrTv: payload as 'movie' | 'tv' | 'all', page: 1 } };
    case 'SET_COUNT':
      return { ...state, [recordKey]: { ...recordsState, count: payload as number } };
    case 'SET_MOUNTED':
      return { ...state, [recordKey]: { ...recordsState, mounted: payload as boolean } };
    default:
      return state;
  }
};

/**
 * Provider component for the records context.
 *
 * @param children - The children to render
 * @returns - The records provider component
 */
function RecordsProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(recordsReducer, initialState);
  const api = useAxios();

  // Memoize the apiEndpoints to prevent it from being recreated on every render
  const apiEndpoints: Record<RecordType, string> = useMemo(
    () => ({
      title: 'titles/',
      review: 'reviews/',
      genre: 'genres/',
    }),
    []
  );

  /**
   * Fetches data for a given record type and variant.
   *
   * @param recordType - The type of record to fetch
   * @param recordVariant - The variant of the record to fetch
   * @returns Promise - A promise that resolves when the data is fetched
   * @throws Error - An error if the data couldn't be fetched
   */
  const fetchData = async (recordType: RecordType, recordVariant: RecordVariant): Promise<void> => {
    const recordKey = `${recordType}-${recordVariant}` as keyof RecordsStates;
    const recordsState = state[recordKey];
    setLoading(recordType, recordVariant, true);
    const paramsObject = {
      ...(recordsState.page && {
        page: recordsState.page,
      }),
      pageSize: recordsState.pageSize,
      orderBy: (recordsState.isAscending ? '' : '-') + (recordsState.orderBy || ''),
      ...(recordsState.movieOrTv && {
        movieOrTv: recordsState.movieOrTv,
      }),
      ...recordsState.filters,
    };
    try {
      const queryParams = objectToUrlParams(paramsObject);

      // Assuming RecordsDataMap[typeof recordType] is the correct type for results
      const response = await api.get<ApiResponse<RecordsDataMap[typeof recordType]>>(
        `${apiEndpoints[recordType]}?${queryParams.toString()}`
      );

      const results = response.data.results ?? [];
      const count = response.data.count ?? 0;

      setData(recordType, recordVariant, results);
      setCount(recordType, recordVariant, count);
    } catch (error) {
      setError(recordType, recordVariant, "Error: Couldn't fetch data");
    }
  };

  // Create effect for each record type and variant
  const useCreateEffect = (recordType: RecordType, recordVariant: RecordVariant): void => {
    const recordKey = `${recordType}-${recordVariant}` as keyof RecordsStates;
    const recordState = state[recordKey];

    useEffect(() => {
      const { mounted } = state[recordKey];
      if (mounted) {
        void fetchData(recordType, recordVariant);
      }
    }, [
      recordState.mounted,
      recordState.page,
      recordState.pageSize,
      recordState.orderBy,
      recordState.isAscending,
      recordState.movieOrTv,
      recordState.filters,
    ]);
  };

  // Create effects for each record type and variant
  useCreateEffect('title', 'all');
  useCreateEffect('review', 'all');
  useCreateEffect('genre', 'all');
  useCreateEffect('title', 'movie');
  useCreateEffect('title', 'tv');
  useCreateEffect('review', 'title');
  useCreateEffect('genre', 'title');
  useCreateEffect('title', 'search');
  useCreateEffect('title', 'searchBar');

  // Dispatch actions
  const setData = <T extends RecordType>(
    recordType: T,
    recordVariant: RecordVariant,
    data: RecordsDataMap[T]
  ): void => {
    dispatch({ type: 'SET_DATA', recordType, recordVariant, payload: data });
  };
  const setLoading = (recordType: RecordType, recordVariant: RecordVariant, loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', recordType, recordVariant, payload: loading });
  };
  const setError = (recordType: RecordType, recordVariant: RecordVariant, error: string | null): void => {
    dispatch({ type: 'SET_ERROR', recordType, recordVariant, payload: error });
  };
  const setFilters = <T extends RecordType>(
    recordType: T,
    recordVariant: RecordVariant,
    filters: FiltersDataMap[T]
  ): void => {
    dispatch({ type: 'SET_FILTERS', recordType, recordVariant, payload: filters });
  };
  const setPage = (recordType: RecordType, recordVariant: RecordVariant, page: number): void => {
    dispatch({ type: 'SET_PAGE', recordType, recordVariant, payload: page });
  };
  const setPageSize = (recordType: RecordType, recordVariant: RecordVariant, pageSize: number | 'all'): void => {
    dispatch({ type: 'SET_PAGE_SIZE', recordType, recordVariant, payload: pageSize });
  };
  const setOrderBy = (recordType: RecordType, recordVariant: RecordVariant, orderBy: string): void => {
    dispatch({ type: 'SET_ORDER_BY', recordType, recordVariant, payload: orderBy });
  };
  const setIsAscending = (recordType: RecordType, recordVariant: RecordVariant, isAscending: boolean): void => {
    dispatch({ type: 'SET_IS_ASCENDING', recordType, recordVariant, payload: isAscending });
  };
  const setMovieOrTv = (
    recordType: RecordType,
    recordVariant: RecordVariant,
    movieOrTv: 'movie' | 'tv' | 'all'
  ): void => {
    dispatch({ type: 'SET_MOVIE_OR_TV', recordType, recordVariant, payload: movieOrTv });
  };
  const setCount = (recordType: RecordType, recordVariant: RecordVariant, count: number): void => {
    dispatch({ type: 'SET_COUNT', recordType, recordVariant, payload: count });
  };
  const setMounted = (recordType: RecordType, recordVariant: RecordVariant, mounted: boolean): void => {
    dispatch({ type: 'SET_MOUNTED', recordType, recordVariant, payload: mounted });
  };

  return (
    <RecordsContext.Provider
      value={{
        state,
        setData,
        setLoading,
        setError,
        setFilters,
        setPage,
        setPageSize,
        setOrderBy,
        setIsAscending,
        setMovieOrTv,
        setCount,
        fetchData,
        setMounted,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
}

// Custom Hook
const useRecordsContext = (): ContextValue => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecordsContext must be used within a RecordsProvider');
  }
  return context;
};

// Custom Hook
export const useRecords = <T extends RecordType>(
  recordType: T,
  recordVariant: RecordVariant,
  initialFilters: FiltersDataMap[T] = {}
): UseRecordsReturnValues<T> => {
  const {
    state,
    setLoading,
    setError,
    setFilters,
    setPage,
    setPageSize,
    setOrderBy,
    setIsAscending,
    setMovieOrTv,
    fetchData,
    setMounted,
  } = useRecordsContext();

  // Get records state
  const recordsState = state[`${recordType}-${recordVariant}` as keyof RecordsStates] as RecordsState<T>;

  // Set initial filters
  useEffect(() => {
    if (!_.isEqual(initialFilters, {})) {
      setFilters(recordType, recordVariant, initialFilters);
    }
  }, []);

  // Set mounted
  useEffect(() => {
    if (_.isEqual(initialFilters, recordsState.filters)) {
      setMounted(recordType, recordVariant, true);
    }
  }, [recordsState.filters]);

  return {
    ...recordsState,
    setFilters: (filters) => {
      setFilters(recordType, recordVariant, filters);
    },
    setPage: (page) => {
      setPage(recordType, recordVariant, page);
    },
    setPageSize: (pageSize) => {
      setPageSize(recordType, recordVariant, pageSize);
    },
    setOrderBy: (orderBy) => {
      setOrderBy(recordType, recordVariant, orderBy);
    },
    setIsAscending: (isAscending) => {
      setIsAscending(recordType, recordVariant, isAscending);
    },
    setMovieOrTv: (movieOrTv) => {
      setMovieOrTv(recordType, recordVariant, movieOrTv);
    },
    setLoading: (loading) => {
      setLoading(recordType, recordVariant, loading);
    },
    setError: (error) => {
      setError(recordType, recordVariant, error);
    },
    fetchData: () => {
      fetchData(recordType, recordVariant);
    },
  };
};

export { RecordsProvider, useRecordsContext };
