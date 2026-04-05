---
title: Implementation Workflows - Phase 1
description: Three specialized workflows for writing robust frontend code with proper timing, validation, and cache management.
---

# Implementation Workflows - Phase 1

Three specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

### Prerequisites
Follow code quality standards for all implementations:
- **Naming:** Use `snake_case` for functions/variables, semantic prefixes (`is_`, `has_`, `get_`, etc.)
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Animation:** CSS first, Motion.dev for complexity - see [animation_workflows.md](./animation_workflows.md)
- **Webflow:** Collection list patterns, async rendering - see [webflow_patterns.md](./webflow_patterns.md)
- See [code_quality_standards.md](../standards/code_quality_standards.md) for complete standards

### When to Use
- Handling async operations and race conditions
- Validating data and inputs
- Managing CDN assets and caching

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:condition-based-waiting -->
## 2. CONDITION-BASED WAITING

**When to use**: DOM elements not ready, async libraries loading, race conditions, timing issues

### Core Principle

Wait for the actual condition you care about, not a guess about how long it takes.

```javascript
// ❌ BEFORE: Guessing at timing
setTimeout(() => {
  const video = document.querySelector('[video-hero]');
  initializeVideo(video); // Might be null!
}, 100); // Why 100ms? Will it be enough on slow devices?

// ✅ AFTER: Waiting for condition
wait_for_element('[video-hero]').then(video => {
  init_video(video); // Guaranteed to exist
});
```

### Common Patterns

| Scenario | Arbitrary Delay | Condition-Based | Why Better |
|----------|----------------|-----------------|------------|
| **Wait for DOM element** | `setTimeout(() => querySelector(), 50)` | `wait_for_element(selector)` | Works regardless of load speed |
| **Wait for external library** | `setTimeout(() => new Hls(), 200)` | `wait_for_library('Hls')` | CDN speed varies |
| **Wait for image load** | `setTimeout(() => useImage(), 1000)` | `img.onload` or `wait_for_image_load(img)` | Image size varies |
| **Wait for animation end** | `setTimeout(() => next(), 500)` | `element.addEventListener('transitionend')` | Animation duration might change |
| **Wait for video ready** | `setTimeout(() => video.play(), 2000)` | `video.addEventListener('canplay')` | Network speed varies |
| **Wait for font load** | `setTimeout(() => measure(), 100)` | `document.fonts.ready` | Font loading varies |

### Implementation Patterns

#### Pattern 1: Wait for DOM Element

```javascript
async function wait_for_element(selector, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;

    // Check every 50ms
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Element ${selector} not found after ${timeout}ms`);
}

// Usage
wait_for_element('[page-loader]')
  .then(loader => {
    // Element guaranteed to exist
    init_page_loader(loader);
  })
  .catch(error => {
    console.error('Page loader element not found:', error);
  });
