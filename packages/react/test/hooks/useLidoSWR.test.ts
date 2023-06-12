import { renderHook, act } from '@testing-library/react-hooks';
import { useLidoSWR } from '../../src/hooks/useLidoSWR';

import { ProviderWrapper } from './testUtils';

describe('useLidoSWR', () => {
  const wrapper = ProviderWrapper;
  test('should fetch data', async () => {
    const expected = 1;
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWR('/data', () => expected),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should update data correctly', async () => {
    const expected = 1;
    const mockFetcher = jest.fn(() => expected);
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWR('/update', mockFetcher),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      await expect(result.current.update()).resolves.toBe(expected);
    });
    expect(result.current.data).toBe(expected);
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  test('should set loading', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWR('/loading', () => 1),
      { wrapper },
    );

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
  });

  test('should set initial loading', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWR('/initial', () => 1),
      { wrapper },
    );

    expect(result.current.initialLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.initialLoading).toBe(false);
  });

  test('should catch an error', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useLidoSWR('/error', async () => {
          throw new Error();
        }),
      { wrapper },
    );

    expect(result.current.error).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
