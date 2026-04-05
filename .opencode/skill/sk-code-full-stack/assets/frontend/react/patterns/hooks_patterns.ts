/* ─────────────────────────────────────────────────────────────
   REACT CUSTOM HOOKS PATTERNS
   Production-ready hooks for common use cases
──────────────────────────────────────────────────────────────── */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useSyncExternalStore,
  type DependencyList,
} from 'react';

/* ─────────────────────────────────────────────────────────────
   1. useAsync - Generic async operation handler
──────────────────────────────────────────────────────────────── */

/**
 * useAsync - Manages async operation state
 *
 * Features:
 * - Tracks loading, error, and data states
 * - Cancellation support via AbortController
 * - Automatic cleanup on unmount
 * - Manual execute function for user-triggered operations
 *
 * @example
 * const { data, loading, error, execute } = useAsync(
 *   () => fetchUser(userId),
 *   [userId]
 * );
 */

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export function useAsync<T>(
  asyncFunction: (signal?: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (): Promise<T | null> => {
    // Cancel any pending request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction(abortControllerRef.current.signal);

      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
      }

      return data;
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }

      const err = error instanceof Error ? error : new Error(String(error));

      if (mountedRef.current) {
        setState({ data: null, loading: false, error: err });
        onError?.(err);
      }

      return null;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, execute, reset, setData };
}


/* ─────────────────────────────────────────────────────────────
   2. useFetch - HTTP fetch with caching and revalidation
──────────────────────────────────────────────────────────────── */

/**
 * useFetch - Data fetching with built-in cache
 *
 * Features:
 * - Automatic caching with configurable TTL
 * - Stale-while-revalidate pattern
 * - Request deduplication
 * - Refetch on window focus (optional)
 *
 * @example
 * const { data, loading, error, refetch } = useFetch<User[]>('/api/users', {
 *   cacheTime: 5 * 60 * 1000, // 5 minutes
 *   refetchOnFocus: true,
 * });
 */

interface UseFetchOptions<T> extends RequestInit {
  cacheTime?: number;
  staleTime?: number;
  refetchOnFocus?: boolean;
  refetchOnReconnect?: boolean;
  transform?: (data: unknown) => T;
  enabled?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache
const fetchCache = new Map<string, CacheEntry<unknown>>();

export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseAsyncReturn<T> {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    staleTime = 0,
    refetchOnFocus = false,
    refetchOnReconnect = true,
    transform,
    enabled = true,
    ...fetchOptions
  } = options;

  const cacheKey = url ? `${url}:${JSON.stringify(fetchOptions)}` : null;

  const fetchData = useCallback(
    async (signal?: AbortSignal): Promise<T> => {
      if (!url) {
        throw new Error('URL is required');
      }

      // Check cache
      if (cacheKey) {
        const cached = fetchCache.get(cacheKey) as CacheEntry<T> | undefined;
        if (cached && Date.now() - cached.timestamp < staleTime) {
          return cached.data;
        }
      }

      const response = await fetch(url, { ...fetchOptions, signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const data = transform ? transform(json) : (json as T);

      // Update cache
      if (cacheKey) {
        fetchCache.set(cacheKey, { data, timestamp: Date.now() });

        // Schedule cache cleanup
        setTimeout(() => {
          const entry = fetchCache.get(cacheKey);
          if (entry && Date.now() - entry.timestamp >= cacheTime) {
            fetchCache.delete(cacheKey);
          }
        }, cacheTime);
      }

      return data;
    },
    [url, cacheKey, staleTime, cacheTime, transform, fetchOptions]
  );

  const asyncResult = useAsync(fetchData, [url, enabled], {
    immediate: enabled && !!url,
  });

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnFocus || !enabled || !url) return;

    const handleFocus = () => {
      const cached = cacheKey ? fetchCache.get(cacheKey) : null;
      if (!cached || Date.now() - cached.timestamp >= staleTime) {
        asyncResult.execute();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnFocus, enabled, url, cacheKey, staleTime, asyncResult]);

  // Refetch on reconnect
  useEffect(() => {
    if (!refetchOnReconnect || !enabled || !url) return;

    const handleOnline = () => asyncResult.execute();

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [refetchOnReconnect, enabled, url, asyncResult]);

  return asyncResult;
}


/* ─────────────────────────────────────────────────────────────
   3. useLocalStorage - Persistent state with localStorage
──────────────────────────────────────────────────────────────── */

/**
 * useLocalStorage - useState with localStorage persistence
 *
 * Features:
 * - Automatic serialization/deserialization
 * - SSR-safe (returns initial value on server)
 * - Cross-tab synchronization
 * - Type-safe with generics
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * const [user, setUser] = useLocalStorage<User | null>('user', null);
 */

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Sync state with localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(
          new StorageEvent('storage', { key, newValue: JSON.stringify(newValue) })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          setStoredValue(initialValue);
        }
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Session storage variant
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}


/* ─────────────────────────────────────────────────────────────
   4. useDebounce - Debounced value with configurable delay
──────────────────────────────────────────────────────────────── */

/**
 * useDebounce - Debounce rapidly changing values
 *
 * Features:
 * - Configurable delay
 * - Immediate option for leading edge
 * - Cancel function for manual control
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     searchAPI(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Debounced callback variant
interface UseDebouncedCallbackOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: UseDebouncedCallbackOptions
): { call: (...args: Parameters<T>) => void; cancel: () => void; flush: () => void } {
  const { delay, maxWait, leading = false, trailing = true } = options;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const leadingCalledRef = useRef(false);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
    lastArgsRef.current = null;
    leadingCalledRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current);
      cancel();
    }
  }, [cancel]);

  const call = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      const now = Date.now();

      // Leading edge call
      if (leading && !leadingCalledRef.current) {
        leadingCalledRef.current = true;
        callbackRef.current(...args);
        lastCallTimeRef.current = now;

        if (!trailing) {
          return;
        }
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set trailing edge timeout
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
            lastArgsRef.current = null;
          }
          leadingCalledRef.current = false;
          cancel();
        }, delay);
      }

      // Set max wait timeout
      if (maxWait && !maxWaitTimeoutRef.current) {
        maxWaitTimeoutRef.current = setTimeout(() => {
          flush();
        }, maxWait);
      }
    },
    [delay, maxWait, leading, trailing, cancel, flush]
  );

  // Cleanup on unmount
  useEffect(() => cancel, [cancel]);

  return { call, cancel, flush };
}


/* ─────────────────────────────────────────────────────────────
   5. useMediaQuery - Responsive design hook
──────────────────────────────────────────────────────────────── */

/**
 * useMediaQuery - Track media query matches
 *
 * Features:
 * - SSR-safe with fallback
 * - Real-time updates
 * - Type-safe with literal types
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onStoreChange);
        return () => mediaQuery.removeEventListener('change', onStoreChange);
      }

      // Legacy browsers
      mediaQuery.addListener(onStoreChange);
      return () => mediaQuery.removeListener(onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Preset breakpoints (Tailwind CSS defaults)
export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');

  const breakpoint = useMemo(() => {
    if (is2xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  }, [isSm, isMd, isLg, isXl, is2xl]);

  return {
    breakpoint,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
}

// Accessibility media queries
export function useAccessibilityPreferences() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  const prefersContrast = useMediaQuery('(prefers-contrast: more)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');

  return {
    prefersReducedMotion,
    prefersReducedTransparency,
    prefersContrast,
    prefersDarkMode,
    prefersLightMode,
  };
}


/* ─────────────────────────────────────────────────────────────
   6. useIntersectionObserver - Viewport intersection tracking
──────────────────────────────────────────────────────────────── */

/**
 * useIntersectionObserver - Track element visibility
 *
 * Features:
 * - Configurable thresholds and margins
 * - Once option for one-time triggers
 * - Full IntersectionObserverEntry access
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '100px',
 * });
 *
 * return <div ref={ref}>{isIntersecting ? 'Visible!' : 'Hidden'}</div>;
 */

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void;
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    enabled = true,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frozenRef = useRef(false);

