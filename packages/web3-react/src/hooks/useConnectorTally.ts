import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isFirefox, isTallyProvider } from '../helpers';
import { useForceDisconnect } from './useDisconnect';

type Connector = {
  connect: () => Promise<void>;
};

const chromeAppLink =
  'https://chrome.google.com/webstore/detail/tally-ho/eajafomhmkipbjmfmhebemolkcicgfmd';
const firefoxAppLink = 'https://addons.mozilla.org/en-US/firefox/addon/tally/';

export const useConnectorTally = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const suggestApp = useCallback(() => {
    if (isFirefox) {
      openWindow(firefoxAppLink);
    } else {
      openWindow(chromeAppLink);
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isTallyProvider()) {
      await disconnect();
      activate(injected);
    } else {
      suggestApp();
    }
  }, [activate, disconnect, suggestApp, injected]);

  return { connect };
};
