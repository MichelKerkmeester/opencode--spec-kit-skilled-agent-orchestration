---
title: Code Quality Standards
description: Quality patterns for initialization, error handling, validation, async operations, and performance
---

# Code Quality Standards

Quality patterns ensuring reliable, safe, and performant frontend code.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Code quality patterns for frontend development covering initialization, error handling, validation, async operations, and performance.

### Core Principle
Defensive code prevents runtime errors. Quality patterns ensure reliability.

### Key Sources
- Section 2 - CDN-safe initialization pattern (MANDATORY for all components)
- Sections 3-8 - Safety and error handling patterns
- Sections 12-14 - Cleanup, shared listeners, and WeakMap caching patterns
- [animation_workflows.md](../implementation/animation_workflows.md) - Complete animation implementation guide
- [code_style_guide.md](./code_style_guide.md) - Naming conventions, file structure, commenting rules

### When to Use
- Writing new components (initialization pattern)
- Adding error handling and validation
- Implementing async operations
- Optimizing performance
- Managing component lifecycle (cleanup/destroy)
- Handling events across dynamic elements (shared listeners)
- Caching DOM element state (WeakMap patterns)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:initialization-pattern-cdn-safe -->
## 2. INITIALIZATION PATTERN (CDN-SAFE)

### The Standard Pattern (COPY EXACTLY)

**Every component MUST use this pattern:**

```javascript
/* ─────────────────────────────────────────────────────────────
   INITIALIZE
──────────────────────────────────────────────────────────────── */
const INIT_FLAG = '__componentNameCdnInit';  // Unique per component
const INIT_DELAY_MS = 50;                     // Adjust per component

function init_component() {
  // Your initialization code here
}

const start = () => {
  // Guard: Prevent double initialization
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // If DOM already loaded, delay before initializing
  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  // Otherwise, wait for DOMContentLoaded with delay
  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

// Prefer Webflow.push, fallback to immediate start
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

### Why This Pattern Exists

| Requirement              | Implementation                              | Why Needed                                                     |
| ------------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| **Guard Flag**           | `if (window[INIT_FLAG]) return;`            | Prevents double initialization during Webflow page transitions |
| **Delayed Execution**    | `setTimeout(init_component, INIT_DELAY_MS)` | Ensures DOM and dependencies (Motion.dev) fully ready          |
| **Webflow.push Support** | `window.Webflow.push(start)`                | Integrates with Webflow's native queueing system               |
| **Once-Only Listener**   | `{ once: true }`                            | Prevents memory leaks from duplicate listeners                 |

### When to Adjust INIT_DELAY_MS

| Delay              | When to Use                         | Example                                     |
| ------------------ | ----------------------------------- | ------------------------------------------- |
| **0ms**            | No dependencies, simple DOM queries | Copyright year updater                      |
| **50ms** (default) | Standard components                 | Forms, accordions, navigation               |
| **100ms+**         | Heavy dependencies                  | Hero animations (Motion.dev), video players |

---

<!-- /ANCHOR:initialization-pattern-cdn-safe -->
<!-- ANCHOR:dom-safety-patterns -->
## 3. DOM SAFETY PATTERNS

### Element Existence Checks

```javascript
// Guard early for required elements
if (!btn || !dropdown) continue;
if (!video) return;

// Multiple elements check
const elements = document.querySelectorAll('.item');
if (elements.length === 0) return;
```

### Optional Chaining for Safe Access

```javascript
// Safe property access
window.Webflow?.push
element.classList?.contains('active')
field?.getAttribute('type')

// Safe method calls
video?.pause?.()
observer?.disconnect?.()
```

### Node Type Validation

```javascript
// Validate element nodes (nodeType 1 = Element)
function is_element(node) {
  return node && node.nodeType === 1;
}

// Use in MutationObserver callbacks
mutation.addedNodes.forEach((node) => {
  if (is_element(node)) {
    // Safe to use as element
  }
});
```

### Chained Fallback Pattern

```javascript
// Try preferred selector, fallback to parent
return field.closest(SELECTOR) || field.parentElement;

// Multiple fallback chain
const container = element.closest('.wrapper') 
  || element.closest('.container') 
  || element.parentElement;
