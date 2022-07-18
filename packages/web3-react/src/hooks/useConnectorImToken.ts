import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isImTokenProvider } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { InjectedConnector } from '@web3-react/injected-connector';

type Connector = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const IM_TOKEN_URL = 'imtokenv2://navigate/DappView?url=';

export const useConnectorImToken = (): Connector => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      const pageUrl = encodeURIComponent(window.location.href);
      openWindow(`${IM_TOKEN_URL}${pageUrl}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isImTokenProvider()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return {
    connect,
    connector: injected,
  };
};
