import { useContext } from 'react';
import { ConnectorsContext, ConnectorsContextValue } from '../context';

export const useConnectors = (): ConnectorsContextValue => {
  return useContext(ConnectorsContext);
};