```

---

<!-- /ANCHOR:dom-safety-patterns -->
<!-- ANCHOR:error-handling-patterns -->
## 4. ERROR HANDLING PATTERNS

### Silent Catch for Non-Critical Operations

```javascript
// Pause/play may fail if video not ready - safe to ignore
try { video.pause(); } catch (_) { }

// Focus may fail on hidden elements
try { input.focus(); } catch (_) { }
```

### Storage with Safari Private Mode Fallback

```javascript
// localStorage throws in Safari private browsing
function get_storage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch { return null; }
}

function set_storage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}
```

### Library Loading with Retry

```javascript
// Check library availability with retry
if (typeof Hls === 'undefined') {
  console.warn('HLS.js not loaded yet, retrying...');
  setTimeout(init_function, 100);
  return;
}

// Motion.dev availability check
if (!window.Motion) {
  console.warn('Motion.dev not loaded, retrying...');
  setTimeout(init_animations, 100);
  return;
}
```

### Debug Mode Pattern

```javascript
const CONFIG = { debug: false };

function log(...args) {
  if (CONFIG.debug) console.log('[Component]', ...args);
}

// Enable via public API
window.ComponentName = {
  debug: (on) => { CONFIG.debug = Boolean(on); },
};
```

---

<!-- /ANCHOR:error-handling-patterns -->
<!-- ANCHOR:async-patterns -->
## 5. ASYNC PATTERNS

### Safe Play with Promise Handling

```javascript
// Video play returns promise in modern browsers
function safe_play(video) {
  const p = video.play();
  if (p && typeof p.then === 'function') {
    p.catch(() => {}); // Ignore autoplay restrictions
  }
}
```

### Debounce Utility

```javascript
// Standard debounce with cancel support
const debounce = (fn, delay = 300) => {
  let timer;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
};

// Usage
const handle_resize = debounce(() => {
  recalculate_layout();
}, 250);
```

### Throttle Utility

```javascript
// Throttle for scroll/resize events
const throttle = (fn, limit = 100) => {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
};
```

---

<!-- /ANCHOR:async-patterns -->
<!-- ANCHOR:observer-patterns -->
## 6. OBSERVER PATTERNS

### IntersectionObserver for Visibility-Triggered Actions

```javascript
// Lazy load or animate when visible
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Element visible - trigger action
      entry.target.classList.add('visible');
    } else {
      // Element hidden
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

// Observe elements
document.querySelectorAll('.lazy-load').forEach((el) => io.observe(el));
```

### MutationObserver for Dynamic Content

```javascript
// Watch for dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // Process new element
        if (node.matches('.target-class')) {
          init_element(node);
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Cleanup when done
// observer.disconnect();
```

### ResizeObserver for Layout Changes

```javascript
// Watch element size changes
const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    update_layout(width, height);
  }
});

ro.observe(container);
```

---

<!-- /ANCHOR:observer-patterns -->
<!-- ANCHOR:validation-patterns -->
## 7. VALIDATION PATTERNS

### Type-Safe Number Parsing

```javascript
// Safe parseInt with fallback
function parse_int(value, fallback = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Safe parseFloat with fallback
function parse_float(value, fallback = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}
```

### Secure Randomness (CWE-330 Fix)

```javascript
// Use crypto.getRandomValues instead of Math.random for IDs
let counter = (function() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 10000;
  }
  // Fallback for older browsers
  return Math.floor(Math.random() * 10000);
})();

