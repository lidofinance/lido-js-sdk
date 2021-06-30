import invariant from 'tiny-invariant';
import { CHAINS } from '@lido-sdk/constants';
import {
  Provider,
  BaseProvider,
  getDefaultProvider,
} from '@ethersproject/providers';
import { createContext, memo, useMemo, FC } from 'react';
import { SWRConfiguration } from 'swr';

export interface SDKContextProps {
  chainId: CHAINS;
  supportedChainsIds: CHAINS[];
  providerRpc?: BaseProvider;
  providerWeb3?: Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
}

export interface SDKContextValue {
  chainId: CHAINS;
  supportedChainsIds: CHAINS[];
  providerRpc: BaseProvider;
  providerWeb3?: Provider;
  swrConfig?: SWRConfiguration;
  account?: string;
}

export const SDKContext = createContext({} as SDKContextValue);

const ProviderSDK: FC<SDKContextProps> = (props) => {
  const {
    children,
    account,
    chainId,
    supportedChainsIds,
    providerWeb3,
    swrConfig,
  } = props;

  invariant(chainId !== null, 'Chain is not supported');
  invariant(supportedChainsIds.length > 0, 'Supported chains are required');

  const providerRpc = useMemo(() => {
    return props.providerRpc ?? getDefaultProvider();
  }, [props.providerRpc]);

  const value = useMemo(
    () => ({
      account,
      chainId,
      supportedChainsIds,
      providerRpc,
      providerWeb3,
      swrConfig,
    }),
    [
      account,
      chainId,
      supportedChainsIds,
      providerRpc,
      providerWeb3,
      swrConfig,
    ],
  );

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};

export default memo<FC<SDKContextProps>>(ProviderSDK);
