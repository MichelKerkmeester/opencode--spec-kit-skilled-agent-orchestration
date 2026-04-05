// ───────────────────────────────────────────────────────────────
// PERFORMANCE PATTERNS - Throttle, Debounce & Observer Utilities
// ───────────────────────────────────────────────────────────────
// Production-validated TypeScript timing patterns for frontend
// performance optimization. Timing constants derived from
// production testing.
//
// KEY TIMING VALUES:
// - 64ms throttle for pointermove (~15 Hz, perceptually smooth)
// - 180ms form validation debounce (faster than typing, avoids lag)
// - 200-250ms resize debounce (avoid flicker)
// - 0.1 IntersectionObserver threshold (early animation preparation)
//
// BROWSER INSIGHT:
// - requestAnimationFrame auto-throttles to 1fps in background tabs
// - No need for manual visibility management in RAF loops
//
// Universal patterns that work across frontend stacks:
// - React, Vue, Svelte, Angular
// - Vanilla TypeScript/JavaScript
// - Web Components
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

/**
 * Throttled function interface
 */
export interface ThrottledFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancel any pending throttled execution */
  cancel: () => void;
  /** Reset throttle state without cancelling */
  reset: () => void;
}

/**
 * Debounced function interface
 */
export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancel any pending debounced execution */
  cancel: () => void;
  /** Immediately execute if pending */
  flush: () => ReturnType<T> | undefined;
  /** Check if there's a pending execution */
  pending: () => boolean;
}

/**
 * Debounce options
 */
export interface DebounceOptions {
  /** Execute on leading edge (default: false) */
  leading?: boolean;
  /** Execute on trailing edge (default: true) */
  trailing?: boolean;
}

/**
 * RAF loop controller interface
 */
export interface RAFLoopController {
  /** Start the animation loop */
  start: () => void;
  /** Stop the animation loop */
  stop: () => void;
  /** Check if loop is running */
  readonly running: boolean;
}

/**
 * Resize observer result
 */
export interface ResizeObserverResult {
  /** The observer instance */
  observer: ResizeObserver;
  /** Cleanup function */
  cleanup: () => void;
}

/**
 * Autoplay observer options
 */
export interface AutoplayObserverOptions {
  /** Callback when element becomes visible */
  onVisible?: (entry: IntersectionObserverEntry) => void;
  /** Callback when element becomes hidden */
  onHidden?: (entry: IntersectionObserverEntry) => void;
  /** Intersection root (default: viewport) */
  root?: Element | null;
  /** Root margin (default: '0px') */
  rootMargin?: string;
}

/* ─────────────────────────────────────────────────────────────
   1. TIMING CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Throttle timing constants (milliseconds)
 * Use for high-frequency events that need rate limiting
 */
export const THROTTLE_TIMING = {
  /** Pointer events (mousemove, touchmove) - ~15 Hz is perceptually smooth */
  POINTER: 64,
  /** Scroll events - balance between smoothness and performance */
  SCROLL: 16,
  /** Animation frame aligned (for RAF-like behavior without RAF) */
  FRAME: 16,
} as const;

/**
 * Debounce timing constants (milliseconds)
 * Use for events that should wait for user to stop
 */
export const DEBOUNCE_TIMING = {
  /** Search input - fast enough for type-ahead, slow enough to avoid spam */
  SEARCH: 100,
  /** Form field validation - faster than average typing speed */
  VALIDATION: 180,
  /** Window resize - avoid layout thrashing */
  RESIZE: 200,
  /** Network requests - prevent duplicate API calls */
  NETWORK: 250,
  /** Save drafts - user pause detection */
  AUTOSAVE: 1000,
} as const;

/**
 * IntersectionObserver threshold constants
 * Use for visibility-based triggers
 */
export const OBSERVER_THRESHOLD = {
  /** Animation preparation - early enough to start animations */
  ANIMATION: 0.1,
  /** Lazy loading - trigger just before element enters viewport */
  LAZY_LOAD: 0,
  /** Full visibility tracking - trigger at 25% intervals */
  PROGRESSIVE: [0, 0.25, 0.5, 0.75, 1] as const,
  /** Video autoplay - trigger when mostly visible */
  VIDEO: 0.5,
} as const;

