import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import {
  hasInjected,
  isAndroid,
  isIOS,
  isEdge,
  isFirefox,
  isMathWalletProvider,
} from '../helpers';
import { useForceDisconnect } from './useDisconnect';

type Connector = {
  connect: () => Promise<void>;
};

const androidAppLink =
  'https://play.google.com/store/apps/details?id=com.medishares.android';
const iosAppLink =
  'https://apps.apple.com/ru/app/math-wallet-blockchain-wallet/id1383637331';
const chromeAppLink =
  'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc';
const edgeAppLink =
  'https://microsoftedge.microsoft.com/addons/detail/math-wallet/dfeccadlilpndjjohbjdblepmjeahlmm';
const firefoxAppLink = 'https://mathwallet.org/en-us/#extension';

export const useConnectorMathWallet = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    if (isAndroid) {
      openWindow(androidAppLink);
    } else if (isIOS) {
      openWindow(iosAppLink);
    } else if (isEdge) {
      openWindow(edgeAppLink);
    } else if (isFirefox) {
      openWindow(firefoxAppLink);
    } else {
      openWindow(chromeAppLink);
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isMathWalletProvider()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return { connect };
};
