import { CHAINS, getChainColor } from '../src/chains';

describe('getChainColor', () => {
  test('should work if chain is correct', () => {
    expect(typeof getChainColor(CHAINS.Mainnet)).toBe('string');
    expect(typeof getChainColor(CHAINS.Rinkeby)).toBe('string');
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getChainColor(-1)).toThrowError();
    expect(() => getChainColor('' as any)).toThrowError();
  });
});
