import { FC } from 'react';
import { SDKContextProps, SDKProvider } from '../context';

export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const supportedChainsIds = [4];
const chainId = 4;
const providerProps = { supportedChainsIds, chainId };

export const ProviderWrapper: FC<Partial<SDKContextProps>> = (props) => (
  <SDKProvider {...providerProps} {...props} />
);
