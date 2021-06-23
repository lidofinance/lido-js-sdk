import { CHAINS } from './chains';
import {
  getEtherscanPrefix,
  getEtherscanLink,
  getEtherscanTxLink,
  getEtherscanTokenLink,
  getEtherscanAddressLink,
} from './etherscan';

describe('getEtherscanPrefix', () => {
  it('should work if chain is correct', () => {
    expect(typeof getEtherscanPrefix(CHAINS.Mainnet)).toBe('string');
    expect(typeof getEtherscanPrefix(CHAINS.Rinkeby)).toBe('string');
  });
  it('should throw if chain is incorrect', () => {
    expect(() => getEtherscanPrefix(-1)).toThrowError();
    expect(() => getEtherscanPrefix('' as any)).toThrowError();
  });
});

describe('getEtherscanLink', () => {
  it('should work if params are correct', () => {
    expect(typeof getEtherscanLink(CHAINS.Mainnet, '0', 'tx')).toBe('string');
    expect(typeof getEtherscanLink(CHAINS.Kovan, '0', 'token')).toBe('string');
  });
  it('should throw if chain is incorrect', () => {
    expect(() => getEtherscanLink(-1, '0', 'tx')).toThrowError();
  });
  it('should throw if hash is incorrect', () => {
    expect(() => getEtherscanLink(CHAINS.Mainnet, '', 'tx')).toThrowError();
  });
  it('should throw if entity is incorrect', () => {
    expect(() => getEtherscanLink(CHAINS.Kovan, '0', '' as any)).toThrowError();
  });
});

describe('getEtherscanTxLink', () => {
  it('should work correctly', () => {
    expect(typeof getEtherscanTxLink(CHAINS.Mainnet, '0')).toBe('string');
  });
});

describe('getEtherscanTokenLink', () => {
  it('should work correctly', () => {
    expect(typeof getEtherscanTokenLink(CHAINS.Mainnet, '0')).toBe('string');
  });
});

describe('getEtherscanAddressLink', () => {
  it('should work correctly', () => {
    expect(typeof getEtherscanAddressLink(CHAINS.Mainnet, '0')).toBe('string');
  });
});
