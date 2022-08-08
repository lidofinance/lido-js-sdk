import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isOperaWalletProvider } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedConnector } from '@web3-react/injected-connector';

type Connector = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const OPERA_URL = 'https://www.opera.com/crypto/next';

export const useConnectorOperaWallet = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const suggestApp = useCallback(() => {
    try {
      openWindow(OPERA_URL);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isOperaWalletProvider()) {
      await disconnect();
      activate(injected);
    } else {
      suggestApp();
    }
  }, [activate, disconnect, suggestApp, injected]);

  return { connect, connector: injected };
};
