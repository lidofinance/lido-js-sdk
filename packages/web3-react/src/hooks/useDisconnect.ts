import { useWeb3React } from '@web3-react/core';
import { useConnectorInfo } from './useConnectorInfo';
import { useCallback } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';

type ExtendedConnector =
  | (AbstractConnector & { close?: () => Promise<void> })
  | undefined;

export const useDisconnect = (): (() => void) | undefined => {
  const { deactivate, active, connector } = useWeb3React();
  const extendedConnector = connector as ExtendedConnector;

  const disconnect = useCallback(() => {
    deactivate();
    extendedConnector?.deactivate();
    extendedConnector?.close?.();
  }, [deactivate, extendedConnector]);

  const { isGnosis, isImToken, isTrust } = useConnectorInfo();
  const canDisconnect = active && !isGnosis && !isImToken && !isTrust;

  return canDisconnect ? disconnect : undefined;
};
