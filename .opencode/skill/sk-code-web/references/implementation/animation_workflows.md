---
title: Animation Workflows - Phase 1 Implementation
description: CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects.
---

# Animation Workflows - Phase 1 Implementation

CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Complete animation implementation guide covering decision trees, CSS patterns, Motion.dev integration, performance optimization, and accessibility compliance.

### When to Use
- Implementing UI animations
- Choosing between CSS and JavaScript animations
- Optimizing animation performance

### Core Principle
CSS first for simplicity and performance. Motion.dev when you need programmatic control.

### Prerequisites
Follow code quality standards:
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Naming:** Use `snake_case` for functions/variables
- See [code_quality_standards.md](../standards/code_quality_standards.md) for complete standards

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:animation-decision-tree -->
## 2. ANIMATION DECISION TREE

### Primary Decision Order

Use this sequence when implementing animations:

1. **CSS transitions/keyframes** - First choice for hover, focus, small reveals, and state changes
2. **Motion.dev** - Use when you need programmatic control, in-view triggers, or coordinated sequences

### Quick Decision Flow

```
Need animation?
├─> Can CSS express it (transform/opacity/clip/mask)?
│   └─> Use CSS transitions or @keyframes
└─> Requires sequencing/stagger/scroll/in-view logic?
    └─> Use Motion.dev
```

**When CSS is sufficient:**
- Hover/focus states
- Simple state transitions (open/close, show/hide)
- Single-property animations
- Looping animations without timing dependencies

**When Motion.dev is required:**
- Scroll-triggered animations
- In-view entrance sequences
- Staggered animations (multiple elements with delays)
- Coordinated multi-step sequences
- Programmatic timing control

---

<!-- /ANCHOR:animation-decision-tree -->
<!-- ANCHOR:css-animation-patterns -->
## 3. CSS ANIMATION PATTERNS

### GPU-Accelerated Properties Only

**Use these properties for smooth 60fps animations:**

```css
.element {
  /* ✅ GPU-accelerated - USE THESE */
  transform: translate(0, 0);  /* Position changes */
  opacity: 1;                  /* Fade effects */
  scale: 1;                    /* Size changes */
  rotate: 0deg;                /* Rotation */

  /* ❌ Layout properties - AVOID THESE */
  width: 200px;    /* Causes layout recalculation */
  height: 100px;   /* Causes layout recalculation */
  top: 0;          /* Causes layout recalculation */
  left: 0;         /* Causes layout recalculation */
}
```

### Timing Guidance

**Recommended durations by interaction type:**

| Interaction Type | Duration | Easing | Example |
|-----------------|----------|--------|---------|
| **Micro-interactions** | 150-250ms | ease-out | Button hover, icon changes |
| **Standard transitions** | 200-400ms | ease-out | Dropdowns, modals, cards |
| **Entrance animations** | 400-600ms | custom cubic-bezier | Hero elements, sections |
| **Exit animations** | 200-300ms | ease-in | Modal close, element removal |

**Standard easing curves:**
```css
.element {
  /* General purpose */
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  /* Snappy interactions */
  transition: opacity 0.2s ease-out;

  /* Continuous motion */
  transition: transform 0.5s linear;
}
```

### Accessibility Compliance (MANDATORY)

**Every animated element MUST respect prefers-reduced-motion:**

