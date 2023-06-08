import { useContext } from 'react';
import { SDKContext, SDKContextValue } from '../context';
import invariant from 'tiny-invariant';

export const useSDK = (): SDKContextValue => {
  const contextValue = useContext(SDKContext);
  invariant(contextValue, 'useSDK was used outside of SDKContext');
  return contextValue;
};
