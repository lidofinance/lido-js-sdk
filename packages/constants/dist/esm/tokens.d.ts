import { CHAINS } from './chains';
export declare enum TOKENS {
  WSTETH = 'WSTETH',
  STETH = 'STETH',
  LDO = 'LDO',
}
export declare const TOKENS_BY_NETWORK: {
  [key in CHAINS]: {
    [key in TOKENS]: string;
  };
};
export declare const getTokenAddress: (
  chainId: CHAINS,
  token: TOKENS,
) => string;
