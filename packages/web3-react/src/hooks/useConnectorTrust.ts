import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isIOS, isMobileOrTablet } from '../helpers';

type Connector = {
  connect?: () => void;
};

const TRUST_URL = 'https://link.trustwallet.com/open_url?url=';

export const useConnectorTrust = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();

  const openInWallet = useCallback(() => {
    try {
      const pageUrl = encodeURIComponent(window.location.href);
      openWindow(`${TRUST_URL}${pageUrl}`);
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

  const available = isMobileOrTablet && !isIOS;

  return {
    connect: available ? connect : undefined,
  };
};
