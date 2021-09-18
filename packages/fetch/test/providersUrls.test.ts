import { CHAINS, CHAINS_IDS } from '@lido-sdk/constants';
import {
  getInfuraRPCUrl,
  getAlchemyRPCUrl,
  getRPCUrls,
} from '../src/providersUrls';

describe('getInfuraRPCUrl', () => {
  test('should work if chain is correct', () => {
    CHAINS_IDS.forEach((chainId) => {
      expect(typeof getInfuraRPCUrl(chainId, 'API_KEY')).toBe('string');
    });
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getInfuraRPCUrl(-1, 'API_KEY')).toThrowError();
    expect(() => getInfuraRPCUrl('' as any, 'API_KEY')).toThrowError();
  });
  test('should throw if API key is incorrect', () => {
    expect(() => getInfuraRPCUrl(CHAINS.Mainnet, '')).toThrowError();
    expect(() => getInfuraRPCUrl(CHAINS.Mainnet, null as any)).toThrowError();
  });
});

describe('getAlchemyRPCUrl', () => {
  CHAINS_IDS.forEach((chainId) => {
    expect(typeof getAlchemyRPCUrl(chainId, 'API_KEY')).toBe('string');
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getAlchemyRPCUrl(-1, 'API_KEY')).toThrowError();
    expect(() => getAlchemyRPCUrl('' as any, 'API_KEY')).toThrowError();
  });
  test('should throw if API key is incorrect', () => {
    expect(() => getAlchemyRPCUrl(CHAINS.Mainnet, '')).toThrowError();
    expect(() => getAlchemyRPCUrl(CHAINS.Mainnet, null as any)).toThrowError();
  });
});

describe('getRPCUrls', () => {
  test('should work correctly', () => {
    expect(
      getRPCUrls(CHAINS.Mainnet, {
        infura: 'API_KEY',
        alchemy: 'API_KEY',
      }),
    ).toEqual([
      expect.stringContaining('infura'),
      expect.stringContaining('alchemy'),
    ]);
  });

  test('should return empty array', () => {
    expect(getRPCUrls(CHAINS.Mainnet, {})).toEqual([]);
  });
});
