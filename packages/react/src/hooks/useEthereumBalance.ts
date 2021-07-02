import warning from 'tiny-warning';
import { useCallback, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useSDK } from './useSDK';
import { useEthereumSWR } from './useEthereumSWR';
import { SWRResponse } from './useLidoSWR';

export const useEthereumBalance = (
  account?: string,
): SWRResponse<BigNumber> => {
  const { providerWeb3, account: sdkAccount } = useSDK();
  const mergedAccount = account ?? sdkAccount;

  const result = useEthereumSWR({
    shouldFetch: !!mergedAccount,
    method: 'getBalance',
    params: [mergedAccount, 'latest'],
  });

  const updateBalance = result.update;

  const subscribeToUpdates = useCallback(() => {
    if (!mergedAccount || !providerWeb3) return;

    try {
      providerWeb3.on('block', updateBalance);

      return () => {
        providerWeb3.off('block', updateBalance);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to Block event');
    }
  }, [providerWeb3, mergedAccount, updateBalance]);

  useEffect(subscribeToUpdates, [subscribeToUpdates]);

  return result;
};
