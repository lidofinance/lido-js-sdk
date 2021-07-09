import warning from 'tiny-warning';
import { useCallback, useEffect, useRef } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3 } from './useWeb3';
import { useConnectorStorage } from './useConnectorStorage';
import { useConnectorInfo } from './useConnectorInfo';
import { useDisconnect } from './useDisconnect';
import { ConnectorsContextValue } from '../context';
import { isDappBrowserProvider } from '../helpers';

export const useAutoConnect = (connectors: ConnectorsContextValue): void => {
  useEagerConnector(connectors);
  useSaveConnectorToLS();
  useDeleteConnectorFromLS();
  useWatchConnectorInLS();
};

export const useEagerConnector = (connectors: ConnectorsContextValue): void => {
  const { active, activate } = useWeb3();
  const [savedConnector] = useConnectorStorage();
  const tried = useRef(false);

  const getEagerConnector =
    useCallback(async (): Promise<AbstractConnector | null> => {
      const { gnosis, injected } = connectors;

      // Dapp browsers
      if (isDappBrowserProvider()) return injected;

      // Gnosis iframe
      const isSaveApp = await gnosis?.isSafeApp();
      if (isSaveApp && gnosis) return gnosis;

      // Saved in LS
      const saved = savedConnector && connectors[savedConnector];
      if (saved) return saved;

      return null;
    }, [connectors, savedConnector]);

  useEffect(() => {
    if (tried.current || active) return;

    (async () => {
      tried.current = true;

      const connector = await getEagerConnector();
      if (!connector) return;

      try {
        await activate(connector, undefined, true);
      } catch (error) {
        warning(false, 'Connector is not activated');
      }
    })();
  }, [activate, getEagerConnector, active]);
};

export const useSaveConnectorToLS = (): void => {
  const [, saveConnector] = useConnectorStorage();
  const { isInjected, isDappBrowser, isWalletConnect, isCoinbase } =
    useConnectorInfo();

  useEffect(() => {
    if (isInjected && !isDappBrowser) return saveConnector('injected');
    if (isWalletConnect) return saveConnector('walletconnect');
    if (isCoinbase) return saveConnector('coinbase');
  }, [isInjected, isDappBrowser, isCoinbase, isWalletConnect, saveConnector]);
};

export const useDeleteConnectorFromLS = (): void => {
  const [, saveConnector] = useConnectorStorage();
  const { active } = useWeb3();

  const lastState = useRef(active);

  useEffect(() => {
    const isStateChanged = lastState.current !== active;
    const isDisconnected = !active;

    lastState.current = active;

    if (isStateChanged && isDisconnected) {
      saveConnector(null);
    }
  }, [active, saveConnector]);
};

export const useWatchConnectorInLS = (): void => {
  const [savedConnector] = useConnectorStorage();
  const { disconnect } = useDisconnect();
  const lastConnector = useRef(savedConnector);

  useEffect(() => {
    const isConnectorChanged = lastConnector.current !== savedConnector;
    const isDisconnected = !savedConnector;

    lastConnector.current = savedConnector;

    if (isConnectorChanged && isDisconnected) {
      disconnect?.();
    }
  }, [savedConnector, disconnect]);
};
