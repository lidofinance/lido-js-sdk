import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSwr';
import { useSDK } from './useSDK';

export const useTokenBalance = (
  token: string,
  account?: string,
): SWRResponse<BigNumber> => {
  const { providerRpc, providerWeb3, account: sdkAccount } = useSDK();
  const mergedAccount = account ?? sdkAccount;

  invariant(token != null, 'Token is required');

  const contractRpc = getERC20Contract(token, providerRpc);
  const contractWeb3 = providerWeb3
    ? getERC20Contract(token, providerWeb3)
    : null;

  const result = useContractSWR({
    shouldFetch: !!mergedAccount,
    contract: contractRpc,
    method: 'balanceOf',
    params: [mergedAccount],
  });

  const updateBalance = result.update;

  const subscribeToUpdates = useCallback(() => {
    if (!mergedAccount || !providerWeb3 || !contractWeb3) return;

    try {
      const fromMe = contractWeb3.filters.Transfer(mergedAccount, null);
      const toMe = contractWeb3.filters.Transfer(null, mergedAccount);

      providerWeb3.on(fromMe, updateBalance);
      providerWeb3.on(toMe, updateBalance);

      return () => {
        providerWeb3.off(fromMe, updateBalance);
        providerWeb3.off(toMe, updateBalance);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to events');
    }
  }, [providerWeb3, contractWeb3, mergedAccount, updateBalance]);

  useEffect(subscribeToUpdates, [subscribeToUpdates]);

  return result;
};