```css
/* Your animation */
.animated-element {
  transition: transform 0.3s ease-out, opacity 0.2s ease-out;
}

/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Why 0.01ms instead of 0ms:** Setting to 0ms can prevent transition/animation events from firing. 0.01ms applies end state while preserving event handling.

### Dropdown Pattern (No Layout Jump)

**Problem:** Height transitions from `0` to `auto` cause layout jumps because CSS cannot transition to/from `auto`.

**Solution:** Measure natural height, transition to pixel value, then set auto after transition completes:

```css
.dropdown {
  overflow: hidden;
  height: 0;
  opacity: 0;
  transition:
    height 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.dropdown[open] {
  /* Will be set to pixel value by JavaScript, then auto */
  height: auto;
  opacity: 1;
}
```

```javascript
function open_dropdown(dropdown) {
  const natural_height = dropdown.scrollHeight;
  dropdown.setAttribute('open', '');
  dropdown.style.height = `${natural_height}px`;

  dropdown.addEventListener('transitionend', () => {
    dropdown.style.height = 'auto';
  }, { once: true });
}

function close_dropdown(dropdown) {
  const current_height = dropdown.scrollHeight;
  dropdown.style.height = `${current_height}px`;

  // Force reflow so browser registers the pixel value
  dropdown.offsetHeight;

  dropdown.style.height = '0';
  dropdown.removeAttribute('open');
}
```

**Reference implementation:** `src/javascript/navigation/language_selector.js` - Complete dropdown with measured height animation

---

<!-- /ANCHOR:css-animation-patterns -->
<!-- ANCHOR:motion-dev-integration -->
## 4. MOTION.DEV INTEGRATION

### Library Loading (Global Setup)

**Load Motion.dev once as ES module in global.html:**

```html
<!-- src/html/global.html -->
<script type="module">
  const lib = await import('https://cdn.jsdelivr.net/npm/motion@{version}/+esm');
  window.Motion = lib; // { animate, inView, scroll, stagger, ... }
</script>
```

> **Note**: Check `global.html` for the current pinned version.

**Why this approach:**
- Single CDN request for all components
- Global availability prevents import duplication
- Version-locked for stability
- All Motion.dev functions available via `window.Motion`

### Component Initialization Pattern with Retry Logic

**Standard pattern for components using Motion.dev:**

```javascript
(() => {
  const INIT_FLAG = '__animationComponentCdnInit';
  const INIT_DELAY_MS = 100;  // Higher delay for Motion.dev dependency

  function init_animation() {
    const { animate, inView } = window.Motion || {};

    // CDN loading is unpredictable — retry until Motion library is available
    if (!animate || !inView) {
      setTimeout(init_animation, 100);
      return;
    }

    inView('.hero-element', ({ target }) => {
      animate(target,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    });
  }

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState !== 'loading') {
      setTimeout(init_animation, INIT_DELAY_MS);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(init_animation, INIT_DELAY_MS),
      { once: true }
    );
  };

  // Webflow compatibility
  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }
})();
```

**Pattern explanation:**
- `INIT_FLAG` prevents double initialization
- `INIT_DELAY_MS = 100` allows Motion.dev to load from CDN
- Retry logic handles variable CDN loading times
- `window.Motion || {}` safely destructures even if undefined

**See:** [code_quality_standards.md](../standards/code_quality_standards.md) Section 4 for complete CDN-safe pattern documentation.

### Standardized Animation Parameters

**From/to arrays for properties (recommended approach):**

```javascript
const { animate } = window.Motion;

// Single property
animate(element, {
  opacity: [0, 1]  // From 0 to 1
}, { duration: 0.6 });

// Multiple properties
animate(element, {
  opacity: [0, 1],
  y: [40, 0],           // From 40px down to 0 (entrance from below)
  scale: [0.95, 1]      // From slightly smaller to full size
}, {
  duration: 0.6,
  easing: [0.22, 1, 0.36, 1]
});
```

**Standardized easing curves (aligned with Webflow):**

```javascript
const easings = {
  easeOut: [0.22, 1, 0.36, 1],    // General purpose, smooth deceleration
  expoOut: [0.16, 1, 0.3, 1]      // Dramatic entrances, strong deceleration
};

animate(element, properties, {
  duration: 0.6,
  easing: easings.easeOut
});
```

### In-View One-Time Entrances

**Trigger animations when elements scroll into view:**

```javascript
const { inView } = window.Motion;

// Basic in-view entrance
inView('.section', ({ target }) => {
  animate(target,
    { opacity: [0, 1], y: [40, 0] },
    { duration: 0.6 }
  );
}, {
  amount: 0.3  // Trigger when 30% of element is visible
});

