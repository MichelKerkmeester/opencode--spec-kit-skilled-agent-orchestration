---
title: Swiper.js Integration Patterns
description: Production-tested Swiper.js configurations for carousels and marquees with IntersectionObserver autoplay control, accessibility, and Webflow integration.
---

# Swiper.js Integration Patterns

Production-tested Swiper.js configurations for carousels and marquees with IntersectionObserver autoplay control, accessibility, and Webflow integration.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This reference documents the Swiper.js patterns used in the example.com codebase, including standard carousel configuration, continuous marquee animations, visibility-based autoplay control, and Webflow class integration.

### When to Use

| Use Case | Pattern | Reference |
|----------|---------|-----------|
| Standard carousel with navigation | Timeline Pattern | Section 2 |
| Continuous scrolling marquee | Marquee Pattern | Section 3 |
| CPU-efficient autoplay | IntersectionObserver | Section 4 |
| Screen reader support | a11y Configuration | Section 5 |
| Webflow class integration | Custom Class Names | Section 6 |

### Core Principle

Swiper carousels must pause when off-screen to conserve CPU. Use IntersectionObserver with 0.1 threshold to start/stop autoplay based on visibility.

### Primary Sources

| File | Purpose | LOC |
|------|---------|-----|
| `/src/javascript/swiper/timeline.js` | Carousel with navigation/pagination | 158 |
| `/src/javascript/swiper/marquee_brands.js` | Continuous brand logo marquee | 133 |
| `/src/javascript/swiper/marquee_clients.js` | Continuous client logo marquee | 133 |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:timeline-carousel-pattern -->
## 2. TIMELINE CAROUSEL PATTERN

### Configuration

Standard carousel configuration with navigation, pagination, and autoplay from `timeline.js:9-55`:

```javascript
const SWIPER_CONFIG = {
  // Basic settings
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: true,
  autoHeight: true,
  grabCursor: true,

  // Classes - Webflow integration
  wrapperClass: "swiper--wrapper",
  slideClass: "swiper--slide",

  // Navigation
  navigation: {
    nextEl: '[timeline-navigation="next"]',
    prevEl: '[timeline-navigation="previous"]',
  },

  // Pagination - fraction type
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },

  // Autoplay
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  // Keyboard control
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  // Touch settings
  simulateTouch: true,
  touchEventsTarget: "container",

  // Accessibility
  a11y: {
    enabled: true,
  },
};
```

### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `speed` | 600 | Transition duration in milliseconds |
| `slidesPerView` | 1 | Show one slide at a time |
| `centeredSlides` | true | Active slide centered in viewport |
| `autoHeight` | true | Adjust height to match active slide |
| `grabCursor` | true | Show grab cursor on hover (desktop) |
| `disableOnInteraction` | false | Continue autoplay after user interaction |
| `pauseOnMouseEnter` | true | Pause autoplay on hover |
| `onlyInViewport` | true | Keyboard nav only when carousel visible |

### Loop Detection

From `timeline.js:78-86` - Only enable loop mode when multiple slides exist:

```javascript
// Check number of slides for loop functionality
const slides = contentContainer.querySelectorAll(".swiper--slide");
const slidesCount = slides.length;

// Reason: Only enable loop if more than one slide exists
const config = {
  ...SWIPER_CONFIG,
  loop: slidesCount > 1,
  // ... rest of config
};
```

### Initialization with Retry

From `timeline.js:60-77` - Handle Swiper loading asynchronously:

```javascript
function initTimelineSwiper() {
  // @ts-ignore - Swiper loaded externally
  if (typeof Swiper === "undefined") {
    console.warn("Timeline: Swiper not loaded yet, retrying...");
    setTimeout(initTimelineSwiper, 100);
    return;
  }

  const contentContainer = /** @type {HTMLElement|null} */ (
    document.querySelector(TIMELINE_CONTAINER)
  );

  if (!contentContainer) {
    console.warn("Timeline: Container not found");
    return;
  }

  // @ts-ignore - Swiper loaded externally
  const mainSwiper = new Swiper(contentContainer, config);
}
```

