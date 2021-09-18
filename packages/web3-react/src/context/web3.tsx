import invariant from 'tiny-invariant';
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers';
import { CHAINS } from '@lido-sdk/constants';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { ProviderSDK as ProviderSDKBase } from '@lido-sdk/react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { memo, FC } from 'react';
import { SWRConfiguration } from 'swr';
import { POLLING_INTERVAL } from '../constants';
import ProviderConnectors, { ConnectorsContextProps } from './connectors';

export interface ProviderWeb3Props extends ConnectorsContextProps {
  defaultChainId: CHAINS;
  supportedChainIds: CHAINS[];
  swrConfig?: SWRConfiguration;
  onError?: (error: unknown) => void;
}

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

const ProviderSDK: FC<ProviderWeb3Props> = (props) => {
  const { rpc, defaultChainId, supportedChainIds, children, ...rest } = props;
  const { chainId = defaultChainId, library, account } = useWeb3React();

  invariant(rpc[chainId], `RPC url for chain ${chainId} is not provided`);
  invariant(rpc[CHAINS.Mainnet], 'RPC url for mainnet is not provided');

  const providerRpc = getStaticRpcBatchProvider(chainId, rpc[chainId]);
  const providerMainnetRpc = getStaticRpcBatchProvider(
    CHAINS.Mainnet,
    rpc[CHAINS.Mainnet],
  );

  return (
    <ProviderSDKBase
      chainId={chainId}
      supportedChainIds={supportedChainIds}
      providerWeb3={library}
      providerRpc={providerRpc}
      providerMainnetRpc={providerMainnetRpc}
      account={account ?? undefined}
      {...rest}
    >
      {children}
    </ProviderSDKBase>
  );
};

const ProviderWeb3: FC<ProviderWeb3Props> = (props) => {
  const { children, rpc, appName, appLogoUrl, ...sdkProps } = props;
  const { defaultChainId } = props;
  const connectorsProps = { rpc, appName, appLogoUrl, defaultChainId };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ProviderSDK rpc={rpc} {...sdkProps}>
        <ProviderConnectors {...connectorsProps}>{children}</ProviderConnectors>
      </ProviderSDK>
    </Web3ReactProvider>
  );
};

export default memo<FC<ProviderWeb3Props>>(ProviderWeb3);
