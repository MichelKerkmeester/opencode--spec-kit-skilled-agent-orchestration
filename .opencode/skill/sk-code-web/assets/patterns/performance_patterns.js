/**
 * PERFORMANCE PATTERNS - THROTTLE, DEBOUNCE, AND OBSERVER UTILITIES
 *
 * Production-validated timing patterns for frontend performance optimization.
 * Timing constants derived from production testing (spec 019).
 *
 * Key timing values:
 * - 64ms throttle for pointermove (~15 Hz, perceptually smooth)
 * - 180ms form validation debounce (faster than typing, avoids lag)
 * - 200-250ms resize debounce (avoid flicker, cheaper than IntersectionObserver)
 * - 0.1 IntersectionObserver threshold (early enough for animation preparation)
 *
 * Browser insight:
 * - requestAnimationFrame auto-throttles to 1fps in background tabs
 * - No need for manual visibility management in RAF loops
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. TIMING CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Throttle timing constants (milliseconds)
 * Use for high-frequency events that need rate limiting
 */
const THROTTLE_TIMING = {
  /** Pointer events (mousemove, touchmove) - ~15 Hz is perceptually smooth */
  POINTER: 64,
  /** Scroll events - balance between smoothness and performance */
  SCROLL: 16,
};

/**
 * Debounce timing constants (milliseconds)
 * Use for events that should wait for user to stop
 */
const DEBOUNCE_TIMING = {
  /** Search input - fast enough for type-ahead, slow enough to avoid spam */
  SEARCH: 100,
  /** Form field validation - faster than average typing speed */
  VALIDATION: 180,
  /** Window resize - avoid layout thrashing */
  RESIZE: 200,
  /** Network requests - prevent duplicate API calls */
  NETWORK: 250,
};

/**
 * IntersectionObserver threshold constants
 * Use for visibility-based triggers
 */
const OBSERVER_THRESHOLD = {
  /** Animation preparation - early enough to start animations */
  ANIMATION: 0.1,
  /** Lazy loading - trigger just before element enters viewport */
  LAZY_LOAD: 0,
  /** Full visibility tracking - trigger at 25% intervals */
  PROGRESSIVE: [0, 0.25, 0.5, 0.75, 1],
};

/* ─────────────────────────────────────────────────────────────
   2. THROTTLE FUNCTION
──────────────────────────────────────────────────────────────── */

/**
 * Throttle a function to run at most once per interval
 * Use for: pointermove, scroll, resize (high-frequency events)
 *
 * @param {Function} func - Function to throttle
 * @param {number} [wait=64] - Minimum interval between calls (default: 64ms for ~15 Hz)
 * @returns {Function} Throttled function with cancel method
 *
 * @example
 * // Throttle pointermove to 64ms (~15 Hz)
 * const handle_move = throttle((e) => {
 *   update_cursor_position(e.clientX, e.clientY);
 * });
 * element.addEventListener('pointermove', handle_move);
 *
 * // Clean up
 * element.removeEventListener('pointermove', handle_move);
 * handle_move.cancel();
 */
