import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { useConnectorInfo } from './useConnectorInfo';
import { useCallback } from 'react';

export const useDisconnect = (): (() => void) | undefined => {
  const { deactivate, connector } = useWeb3React();

  const disconnect = useCallback(() => {
    deactivate();
    connector?.deactivate();

    if (connector instanceof WalletConnectConnector) connector.close();
    if (connector instanceof WalletLinkConnector) connector.close();
  }, [deactivate, connector]);

  const { isGnosis, isImToken, isTrust } = useConnectorInfo();
  const canDisconnect = !isGnosis && !isImToken && !isTrust;

  return canDisconnect ? disconnect : undefined;
};