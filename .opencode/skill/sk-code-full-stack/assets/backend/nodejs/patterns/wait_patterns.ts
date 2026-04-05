/* ─────────────────────────────────────────────────────────────
   OBSERVER-BASED WAITING PATTERNS
   Production-ready TypeScript templates for async DOM operations

   Uses MutationObserver and IntersectionObserver instead of polling
   for efficient, event-driven DOM observation.

   Universal patterns that work across frontend stacks:
   - React, Vue, Svelte, Angular
   - Vanilla TypeScript/JavaScript
   - Web Components
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

/**
 * Options for waiting operations
 */
export interface WaitOptions {
  /** Maximum wait time in milliseconds (default: 5000) */
  timeout?: number;
  /** Polling interval in milliseconds (default: 50) */
  interval?: number;
  /** Parent element to observe (default: document.body) */
  parent?: Element;
}

/**
 * Options for element observation
 */
export interface ObserveElementOptions {
  /** Watch attribute changes (default: true) */
  attributes?: boolean;
  /** Watch child additions/removals (default: false) */
  childList?: boolean;
  /** Watch all descendants (default: false) */
  subtree?: boolean;
  /** Watch text content changes (default: false) */
  characterData?: boolean;
  /** Specific attributes to watch */
  attributeFilter?: string[];
}

/**
 * Options for visibility observation
 */
export interface VisibilityOptions {
  /** Viewport margin (default: '0px') */
  rootMargin?: string;
  /** Visibility threshold(s) (default: 0) */
  threshold?: number | number[];
  /** Scroll container (default: viewport) */
  root?: Element | null;
  /** Use RAF batching for performance (default: true) */
  batch?: boolean;
}

/**
 * Options for CMS content observation
 */
export interface CMSObserveOptions {
  /** Fire callback for existing items (default: true) */
  initial?: boolean;
}

/**
 * Options for library waiting
 */
export interface LibraryWaitOptions {
  /** Maximum wait time in milliseconds (default: 10000) */
  timeout?: number;
  /** How often to check in milliseconds (default: 100) */
  checkInterval?: number;
}

/**
 * Cleanup function type
 */
export type CleanupFn = () => void;

/**
 * Visibility callback type
 */
export type VisibilityCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

/**
 * Mutation callback type
 */
export type MutationCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver
) => void;

/**
 * CMS content callback type
 */
export type CMSCallback = (items: Element[], container: Element) => void;

/* ─────────────────────────────────────────────────────────────
   1. MUTATION OBSERVER PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Wait for DOM element to exist using MutationObserver
 * Replaces polling-based waitForElement with efficient DOM observation
 *
 * @param selector - CSS selector
 * @param options - Configuration options
 * @returns Promise resolving to the found element
 * @throws Error if element not found within timeout
 *
 * @example
 * // Wait for CMS content to render
 * const card = await waitForElement('[data-cms-item]');
 *
 * @example
 * // Wait within specific container
 * const modal = await waitForElement('.modal-content', {
 *   parent: document.querySelector('.modal')!,
 *   timeout: 3000
 * });
 *
 * @example
 * // React: Wait for component mount
 * useEffect(() => {
 *   waitForElement('[data-testid="async-content"]')
 *     .then(el => setContent(el.textContent));
 * }, []);
 */
