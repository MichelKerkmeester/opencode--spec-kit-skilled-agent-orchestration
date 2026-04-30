---
title: Code Workflows Quick Reference
description: Quick-access cheat sheet with decision trees, code snippets, CSS patterns, and verification checklists.
---

# Code Workflows Quick Reference

Quick-access cheat sheet with decision trees, code snippets, CSS patterns, and verification checklists.

---

## 1. OVERVIEW

### Purpose
One-page reference for fast lookups during implementation, debugging, and verification workflows.

### When to Use
- Fast lookups for commands and snippets
- Determining which workflow to use (Decision Tree)
- Reviewing verification checklists

## 2. NAVIGATION DECISION TREE

```
┌─ Need to write code? ─────────────────────────────────┐
│                                                       │
│  Async/timing issues?  → condition-based-waiting      │
│  Validation needed?    → defense-in-depth             │
│  After JS changes?     → cdn-versioning               │
│  Animation needed?     → animation-workflows           │
│  Webflow collections?  → webflow-patterns               │
│  Performance needed?   → performance-patterns         │
│  Security needed?      → security-patterns            │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─ Need to debug? ──────────────────────────────────────┐
│                                                       │
│  First debugging attempt?     → systematic-debugging  │
│  Deep call stack issue?       → root-cause-tracing    │
│  Animation issues?            → animation-workflows    │
│  Webflow collection issues?   → webflow-patterns        │
│  Performance issues?          → performance-debugging │
│  Error in unknown location?   → systematic-debugging  │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─ Ready to claim complete? ────────────────────────────┐
│                                                       │
│  ALWAYS → verification-before-completion               │
│                                                       │
│  NO EXCEPTIONS. Test in browser first.                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 3. COMMON COMMANDS

### Condition-Based Waiting

```javascript
// Wait for element
await wait_for_element('[selector]', 5000);

// Wait for library
await wait_for_library('LibraryName', 10000);

// Wait for image
await wait_for_image_load(imgElement);

// Wait for transition
await wait_for_transition_end(element, 'opacity');

// DOM ready
await dom_ready();
```

### Validation Patterns

```javascript
// Entry validation
if (!param || typeof param !== 'expected') {
  console.error('[Component] Invalid parameter');
  return null;
}

// Safe nested access
const value = obj?.nested?.property ?? 'default';

// Sanitize text
text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
```

### Minification & CDN Deployment

See: [minification_guide.md](../deployment/minification_guide.md) and [cdn_deployment.md](../deployment/cdn_deployment.md)

```bash
# Quick workflow:
# 1. Minify
npx terser src/file.js --compress --mangle -o z_minified/file.js

# 2. Verify
node scripts/verify-minification.mjs
node scripts/test-minified-runtime.mjs

# 3. Update HTML versions (?v=X.X.X → ?v=X.X.X+1)
# 4. Upload to Cloudflare R2 dashboard
# 5. Test live site
```

### Performance Patterns

See: [performance_patterns.md](../implementation/performance_patterns.md)

```javascript
// ✅ Animate transform/opacity only (Motion.dev)
import { animate } from "motion"
animate('.el', { y: [100, 0], opacity: [0, 1] }, { easing: "ease-out" });

// ✅ Lazy load with IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
    }
  });
});

// ✅ Debounce user input
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

### Security Patterns

See: [security_patterns.md](../implementation/security_patterns.md)

```javascript
// ✅ Sanitize user input
function sanitize_html(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ✅ Use textContent instead of innerHTML
element.textContent = user_input;

// ✅ Validate input format
const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email_regex.test(email)) throw new Error('Invalid email');
```

### Performance Debugging

