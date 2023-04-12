import invariant from 'tiny-invariant';
import { CHAINS } from './chains';

export enum TOKENS {
  WSTETH = 'WSTETH',
  STETH = 'STETH',
  LDO = 'LDO',
}

export const TOKENS_BY_NETWORK: {
  [key in CHAINS]?: { [key in TOKENS]?: string };
} = {
  [CHAINS.Mainnet]: {
    [TOKENS.WSTETH]: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    [TOKENS.STETH]: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    [TOKENS.LDO]: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
  },
  [CHAINS.Ropsten]: {
    [TOKENS.STETH]: '0xd40EefCFaB888C9159a61221def03bF77773FC19',
  },
  [CHAINS.Rinkeby]: {
    [TOKENS.WSTETH]: '0x2Ca788280fB10384946D3ECC838D94DeCa505CF4',
    [TOKENS.STETH]: '0xbA453033d328bFdd7799a4643611b616D80ddd97',
    [TOKENS.LDO]: '0xbfcb02cf3df4f36ab8185469834e0e00a5fc6053',
  },
  [CHAINS.Goerli]: {
    [TOKENS.WSTETH]: '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f',
    [TOKENS.STETH]: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
    [TOKENS.LDO]: '0x56340274fB5a72af1A3C6609061c451De7961Bd4',
  },
  [CHAINS.Zhejiang]: {
    [TOKENS.WSTETH]: '0x9E4e17458c8A7C51939ec0d4e3aA736Ce423FD12',
    [TOKENS.STETH]: '0xDe82ADEd58dA35add75Ea4676239Ca169c8dCD15',
    [TOKENS.LDO]: '0xadBFF2718dB9A76429848F31a724DdA6b8e8c8Cd',
  },
};

export const getTokenAddress = (chainId: CHAINS, token: TOKENS): string => {
  const tokens = TOKENS_BY_NETWORK[chainId];
  invariant(tokens != null, 'Chain is not supported');

  const address = tokens[token];
  invariant(address != null, 'Token is not supported');

  return address;
};
