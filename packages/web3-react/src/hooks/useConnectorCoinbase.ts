import { useCallback } from 'react';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';

type Connector = {
  connect: () => void;
};

export const useConnectorCoinbase = (): Connector => {
  const { coinbase } = useConnectors();
  const { activate } = useWeb3();

  const connect = useCallback(() => {
    activate(coinbase);
  }, [activate, coinbase]);

  return { connect };
};
