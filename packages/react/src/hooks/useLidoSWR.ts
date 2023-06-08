import { useCallback } from 'react';
import { default as useSWRSource, SWRConfiguration } from 'swr';
import { Key, Fetcher, MutatorCallback } from 'swr/dist/types';
import { useSDK } from './useSDK';

const LIDO_SWR_DEFAULT_CONFIG = {
  errorRetryInterval: 10_000,
  focusThrottleInterval: 10_000,
};

export type SWRResponse<Data, Error = unknown> = {
  data?: Data;
  error?: Error;
  mutate: (
    data?: Data | Promise<Data> | MutatorCallback<Data>,
    shouldRevalidate?: boolean,
  ) => Promise<Data | undefined>;
  update: () => Promise<Data | undefined>;
  loading: boolean;
  initialLoading: boolean;
};

export const useLidoSWR = <Data = unknown, Error = unknown>(
  key: Key | null,
  fetcher: Fetcher<Data> | null,
  config?: SWRConfiguration<Data, Error>,
): SWRResponse<Data, Error> => {
  const { swrConfig } = useSDK();

  const result = useSWRSource(key, fetcher, {
    ...LIDO_SWR_DEFAULT_CONFIG,
    ...swrConfig,
    ...config,
  });

  const mutate = result.mutate;

  const update = useCallback(() => {
    return mutate(undefined, true);
  }, [mutate]);

  return {
    mutate,
    update,

    /*
     * support dependency collection
     * https://swr.vercel.app/advanced/performance#dependency-collection
     */

    get data() {
      return result.data;
    },
    get loading() {
      return result.isValidating;
    },
    get initialLoading() {
      return result.data == null && result.isValidating;
    },
    get error() {
      return result.error;
    },
  };
};
