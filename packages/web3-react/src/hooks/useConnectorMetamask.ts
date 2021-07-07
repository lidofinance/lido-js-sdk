import invariant from 'tiny-invariant';
import { openWindow } from '@lido-sdk/helpers';
import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { hasInjected } from '../helpers';
import { useWeb3React } from '@web3-react/core';

type Connector = {
  connect: () => void;
  available: boolean;
};

const METAMASK_URL = 'https://metamask.app.link/dapp/';

export const useConnectorMetamask = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3React();

  const openInWallet = useCallback(() => {
    if (typeof window === 'undefined') return;

    const { host, pathname, search } = window.location;
    const pageUrlWithoutProtocol = encodeURIComponent(host + pathname + search);
    openWindow(`${METAMASK_URL}${pageUrlWithoutProtocol}`);
  }, []);

  const connect = useCallback(() => {
    invariant(injected, 'Connector is required');

    if (hasInjected()) {
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, openInWallet, injected]);

  return { connect, available: true };
};
