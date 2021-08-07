import {
  CHAINS,
  getTokenAddress,
  getAggregatorAddress,
  TOKENS,
} from '@lido-sdk/constants';
import {
  getAggregatorContract,
  getERC20Contract,
  getSTETHContract,
  getWSTETHContract,
} from './contracts';
import { getRpcProvider } from '@lido-sdk/providers';

describe('getAggregatorContract', () => {
  test('should create a contract', () => {
    const address = getAggregatorAddress(CHAINS.Mainnet);
    const provider = getRpcProvider(CHAINS.Mainnet, '/api/rpc');
    const contract = getAggregatorContract(address, provider);

    expect(contract).toBeInstanceOf(Object);
    expect(contract).toEqual(expect.objectContaining({ address }));
  });
});

describe('getERC20Contract', () => {
  test('should create a contract', () => {
    const address = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
    const provider = getRpcProvider(CHAINS.Mainnet, '/api/rpc');
    const contract = getERC20Contract(address, provider);

    expect(contract).toBeInstanceOf(Object);
    expect(contract).toEqual(expect.objectContaining({ address }));
  });
});

describe('getSTETHContract', () => {
  test('should create a contract', () => {
    const address = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
    const provider = getRpcProvider(CHAINS.Mainnet, '/api/rpc');
    const contract = getSTETHContract(address, provider);

    expect(contract).toBeInstanceOf(Object);
    expect(contract).toEqual(expect.objectContaining({ address }));
  });
});

describe('getWSTETHContract', () => {
  test('should create a contract', () => {
    const address = getTokenAddress(CHAINS.Mainnet, TOKENS.WSTETH);
    const provider = getRpcProvider(CHAINS.Mainnet, '/api/rpc');
    const contract = getWSTETHContract(address, provider);

    expect(contract).toBeInstanceOf(Object);
    expect(contract).toEqual(expect.objectContaining({ address }));
  });
});

describe('cache', () => {
  const addressFirst = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
  const addressSecond = getTokenAddress(CHAINS.Rinkeby, TOKENS.WSTETH);

  const providerFirst = getRpcProvider(CHAINS.Mainnet, '/api/rpc');
  const providerSecond = getRpcProvider(CHAINS.Rinkeby, '/api/rpc');

  test('should use cache if args are equal', () => {
    const contractFirst = getERC20Contract(addressFirst, providerFirst);
    const contractSecond = getERC20Contract(addressFirst, providerFirst);

    expect(contractFirst).toBe(contractSecond);
  });

  test('should be different if addresses are different', () => {
    const contractFirst = getERC20Contract(addressFirst, providerFirst);
    const contractSecond = getERC20Contract(addressSecond, providerFirst);

    expect(addressFirst).not.toBe(addressSecond);
    expect(contractFirst).not.toBe(contractSecond);
  });

  test('should be different if providers are different', () => {
    const contractFirst = getERC20Contract(addressFirst, providerFirst);
    const contractSecond = getERC20Contract(addressSecond, providerSecond);

    expect(providerFirst).not.toBe(providerSecond);
    expect(contractFirst).not.toBe(contractSecond);
  });

  test('should use cache if seeds are equal', () => {
    const contractFirst = getERC20Contract(addressFirst, providerFirst, 1);
    const contractSecond = getERC20Contract(addressFirst, providerFirst, 1);

    expect(contractFirst).toBe(contractSecond);
  });

  test('should be different if seeds are different', () => {
    const contractFirst = getERC20Contract(addressFirst, providerFirst, 1);
    const contractSecond = getERC20Contract(addressFirst, providerFirst, 2);

    expect(contractFirst).not.toBe(contractSecond);
  });
});
