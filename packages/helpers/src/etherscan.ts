import invariant from 'tiny-invariant';
import { CHAINS } from '@lido-sdk/constants';

export enum ETHERSCAN_ENTITIES {
  Tx = 'tx',
  Token = 'token',
  Address = 'address',
}

export type EtherscanEntities = `${ETHERSCAN_ENTITIES}`;

export const ETHERSCAN_PREFIX_BY_NETWORK: {
  [key in CHAINS]?: string;
} = {
  [CHAINS.Mainnet]: '',
  [CHAINS.Ropsten]: 'ropsten.',
  [CHAINS.Rinkeby]: 'rinkeby.',
  [CHAINS.Goerli]: 'goerli.',
  [CHAINS.Kovan]: 'kovan.',
  [CHAINS.Holesky]: 'holesky.',
  [CHAINS.Sepolia]: 'sepolia.',
  [CHAINS.OptimismSepolia]: 'sepolia-optimistic.',
};

export const getEtherscanPrefix = (chainId: CHAINS): string => {
  const prefix = ETHERSCAN_PREFIX_BY_NETWORK[chainId];
  invariant(prefix != null, 'Chain is not supported');

  return prefix;
};

export const getEtherscanLink = (
  chainId: CHAINS,
  hash: string,
  entity: EtherscanEntities,
): string => {
  const prefix = getEtherscanPrefix(chainId);
  invariant(hash && typeof hash === 'string', 'Hash should be a string');
  invariant(entity && typeof entity === 'string', 'Entity should be a string');

  return `https://${prefix}etherscan.io/${entity}/${hash}`;
};

export const getEtherscanTxLink = (chainId: CHAINS, hash: string): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Tx);
};

export const getEtherscanTokenLink = (
  chainId: CHAINS,
  hash: string,
): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Token);
};

export const getEtherscanAddressLink = (
  chainId: CHAINS,
  hash: string,
): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Address);
};
