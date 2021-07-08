import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectorStorage } from './useConnectorStorage';

describe('useConnectorStorage', () => {
  test('should work correctly', async () => {
    const { result } = renderHook(() => useConnectorStorage());
    const [, setState] = result.current;

    expect(result.current[0]).toBe(null);
    act(() => setState('injected'));
    expect(result.current[0]).toBe('injected');
  });
});