export function waitForElement<T extends Element = Element>(
  selector: string,
  options: WaitOptions = {}
): Promise<T> {
  const { timeout = 5000, parent = document.body } = options;

  return new Promise((resolve, reject) => {
    // Check if element already exists
    const searchRoot = parent === document.body ? document : parent;
    const existing = searchRoot.querySelector<T>(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    let observer: MutationObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = (): void => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    observer = new MutationObserver(() => {
      const element = searchRoot.querySelector<T>(selector);
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
    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Element ${selector} not found after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Wait for multiple DOM elements to exist
 *
 * @param selector - CSS selector
 * @param minCount - Minimum number of elements required (default: 1)
 * @param options - Configuration options
 * @returns Promise resolving to NodeList of found elements
 *
 * @example
 * // Wait for at least 3 list items
 * const items = await waitForElements('.list-item', 3);
 *
 * @example
 * // Vue: Wait for v-for rendered items
 * onMounted(async () => {
 *   const cards = await waitForElements('[data-card]', 5);
 *   initializeCards(cards);
 * });
 */
export function waitForElements<T extends Element = Element>(
  selector: string,
  minCount: number = 1,
  options: WaitOptions = {}
): Promise<NodeListOf<T>> {
  const { timeout = 5000, parent = document.body } = options;

  return new Promise((resolve, reject) => {
    const searchRoot = parent === document.body ? document : parent;

    // Check if elements already exist
    const existing = searchRoot.querySelectorAll<T>(selector);
    if (existing.length >= minCount) {
      resolve(existing);
      return;
    }

    let observer: MutationObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = (): void => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    observer = new MutationObserver(() => {
      const elements = searchRoot.querySelectorAll<T>(selector);
      if (elements.length >= minCount) {
        cleanup();
        resolve(elements);
      }
    });

    observer.observe(parent, {
      childList: true,
      subtree: true,
    });

    timeoutId = setTimeout(() => {
      cleanup();
      const found = searchRoot.querySelectorAll<T>(selector);
      reject(
        new Error(
          `Expected ${minCount} elements for ${selector}, found ${found.length} after ${timeout}ms`
        )
      );
    }, timeout);
  });
}

/**
 * Observe DOM element for attribute/content changes
 * Wrapper around MutationObserver for watching element mutations
 *
 * @param element - Element to observe
 * @param callback - Called on mutation with (mutations, observer)
 * @param options - MutationObserver options
 * @returns Cleanup function to disconnect observer
 *
 * @example
 * // Watch for status attribute changes
 * const disconnect = observeElement(indicator, (mutations) => {
 *   const newStatus = indicator.getAttribute('data-status');
 *   if (newStatus !== currentStatus) {
 *     currentStatus = newStatus;
 *     updateUI();
 *   }
 * }, {
 *   attributes: true,
 *   attributeFilter: ['data-status']
 * });
 *
 * // Cleanup when done
 * disconnect();
 *
 * @example
 * // React: Watch for external DOM changes
 * useEffect(() => {
 *   const disconnect = observeElement(ref.current!, handleMutation);
 *   return disconnect;
 * }, []);
 */
export function observeElement(
  element: Element,
  callback: MutationCallback,
  options: ObserveElementOptions = {}
): CleanupFn {
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

  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Observe CMS content for dynamic updates
 * Pattern for CMS collections that render asynchronously
 *
 * @param containerSelector - CMS container selector
 * @param itemSelector - CMS item selector within container
 * @param callback - Called when items are added/removed with (items, container)
 * @param options - Configuration options
 * @returns Cleanup function to disconnect observer
 *
 * @example
 * // Watch for blog posts to render (Webflow CMS)
 * const disconnect = observeCMSContent(
 *   '[data-cms-list="blog"]',
 *   '[data-cms-item]',
 *   (items, container) => {
 *     console.log(`${items.length} blog posts rendered`);
 *     items.forEach(initBlogCard);
 *   }
 * );
 *
 * @example
 * // Contentful/Sanity integration
 * const disconnect = observeCMSContent(
 *   '.product-grid',
 *   '.product-card',
 *   (items) => items.forEach(initProductCard)
 * );
 */
export function observeCMSContent(
  containerSelector: string,
  itemSelector: string,
  callback: CMSCallback,
  options: CMSObserveOptions = {}
): CleanupFn {
  const { initial = true } = options;

  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn(`[CMS Observer] Container not found: ${containerSelector}`);
    return () => {}; // No-op cleanup
  }

  // Track processed items to avoid duplicate callbacks
  const processed = new WeakSet<Element>();

  const processItems = (): void => {
    const items = container.querySelectorAll(itemSelector);
    const newItems = Array.from(items).filter((item) => !processed.has(item));

    if (newItems.length > 0) {
      newItems.forEach((item) => processed.add(item));
      callback(newItems, container);
    }
  };

  // Process existing items if requested
  if (initial) {
    processItems();
  }

  const observer = new MutationObserver(() => {
    processItems();
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
 * @param elements - Element(s) to observe
 * @param callback - Called on visibility change with (entry, observer)
 * @param options - IntersectionObserver options
 * @returns Cleanup function to disconnect observer
 *
 * @example
 * // Lazy load images when 100px from viewport
 * const disconnect = observeVisibility(
 *   document.querySelectorAll('img[data-src]'),
 *   (entry, observer) => {
 *     if (entry.isIntersecting) {
 *       const img = entry.target as HTMLImageElement;
 *       img.src = img.dataset.src!;
 *       observer.unobserve(entry.target); // One-time observation
 *     }
 *   },
 *   { rootMargin: '100px' }
 * );
 *
 * @example
 * // Scrollspy with offset
 * const disconnect = observeVisibility(
 *   document.querySelectorAll('[data-section]'),
 *   (entry) => {
 *     if (entry.isIntersecting) {
 *       setActiveLink(entry.target.id);
 *     }
 *   },
 *   { rootMargin: '-10% 0px -60% 0px' }
 * );
 *
 * @example
 * // React: Intersection observer hook pattern
 * useEffect(() => {
 *   if (!ref.current) return;
 *   return observeVisibility(ref.current, handleIntersect);
 * }, []);
 */
export function observeVisibility(
  elements: Element | Element[] | NodeListOf<Element>,
  callback: VisibilityCallback,
  options: VisibilityOptions = {}
): CleanupFn {
  const {
    rootMargin = '0px',
    threshold = 0,
    root = null,
    batch = true,
  } = options;

  // Normalize elements to array
  const elementList: Element[] =
    elements instanceof Element ? [elements] : Array.from(elements);

  if (elementList.length === 0) {
    console.warn('[Visibility Observer] No elements to observe');
    return () => {};
  }

  // RAF batching state
  let rafPending = false;
  let pendingEntries: IntersectionObserverEntry[] = [];

  const processEntries = (): void => {
    pendingEntries.forEach((entry) => callback(entry, observer));
    pendingEntries = [];
    rafPending = false;
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    if (batch) {
      // Batch DOM updates with RAF for 60fps performance
      pendingEntries.push(...entries);

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(processEntries);
      }
    } else {
      // Immediate processing (for one-time observations)
      entries.forEach((entry) => callback(entry, observer));
    }
  };

  const observer = new IntersectionObserver(handleIntersection, {
    root,
    rootMargin,
    threshold: Array.isArray(threshold) ? threshold : [threshold],
  });

  elementList.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

/**
 * One-time visibility observation (auto-disconnects after callback)
 * Useful for lazy loading and reveal animations
 *
 * @param element - Element to observe
 * @param callback - Called once when element becomes visible
 * @param options - IntersectionObserver options
 * @returns Cleanup function (auto-called on visibility)
 *
 * @example
 * // Reveal animation on first view
 * observeOnce(element, (el) => {
 *   el.classList.add('is--visible');
 * }, { rootMargin: '-50px' });
 *
 * @example
 * // React: One-time animation trigger
 * useEffect(() => {
 *   if (!ref.current) return;
 *   return observeOnce(ref.current, (el) => {
 *     el.classList.add('animate-in');
 *   });
 * }, []);
 */
export function observeOnce(
  element: Element,
  callback: (element: Element, entry: IntersectionObserverEntry) => void,
  options: Omit<VisibilityOptions, 'batch'> = {}
): CleanupFn {
  const disconnect = observeVisibility(
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

/**
 * Create a lazy loading observer for images
 * Handles data-src to src swapping with loading states
 *
 * @param options - Configuration options
 * @returns Object with observe method and cleanup function
 *
 * @example
 * // Basic lazy loading
 * const lazyLoader = createLazyLoader();
 * document.querySelectorAll('img[data-src]').forEach(lazyLoader.observe);
 *
 * // Cleanup
 * lazyLoader.disconnect();
 *
 * @example
 * // With custom root margin for earlier loading
 * const lazyLoader = createLazyLoader({ rootMargin: '200px' });
 */
export function createLazyLoader(
  options: { rootMargin?: string; onLoad?: (img: HTMLImageElement) => void } = {}
): {
  observe: (img: HTMLImageElement) => void;
  disconnect: () => void;
} {
  const { rootMargin = '100px', onLoad } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');

            img.addEventListener(
              'load',
              () => {
                img.classList.add('is-loaded');
                onLoad?.(img);
              },
              { once: true }
            );
          }

          observer.unobserve(img);
        }
      });
    },
    { rootMargin }
  );

  return {
    observe: (img: HTMLImageElement) => observer.observe(img),
    disconnect: () => observer.disconnect(),
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EVENT-BASED WAITING PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Wait for image to load
 *
 * @param img - Image element
 * @returns Promise resolving to the loaded image
 * @throws Error if image fails to load
 *
 * @example
 * const img = document.querySelector('img')!;
 * await waitForImageLoad(img);
 * console.log('Image dimensions:', img.naturalWidth, img.naturalHeight);
 *
 * @example
 * // React: Wait for dynamic image
 * const handleImageRef = async (img: HTMLImageElement | null) => {
 *   if (!img) return;
 *   await waitForImageLoad(img);
 *   setImageLoaded(true);
 * };
 */
export function waitForImageLoad(img: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }

    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener('error', () => reject(new Error('Image failed to load')), {
      once: true,
    });
  });
}

/**
 * Wait for multiple images to load
 *
 * @param images - Image elements
 * @param options - Configuration options
 * @returns Promise resolving when all images are loaded
 *
 * @example
 * const images = document.querySelectorAll<HTMLImageElement>('.gallery img');
 * await waitForImages(images);
 * initializeGallery();
 */
export function waitForImages(
  images: HTMLImageElement[] | NodeListOf<HTMLImageElement>,
  options: { failFast?: boolean } = {}
): Promise<HTMLImageElement[]> {
  const { failFast = false } = options;
  const imageArray = Array.from(images);

  if (failFast) {
    return Promise.all(imageArray.map(waitForImageLoad));
  }

  return Promise.allSettled(imageArray.map(waitForImageLoad)).then((results) =>
    results
      .filter((r): r is PromiseFulfilledResult<HTMLImageElement> => r.status === 'fulfilled')
      .map((r) => r.value)
  );
}

/**
 * Wait for video to be ready to play
 *
 * @param video - Video element
 * @returns Promise resolving to the ready video
 * @throws Error if video fails to load
 *
 * @example
 * const video = document.querySelector('video')!;
 * await waitForVideoReady(video);
 * video.play();
 */
export function waitForVideoReady(video: HTMLVideoElement): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    // HAVE_FUTURE_DATA (3) or HAVE_ENOUGH_DATA (4)
    if (video.readyState >= 3) {
      resolve(video);
      return;
    }

    video.addEventListener('canplay', () => resolve(video), { once: true });
    video.addEventListener('error', () => reject(new Error('Video load failed')), {
      once: true,
    });
  });
}

/**
 * Wait for CSS transition to complete
 *
 * @param element - Element with transition
 * @param property - Specific property to wait for (optional)
 * @returns Promise resolving to the transition event
 *
 * @example
 * element.classList.add('expanded');
 * await waitForTransitionEnd(element, 'height');
 * console.log('Expansion complete');
 *
 * @example
 * // React: Coordinated animations
 * const handleExpand = async () => {
 *   setExpanded(true);
 *   await waitForTransitionEnd(ref.current!, 'transform');
 *   onExpandComplete?.();
 * };
 */
export function waitForTransitionEnd(
  element: Element,
  property: string | null = null
): Promise<TransitionEvent> {
  return new Promise((resolve) => {
    const handler = (event: TransitionEvent): void => {
      if (property && event.propertyName !== property) return;
      element.removeEventListener('transitionend', handler as EventListener);
      resolve(event);
    };

    element.addEventListener('transitionend', handler as EventListener);
  });
}

/**
 * Wait for CSS animation to complete
 *
 * @param element - Element with animation
 * @param animationName - Specific animation to wait for (optional)
 * @returns Promise resolving to the animation event
 *
 * @example
 * element.classList.add('animate-bounce');
 * await waitForAnimationEnd(element, 'bounce');
 * element.classList.remove('animate-bounce');
 */
export function waitForAnimationEnd(
  element: Element,
  animationName: string | null = null
): Promise<AnimationEvent> {
  return new Promise((resolve) => {
    const handler = (event: AnimationEvent): void => {
      if (animationName && event.animationName !== animationName) return;
      element.removeEventListener('animationend', handler as EventListener);
      resolve(event);
    };

    element.addEventListener('animationend', handler as EventListener);
  });
}

/**
 * Wait for DOM to be ready
 *
 * @returns Promise resolving when DOM is ready
 *
 * @example
 * await domReady();
 * initializeApp();
 */
export function domReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      resolve();
      return;
    }

    document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
  });
}

