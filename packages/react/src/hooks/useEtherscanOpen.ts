import {
  getEtherscanLink,
  EtherscanEntities,
  openWindow,
} from '@lido-sdk/helpers';
import { useCallback } from 'react';
import { useSDK } from './useSDK';

export const useEtherscanOpen = (
  hash: string,
  entity: EtherscanEntities,
): (() => void) => {
  const { chainId } = useSDK();

  return useCallback(() => {
    const link = getEtherscanLink(chainId, hash, entity);
    openWindow(link);
  }, [chainId, entity, hash]);
};
