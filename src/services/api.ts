import Axios, { CancelToken } from "axios";

export const baseUrl = `${process.env.REACT_APP_BASE_URL}/api`;

export interface RequestOptions
{
  cancellationToken?: CancelToken;
  withPopulatedRefs?: boolean;
}

const axiosInstance = Axios.create({ baseURL: baseUrl });
axiosInstance.interceptors.request.use(
  (config) =>
  {
    if (config.baseURL !== undefined)
      config.baseURL = config.baseURL.replace(/([^:]\/)\/+/g, "$1");

    return config;
  },
  (error) => Promise.reject(error));


export default axiosInstance;