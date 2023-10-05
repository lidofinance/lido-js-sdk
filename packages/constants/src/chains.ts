import invariant from 'tiny-invariant';

export enum CHAINS {
  Mainnet = 1,
  Ropsten = 3, // decommissioned
  Rinkeby = 4, // decommissioned
  Goerli = 5, // deprecated
  Kovan = 42, // decommissioned
  Kintsugi = 1337702, // decommissioned
  Kiln = 1337802, // decommissioned
  Holesky = 17000,
  Moonbeam = 1284,
  Moonriver = 1285,
  Moonbase = 1287,
  Arbitrum = 42161,
  Optimism = 10,
  Fuji = 43113,
  Avalanche = 43114,
}

export const CHAINS_IDS = [
  CHAINS.Mainnet,
  CHAINS.Ropsten,
  CHAINS.Holesky,
  CHAINS.Rinkeby,
  CHAINS.Goerli,
  CHAINS.Kovan,
];

export const CHAINS_COLORS: {
  [key in CHAINS]?: string;
} = {
  [CHAINS.Mainnet]: '#29b6af',
  [CHAINS.Ropsten]: '#ff4a8d',
  [CHAINS.Rinkeby]: '#f6c343',
  [CHAINS.Goerli]: '#3099f2',
  [CHAINS.Holesky]: '#AA346A',
  [CHAINS.Kovan]: '#9064ff',
};

export const getChainColor = (chainId: CHAINS): string => {
  const color = CHAINS_COLORS[chainId];
  invariant(color != null, 'Chain is not supported');

  return color;
};
