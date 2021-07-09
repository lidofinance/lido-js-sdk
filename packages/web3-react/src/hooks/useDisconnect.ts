import { AbstractConnector } from '@web3-react/abstract-connector';
import { useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { useConnectorInfo } from './useConnectorInfo';

type ExtendedConnector =
  | (AbstractConnector & { close?: () => Promise<void> })
  | undefined;

export const useForceDisconnect = (): {
  disconnect: () => void;
} => {
  const { deactivate, connector } = useWeb3();
  const extendedConnector = connector as ExtendedConnector;

  const disconnect = useCallback(async () => {
    try {
      deactivate();
      extendedConnector?.deactivate();
      await extendedConnector?.close?.();
    } catch (error) {
      //
    }
  }, [deactivate, extendedConnector]);

  return { disconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
} => {
  const { active } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const { isGnosis, isDappBrowser } = useConnectorInfo();
  const available = active && !isGnosis && !isDappBrowser;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
