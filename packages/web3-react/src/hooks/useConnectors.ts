import { useContext } from 'react';
import { ConnectorsContext, ConnectorsContextValue } from '../context';
import invariant from 'tiny-invariant';

export const useConnectors = (): ConnectorsContextValue => {
  const contextValue = useContext(ConnectorsContext);
  invariant(
    contextValue,
    'useConnectors was used outside of ConnectorsContext',
  );
  return contextValue;
};
