import { renderHook, act } from '@testing-library/react-hooks';
import { useMountedState } from '../../src/hooks/useMountedState';

describe('useMountedState', () => {
  test('should use initial state', async () => {
    const expected = 1;
    const { result } = renderHook(() => useMountedState(expected));
    const [state] = result.current;

    expect(state).toBe(expected);
  });

  test('should update if initial state is changed', async () => {
    let initialState = 1;
    const { result, rerender } = renderHook(
      ({ initialState }) => useMountedState(initialState),
      { initialProps: { initialState } },
    );

    expect(result.current[0]).toBe(initialState);

    initialState = 2;
    rerender({ initialState });

    expect(result.current[0]).toBe(initialState);
  });

  test('should change state', async () => {
    const initialState = 1;
    const changedState = 2;
    const { result } = renderHook(() => useMountedState(initialState));

    const [, setState] = result.current;

    expect(result.current[0]).toBe(initialState);
    act(() => setState(changedState));
    expect(result.current[0]).toBe(changedState);
  });

  test('should not throw an error when calling setState on an unmounted component', async () => {
    const initialState = 1;
    const changedState = 2;
    const { result, unmount } = renderHook(() => useMountedState(initialState));

    const [, setState] = result.current;

    act(() => unmount());
    act(() => setState(changedState));

    expect(result.current[0]).toBe(initialState);
    expect(result.error).toBeUndefined();
  });
});
