---
title: Observer Patterns Reference
description: Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors.
---

# Observer Patterns Reference

Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors.

---

## 1. OVERVIEW

### Purpose
Production-tested patterns for MutationObserver, IntersectionObserver, and ResizeObserver in Webflow projects with proper cleanup and performance optimization.

### When to Use (Observers vs Polling)

| Approach | Use When | Performance |
|----------|----------|-------------|
| **MutationObserver** | Watching DOM changes (attributes, children, text) | Event-driven, efficient |
| **IntersectionObserver** | Detecting element visibility/scroll position | Hardware-accelerated |
| **Polling (setInterval)** | External state changes not reflected in DOM | Resource-intensive, avoid |
| **ResizeObserver** | Tracking element size changes | Not currently used in codebase |

**Rule of thumb:** If watching the DOM, use an observer. If watching non-DOM state, consider event listeners first.

---

## 2. MUTATIONOBSERVER

### When to Use

- CMS content that loads dynamically after page render
- Third-party widgets that modify the DOM
- Attribute changes that trigger business logic (e.g., status indicators)
- Webflow interactions that change data attributes

### Basic Pattern

```javascript
/**
 * Basic MutationObserver setup
 * @param {Element} target - Element to observe
 * @param {MutationCallback} callback - Handler for mutations
 * @param {MutationObserverInit} options - Observer configuration
 * @returns {Function} Cleanup function
 */
function observe_mutations(target, callback, options = {}) {
  const observer = new MutationObserver(callback);
  
  observer.observe(target, {
    attributes: true,
    attributeFilter: [],    // Empty array = watch all attributes
    childList: false,
    subtree: false,
    characterData: false,
    ...options
  });
  
  return () => observer.disconnect();
}
```

### CMS Content Observation

From `nav_notifications.js` - Watching office hours indicator for status changes:

```javascript
/**
 * Observe a status indicator element for attribute changes
 * Used when CMS or external scripts update element state
 * 
 * @example
 * // HTML: <div data-office-hours="indicator" data-status="open">
 * observeOfficeHours();
 */
function observeOfficeHours() {
  const indicator = document.querySelector('[data-office-hours="indicator"]');
  if (!indicator) {
    console.log('Office hours indicator not found');
    return;
  }

  const getStatus = () => {
    const status = indicator.getAttribute('data-status');
    return (status === 'open' || status === 'closed') ? status : null;
  };

  let currentStatus = getStatus();

  const observer = new MutationObserver(() => {
    const newStatus = getStatus();
    if (newStatus !== currentStatus) {
      currentStatus = newStatus;
      console.log(`Status changed: ${newStatus}`);
      updateVisibility();
    }
  });

  observer.observe(indicator, {
    attributes: true,
    attributeFilter: ['data-status'],  // Only watch this specific attribute
  });

  state.cleanups.push(() => observer.disconnect());
}
```

**Key patterns:**
- **attributeFilter**: Only watch specific attributes to reduce callback frequency
- **Initial state capture**: Get the value before observing to detect actual changes
- **Cleanup storage**: Store disconnect function for proper teardown

### Cleanup Pattern

```javascript
/**
 * Cleanup pattern for MutationObserver
 * Store cleanup functions in a state array for batch disposal
 */
const state = {
  cleanups: [],
};

function init() {
  const observer = new MutationObserver(handleMutation);
  observer.observe(element, { attributes: true });
  state.cleanups.push(() => observer.disconnect());
}

function destroy() {
  state.cleanups.forEach(cleanup => cleanup());
  state.cleanups = [];
}
```

---

## 3. INTERSECTIONOBSERVER

### When to Use

- Scroll-based active states (Table of Contents, navigation highlighting)
- Lazy loading images/components
- Triggering animations when elements enter viewport
- Infinite scroll pagination
- Analytics (tracking element visibility)

### Basic Pattern

```javascript
/**
 * Basic IntersectionObserver setup
 * @param {Element[]} elements - Elements to observe
 * @param {IntersectionObserverCallback} callback - Handler for intersections
 * @param {IntersectionObserverInit} options - Observer configuration
 * @returns {IntersectionObserver} The observer instance
 */
function observe_intersections(elements, callback, options = {}) {
  const observer = new IntersectionObserver(callback, {
    root: null,           // null = viewport, or specify scroll container
    rootMargin: '0px',
    threshold: 0,
    ...options
  });

  elements.forEach(el => observer.observe(el));
  
  return observer;
}
```

### Multiple Thresholds

