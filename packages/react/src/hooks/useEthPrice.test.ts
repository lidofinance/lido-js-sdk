jest.mock('@lido-sdk/contracts');

import { renderHook, act } from '@testing-library/react-hooks';
import { getAggregatorContract } from '@lido-sdk/contracts';
import { useEthPrice } from './useEthPrice';
import { sleep } from './testUtils';
import { BigNumber } from '@ethersproject/bignumber';

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
  test('should fetch data', async () => {
    const expected = 1000;
    const decimals = 18;
    const latestAnswer = convertToBig(expected, decimals);

    mockGetter.mockReturnValue({
      decimals: async () => decimals,
      latestAnswer: async () => latestAnswer,
    } as any);

    const { result } = renderHook(() => useEthPrice());

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(expected);
  });

  test('should update', async () => {
    const decimals = 18;

    mockGetter.mockReturnValue({
      decimals: async () => decimals,
      latestAnswer: async () => convertToBig(1234.56, decimals),
    } as any);

    const { result } = renderHook(() => useEthPrice());

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(1234.56);

    mockGetter.mockReturnValue({
      decimals: async () => decimals,
      latestAnswer: async () => convertToBig(2345.67, decimals),
    } as any);

    act(() => result.current.update());

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(2345.67);
  });
});
