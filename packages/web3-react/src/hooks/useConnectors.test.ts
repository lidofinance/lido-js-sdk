import { renderHook } from '@testing-library/react-hooks';
import { useConnectors } from './useConnectors';

describe('useConnectors', () => {
  test('should work correctly', async () => {
    const { result } = renderHook(() => useConnectors());

    expect(result.error).toBeUndefined();
    expect(result.current).toBeInstanceOf(Object);
  });
});
