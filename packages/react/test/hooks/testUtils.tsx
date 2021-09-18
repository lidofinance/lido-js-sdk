import { FC } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { SDKContextProps, ProviderSDK } from '../../src/context';

const supportedChainIds = [CHAINS.Rinkeby];
const chainId = CHAINS.Rinkeby;
const providerProps = { supportedChainIds, chainId };

export const ProviderWrapper: FC<Partial<SDKContextProps>> = (props) => (
  <ProviderSDK {...providerProps} {...props} />
);
