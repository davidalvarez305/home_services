import { useCallback, useMemo, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export default function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ message: "" });
  const cancelToken = useMemo(() => axios.CancelToken.source(), []);

  const makeRequest = useCallback(
    async (
      config: AxiosRequestConfig,
      callback: (data: AxiosResponse) => void
    ) => {
      setIsLoading(true);
      setError({ message: "" });

      await axios({
        url: config.url,
        cancelToken: cancelToken.token,
        method: config.method ? config.method : undefined,
        headers: config.headers ? config.headers : undefined,
        responseType: config.responseType ? config.responseType : undefined,
        withCredentials: true,
        data: config.data ? config.data : null,
        validateStatus: function (status) {
          return status < 400;
        },
      })
        .then((response) => {
          setIsLoading(false);
          callback(response);
        })
        .catch((error: AxiosError) => {
          if (error?.response?.data) {
            const serverResponse: any = error?.response?.data;

            // if the server rejects the request, serverResponse.data will be undefined
            if (serverResponse.data) {
              setError({ message: serverResponse.data });
            } else {
              setError({ message: serverResponse });
            }
          } else {
            setError({ message: error.message });
          }
          setIsLoading(false);
        });
    },
    [cancelToken]
  );

  const errorCallback = (callbackMessage: string) => {
    setError({ message: callbackMessage });
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    makeRequest,
    errorCallback,
    cancelToken,
  };
}
