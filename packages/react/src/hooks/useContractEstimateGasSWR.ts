import invariant from 'tiny-invariant';
import { BaseContract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { useLidoSWR, SWRResponse } from './useLidoSWR';
import { FilterAsyncMethods } from './types';
import { SWRConfiguration } from 'swr';

export const useContractEstimateGasSWR = <
  C extends BaseContract,
  M extends FilterAsyncMethods<C['estimateGas']>,
  F extends boolean,
>(props: {
  contract?: C;
  method: M;
  shouldFetch?: F;
  params?: F extends false ? unknown[] : Parameters<C['estimateGas'][M]>;
  config?: SWRConfiguration<BigNumber, Error>;
}): SWRResponse<BigNumber, Error> => {
  const { shouldFetch = true, params = [], contract, method, config } = props;

  invariant(method != null, 'Method is required');

  return useLidoSWR<BigNumber, Error>(
    shouldFetch && contract ? [contract, method, ...params] : null,
    (contract: C, method: string, ...params: unknown[]) => {
      return contract.estimateGas[method](...params);
    },
    config,
  );
};
