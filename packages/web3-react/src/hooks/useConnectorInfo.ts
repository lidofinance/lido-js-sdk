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
import { LedgerHQFrameConnector } from '../connectors';

type ConnectorInfo = {
  isDappBrowser: boolean;
  isInjected: boolean;
  isImToken: boolean;
  isTrust: boolean;
  isMetamask: boolean;
  isGnosis: boolean;
  isLedgerLive: boolean;
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
  const isLedgerLive = active && connector instanceof LedgerHQFrameConnector;

  const isInjected = active && connector instanceof InjectedConnector;
  const isDappBrowser = isInjected && isDappBrowserProvider();
  const isMetamask = isInjected && isMetamaskProvider();
  const isImToken = isInjected && isImTokenProvider();
  const isTrust = isInjected && isTrustProvider();

  const providerName = (() => {
    if (isCoinbase) return PROVIDER_NAMES.COINBASE;
    if (isGnosis) return PROVIDER_NAMES.GNOSIS;
    if (isLedgerLive) return PROVIDER_NAMES.LEDGER_HQ_LIVE;
    if (isWalletConnect) return PROVIDER_NAMES.WALLET_CONNECT;

    if (isImToken) return PROVIDER_NAMES.IM_TOKEN;
    if (isMetamask) return PROVIDER_NAMES.METAMASK;
    if (isTrust) return PROVIDER_NAMES.TRUST;

    if (isInjected) return PROVIDER_NAMES.INJECTED;

    return undefined;
  })();

  const connectorName: Connector | undefined = (() => {
    if (isCoinbase) return CONNECTOR_NAMES.COINBASE;
    if (isGnosis) return CONNECTOR_NAMES.GNOSIS;
    if (isLedgerLive) return CONNECTOR_NAMES.LEDGER_HQ_LIVE;
    if (isWalletConnect) return CONNECTOR_NAMES.WALLET_CONNECT;

    if (isInjected) return CONNECTOR_NAMES.INJECTED;

    return undefined;
  })();

  return {
    connectorName,
    providerName,

    isCoinbase,
    isGnosis,
    isLedgerLive,
    isWalletConnect,

    isImToken,
    isMetamask,
    isTrust,

    isDappBrowser,
    isInjected,
  };
};
