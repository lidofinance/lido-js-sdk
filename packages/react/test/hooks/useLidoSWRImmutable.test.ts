import { renderHook } from '@testing-library/react-hooks';
import { act, fireEvent } from '@testing-library/react';
import { useLidoSWRImmutable } from '../../src/hooks/useLidoSWRImmutable';

import { ProviderWrapper as wrapper } from './testUtils';

describe('useLidoSWRImmutable', () => {
  test('should fetch data', async () => {
    const expected = 1;
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWRImmutable('/data', () => expected),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should not update data on focus', async () => {
    const fetcher = jest.fn(() => 1);
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWRImmutable('/focus', fetcher, { dedupingInterval: 0 }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(fetcher).toBeCalledTimes(1);

    act(() => {
      fireEvent.focus(window);
    });

    expect(fetcher).toBeCalledTimes(1);
  });

  test('should not update data on reconnect', async () => {
    const fetcher = jest.fn(() => 1);
    const { result, waitForNextUpdate } = renderHook(
      () => useLidoSWRImmutable('/reconnect', fetcher, { dedupingInterval: 0 }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(fetcher).toBeCalledTimes(1);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(fetcher).toBeCalledTimes(1);
  });
});
