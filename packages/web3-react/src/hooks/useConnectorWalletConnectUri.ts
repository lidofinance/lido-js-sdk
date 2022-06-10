import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { WalletConnectHookResult } from './types';

export const useConnectorWalletConnectUri = (): WalletConnectHookResult => {
  const { WalletConnectUri: connector } = useConnectors();

  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(connector);
  }, [activate, disconnect, connector]);

  return { connect, connector };
};
