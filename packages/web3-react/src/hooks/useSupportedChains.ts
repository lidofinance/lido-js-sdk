import { useMemo } from 'react';
import { getNetwork, Network } from '@ethersproject/providers';
import { useWeb3, UnsupportedChainIdError } from './useWeb3';

const STABLE_ARRAY: never[] = [];

export const useSupportedChains = (): {
  isUnsupported: boolean;
  supportedChains: Network[];
} => {
  const { error, connector } = useWeb3();
  const supportedIds = connector?.supportedChainIds ?? STABLE_ARRAY;

  const supportedChains = useMemo(() => {
    return supportedIds.map((chainId) => getNetwork(chainId));
  }, [supportedIds]);

  const isUnsupported = error instanceof UnsupportedChainIdError;

  return {
    isUnsupported,
    supportedChains,
  };
};
