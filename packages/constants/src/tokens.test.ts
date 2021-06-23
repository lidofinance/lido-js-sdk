import { CHAINS } from './chains';
import { getTokenAddress, TOKENS } from './tokens';

describe('getTokenAddress', () => {
  it('should work if chain is correct', () => {
    expect(typeof getTokenAddress(CHAINS.Mainnet, TOKENS.STETH)).toBe('string');
    expect(typeof getTokenAddress(CHAINS.Rinkeby, TOKENS.LDO)).toBe('string');
  });
  it('should throw if chain is incorrect', () => {
    expect(() => getTokenAddress(-1, TOKENS.LDO)).toThrowError();
    expect(() => getTokenAddress('' as any, TOKENS.LDO)).toThrowError();
  });
  it('should throw if token is incorrect', () => {
    expect(() => getTokenAddress(CHAINS.Mainnet, 'weth' as any)).toThrowError();
    expect(() => getTokenAddress(CHAINS.Mainnet, '' as any)).toThrowError();
  });
});