**Key patterns:**
- **Retry mechanism**: 100ms polling until Swiper library loads
- **TypeScript safety**: `@ts-ignore` for externally-loaded library
- **JSDoc casting**: Type annotations for DOM elements
- **Guard clauses**: Early return if container missing

---

<!-- /ANCHOR:timeline-carousel-pattern -->
<!-- ANCHOR:marquee-pattern -->
## 3. MARQUEE PATTERN

### Configuration

Continuous scrolling marquee configuration from `marquee_brands.js:73-89`:

```javascript
const swiper = new Swiper(marqueeTrack, {
  wrapperClass: "marquee--container",
  slideClass: "marquee--item",
  spaceBetween: 0,                        // CSS handles spacing, not Swiper
  allowTouchMove: false,
  // Reason: Disable a11y for purely decorative scrolling content
  a11y: false,
  speed: 8000,                            // Animation duration in ms
  loop: true,                             // Enable infinite loop
  loopAddBlankSlides: false,              // Manual duplicates handle ultra-wide displays
  watchOverflow: false,                   // Keep autoplay running even if slides < viewport
  slidesPerView: "auto",                  // Auto-fit slides
  autoplay: {
    delay: 0,
    disableOnInteraction: false,          // Continuous motion even when user touches
  },
});
```

### Marquee vs Carousel Configuration

| Option | Marquee | Carousel | Reason |
|--------|---------|----------|--------|
| `speed` | 8000 | 600 | Slow continuous scroll vs quick transitions |
| `delay` | 0 | 3000 | Continuous vs paused between slides |
| `allowTouchMove` | false | true | Decorative vs interactive |
| `a11y` | false | true | Decorative content vs content navigation |
| `slidesPerView` | "auto" | 1 | Show all vs one at a time |
| `loop` | true | conditional | Always loop vs depends on slide count |

### Slide Duplication for Seamless Loop

From `marquee_brands.js:33-70` - Calculate and create duplicates for seamless infinite scroll:

```javascript
const slides = Array.from(marqueeContainer.querySelectorAll(".marquee--item"));
if (!slides.length) return;

// Calculate dimensions
const slideMetrics = slides.map((slide) => {
  const rect = slide.getBoundingClientRect();
  const width = rect.width || slide.offsetWidth || slide.scrollWidth || 0;
  return { slide, width };
});

const baseWidth = slideMetrics.reduce((sum, metric) => sum + metric.width, 0);
if (!baseWidth) return;

const trackWidth = Math.max(
  marqueeTrack.offsetWidth,
  marqueeTrack.getBoundingClientRect().width
);
const requiredWidth = trackWidth * 3;

// Calculate repeats needed for seamless loop
const repeatsNeeded = Math.max(
  2,
  Math.ceil(requiredWidth / baseWidth)
);
const MAX_REPEATS = 40;
const cappedRepeats = Math.min(repeatsNeeded, MAX_REPEATS);

if (cappedRepeats > 1) {
  const fragment = document.createDocumentFragment();

  for (let repeat = 1; repeat < cappedRepeats; repeat += 1) {
    slideMetrics.forEach(({ slide }) => {
      const clone = /** @type {HTMLElement} */ (slide.cloneNode(true));
      clone.setAttribute("data-marquee-duplicate", "true");
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("id");
      fragment.appendChild(clone);
    });
  }

  marqueeContainer.appendChild(fragment);
}
```

**Key patterns:**
- **3x viewport coverage**: Ensure enough content for seamless loop on wide screens
- **MAX_REPEATS cap**: Prevent DOM bloat (40 max)
- **DocumentFragment**: Batch DOM insertions for performance
- **aria-hidden**: Hide duplicates from screen readers
- **ID removal**: Prevent duplicate ID violations

