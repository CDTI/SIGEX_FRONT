import Axios, { CancelToken } from "axios";

export interface RequestOptions
{
  cancellationToken?: CancelToken;
  withPopulatedRefs?: boolean;
}

export const baseUrl = `${process.env.REACT_APP_BASE_URL}/api`;

export const httpClient = Axios.create({ baseURL: baseUrl });
httpClient.interceptors.request.use(
  (config) =>
  {
    if (config.baseURL != null)
      config.baseURL = config.baseURL.replace(/([^:]\/)\/+/g, "$1");

    return config;
  },

  (error) =>
    Promise.reject(error));
