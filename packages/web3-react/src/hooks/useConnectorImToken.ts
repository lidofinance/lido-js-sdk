import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { openWindow } from '@lido-sdk/helpers';
import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { hasInjected } from '../helpers';
import { useWeb3React } from '@web3-react/core';

type Connector = {
  connect: () => void;
  available: boolean;
};

const IM_TOKEN_URL = 'imtokenv2://navigate?screen=DappView&url=';

export const useConnectorImToken = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3React();

  const openInWallet = useCallback(() => {
    try {
      const pageUrl = encodeURIComponent(window.location.href);
      openWindow(`${IM_TOKEN_URL}${pageUrl}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
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