---

<!-- /ANCHOR:marquee-pattern -->
<!-- ANCHOR:intersectionobserver-autoplay-control -->
## 4. INTERSECTIONOBSERVER AUTOPLAY CONTROL

### Core Pattern

From `timeline.js:106-116` - Pause autoplay when carousel is off-screen to save CPU:

```javascript
// Pause autoplay when off-screen to save CPU
const timeline_visibility_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      mainSwiper.autoplay.start();
    } else {
      mainSwiper.autoplay.stop();
    }
  });
}, { threshold: 0.1 });
timeline_visibility_observer.observe(contentContainer);
```

### Marquee Variant

From `marquee_brands.js:91-101` - Same pattern for marquee elements:

```javascript
// Pause autoplay when off-screen to save CPU
const visibility_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  });
}, { threshold: 0.1 });
visibility_observer.observe(marqueeTrack);
```

### Why 0.1 Threshold

| Threshold | Behavior | Use Case |
|-----------|----------|----------|
| 0 | Fires when any pixel visible/hidden | Too sensitive, false triggers |
| 0.1 | Fires when 10% visible | Balance of early start + reliability |
| 0.5 | Fires when 50% visible | Too late for autoplay start |
| 1.0 | Fires when 100% visible | Only for "fully visible" requirements |

**0.1 is optimal because:**
- Starts autoplay before user expects animation (smooth UX)
- Stops when mostly scrolled out (saves CPU)
- Avoids edge-case flickering at viewport boundaries

### Generic Reusable Pattern

```javascript
/**
 * Create visibility-based autoplay controller for Swiper
 * @param {Object} swiper - Swiper instance
 * @param {HTMLElement} container - Container element to observe
 * @returns {IntersectionObserver} Observer instance for cleanup
 */
function createAutoplayVisibilityObserver(swiper, container) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);
  return observer;
}

// Usage
const swiper = new Swiper(container, config);
const visibilityObserver = createAutoplayVisibilityObserver(swiper, container);

// Cleanup (on page navigation or component destroy)
// visibilityObserver.disconnect();
```

---

<!-- /ANCHOR:intersectionobserver-autoplay-control -->
<!-- ANCHOR:accessibility-configuration -->
## 5. ACCESSIBILITY CONFIGURATION

### Interactive Carousels (a11y: enabled)

From `timeline.js:52-54` - Enable accessibility for content carousels:

```javascript
// Accessibility
a11y: {
  enabled: true,
},
```

When `a11y: true`, Swiper automatically:
- Adds `role="group"` to slides
- Adds `aria-label` to navigation buttons
- Manages `aria-live` for slide changes
- Handles focus management

### Enhanced a11y with ARIA Labels

For more descriptive accessibility:

```javascript
a11y: {
  enabled: true,
  prevSlideMessage: 'Previous slide',
  nextSlideMessage: 'Next slide',
  firstSlideMessage: 'This is the first slide',
  lastSlideMessage: 'This is the last slide',
  paginationBulletMessage: 'Go to slide {{index}}',
  slideLabelMessage: 'Slide {{index}} of {{slidesLength}}',
},
```

### Manual ARIA Enhancement

From `timeline.js:87-92` - Adding custom ARIA attributes in init callback:

```javascript
on: {
  init: function (swiper) {
    const wrapper = swiper.wrapperEl;
    if (wrapper) {
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Carousel slides");
    }
  },
},
```

### Decorative Marquees (a11y: disabled)

From `marquee_brands.js:78-79` - Disable accessibility for purely decorative content:

```javascript
// Reason: Disable a11y for purely decorative scrolling content
a11y: false,
```

**When to disable a11y:**
- Decorative marquees (logos, background animations)
- Duplicate content already accessible elsewhere
- Auto-scrolling content without user control

