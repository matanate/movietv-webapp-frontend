'use client';

import { useState } from 'react';

/**
 * A custom hook that allows you to store and retrieve values from local storage.
 *
 * @param key - The key to store the value in local storage.
 * @param initialValue - The initial value to store in local storage.
 * @returns The value stored in local storage and a function to update the value.
 */
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    // Initialize the state
    const isClient = typeof window === 'object';
    try {
      if (!isClient) {
        return initialValue;
      }
      const value = localStorage.getItem(key);
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ? (JSON.parse(value) as T) : initialValue;
    } catch {
      // Return initial value in case of error
      return initialValue;
    }
  });

  const setValue = (value: T | ((prevValue: T) => T)): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      // Determine the value to store
      const valueToStore = value instanceof Function ? (value as (prevValue: T) => T)(state) : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(valueToStore);
    } catch {
      // Handle error case if needed
    }
  };

  return [state, setValue];
};

export default useLocalStorage;
