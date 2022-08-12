import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isAndroid, isIOS, isCoin98Provider } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedConnector } from '@web3-react/injected-connector';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL_ANDROID = 'https://android.coin98.app';
const WALLET_URL_IOS = 'https://ios.coin98.app';
const WALLET_URL_CHROME = 'https://chrome.coin98.com';

export const useConnectorCoin98 = (): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const suggestApp = useCallback(() => {
    if (isAndroid) {
      openWindow(WALLET_URL_ANDROID);
    } else if (isIOS) {
      openWindow(WALLET_URL_IOS);
    } else {
      openWindow(WALLET_URL_CHROME);
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isCoin98Provider()) {
      await disconnect();
      activate(injected);
    } else {
      suggestApp();
    }
  }, [activate, disconnect, suggestApp, injected]);

  return { connect, connector: injected };
};