// Multiple elements with stagger
inView('.card-grid', ({ target }) => {
  const cards = target.querySelectorAll('.card');

  cards.forEach((card, index) => {
    animate(card,
      { opacity: [0, 1], y: [20, 0] },
      {
        duration: 0.5,
        delay: index * 0.1  // Stagger by 100ms per card
      }
    );
  });
}, {
  amount: 0.2
});
```

### Performance Cleanup Pattern

**Always remove will-change after animations complete:**

```javascript
const { animate } = window.Motion;

animate(element, { opacity: [0, 1] }, {
  duration: 0.6,
  onComplete: () => {
    element.style.willChange = '';  // Remove GPU hint
  }
});
```

**Why this matters:**
- `will-change` promotes element to GPU layer (expensive)
- Keeping it active after animation wastes memory
- Browser manages layers better when will-change is removed

**Reference implementations:**

| File | Pattern Demonstrated |
|------|---------------------|
| `src/javascript/hero/hero_general.js` | InView-based multi-phase sequence, easing maps, loader fadeout, will-change cleanup |
| `src/javascript/hero/hero_blog_article.js` | Content-first then overlay, short durations, expoOut easing |

---

<!-- /ANCHOR:motion-dev-integration -->
<!-- ANCHOR:performance-optimization -->
## 5. PERFORMANCE OPTIMIZATION

### Set Initial States (Prevent Flicker)

**Problem:** Elements are visible before JavaScript runs, then jump when animation starts.

**Solution:** Set initial animated state in CSS:

```css
/* Set initial state for entrance animations */
.animated-entrance {
  opacity: 0;
  transform: translateY(40px);
}

/* After JS runs, animate to final state */
.animated-entrance.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
```

```javascript
inView('.animated-entrance', ({ target }) => {
  target.classList.add('is-visible');
});
```

### Batch Style Reads and Writes

**Problem:** Interleaving reads and writes causes layout thrashing (multiple reflows).

**Solution:** Batch all reads first, then all writes:

```javascript
// ❌ BAD: Causes layout thrashing
elements.forEach(el => {
  const height = el.scrollHeight;  // Forces synchronous layout calculation
  el.style.height = `${height}px`;
  el.classList.add('active');
});
// Browser reflows 3 times (read-write-write per iteration)

// ✅ GOOD: Batch reads, then writes
const heights = elements.map(el => el.scrollHeight);
elements.forEach((el, i) => {
  el.style.height = `${heights[i]}px`;
  el.classList.add('active');
});
// Browser reflows only once (after all writes)
```

### Will-Change Lifecycle Management

**Proper will-change usage:**

```javascript
element.style.willChange = 'transform, opacity';

await animate(element, properties, {
  duration: 0.6,
  onComplete: () => {
    element.style.willChange = '';
  }
});
```

**When to use will-change:**
- Complex animations (multiple properties)
- Scroll-triggered animations (set on scroll start, remove on scroll end)
- High-frequency animations (dragging, following cursor)

**When NOT to use will-change:**
- Simple hover states (browser optimizes automatically)
- Permanent state (wastes GPU memory)
- Static elements (no animation planned)

---

<!-- /ANCHOR:performance-optimization -->
<!-- ANCHOR:testing-and-debugging-procedures -->
## 6. TESTING AND DEBUGGING PROCEDURES

### Pre-Deployment Checklist

**Cross-device timing verification:**
1. **Desktop** - Verify full animation durations feel natural
2. **Tablet** - Check medium viewport behavior, adjust if needed
3. **Mobile** - Ensure animations are brief (300ms max recommended for mobile)

**Why mobile needs shorter durations:** Mobile devices have smaller screens where motion is more noticeable, and users expect snappier interactions.

### Layout Stability Testing

**Prevent content jumps during animation:**

1. **Measure before animating** - Capture `scrollHeight`, `offsetWidth` before transition
2. **Apply transitions to measured pixel values** - Animate from/to known values
3. **Set `auto` after transition completes** - Use `transitionend` event
4. **Verify no content jumps** - Check surrounding content doesn't shift

**Testing procedure:**
```javascript
// Add visual debugging
element.addEventListener('transitionstart', () => {
  console.log('Animation start:', {
    height: element.offsetHeight,
    scroll: window.scrollY
  });
});

