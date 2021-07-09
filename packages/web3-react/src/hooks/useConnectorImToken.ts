import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isMobileOrTablet } from '../helpers';

type Connector = {
  connect?: () => void;
};

const IM_TOKEN_URL = 'imtokenv2://navigate?screen=DappView&url=';

export const useConnectorImToken = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();

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

  const available = isMobileOrTablet;

  return {
    connect: available ? connect : undefined,
  };
};
