import invariant from 'tiny-invariant';
import { BaseProvider } from '@ethersproject/providers';
import { useLidoSWR, SWRResponse } from './useLidoSWR';
import { FilterAsyncMethods, UnpackedPromise } from './types';
import { SWRConfiguration } from 'swr';
import { useSDK } from './useSDK';

export const useEthereumSWR = <
  P extends BaseProvider,
  M extends FilterAsyncMethods<P>,
  R extends UnpackedPromise<ReturnType<P[M]>>,
  F extends boolean,
>(props: {
  method: M;
  shouldFetch?: F;
  providerRpc?: P;
  params?: F extends false ? unknown[] : Parameters<P[M]>;
  config?: SWRConfiguration<R, Error>;
}): SWRResponse<R, Error> => {
  const { shouldFetch = true, params = [], method, config } = props;
  const providerRpcFromSdk = useSDK().providerRpc as P;
  const providerRpc = props.providerRpc ?? providerRpcFromSdk;

  invariant(providerRpc != null, 'RPC Provider is not provided');
  invariant(method != null, 'Method is required');

  return useLidoSWR<R, Error>(
    shouldFetch ? [providerRpc, method, ...params] : null,
    (providerRpc: P, method: M, ...params: Parameters<P[M]>) => {
      return providerRpc[method](...params);
    },
    config,
  );
};
