import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useWeb3React } from '@web3-react/core';

type Connector = {
  connect: () => void;
  available: boolean;
};

export const useConnectorWalletConnect = (): Connector => {
  const { walletconnect } = useConnectors();
  const { activate } = useWeb3React();

  const connect = useCallback(() => {
    activate(walletconnect);
  }, [activate, walletconnect]);

  return { connect, available: true };
};
