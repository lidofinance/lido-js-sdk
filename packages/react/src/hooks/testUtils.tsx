import { FC } from 'react';
import { SDKContextProps, ProviderSDK } from '../context';
import { CHAINS } from '@lido-sdk/constants';

export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const supportedChainIds = [CHAINS.Rinkeby];
const chainId = CHAINS.Rinkeby;
const providerProps = { supportedChainIds, chainId };

export const ProviderWrapper: FC<Partial<SDKContextProps>> = (props) => (
  <ProviderSDK {...providerProps} {...props} />
);
