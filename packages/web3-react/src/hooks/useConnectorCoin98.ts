import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isAndroid, isIOS, isFirefox } from '../helpers';
import { useForceDisconnect } from './useDisconnect';

type Connector = {
  connect: () => Promise<void>;
};

export const useConnectorCoin98 = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      if (isAndroid) {
        openWindow('https://android.coin98.app');
      } else if (isIOS) {
        openWindow('https://ios.coin98.app');
      } else if (isFirefox) {
        openWindow(
          'https://docs.coin98.com/products/coin98-wallet/extension/beginners-guide/install-extension-firefox',
        );
      } else {
        openWindow('https://chrome.coin98.com');
      }
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

  return { connect };
};
