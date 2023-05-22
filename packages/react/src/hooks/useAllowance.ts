import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSWR';
import { useSDK } from './useSDK';

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

  useEffect(() => {
    if (!mergedOwner || !providerWeb3 || !contractWeb3) return;
    const updatedAllowance = result.update;
    try {
      const transfer = contractWeb3.filters.Transfer(mergedOwner, spender);
      const approve = contractWeb3.filters.Approval(mergedOwner, spender);

      providerWeb3.on(transfer, updatedAllowance);
      providerWeb3.on(approve, updatedAllowance);

      return () => {
        providerWeb3.off(transfer, updatedAllowance);
        providerWeb3.off(approve, updatedAllowance);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to event');
    }
  }, [contractWeb3, mergedOwner, providerWeb3, result.update, spender]);

  return result;
};
