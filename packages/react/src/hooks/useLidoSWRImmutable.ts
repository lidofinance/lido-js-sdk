import { useLidoSWR } from './useLidoSWR';

const ONE_DAY = 86_400_000;

export const useLidoSWRImmutable: typeof useLidoSWR = (
  key,
  fetcher,
  config,
) => {
  return useLidoSWR(key, fetcher, {
    dedupingInterval: ONE_DAY,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...config,
  });
};
