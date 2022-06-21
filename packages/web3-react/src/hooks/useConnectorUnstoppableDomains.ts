import { UAuthHookResult } from './types';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { useForceDisconnect } from './useDisconnect';
import { useCallback } from 'react';

export const useConnectorUnstoppableDomains = (): UAuthHookResult => {
  const { uauth } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const connector = uauth!;

  const connect = useCallback(async () => {
    await disconnect();
    activate(connector);
  }, [activate, connector, disconnect]);

  return { connect, connector };
};