See: [debugging_workflows.md](../debugging/debugging_workflows.md#4-🔍-performance-debugging)

```markdown
Chrome DevTools → Performance tab
1. Record (circle icon)
2. Perform interaction
3. Stop after 3-5 seconds
4. Analyze flame graph (Yellow=JS, Purple=Render, Green=Paint)
5. Bottom-Up view: Find expensive functions
6. Fix bottlenecks (batch DOM reads/writes, optimize algorithms)

Memory leaks:
1. Memory tab → Take snapshot
2. Perform action (e.g., open/close modal 10x)
3. Take second snapshot
4. Comparison view → Sort by Size Delta
5. Look for Detached DOM nodes
```

### DevTools Commands

```javascript
// Find elements
$$('[selector]');

// Get event listeners
getEventListeners(element);

// Monitor events
monitorEvents(element, 'click');

// Copy to clipboard
copy(object);

// Print call stack
console.trace();

// Pause execution
debugger;
```

### Browser Verification (CLI Alternative)

**Automated browser testing via mcp-chrome-devtools skill:**

```bash
# Console error checking
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1

# Multi-viewport screenshots
bdg https://example.com 2>&1
bdg screenshot desktop.png 2>&1  # Default: ~1920x1080

# Mobile viewport (requires Emulation.setDeviceMetricsOverride first)
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg screenshot mobile.png 2>&1
bdg stop 2>&1

# DOM inspection
bdg https://example.com 2>&1
bdg dom query ".header-nav" 2>&1
bdg js "document.title" 2>&1
bdg stop 2>&1

# Network monitoring
bdg https://example.com 2>&1
bdg network cookies 2>&1
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Performance metrics
bdg https://example.com 2>&1
bdg cdp Performance.getMetrics 2>&1
bdg stop 2>&1
```

**Installation:**
```bash
npm install -g browser-debugger-cli@alpha
```

**See:** `.opencode/skill/mcp-chrome-devtools/SKILL.md` for complete CLI workflows

---

## 4. DEBUGGING CHECKLIST

```markdown
□ PHASE 1: ROOT CAUSE INVESTIGATION
  □ Read error messages completely
  □ Check DevTools Console
  □ Reproduce consistently
  □ Check recent changes (git log)
  □ Gather evidence with logging

□ PHASE 2: PATTERN ANALYSIS
  □ Find working examples
  □ Compare against references
  □ Identify differences
  □ Understand dependencies

□ PHASE 3: HYPOTHESIS & TESTING
  □ Form single hypothesis
  □ Test minimally (one change)
  □ Verify before continuing
  □ Ask if unsure

□ PHASE 4: IMPLEMENTATION
  □ Document the fix
  □ Implement single fix
  □ Verify in browser
  □ If 3+ fixes failed → question approach
```

---

## 5. VERIFICATION CHECKLIST

```markdown
□ BROWSER TESTING
  □ Chrome (via Chrome DevTools MCP automated testing)
  □ Desktop viewport (1920px)
  □ Mobile emulation (375px)

□ VIEWPORT TESTING
  □ Mobile (375px)
  □ Tablet (991px)
  □ Desktop (1920px)
  □ Transitions smooth

□ FUNCTIONALITY
  □ Clicked interactive elements
  □ Watched full animation
  □ Tested form submissions
  □ Tested media playback

□ CONSOLE/ERRORS
  □ No console errors
  □ No console warnings
  □ No failed network requests
```

---

## 6. CODE SNIPPETS

### waitForElement

```javascript
async function waitForElement(selector, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, 50));
  }
  throw new Error(`Element ${selector} not found`);
}
```

### waitForLibrary

```javascript
async function waitForLibrary(name, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (typeof window[name] !== 'undefined') {
      return window[name];
    }
    await new Promise(r => setTimeout(r, 50));
  }
  throw new Error(`Library ${name} not loaded`);
}
```

### Validation Wrapper

```javascript
function validate(value, type, fallback) {
  if (!value || typeof value !== type) {
    console.warn(`Invalid ${type}, using fallback`);
    return fallback;
  }
  return value;
}

// Usage
const userId = validate(input, 'string', 'anonymous');
```

---

## 7. KEY PRINCIPLES

**Implementation:**
- Wait for conditions, not timeouts
- Validate at every layer
- Update versions after JS changes

**Debugging:**
- Find root cause before fixing
- Use DevTools extensively
- Document the fix

**Verification:**
- Test in browser BEFORE claiming
- Multiple viewports required
- DevTools console must be clear

---

## 8. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](../implementation/implementation_workflows.md) - Phase 1 workflows for condition-based waiting, validation, and CDN versioning
- [animation_workflows.md](../implementation/animation_workflows.md) - Animation implementation guide for CSS and Motion.dev
- [webflow_patterns.md](../implementation/webflow_patterns.md) - Webflow platform patterns for collection lists and async rendering
- [performance_patterns.md](../implementation/performance_patterns.md) - Performance optimization checklist for animations, assets, and requests
- [security_patterns.md](../implementation/security_patterns.md) - OWASP security patterns for input validation and XSS prevention
- [debugging_workflows.md](../debugging/debugging_workflows.md) - Phase 2 workflows for systematic debugging
- [verification_workflows.md](../verification/verification_workflows.md) - Phase 3 workflows for browser testing (MANDATORY)
- [code_quality_standards.md](./code_quality_standards.md) - Naming conventions, initialization patterns, and standards
- [shared_patterns.md](./shared_patterns.md) - DevTools, logging, and testing utilities

### Templates
- [wait_patterns.js](../../assets/patterns/wait_patterns.js) - Production-ready condition-based waiting code templates
- [validation_patterns.js](../../assets/patterns/validation_patterns.js) - Defense-in-depth validation templates
- [debugging_checklist.md](../../assets/checklists/debugging_checklist.md) - Systematic debugging workflow checklist
- [verification_checklist.md](../../assets/checklists/verification_checklist.md) - Browser testing verification checklist

### Related Skills
- `mcp-chrome-devtools` - Chrome DevTools Protocol automation via bdg CLI for browser testing and performance analysis

---

## 9. DECISION MATRIX

| Scenario                | Workflow                | Key Action                        |
| ----------------------- | ----------------------- | --------------------------------- |
| Element not ready       | condition-based-waiting | waitForElement                    |
| Form validation         | defense-in-depth        | Multi-layer validation            |
| After JS change         | cdn-versioning          | Run version updater               |
| Animation needed        | animation-workflows     | CSS vs Motion.dev decision tree   |
| Webflow collection list | webflow-patterns        | Event delegation, async rendering |
| Console error           | systematic-debugging    | Phase 1: Investigation            |
| Deep stack error        | root-cause-tracing      | Use debugger, trace back          |
| Ready to claim done     | verification            | Test in browser first             |
| Layout bug              | systematic-debugging    | Inspect element, computed styles  |
| Animation issue         | animation-workflows     | Motion.dev loading, layout jumps  |
| Webflow ID duplication  | webflow-patterns        | Use classes, event delegation     |
| Click not working       | systematic-debugging    | Check event listeners             |

---

## 10. CSS PATTERNS

### Webflow Token Naming (Read-Only Reference)

> **IMPORTANT:** These tokens are auto-generated by Webflow's design system. This section documents the pattern for understanding existing code - do NOT create new custom properties using this convention.

**Token Pattern:**
```
--_category---subcategory--variant
```

| Part        | Delimiter | Example             |
| ----------- | --------- | ------------------- |
| Category    | `--_`     | `--_color-tokens`   |
| Subcategory | `---`     | `---input-border`   |
| Variant     | `--`      | `--negative`        |

**Common Tokens:**
```css
/* Input backgrounds */
var(--_color-tokens---input-bg--enabled)
var(--_color-tokens---input-bg--negative)

/* Input borders */
var(--_color-tokens---input-border--enabled)
var(--_color-tokens---input-border--negative)

/* State colors */
var(--_color-tokens---state--focused)
var(--_color-tokens---state--warning)
var(--_color-tokens---state--success)
```

### Form Validation Classes

| Class                 | Purpose             | Applied To          |
| --------------------- | ------------------- | ------------------- |
| `.validation-invalid` | Invalid/error state | `[data-form-field]` |
| `.validation-valid`   | Valid/success state | `[data-form-field]` |

```css
/* Invalid state */
[data-form-field].validation-invalid input.input[data-form-input] {
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
}

/* Valid state */
[data-form-field].validation-valid #input-success {
  display: flex;
  opacity: 1;
}
```

```javascript
// Toggle validation states
field.classList.remove('validation-invalid');
field.classList.add('validation-valid');
```

### Reduced Motion (MANDATORY)

All animations MUST respect `prefers-reduced-motion`:

```css
/* Default animation */
.element {
  transition: transform 0.3s ease-out;
}

/* Disable for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

```javascript
// Check preference in JS
const PREFERS_REDUCED_MOTION = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!PREFERS_REDUCED_MOTION) {
  animate(element, { opacity: [0, 1], y: [20, 0] });
}
```

### Focus Detection (Keyboard vs Mouse)

| Class             | When Applied     | Purpose            |
| ----------------- | ---------------- | ------------------ |
| `.using-keyboard` | User presses Tab | Show focus outline |
| (no class)        | User clicks      | Hide focus outline |

```css
/* Show focus outline for keyboard users */
body.using-keyboard .input:focus {
  outline: 4px solid var(--_color-tokens---state--focused);
  outline-offset: 0;
}

