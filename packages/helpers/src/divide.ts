import { BigNumber } from '@ethersproject/bignumber';
import invariant from 'tiny-invariant';

const PRECISION = 6;

export const divide = (
  number: BigNumber,
  divider: BigNumber,
  precision = PRECISION,
): number => {
  invariant(number != null, 'Number is required');
  invariant(divider != null, 'Divider is required');

  const multiplier = 10 ** precision;
  return number.mul(multiplier).div(divider).toNumber() / multiplier;
};
