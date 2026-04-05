/**
 * OBSERVER-BASED WAITING PATTERNS
 *
 * Production-ready code templates for async DOM operations.
 * Uses MutationObserver and IntersectionObserver instead of polling
 * for efficient, event-driven DOM observation.
 *
 * Patterns extracted from production codebase:
 * - MutationObserver: nav_notifications.js (attribute watching)
 * - IntersectionObserver: table_of_content.js (viewport detection with RAF batching)
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. MUTATION OBSERVER PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Wait for DOM element to exist using MutationObserver
 * Replaces polling-based waitForElement with efficient DOM observation
 *
 * @param {string} selector - CSS selector
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Max wait time in ms (default: 5000)
 * @param {Element} options.parent - Parent element to observe (default: document.body)
 * @returns {Promise<Element>} The found element
 * @throws {Error} If element not found within timeout
 *
 * @example
 * // Wait for CMS content to render
 * const card = await wait_for_element('[data-cms-item]');
 *
 * @example
 * // Wait within specific container
 * const modal = await wait_for_element('.modal-content', {
 *   parent: document.querySelector('.modal'),
 *   timeout: 3000
 * });
 */
function wait_for_element(selector, options = {}) {
  const { timeout = 5000, parent = document.body } = options;

  return new Promise((resolve, reject) => {
    const existing = (parent === document.body ? document : parent).querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    let observer = null;
    let timeout_id = null;

    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (timeout_id) {
        clearTimeout(timeout_id);
        timeout_id = null;
      }
    };

    observer = new MutationObserver(() => {
      const element = (parent === document.body ? document : parent).querySelector(selector);
      if (element) {
        cleanup();
        resolve(element);
      }
    });

    observer.observe(parent, {
      childList: true,
      subtree: true,
    });

    // Timeout fallback
    timeout_id = setTimeout(() => {
      cleanup();
      reject(new Error(`Element ${selector} not found after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Observe DOM element for attribute/content changes
 * Wrapper around MutationObserver for watching element mutations
 *
 * @param {Element} element - Element to observe
 * @param {Function} callback - Called on mutation with (mutations, observer)
 * @param {Object} options - MutationObserver options
 * @param {boolean} options.attributes - Watch attribute changes (default: true)
 * @param {boolean} options.childList - Watch child additions/removals (default: false)
 * @param {boolean} options.subtree - Watch all descendants (default: false)
 * @param {boolean} options.characterData - Watch text content (default: false)
 * @param {string[]} options.attributeFilter - Specific attributes to watch
 * @returns {Function} Cleanup function to disconnect observer
 *
 * @example
 * // Watch for status attribute changes (from nav_notifications.js pattern)
 * const disconnect = observe_element(indicator, (mutations) => {
 *   const newStatus = indicator.getAttribute('data-status');
 *   if (newStatus !== currentStatus) {
 *     currentStatus = newStatus;
 *     update_ui();
 *   }
 * }, {
 *   attributes: true,
 *   attributeFilter: ['data-status']
 * });
 *
 * // Cleanup when done
 * disconnect();
 */
function observe_element(element, callback, options = {}) {
  const {
    attributes = true,
    childList = false,
    subtree = false,
    characterData = false,
    attributeFilter = undefined,
  } = options;

  const observer = new MutationObserver(callback);

  observer.observe(element, {
    attributes,
    childList,
    subtree,
    characterData,
    ...(attributeFilter && { attributeFilter }),
  });

  return () => observer.disconnect();
}

/**
 * Observe CMS content for dynamic updates
 * Pattern for Webflow CMS collections that render asynchronously
 *
 * @param {string} container_selector - CMS container selector
 * @param {string} item_selector - CMS item selector within container
 * @param {Function} callback - Called when items are added/removed with (items, container)
 * @param {Object} options - Configuration options
 * @param {boolean} options.initial - Fire callback for existing items (default: true)
 * @returns {Function} Cleanup function to disconnect observer
 *
 * @example
 * // Watch for blog posts to render
 * const disconnect = observe_cms_content(
 *   '[data-cms-list="blog"]',
 *   '[data-cms-item]',
 *   (items, container) => {
 *     console.log(`${items.length} blog posts rendered`);
 *     items.forEach(init_blog_card);
 *   }
 * );
 *
 * // On page unload
 * disconnect();
 */
function observe_cms_content(container_selector, item_selector, callback, options = {}) {
  const { initial = true } = options;

  const container = document.querySelector(container_selector);
  if (!container) {
    console.warn(`[CMS Observer] Container not found: ${container_selector}`);
    return () => {}; // No-op cleanup
  }

  // Track processed items to avoid duplicate callbacks
  const processed = new WeakSet();

  const process_items = () => {
    const items = container.querySelectorAll(item_selector);
    const new_items = Array.from(items).filter(item => !processed.has(item));

    if (new_items.length > 0) {
      new_items.forEach(item => processed.add(item));
      callback(new_items, container);
    }
  };

  // Fire callback for pre-existing items before observer activates
  if (initial) {
    process_items();
  }

  const observer = new MutationObserver(() => {
    process_items();
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

/* ─────────────────────────────────────────────────────────────
   2. INTERSECTION OBSERVER PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Observe element visibility in viewport
 * Uses IntersectionObserver with RAF batching for 60fps performance
 *
 * Pattern from table_of_content.js - efficient scrollspy implementation
 *
 * @param {Element|Element[]|NodeList} elements - Element(s) to observe
 * @param {Function} callback - Called on visibility change with (entry, observer)
 * @param {Object} options - IntersectionObserver options
 * @param {string} options.rootMargin - Viewport margin (default: '0px')
 * @param {number|number[]} options.threshold - Visibility threshold(s) (default: 0)
 * @param {Element} options.root - Scroll container (default: viewport)
 * @param {boolean} options.batch - Use RAF batching for performance (default: true)
 * @returns {Function} Cleanup function to disconnect observer
 *
 * @example
 * // Lazy load images when 100px from viewport
 * const disconnect = observe_visibility(
 *   document.querySelectorAll('img[data-src]'),
 *   (entry, observer) => {
 *     if (entry.isIntersecting) {
 *       entry.target.src = entry.target.dataset.src;
 *       observer.unobserve(entry.target); // One-time observation
 *     }
 *   },
 *   { rootMargin: '100px' }
 * );
 *
 * @example
 * // Scrollspy with offset (from table_of_content.js)
 * const disconnect = observe_visibility(
 *   document.querySelectorAll('[data-section]'),
 *   (entry) => {
 *     if (entry.isIntersecting) {
 *       set_active_link(entry.target.id);
 *     }
 *   },
 *   { rootMargin: '-10% 0px -60% 0px' }
 * );
 */
function observe_visibility(elements, callback, options = {}) {
  const {
    rootMargin = '0px',
    threshold = 0,
    root = null,
    batch = true,
  } = options;

  const element_list = elements instanceof Element
    ? [elements]
    : Array.from(elements);

  if (element_list.length === 0) {
    console.warn('[Visibility Observer] No elements to observe');
    return () => {};
  }

  // RAF batching state (from table_of_content.js pattern)
  let raf_pending = false;
  let pending_entries = [];

  const process_entries = () => {
    pending_entries.forEach(entry => callback(entry, observer));
    pending_entries = [];
    raf_pending = false;
  };

  const handle_intersection = (entries) => {
    if (batch) {
      // Batch DOM updates with RAF for 60fps performance
      pending_entries.push(...entries);

      if (!raf_pending) {
        raf_pending = true;
        requestAnimationFrame(process_entries);
      }
    } else {
      // Immediate processing (for one-time observations)
      entries.forEach(entry => callback(entry, observer));
    }
  };

  const observer = new IntersectionObserver(handle_intersection, {
    root,
    rootMargin,
    threshold: Array.isArray(threshold) ? threshold : [threshold],
  });

  element_list.forEach(el => observer.observe(el));

  return () => observer.disconnect();
}

/**
 * One-time visibility observation (auto-disconnects after callback)
 * Useful for lazy loading and reveal animations
 *
 * @param {Element} element - Element to observe
 * @param {Function} callback - Called once when element becomes visible
 * @param {Object} options - IntersectionObserver options
 * @returns {Function} Cleanup function (auto-called on visibility)
 *
 * @example
 * // Reveal animation on first view
 * observe_once(element, (el) => {
 *   el.classList.add('is--visible');
 * }, { rootMargin: '-50px' });
 */
function observe_once(element, callback, options = {}) {
  const disconnect = observe_visibility(
    element,
    (entry, observer) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        callback(entry.target, entry);
      }
    },
    { ...options, batch: false }
  );

  return disconnect;
}

/* ─────────────────────────────────────────────────────────────
   3. EVENT-BASED PATTERNS (kept from original)
──────────────────────────────────────────────────────────────── */

/**
 * Wait for image to load
 * @param {HTMLImageElement} img - Image element
 * @returns {Promise<HTMLImageElement>} The loaded image
 */
function wait_for_image_load(img) {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }

    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener('error', () => reject(new Error('Image failed to load')), { once: true });
  });
}

/**
 * Wait for image to load with timeout (Promise.race pattern)
 *
 * PREFERRED over wait_for_image_load when images may 404 or hang.
 * Uses Promise.race to guarantee resolution within the timeout period.
 *
 * From ADR-001 (Spec 031): Hero image promises could wait forever if an image
 * failed to load or the error event didn't fire. Wrapping in Promise.race
 * with a 2s timeout guarantees page reveal.
 *
 * @param {HTMLImageElement} img - Image element
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Max wait time in ms (default: 2000)
 * @returns {Promise<HTMLImageElement>} The image (loaded or timed out)
 *
 * @example
 * // Wrap hero image promises with timeout
 * const promises = hero_images.map(img =>
 *   wait_for_image_with_timeout(img, { timeout: 2000 })
 * );
 * await Promise.all(promises);
 * // Page reveals even if some images are slow/failed
 *
 * @example
 * // Use in hero script image collection
 * promises.push(
 *   wait_for_image_with_timeout(img).catch(() => {
 *     console.warn('[Hero] Image timed out:', img.src);
 *   })
 * );
 */
function wait_for_image_with_timeout(img, options = {}) {
  const { timeout = 2000 } = options;

  return Promise.race([
    wait_for_image_load(img),
    new Promise((resolve) => {
      setTimeout(() => {
        console.warn(`[Image] Timeout after ${timeout}ms:`, img.src || img.dataset?.src);
        resolve(img); // Resolve (not reject) to avoid blocking page reveal
      }, timeout);
    }),
  ]);
}

/**
 * Wait for video to be ready to play
 * @param {HTMLVideoElement} video - Video element
 * @returns {Promise<HTMLVideoElement>} The ready video
 */
function wait_for_video_ready(video) {
  return new Promise((resolve, reject) => {
    // HAVE_FUTURE_DATA (3) or HAVE_ENOUGH_DATA (4)
    if (video.readyState >= 3) {
      resolve(video);
      return;
    }

    video.addEventListener('canplay', () => resolve(video), { once: true });
    video.addEventListener('error', () => reject(new Error('Video load failed')), { once: true });
  });
}

/**
 * Wait for CSS transition to complete
 * @param {Element} element - Element with transition
 * @param {string|null} property - Specific property to wait for (optional)
 * @returns {Promise<TransitionEvent>} The transition event
 */
function wait_for_transition_end(element, property = null) {
  return new Promise(resolve => {
    const handler = (event) => {
      if (property && event.propertyName !== property) return;
      element.removeEventListener('transitionend', handler);
      resolve(event);
    };

    element.addEventListener('transitionend', handler);
  });
}

/**
 * Wait for CSS animation to complete
 * @param {Element} element - Element with animation
 * @param {string|null} animation_name - Specific animation to wait for (optional)
 * @returns {Promise<AnimationEvent>} The animation event
 */
function wait_for_animation_end(element, animation_name = null) {
  return new Promise(resolve => {
    const handler = (event) => {
      if (animation_name && event.animationName !== animation_name) return;
      element.removeEventListener('animationend', handler);
      resolve(event);
    };

    element.addEventListener('animationend', handler);
  });
}

/**
 * Wait for DOM to be ready
 * @returns {Promise<void>}
 */
function dom_ready() {
  return new Promise(resolve => {
    if (document.readyState !== 'loading') {
      resolve();
      return;
    }

    document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });
}

/**
 * Wait for font to load
 * @param {string} font_family - Font family name
 * @param {number} timeout - Max wait time in ms (default: 5000)
 * @returns {Promise<boolean>} True if loaded, false if timeout
 */
async function wait_for_font(font_family, timeout = 5000) {
  try {
    await Promise.race([
      document.fonts.load(`1em ${font_family}`),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Font load timeout')), timeout)
      ),
    ]);
    return true;
  } catch (error) {
    console.warn(`[Font] ${font_family} not loaded:`, error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   4. LIBRARY/DEPENDENCY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Wait for external library to load using MutationObserver
 * Watches for script execution and global variable availability
 *
 * @param {string} global_name - Name of global variable (e.g., 'Swiper', 'gsap')
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Max wait time in ms (default: 10000)
 * @param {number} options.check_interval - How often to check in ms (default: 100)
 * @returns {Promise<any>} The library object
 * @throws {Error} If library not loaded within timeout
 *
 * @example
 * const gsap = await wait_for_library('gsap');
 * gsap.to('.element', { opacity: 1 });
 */
function wait_for_library(global_name, options = {}) {
  const { timeout = 10000, check_interval = 100 } = options;

  return new Promise((resolve, reject) => {
    if (typeof window[global_name] !== 'undefined') {
      resolve(window[global_name]);
      return;
    }

    let timeout_id = null;
    let interval_id = null;

    const cleanup = () => {
      if (timeout_id) clearTimeout(timeout_id);
      if (interval_id) clearInterval(interval_id);
    };

    // Use interval as libraries may load via script without DOM mutation
    interval_id = setInterval(() => {
      if (typeof window[global_name] !== 'undefined') {
        cleanup();
        resolve(window[global_name]);
      }
    }, check_interval);

    timeout_id = setTimeout(() => {
      cleanup();
      reject(new Error(`Library ${global_name} not loaded after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Wait for Motion.dev library using CustomEvent (event-driven, no polling)
 *
 * PREFERRED over wait_for_library('Motion') — uses the `motion:ready` CustomEvent
 * pattern instead of polling. Requires global.html to dispatch the event after
 * importing Motion.dev.
 *
 * From ADR-002 (Spec 031): Replaces 17 parallel polling loops with a single
 * event-driven listener, eliminating CPU waste and race conditions.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Max wait time in ms (default: 1000)
 * @returns {Promise<Object>} The window.Motion object
 * @throws {Error} If Motion.dev not loaded within timeout
 *
 * @example
 * // In each script that needs Motion.dev:
 * try {
 *   const Motion = await wait_for_motion();
 *   Motion.animate('.element', { opacity: [0, 1] });
 * } catch (e) {
 *   console.warn('[Hero] Motion.dev not available, using CSS fallback');
 *   handle_fallback();
 * }
 *
 * @example
 * // In global.html (dispatches the event after ES module import):
 * // <script type="module">
 * //   const { animate, scroll, inView } = await import("...");
 * //   window.Motion = { animate, scroll, inView };
 * //   window.dispatchEvent(new CustomEvent('motion:ready'));
 * // </script>
 */
function wait_for_motion(options = {}) {
  const { timeout = 1000 } = options;

  return new Promise((resolve, reject) => {
    // Already loaded — resolve immediately
    if (window.Motion && typeof window.Motion.animate === 'function') {
      resolve(window.Motion);
      return;
    }

    let timeout_id = null;

    const cleanup = (handler) => {
      if (timeout_id) clearTimeout(timeout_id);
      window.removeEventListener('motion:ready', handler);
    };

    const handler = () => {
      cleanup(handler);
      resolve(window.Motion);
    };

    window.addEventListener('motion:ready', handler, { once: true });

    // Timeout fallback (1s default per ADR-001)
    timeout_id = setTimeout(() => {
      cleanup(handler);
      reject(new Error(`Motion.dev not loaded after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Wait for Webflow to be ready
 * Handles Webflow.push() pattern used throughout codebase
 *
 * @returns {Promise<void>}
 *
 * @example
 * await wait_for_webflow();
 * // Webflow IX2 and other features are now available
 */
function wait_for_webflow() {
  return new Promise(resolve => {
    if (window.Webflow?.push) {
      window.Webflow.push(resolve);
    } else {
      // Webflow not present, resolve immediately
      resolve();
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   5. UTILITY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Create a cleanup registry for managing multiple observers
 * Useful for components that need to track multiple subscriptions
 *
 * @returns {Object} Registry with add() and cleanup() methods
 *
 * @example
 * const cleanups = create_cleanup_registry();
 *
 * cleanups.add(observe_element(el1, callback1));
 * cleanups.add(observe_visibility(el2, callback2));
 * cleanups.add(() => custom_cleanup());
 *
 * // On component destroy
 * cleanups.cleanup();
 */
function create_cleanup_registry() {
  const cleanups = [];

  return {
    add(cleanup_fn) {
      if (typeof cleanup_fn === 'function') {
        cleanups.push(cleanup_fn);
      }
      return this; // Allow chaining
    },
    cleanup() {
      cleanups.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.warn('[Cleanup] Error:', e);
        }
      });
      cleanups.length = 0;
    },
    get size() {
      return cleanups.length;
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

// Export for both module and browser usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Observer patterns (NEW)
    wait_for_element,
    observe_element,
    observe_cms_content,
    observe_visibility,
    observe_once,

    // Event-based patterns (KEPT)
    wait_for_image_load,
    wait_for_image_with_timeout,
    wait_for_video_ready,
    wait_for_transition_end,
    wait_for_animation_end,
    dom_ready,
    wait_for_font,

    // Library patterns
    wait_for_library,
    wait_for_motion,
    wait_for_webflow,

    // Utilities
    create_cleanup_registry,
  };
}

// Browser global
if (typeof window !== 'undefined') {
  window.WaitPatterns = {
    // Observer patterns (NEW)
    wait_for_element,
    observe_element,
    observe_cms_content,
    observe_visibility,
    observe_once,

    // Event-based patterns (KEPT)
    wait_for_image_load,
    wait_for_image_with_timeout,
    wait_for_video_ready,
    wait_for_transition_end,
    wait_for_animation_end,
    dom_ready,
    wait_for_font,

    // Library patterns
    wait_for_library,
    wait_for_motion,
    wait_for_webflow,

    // Utilities
    create_cleanup_registry,
  };
}
