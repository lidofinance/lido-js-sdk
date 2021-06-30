import { useContext } from 'react';
import { SDKContext, SDKContextValue } from '../context';

export const useSDK = (): SDKContextValue => {
  return useContext(SDKContext);
};