/* ─────────────────────────────────────────────────────────────
   2. THROTTLE FUNCTION
──────────────────────────────────────────────────────────────── */

/**
 * Throttle a function to run at most once per interval
 * Use for: pointermove, scroll, resize (high-frequency events)
 *
 * @param func - Function to throttle
 * @param wait - Minimum interval between calls (default: 64ms for ~15 Hz)
 * @returns Throttled function with cancel method
 *
 * @example
 * // Throttle pointermove to 64ms (~15 Hz)
 * const handleMove = throttle((e: PointerEvent) => {
 *   updateCursorPosition(e.clientX, e.clientY);
 * });
 * element.addEventListener('pointermove', handleMove);
 *
 * // Clean up
 * element.removeEventListener('pointermove', handleMove);
 * handleMove.cancel();
 *
 * @example
 * // React: Throttled scroll handler
 * const handleScroll = useMemo(
 *   () => throttle(() => updateScrollPosition(), THROTTLE_TIMING.SCROLL),
 *   []
 * );
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => {
 *     window.removeEventListener('scroll', handleScroll);
 *     handleScroll.cancel();
 *   };
 * }, [handleScroll]);
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = THROTTLE_TIMING.POINTER
): ThrottledFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let cancelled = false;

  function throttled(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (cancelled) return undefined;

    const now = Date.now();
    const remaining = wait - (now - lastExecTime);

    if (remaining <= 0 || remaining > wait) {
      // Enough time has passed, execute immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastExecTime = now;
      return func.apply(this, args) as ReturnType<T>;
    } else if (!timeoutId) {
      // Schedule execution for the remaining time
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, remaining);
    }

    return undefined;
  }

  throttled.cancel = function (): void {
    cancelled = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastExecTime = 0;
  };

  throttled.reset = function (): void {
    lastExecTime = 0;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    cancelled = false;
  };

  return throttled;
}

/**
 * Throttle with leading edge only (immediate execution, then wait)
 *
 * @example
 * // Click handler that fires immediately but prevents rapid clicks
 * const handleClick = throttleLeading(() => submitForm(), 1000);
 */
export function throttleLeading<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ThrottledFunction<T> {
  let lastExecTime = 0;
  let cancelled = false;

  function throttled(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (cancelled) return undefined;

    const now = Date.now();
    if (now - lastExecTime >= wait) {
      lastExecTime = now;
      return func.apply(this, args) as ReturnType<T>;
    }

    return undefined;
  }

  throttled.cancel = function (): void {
    cancelled = true;
    lastExecTime = 0;
  };

  throttled.reset = function (): void {
    lastExecTime = 0;
    cancelled = false;
  };

  return throttled;
}

/* ─────────────────────────────────────────────────────────────
   3. DEBOUNCE FUNCTION
──────────────────────────────────────────────────────────────── */

/**
 * Debounce a function to delay execution until after wait period
 * Use for: search input, form validation, resize handlers
 *
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds (default: 180ms for validation)
 * @param options - Configuration options
 * @returns Debounced function with cancel and flush methods
 *
 * @example
 * // Form validation debounce (180ms)
 * const validateField = debounce((value: string) => {
 *   const isValid = checkEmail(value);
 *   showValidationState(isValid);
 * }, DEBOUNCE_TIMING.VALIDATION);
 *
 * input.addEventListener('input', (e) => validateField(e.target.value));
 *
 * @example
 * // Search with leading edge (immediate first call)
 * const search = debounce(queryApi, DEBOUNCE_TIMING.SEARCH, { leading: true });
 *
 * @example
 * // React: Debounced search input
 * const debouncedSearch = useMemo(
 *   () => debounce((query: string) => fetchResults(query), DEBOUNCE_TIMING.SEARCH),
 *   []
 * );
 *
 * const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
 *   debouncedSearch(e.target.value);
 * };
 *
 * useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = DEBOUNCE_TIMING.VALIDATION,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;
  let lastCallTime = 0;
  let lastInvokeTime = 0;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs!;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args) as ReturnType<T>;
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    return wait - timeSinceLastCall;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timeoutId = null;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return result;
  }

  function debounced(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
    }

    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = function (): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastThis = null;
    lastCallTime = 0;
    timeoutId = null;
  };

  debounced.flush = function (): ReturnType<T> | undefined {
    if (timeoutId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };

  debounced.pending = function (): boolean {
    return timeoutId !== null;
  };

  return debounced;
}

/**
 * Debounce with immediate execution on first call
 * Shorthand for debounce with leading: true
 *
 * @example
 * const handleClick = debounceImmediate(() => trackClick(), 500);
 */