function generate_id(prefix = 'id') {
  return `${prefix}_${++counter}`;
}
```

### String Validation

```javascript
// Non-empty string check
function is_non_empty_string(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// Email format validation (basic)
function is_valid_email(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

<!-- /ANCHOR:validation-patterns -->
<!-- ANCHOR:performance-patterns -->
## 8. PERFORMANCE PATTERNS

### RequestAnimationFrame for Visual Updates

```javascript
// Batch visual updates to animation frame
let raf_pending = false;

function schedule_update() {
  if (!raf_pending) {
    raf_pending = true;
    requestAnimationFrame(() => {
      update_visuals();
      raf_pending = false;
    });
  }
}
```

### GPU Acceleration Hints

```javascript
// Apply before animation
element.style.willChange = 'transform';
element.style.transform = 'translateZ(0)';

// Remove after animation completes
function on_animation_complete() {
  element.style.willChange = 'auto';
}
```

### Debounced Resize Handlers

```javascript
// Prevent excessive resize calculations
let resize_timer;
window.addEventListener('resize', () => {
  clearTimeout(resize_timer);
  resize_timer = setTimeout(handle_resize, 250);
});
```

### Efficient Event Delegation

```javascript
// Single listener for multiple elements
container.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  
  const action = btn.dataset.action;
  handle_action(action, btn);
});
```

---

<!-- /ANCHOR:performance-patterns -->
<!-- ANCHOR:animation-quality-patterns -->
## 9. ANIMATION QUALITY PATTERNS

### Quick Decision Tree

```
Need animation?
├─> Can CSS express it (transform/opacity)?
│   └─> Use CSS transitions/keyframes
└─> Requires sequencing/scroll/in-view logic?
    └─> Use Motion.dev
```

### Essential Patterns

**CSS animations (first choice):**
- Use GPU-accelerated properties only (transform, opacity)
- Add `prefers-reduced-motion` support (MANDATORY)
- Timing: 200-400ms for most interactions

**Motion.dev (for complexity):**
- Library loading: Global ES module import in global.html
- Retry pattern: Check `window.Motion` with setTimeout fallback
- Standardized easing: `[0.22, 1, 0.36, 1]` (ease-out), `[0.16, 1, 0.3, 1]` (expo-out)
- Performance: Remove `will-change` in `onComplete`

### Complete Animation Guide

**For implementation, debugging, and testing:**
- **Decision tree and patterns:** [animation_workflows.md](../implementation/animation_workflows.md)
- **Complete reference:** [animation_workflows.md](../implementation/animation_workflows.md) contains all animation policy, rationale, and implementation details

---

<!-- /ANCHOR:animation-quality-patterns -->
<!-- ANCHOR:css-quality-patterns -->
## 10. CSS QUALITY PATTERNS

### will-change Management

```css
/* Set will-change in JavaScript BEFORE animation starts */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes (via JavaScript) */
.animation-complete {
  will-change: auto;
}
```

### GPU-Accelerated Properties Only

```css
.animated-element {
  /* ✅ GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  
  /* ❌ Layout properties - AVOID ANIMATING */
  /* width, height, top, left, padding, margin */
}
```

### Easing Standards (Aligned with Motion.dev)

```css
/* General purpose - smooth deceleration */
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

/* Dramatic entrances - strong deceleration */
transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

### Fluid Typography Formula

```css
/* Core formula: base + coefficient * viewport width */
html {
  font-size: calc(var(--base) * 1rem + var(--coefficient) * 1vw);
}

/* Breakpoint-specific values */
@media screen and (max-width: 1920px) {
  :root {
    --font-from: 15;
    --font-to: 16;
    --vw-from: calc(1440 / 100);
    --vw-to: calc(1920 / 100);
  }
}
```

---

<!-- /ANCHOR:css-quality-patterns -->
<!-- ANCHOR:state-management-patterns -->
## 11. STATE MANAGEMENT PATTERNS

### Module-Level State with Cleanup

```javascript
let is_initialized = false;
let cleanup_handlers = [];

function init() {
  if (is_initialized) return;
  is_initialized = true;
  
  // Setup with cleanup tracking
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  cleanup_handlers.push(() => window.removeEventListener('resize', handler));
}

function cleanup() {
  cleanup_handlers.forEach((fn) => fn());
  cleanup_handlers = [];
  is_initialized = false;
}
```

### Data Attribute State

```javascript
// Use data attributes for element state
function set_status(element, value) {
  element.setAttribute('data-status', value);
}

function get_status(element) {
  return element.getAttribute('data-status');
}

// CSS can target state
// [data-status="loading"] { opacity: 0.5; }
// [data-status="ready"] { opacity: 1; }
```

### Public API Exposure

```javascript
// Expose controlled API on window
window.ComponentName = {
  init,
  refresh,
  cleanup,
  debug: (on) => { CONFIG.debug = Boolean(on); },
};
```

---

<!-- /ANCHOR:state-management-patterns -->
<!-- ANCHOR:cleanup-destroy-patterns -->
## 12. CLEANUP/DESTROY PATTERNS

Proper resource cleanup prevents memory leaks and ensures components can be safely reinitialized.

### Component Cleanup Pattern (COPY EXACTLY)

```javascript
/* ─────────────────────────────────────────────────────────────
   CLEANUP PATTERN - Comprehensive resource cleanup
──────────────────────────────────────────────────────────────── */
let observer = null;
let handler = null;
let interval = null;
const instances = new Map();

function cleanup() {
  // 1. Disconnect observers
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // 2. Remove event listeners (must have stored reference)
  if (handler) {
    document.removeEventListener('click', handler);
    handler = null;
  }

  // 3. Clear intervals and timeouts
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  // 4. Clear instance collections
  instances.clear();

  // 5. Reset initialization flag (allows reinit)
  window[INIT_FLAG] = false;
}

// Expose cleanup on public API
window.ComponentName = {
  init,
  cleanup,
  refresh: () => { cleanup(); init(); },
};
```

### What Must Be Cleaned Up

| Resource Type            | Cleanup Method                       | Why                                           |
| ------------------------ | ------------------------------------ | --------------------------------------------- |
| **IntersectionObserver** | `observer.disconnect()`              | Continues firing callbacks if not stopped     |
| **MutationObserver**     | `observer.disconnect()`              | Watches DOM indefinitely                      |
| **ResizeObserver**       | `observer.disconnect()`              | Fires on every size change                    |
| **Event Listeners**      | `removeEventListener(type, handler)` | Keeps reference to handler function           |
| **setInterval**          | `clearInterval(intervalId)`          | Runs forever until cleared                    |
| **setTimeout**           | `clearTimeout(timeoutId)`            | May fire after component destroyed            |
| **Map/Set instances**    | `collection.clear()`                 | Holds references preventing garbage collection|

### Cleanup Timing

```javascript
// Pattern: Track all cleanups in array
let cleanups = [];

function setup() {
  // Track each resource for cleanup
  const resizeHandler = () => update_layout();
  window.addEventListener('resize', resizeHandler);
  cleanups.push(() => window.removeEventListener('resize', resizeHandler));

  const io = new IntersectionObserver(handle_visibility);
  elements.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  const intervalId = setInterval(poll_status, 1000);
  cleanups.push(() => clearInterval(intervalId));
}

function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
```

### Webflow Page Transition Cleanup

```javascript
// Re-run cleanup on Webflow page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Cleanup previous state before reinit
  cleanup();
});

