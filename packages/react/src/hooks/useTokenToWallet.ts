import { getERC20Contract } from '@lido-sdk/contracts';
import { useCallback } from 'react';
import { useSDK } from './useSDK';
import { useMountedState } from './useMountedState';

export const useTokenToWallet = (
  address: string,
  image?: string,
): {
  addToken?: () => Promise<boolean>;
  loading: boolean;
} => {
  const [loading, setLoading] = useMountedState(false);
  const { providerRpc, providerWeb3, onError } = useSDK();

  const handleAdd = useCallback(async () => {
    const provider = providerWeb3?.provider;
    if (!provider?.request) return false;

    try {
      setLoading(true);
      const contract = getERC20Contract(address, providerRpc);

      const [symbol, decimals] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ]);

      const result = await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });

      return !!result;
    } catch (error) {
      onError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [address, image, providerWeb3, providerRpc, setLoading, onError]);

  const canAdd = !!providerWeb3?.provider.isMetaMask;
  const addToken = canAdd ? handleAdd : undefined;

  return {
    addToken,
    loading,
  };
};
