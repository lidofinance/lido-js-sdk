import { getTokenAddress, TOKENS } from '@lido-sdk/constants';
import { useSDK } from './useSDK';

export const useTokenAddress = (token: TOKENS): string => {
  const { chainId } = useSDK();
  return getTokenAddress(chainId, token);
};