// Or use Webflow's built-in event
if (window.Webflow) {
  window.Webflow.ready(() => {
    cleanup();
    init();
  });
}
```

---

<!-- /ANCHOR:cleanup-destroy-patterns -->
<!-- ANCHOR:shared-document-listener-pattern -->
## 13. SHARED DOCUMENT LISTENER PATTERN

Single document-level listener for all instances improves performance over per-element listeners.

### The Pattern (Event Delegation)

```javascript
/* ─────────────────────────────────────────────────────────────
   SHARED LISTENER - Single document handler for all instances
──────────────────────────────────────────────────────────────── */
const SELECTOR = '[data-component]';
let listener_attached = false;

function handle_document_click(e) {
  // Find the component element (or null if click outside)
  const target = e.target.closest(SELECTOR);
  if (!target) return;

  // Route to appropriate handler based on data attributes
  const action = target.dataset.action;
  if (action === 'toggle') toggle_item(target);
  if (action === 'expand') expand_item(target);
  if (action === 'close') close_item(target);
}

function init_shared_listener() {
  // Guard: Only attach once
  if (listener_attached) return;
  listener_attached = true;

  document.addEventListener('click', handle_document_click);
}

function cleanup_shared_listener() {
  if (!listener_attached) return;
  document.removeEventListener('click', handle_document_click);
  listener_attached = false;
}
```

### Performance Benefits

| Approach                   | Listeners | Memory      | Dynamic Elements |
| -------------------------- | --------- | ----------- | ---------------- |
| Per-element listeners      | N         | O(N)        | Must rebind      |
| **Shared document listener** | 1         | O(1)        | Auto-handled     |

### When to Use Each Approach

```
Need to handle clicks on .item elements?
├─> Elements are static (known at init time)?
│   └─> Per-element OK for small sets (<10 elements)
└─> Elements are dynamic (added/removed)?
    └─> USE SHARED DOCUMENT LISTENER
```

### Action Routing Pattern

```javascript
// Map actions to handlers for clean routing
const ACTIONS = {
  toggle: (el) => el.classList.toggle('active'),
  expand: (el) => el.setAttribute('aria-expanded', 'true'),
  collapse: (el) => el.setAttribute('aria-expanded', 'false'),
  remove: (el) => el.remove(),
};

