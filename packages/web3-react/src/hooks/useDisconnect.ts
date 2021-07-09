import { AbstractConnector } from '@web3-react/abstract-connector';
import { useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { useConnectorInfo } from './useConnectorInfo';

type ExtendedConnector =
  | (AbstractConnector & { close?: () => Promise<void> })
  | undefined;

type Disconnect = {
  disconnect?: () => void;
};

export const useDisconnect = (): Disconnect => {
  const { deactivate, active, connector } = useWeb3();
  const extendedConnector = connector as ExtendedConnector;

  const disconnect = useCallback(() => {
    deactivate();
    extendedConnector?.deactivate();
    extendedConnector?.close?.();
  }, [deactivate, extendedConnector]);

  const { isGnosis, isDappBrowser } = useConnectorInfo();
  const available = active && !isGnosis && !isDappBrowser;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
