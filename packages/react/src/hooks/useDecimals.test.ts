jest.mock('@lido-sdk/contracts');

import { renderHook, act } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useDecimals } from './useDecimals';
import { sleep, ProviderWrapper } from './testUtils';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

describe('useDecimals', () => {
  beforeEach(() => {
    mockGetter.mockReset();
  });

  test('should fetch data', async () => {
    const expected = 1;
    const wrapper = ProviderWrapper;

    mockGetter.mockReturnValue({ decimals: async () => expected } as any);
    const { result } = renderHook(() => useDecimals('token'), { wrapper });

    expect(result.current.data).toBeUndefined();
    await act(() => sleep(0));
    expect(result.current.data).toBe(expected);
  });
});
