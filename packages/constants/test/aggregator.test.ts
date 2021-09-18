import { CHAINS } from '../src/chains';
import { getAggregatorAddress } from '../src/aggregator';

describe('getAggregatorAddress', () => {
  test('should work if chain is correct', () => {
    expect(typeof getAggregatorAddress(CHAINS.Mainnet)).toBe('string');
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getAggregatorAddress(-1)).toThrowError();
    expect(() => getAggregatorAddress('' as any)).toThrowError();
  });
});
