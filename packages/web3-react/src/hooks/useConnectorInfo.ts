import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useWeb3 } from './useWeb3';
import { CONNECTOR_NAMES, PROVIDER_NAMES } from '../constants';
import { Connector } from '../context';
import {
  isDappBrowserProvider,
  isImTokenProvider,
  isMetamaskProvider,
  isCoin98Provider,
  isTrustProvider,
  isMathWalletProvider,
  isCoinbaseProvider,
} from '../helpers';

type ConnectorInfo = {
  isDappBrowser: boolean;
  isInjected: boolean;
  isImToken: boolean;
  isTrust: boolean;
  isMetamask: boolean;
  isCoin98: boolean;
  isGnosis: boolean;
  isLedger: boolean;
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
  const isCoinbase = active && isCoinbaseProvider();
  const isLedgerLive = active && connector instanceof LedgerHQFrameConnector;
  const isLedger = connector instanceof LedgerHQConnector;

  const isInjected = active && connector instanceof InjectedConnector;
  const isDappBrowser = isInjected && isDappBrowserProvider();
  const isMetamask = isInjected && isMetamaskProvider();
  const isCoin98 = isInjected && isCoin98Provider();
  const isMathWallet = isInjected && isMathWalletProvider();
  const isImToken = isInjected && isImTokenProvider();
  const isTrust = isInjected && isTrustProvider();

  const providerName = (() => {
    if (isGnosis) return PROVIDER_NAMES.GNOSIS;
    if (isLedger) return PROVIDER_NAMES.LEDGER;
    if (isLedgerLive) return PROVIDER_NAMES.LEDGER_HQ_LIVE;
    if (isWalletConnect) return PROVIDER_NAMES.WALLET_CONNECT;
    if (isImToken) return PROVIDER_NAMES.IM_TOKEN;
    if (isTrust) return PROVIDER_NAMES.TRUST;

    // Wallets which has conflicts with each other.
    // The order of wallets here must correspond to the order of disabling
    // the wallet connection buttons. Most "aggressive" wallet,
    // which disables other wallets, goes first here.
    if (isCoinbase) return PROVIDER_NAMES.COINBASE;
    if (isMathWallet) return PROVIDER_NAMES.MATH_WALLET;
    if (isCoin98) return PROVIDER_NAMES.COIN98;
    if (isMetamask) return PROVIDER_NAMES.METAMASK;
    if (isInjected) return PROVIDER_NAMES.INJECTED;

    return undefined;
  })();

  const connectorName: Connector | undefined = (() => {
    if (isCoinbase) return CONNECTOR_NAMES.COINBASE;
    if (isGnosis) return CONNECTOR_NAMES.GNOSIS;
    if (isLedger) return CONNECTOR_NAMES.LEDGER;
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
    isLedger,
    isLedgerLive,
    isWalletConnect,

    isImToken,
    isMetamask,
    isCoin98,
    isTrust,

    isDappBrowser,
    isInjected,
  };
};
