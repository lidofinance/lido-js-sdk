import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { WalletConnectHookResult } from './types';

export const useConnectorWalletConnect = (): WalletConnectHookResult => {
  const { walletconnect } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(walletconnect);
  }, [activate, disconnect, walletconnect]);

  return { connect, connector: walletconnect };
};
