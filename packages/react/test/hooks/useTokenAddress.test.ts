import { renderHook } from '@testing-library/react-hooks';
import { TOKENS } from '@lido-sdk/constants';
import { ProviderWrapper } from './testUtils';
import { useTokenAddress } from '../../src/hooks/useTokenAddress';

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
