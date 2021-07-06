import { FC } from 'react';
import { SDKContextProps, ProviderSDK } from '../context';
import { CHAINS } from '@lido-sdk/constants';

const supportedChainIds = [CHAINS.Rinkeby];
const chainId = CHAINS.Rinkeby;
const providerProps = { supportedChainIds, chainId };

export const ProviderWrapper: FC<Partial<SDKContextProps>> = (props) => (
  <ProviderSDK {...providerProps} {...props} />
);
