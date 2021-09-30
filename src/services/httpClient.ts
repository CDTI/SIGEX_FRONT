import Axios, { CancelToken } from "axios";

export interface RequestOptions
{
  cancellationToken?: CancelToken;
  withPopulatedRefs?: boolean;
}

export const baseUrl = `${process.env.REACT_APP_BASE_URL}/api`.replace(/([^:]\/)\/+/g, "$1");

export const httpClient = Axios.create({ baseURL: baseUrl });
