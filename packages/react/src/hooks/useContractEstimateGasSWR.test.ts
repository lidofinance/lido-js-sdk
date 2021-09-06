import { renderHook, act } from '@testing-library/react-hooks';
import { useContractEstimateGasSWR } from './useContractEstimateGasSWR';

describe('useContractEstimateGasSWR', () => {
  test('should fetch data', async () => {
    const expected = 1;
    const contract = { estimateGas: { test: async () => expected } } as any;

    const { result, waitForNextUpdate } = renderHook(() =>
      useContractEstimateGasSWR({ method: 'test', contract }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should not fetch', async () => {
    const expected = 1;
    const mockMethod = jest.fn(() => expected);
    const contract = { estimateGas: { test: mockMethod } } as any;

    const { result } = renderHook(() =>
      useContractEstimateGasSWR({
        shouldFetch: false,
        method: 'test',
        contract,
      }),
    );

    expect(result.current.data).toBeUndefined();
    expect(mockMethod).toHaveBeenCalledTimes(0);
  });

  test('should update if contract is changed', async () => {
    const contractFirst = { estimateGas: { test: async () => 1 } } as any;
    const contractSecond = { estimateGas: { test: async () => 2 } } as any;

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ contract }) => useContractEstimateGasSWR({ method: 'test', contract }),
      { initialProps: { contract: contractFirst } },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(1);

    act(() => rerender({ contract: contractSecond }));

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(2);
  });
});