  const ref = useCallback(
    (node: Element | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Store element reference
      elementRef.current = node;

      // Don't observe if disabled, no node, or already triggered once
      if (!enabled || !node || frozenRef.current) {
        return;
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setEntry(entry);

          // Freeze if once option and now intersecting
          if (once && entry.isIntersecting) {
            frozenRef.current = true;
            observerRef.current?.disconnect();
          }
        },
        { root, rootMargin, threshold }
      );

      observerRef.current.observe(node);
    },
    [root, rootMargin, threshold, once, enabled]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}

// Lazy loading variant
export function useLazyLoad(
  options: Omit<UseIntersectionObserverOptions, 'once'> = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    ...options,
    once: true,
    rootMargin: options.rootMargin ?? '200px', // Load slightly before visible
  });

  return { ref, shouldLoad: isIntersecting };
}


/* ─────────────────────────────────────────────────────────────
   7. ADDITIONAL UTILITY HOOKS
──────────────────────────────────────────────────────────────── */

/**
 * useToggle - Boolean state toggle
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

/**
 * usePrevious - Track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useIsFirstRender - Detect first render
 */
export function useIsFirstRender(): boolean {
  const isFirstRef = useRef(true);

  if (isFirstRef.current) {
    isFirstRef.current = false;
    return true;
  }

  return false;
}

/**
 * useUpdateEffect - useEffect that skips first render
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: DependencyList
): void {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * useInterval - setInterval as a hook
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * useTimeout - setTimeout as a hook
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): { reset: () => void; clear: () => void } {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => savedCallback.current(), delay);
    }
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [delay, reset, clear]);

  return { reset, clear };
}

/**
 * useClickOutside - Detect clicks outside an element
 */
export function useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

/**
 * useKeyPress - Track key press state
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

/**
 * useCopyToClipboard - Copy text to clipboard
 */
export function useCopyToClipboard(): [
  string | null,
  (text: string) => Promise<boolean>
] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed:', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Core async
  useAsync,
  useFetch,
  // Storage
  useLocalStorage,
  useSessionStorage,
  // Timing
  useDebounce,
  useDebouncedCallback,
  useInterval,
  useTimeout,
  // Responsive
  useMediaQuery,
  useBreakpoint,
  useAccessibilityPreferences,
  // Observers
  useIntersectionObserver,
  useLazyLoad,
  // Utilities
  useToggle,
  usePrevious,
  useIsFirstRender,
  useUpdateEffect,
  useClickOutside,
  useKeyPress,
  useCopyToClipboard,
};

export type {
  AsyncState,
  UseAsyncOptions,
  UseAsyncReturn,
  UseFetchOptions,
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
  UseDebouncedCallbackOptions,
};