/**
 * Wait for window load (all resources loaded)
 *
 * @returns Promise resolving when window is fully loaded
 *
 * @example
 * await windowLoad();
 * measurePerformance();
 */
export function windowLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }

    window.addEventListener('load', () => resolve(), { once: true });
  });
}

/**
 * Wait for font to load
 *
 * @param fontFamily - Font family name
 * @param timeout - Max wait time in ms (default: 5000)
 * @returns Promise resolving to true if loaded, false if timeout
 *
 * @example
 * const loaded = await waitForFont('Inter');
 * if (loaded) {
 *   document.body.classList.add('fonts-loaded');
 * }
 */
export async function waitForFont(
  fontFamily: string,
  timeout: number = 5000
): Promise<boolean> {
  try {
    await Promise.race([
      document.fonts.load(`1em ${fontFamily}`),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Font load timeout')), timeout)
      ),
    ]);
    return true;
  } catch (error) {
    console.warn(`[Font] ${fontFamily} not loaded:`, error);
    return false;
  }
}

/**
 * Wait for multiple fonts to load
 *
 * @param fontFamilies - Array of font family names
 * @param timeout - Max wait time in ms (default: 5000)
 * @returns Promise resolving to array of load results
 *
 * @example
 * const results = await waitForFonts(['Inter', 'Fira Code']);
 * const allLoaded = results.every(r => r);
 */
