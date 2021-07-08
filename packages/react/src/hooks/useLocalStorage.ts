import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import warning from 'tiny-warning';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [storedValue: T, setValue: Dispatch<SetStateAction<T>>] => {
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      warning(
        typeof window === 'undefined',
        `Error reading localStorage key "${key}"`,
      );
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(readValue);

  const saveToStorage = useCallback(
    (newValue) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        warning(
          typeof window === 'undefined',
          `Error setting localStorage key "${key}"`,
        );
      }
    },
    [key],
  );

  const setValue = useCallback(
    (value) => {
      if (value instanceof Function) {
        setStoredValue((current) => {
          const newValue = value(current);
          saveToStorage(newValue);
          return newValue;
        });
      } else {
        saveToStorage(value);
        setStoredValue(value);
      }
    },
    [saveToStorage],
  );

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
};
