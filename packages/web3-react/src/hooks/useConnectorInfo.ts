import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { useWeb3 } from './useWeb3';
import { CONNECTOR_NAMES, PROVIDER_NAMES } from '../constants';
import { Connector } from '../context';
import {
  isDappBrowserProvider,
  isImTokenProvider,
  isMetamaskProvider,
  isTrustProvider,
} from '../helpers';

type ConnectorInfo = {
  isDappBrowser: boolean;
  isInjected: boolean;
  isImToken: boolean;
  isTrust: boolean;
  isMetamask: boolean;
  isGnosis: boolean;
  isWalletConnect: boolean;
  isCoinbase: boolean;
  providerName?: string;
  connectorName?: Connector;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { active, connector } = useWeb3();

  const isGnosis = active && connector instanceof SafeAppConnector;
  const isWalletConnect = active && connector instanceof WalletConnectConnector;
  const isCoinbase = active && connector instanceof WalletLinkConnector;

  const isInjected = active && connector instanceof InjectedConnector;
  const isDappBrowser = isInjected && isDappBrowserProvider();
  const isMetamask = isInjected && isMetamaskProvider();
  const isImToken = isInjected && isImTokenProvider();
  const isTrust = isInjected && isTrustProvider();

  const providerName = (() => {
    if (isGnosis) return PROVIDER_NAMES.GNOSIS;
    if (isWalletConnect) return PROVIDER_NAMES.WALLET_CONNECT;
    if (isCoinbase) return PROVIDER_NAMES.COINBASE;

    if (isMetamask) return PROVIDER_NAMES.METAMASK;
    if (isImToken) return PROVIDER_NAMES.IM_TOKEN;
    if (isTrust) return PROVIDER_NAMES.TRUST;

    if (isInjected) return PROVIDER_NAMES.INJECTED;

    return undefined;
  })();

  const connectorName: Connector | undefined = (() => {
    if (isInjected) return CONNECTOR_NAMES.INJECTED;
    if (isWalletConnect) return CONNECTOR_NAMES.WALLET_CONNECT;
    if (isCoinbase) return CONNECTOR_NAMES.COINBASE;
    if (isGnosis) return CONNECTOR_NAMES.GNOSIS;

    return undefined;
  })();

  return {
    providerName,
    connectorName,
    isDappBrowser,
    isInjected,
    isImToken,
    isTrust,
    isMetamask,
    isGnosis,
    isWalletConnect,
    isCoinbase,
  };
};
