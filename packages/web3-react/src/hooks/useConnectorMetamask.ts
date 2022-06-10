import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedHookResult } from './types';

const METAMASK_URL = 'https://metamask.app.link/dapp/';

export const useConnectorMetamask = (): InjectedHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      const { host, pathname, search } = window.location;
      const pageUrlWithoutProtocol = encodeURI(host + pathname + search);
      openWindow(`${METAMASK_URL}${pageUrlWithoutProtocol}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return { connect, connector: injected };
};
