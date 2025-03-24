import { CHAINS } from '@lido-sdk/constants';
import {
  JsonRpcProvider,
  JsonRpcBatchProvider,
  StaticJsonRpcProvider,
} from '@ethersproject/providers';
import { StaticJsonRpcBatchProvider } from './staticJsonRpcBatchProvider';

// function factory for creating a provider getter
const createProviderGetter = <P extends typeof JsonRpcProvider>(
  Provider: P,
) => {
  const cache = new Map<string, InstanceType<P>>();

  return (
    chainId: CHAINS,
    url: string,
    cacheSeed = 0,
    pollingInterval: number | null = null,
  ): InstanceType<P> => {
    const cacheKey = `${chainId}-${cacheSeed}-${url}`;
    let provider = cache.get(cacheKey);

    if (!provider) {
      provider = new Provider(url, chainId) as InstanceType<P>;
      cache.set(cacheKey, provider);
    }

    if (pollingInterval) {
      provider.pollingInterval = pollingInterval;
    }

    return provider;
  };
};

export const getRpcProvider = createProviderGetter(JsonRpcProvider);
export const getRpcBatchProvider = createProviderGetter(JsonRpcBatchProvider);

export const getStaticRpcProvider = createProviderGetter(StaticJsonRpcProvider);
export const getStaticRpcBatchProvider = createProviderGetter(
  StaticJsonRpcBatchProvider,
);