export function debounceImmediate<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  return debounce(func, wait, { leading: true, trailing: false });
}

/* ─────────────────────────────────────────────────────────────
   4. INTERSECTION OBSERVER UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create an IntersectionObserver for animation/autoplay visibility control
 * Uses 0.1 threshold - early enough for animation preparation
 *
 * @param options - Configuration options
 * @returns IntersectionObserver instance
 *
 * @example
 * // Video autoplay control
 * const observer = observeAutoplay({
 *   onVisible: (entry) => (entry.target as HTMLVideoElement).play(),
 *   onHidden: (entry) => (entry.target as HTMLVideoElement).pause(),
 * });
 *
 * document.querySelectorAll('video[autoplay]').forEach(v => observer.observe(v));
 *
 * @example
 * // Swiper pagination control
 * const observer = observeAutoplay({
 *   onVisible: (entry) => {
 *     const swiper = (entry.target as any).swiper;
 *     swiper?.autoplay?.start();
 *   },
 *   onHidden: (entry) => {
 *     const swiper = (entry.target as any).swiper;
 *     swiper?.autoplay?.stop();
 *   },
 * });
 *
 * @example
 * // React: Video autoplay hook
 * useEffect(() => {
 *   if (!videoRef.current) return;
 *
 *   const observer = observeAutoplay({
 *     onVisible: () => videoRef.current?.play(),
 *     onHidden: () => videoRef.current?.pause(),
 *   });
 *
 *   observer.observe(videoRef.current);
 *   return () => observer.disconnect();
 * }, []);
 */
export function observeAutoplay(options: AutoplayObserverOptions = {}): IntersectionObserver {
  const {
    onVisible = () => {},
    onHidden = () => {},
    root = null,
    rootMargin = '0px',
  } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= OBSERVER_THRESHOLD.ANIMATION) {
          onVisible(entry);
        } else if (!entry.isIntersecting) {
          onHidden(entry);
        }
      });
    },
    {
      root,
      rootMargin,
      threshold: [0, OBSERVER_THRESHOLD.ANIMATION],
    }
  );
}

/**
 * Create an IntersectionObserver with progressive visibility tracking
 * Reports visibility percentage at 25% intervals
 *
 * @param callback - Called with entry and visibility percentage (0-100)
 * @param options - IntersectionObserver options
 * @returns IntersectionObserver instance
 *
 * @example
 * // Parallax effect based on visibility
 * const observer = observeProgressiveVisibility((entry, percent) => {
 *   entry.target.style.setProperty('--visibility', String(percent));
 *   entry.target.style.transform = `translateY(${(100 - percent) * 0.5}px)`;
 * });
 *
 * @example
 * // Analytics: Track scroll depth
 * const observer = observeProgressiveVisibility((entry, percent) => {
 *   if (percent >= 50 && !entry.target.dataset.tracked50) {
 *     analytics.track('section_50_visible', { id: entry.target.id });
 *     entry.target.dataset.tracked50 = 'true';
 *   }
 * });
 */
export function observeProgressiveVisibility(
  callback: (entry: IntersectionObserverEntry, percent: number) => void,
  options: { root?: Element | null; rootMargin?: string } = {}
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const percent = Math.round(entry.intersectionRatio * 100);
        callback(entry, percent);
      });
    },
    {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: [...OBSERVER_THRESHOLD.PROGRESSIVE],
    }
  );
}