```javascript
/**
 * Multiple thresholds for progressive visibility tracking
 * Useful for parallax effects or visibility percentages
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const visibility = Math.round(entry.intersectionRatio * 100);
    entry.target.style.setProperty('--visibility', visibility);
  });
}, {
  threshold: [0, 0.25, 0.5, 0.75, 1]  // Fire at 0%, 25%, 50%, 75%, 100%
});
```

### Animation Start/Stop Pattern (0.1 Threshold)

Use a 0.1 (10%) threshold for animation visibility gates. This is early enough to start animations before the element is fully visible, giving time for preparation.

```javascript
/**
 * Animation visibility control with 0.1 threshold
 * Used for video autoplay, Swiper pagination, scroll-triggered animations
 *
 * WHY 0.1? Early enough for animation preparation without wasting resources
 * on barely-visible elements
 */
function observe_autoplay(elements, callbacks = {}) {
  const { on_visible = () => {}, on_hidden = () => {} } = callbacks;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Check both intersection AND ratio to avoid edge cases
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        on_visible(entry);
      } else if (!entry.isIntersecting) {
        on_hidden(entry);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1]  // Fire at 0% (exit) and 10% (enter)
  });

  elements.forEach(el => observer.observe(el));
  return observer;
}

// Example: Video autoplay control
const videos = document.querySelectorAll('video[autoplay]');
observe_autoplay(videos, {
  on_visible: (entry) => entry.target.play(),
  on_hidden: (entry) => entry.target.pause(),
});

// Example: Swiper autoplay control
const swipers = document.querySelectorAll('.swiper');
observe_autoplay(swipers, {
  on_visible: (entry) => entry.target.swiper?.autoplay?.start(),
  on_hidden: (entry) => entry.target.swiper?.autoplay?.stop(),
});
```

**Threshold Array Examples:**

| Threshold | Use Case |
|-----------|----------|
| `[0, 0.1]` | Animation start/stop (early trigger + exit detection) |
| `[0, 0.1, 0.25]` | Progressive loading (lazy → prepare → activate) |
| `[0, 0.25, 0.5, 0.75, 1]` | Parallax effects, visibility percentage tracking |
| `[0]` | Simple lazy loading (trigger when any pixel visible) |
| `[1]` | Trigger only when fully visible |

See [performance_patterns.js](../../assets/patterns/performance_patterns.js) for production-ready `observe_autoplay()` utility.

### rootMargin for Offset

From `table_of_content.js` - Using rootMargin to create a "detection zone":

```javascript
/**
 * rootMargin shrinks the effective viewport for intersection detection
 * 
 * Format: "top right bottom left" (like CSS margin)
 * Negative values = shrink viewport
 * Positive values = expand viewport
 * 
 * This creates a detection band in the upper portion of the viewport:
 * - Top 10% ignored (header area)
 * - Bottom 60% ignored (focus on upper content)
 */
const DEFAULT_CONFIG = {
  root_margin_top: "-10%",
  root_margin_bottom: "-60%",
};

function create_observer() {
  const root_margin = `${config.root_margin_top} 0px ${config.root_margin_bottom} 0px`;

  observer = new IntersectionObserver(handle_intersection, {
    root: null,
    rootMargin: root_margin,
    threshold: [0],
  });

  sections.forEach(section => observer.observe(section));
}
```

**Visual representation:**
```
+------------------------+
|   Ignored (10%)        |  <- root_margin_top: "-10%"
+------------------------+
|                        |
|   Detection Zone       |  <- Elements trigger here
|   (30% of viewport)    |
|                        |
+------------------------+
|                        |
|   Ignored (60%)        |  <- root_margin_bottom: "-60%"
|                        |
+------------------------+
```

### RAF Batching for Performance

From `table_of_content.js` - Batching DOM updates with requestAnimationFrame:

```javascript
let visible_sections = {};
let raf_pending = false;

/**
 * Handle intersection entries with RAF batching
 * Prevents layout thrashing from rapid intersection callbacks
 * 
 * @param {IntersectionObserverEntry[]} entries
 */
function handle_intersection(entries) {
  // 1. Update state (cheap)
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      visible_sections[id] = true;
    } else {
      delete visible_sections[id];
    }
  });

  // 2. Batch DOM updates with RAF (prevents multiple reflows)
  if (!raf_pending) {
    raf_pending = true;
    requestAnimationFrame(() => {
      const new_active = determine_active_section();
      update_toc_highlight(new_active);
      raf_pending = false;
    });
  }
}
```

