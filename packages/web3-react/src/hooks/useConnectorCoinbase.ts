import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

type Connector = {
  connect: () => Promise<void>;
  connector: WalletLinkConnector;
};

export const useConnectorCoinbase = (): Connector => {
  const { coinbase } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(coinbase);
  }, [activate, disconnect, coinbase]);

  return { connect, connector: coinbase };
};
