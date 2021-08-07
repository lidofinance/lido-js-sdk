import { CHAINS } from '@lido-sdk/constants';
import {
  JsonRpcProvider,
  JsonRpcBatchProvider,
} from '@ethersproject/providers';

const createProviderGetter = <P extends typeof JsonRpcProvider>(
  Provider: P,
) => {
  const cache = new Map<string, InstanceType<P>>();

  return (chainId: CHAINS, url: string, cacheSeed = 0): InstanceType<P> => {
    const cacheKey = `${chainId}-${cacheSeed}-${url}`;
    let library = cache.get(cacheKey);

    if (!library) {
      library = new Provider(url, chainId) as InstanceType<P>;
      cache.set(cacheKey, library);
    }

    return library;
  };
};

export const getRpcProvider = createProviderGetter(JsonRpcProvider);
export const getRpcBatchProvider = createProviderGetter(JsonRpcBatchProvider);
