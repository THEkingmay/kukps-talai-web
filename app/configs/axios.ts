import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) throw new Error("BASE_URL is not defined");

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default apiClient;
