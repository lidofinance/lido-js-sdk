import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSwr';
import { useSDK } from './useSDK';

export const useTotalSupply = (token: string): SWRResponse<BigNumber> => {
  const { providerRpc, providerWeb3 } = useSDK();

  invariant(token != null, 'Token is required');

  const contractRpc = getERC20Contract(token, providerRpc);
  const contractWeb3 = providerWeb3
    ? getERC20Contract(token, providerWeb3)
    : null;

  const result = useContractSWR({
    contract: contractRpc,
    method: 'totalSupply',
  });

  const updateTotal = result.update;

  const subscribeToUpdates = useCallback(() => {
    if (!providerWeb3 || !contractWeb3) return;

    try {
      const transfer = contractWeb3.filters.Transfer();
      providerWeb3.on(transfer, updateTotal);

      return () => {
        providerWeb3.off(transfer, updateTotal);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to events');
    }
  }, [providerWeb3, contractWeb3, updateTotal]);

  useEffect(subscribeToUpdates, [subscribeToUpdates]);

  return result;
};