**Why RAF batching matters:**
- IntersectionObserver can fire multiple times per frame
- Each DOM update causes browser reflow
- RAF consolidates updates to once per frame (60fps)
- Results in smooth, jank-free scrolling

### Cleanup Pattern

```javascript
let observer = null;

function init() {
  observer = new IntersectionObserver(handleIntersection, options);
  elements.forEach(el => observer.observe(el));
}

function destroy() {
  if (observer) {
    observer.disconnect();  // Stops observing all elements
    observer = null;
  }
}

// Alternative: stop observing specific element
function unobserve_element(element) {
  if (observer) {
    observer.unobserve(element);
  }
}
```

---

## 4. RESIZEOBSERVER

> **Note:** Not currently used in this codebase. Documented for reference.

### When to Use

- Container queries (before native CSS support)
- Canvas/chart resizing
- Custom responsive behavior beyond media queries
- Element-level responsive design

### Basic Pattern

```javascript
/**
 * ResizeObserver for element size changes
 * @param {Element} element - Element to observe
 * @param {ResizeObserverCallback} callback - Handler for size changes
 * @returns {Function} Cleanup function
 */
function observe_resize(element, callback) {
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  
  return () => observer.disconnect();
}

// Usage with debouncing (resize fires frequently)
const debouncedResize = debounce((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized: ${width}x${height}`);
  });
}, 100);

const cleanup = observe_resize(container, debouncedResize);
```

---

## 5. BEST PRACTICES

### Always Disconnect

Observers that aren't disconnected continue running and can cause:
- Memory leaks (retained references)
- Unnecessary CPU usage
- Bugs in SPA navigation (stale callbacks)

```javascript
const cleanups = [];

function setup() {
  const observer = new IntersectionObserver(callback);
  observer.observe(element);
  cleanups.push(() => observer.disconnect());
}

// Call on page unload or component destroy
function teardown() {
  cleanups.forEach(fn => fn());
  cleanups.length = 0;
}
```

### Debouncing Callbacks

MutationObserver can fire many times for batched DOM changes:

```javascript
/**
 * Debounce utility for observer callbacks
 */
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Usage
const debouncedHandler = debounce((mutations) => {
  console.log('Mutations settled:', mutations.length);
}, 100);

const observer = new MutationObserver(debouncedHandler);
```

### Memory Management

```javascript
/**
 * Memory-safe observer pattern
 * - WeakMap for element -> observer mapping
 * - Automatic cleanup when element is garbage collected
 */
const observerMap = new WeakMap();

function observe(element, callback) {
  // Prevent duplicate observers
  if (observerMap.has(element)) {
    return observerMap.get(element);
  }

  const observer = new IntersectionObserver(callback);
  observer.observe(element);
  observerMap.set(element, observer);

  return observer;
}

function unobserve(element) {
  const observer = observerMap.get(element);
  if (observer) {
    observer.disconnect();
    observerMap.delete(element);
  }
}
```

### Combining Observers

When using both MutationObserver and IntersectionObserver:

```javascript
/**
 * Combined observer pattern for dynamic content
 * 1. IntersectionObserver handles visibility
 * 2. MutationObserver handles DOM changes that add new elements
 */
function setup_combined_observers(container) {
  const cleanups = [];

  const intersectionObserver = new IntersectionObserver(handleVisibility);
  
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('.observable')) {
          intersectionObserver.observe(node);
        }
      });
    });
  });

  container.querySelectorAll('.observable').forEach(el => {
    intersectionObserver.observe(el);
  });

  mutationObserver.observe(container, { childList: true, subtree: true });

  cleanups.push(
    () => intersectionObserver.disconnect(),
    () => mutationObserver.disconnect()
  );

  return () => cleanups.forEach(fn => fn());
}
```

---

## 6. QUICK REFERENCE

| Observer | Events | Common Options |
|----------|--------|----------------|
| **MutationObserver** | DOM changes | `attributes`, `childList`, `subtree`, `attributeFilter` |
| **IntersectionObserver** | Visibility changes | `root`, `rootMargin`, `threshold` |
| **ResizeObserver** | Size changes | (element only) |

| Pattern | When to Use |
|---------|-------------|
| `attributeFilter` | Only care about specific attributes |
| `rootMargin` | Offset trigger point from viewport edge |
| `threshold: [0, 1]` | Know when element enters AND fully visible |
| RAF batching | Prevent jank from rapid callbacks |
| Cleanup arrays | SPA-safe resource management |

---

## 7. SHAREDOBSERVERS CONSOLIDATION PATTERN

### Overview

When a page has many scripts creating individual IntersectionObserver instances with the same options, the browser creates separate observer objects. The **SharedObservers** pattern consolidates these into a shared registry (`window.SharedObservers`) that multiplexes callbacks through fewer observer instances.

**Implemented in:** `shared_observers.js` (global script, loaded on all pages)

### API Surface

```javascript
// Primary: observe with shared observer (returns unobserve cleanup function)
const unobserve = window.SharedObservers.observe(element, callback, options);