/**
 * Create a one-time visibility observer
 * Automatically disconnects after callback fires
 *
 * @param callback - Called once when element becomes visible
 * @param options - IntersectionObserver options
 * @returns Function to observe an element
 *
 * @example
 * const observeOnce = createOnceObserver((element) => {
 *   element.classList.add('animate-in');
 * });
 *
 * document.querySelectorAll('.reveal').forEach(observeOnce);
 */
export function createOnceObserver(
  callback: (element: Element, entry: IntersectionObserverEntry) => void,
  options: { rootMargin?: string; threshold?: number } = {}
): (element: Element) => void {
  const { rootMargin = '0px', threshold = 0 } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          callback(entry.target, entry);
        }
      });
    },
    { rootMargin, threshold }
  );

  return (element: Element) => observer.observe(element);
}

/* ─────────────────────────────────────────────────────────────
   5. RESIZE OBSERVER UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create a ResizeObserver with debounced callback
 * Uses 200ms debounce to avoid layout thrashing during resize
 *
 * @param callback - Callback receiving resize entries
 * @param wait - Debounce wait time (default: 200ms)
 * @returns Object with observer and cleanup function
 *
 * @example
 * const { observer, cleanup } = observeResize((entries) => {
 *   entries.forEach(entry => {
 *     const { width, height } = entry.contentRect;
 *     recalculateLayout(width, height);
 *   });
 * });
 *
 * observer.observe(container);
 *
 * // On cleanup
 * cleanup();
 *
 * @example
 * // React: Responsive component
 * useEffect(() => {
 *   if (!containerRef.current) return;
 *
 *   const { observer, cleanup } = observeResize((entries) => {
 *     const { width } = entries[0].contentRect;
 *     setColumns(width > 768 ? 3 : 1);
 *   });
 *
 *   observer.observe(containerRef.current);
 *   return cleanup;
 * }, []);
 */
export function observeResize(
  callback: (entries: ResizeObserverEntry[]) => void,
  wait: number = DEBOUNCE_TIMING.RESIZE
): ResizeObserverResult {
  const debouncedCallback = debounce(callback, wait);
  const observer = new ResizeObserver(debouncedCallback);

  return {
    observer,
    cleanup: () => {
      debouncedCallback.cancel();
      observer.disconnect();
    },
  };
}

/**
 * Create a ResizeObserver that only fires on dimension changes
 * Filters out entries where size hasn't actually changed
 *
 * @example
 * const { observer, cleanup } = observeResizeChanges((entries) => {
 *   // Only called when dimensions actually change
 *   entries.forEach(entry => console.log(entry.contentRect));
 * });
 */
export function observeResizeChanges(
  callback: (entries: ResizeObserverEntry[]) => void,
  wait: number = DEBOUNCE_TIMING.RESIZE
): ResizeObserverResult {
  const sizes = new WeakMap<Element, { width: number; height: number }>();

  const filteredCallback = (entries: ResizeObserverEntry[]) => {
    const changedEntries = entries.filter((entry) => {
      const { width, height } = entry.contentRect;
      const prev = sizes.get(entry.target);

      if (!prev || prev.width !== width || prev.height !== height) {
        sizes.set(entry.target, { width, height });
        return true;
      }
      return false;
    });

    if (changedEntries.length > 0) {
      callback(changedEntries);
    }
  };

  return observeResize(filteredCallback, wait);
}

/* ─────────────────────────────────────────────────────────────
   6. RAF UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create a throttled requestAnimationFrame loop
 * Combines RAF's native ~16ms timing with optional throttling
 *
 * BROWSER INSIGHT: RAF auto-throttles to ~1fps in background tabs
 * No manual visibility management needed for performance
 *
 * @param callback - Animation callback receiving timestamp
 * @param throttleMs - Additional throttle (0 = RAF native timing)
 * @returns Controller with start, stop, and running state
 *
 * @example
 * // Standard animation loop (RAF native ~60fps)
 * const loop = createRAFLoop((timestamp) => {
 *   updateAnimation(timestamp);
 * });
 *
 * loop.start();
 * // Later...
 * loop.stop();
 *
 * @example
 * // Throttled to ~15fps for less critical animations
 * const loop = createRAFLoop(updateParticles, 64);
 *
 * @example
 * // React: Animation loop hook pattern
 * useEffect(() => {
 *   const loop = createRAFLoop((timestamp) => {
 *     animationRef.current?.update(timestamp);
 *   });
 *
 *   loop.start();
 *   return () => loop.stop();
 * }, []);
 */
