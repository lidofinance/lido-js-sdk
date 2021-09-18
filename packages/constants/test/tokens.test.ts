import { CHAINS } from '../src/chains';
import { getTokenAddress, TOKENS } from '../src/tokens';

describe('getTokenAddress', () => {
  test('should work if chain is correct', () => {
    expect(typeof getTokenAddress(CHAINS.Mainnet, TOKENS.STETH)).toBe('string');
    expect(typeof getTokenAddress(CHAINS.Rinkeby, TOKENS.LDO)).toBe('string');
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getTokenAddress(-1, TOKENS.LDO)).toThrowError();
    expect(() => getTokenAddress('' as any, TOKENS.LDO)).toThrowError();
  });
  test('should throw if token is incorrect', () => {
    expect(() => getTokenAddress(CHAINS.Mainnet, 'weth' as any)).toThrowError();
    expect(() => getTokenAddress(CHAINS.Mainnet, '' as any)).toThrowError();
  });
});