/* Hide focus outline for mouse users */
body:not(.using-keyboard) .input:focus {
  outline: none;
}
```

```javascript
// Detection (from input_focus_handler.js)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('using-keyboard');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('using-keyboard');
});
```

### CSS Quick Decision Matrix

| Scenario               | Pattern                              |
| ---------------------- | ------------------------------------ |
| Read Webflow token     | `var(--_category---sub--variant)`    |
| Set validation error   | `.validation-invalid` on field       |
| Set validation success | `.validation-valid` on field         |
| Add animation          | Check `prefers-reduced-motion` first |
| Style keyboard focus   | `body.using-keyboard :focus`         |
| Hide mouse focus       | `body:not(.using-keyboard) :focus`   |

---

## 11. COMMON ONE-LINERS

### MutationObserver

```javascript
// Watch for DOM changes (child additions/removals)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      // Handle added nodes
    }
  });
});
observer.observe(element, { childList: true, subtree: true });

// Disconnect when done
observer.disconnect();
```

### IntersectionObserver

```javascript
// Detect element visibility in viewport
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Element is visible
      io.unobserve(entry.target);  // One-time trigger
    }
  });
}, { threshold: 0.5 });  // 50% visible

io.observe(element);
```

### Lenis scrollTo

```javascript
// Smooth scroll to element with offset
window.lenis?.scrollTo(element, { 
  offset: -100,      // Offset from top (negative = above element)
  duration: 1.2,     // Animation duration in seconds
  immediate: false   // Set true to skip animation
});