// One-time observation (auto-unobserves after first intersection)
const unobserve = window.SharedObservers.observeOnce(element, callback, options);

// Convenience presets with predefined thresholds/margins:
window.SharedObservers.visibility.observe(element, callback);  // threshold: 0
window.SharedObservers.lazy.observe(element, callback);        // rootMargin: '200px'
window.SharedObservers.full.observe(element, callback);        // threshold: 1.0
```

**Key concept:** Options are serialized to a config key (`JSON.stringify`). All observers with identical options share a single `IntersectionObserver` instance.

### Migration Pattern (Single Element)

When migrating a script from raw `IntersectionObserver` to `SharedObservers`:

```javascript
// ─── BEFORE: Raw IntersectionObserver ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) handle_visible(entry);
    else handle_hidden(entry);
  });
}, { threshold: [0, 0.1, 0.25], rootMargin: '20% 0px 20% 0px' });

observer.observe(player);
// Cleanup: observer.disconnect();

// ─── AFTER: SharedObservers with fallback ───
const viewport_handler = (entry) => {
  if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
    handle_visible(entry);
  } else if (!entry.isIntersecting) {
    handle_hidden(entry);
  }
};

const viewport_options = { threshold: [0, 0.1, 0.25], rootMargin: '20% 0px 20% 0px' };

if (window.SharedObservers) {
  const unobserve = window.SharedObservers.observe(player, viewport_handler, viewport_options);
  add_cleanup(unobserve);  // Store for teardown
} else {
  // Fallback: raw IntersectionObserver if SharedObservers not loaded
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(viewport_handler),
    viewport_options,
  );
  observer.observe(player);
  add_cleanup(() => observer.disconnect());
}
```

**Key points:**
- **Always provide fallback** — SharedObservers may not be loaded yet (script order)
- **Extract callback** — The handler function works with both paths (single entry)
- **Cleanup function** — `SharedObservers.observe()` returns an unobserve function (same interface as cleanup array pattern)

### Migration Pattern (Multiple Elements)

When observing multiple elements (e.g., TOC sections), collect unobserve functions:

```javascript
// ─── From table_of_content.js ───
function create_observer() {
  const root_margin = `${config.root_margin_top} 0px ${config.root_margin_bottom} 0px`;
  const observer_options = { root: null, rootMargin: root_margin, threshold: [0] };

  if (window.SharedObservers) {
    const unobserve_fns = [];
    sections.forEach((section) => {
      unobserve_fns.push(
        window.SharedObservers.observe(section, handle_intersection, observer_options)
      );
    });
    // Wrap cleanup in disconnect-compatible interface
    observer = { disconnect: () => unobserve_fns.forEach((fn) => fn()) };
  } else {
    observer = new IntersectionObserver(handle_intersection, observer_options);
    sections.forEach((section) => observer.observe(section));
  }
}
```

**Key insight:** Wrap unobserve functions in a `{ disconnect: () => ... }` object to maintain compatibility with existing teardown code that calls `observer.disconnect()`.

### When to Use SharedObservers

| Scenario | Use SharedObservers | Use Raw IO |
|----------|:-------------------:|:----------:|
| Multiple scripts observe with same options | Yes | - |
| Global script loaded on all pages | Yes | - |
| Single script, unique options | - | Yes |
| No dependency on global load order | - | Yes |
| Convenience presets (lazy, visibility) | Yes | - |

### Benefits

- **Fewer observer instances** — Scripts with matching options share one browser observer
- **Consistent cleanup API** — All paths return an unobserve function
- **Presets** — `visibility`, `lazy`, `full` presets reduce boilerplate
- **No breaking change** — Fallback to raw IO preserves behavior when SharedObservers isn't available

---

## 8. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns using observers
- [webflow_patterns.md](./webflow_patterns.md) - Collection list patterns that use MutationObserver
- [animation_workflows.md](./animation_workflows.md) - IntersectionObserver for scroll-triggered animations
- [performance_patterns.md](./performance_patterns.md) - Lazy loading with IntersectionObserver
- `shared_observers.js` (global) - SharedObservers registry implementation
