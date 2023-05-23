import { useContext } from 'react';
import { ConnectorsContext, ConnectorsContextValue } from '../context';
import invariant from 'tiny-invariant';

export const useConnectors = (): ConnectorsContextValue => {
  const r = useContext(ConnectorsContext);
  invariant(r, 'useConnectors was used outside of ConnectorsContext');
  return r;
};