function handle_action(e) {
  const trigger = e.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  const target_id = trigger.dataset.target;
  const target = target_id
    ? document.getElementById(target_id)
    : trigger;

  if (ACTIONS[action] && target) {
    ACTIONS[action](target);
  }
}
```

### Multiple Event Types

```javascript
// Single attachment point for multiple events
const EVENTS = ['click', 'keydown', 'focusin', 'focusout'];
let events_attached = false;

function attach_events() {
  if (events_attached) return;
  events_attached = true;

  EVENTS.forEach((type) => {
    document.addEventListener(type, route_event, { passive: true });
  });
}

function route_event(e) {
  const target = e.target.closest(SELECTOR);
  if (!target) return;

  switch (e.type) {
    case 'click': handle_click(target, e); break;
    case 'keydown': handle_keydown(target, e); break;
    case 'focusin': handle_focus(target, true); break;
    case 'focusout': handle_focus(target, false); break;
  }
}
```

---

<!-- /ANCHOR:shared-document-listener-pattern -->
<!-- ANCHOR:weakmap-weakset-caching-patterns -->
## 14. WEAKMAP/WEAKSET CACHING PATTERNS

WeakMap and WeakSet allow caching data against DOM elements without preventing garbage collection.

### WeakMap for Element Metadata

```javascript
/* ─────────────────────────────────────────────────────────────
   WEAKMAP CACHING - Associate data with elements safely
──────────────────────────────────────────────────────────────── */
const element_cache = new WeakMap();

function get_element_data(el) {
  if (!element_cache.has(el)) {
    // Compute and cache on first access
    element_cache.set(el, {
      id: generate_id('el'),
      bounds: el.getBoundingClientRect(),
      initialized: false,
    });
  }
  return element_cache.get(el);
}

function init_element(el) {
  const data = get_element_data(el);
  if (data.initialized) return; // Already done

  data.initialized = true;
  setup_element(el, data);
}
```

### Why WeakMap Over Regular Map

| Feature               | Map                        | WeakMap                    |
| --------------------- | -------------------------- | -------------------------- |
| Key types             | Any                        | Objects only               |
| Key enumerable        | Yes (`.keys()`, `.size`)   | No                         |
| Prevents GC           | **Yes** (memory leak risk) | **No** (auto-cleanup)      |
| Use for DOM elements  | Risky                      | **Safe**                   |

```javascript
// ❌ WRONG: Regular Map holds references
const cache = new Map();
cache.set(element, data);
// If element removed from DOM, cache still holds reference = LEAK

// ✅ CORRECT: WeakMap allows garbage collection
const cache = new WeakMap();
cache.set(element, data);
// If element removed from DOM, entry is auto-cleaned
```

### Instance Binding Guard Pattern

```javascript
/* ─────────────────────────────────────────────────────────────
   BINDING GUARD - Prevent double-initialization of elements
──────────────────────────────────────────────────────────────── */
const BOUND_KEY = '__componentBound';

function bind_element(el) {
  // Guard: Already bound?
  if (el[BOUND_KEY]) return false;
  el[BOUND_KEY] = true;

  // Perform one-time setup
  setup_handlers(el);
  return true;
}

function unbind_element(el) {
  if (!el[BOUND_KEY]) return;
  el[BOUND_KEY] = false;
  teardown_handlers(el);
}

// Usage in init
function init_all() {
  document.querySelectorAll(SELECTOR).forEach((el) => {
    bind_element(el); // Safe to call multiple times
  });
}
```

### WeakSet for Processed Elements

```javascript
// Track which elements have been processed
const processed = new WeakSet();

function process_element(el) {
  if (processed.has(el)) return; // Skip if already done
  processed.add(el);

  // One-time processing
  el.classList.add('processed');
  attach_behavior(el);
}

// Safe to call on same elements repeatedly
document.querySelectorAll('.item').forEach(process_element);
```

### Combined Pattern: WeakMap + Binding Guard

```javascript
/* ─────────────────────────────────────────────────────────────
   COMPLETE CACHING PATTERN - WeakMap + binding guard
──────────────────────────────────────────────────────────────── */
const instances = new WeakMap();
const BOUND_FLAG = '__accordionBound';

