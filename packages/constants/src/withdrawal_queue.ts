import invariant from 'tiny-invariant';
import { CHAINS } from './chains';

export const WITHDRAWAL_QUEUE_BY_NETWORK: {
  [key in CHAINS]?: string;
} = {
  [CHAINS.Mainnet]: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
  [CHAINS.Goerli]: '0xCF117961421cA9e546cD7f50bC73abCdB3039533',
  [CHAINS.Holesky]: '0xc7cc160b58F8Bb0baC94b80847E2CF2800565C50',
  [CHAINS.Sepolia]: '0x1583C7b3f4C3B008720E6BcE5726336b0aB25fdd',
  [CHAINS.Hoodi]: '0xfe56573178f1bcdf53F01A6E9977670dcBBD9186',
};

export const getWithdrawalQueueAddress = (chainId: CHAINS): string => {
  const address = WITHDRAWAL_QUEUE_BY_NETWORK[chainId];
  invariant(address, 'Chain is not supported');
  return address;
};
