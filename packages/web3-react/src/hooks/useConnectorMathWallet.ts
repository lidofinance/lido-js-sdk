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

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL_ANDROID =
  'https://play.google.com/store/apps/details?id=com.mathwallet.android';
const WALLET_URL_IOS = 'https://apps.apple.com/ru/app/mathwallet5/id1582612388';
const WALLET_URL_CHROME =
  'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc';
const WALLET_URL_EDGE =
  'https://microsoftedge.microsoft.com/addons/detail/math-wallet/dfeccadlilpndjjohbjdblepmjeahlmm';
const WALLET_URL_FIREFOX = 'https://mathwallet.org/en-us/#extension';

export const useConnectorMathWallet = (): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const suggestApp = useCallback(() => {
    if (isAndroid) {
      openWindow(WALLET_URL_ANDROID);
    } else if (isIOS) {
      openWindow(WALLET_URL_IOS);
    } else if (isEdge) {
      openWindow(WALLET_URL_EDGE);
    } else if (isFirefox) {
      openWindow(WALLET_URL_FIREFOX);
    } else {
      openWindow(WALLET_URL_CHROME);
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
