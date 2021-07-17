import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';

type Connector = {
  connect?: () => Promise<void>;
};

export const useConnectorLedger = (): Connector => {
  const { ledger } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const connect = useCallback(async () => {
    await disconnect();
    activate(ledger);
  }, [activate, disconnect, ledger]);

  const available = ledger.isSupported();

  return {
    connect: available ? connect : undefined,
  };
};
