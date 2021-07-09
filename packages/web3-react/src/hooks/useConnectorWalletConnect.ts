import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';

type Connector = {
  connect: () => void;
};

export const useConnectorWalletConnect = (): Connector => {
  const { walletconnect } = useConnectors();
  const { activate } = useWeb3();

  const connect = useCallback(() => {
    activate(walletconnect);
  }, [activate, walletconnect]);

  return { connect };
};
