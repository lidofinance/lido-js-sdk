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
import { InjectedConnector } from '@web3-react/injected-connector';

type Connector = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const androidAppLink =
  'https://play.google.com/store/apps/details?id=com.mathwallet.android';
const iosAppLink = 'https://apps.apple.com/ru/app/mathwallet5/id1582612388';
const chromeAppLink =
  'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc';
const edgeAppLink =
  'https://microsoftedge.microsoft.com/addons/detail/math-wallet/dfeccadlilpndjjohbjdblepmjeahlmm';
const firefoxAppLink = 'https://mathwallet.org/en-us/#extension';

export const useConnectorMathWallet = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const suggestApp = useCallback(() => {
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
      suggestApp();
    }
  }, [activate, disconnect, suggestApp, injected]);

  return { connect, connector: injected };
};
