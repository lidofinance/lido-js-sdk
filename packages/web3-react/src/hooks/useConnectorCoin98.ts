import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import {
  hasInjected,
  isAndroid,
  isIOS,
  isFirefox,
  isCoin98Provider,
} from '../helpers';
import { useForceDisconnect } from './useDisconnect';

type Connector = {
  connect: () => Promise<void>;
};

const androidAppLink = 'https://android.coin98.app';
const iosAppLink = 'https://ios.coin98.app';
const chromeAppLink = 'https://chrome.coin98.com';
const installExtensionFirefoxDocs =
  'https://docs.coin98.com/products/coin98-wallet/extension/beginners-guide/install-extension-firefox';

export const useConnectorCoin98 = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    if (isAndroid) {
      openWindow(androidAppLink);
    } else if (isIOS) {
      openWindow(iosAppLink);
    } else if (isFirefox) {
      openWindow(installExtensionFirefoxDocs);
    } else {
      openWindow(chromeAppLink);
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isCoin98Provider()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return { connect };
};
