import { useContext } from 'react';
import { SDKContext, SDKContextValue } from '../context';
import invariant from 'tiny-invariant';

export const useSDK = (): SDKContextValue => {
  const r = useContext(SDKContext);
  invariant(r, 'useSDK was used outside of SDKContext');
  return r;
};
