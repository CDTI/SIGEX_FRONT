import { useCallback, useState } from "react";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { httpClient } from "../services/httpClient";

const HALT = "HALT";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE";

export interface HttpRequestConfiguration
{
  method: HttpMethod;
  url: string;
  body?: any;
  queryParams?: Map<string, string>;
  cancellable?: boolean;
}

export function useHttpClient()
{
  const [cancellationToken, setCancellationToken] = useState(Axios.CancelToken.source());

  const [inProgress, setInProgress] = useState(false);

  const send = useCallback(async <TData = any>(config: HttpRequestConfiguration) =>
  {
    let shouldHalt = false;

    const clientConfig: AxiosRequestConfig = {};
    if (config.cancellable != null && config.cancellable)
      clientConfig.cancelToken = cancellationToken.token;

    if (config.queryParams != null)
      for (const [key, value] of config.queryParams)
        clientConfig.params = { ...clientConfig.params, [key]: value };
    try
    {
      setInProgress(true);

      let response: AxiosResponse;
      switch (config.method)
      {
        case "GET":
          response = await httpClient.get(config.url, clientConfig);
          break;

        case "POST":
          response = await httpClient.post(config.url, config.body ?? {}, clientConfig);
          break;

        case "PUT":
          response = await httpClient.put(config.url, config.body ?? {}, clientConfig);
          break;

        case "DELETE":
          response = await httpClient.delete(config.url, clientConfig);
          break;
      }

      return response.data as TData;
    }
    catch (error)
    {
      let message = "Houve um erro inesperado durante a requisição ao servidor!";
      if (Axios.isCancel(error))
        error.message === HALT
          ? shouldHalt = true
          : message = error.message;
      else
        message = error.response != null
          ? error.response.data
          : error.request != null && "Nenhuma resposta do servidor!";

      if (!shouldHalt)
        throw new Error(message);
    }
    finally
    {
      !shouldHalt && setInProgress(false);
    }
  }, [cancellationToken]);

  const cancel = useCallback((message?: string) =>
  {
    cancellationToken.cancel(message ?? "");

    setCancellationToken(Axios.CancelToken.source());
  }, [cancellationToken]);

  const halt = useCallback(() =>
  {
    cancellationToken.cancel(HALT);
  }, [cancellationToken]);

  return (
  {
    inProgress,
    send,
    cancel,
    halt
  });
}