import invariant from 'tiny-invariant';
import { CHAINS } from '@lido-sdk/constants';
import {
  BaseProvider,
  Web3Provider,
  getDefaultProvider,
} from '@ethersproject/providers';
import { createContext, memo, useMemo, FC } from 'react';
import { SWRConfiguration } from 'swr';

export interface SDKContextProps {
  chainId: CHAINS;
  supportedChainIds: CHAINS[];
  providerRpc?: BaseProvider;
  providerWeb3?: Web3Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
}

export interface SDKContextValue {
  chainId: CHAINS;
  supportedChainIds: CHAINS[];
  providerRpc: BaseProvider;
  providerWeb3?: Web3Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
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
    return props.providerRpc ?? getDefaultProvider();
  }, [props.providerRpc]);

  const value = useMemo(
    () => ({
      account,
      chainId,
      supportedChainIds,
      providerRpc,
      providerWeb3,
      swrConfig,
    }),
    [account, chainId, supportedChainIds, providerRpc, providerWeb3, swrConfig],
  );

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};

export default memo<FC<SDKContextProps>>(ProviderSDK);