element.addEventListener('transitionend', () => {
  console.log('Animation end:', {
    height: element.offsetHeight,
    scroll: window.scrollY
  });
});

// Scroll position should not change during animation
```

### Reduced Motion Testing

**Required testing for accessibility compliance:**

1. **Enable "Reduce motion" in OS settings**
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Ease of Access → Display → Show animations
   - iOS/Android: Accessibility settings → Reduce motion

2. **Verify animations skip or use minimal duration (<20ms)**
   - Elements should instantly appear in final state
   - No jarring transitions or sudden movements

3. **Confirm end states are visually correct without animation**
   - All content visible and positioned correctly
   - No missing or hidden elements

**JavaScript detection pattern:**
```javascript
const prefers_reduced_motion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefers_reduced_motion) {
  // Skip animation, apply end state directly
  element.style.opacity = '1';
  element.style.transform = 'none';
} else {
  // Run full animation sequence
  animate(element, { opacity: [0, 1] }, { duration: 0.6 });
}
```

### Performance Profiling

**Use Chrome DevTools Performance panel:**

1. **Open DevTools** → Performance tab
2. **Record during animation sequence** (click record, trigger animation, stop)
3. **Analyze for performance issues:**

**What to look for:**

| Issue | Visual Indicator | Fix |
|-------|-----------------|-----|
| **Long tasks** | Red bars >50ms | Split work into smaller chunks, use requestAnimationFrame |
| **Forced reflows** | Purple bars labeled "Layout" | Batch style reads/writes, avoid layout properties |
| **Excessive layers** | Many green "Paint" bars | Remove unnecessary will-change, limit animated elements |
| **Jank (dropped frames)** | Choppy FPS graph | Use GPU-accelerated properties only (transform, opacity) |

**Target metrics:**
- **60 FPS** - 16.67ms per frame maximum
- **No long tasks** - All main thread work <50ms
- **Minimal layout** - Only 1-2 layout recalculations per animation

### Automated Animation Testing (MCP & CLI)

**Automated testing enables visual regression detection and objective performance measurement:**

#### Visual State Capture (Before/After Animation)

**Option 1: Chrome DevTools MCP**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Capture before state:
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save as "animation-before.png"

3. Trigger animation (via evaluate_script or user interaction)

4. Capture after state:
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save as "animation-after.png"

5. Compare screenshots visually
```

**Option 2: mcp-chrome-devtools (Terminal-based)**
```bash
# Visual regression testing workflow
bdg https://example.com 2>&1

# Capture initial state
bdg screenshot animation-before.png 2>&1

# Trigger animation (wait for completion)
sleep 2

# Capture final state
bdg screenshot animation-after.png 2>&1

# Stop session
bdg stop 2>&1

# Compare screenshots (use diff tool)
compare animation-before.png animation-after.png animation-diff.png
```

#### Animation Performance Metrics

**CLI Performance Profiling:**
```bash
# Navigate to page
bdg https://example.com 2>&1

# Trigger animation and capture metrics immediately after
bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
sleep 1  # Wait for animation to complete

# Get performance metrics
bdg cdp Performance.getMetrics 2>&1 > animation-metrics.json

# Check for layout thrashing
jq '.result.metrics[] | select(.name == "LayoutCount" or .name == "RecalcStyleCount")' animation-metrics.json

# Check timing metrics
jq '.result.metrics[] | select(.name | contains("Duration"))' animation-metrics.json

# Stop session
bdg stop 2>&1
```

