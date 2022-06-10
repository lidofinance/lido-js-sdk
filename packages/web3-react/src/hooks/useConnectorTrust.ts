import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedHookResult } from './types';

const TRUST_URL = 'https://link.trustwallet.com/open_url?url=';

export const useConnectorTrust = (): InjectedHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      const pageUrl = encodeURIComponent(window.location.href);
      openWindow(`${TRUST_URL}${pageUrl}`);
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

  return {
    connect,
    connector: injected,
  };
};
