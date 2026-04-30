/**
 * LENIS SMOOTH SCROLL PATTERNS
 *
 * Production-tested patterns for Lenis smooth scroll integration.
 * Lenis is initialized globally by Webflow and exposed as `window.lenis`.
 *
 * Key integration points:
 * - Modals: stop/start scrolling when modal opens/closes
 * - Table of contents: scroll to anchor with offset
 * - Form submission: pause during async operations
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. SAFE LENIS ACCESS
──────────────────────────────────────────────────────────────── */

// Lenis may not be loaded yet or may be disabled on certain pages

/**
 * Get the global Lenis instance safely
 * 
 * @returns {object|null} Lenis instance or null if not available
 * 
 * @example
 * const lenis = get_lenis();
 * if (lenis) {
 *   lenis.scrollTo('#section');
 * }
 */
function get_lenis() {
  return window.lenis ?? null;
}

/**
 * Check if Lenis is available and has a specific method
 * 
 * @param {string} method - Method name to check
 * @returns {boolean} True if Lenis and method exist
 * 
 * @example
 * if (has_lenis_method('scrollTo')) {
 *   window.lenis.scrollTo(target);
 * }
 */
function has_lenis_method(method) {
  return Boolean(window.lenis && typeof window.lenis[method] === 'function');
}


/* ─────────────────────────────────────────────────────────────
   2. SCROLL TO ELEMENT
──────────────────────────────────────────────────────────────── */

/**
 * Scroll to an element with Lenis or native fallback
 * 
 * From table_of_content.js - handles anchor navigation with:
 * - Respects scroll-margin-top CSS property
 * - Supports immediate scroll for reduced motion
 * - Provides completion callback for focus management
 * 
 * @param {HTMLElement|string} target - Element or selector to scroll to
 * @param {object} options - Scroll options
 * @param {number} [options.offset=0] - Additional offset from target (negative = above)
 * @param {boolean} [options.immediate=false] - Skip animation (for reduced motion)
 * @param {Function} [options.on_complete] - Callback when scroll completes
 * @param {string} [options.behavior='smooth'] - Native fallback behavior
 * 
 * @example
 * // Basic usage
 * scroll_to_element('#section-1');
 * 
 * // With offset and callback
 * scroll_to_element(element, {
 *   offset: -100,  // 100px above the element
 *   on_complete: () => element.focus({ preventScroll: true })
 * });
 * 
 * // Respect reduced motion preference
 * const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 * scroll_to_element(target, { immediate: prefersReducedMotion });
 */
function scroll_to_element(target, options = {}) {
  const {
    offset = 0,
    immediate = false,
    on_complete = null,
    behavior = 'smooth',
  } = options;

  const element = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if (!element) {
    console.warn('[Lenis] scroll_to_element: target not found', target);
    return;
  }

  // Get scroll-margin-top from CSS (used for sticky header offset)
  const scroll_margin = parseInt(getComputedStyle(element).scrollMarginTop) || 0;
  const total_offset = offset - scroll_margin;

  // Use Lenis if available
  if (window.lenis) {
    window.lenis.scrollTo(element, {
      offset: total_offset,
      immediate: immediate,
      onComplete: on_complete,
    });
    return;
  }

  // Native fallback
  element.scrollIntoView({
    behavior: immediate ? 'auto' : behavior,
    block: 'start'
  });

  // Call completion callback (native doesn't have onComplete)
  if (on_complete) {
    // Estimate scroll duration for callback timing
    const duration = immediate ? 0 : 500;
    setTimeout(on_complete, duration);
  }
}


/* ─────────────────────────────────────────────────────────────
   3. SCROLL CONTROL (STOP/START)
──────────────────────────────────────────────────────────────── */

/**
 * Stop Lenis scrolling (for modals, overlays, etc.)
 * 
 * From modal_cookie_consent.js - stops scroll when modal opens
 * 
 * @example
 * function open_modal() {
 *   stop_scroll();
 *   modal.showModal();
 * }
 */
function stop_scroll() {
  if (window.lenis?.stop) {
    window.lenis.stop();
  }
}

/**
 * Resume Lenis scrolling
 * 
 * From modal_cookie_consent.js - resumes scroll when modal closes
 * 
 * @example
 * function close_modal() {
 *   modal.close();
 *   start_scroll();
 * }
 */
function start_scroll() {
  if (window.lenis?.start) {
    window.lenis.start();
  }
}

/**
 * Temporarily disable scroll during an async operation
 * 
 * From form_submission.js - pauses scroll during form submission
 * 
 * @param {Function} async_operation - Async function to run while scroll is paused
 * @returns {Promise<any>} Result of the async operation
 * 
 * @example
 * await with_scroll_paused(async () => {
 *   await submitForm(formData);
 *   await showSuccessAnimation();
 * });
 * // Scroll automatically resumes after
 */
async function with_scroll_paused(async_operation) {
  stop_scroll();
  try {
    return await async_operation();
  } finally {
    start_scroll();
  }
}


/* ─────────────────────────────────────────────────────────────
   4. SCROLL EVENT LISTENERS
──────────────────────────────────────────────────────────────── */

/**
 * Add a scroll listener to Lenis
 * 
 * @param {Function} callback - Called on each scroll frame
 * @returns {Function} Cleanup function to remove listener
 * 
 * @example
 * const cleanup = on_scroll(({ scroll, limit, velocity, direction, progress }) => {
 *   console.log('Scroll position:', scroll);
 *   console.log('Scroll direction:', direction); // 1 = down, -1 = up
 *   console.log('Scroll progress:', progress);   // 0 to 1
 * });
 * 
 * // Later: cleanup();
 */
