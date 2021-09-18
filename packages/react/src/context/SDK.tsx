import invariant from 'tiny-invariant';
import { CHAINS } from '@lido-sdk/constants';
import {
  BaseProvider,
  Web3Provider,
  getDefaultProvider,
  getNetwork,
} from '@ethersproject/providers';
import { createContext, memo, useMemo, FC } from 'react';
import { SWRConfiguration } from 'swr';

export interface SDKContextProps {
  chainId: CHAINS;
  supportedChainIds: CHAINS[];
  providerMainnetRpc?: BaseProvider;
  providerRpc?: BaseProvider;
  providerWeb3?: Web3Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
  onError?: (error: unknown) => void;
}

export interface SDKContextValue {
  chainId: CHAINS;
  supportedChainIds: CHAINS[];
  providerMainnetRpc: BaseProvider;
  providerRpc: BaseProvider;
  providerWeb3?: Web3Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
  onError: (error: unknown) => void;
}

export const SDKContext = createContext({} as SDKContextValue);

const ProviderSDK: FC<SDKContextProps> = (props) => {
  const {
    children,
    account,
    chainId,
    supportedChainIds,
    providerWeb3,
    swrConfig,
  } = props;

  invariant(chainId !== null, 'Chain is not supported');
  invariant(supportedChainIds?.length, 'Supported chains are required');

  const providerRpc = useMemo(() => {
    return props.providerRpc ?? getDefaultProvider(getNetwork(chainId));
  }, [props.providerRpc, chainId]);

  const providerMainnetRpc = useMemo(() => {
    return props.providerMainnetRpc ?? getDefaultProvider('mainnet');
  }, [props.providerMainnetRpc]);

  const onError = useMemo(() => {
    return props.onError ?? console.error;
  }, [props.onError]);

  const value = useMemo(
    () => ({
      account,
      chainId,
      supportedChainIds,
      providerMainnetRpc,
      providerRpc,
      providerWeb3,
      swrConfig,
      onError,
    }),
    [
      account,
      chainId,
      supportedChainIds,
      providerMainnetRpc,
      providerRpc,
      providerWeb3,
      swrConfig,
      onError,
    ],
  );

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};

export default memo<FC<SDKContextProps>>(ProviderSDK);
