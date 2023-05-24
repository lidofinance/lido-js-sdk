import warning from 'tiny-warning';
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useSDK } from './useSDK';
import { useEthereumSWR } from './useEthereumSWR';
import { SWRResponse } from './useLidoSWR';
import { SWRConfiguration } from 'swr';
import { useDebounceCallback } from './useDebounceCallback';

export const useEthereumBalance = (
  account?: string,
  config?: SWRConfiguration<BigNumber, Error>,
): SWRResponse<BigNumber> => {
  const { providerWeb3, account: sdkAccount } = useSDK();
  const mergedAccount = account ?? sdkAccount;

  const result = useEthereumSWR({
    shouldFetch: !!mergedAccount,
    method: 'getBalance',
    params: [mergedAccount, 'latest'],
    config,
  });

  const updateBalanceDebounced = useDebounceCallback(result.update, 1000);

  useEffect(() => {
    if (!mergedAccount || !providerWeb3) return;

    try {
      providerWeb3.on('block', updateBalanceDebounced);

      return () => {
        providerWeb3.off('block', updateBalanceDebounced);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to Block event');
    }
  }, [providerWeb3, mergedAccount, updateBalanceDebounced]);

  return result;
};
