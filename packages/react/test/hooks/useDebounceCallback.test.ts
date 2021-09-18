import { renderHook } from '@testing-library/react-hooks';
import { useDebounceCallback } from '../../src/hooks/useDebounceCallback';

describe('useDebounceCallback', () => {
  test('should return a function', async () => {
    const { result } = renderHook(() => useDebounceCallback(() => 1));
    expect(result.current).toBeInstanceOf(Function);
  });

  test('should be called', async () => {
    const expected = 1;
    const callback = jest.fn(() => expected);
    const { result, waitFor } = renderHook(() => useDebounceCallback(callback));

    result.current();
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
  });

  test('should group calls', async () => {
    const expected = 1;
    const callback = jest.fn(() => expected);
    const { result, waitFor } = renderHook(() => useDebounceCallback(callback));

    result.current();
    result.current();

    await expect(async () => {
      await waitFor(() => expect(callback).toHaveBeenCalledTimes(2), {
        timeout: 50,
      });
    }).rejects.toThrowError();
  });
});
