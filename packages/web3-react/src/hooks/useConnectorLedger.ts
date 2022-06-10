import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { LedgerHookResult } from './types';

export const useConnectorLedger = (): LedgerHookResult => {
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
