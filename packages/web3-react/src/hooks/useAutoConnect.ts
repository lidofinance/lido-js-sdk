import warning from 'tiny-warning';
import { useCallback, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useConnectorStorage } from './useConnectorStorage';
import { ConnectorsContextValue } from '../context';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { isImTokenProvider, isTrustProvider } from '../helpers';
import { useConnectorInfo } from './useConnectorInfo';
import { useDisconnect } from './useDisconnect';

export const useAutoConnect = (connectors: ConnectorsContextValue): void => {
  useEagerConnector(connectors);
  useSaveConnectorToLS();
  useDeleteConnectorFromLS();
  useWatchConnectorInLS();
};

const useEagerConnector = (connectors: ConnectorsContextValue): void => {
  const { active, activate } = useWeb3React();
  const [savedConnector] = useConnectorStorage();
  const tried = useRef(false);

  const getEagerConnector =
    useCallback(async (): Promise<AbstractConnector | null> => {
      const { gnosis, injected } = connectors;

      // Dapp browsers
      if (isTrustProvider()) return injected;
      if (isImTokenProvider()) return injected;

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
        activate(connector, undefined, true);
      } catch (error) {
        warning(false, 'Connector is not activated');
      }
    })();
  }, [activate, getEagerConnector, active]);
};

const useSaveConnectorToLS = () => {
  const [, saveConnector] = useConnectorStorage();
  const { isInjected, isImToken, isTrust, isWalletConnect, isCoinbase } =
    useConnectorInfo();

  const isDappBrowser = isImToken || isTrust;

  useEffect(() => {
    if (isInjected && !isDappBrowser) return saveConnector('injected');
    if (isWalletConnect) return saveConnector('walletconnect');
    if (isCoinbase) return saveConnector('coinbase');
  }, [isInjected, isDappBrowser, isCoinbase, isWalletConnect, saveConnector]);
};

const useDeleteConnectorFromLS = () => {
  const [, saveConnector] = useConnectorStorage();
  const { active } = useWeb3React();

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

const useWatchConnectorInLS = () => {
  const [savedConnector] = useConnectorStorage();
  const disconnect = useDisconnect();
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
