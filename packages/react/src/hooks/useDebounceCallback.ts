import { useCallback, useEffect, useRef } from 'react';

export const useDebounceCallback = (
  callback: () => unknown,
  timeout = 0,
): (() => void) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current != null) {
      clearTimeout(timer.current);
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return useCallback(() => {
    clearTimer();
    timer.current = setTimeout(callback, timeout);
  }, [callback, timeout, clearTimer]);
};
