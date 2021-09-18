jest.mock('@lido-sdk/contracts');

import { renderHook } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from './testUtils';
import { useDecimals } from '../../src/hooks/useDecimals';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

describe('useDecimals', () => {
  afterEach(() => {
    mockGetter.mockReset();
  });

  test('should fetch data', async () => {
    const expected = 1;
    const wrapper = ProviderWrapper;

    mockGetter.mockReturnValue({ decimals: async () => expected } as any);
    const { result, waitForNextUpdate } = renderHook(
      () => useDecimals('token'),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toBe(expected);
  });
});
