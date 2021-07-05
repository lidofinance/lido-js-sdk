jest.mock('@lido-sdk/contracts');
jest.mock('tiny-warning');

import { FC } from 'react';
import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useAllowance } from './useAllowance';
import { sleep, ProviderWrapper } from './testUtils';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;

describe('useAllowance', () => {
  beforeEach(() => {
    mockGetter.mockReset();
    mockWarning.mockReset();
  });

  test('should fetch data', async () => {
    const expected = 1;
    const wrapper = ProviderWrapper;

    mockGetter.mockReturnValue({ allowance: async () => expected } as any);
    const { result } = renderHook(
      () => useAllowance('token', 'spender', 'owner'),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(expected);
  });

  test('should use account from provider if it’s not passed', async () => {
    const expected = 'sdk account';
    const mockAllowance = jest.fn(() => void 0);
    mockGetter.mockReturnValue({ allowance: mockAllowance } as any);
    const wrapper: FC = (props) => (
      <ProviderWrapper account={expected} {...props} />
    );
    renderHook(() => useAllowance('token', 'spender'), { wrapper });

    expect(mockAllowance).toHaveBeenCalledTimes(1);
    expect(mockAllowance).toHaveBeenCalledWith(expected, 'spender');
  });

  test('should subscribe on events data', async () => {
    const expected = 1;
    const mockOn = jest.fn(() => void 0);
    const mockOff = jest.fn(() => void 0);
    const providerWeb3 = { on: mockOn, off: mockOff } as any;

    mockGetter.mockReturnValue({
      allowance: async () => expected,
      filters: {
        Transfer: () => void 0,
        Approval: () => void 0,
      },
    } as any);
    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={providerWeb3} {...props} />
    );
    const { unmount } = renderHook(
      () => useAllowance('token', 'spender', 'owner'),
      { wrapper },
    );

    expect(mockOn).toHaveBeenCalledTimes(2);
    act(() => unmount());
    expect(mockOff).toHaveBeenCalledTimes(2);
  });

  test('should catch a subscribe error', async () => {
    const expected = 1;
    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={{} as any} {...props} />
    );
    mockGetter.mockReturnValue({ allowance: async () => expected } as any);
    renderHook(() => useAllowance('token', 'spender', 'owner'), { wrapper });

    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