**When a11y disabled, ensure:**
- Duplicated content has `aria-hidden="true"`
- Essential content is available in accessible form elsewhere
- Container is not focusable

---

<!-- /ANCHOR:accessibility-configuration -->
<!-- ANCHOR:webflow-class-naming -->
## 6. WEBFLOW CLASS NAMING

### Custom Class Configuration

Swiper uses default classes (`swiper-wrapper`, `swiper-slide`). Override for Webflow conventions:

```javascript
// From timeline.js:19-20
wrapperClass: "swiper--wrapper",
slideClass: "swiper--slide",

// From marquee_brands.js:74-75
wrapperClass: "marquee--container",
slideClass: "marquee--item",
```

### Class Naming Conventions

| Element Type | Default Class | Webflow Class | Pattern |
|--------------|---------------|---------------|---------|
| Wrapper | `swiper-wrapper` | `swiper--wrapper` | BEM-style double hyphen |
| Slide | `swiper-slide` | `swiper--slide` | BEM-style double hyphen |
| Marquee Wrapper | `swiper-wrapper` | `marquee--container` | Context-specific naming |
| Marquee Item | `swiper-slide` | `marquee--item` | Context-specific naming |

### Navigation with Data Attributes

From `timeline.js:23-26` - Using data attributes for navigation targeting:

```javascript
navigation: {
  nextEl: '[timeline-navigation="next"]',
  prevEl: '[timeline-navigation="previous"]',
},
```

**Advantages of data attributes:**
- More semantic than generic class selectors
- Scoped to component (multiple carousels on page)
- Self-documenting purpose
- Easy to find in Webflow Designer

### Webflow HTML Structure

```html
<!-- Timeline Carousel Structure -->
<div id="swiper-timeline" class="swiper">
  <div class="swiper--wrapper">
    <div class="swiper--slide">Slide 1</div>
    <div class="swiper--slide">Slide 2</div>
    <div class="swiper--slide">Slide 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button timeline-navigation="previous">Prev</button>
  <button timeline-navigation="next">Next</button>
</div>

<!-- Marquee Structure -->
<div class="marquee--track">
  <div class="marquee--container">
    <div class="marquee--item">Brand 1</div>
    <div class="marquee--item">Brand 2</div>
    <div class="marquee--item">Brand 3</div>
  </div>
</div>
```

---

<!-- /ANCHOR:webflow-class-naming -->
<!-- ANCHOR:initialization-patterns -->
## 7. INITIALIZATION PATTERNS

### CDN Initialization Guard

From `timeline.js:133-156` - Prevent duplicate initialization from CDN:

