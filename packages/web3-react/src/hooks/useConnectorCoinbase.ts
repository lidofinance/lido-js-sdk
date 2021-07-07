import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useWeb3React } from '@web3-react/core';

type Connector = {
  connect: () => void;
  available: boolean;
};

export const useConnectorCoinbase = (): Connector => {
  const { coinbase } = useConnectors();
  const { activate } = useWeb3React();

  const connect = useCallback(() => {
    activate(coinbase);
  }, [activate, coinbase]);

  return { connect, available: true };
};
