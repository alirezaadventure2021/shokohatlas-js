// src/api/axios-client.js
import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}api`;
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional if you're dealing with cookies
});

export default axiosClient;