function throttle(func, wait = THROTTLE_TIMING.POINTER) {
  let timeout_id = null;
  let last_exec_time = 0;
  let cancelled = false;

  function throttled(...args) {
    if (cancelled) return;

    const now = Date.now();
    const remaining = wait - (now - last_exec_time);

    if (remaining <= 0 || remaining > wait) {
      if (timeout_id) {
        clearTimeout(timeout_id);
        timeout_id = null;
      }
      last_exec_time = now;
      func.apply(this, args);
    } else if (!timeout_id) {
      timeout_id = setTimeout(() => {
        last_exec_time = Date.now();
        timeout_id = null;
        func.apply(this, args);
      }, remaining);
    }
  }

  /**
   * Cancel any pending throttled execution
   */
  throttled.cancel = function () {
    cancelled = true;
    if (timeout_id) {
      clearTimeout(timeout_id);
      timeout_id = null;
    }
    last_exec_time = 0;
  };

  /**
   * Reset throttle state without cancelling
   */
  throttled.reset = function () {
    last_exec_time = 0;
    if (timeout_id) {
      clearTimeout(timeout_id);
      timeout_id = null;
    }
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
 * @param {Function} func - Function to debounce
 * @param {number} [wait=180] - Delay in milliseconds (default: 180ms for validation)
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.leading=false] - Execute on leading edge
 * @param {boolean} [options.trailing=true] - Execute on trailing edge
 * @returns {Function} Debounced function with cancel and flush methods
 *
 * @example
 * // Form validation debounce (180ms)
 * const validate_field = debounce((value) => {
 *   const is_valid = check_email(value);
 *   show_validation_state(is_valid);
 * }, DEBOUNCE_TIMING.VALIDATION);
 *
 * input.addEventListener('input', (e) => validate_field(e.target.value));
 *
 * @example
 * // Search with leading edge (immediate first call)
 * const search = debounce(query_api, DEBOUNCE_TIMING.SEARCH, { leading: true });
 */
function debounce(func, wait = DEBOUNCE_TIMING.VALIDATION, options = {}) {
  const { leading = false, trailing = true } = options;

  let timeout_id = null;
  let last_args = null;
  let last_this = null;
  let result = undefined;
  let last_call_time = 0;
  let last_invoke_time = 0;

  function invoke_func(time) {
    const args = last_args;
    const this_arg = last_this;
    last_args = null;
    last_this = null;
    last_invoke_time = time;
    result = func.apply(this_arg, args);
    return result;
  }

  function leading_edge(time) {
    last_invoke_time = time;
    timeout_id = setTimeout(timer_expired, wait);
    return leading ? invoke_func(time) : result;
  }

  function remaining_wait(time) {
    const time_since_last_call = time - last_call_time;
    const time_since_last_invoke = time - last_invoke_time;
    const time_waiting = wait - time_since_last_call;

    return time_waiting;
  }

  function should_invoke(time) {
    const time_since_last_call = time - last_call_time;
    const time_since_last_invoke = time - last_invoke_time;

    return (
      last_call_time === 0 ||
      time_since_last_call >= wait ||
      time_since_last_call < 0 ||
      time_since_last_invoke >= wait
    );
  }

  function timer_expired() {
    const time = Date.now();
    if (should_invoke(time)) {
      return trailing_edge(time);
    }
    timeout_id = setTimeout(timer_expired, remaining_wait(time));
  }

  function trailing_edge(time) {
    timeout_id = null;
    if (trailing && last_args) {
      return invoke_func(time);
    }
    last_args = null;
    last_this = null;
    return result;
  }

  function debounced(...args) {
    const time = Date.now();
    const is_invoking = should_invoke(time);

    last_args = args;
    last_this = this;
    last_call_time = time;

    if (is_invoking) {
      if (timeout_id === null) {
        return leading_edge(time);
      }
    }

    if (timeout_id === null) {
      timeout_id = setTimeout(timer_expired, wait);
    }

    return result;
  }

  /**
   * Cancel any pending debounced execution
   */
  debounced.cancel = function () {
    if (timeout_id !== null) {
      clearTimeout(timeout_id);
    }
    last_invoke_time = 0;
    last_args = null;
    last_this = null;
    last_call_time = 0;
    timeout_id = null;
  };

  /**
   * Immediately execute the debounced function if pending
   */
  debounced.flush = function () {
    if (timeout_id === null) {
      return result;
    }
    return trailing_edge(Date.now());
  };

  /**
   * Check if there's a pending execution
   */
  debounced.pending = function () {
    return timeout_id !== null;
  };

  return debounced;
}

/* ─────────────────────────────────────────────────────────────
   4. INTERSECTION OBSERVER UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create an IntersectionObserver for animation/autoplay visibility control
 * Uses 0.1 threshold - early enough for animation preparation
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.on_visible - Callback when element becomes 10% visible
 * @param {Function} options.on_hidden - Callback when element becomes hidden
 * @param {Element|null} [options.root=null] - Intersection root (null = viewport)
 * @param {string} [options.root_margin='0px'] - Root margin
 * @returns {IntersectionObserver} Observer instance
 *
 * @example
 * // Video autoplay control
 * const observer = observe_autoplay({
 *   on_visible: (entry) => entry.target.play(),
 *   on_hidden: (entry) => entry.target.pause(),
 * });
 *
 * document.querySelectorAll('video[autoplay]').forEach(v => observer.observe(v));
 *
 * @example
 * // Swiper pagination control
 * const observer = observe_autoplay({
 *   on_visible: (entry) => entry.target.swiper?.autoplay?.start(),
 *   on_hidden: (entry) => entry.target.swiper?.autoplay?.stop(),
 * });
 */
function observe_autoplay(options = {}) {
  const {
    on_visible = () => {},
    on_hidden = () => {},
    root = null,
    root_margin = '0px',
  } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= OBSERVER_THRESHOLD.ANIMATION) {
          on_visible(entry);
        } else if (!entry.isIntersecting) {
          on_hidden(entry);
        }
      });
    },
    {
      root,
      rootMargin: root_margin,
      threshold: [0, OBSERVER_THRESHOLD.ANIMATION],
    }
  );
}

