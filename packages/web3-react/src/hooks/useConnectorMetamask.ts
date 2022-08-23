import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import {
  hasInjected,
  isBraveWalletProvider,
  checkIfBraveBrowser,
} from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedConnector } from '@web3-react/injected-connector';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL = 'https://metamask.app.link/dapp/';

export const useConnectorMetamask = (): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      const { host, pathname, search } = window.location;
      const pageUrlWithoutProtocol = encodeURI(host + pathname + search);
      openWindow(`${WALLET_URL}${pageUrlWithoutProtocol}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    // Brave Wallet mimics MetaMask.
    // If a user has the Brave Browser without the MetaMask extension we want
    // to redirect the user to the MetaMask website.
    // If MetaMask is installed, the isBraveWallet property will be false.
    if ((await checkIfBraveBrowser()) && isBraveWalletProvider()) {
      openInWallet();
      return;
    }

    // Do not check for isMetamaskProvider here,
    // it will break an ability to connect with other EIP-1193 wallets,
    // which do not have their branded connection button
    // and recommend to click on MetaMask button in such case.
    if (hasInjected()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return { connect, connector: injected };
};
