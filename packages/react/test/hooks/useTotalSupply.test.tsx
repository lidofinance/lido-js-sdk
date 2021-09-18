jest.mock('@lido-sdk/contracts');
jest.mock('tiny-warning');

import warning from 'tiny-warning';
import { FC } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from './testUtils';
import { useTotalSupply } from '../../src/hooks/useTotalSupply';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;

describe('useTotalSupply', () => {
  afterEach(() => {
    mockGetter.mockReset();
    mockWarning.mockReset();
  });

  test('should fetch data', async () => {
    const expected = 1;
    const wrapper = ProviderWrapper;

    mockGetter.mockReturnValue({ totalSupply: async () => expected } as any);
    const { result, waitForNextUpdate } = renderHook(
      () => useTotalSupply('token'),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });

  test('should subscribe on events data', async () => {
    const expected = 1;
    const mockOn = jest.fn(() => void 0);
    const mockOff = jest.fn(() => void 0);
    const providerWeb3 = { on: mockOn, off: mockOff } as any;

    mockGetter.mockReturnValue({
      totalSupply: async () => expected,
      filters: { Transfer: () => void 0 },
    } as any);
    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={providerWeb3} {...props} />
    );
    const { unmount } = renderHook(() => useTotalSupply('token'), { wrapper });

    expect(mockOn).toHaveBeenCalledTimes(1);
    act(() => unmount());
    expect(mockOff).toHaveBeenCalledTimes(1);
  });

  test('should catch a subscribe error', async () => {
    const expected = 1;
    const wrapper: FC = (props) => (
      <ProviderWrapper providerWeb3={{} as any} {...props} />
    );
    mockGetter.mockReturnValue({ totalSupply: async () => expected } as any);
    renderHook(() => useTotalSupply('token'), { wrapper });

    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
