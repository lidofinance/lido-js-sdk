import { FC } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { SDKContextProps, ProviderSDK } from '../../src/context';

const supportedChainIds = [CHAINS.Goerli, CHAINS.Mainnet];
const chainId = CHAINS.Goerli;
const providerProps = { supportedChainIds, chainId };

export const ProviderWrapper: FC<Partial<SDKContextProps>> = (props) => (
  <ProviderSDK {...providerProps} {...props} />
);