**Key animation metrics:**
```json
{
  "name": "LayoutCount",
  "value": 2  // Should be ≤3 per animation
},
{
  "name": "RecalcStyleCount",
  "value": 1  // Should be minimal
},
{
  "name": "TaskDuration",
  "value": 145  // Total task time in ms
}
```

**Performance Assertion Example:**
```bash
#!/bin/bash
# Assert animation performance meets targets

bdg https://example.com 2>&1

# Trigger animation
bdg js "document.querySelector('.hero').classList.add('animate-in')" 2>&1
sleep 0.6  # Animation duration

# Get metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)
bdg stop 2>&1

# Extract layout count
LAYOUT_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutCount") | .value')

# Assert performance target
if [ "$LAYOUT_COUNT" -gt 3 ]; then
  echo "❌ FAIL: Too many layouts ($LAYOUT_COUNT > 3)"
  exit 1
else
  echo "✅ PASS: Layout count within target ($LAYOUT_COUNT ≤ 3)"
fi
```

#### Multi-Viewport Animation Testing

**Automated cross-viewport testing:**
```bash
#!/bin/bash
# Test animations at all viewports

VIEWPORTS=("1920:1080:desktop" "991:1024:tablet" "375:667:mobile")
URL="https://example.com"

for viewport in "${VIEWPORTS[@]}"; do
  IFS=':' read -r width height name <<< "$viewport"

  echo "Testing $name viewport (${width}x${height})..."

  bdg "$URL" 2>&1

  # Set viewport
  bdg cdp Emulation.setDeviceMetricsOverride "{\"width\":$width,\"height\":$height,\"deviceScaleFactor\":2,\"mobile\":false}" 2>&1

  # Capture before animation
  bdg screenshot "animation-${name}-before.png" 2>&1

  # Trigger animation
  bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
  sleep 1

  # Capture after animation
  bdg screenshot "animation-${name}-after.png" 2>&1

  # Get performance metrics
  bdg cdp Performance.getMetrics 2>&1 > "animation-${name}-metrics.json"

  bdg stop 2>&1

  echo "✅ $name viewport captured"
done

echo "✅ All viewport tests complete"
```

#### Reduced Motion Testing

**Automated prefers-reduced-motion verification:**
```bash
# Test with reduced motion preference
bdg https://example.com 2>&1

# Enable reduced motion emulation
bdg cdp Emulation.setEmulatedMedia '{"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}' 2>&1

# Check if animations are disabled
REDUCED_MOTION=$(bdg js "window.matchMedia('(prefers-reduced-motion: reduce)').matches" 2>&1)

echo "Reduced motion active: $REDUCED_MOTION"

# Capture screenshot in reduced motion mode
bdg screenshot animation-reduced-motion.png 2>&1

bdg stop 2>&1
```

**See:** `.opencode/skill/mcp-chrome-devtools/` for complete CLI automation patterns

---

<!-- /ANCHOR:testing-and-debugging-procedures -->
<!-- ANCHOR:common-issues-and-solutions -->
## 7. COMMON ISSUES AND SOLUTIONS

### Layout Jump on Height Animation

**Issue:** Content shifts when transitioning `height: 0` to `height: auto`

**Cause:** CSS cannot animate to `auto` value, snaps instead of transitioning

**Solution:**
```javascript
const natural_height = element.scrollHeight;

element.style.height = `${natural_height}px`;

element.addEventListener('transitionend', () => {
  element.style.height = 'auto';
}, { once: true });
```

### Jank on Scroll-Triggered Animations

**Issue:** Animations stutter or drop frames during scrolling

**Cause:** Animating layout properties (width, height, top, left) forces reflows

**Solution:**
```javascript
// ❌ BAD: Animates layout properties
animate(element, {
  width: [100, 200],    // Causes reflow
  top: [0, 100]         // Causes reflow
});

// ✅ GOOD: GPU-accelerated properties only
animate(element, {
  scale: [0.5, 1],      // GPU-accelerated
  y: [0, 100]           // GPU-accelerated (translateY)
});
```