function create_instance(el) {
  return {
    id: generate_id('accordion'),
    expanded: false,
    panel: el.querySelector('.panel'),
    trigger: el.querySelector('.trigger'),
  };
}

function init_accordion(el) {
  // Binding guard
  if (el[BOUND_FLAG]) return instances.get(el);
  el[BOUND_FLAG] = true;

  // Create and cache instance
  const instance = create_instance(el);
  instances.set(el, instance);

  // Setup
  instance.trigger?.addEventListener('click', () => toggle(el));

  return instance;
}

function toggle(el) {
  const instance = instances.get(el);
  if (!instance) return;

  instance.expanded = !instance.expanded;
  instance.panel?.classList.toggle('open', instance.expanded);
}

function cleanup_accordion(el) {
  if (!el[BOUND_FLAG]) return;
  el[BOUND_FLAG] = false;
  // WeakMap entry auto-cleans when el is garbage collected
}
```

### Observer with WeakMap State

```javascript
// Store observer state per element
const observer_state = new WeakMap();

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const state = observer_state.get(entry.target) || { seen: false };

    if (entry.isIntersecting && !state.seen) {
      state.seen = true;
      observer_state.set(entry.target, state);
      animate_in(entry.target);
    }
  });
});

function observe_element(el) {
  observer_state.set(el, { seen: false });
  io.observe(el);
}
```

---

<!-- /ANCHOR:weakmap-weakset-caching-patterns -->
<!-- ANCHOR:quick-reference-checklist -->
## 15. QUICK REFERENCE CHECKLIST

Before deploying any component:

**Initialization:**
- [ ] Unique `INIT_FLAG` constant
- [ ] `INIT_DELAY_MS` constant (50ms default)
- [ ] Guard check and set present
- [ ] DOM readiness with setTimeout
- [ ] `{ once: true }` on event listener
- [ ] Webflow.push with fallback

**DOM Safety:**
- [ ] Element existence checks before use
- [ ] Optional chaining for uncertain properties
- [ ] Node type validation in observers

**Error Handling:**
- [ ] Silent catch for non-critical operations
- [ ] Storage access wrapped in try/catch
- [ ] Library loading with retry logic
- [ ] Debug mode for development

**Async:**
- [ ] Video play promises handled
- [ ] Debounce on rapid-fire events
- [ ] Throttle on scroll/resize handlers

**Performance:**
- [ ] RequestAnimationFrame for visual updates
- [ ] GPU-accelerated properties for animation
- [ ] `will-change` cleanup on completion
- [ ] Event delegation where appropriate

**Animation:**
- [ ] CSS used for simple transitions
- [ ] Motion.dev for complex sequences
- [ ] `prefers-reduced-motion` support

**Cleanup/Destroy:**
- [ ] Observers disconnected (`disconnect()`)
- [ ] Event listeners removed (stored handler reference)
- [ ] Intervals/timeouts cleared
- [ ] Instance collections cleared
- [ ] Cleanup exposed on public API

**Shared Listeners:**
- [ ] Document-level delegation for dynamic elements
- [ ] Single listener attachment guard
- [ ] Action routing via data attributes

**Caching:**
- [ ] WeakMap for DOM element metadata (not Map)
- [ ] Binding guard (`__componentBound`) for double-init prevention
- [ ] WeakSet for processed element tracking

---

<!-- /ANCHOR:quick-reference-checklist -->
<!-- ANCHOR:related-resources -->
## 16. RELATED RESOURCES

### Style Guide
- [code_style_guide.md](./code_style_guide.md) - Naming conventions, file structure, commenting rules

### Reference Files
- [animation_workflows.md](../implementation/animation_workflows.md) - Complete animation implementation guide for CSS and Motion.dev patterns
- [implementation_workflows.md](../implementation/implementation_workflows.md) - Condition-based waiting and validation patterns
- [webflow_patterns.md](../implementation/webflow_patterns.md) - Webflow-specific patterns requiring CDN-safe initialization
- [debugging_workflows.md](../debugging/debugging_workflows.md) - Debugging workflows for pattern compliance
- [verification_workflows.md](../verification/verification_workflows.md) - Verification workflows for code standards and accessibility testing

---

**Core principle:** These quality patterns ensure reliable, safe, and performant frontend code that integrates seamlessly with Webflow's CDN delivery and lifecycle.
<!-- /ANCHOR:related-resources -->