// Scroll to position
window.lenis?.scrollTo(500, { duration: 0.8 });

// Scroll to top
window.lenis?.scrollTo(0);
```

### Motion.dev inView

```javascript
// One-time entrance animation
inView('.element', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6 });
});

// With cleanup (runs when element leaves viewport)
inView('.element', () => {
  const controls = animate('.child', { opacity: 1 });
  return () => controls.stop();  // Cleanup function
});
```

### Motion.dev animate

```javascript
// Basic animation with easing
animate(element, { opacity: [0, 1] }, { 
  duration: 0.6, 
  easing: [0.22, 1, 0.36, 1] 
});

// With cleanup callback
animate(element, { y: [40, 0] }, {
  duration: 0.5,
  onComplete: () => {
    element.style.willChange = 'auto';
  }
});
```

### Webflow Guard Flag

```javascript
// Prevent double initialization during page transitions
const INIT_FLAG = '__componentNameInit';
if (window[INIT_FLAG]) return;
window[INIT_FLAG] = true;
```

### Custom Event Dispatch

```javascript
// Dispatch custom event for inter-component communication
document.dispatchEvent(new Event('heroAnimationComplete'));

// Listen for custom event
document.addEventListener('heroAnimationComplete', () => {
  // React to event
});

// With data
document.dispatchEvent(new CustomEvent('dataLoaded', { 
  detail: { items: data } 
}));
```

### Safe Optional Chaining

```javascript
// Safe property access with fallback
const value = obj?.nested?.property ?? 'default';

// Safe method call
element?.classList?.add('active');

// Safe array access
const first = items?.[0]?.name ?? 'Unknown';
```

### Force Layout Reflow

```javascript
// Force browser to recalculate layout before animation
element.style.height = '0';
void element.offsetHeight;  // Force reflow
element.style.height = `${targetHeight}px`;  // Animate to new height
```

### Remove Inline Styles

```javascript
// Clear specific inline styles
['transform', 'opacity', 'willChange'].forEach(prop => {
  element.style.removeProperty(prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`));
});
```

---

**For detailed workflows, see the main SKILL.md orchestrator**