**Additional optimization:**
```javascript
element.style.willChange = 'transform, opacity';

animate(element, properties, {
  onComplete: () => {
    element.style.willChange = '';
  }
});
```

### Animation Doesn't Start (Motion.dev Not Loaded)

**Issue:** `window.Motion` is undefined, animations don't run

**Cause:** CDN loading slower than component initialization

**Solution:** Use retry logic pattern
```javascript
function init_animation() {
  const { animate, inView } = window.Motion || {};

  // CDN loading is unpredictable — retry until Motion library is available
  if (!animate || !inView) {
    setTimeout(init_animation, 100);
    return;
  }

  inView('.hero', ({ target }) => {
    animate(target, { opacity: [0, 1] }, { duration: 0.6 });
  });
}
```

### Elements Flicker Before Animation

**Issue:** Elements visible in default state, then jump to animated start state

**Cause:** CSS initial state not set before JavaScript runs

**Solution:** Set initial state in CSS
```css
/* Set initial state for all animated elements */
.hero-element {
  opacity: 0;
  transform: translateY(40px);
}

.hero-element.animated {
  opacity: 1;
  transform: translateY(0);
}
```

**Alternative:** Use JavaScript to set state before DOM renders (in `<head>`)
```html
<script>
  // Placed in <head> to execute before paint — prevents FOUC
  document.documentElement.classList.add('js-enabled');
</script>

<style>
  .js-enabled .hero-element {
    opacity: 0;
    transform: translateY(40px);
  }
</style>
```

---

<!-- /ANCHOR:common-issues-and-solutions -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Implementation phase guidance
- [debugging_workflows.md](./debugging_workflows.md) - Animation debugging techniques
- [verification_workflows.md](./verification_workflows.md) - Animation verification procedures
- [code_quality_standards.md](../standards/code_quality_standards.md) - CDN-safe initialization patterns

### Related Skills
- `mcp-chrome-devtools` - CLI-based performance profiling and animation testing

### External Resources
- [Motion.dev Documentation](https://motion.dev) - Motion animation library documentation
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) - Browser animation APIs
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/) - Performance profiling guide

---

**Core principle:** CSS first for simplicity, Motion.dev for complexity. Keeps payloads small, performance high, and behavior predictable.

---

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:motion-dev-advanced-patterns -->
## 9. MOTION.DEV ADVANCED PATTERNS

### Timeline Sequences

**For coordinated multi-element animations with precise timing:**

```javascript
// From hero_general.js - Background padding animation followed by content
const { animate } = window.Motion;

// Parallel animations with shared timeline
if (elements.backgrounds.length) {
  animate(elements.backgrounds, {
    paddingTop: [CONFIG.styles.background_padding.initial_top, CONFIG.styles.background_padding.top],
    paddingLeft: [CONFIG.styles.background_padding.initial_sides, CONFIG.styles.background_padding.sides],
    paddingRight: [CONFIG.styles.background_padding.initial_sides, CONFIG.styles.background_padding.sides],
  }, {
    duration: 1.4,
    delay: 0,
    easing: [0.16, 1, 0.3, 1],  // expo_out
    onComplete: () => remove_will_change_batch(elements.backgrounds)
  });
}

// Sequenced content animation (starts after background)
if (elements.headers.length && header_animation) {
  animate(elements.headers, header_animation, {
    duration: 0.9,
    delay: 0.65,  // Starts after background begins
    easing: [0.16, 1, 0.3, 1],
    onComplete: () => remove_will_change_batch(elements.headers, ["transform", "opacity"])
  });
}
```

**Key pattern:** Use `delay` to sequence animations without nesting callbacks.

### Stagger Animations

**For animating multiple elements with incremental delays:**

