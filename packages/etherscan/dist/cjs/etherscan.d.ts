import { CHAINS } from './chains';
export declare enum ETHERSCAN_ENTITIES {
  Tx = 'tx',
  Token = 'token',
  Address = 'address',
}
export declare type EtherscanEntities = `${ETHERSCAN_ENTITIES}`;
export declare const ETHERSCAN_PREFIX_BY_NETWORK: {
  [key in CHAINS]: string;
};
export declare const getEtherscanPrefix: (chainId: CHAINS) => string;
export declare const getEtherscanLink: (
  chainId: CHAINS,
  hash: string,
  entity: EtherscanEntities,
) => string;
export declare const getEtherscanTxLink: (
  chainId: CHAINS,
  hash: string,
) => string;
export declare const getEtherscanTokenLink: (
  chainId: CHAINS,
  hash: string,
) => string;
export declare const getEtherscanAddressLink: (
  chainId: CHAINS,
  hash: string,
) => string;
