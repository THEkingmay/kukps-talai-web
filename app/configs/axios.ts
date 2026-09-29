import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) throw new Error("BASE_URL is not defined");

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default apiClient;

const MOBILE_TOKEN = import.meta.env.VITE_MOBILE_ACCESS_TOKEN as
  string | undefined;

export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    ...(MOBILE_TOKEN ? { "x-mobile-token": MOBILE_TOKEN } : {}),
  },
});
