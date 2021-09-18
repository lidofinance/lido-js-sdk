jest.mock('@lido-sdk/contracts');

import { FC } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from './testUtils';
import { useTokenToWallet } from '../../src/hooks/useTokenToWallet';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

describe('useTokenToWallet', () => {
  afterEach(() => {
    mockGetter.mockReset();
  });

  test('should work', async () => {
    const mockRequest = jest.fn(async () => true);
    const providerWeb3 = {
      provider: {
        request: mockRequest,
        isMetaMask: true,
      },
    } as any;

    mockGetter.mockReturnValue({
      symbol: async () => 'STETH',
      decimals: async () => 18,
    } as any);

    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={providerWeb3} {...props} />
    );
    const { result } = renderHook(() => useTokenToWallet('address'), {
      wrapper,
    });

    expect(result.current.addToken).toBeInstanceOf(Function);
    await act(async () => {
      const added = await result.current.addToken?.();
      expect(added).toBe(true);
    });
  });

  test('should call onError', async () => {
    const mockError = jest.fn(() => void 0);
    const providerWeb3 = {
      provider: {
        request: async () => true,
        isMetaMask: true,
      },
    } as any;

    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerWeb3={providerWeb3}
        onError={mockError}
        {...props}
      />
    );
    const { result } = renderHook(() => useTokenToWallet('address'), {
      wrapper,
    });

    await act(async () => {
      await result.current.addToken?.();
    });

    expect(mockError).toHaveBeenCalledTimes(1);
  });

  test('should return false in provider is not exist', async () => {
    const providerWeb3 = {
      provider: {
        isMetaMask: true,
      },
    } as any;

    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={providerWeb3} {...props} />
    );
    const { result } = renderHook(() => useTokenToWallet('address'), {
      wrapper,
    });

    await act(async () => {
      const added = await result.current.addToken?.();
      expect(added).toBe(false);
    });
  });

  test('should not return callback if it’s not metamask', async () => {
    const wrapper = ProviderWrapper;
    const { result } = renderHook(() => useTokenToWallet('address'), {
      wrapper,
    });

    expect(result.current.addToken).toBeUndefined();
  });
});
