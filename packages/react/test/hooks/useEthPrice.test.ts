jest.mock('@lido-sdk/contracts');

import { renderHook, act } from '@testing-library/react-hooks';
import { BigNumber } from '@ethersproject/bignumber';
import { getAggregatorContract } from '@lido-sdk/contracts';
import { useEthPrice } from '../../src/hooks/useEthPrice';

const mockGetter = getAggregatorContract as jest.MockedFunction<
  typeof getAggregatorContract
>;

const convertToBig = (number: number, decimals: number) => {
  const precision = 6;
  const int = Math.floor(number * 10 ** precision);

  return BigNumber.from(int)
    .mul(BigNumber.from(10).pow(decimals))
    .div(BigNumber.from(10).pow(precision));
};

describe('useEthPrice', () => {
  const expected = 1000;
  const decimals = 18;
  const latestAnswer = convertToBig(expected, decimals);

  const mockDecimals = jest.fn(async () => decimals);
  const mockLatestAnswer = jest.fn(async () => latestAnswer);

  beforeEach(() => {
    mockGetter.mockReturnValue({
      decimals: mockDecimals,
      latestAnswer: mockLatestAnswer,
    } as any);
  });

  afterEach(() => {
    mockGetter.mockReset();
  });

  test('should fetch data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEthPrice());

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should update', async () => {
    const expectedFirst = 1234.56;
    const expectedSecond = 234.567;

    mockLatestAnswer.mockReturnValue(
      Promise.resolve(convertToBig(expectedFirst, decimals)),
    );

    const { result, waitForNextUpdate } = renderHook(() => useEthPrice());

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expectedFirst);

    mockLatestAnswer.mockReturnValue(
      Promise.resolve(convertToBig(expectedSecond, decimals)),
    );

    await act(async () => {
      await expect(result.current.update()).resolves.toBe(expectedSecond);
    });
    expect(result.current.data).toBe(expectedSecond);
  });

  test('should set loading', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEthPrice());

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
  });

  test('should set initial loading', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEthPrice());

    expect(result.current.initialLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.initialLoading).toBe(false);
  });

  test('should catch an error', async () => {
    mockGetter.mockReturnValue({
      decimals: async () => {
        throw new Error();
      },
      latestAnswer: mockLatestAnswer,
    } as any);

    const { result, waitForNextUpdate } = renderHook(() => useEthPrice());

    expect(result.current.error).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
