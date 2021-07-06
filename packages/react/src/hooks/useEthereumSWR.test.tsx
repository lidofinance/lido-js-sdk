import { renderHook, act } from '@testing-library/react-hooks';
import { useEthereumSWR } from './useEthereumSWR';
import { ProviderWrapper } from './testUtils';
import { FC } from 'react';

describe('useEthereumSWR', () => {
  test('should fetch data', async () => {
    const expected = 1;
    const providerRpc = { getGasPrice: async () => expected } as any;

    const { result, waitForNextUpdate } = renderHook(() =>
      useEthereumSWR({ method: 'getGasPrice', providerRpc }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should not fetch', async () => {
    const expected = 1;
    const mockMethod = jest.fn(() => expected);
    const providerRpc = { getGasPrice: mockMethod } as any;

    const { result } = renderHook(() =>
      useEthereumSWR({
        shouldFetch: false,
        method: 'getGasPrice',
        providerRpc,
      }),
    );

    expect(result.current.data).toBeUndefined();
    expect(mockMethod).toHaveBeenCalledTimes(0);
  });

  test('should update if provider is changed', async () => {
    const providerFirst = { getGasPrice: async () => 1 } as any;
    const providerSecond = { getGasPrice: async () => 2 } as any;

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ providerRpc }) =>
        useEthereumSWR({ method: 'getGasPrice', providerRpc }),
      { initialProps: { providerRpc: providerFirst } },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(1);

    act(() => rerender({ providerRpc: providerSecond }));

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(2);
  });

  test('should not update on rerender', async () => {
    const expected = 1;
    const mockMethod = jest.fn(() => expected);
    const providerRpc = { getGasPrice: mockMethod } as any;

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useEthereumSWR({ method: 'getGasPrice', providerRpc }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);

    act(() => rerender());

    expect(result.current.data).toBe(expected);
    expect(mockMethod).toHaveBeenCalledTimes(1);
  });

  test('should use providerRpc from SDK', async () => {
    const mockMethod = jest.fn(() => void 0);
    const providerRpc = { getGasPrice: mockMethod } as any;
    const wrapper: FC = (props) => (
      <ProviderWrapper providerRpc={providerRpc} {...props} />
    );
    renderHook(() => useEthereumSWR({ method: 'getGasPrice' }), { wrapper });

    expect(mockMethod).toHaveBeenCalledTimes(1);
  });
});
