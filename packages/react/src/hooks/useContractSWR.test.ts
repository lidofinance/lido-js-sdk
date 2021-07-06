import { renderHook, act } from '@testing-library/react-hooks';
import { useContractSWR } from './useContractSWR';

describe('useContractSWR', () => {
  test('should fetch data', async () => {
    const expected = 1;
    const contract = { test: async () => expected } as any;

    const { result, waitForNextUpdate } = renderHook(() =>
      useContractSWR({ method: 'test', contract }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should not fetch', async () => {
    const expected = 1;
    const mockMethod = jest.fn(() => expected);
    const contract = { test: mockMethod } as any;

    const { result } = renderHook(() =>
      useContractSWR({
        shouldFetch: false,
        method: 'test',
        contract,
      }),
    );

    expect(result.current.data).toBeUndefined();
    expect(mockMethod).toHaveBeenCalledTimes(0);
  });

  test('should update if contract is changed', async () => {
    const contractFirst = { test: async () => 1 } as any;
    const contractSecond = { test: async () => 2 } as any;

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ contract }) => useContractSWR({ method: 'test', contract }),
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

  test('should not update on rerender', async () => {
    const expected = 1;
    const mockMethod = jest.fn(() => expected);
    const contract = { test: mockMethod } as any;

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useContractSWR({ method: 'test', contract }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);

    act(() => rerender());

    expect(result.current.data).toBe(expected);
    expect(mockMethod).toHaveBeenCalledTimes(1);
  });
});
