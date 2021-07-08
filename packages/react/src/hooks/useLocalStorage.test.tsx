jest.mock('tiny-warning');

import { renderHook, act } from '@testing-library/react-hooks';
import { renderHook as renderHookOnServer } from '@testing-library/react-hooks/server';
import { useLocalStorage } from './useLocalStorage';
import warning from 'tiny-warning';

const mockWarning = warning as jest.MockedFunction<typeof warning>;
const lsSpy = jest.spyOn(window, 'localStorage', 'get');

beforeEach(() => {
  lsSpy.mockReturnValue({
    store: {},
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: any) {
      this.store[key] = String(value);
    },
  } as any);
});

afterEach(() => {
  mockWarning.mockReset();
  lsSpy.mockReset();
});

describe('useLocalStorage', () => {
  test('should use initial state', async () => {
    const expected = 1;
    const { result } = renderHook(() => useLocalStorage('key', expected));
    const [state] = result.current;

    expect(state).toBe(expected);
  });

  test('should use state from LS', async () => {
    const initial = 1;
    const another = 2;

    const first = renderHook(() => useLocalStorage('key', initial));
    act(() => first.result.current[1](another));

    const second = renderHook(() => useLocalStorage('key', initial));

    expect(initial).not.toBe(another);
    expect(second.result.current[0]).toBe(another);
  });

  test('should update if initial state is changed', async () => {
    let initialState = 1;
    const { result, rerender } = renderHook(
      ({ initialState }) => useLocalStorage('key', initialState),
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
    const { result } = renderHook(() => useLocalStorage('key', initialState));

    const [, setState] = result.current;

    expect(result.current[0]).toBe(initialState);
    act(() => setState(changedState));
    expect(result.current[0]).toBe(changedState);
  });

  test('should change state with passed function', async () => {
    const initialState = 1;
    const { result } = renderHook(() => useLocalStorage('key', initialState));

    const [, setState] = result.current;

    expect(result.current[0]).toBe(initialState);
    act(() => setState((initialState) => initialState + 1));
    expect(result.current[0]).toBe(initialState + 1);
  });

  test('should work with SSR', async () => {
    const expected = 1;
    const { result } = renderHookOnServer(() =>
      useLocalStorage('key', expected),
    );
    const [state] = result.current;

    expect(state).toBe(expected);
    expect(result.error).toBeUndefined();
  });

  test('should work without LS', async () => {
    lsSpy.mockReturnValue(undefined as any);

    const expected = 1;
    const changedState = 2;

    const { result } = renderHook(() => useLocalStorage('key', expected));
    const [state, setState] = result.current;

    expect(state).toBe(expected);
    act(() => setState(changedState));
    expect(result.current[0]).toBe(changedState);
  });
});