/**
 * Create an IntersectionObserver with multiple thresholds for progressive tracking
 * Useful for parallax effects or visibility percentage tracking
 *
 * @deprecated Since 2026-01-11. Browser RAF auto-throttling handles visibility-based
 * performance concerns. Use IntersectionObserver directly instead of this wrapper.
 *
 * Migration: Use IntersectionObserver directly with your desired thresholds.
 *
 * @example
 * // OLD (deprecated)
 * const observer = observe_visibility((entry, percent) => {
 *   entry.target.style.setProperty('--visibility', percent);
 * });
 * observer.observe(element);
 *
 * // NEW (recommended)
 * const observer = new IntersectionObserver(
 *   (entries) => {
 *     entries.forEach((entry) => {
 *       const percent = Math.round(entry.intersectionRatio * 100);
 *       entry.target.style.setProperty('--visibility', percent);
 *     });
 *   },
 *   { threshold: [0, 0.25, 0.5, 0.75, 1] }
 * );
 * observer.observe(element);
 *
 * @param {Function} callback - Callback receiving entry and visibility percentage
 * @param {Object} [options={}] - IntersectionObserver options
 * @returns {IntersectionObserver} Observer instance
 */
function observe_visibility(callback, options = {}) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const percent = Math.round(entry.intersectionRatio * 100);
        callback(entry, percent);
      });
    },
    {
      root: options.root || null,
      rootMargin: options.root_margin || '0px',
      threshold: options.threshold || OBSERVER_THRESHOLD.PROGRESSIVE,
    }
  );
}

/* ─────────────────────────────────────────────────────────────
   5. RESIZE OBSERVER UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create a ResizeObserver with debounced callback
 * Uses 200ms debounce to avoid layout thrashing during resize
 *
 * @param {Function} callback - Callback receiving resize entries
 * @param {number} [wait=200] - Debounce wait time (default: 200ms)
 * @returns {Object} Object with observer and cleanup function
 *
 * @example
 * const { observer, cleanup } = observe_resize((entries) => {
 *   entries.forEach(entry => {
 *     const { width, height } = entry.contentRect;
 *     recalculate_layout(width, height);
 *   });
 * });
 *
 * observer.observe(container);
 *
 * // On cleanup
 * cleanup();
 */
function observe_resize(callback, wait = DEBOUNCE_TIMING.RESIZE) {
  const debounced_callback = debounce(callback, wait);

  const observer = new ResizeObserver(debounced_callback);

  return {
    observer,
    cleanup: () => {
      debounced_callback.cancel();
      observer.disconnect();
    },
  };
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
 * @param {Function} callback - Animation callback
 * @param {number} [throttle_ms=0] - Additional throttle (0 = RAF native timing)
 * @returns {Object} Controller with start, stop, and running state
 *
 * @example
 * // Standard animation loop (RAF native ~60fps)
 * const loop = create_raf_loop((timestamp) => {
 *   update_animation(timestamp);
 * });
 *
 * loop.start();
 * // Later...
 * loop.stop();
 *
 * @example
 * // Throttled to ~15fps for less critical animations
 * const loop = create_raf_loop(update_particles, 64);
 */
function create_raf_loop(callback, throttle_ms = 0) {
  let raf_id = null;
  let running = false;
  let last_time = 0;

  function tick(timestamp) {
    if (!running) return;

    if (throttle_ms > 0) {
      const elapsed = timestamp - last_time;
      if (elapsed < throttle_ms) {
        raf_id = requestAnimationFrame(tick);
        return;
      }
      last_time = timestamp;
    }

    callback(timestamp);
    raf_id = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last_time = 0;
      raf_id = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (raf_id !== null) {
        cancelAnimationFrame(raf_id);
        raf_id = null;
      }
    },
    get running() {
      return running;
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

// Browser global export
if (typeof window !== 'undefined') {
  window.PerformancePatterns = {
    // Constants
    THROTTLE_TIMING,
    DEBOUNCE_TIMING,
    OBSERVER_THRESHOLD,
    // Functions
    throttle,
    debounce,
    observe_autoplay,
    observe_visibility,
    observe_resize,
    create_raf_loop,
  };
}

// Module export (ES6)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    THROTTLE_TIMING,
    DEBOUNCE_TIMING,
    OBSERVER_THRESHOLD,
    throttle,
    debounce,
    observe_autoplay,
    observe_visibility,
    observe_resize,
    create_raf_loop,
  };
}
