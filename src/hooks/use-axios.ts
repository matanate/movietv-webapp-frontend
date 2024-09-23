'use client';

import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import dayjs, { unix } from 'dayjs';
import { jwtDecode } from 'jwt-decode';

import { getApiURL } from '@/lib/get-api-url';
import { useAlert } from '@/contexts/alert-context';

import useLocalStorage from './use-local-storage';

let isRefreshing = false;
let failedQueue: { resolve: (value?: string | null) => void; reject: (reason?: unknown) => void }[] = [];

/**
 * Process the failed queue by either resolving or rejecting the promises.
 * @param error - The error object to reject the promises with.
 * @param token - The new token to resolve the promises with.
 */
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Custom hook that returns an Axios instance with token refresh functionality.
 * @returns The Axios instance.
 */
const useAxios = (): AxiosInstance => {
  const [_authTokens, setAuthTokens] = useLocalStorage<{ access: string; refresh: string } | null>('authTokens', null);
  const { showAlert } = useAlert();
  const apiURL = getApiURL();

  const axiosInstance = axios.create({
    baseURL: apiURL,
  });

  // Intercept the request before it is sent
  axiosInstance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      // Get the auth tokens from local storage
      const storedAuthTokens = localStorage.getItem('authTokens');
      const authTokens = storedAuthTokens
        ? (JSON.parse(storedAuthTokens) as { access: string; refresh: string })
        : null;

      // If there are no auth tokens, set the Authorization header to null
      if (!authTokens) {
        request.headers['Authorization'] = null;
        return request;
      }

      // Check if the access token is expired
      const { exp } = jwtDecode<{ exp: number }>(authTokens.access);
      const isTokenExpired = dayjs().isAfter(unix(exp));

      // If the access token is not expired, set the Authorization header to the access token
      if (!isTokenExpired) {
        request.headers['Authorization'] = `Bearer ${authTokens.access}`;
        return request;
      }

      // If the access token is expired and a token refresh is already in progress, add the request to the failed queue
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({
            resolve: (value?: string | null) => {
              // Ensure the value is `string | null`, and handle it appropriately
              if (value !== undefined) {
                resolve(value);
              }
            },
            reject,
          });
        })
          .then((token) => {
            if (token) {
              request.headers['Authorization'] = `Bearer ${token}`;
            }
            return request;
          })
          .catch((error: unknown) => {
            // Optionally, handle or log the error before rejecting
            if (error instanceof Error) {
              // Reject with the error directly
              return Promise.reject(error);
            }
            // Reject with a new Error if the error is not an instance of Error
            return Promise.reject(new Error('An unknown error occurred'));
          });
      }

      // Set the isRefreshing flag to true to prevent multiple token refresh requests
      isRefreshing = true;

      try {
        // Send a token refresh request to the server
        const response: AxiosResponse<{ access: string; refresh: string }> = await axios.post(
          `${apiURL}token/refresh/`,
          { refresh: authTokens.refresh }
        );
        const newTokens = response.data;
        setAuthTokens(newTokens);
        processQueue(null, newTokens.access);
        request.headers['Authorization'] = `Bearer ${newTokens.access}`;
        isRefreshing = false;

        return request;
      } catch (error) {
        // If the token refresh request fails, clear the auth tokens, show an error message, and reject the request
        processQueue(error, null);
        isRefreshing = false;
        setAuthTokens(null);
        showAlert({ severity: 'warning', message: 'Session expired. You were logged out.' });
        return Promise.reject(error instanceof Error ? error : new Error('Token refresh failed'));
      }
    },
    (error: unknown) => Promise.reject(error instanceof Error ? error : new Error('Request failed'))
  );

  return axiosInstance;
};

export default useAxios;