export async function waitForFonts(
  fontFamilies: string[],
  timeout: number = 5000
): Promise<boolean[]> {
  return Promise.all(fontFamilies.map((font) => waitForFont(font, timeout)));
}

/* ─────────────────────────────────────────────────────────────
   4. LIBRARY/DEPENDENCY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Wait for external library to load
 * Watches for script execution and global variable availability
 *
 * @param globalName - Name of global variable (e.g., 'Swiper', 'gsap')
 * @param options - Configuration options
 * @returns Promise resolving to the library object
 * @throws Error if library not loaded within timeout
 *
 * @example
 * const gsap = await waitForLibrary<typeof import('gsap')>('gsap');
 * gsap.to('.element', { opacity: 1 });
 *
 * @example
 * // Wait for Stripe
 * const Stripe = await waitForLibrary<typeof import('@stripe/stripe-js')>('Stripe');
 */
export function waitForLibrary<T = unknown>(
  globalName: string,
  options: LibraryWaitOptions = {}
): Promise<T> {
  const { timeout = 10000, checkInterval = 100 } = options;

  return new Promise((resolve, reject) => {
    // Check if already loaded
    const global = window as unknown as Record<string, T>;
    if (typeof global[globalName] !== 'undefined') {
      resolve(global[globalName]);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const cleanup = (): void => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };

    // Use interval as libraries may load via script without DOM mutation
    intervalId = setInterval(() => {
      if (typeof global[globalName] !== 'undefined') {
        cleanup();
        resolve(global[globalName]);
      }
    }, checkInterval);

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Library ${globalName} not loaded after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Wait for Webflow to be ready
 * Handles Webflow.push() pattern used in Webflow sites
 *
 * @returns Promise resolving when Webflow is ready
 *
 * @example
 * await waitForWebflow();
 * // Webflow IX2 and other features are now available
 */
export function waitForWebflow(): Promise<void> {
  interface WebflowGlobal {
    push?: (callback: () => void) => void;
  }

  return new Promise((resolve) => {
    const webflow = (window as unknown as { Webflow?: WebflowGlobal }).Webflow;
    if (webflow?.push) {
      webflow.push(resolve);
    } else {
      // Webflow not present, resolve immediately
      resolve();
    }
  });
}

/**
 * Wait for condition to be true
 * Generic polling utility for custom conditions
 *
 * @param condition - Function returning boolean or Promise<boolean>
 * @param options - Configuration options
 * @returns Promise resolving when condition is true
 * @throws Error if condition not met within timeout
 *
 * @example
 * // Wait for API to be ready
 * await waitForCondition(() => window.myAPI?.isReady === true);
 *
 * @example
 * // Wait for Redux store to have data
 * await waitForCondition(() => store.getState().user !== null);
 *
 * @example
 * // Async condition
 * await waitForCondition(async () => {
 *   const response = await fetch('/api/health');
 *   return response.ok;
 * });
 */
export function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options: WaitOptions = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = async (): Promise<void> => {
      try {
        const result = await condition();
        if (result) {
          resolve();
          return;
        }
      } catch {
        // Condition threw, continue waiting
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Condition not met after ${timeout}ms`));
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
}

/* ─────────────────────────────────────────────────────────────
   5. UTILITY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Cleanup registry interface
 */
export interface CleanupRegistry {
  /** Add a cleanup function to the registry */
  add(cleanupFn: CleanupFn): CleanupRegistry;
  /** Run all cleanup functions and clear the registry */
  cleanup(): void;
  /** Number of registered cleanup functions */
  readonly size: number;
}

/**
 * Create a cleanup registry for managing multiple observers
 * Useful for components that need to track multiple subscriptions
 *
 * @returns Registry with add() and cleanup() methods
 *
 * @example
 * const cleanups = createCleanupRegistry();
 *
 * cleanups.add(observeElement(el1, callback1));
 * cleanups.add(observeVisibility(el2, callback2));
 * cleanups.add(() => customCleanup());
 *
 * // On component destroy
 * cleanups.cleanup();
 *
 * @example
 * // React: Cleanup multiple effects
 * useEffect(() => {
 *   const cleanups = createCleanupRegistry();
 *   cleanups.add(observeVisibility(ref1.current!, handleVisible));
 *   cleanups.add(observeElement(ref2.current!, handleMutation));
 *   return () => cleanups.cleanup();
 * }, []);
 *
 * @example
 * // Vue: Cleanup in onUnmounted
 * const cleanups = createCleanupRegistry();
 * onMounted(() => {
 *   cleanups.add(observeVisibility(el.value!, handleVisible));
 * });
 * onUnmounted(() => cleanups.cleanup());
 */
export function createCleanupRegistry(): CleanupRegistry {
  const cleanups: CleanupFn[] = [];

  return {
    add(cleanupFn: CleanupFn): CleanupRegistry {
      if (typeof cleanupFn === 'function') {
        cleanups.push(cleanupFn);
      }
      return this; // Allow chaining
    },
    cleanup(): void {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.warn('[Cleanup] Error:', e);
        }
      });
      cleanups.length = 0;
    },
    get size(): number {
      return cleanups.length;
    },
  };
}

/**
 * Create an AbortController with timeout
 * Useful for fetch requests and cancellable operations
 *
 * @param timeoutMs - Timeout in milliseconds
 * @returns AbortController that auto-aborts after timeout
 *
 * @example
 * const controller = createTimeoutController(5000);
 * const response = await fetch('/api/data', { signal: controller.signal });
 */
export function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

/**
 * Delay execution for specified time
 * Type-safe alternative to setTimeout with Promise
 *
 * @param ms - Delay in milliseconds
 * @returns Promise resolving after delay
 *
 * @example
 * await delay(1000);
 * console.log('One second later');
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run function on next animation frame
 *
 * @param fn - Function to run
 * @returns Promise resolving after RAF
 *
 * @example
 * await nextFrame();
 * measureLayout();
 */
export function nextFrame(): Promise<DOMHighResTimeStamp> {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Run function on next microtask
 *
 * @returns Promise resolving on next microtask
 *
 * @example
 * await nextTick();
 * // DOM updates from reactive frameworks are now applied
 */
export function nextTick(): Promise<void> {
  return Promise.resolve();
}

/* ─────────────────────────────────────────────────────────────
   6. FRAMEWORK INTEGRATION HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Create a React-compatible visibility hook setup
 * Returns a function that creates observer and cleanup
 *
 * @param callback - Visibility callback
 * @param options - Visibility options
 * @returns Function that takes an element and returns cleanup
 *
 * @example
 * // In a custom hook
 * const useVisibility = (callback: VisibilityCallback, options?: VisibilityOptions) => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const setup = createVisibilityHook(callback, options);
 *
 *   useEffect(() => {
 *     if (!ref.current) return;
 *     return setup(ref.current);
 *   }, []);
 *
 *   return ref;
 * };
 */
export function createVisibilityHook(
  callback: VisibilityCallback,
  options?: VisibilityOptions
): (element: Element) => CleanupFn {
  return (element: Element) => observeVisibility(element, callback, options);
}

/**
 * Create a mutation observer hook setup
 *
 * @param callback - Mutation callback
 * @param options - Observer options
 * @returns Function that takes an element and returns cleanup
 */
export function createMutationHook(
  callback: MutationCallback,
  options?: ObserveElementOptions
): (element: Element) => CleanupFn {
  return (element: Element) => observeElement(element, callback, options);
}
