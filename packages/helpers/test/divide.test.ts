import { BigNumber } from '@ethersproject/bignumber';
import { divide } from '../src/divide';

describe('divide', () => {
  test('should divide correctly', () => {
    expect(divide(BigNumber.from(10000), BigNumber.from(100))).toBe(100);
  });

  test('should divide with precision', () => {
    const precision = 3;
    const result = divide(BigNumber.from(1), BigNumber.from(17), precision);

    expect(result).toBe(0.058);
  });
});
