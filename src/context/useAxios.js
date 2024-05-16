import { useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";

const baseUrl = `${window.location.protocol}//${window.location.hostname}/backend`;

// Mechanism to manage token refresh state and queue requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: authTokens ? `Token ${authTokens.access}` : null,
    },
  });

  axiosInstance.interceptors.request.use(async (request) => {
    const originalRequest = request;

    if (!authTokens) return request;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs().isAfter(dayjs.unix(user.exp));

    if (!isExpired) return request;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = "Token " + token;
          return originalRequest;
        })
        .catch((error) => Promise.reject(error));
    }

    isRefreshing = true;
    originalRequest.headers["Authorization"] = `Token ${authTokens.access}`;

    try {
      const response = await axios.post(`${baseUrl}/token/refresh/`, {
        refresh: authTokens.refresh,
      });
      const newTokens = response.data;
      localStorage.setItem("authTokens", JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      setUser(jwtDecode(newTokens.access));

      processQueue(null, newTokens.access); // Process the queue with the new token
      isRefreshing = false;
      originalRequest.headers["Authorization"] = "Token " + newTokens.access;

      return Promise.resolve(originalRequest);
    } catch (error) {
      processQueue(error, null);
      isRefreshing = false;
      console.error("Failed to refresh token:", error);
      logoutUser();
      toast.warning("Session expired. Please log in again.");
      return Promise.reject(error);
    }
  });

  return axiosInstance;
};

export default useAxios;
