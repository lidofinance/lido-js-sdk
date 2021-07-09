import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';

type Connector = {
  connect: () => Promise<void>;
};

export const useConnectorWalletConnect = (): Connector => {
  const { walletconnect } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(walletconnect);
  }, [activate, disconnect, walletconnect]);

  return { connect };
};
