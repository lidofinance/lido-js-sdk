import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSWR';
import { useSDK } from './useSDK';
import { SWRConfiguration } from 'swr';
import { useDebounceCallback } from './useDebounceCallback';

export const useTotalSupply = (
  token: string,
  config?: SWRConfiguration<BigNumber>,
): SWRResponse<BigNumber> => {
  const { providerRpc, providerWeb3 } = useSDK();

  invariant(token != null, 'Token is required');

  const contractRpc = getERC20Contract(token, providerRpc);
  const contractWeb3 = providerWeb3
    ? getERC20Contract(token, providerWeb3)
    : null;

  const result = useContractSWR({
    contract: contractRpc,
    method: 'totalSupply',
    config,
  });

  const updateSupplyDebounced = useDebounceCallback(result.update, 1000);

  useEffect(() => {
    if (!providerWeb3 || !contractWeb3) return;
    try {
      const transfer = contractWeb3.filters.Transfer();
      providerWeb3.on(transfer, updateSupplyDebounced);

      return () => {
        providerWeb3.off(transfer, updateSupplyDebounced);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to events');
    }
  }, [providerWeb3, contractWeb3, updateSupplyDebounced]);

  return result;
};
