jest.mock('tiny-warning');

import warning from 'tiny-warning';
import { FC } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ProviderWrapper } from './testUtils';
import { useEthereumBalance } from '../../src/hooks/useEthereumBalance';

const mockWarning = warning as jest.MockedFunction<typeof warning>;

describe('useEthereumBalance', () => {
  afterEach(() => {
    mockWarning.mockReset();
  });

  test('should fetch data', async () => {
    const expected = 1;
    const mockGetBalance = jest.fn(() => expected);
    const mockOn = jest.fn(() => void 0);
    const mockOff = jest.fn(() => void 0);
    const providerRpc = { getBalance: mockGetBalance } as any;
    const providerWeb3 = { on: mockOn, off: mockOff } as any;

    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerRpc={providerRpc}
        providerWeb3={providerWeb3}
        {...props}
      />
    );
    const { result, waitForNextUpdate } = renderHook(
      () => useEthereumBalance('account'),
      {
        wrapper,
      },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should use account from provider if it’s not passed', async () => {
    const expected = 'sdk account';
    const mockGetBalance = jest.fn(() => expected);
    const providerRpc = { getBalance: mockGetBalance } as any;
    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerRpc={providerRpc}
        account={expected}
        {...props}
      />
    );
    renderHook(() => useEthereumBalance(), { wrapper });

    expect(mockGetBalance).toHaveBeenCalledTimes(1);
    expect(mockGetBalance).toHaveBeenCalledWith(expected, 'latest');
  });

  test('should catch a subscribe error', async () => {
    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerRpc={{} as any}
        providerWeb3={{} as any}
        {...props}
      />
    );
    renderHook(() => useEthereumBalance('account'), { wrapper });

    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
