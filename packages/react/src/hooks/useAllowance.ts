import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSWR';
import { useSDK } from './useSDK';
import { useDebounceCallback } from './useDebounceCallback';

export const useAllowance = (
  token: string,
  spender: string,
  owner?: string,
): SWRResponse<BigNumber> => {
  const { providerRpc, providerWeb3, account } = useSDK();
  const mergedOwner = owner ?? account;

  invariant(token != null, 'Token is required');
  invariant(spender != null, 'Spender is required');

  const contractRpc = getERC20Contract(token, providerRpc);
  const contractWeb3 = providerWeb3
    ? getERC20Contract(token, providerWeb3)
    : null;

  const result = useContractSWR({
    shouldFetch: !!mergedOwner,
    contract: contractRpc,
    method: 'allowance',
    params: [mergedOwner, spender],
  });

  const updateAllowance = useDebounceCallback(result.update);

  const subscribeToUpdates = useCallback(() => {
    if (!mergedOwner || !providerWeb3 || !contractWeb3) return;

    try {
      const transfer = contractWeb3.filters.Transfer(mergedOwner, spender);
      const approve = contractWeb3.filters.Approval(mergedOwner, spender);

      providerWeb3.on(transfer, updateAllowance);
      providerWeb3.on(approve, updateAllowance);

      return () => {
        providerWeb3.off(transfer, updateAllowance);
        providerWeb3.off(approve, updateAllowance);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to event');
    }
  }, [providerWeb3, contractWeb3, mergedOwner, spender, updateAllowance]);

  useEffect(subscribeToUpdates, [subscribeToUpdates]);

  return result;
};