```javascript
// Manual stagger pattern (hero_general.js approach)
const cards = target.querySelectorAll('.card');

cards.forEach((card, index) => {
  animate(card,
    { opacity: [0, 1], y: [20, 0] },
    {
      duration: 0.5,
      delay: index * 0.1  // 100ms stagger between each card
    }
  );
});

// Alternative: Using Motion.dev stagger function
const { animate, stagger } = window.Motion;

animate('.card', 
  { opacity: [0, 1], y: [20, 0] },
  { 
    duration: 0.5,
    delay: stagger(0.1)  // 100ms between each element
  }
);

// Stagger with easing (start slow, speed up)
animate('.item',
  { opacity: [0, 1] },
  {
    delay: stagger(0.1, { ease: [0.22, 1, 0.36, 1] })
  }
);
```

### Scroll-Triggered with inView()

**Trigger animations when elements enter viewport:**

```javascript
const { animate, inView } = window.Motion;

// Basic inView entrance (one-time trigger)
inView('.hero-section', (info) => {
  // Prevent duplicate animation
  if (info.target.dataset.animated === 'done') return;
  info.target.dataset.animated = 'done';
  
  build_hero_animation(info.target);
}, { 
  amount: 0.1  // Trigger when 10% visible
});

// inView with cleanup function (for continuous animations)
inView('.video-section', ({ target }) => {
  const controls = animate(target, { opacity: 1 }, { duration: 0.6 });

  return () => {
    controls.stop();
    target.style.opacity = '0';
  };
});

// Multiple thresholds
inView('.section', callback, { 
  amount: 0.3,  // 30% of element visible
  margin: '-100px'  // Offset trigger by 100px
});
```

### Cleanup Patterns

**Proper resource management after animations:**

```javascript
// 1. Remove will-change after animation completes
const remove_will_change = (element, extra_properties = []) => {
  if (!element || !element.style) return;
  element.style.removeProperty('will-change');
  element.style.removeProperty('transition');
  extra_properties.forEach(prop => {
    const css_property = prop.includes('-')
      ? prop
      : prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    element.style.removeProperty(css_property);
  });
};

// 2. Batch cleanup for multiple elements
const remove_will_change_batch = (nodes, extra_properties = []) => {
  if (!nodes) return;
  const list = nodes.length !== undefined ? nodes : [nodes];
  Array.from(list).forEach((node) => remove_will_change(node, extra_properties));
};

// 3. Use in animation onComplete callback
animate(element, { opacity: [0, 1], y: [40, 0] }, {
  duration: 0.6,
  easing: [0.22, 1, 0.36, 1],
  onComplete: () => remove_will_change_batch(element, ['transform', 'opacity'])
});

// 4. Animation controls for manual stop
const controls = animate(element, { x: [0, 100] }, { duration: 2 });

// Stop animation early (e.g., on user interaction or component unmount)
controls.stop();

// 5. will-change lifecycle: Set before → Animate → Remove after
element.style.willChange = 'transform, opacity';
await animate(element, properties, {
  onComplete: () => {
    element.style.willChange = 'auto';  // Reset to default
  }
});
```

### Viewport-Responsive Timing

**Adjust animation timing based on device:**

```javascript
// Cache viewport type for performance
let cached_viewport = null;
let viewport_cache_time = 0;
const CACHE_DURATION = 100; // ms

const get_viewport_type = () => {
  const now = performance.now();
  if (!cached_viewport || now - viewport_cache_time > CACHE_DURATION) {
    cached_viewport = {
      is_desktop: window.innerWidth >= 992,
      is_mobile: window.innerWidth < 992,
    };
    viewport_cache_time = now;
  }
  return cached_viewport;
};

// Use in animation setup
const { is_desktop, is_mobile } = get_viewport_type();

const timing = {
  duration: is_mobile ? 0.8 : 0.6,
  delay: is_mobile ? 0.1 : 0.65,
  slide_distance: is_mobile ? '3rem' : '50%',
};

animate(element, {
  y: [timing.slide_distance, '0'],
  opacity: [0, 1]
}, {
  duration: timing.duration,
  delay: timing.delay,
  easing: is_mobile ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1]
});
```

**Reference implementation:** `src/javascript/hero/hero_general.js:302-549`
<!-- /ANCHOR:motion-dev-advanced-patterns -->
