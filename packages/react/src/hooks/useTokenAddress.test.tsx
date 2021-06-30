import { renderHook } from '@testing-library/react-hooks';
import { TOKENS } from '@lido-sdk/constants';
import { useTokenAddress } from './useTokenAddress';
import { ProviderWrapper } from './testUtils';

describe('useTokenAddress', () => {
  test('should return address', async () => {
    const wrapper = ProviderWrapper;
    const { result } = renderHook(() => useTokenAddress(TOKENS.STETH), {
      wrapper,
    });

    expect(typeof result.current).toBe('string');
    expect(result.current).toBeTruthy();
  });
});
