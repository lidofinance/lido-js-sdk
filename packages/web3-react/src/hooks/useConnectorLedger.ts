import { useCallback } from 'react';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';

type Connector = {
  connect: () => Promise<void>;
  connector: LedgerHQConnector;
};

export const useConnectorLedger = (): Connector => {
  const { ledger } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(ledger);
  }, [activate, disconnect, ledger]);

  return {
    connect,
    connector: ledger,
  };
};
