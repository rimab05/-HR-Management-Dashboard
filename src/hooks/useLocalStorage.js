import { useEffect, useState } from 'react';

/**
 * useState that persists to localStorage.
 * Returns [value, setValue, error]. `error` is set when saved data was
 * unreadable (and was reset to the initial value) or when saving failed.
 */
export default function useLocalStorage(key, initialValue) {
  const [error, setError] = useState(null);

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Detect corrupted data once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) JSON.parse(raw);
    } catch {
      setError(`Saved data for "${key}" was unreadable and has been reset.`);
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setError('Could not save changes to your browser storage. It may be full or disabled.');
    }
  }, [key, value]);

  return [value, setValue, error];
}
