jest.mock('@lido-sdk/contracts');
jest.mock('./useAllowance');

import { FC } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useApprove } from './useApprove';
import { useAllowance } from './useAllowance';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from './testUtils';
import { BigNumber } from 'ethers';
import { Zero } from '@ethersproject/constants';

const mockUseAllowance = useAllowance as jest.MockedFunction<
  typeof useAllowance
>;
const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

const common = {
  loading: false,
  initialLoading: false,
  error: undefined,
  mutate: async () => void 0,
  update: async () => void 0,
};

describe('useApprove', () => {
  const allowance = BigNumber.from(1);
  const providerWeb3 = { getSigner: () => void 0 } as any;

  beforeEach(() => {
    mockUseAllowance.mockReturnValue({ data: allowance, ...common });
    mockGetter.mockReturnValue({
      approve: async () => ({
        wait: async () => void 0,
      }),
    } as any);
  });

  afterEach(() => {
    mockUseAllowance.mockReset();
    mockGetter.mockReset();
  });

  test('should return allowance', async () => {
    const { result } = renderHook(() => useApprove(Zero, 'token', 'spender'));
    expect(result.current.allowance).toBe(allowance);
  });

  test('should need approve', async () => {
    const { result } = renderHook(() =>
      useApprove(allowance.add(1), 'token', 'spender'),
    );
    expect(result.current.needsApprove).toBe(true);
  });

  test('should not need approve', async () => {
    [Zero, allowance.sub(1), allowance].forEach((amount) => {
      const { result } = renderHook(() =>
        useApprove(amount, 'token', 'spender'),
      );
      expect(result.current.needsApprove).toBe(false);
    });
  });

  test('should set approving', async () => {
    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={providerWeb3} {...props} />
    );

    const { result } = renderHook(() => useApprove(Zero, 'token', 'spender'), {
      wrapper,
    });

    expect(result.current.approving).toBe(false);
    const approve = act(() => result.current.approve());
    expect(result.current.approving).toBe(true);
    await approve;
    expect(result.current.approving).toBe(false);
  });

  test('should catch an error', async () => {
    mockGetter.mockReturnValue({ approve: async () => void 0 } as any);

    const mockOnError = jest.fn(() => void 0);
    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerWeb3={providerWeb3}
        onError={mockOnError}
        {...props}
      />
    );

    const { result } = renderHook(() => useApprove(Zero, 'token', 'spender'), {
      wrapper,
    });

    await act(() => result.current.approve());
    expect(mockOnError).toHaveBeenCalledTimes(1);
  });

  test('should inherit allowance errors', async () => {
    mockUseAllowance.mockReturnValue({ error: new Error() } as any);
    const { result } = renderHook(() => useApprove(Zero, 'token', 'spender'));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test('should inherit allowance loading', async () => {
    mockUseAllowance.mockReturnValue({ loading: true } as any);
    const { result } = renderHook(() => useApprove(Zero, 'token', 'spender'));
    expect(result.current.loading).toBe(true);
  });
});
