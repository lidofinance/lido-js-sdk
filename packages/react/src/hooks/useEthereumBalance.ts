import warning from 'tiny-warning';
import { useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useSDK } from './useSDK';
import { useEthereumSWR } from './useEthereumSWR';
import { SWRResponse } from './useLidoSWR';
import { SWRConfiguration } from 'swr';

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

  useEffect(() => {
    if (!mergedAccount || !providerWeb3) return;

    try {
      providerWeb3.on('block', result.update);

      return () => {
        providerWeb3.off('block', result.update);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to Block event');
    }
  }, [providerWeb3, mergedAccount, result.update]);

  return result;
};
