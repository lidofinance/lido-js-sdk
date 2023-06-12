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

export const useTokenBalance = (
  token: string,
  account?: string,
  config?: SWRConfiguration<BigNumber>,
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
    config,
  });

  const updateBalanceDebounced = useDebounceCallback(result.update, 1000);

  useEffect(() => {
    if (!mergedAccount || !providerWeb3 || !contractWeb3) return;

    try {
      const fromMe = contractWeb3.filters.Transfer(mergedAccount, null);
      const toMe = contractWeb3.filters.Transfer(null, mergedAccount);

      providerWeb3.on(fromMe, updateBalanceDebounced);
      providerWeb3.on(toMe, updateBalanceDebounced);

      return () => {
        providerWeb3.off(fromMe, updateBalanceDebounced);
        providerWeb3.off(toMe, updateBalanceDebounced);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to events');
    }
  }, [providerWeb3, contractWeb3, mergedAccount, updateBalanceDebounced]);

  return result;
};
