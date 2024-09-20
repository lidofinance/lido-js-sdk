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
  [CHAINS.Holesky]: {
    [TOKENS.WSTETH]: '0x8d09a4502Cc8Cf1547aD300E066060D043f6982D',
    [TOKENS.STETH]: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
    [TOKENS.LDO]: '0x14ae7daeecdf57034f3E9db8564e46Dba8D97344',
  },
  [CHAINS.Sepolia]: {
    [TOKENS.WSTETH]: '0xB82381A3fBD3FaFA77B3a7bE693342618240067b',
    [TOKENS.STETH]: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af',
    [TOKENS.LDO]: '0xd06dF83b8ad6D89C86a187fba4Eae918d497BdCB',
  },
};

export const L2_TOKENS_BY_NETWORK: {
  [key in CHAINS]?: { [key in TOKENS]?: string };
} = {
  [CHAINS.OptimismSepolia]: {
    [TOKENS.WSTETH]: '0x24B47cd3A74f1799b32B2de11073764Cb1bb318B',
    [TOKENS.STETH]: '0xf49d208b5c7b10415c7beafe9e656f2df9edfe3b',
  },
};

export const getL1TokenAddress = (chainId: CHAINS, token: TOKENS): string => {
  const tokens = TOKENS_BY_NETWORK[chainId];
  invariant(tokens, 'Chain is not supported');

  const address = tokens[token];
  invariant(address, 'Token is not supported');

  return address;
};

export const getL2TokenAddress = (chainId: CHAINS, token: TOKENS): string => {
  const tokens = L2_TOKENS_BY_NETWORK[chainId];
  invariant(tokens, 'L2 chain is not supported');

  const address = tokens[token];
  invariant(address, 'L2 token is not supported');

  return address;
};

export const getTokenAddress = (chainId: CHAINS, token: TOKENS): string => {
  if (token === TOKENS.LDO) {
    const _chainId =
      chainId === CHAINS.OptimismSepolia ? CHAINS.Sepolia : chainId;
    return getL1TokenAddress(_chainId, token);
  } else {
    return chainId === CHAINS.OptimismSepolia
      ? getL2TokenAddress(chainId, token)
      : getL1TokenAddress(chainId, token);
  }
};
