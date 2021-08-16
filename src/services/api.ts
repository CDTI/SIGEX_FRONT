import axios from "axios";

export const base_url = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({ baseURL: `${base_url}/api` });
axiosInstance.interceptors.request.use(
  (config) =>
  {
    if (config.baseURL !== undefined)
      config.baseURL = config.baseURL.replace(/([^:]\/)\/+/g, "$1");

    return config;
  },
  (error) => Promise.reject(error));


export default axiosInstance;