function on_scroll(callback) {
  if (!window.lenis?.on) {
    // Fallback to native scroll event
    const handler = () => {
      callback({
        scroll: window.scrollY,
        limit: document.body.scrollHeight - window.innerHeight,
        velocity: 0,
        direction: 0,
        progress: window.scrollY / (document.body.scrollHeight - window.innerHeight),
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }

  window.lenis.on('scroll', callback);
  return () => window.lenis.off?.('scroll', callback);
}


/* ─────────────────────────────────────────────────────────────
   5. INTERSECTION OBSERVER COORDINATION
──────────────────────────────────────────────────────────────── */

// LENIS: Smooth scroll can affect IntersectionObserver timing

/**
 * Create IntersectionObserver that works well with Lenis
 * 
 * From table_of_content.js - TOC highlighting with Lenis coordination:
 * 1. Use event.stopImmediatePropagation() on anchor clicks to prevent
 *    Lenis's built-in anchor handler from also scrolling
 * 2. Use capture phase (true) to run before Lenis handlers
 * 3. Provide instant feedback before IO catches up
 * 
 * @param {Function} callback - IntersectionObserver callback
 * @param {object} options - IntersectionObserver options
 * @returns {IntersectionObserver} Configured observer
 * 
 * @example
 * const observer = create_lenis_aware_observer((entries) => {
 *   entries.forEach(entry => {
 *     if (entry.isIntersecting) {
 *       entry.target.classList.add('visible');
 *     }
 *   });
 * }, { threshold: 0.5 });
 */
function create_lenis_aware_observer(callback, options = {}) {
  // Lenis smooth scroll means elements cross thresholds slower
  // Consider using lower thresholds for earlier detection
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

/**
 * Handle anchor click with Lenis coordination
 * 
 * From table_of_content.js - prevents double-scroll from both
 * custom handler and Lenis's built-in anchor handling
 * 
 * @param {Event} event - Click event
 * @param {HTMLElement} target - Target element to scroll to
 * @param {object} options - Scroll options
 * 
 * @example
 * document.addEventListener('click', (event) => {
 *   const link = event.target.closest('a[href^="#"]');
 *   if (!link) return;
 *   
 *   const targetId = link.getAttribute('href').slice(1);
 *   const target = document.getElementById(targetId);
 *   if (!target) return;
 *   
 *   handle_anchor_click(event, target, {
 *     on_complete: () => {
 *       target.focus({ preventScroll: true });
 *       history.pushState(null, '', `#${targetId}`);
 *     }
 *   });
 * }, true);  // <-- capture phase is important!
 */
function handle_anchor_click(event, target, options = {}) {
  event.preventDefault();
  event.stopImmediatePropagation();  // Prevent Lenis's anchor handler

  scroll_to_element(target, options);
}


/* ─────────────────────────────────────────────────────────────
   6. CLEANUP PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Create a managed scroll handler with automatic cleanup
 * 
 * @param {Function} callback - Scroll callback
 * @returns {object} Object with start/stop/cleanup methods
 * 
 * @example
 * const scrollHandler = create_managed_scroll_handler((e) => {
 *   updateProgressBar(e.progress);
 * });
 * 
 * scrollHandler.start();
 * // ... later
 * scrollHandler.cleanup();
 */
function create_managed_scroll_handler(callback) {
  let cleanup_fn = null;
  let is_active = false;

  return {
    start() {
      if (is_active) return;
      is_active = true;
      cleanup_fn = on_scroll(callback);
    },

    stop() {
      if (!is_active) return;
      is_active = false;
      cleanup_fn?.();
      cleanup_fn = null;
    },

    cleanup() {
      this.stop();
    },

    get isActive() {
      return is_active;
    },
  };
}

/**
 * Batch cleanup for multiple scroll-related resources
 * 
 * @example
 * const state = {
 *   cleanups: [],
 * };
 * 
 * function init() {
 *   // Store all cleanup functions
 *   state.cleanups.push(on_scroll(handleScroll));
 *   state.cleanups.push(() => observer.disconnect());
 *   state.cleanups.push(() => window.removeEventListener('resize', handleResize));
 * }
 * 
 * function destroy() {
 *   cleanup_all(state.cleanups);
 * }
 */
function cleanup_all(cleanup_functions) {
  cleanup_functions.forEach(fn => {
    try {
      fn?.();
    } catch (error) {
      console.warn('[Lenis] Cleanup error:', error);
    }
  });
  cleanup_functions.length = 0;
}


/* ─────────────────────────────────────────────────────────────
   7. ACCESSIBILITY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Check if user prefers reduced motion
 * 
 * @returns {boolean} True if user prefers reduced motion
 */
function prefers_reduced_motion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Scroll to element respecting motion preferences
 * 
 * @param {HTMLElement|string} target - Target element
 * @param {object} options - Additional options
 * 
 * @example
 * // Automatically uses instant scroll if user prefers reduced motion
 * scroll_to_element_accessible('#section', { offset: -100 });
 */
function scroll_to_element_accessible(target, options = {}) {
  scroll_to_element(target, {
    ...options,
    immediate: prefers_reduced_motion(),
  });
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */
