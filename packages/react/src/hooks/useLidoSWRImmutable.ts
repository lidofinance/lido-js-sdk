import { useLidoSWR } from './useLidoSWR';

export const useLidoSWRImmutable: typeof useLidoSWR = (
  key,
  fetcher,
  config,
) => {
  return useLidoSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...config,
  });
};
