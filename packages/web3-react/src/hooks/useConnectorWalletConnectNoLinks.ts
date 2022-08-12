import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: WalletConnectConnector;
};

export const useConnectorWalletConnectNoLinks = (): ConnectorHookResult => {
  const { WalletConnectNoLinks: connector } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(connector);
  }, [activate, disconnect, connector]);

  return { connect, connector };
};
