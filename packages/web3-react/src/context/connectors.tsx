import { createContext, memo, FC, useMemo } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { CHAINS } from '@lido-sdk/constants';
import { useSDK } from '@lido-sdk/react';
import { useAutoConnect } from '../hooks/useAutoConnect';
import { CONNECTOR_NAMES } from '../constants';

export interface ConnectorsContextProps {
  rpc: Record<number, string>;
  appName?: string;
  appLogoUrl?: string;
}

export type ConnectorsContextValue = {
  injected: InjectedConnector;
  walletconnect: WalletConnectConnector;
  coinbase: WalletLinkConnector;
  gnosis?: SafeAppConnector;
};

export type Connector = keyof ConnectorsContextValue;

export const ConnectorsContext = createContext({} as ConnectorsContextValue);

const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
const DEFAULT_LOGO = `${BASE_URL}/apple-touch-icon.png`;
const DEFAULT_NAME = 'Lido';

const ProviderConnectors: FC<ConnectorsContextProps> = (props) => {
  const {
    rpc,
    children,
    appName = DEFAULT_NAME,
    appLogoUrl = DEFAULT_LOGO,
  } = props;

  const { supportedChainIds } = useSDK();

  const connectors = useMemo(
    () => ({
      [CONNECTOR_NAMES.INJECTED]: new InjectedConnector({
        supportedChainIds,
      }),

      [CONNECTOR_NAMES.WALLET_CONNECT]: new WalletConnectConnector({
        supportedChainIds,
        rpc,
      }),

      [CONNECTOR_NAMES.GNOSIS]:
        typeof window === 'undefined'
          ? undefined
          : new SafeAppConnector({
              supportedChainIds,
            }),

      [CONNECTOR_NAMES.COINBASE]: new WalletLinkConnector({
        // only mainnet
        url: rpc[CHAINS.Mainnet],
        supportedChainIds,
        appName,
        appLogoUrl,
      }),
    }),
    [appLogoUrl, appName, rpc, supportedChainIds],
  );

  useAutoConnect(connectors);

  return (
    <ConnectorsContext.Provider value={connectors}>
      {children}
    </ConnectorsContext.Provider>
  );
};

export default memo<FC<ConnectorsContextProps>>(ProviderConnectors);