```

#### Pattern 2: Wait for External Library

```javascript
async function wait_for_library(global_name, timeout = 10000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (typeof window[global_name] !== 'undefined') {
      return window[global_name];
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Library ${global_name} not loaded after ${timeout}ms`);
}

// Usage
wait_for_library('Hls')
  .then(Hls => {
    console.log('HLS.js loaded, initializing video...');
    init_video(Hls);
  })
  .catch(error => {
    console.error('HLS.js failed to load:', error);
    // Fallback to native video
    init_fallback_video();
  });
```

#### Pattern 3: Wait for Image Load

```javascript
function wait_for_image_load(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      // Image already loaded
      resolve(img);
    } else {
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () => reject(new Error('Image failed to load')));
    }
  });
}

// Usage
const img = document.querySelector('[hero-image]');
wait_for_image_load(img)
  .then(loaded_img => {
    const width = loaded_img.offsetWidth; // Guaranteed to have dimensions
    calculate_layout(width);
  })
  .catch(error => {
    console.error('Image load failed:', error);
    use_default_layout();
  });
```

#### Pattern 4: Wait for Animation End

```javascript
function wait_for_transition_end(element, property = null) {
  return new Promise(resolve => {
    function handler(event) {
      // If property specified, only resolve for that property
      if (property && event.propertyName !== property) return;

      element.removeEventListener('transitionend', handler);
      resolve(event);
    }

    element.addEventListener('transitionend', handler);
  });
}

// Usage
element.classList.add('fade-out');
await wait_for_transition_end(element, 'opacity');
element.remove(); // Animation guaranteed complete
```

**See also:** [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide including CSS patterns, Motion.dev integration, and performance optimization.

#### Pattern 5: DOM Content Ready

```javascript
function dom_ready() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // DOM already ready
      resolve();
    }
  });
}

// Usage
dom_ready().then(() => {
  console.log('DOM ready, initializing...');
  init_app();
});
```

#### Pattern 6: RAF Loop with Throttling

Use requestAnimationFrame loops for smooth animations. RAF auto-throttles to ~1fps in background tabs - no manual visibility management needed.

```javascript
/**
 * Create a throttled requestAnimationFrame loop
 * RAF natively runs at ~60fps (~16ms), but can be throttled for less critical animations
 *
 * TIMING:
 * - 0ms (default): RAF native ~60fps, ideal for smooth animations
 * - 64ms: ~15fps, good for particle effects or secondary animations
 *
 * BROWSER INSIGHT: RAF auto-throttles to ~1fps in background tabs
 * No need for manual document.hidden checks!
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
    get running() { return running; }
  };
}

// Usage: Smooth animation loop (RAF native ~60fps)
const animation_loop = create_raf_loop((timestamp) => {
  update_animation(timestamp);
});

animation_loop.start();
// Later...
animation_loop.stop();

// Usage: Throttled particle system (~15fps)
const particle_loop = create_raf_loop((timestamp) => {
  update_particles(timestamp);
}, 64);  // 64ms = ~15fps
```

See [performance_patterns.js](../../assets/patterns/performance_patterns.js) for production-ready RAF utilities.

### Rules

**ALWAYS:**
- Wait for actual conditions, not arbitrary timeouts
- Include timeout limits (default 5-10 seconds)
- Provide clear error messages when timeouts occur
- Use promises for async waiting
- Handle both success and error cases
- Log when waiting completes successfully
- Document WHY waiting is necessary

**NEVER:**
- Use `setTimeout` without documenting WHY
- Wait without timeout (infinite loops)
- Ignore timeout errors silently
- Poll faster than 10ms (wastes CPU)
- Assume elements exist without checking
- Chain multiple arbitrary timeouts

**See also:** [wait_patterns.js](../../assets/patterns/wait_patterns.js) for production-ready code templates

---

<!-- /ANCHOR:condition-based-waiting -->
<!-- ANCHOR:defense-in-depth-validation -->
## 3. DEFENSE-IN-DEPTH VALIDATION

**When to use**: Form handling, API calls, DOM manipulation, user input, third-party data integration

### Core Principle

Validate at EVERY layer data passes through. Make bugs structurally impossible.

### The Four Layers

#### Layer 1: Entry Point Validation

Reject obviously invalid input at function boundary.

```javascript
function init_video(video_element, config) {
  // Layer 1: Entry validation
  if (!video_element) {
    console.error('[Video] Element is required');
    return null;
  }

  if (!(video_element instanceof HTMLVideoElement)) {
    console.error('[Video] Must be HTMLVideoElement, got:', video_element);
    return null;
  }

  if (!config || typeof config !== 'object') {
    console.error('[Video] Config must be object, got:', config);
    return null;
  }

  // Proceed with initialization...
}
```

#### Layer 2: Processing Validation

Ensure data makes sense for this operation.

```javascript
function update_video_source(video_element, new_source) {
  // Layer 1: Entry validation
  if (!video_element || !new_source) {
    console.error('[Video] Missing required parameters');
    return false;
  }

  // Layer 2: Processing validation
  if (typeof new_source !== 'string' || new_source.trim() === '') {
    console.error('[Video] Source must be non-empty string');
    return false;
  }

  if (!new_source.match(/\.(mp4|webm|m3u8)$/i)) {
    console.error('[Video] Invalid video format:', new_source);
    return false;
  }

  // Safe to proceed
  video_element.src = new_source;
  return true;
}
```

#### Layer 3: Output Validation

Verify results before using them.

```javascript
async function fetch_user_data(user_id) {
  // Layer 1: Entry validation
  if (!user_id || typeof user_id !== 'string') {
    throw new Error('Valid user_id required');
  }

  try {
    const response = await fetch(`/api/users/${user_id}`);

    // Layer 2: Response validation
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Layer 3: Output validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data structure');
    }

    if (!data.name || !data.email) {
      throw new Error('Required fields missing from response');
    }

    // Sanitize output before returning
    return {
      id: String(data.id),
      name: String(data.name).trim(),
      email: String(data.email).toLowerCase().trim(),
      avatar: data.avatar || '/default-avatar.png'
    };

  } catch (error) {
    console.error('[API] User fetch failed:', error);
    // Return safe default
    return null;
  }
}
```

#### Layer 4: Safe Access Patterns

Prevent crashes when accessing nested data.

```javascript
// ❌ DANGEROUS: No validation
function display_user_avatar(user) {
  const avatar = user.profile.avatar.url; // Crashes if any property null
  document.querySelector('[avatar]').src = avatar;
}

// ✅ SAFE: Multiple layers of validation
function display_user_avatar(user) {
  // Layer 1: User object validation
  if (!user || typeof user !== 'object') {
    console.warn('[Avatar] Invalid user object');
    show_default_avatar();
    return;
  }

  // Layer 2: Profile validation
  if (!user.profile || typeof user.profile !== 'object') {
    console.warn('[Avatar] User has no profile');
    show_default_avatar();
    return;
  }

  // Layer 3: Avatar validation
  if (!user.profile.avatar || !user.profile.avatar.url) {
    console.warn('[Avatar] User has no avatar URL');
    show_default_avatar();
    return;
  }

  // Layer 4: DOM element validation
  const avatar_element = document.querySelector('[avatar]');
  if (!avatar_element) {
    console.error('[Avatar] Avatar element not found');
    return;
  }

  // Safe to proceed
  avatar_element.src = user.profile.avatar.url;
  console.log('[Avatar] Updated successfully');
}

// Modern JavaScript alternatives
const avatar_url = user?.profile?.avatar?.url || '/default-avatar.png';
const name = user.name ?? 'Anonymous';
```

### Complete Example: Contact Form with Multi-Layer Validation

See [validation_patterns.js](../../assets/patterns/validation_patterns.js) for full implementation including:
- Field-level validation (email, phone, required fields)
- Real-time validation on blur
- Form submission with sanitization
- API error handling
- XSS prevention

### Rules

**ALWAYS:**
- Validate function parameters (null/undefined/type checks)
- Validate API responses before using data
- Validate DOM elements exist before manipulating
- Sanitize user input before storing or displaying
- Provide fallback values for missing data
- Use optional chaining (`?.`) for nested access
- Add `try/catch` around risky operations
- Log validation failures for debugging
- Return early when validation fails

**NEVER:**
- Assume data exists without checking
- Trust external data (APIs, user input, URL params)
- Access nested properties without validation
- Use innerHTML with unsanitized data
- Ignore validation failures silently
- Chain property access without null checks (`user.profile.avatar.url`)
- Skip type checking function parameters

**See also:** [validation_patterns.js](../../assets/patterns/validation_patterns.js) for production-ready validation templates

---

<!-- /ANCHOR:defense-in-depth-validation -->
<!-- ANCHOR:minification-cdn-deployment -->
## 4. MINIFICATION & CDN DEPLOYMENT

For JavaScript minification and CDN deployment workflows, see dedicated references:

- **[minification_guide.md](../deployment/minification_guide.md)** - Safe minification with terser, verification pipeline, debugging
- **[cdn_deployment.md](../deployment/cdn_deployment.md)** - Cloudflare R2 upload, version management, HTML updates

### Quick Workflow

```bash
# 1. Make JS changes
#    Edit: src/javascript/[folder]/[file].js

# 2. Minify
npx terser src/javascript/[folder]/[file].js --compress --mangle \
  -o src/javascript/z_minified/[folder]/[file].js

# 3. Verify (AST check)
node scripts/verify-minification.mjs

# 4. Test (runtime check)
node scripts/test-minified-runtime.mjs

# 5. Update HTML versions
#    Increment ?v=X.X.X in all referencing HTML files

# 6. Upload to Cloudflare R2
#    Dashboard → R2 → Upload minified file

# 7. Verify live site
#    Hard refresh, check console, test functionality
```

---

<!-- /ANCHOR:minification-cdn-deployment -->
<!-- ANCHOR:quick-reference -->
## 5. QUICK REFERENCE

### Condition-Based Waiting Templates

```javascript
// Wait for element
await waitForElement('[selector]', 5000);

// Wait for library
await waitForLibrary('LibraryName', 10000);

// Wait for image
await waitForImageLoad(imgElement);

// Wait for transition
await waitForTransitionEnd(element, 'opacity');

// DOM ready
await domReady();
```

### Validation Patterns

```javascript
// Entry validation
if (!param || typeof param !== 'expected') {
  console.error('[Component] Invalid parameter');
  return null;
}

// Optional chaining (safe nested access)
const value = obj?.nested?.property ?? 'default';

// Sanitize text
function sanitizeText(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, maxLength);
}
```

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

### Reference Files
- [debugging_workflows.md](./debugging_workflows.md) - Debug timing and validation issues with systematic approach
- [verification_workflows.md](./verification_workflows.md) - Verify implementations work correctly across browsers and viewports
- [shared_patterns.md](./shared_patterns.md) - Common DevTools and logging patterns for all workflows
- [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide including waitForTransitionEnd pattern
- [code_quality_standards.md](../standards/code_quality_standards.md) - CDN-safe initialization pattern and naming conventions

### Templates
- [wait_patterns.js](../../assets/patterns/wait_patterns.js) - Production-ready condition-based waiting templates with error handling
- [validation_patterns.js](../../assets/patterns/validation_patterns.js) - Defense-in-depth validation templates for forms and APIs

### Standards
- **Browser APIs used**: `document.readyState`, `element.addEventListener('transitionend')`, `video.addEventListener('canplay')`, `document.fonts.ready`, `Promise.race()`, `Promise.all()`, optional chaining (`?.`), nullish coalescing (`??`)
- **Testing scenarios**: Network throttling (Slow 3G), CPU throttling (6x slowdown), cache disabled, different CDN speeds

---

**For complete code examples and templates:**
- [wait_patterns.js](../../assets/patterns/wait_patterns.js) - Condition-based waiting examples
- [validation_patterns.js](../../assets/patterns/validation_patterns.js) - Defense-in-depth templates
<!-- /ANCHOR:related-resources -->