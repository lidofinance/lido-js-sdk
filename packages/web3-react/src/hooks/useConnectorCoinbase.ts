import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { WalletLinkHookResult } from './types';

export const useConnectorCoinbase = (): WalletLinkHookResult => {
  const { coinbase } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(coinbase);
  }, [activate, disconnect, coinbase]);

  return { connect, connector: coinbase };
};