export function createRAFLoop(
  callback: (timestamp: DOMHighResTimeStamp) => void,
  throttleMs: number = 0
): RAFLoopController {
  let rafId: number | null = null;
  let running = false;
  let lastTime = 0;

  function tick(timestamp: DOMHighResTimeStamp): void {
    if (!running) return;

    if (throttleMs > 0) {
      const elapsed = timestamp - lastTime;
      if (elapsed < throttleMs) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      lastTime = timestamp;
    }

    callback(timestamp);
    rafId = requestAnimationFrame(tick);
  }

  return {
    start(): void {
      if (running) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(tick);
    },
    stop(): void {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    get running(): boolean {
      return running;
    },
  };
}

/**
 * Execute function on next animation frame
 *
 * @param fn - Function to execute
 * @returns Promise resolving with function result
 *
 * @example
 * await nextFrame(() => {
 *   element.classList.add('visible');
 * });
 */
export function nextFrame<T>(fn?: () => T): Promise<T | DOMHighResTimeStamp> {
  return new Promise((resolve) => {
    requestAnimationFrame((timestamp) => {
      resolve(fn ? fn() : timestamp);
    });
  });
}

/**
 * Wait for multiple animation frames
 * Useful for ensuring DOM updates are complete
 *
 * @param count - Number of frames to wait (default: 2)
 * @returns Promise resolving after specified frames
 *
 * @example
 * // Wait for browser to complete layout
 * await waitFrames(2);
 * measureLayout();
 */
export function waitFrames(count: number = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    function frame(): void {
      remaining--;
      if (remaining <= 0) {
        resolve();
      } else {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  });
}

/**
 * Batch DOM reads and writes using RAF
 * Prevents layout thrashing by separating reads from writes
 *
 * @example
 * // Without batching (causes layout thrashing)
 * elements.forEach(el => {
 *   const height = el.offsetHeight; // Read
 *   el.style.width = height + 'px'; // Write
 * });
 *
 * // With batching (single layout calculation)
 * const heights = await batchRead(() =>
 *   elements.map(el => el.offsetHeight)
 * );
 *
 * await batchWrite(() => {
 *   elements.forEach((el, i) => {
 *     el.style.width = heights[i] + 'px';
 *   });
 * });
 */
export function batchRead<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(fn());
    });
  });
}

export function batchWrite<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve(fn());
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. MEMORY-EFFICIENT PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Create a WeakMap-based cache for DOM elements
 * Automatically garbage collects when elements are removed
 *
 * @example
 * const elementCache = createElementCache<{ height: number }>();
 *
 * function getHeight(element: Element): number {
 *   let cached = elementCache.get(element);
 *   if (!cached) {
 *     cached = { height: element.getBoundingClientRect().height };
 *     elementCache.set(element, cached);
 *   }
 *   return cached.height;
 * }
 */
export function createElementCache<T>(): {
  get: (element: Element) => T | undefined;
  set: (element: Element, value: T) => void;
  has: (element: Element) => boolean;
  delete: (element: Element) => boolean;
} {
  const cache = new WeakMap<Element, T>();

  return {
    get: (element) => cache.get(element),
    set: (element, value) => cache.set(element, value),
    has: (element) => cache.has(element),
    delete: (element) => cache.delete(element),
  };
}

/**
 * Create a LRU (Least Recently Used) cache
 * Limits memory usage by evicting oldest entries
 *
 * @param maxSize - Maximum number of entries
 * @returns Cache object with get/set methods
 *
 * @example
 * const cache = createLRUCache<string, object>(100);
 *
 * cache.set('key1', { data: 'value' });
 * const value = cache.get('key1');
 */