```javascript
const INIT_FLAG = '__timelineCdnInit';
const INIT_DELAY_MS = 0;

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  if (document.readyState !== 'loading') {
    setTimeout(safeInit, INIT_DELAY_MS);
    return;
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(safeInit, INIT_DELAY_MS),
    { once: true }
  );
};

if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

### Init Flag Naming Convention

| Component | Init Flag |
|-----------|-----------|
| Timeline | `__timelineCdnInit` |
| Marquee Brands | `__marqueeBrandsCdnInit` |
| Marquee Clients | `__marqueeClientsCdnInit` |

**Pattern:** `__[componentName]CdnInit`

### Safe Initialization Wrapper

From `timeline.js:122-128` - Try/catch wrapper for error handling:

```javascript
function safeInit() {
  try {
    initTimelineSwiper();
  } catch (error) {
    console.error("Timeline initialization failed:", error);
  }
}
```

### Webflow Integration

```javascript
// Check for Webflow.push (Webflow sites)
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  // Fallback for non-Webflow environments
  start();
}
```

**Why Webflow.push:**
- Ensures Webflow IX2 interactions are ready
- Coordinates with Webflow's own initialization
- Prevents race conditions with Webflow features

---

<!-- /ANCHOR:initialization-patterns -->
<!-- ANCHOR:common-patterns-summary -->
## 8. COMMON PATTERNS SUMMARY

### Configuration Templates

**Interactive Carousel:**
```javascript
const carouselConfig = {
  speed: 600,
  slidesPerView: 1,
  centeredSlides: true,
  autoHeight: true,
  grabCursor: true,
  wrapperClass: "swiper--wrapper",
  slideClass: "swiper--slide",
  autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
  keyboard: { enabled: true, onlyInViewport: true },
  a11y: { enabled: true },
  loop: slidesCount > 1,  // Dynamic based on content
};
```

**Decorative Marquee:**
```javascript
const marqueeConfig = {
  speed: 8000,
  slidesPerView: "auto",
  loop: true,
  loopAddBlankSlides: false,
  watchOverflow: false,
  allowTouchMove: false,
  a11y: false,
  autoplay: { delay: 0, disableOnInteraction: false },
  wrapperClass: "marquee--container",
  slideClass: "marquee--item",
};
```

### Checklist: New Swiper Implementation

```markdown
[ ] Choose pattern: carousel or marquee
[ ] Set Webflow-compatible class names
[ ] Configure autoplay with visibility observer
[ ] Set appropriate a11y (enabled for interactive, false for decorative)
[ ] Add CDN init guard with unique flag
[ ] Wrap init in try/catch for error handling
[ ] Add Swiper load retry if externally loaded
[ ] For marquees: calculate and create slide duplicates
[ ] For carousels: conditionally enable loop based on slide count
```

---

<!-- /ANCHOR:common-patterns-summary -->
<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

### Swiper Not Initializing

**Symptom:** No errors, but carousel doesn't work

**Cause:** Swiper library not loaded when init runs

**Fix:** Add retry mechanism:
```javascript
if (typeof Swiper === "undefined") {
  console.warn("Swiper not loaded yet, retrying...");
  setTimeout(initFunction, 100);
  return;
}
```

### Autoplay Doesn't Pause Off-Screen

**Symptom:** CPU usage high when scrolled away

**Cause:** IntersectionObserver not set up or wrong threshold

**Fix:** Verify observer is created and observing correct element:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log('Visibility:', entry.isIntersecting); // Debug
    if (entry.isIntersecting) swiper.autoplay.start();
    else swiper.autoplay.stop();
  });
}, { threshold: 0.1 });
observer.observe(containerElement); // Ensure correct element
```

### Loop Mode Glitching

**Symptom:** Jump or flash when looping

**Cause:** Not enough slides for smooth loop

**Fix:** Either disable loop or create duplicates:
```javascript
// Option 1: Disable loop for few slides
loop: slidesCount > 2,

// Option 2: Create enough duplicates (marquee pattern)
const repeatsNeeded = Math.ceil((trackWidth * 3) / baseWidth);
```

### Duplicate IDs Warning

**Symptom:** Console warning about duplicate element IDs

**Cause:** Cloned slides retain original IDs

**Fix:** Remove IDs from clones:
```javascript
const clone = slide.cloneNode(true);
clone.removeAttribute("id");
clone.setAttribute("aria-hidden", "true");
```

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Reference Files
- [observer_patterns.md](./observer_patterns.md) - IntersectionObserver deep dive
- [performance_patterns.md](./performance_patterns.md) - CPU optimization patterns
- [webflow_patterns.md](./webflow_patterns.md) - Webflow class conventions
- [animation_workflows.md](./animation_workflows.md) - Scroll-triggered animations

### Source Files
- `/src/javascript/swiper/timeline.js` - Carousel reference implementation
- `/src/javascript/swiper/marquee_brands.js` - Marquee reference implementation
- `/src/javascript/swiper/marquee_clients.js` - Marquee reference implementation

### External Documentation
- [Swiper.js API Documentation](https://swiperjs.com/swiper-api)
- [Swiper.js Accessibility](https://swiperjs.com/swiper-api#a11y)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
<!-- /ANCHOR:related-resources -->
