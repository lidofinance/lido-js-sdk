import { useLocalStorage } from '@lido-sdk/react';
import { STORAGE_CONNECTOR_KEY } from '../constants';
import { Connector } from '../context';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useConnectorStorage = () =>
  useLocalStorage<Connector | null>(STORAGE_CONNECTOR_KEY, null);
