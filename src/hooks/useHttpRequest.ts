import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useState } from "react";

import api from "../services/api";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE";

interface HttpParameters<TData = unknown>
{
  cancellable?: boolean;
  data?: TData;
  method: HttpMethod;
  queryParams?: { [k: string]: boolean | number | string };
  url: string;
}

export const HALT = "HALT";

export function useHttpRequest<TData = unknown>()
{
  const [cancellationToken, setCancellationToken] = useState(Axios.CancelToken.source());

  const [isWorking, setIsWorking] = useState(false);
  const [data, setData] = useState<TData>();
  const [hasThrownError, setHasThrownError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const send = useCallback(async (httpParams: HttpParameters<TData>) =>
  {
    let shouldHalt = false;

    const config: AxiosRequestConfig = {};
    if (httpParams.queryParams != null)
      config.params = { ...httpParams.queryParams };

    if (httpParams.cancellable != null && httpParams.cancellable)
      config.cancelToken = cancellationToken.token;

    (async () =>
    {
      try
      {
        setIsWorking(true);

        let response: AxiosResponse;
        switch (httpParams.method)
        {
          case "GET":
            response = await api.get(httpParams.url, config);

            break;

          case "POST":
            response = await api.post(httpParams.url, httpParams.data ?? {}, config);

            break;

          case "PUT":
            response = await api.put(httpParams.url, httpParams.data ?? {}, config);

            break;

          case "DELETE":
            response = await api.delete(httpParams.url, config);

            break;
        }

        if (response.data != null)
          setData(response.data);
      }
      catch (error)
      {
        let message = "Houve um erro inesperado durante a requisição ao servidor!";
        if (Axios.isCancel(error))
        {
          if (error.message === HALT)
            shouldHalt = true;
          else
            message = error.message;
        }
        else if (error.response)
        {
          message = error.response.data;
        }
        else if (error.request)
        {
          message = "Não houveram respostas do servidor!";
        }

        if (!shouldHalt)
        {
          setHasThrownError(true);
          setErrorMessage(message);
        }
      }
      finally
      {
        if (!shouldHalt)
          setIsWorking(false);
      }
    })();
  }, [cancellationToken]);

  const cancel = useCallback((message?: string) =>
  {
    cancellationToken.cancel(message);
  }, [cancellationToken]);

  const clearState = useCallback(() =>
  {
    if (!isWorking)
    {
      setHasThrownError(false);
      setErrorMessage("");

      setCancellationToken(Axios.CancelToken.source());
    }
    else
    {
      throw new Error(
        "You can't perform this action with an ongoing request! " +
        "Please, cancel all requests using the cancel function before continuing.");
    }
  }, [isWorking, cancel]);

  return (
  {
    isWorking,
    data,
    hasThrownError,
    errorMessage,
    send,
    cancel,
    clearState
  });
}