export function createLRUCache<K, V>(
  maxSize: number
): {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  has: (key: K) => boolean;
  delete: (key: K) => boolean;
  clear: () => void;
  readonly size: number;
} {
  const cache = new Map<K, V>();

  return {
    get(key: K): V | undefined {
      if (!cache.has(key)) return undefined;

      // Move to end (most recently used)
      const value = cache.get(key)!;
      cache.delete(key);
      cache.set(key, value);
      return value;
    },

    set(key: K, value: V): void {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // Delete oldest (first) entry
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, value);
    },

    has(key: K): boolean {
      return cache.has(key);
    },

    delete(key: K): boolean {
      return cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    get size(): number {
      return cache.size;
    },
  };
}

/**
 * Pool of reusable objects to reduce garbage collection
 *
 * @param factory - Function to create new objects
 * @param reset - Function to reset object for reuse
 * @param initialSize - Initial pool size
 * @returns Pool with acquire/release methods
 *
 * @example
 * const vectorPool = createObjectPool(
 *   () => ({ x: 0, y: 0 }),
 *   (v) => { v.x = 0; v.y = 0; },
 *   10
 * );
 *
 * const v = vectorPool.acquire();
 * v.x = 100;
 * v.y = 200;
 * // Use vector...
 * vectorPool.release(v);
 */
export function createObjectPool<T>(
  factory: () => T,
  reset: (obj: T) => void,
  initialSize: number = 10
): {
  acquire: () => T;
  release: (obj: T) => void;
  readonly size: number;
  readonly available: number;
} {
  const pool: T[] = [];

  // Pre-populate pool
  for (let i = 0; i < initialSize; i++) {
    pool.push(factory());
  }

  return {
    acquire(): T {
      if (pool.length > 0) {
        return pool.pop()!;
      }
      return factory();
    },

    release(obj: T): void {
      reset(obj);
      pool.push(obj);
    },

    get size(): number {
      return pool.length + initialSize;
    },

    get available(): number {
      return pool.length;
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   8. IDLE CALLBACK UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Execute function when browser is idle
 * Falls back to setTimeout for browsers without requestIdleCallback
 *
 * @param callback - Function to execute
 * @param options - Idle callback options
 * @returns Function to cancel
 *
 * @example
 * // Defer non-critical work
 * const cancel = whenIdle(() => {
 *   analytics.processQueue();
 * });
 *
 * // Cancel if needed
 * cancel();
 */
export function whenIdle(
  callback: () => void,
  options: { timeout?: number } = {}
): () => void {
  const { timeout = 5000 } = options;

  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(callback, { timeout });
    return () => cancelIdleCallback(id);
  }

  // Fallback for Safari
  const id = setTimeout(callback, 1);
  return () => clearTimeout(id);
}

/**
 * Execute tasks in chunks during idle time
 * Useful for processing large arrays without blocking UI
 *
 * @param items - Items to process
 * @param processor - Function to process each item
 * @param options - Configuration options
 * @returns Promise resolving when all items processed
 *
 * @example
 * // Process large dataset without blocking
 * await processInChunks(
 *   largeArray,
 *   (item) => expensiveOperation(item),
 *   { chunkSize: 10, timeout: 50 }
 * );
 */
export async function processInChunks<T>(
  items: T[],
  processor: (item: T, index: number) => void,
  options: { chunkSize?: number; timeout?: number } = {}
): Promise<void> {
  const { chunkSize = 5, timeout = 50 } = options;

  return new Promise((resolve) => {
    let index = 0;

    function processChunk(): void {
      const deadline = Date.now() + timeout;

      while (index < items.length && Date.now() < deadline) {
        processor(items[index], index);
        index++;

        if (index % chunkSize === 0) {
          break;
        }
      }

      if (index < items.length) {
        whenIdle(processChunk, { timeout });
      } else {
        resolve();
      }
    }

    whenIdle(processChunk, { timeout });
  });
}
