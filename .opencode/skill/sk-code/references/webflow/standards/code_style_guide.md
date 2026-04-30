---
title: Code Style Guide
description: Naming conventions, formatting, comments, and visual organization standards for frontend development
---

# Code Style Guide

Comprehensive styling, formatting, and commenting conventions ensuring consistent, readable code across the codebase.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Define visual and structural standards for all frontend code, covering:
- Naming conventions (variables, functions, files)
- Formatting rules (indentation, brackets, quotes)
- Comment styles (headers, sections, inline)
- File organization patterns

### Core Principle

**Consistency enables collaboration. Clarity prevents bugs.**

Code should be obviously correct at a glance. When style is consistent, reviewers focus on logic, not formatting.

### When to Use

- Writing new JavaScript or CSS files
- Reviewing code for style compliance
- Onboarding new contributors
- Refactoring existing code

### Related Resources

- [code_quality_standards.md](./code_quality_standards.md) - Complete quality standards including initialization patterns and animation strategy
- [animation_workflows.md](../implementation/animation_workflows.md) - Animation-specific implementation patterns

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:naming-conventions -->
## 2. NAMING CONVENTIONS

### JavaScript Identifiers

All JavaScript code uses `snake_case` for consistency with the codebase:

| Type      | Convention            | Example                                     |
| --------- | --------------------- | ------------------------------------------- |
| Variables | `snake_case`          | `user_data`, `hover_timer`, `is_valid`      |
| Functions | `snake_case`          | `handle_submit()`, `init_component()`       |
| Constants | `UPPER_SNAKE_CASE`    | `MAX_RETRIES`, `INIT_DELAY_MS`, `INIT_FLAG` |
| Private   | `_snake_case`         | `_internal_cache`, `_pending_play`          |
| Booleans  | `is_` / `has_` prefix | `is_attached`, `has_loaded`, `is_playing`   |

**Production examples from src/:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const pending_play = [];

// Constants
const INIT_FLAG = '__videoHlsHoverInit';
const INIT_DELAY_MS = 50;
const MAX_HLS_RETRIES = 3;
```

### Semantic Function Prefixes

Use standard prefixes to indicate function purpose:

| Prefix      | Purpose          | Returns            | Example                   |
| ----------- | ---------------- | ------------------ | ------------------------- |
| `is_`       | Boolean check    | true/false         | `is_valid_email()`        |
| `has_`      | Presence check   | true/false         | `has_required_fields()`   |
| `get_`      | Data retrieval   | data (no mutation) | `get_form_data()`         |
| `set_`      | Data mutation    | void/success       | `set_loading_state()`     |
| `handle_`   | Event handler    | void               | `handle_submit()`         |
| `init_`     | Initialization   | void               | `init_validation()`       |
| `bind_`     | Event binding    | void               | `bind_hover_events()`     |
| `toggle_`   | State toggle     | void               | `toggle_visibility()`     |
| `validate_` | Validation       | boolean/errors     | `validate_form()`         |
| `load_`     | Resource loading | Promise            | `load_external_library()` |

**Production examples:**
```javascript
function is_valid_email(email) { }
function has_required_fields(form) { }
function get_form_data(form) { }
function set_loading_state(enabled) { }
function handle_submit(event) { }
function init_validation() { }
function bind_hover_events(container) { }
function toggle_visibility(element) { }
function validate_form(form_data) { }
function load_botpoison_sdk() { }
```

### File Naming

JavaScript and CSS files use `snake_case`:

```
// JavaScript files
video_background_hls_hover.js
modal_cookie_consent.js
contact_office_hours.js

// CSS files
btn_app_store.css
form_file_upload.css
fluid_responsive.css
```

### CSS Naming (BEM with kebab-case)

```css
.hero { }                    /* Block */
.hero--title { }             /* Element (double-dash) */
.hero--overlay { }           /* Element */
.hero-featured { }           /* Modifier (single-dash) */
.btn { }                     /* Block */
.btn--icon { }               /* Element */
.btn-primary { }             /* Modifier */
```

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:file-structure -->
## 3. FILE STRUCTURE

### JavaScript File Header (MANDATORY)

Every JavaScript file MUST start with a three-line header using box-drawing characters:

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────
```

**Header specifications:**
- Line width: 67 characters (using `─` box-drawing character U+2500)
- Category label: ALL CAPS
- No metadata: No dates, authors, version numbers, or ticket references

**Production examples:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// MODAL: COOKIE CONSENT
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// FORM: FILE UPLOAD
// ───────────────────────────────────────────────────────────────
```

### Section Headers (Numbered)

Organize code into logical sections with numbered headers:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. EVENT HANDLERS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   4. INITIALIZE
──────────────────────────────────────────────────────────────── */
```

**Section header specifications:**
- Uses `/* */` multi-line comment style
- Line width: 68 characters
- Section title: ALL CAPS, indented 3 spaces
- Opening line starts with `/* ─`
- Closing line starts with `──` (no `*/` on same line)

### Standard File Organization

Every JavaScript file should follow this structure:

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';  // Optional but recommended

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */
  const INIT_FLAG = '__componentNameInit';
  const INIT_DELAY_MS = 50;
  const SELECTORS = {
    container: '[data-component="name"]',
    trigger: '[data-trigger]'
  };

  /* ─────────────────────────────────────────────────────────────
     2. UTILITIES
  ──────────────────────────────────────────────────────────────── */
  function get_elements(selector) { }
  function is_valid(element) { }

  /* ─────────────────────────────────────────────────────────────
     3. CORE FUNCTIONS
  ──────────────────────────────────────────────────────────────── */
  function process_item(item) { }

  /* ─────────────────────────────────────────────────────────────
     4. EVENT HANDLERS
  ──────────────────────────────────────────────────────────────── */
  function handle_click(event) { }
  function bind_events() { }

  /* ─────────────────────────────────────────────────────────────
     5. INITIALIZE
  ──────────────────────────────────────────────────────────────── */
  function init_component() { }

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;
    // ... initialization logic
  };

  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }

  /* ─────────────────────────────────────────────────────────────
     6. PUBLIC API (Optional)
  ──────────────────────────────────────────────────────────────── */
  window.ComponentName = {
    init: init_component,
    destroy: cleanup
  };

})();
```

---

<!-- /ANCHOR:file-structure -->
<!-- ANCHOR:formatting -->
## 4. FORMATTING

### Indentation

**2 spaces, no tabs:**

```javascript
// Correct
function example() {
  if (condition) {
    do_something();
  }
}

// Incorrect (tabs or 4 spaces)
function example() {
    if (condition) {
        do_something();
    }
}
```

### Brackets and Braces

**Same-line opening brace (K&R style):**

```javascript
// Correct
function example() {
  if (condition) {
    return true;
  }
}

// Incorrect (Allman style)
function example()
{
  if (condition)
  {
    return true;
  }
}
```

**Single-statement if blocks still use braces:**

```javascript
// Correct
if (condition) {
  return early;
}

// Avoid (no braces)
if (condition) return early;
```

### Semicolons

**Always use semicolons:**

```javascript
// Correct
const value = 42;
do_something();
return result;

// Incorrect (ASI-dependent)
const value = 42
do_something()
return result
```

### Quotes

**Single quotes for strings, template literals for interpolation:**

```javascript
// Correct
const message = 'Hello world';
const greeting = `Hello, ${user_name}!`;
const html = `<div class="container">${content}</div>`;

// Incorrect (double quotes for simple strings)
const message = "Hello world";
```

**Exception:** JSON and HTML attributes use double quotes where required.

### Trailing Commas

**Use trailing commas in multi-line structures:**

```javascript
// Correct
const config = {
  name: 'component',
  delay: 50,
  enabled: true,  // trailing comma
};

const items = [
  'first',
  'second',
  'third',  // trailing comma
];

// Incorrect (no trailing comma)
const config = {
  name: 'component',
  delay: 50,
  enabled: true
};
```

**Benefits:**
- Cleaner git diffs (adding item doesn't modify previous line)
- Easier reordering
- Consistent structure

### Line Length

**Generally under 120 characters:**

```javascript
// Correct - break long lines
const result = some_function(
  first_argument,
  second_argument,
  third_argument
);

// Correct - chain on new lines
const processed = items
  .filter(is_valid)
  .map(transform_item)
  .sort(compare_items);

// Avoid - single long line
const result = some_function(first_argument, second_argument, third_argument, fourth_argument);
```

### Whitespace

**Consistent spacing around operators and keywords:**

```javascript
// Correct
const sum = a + b;
if (condition) { }
for (const item of items) { }
function example(param) { }

// Incorrect
const sum = a+b;
if(condition){ }
for(const item of items){ }
function example (param) { }
```

---

<!-- /ANCHOR:formatting -->
<!-- ANCHOR:commenting-rules -->
## 5. COMMENTING RULES

### Principles

1. **Quantity limit:** Maximum 5 comments per 10 lines of code
2. **Focus on WHY, not WHAT:** Explain intent, constraints, platform requirements
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Platform-specific notes:** Document Webflow, Motion.dev, Lenis constraints

### File Header Format

Three-line header at the top of every file (see Section 3):

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────
```

### Section Header Format

Numbered sections with box-drawing characters:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. SECTION NAME
──────────────────────────────────────────────────────────────── */
```

### Function Purpose Comments

Single line above function describing intent:

```javascript
// Load Botpoison SDK from CDN if not already loaded
// Returns promise resolving to true on success, false on failure
function load_botpoison_sdk() { }

// Show modal with entrance animation using Motion.dev
// Make container visible before animating to avoid layout jumps
async function show_modal() { }

// Calculate time until next office opening
// Returns object with hours, minutes, and isOpen flag
function get_time_until_open(schedule) { }
```

### Inline Comments (WHY, Not WHAT)

**Good examples (explain reasoning):**

```javascript
// Prevent background scroll while modal is open
if (window.lenis) {
  window.lenis.stop();
}

// Add 10 second timeout to prevent infinite hang
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);

// Use modern Array.from or fallback to slice for IE11
return Array.from ? Array.from(list) : Array.prototype.slice.call(list);

// Debounce resize handler to prevent layout thrashing
let resize_timer = null;
window.addEventListener('resize', () => {
  clearTimeout(resize_timer);
  resize_timer = setTimeout(handle_resize, 150);
});

// Guard: Exit early if already initialized
if (window[INIT_FLAG]) return;
```

**Bad examples (narrate implementation):**

```javascript
// Set price to price times 100
const price_cents = price * 100;

// Loop through items
for (const item of items) { }

// Check if element exists
if (element) { }

// Add click handler
button.addEventListener('click', handle_click);
```

### Platform-Specific Comments

Reference external constraints explicitly:

```javascript
// WEBFLOW: Collection list constraint (max 100 items per list)
const MAX_ITEMS = 100;

// MOTION: Animation requires Motion.dev library loaded globally
if (!window.Motion) {
  console.warn('Motion.dev not loaded');
  return;
}

// LENIS: Smooth scroll integration - must stop during modal
window.lenis?.stop();

// HLS.JS: Safari handles HLS natively, others need library
const needs_hls_library = !video.canPlayType('application/vnd.apple.mpegurl');

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;
```

### JSDoc Usage

Use JSDoc for exported/public functions and complex utilities:

```javascript
/**
 * Initialize video hover behavior for all matching containers
 * @param {string} selector - CSS selector for video containers
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Hover delay in milliseconds
 * @param {boolean} options.autoplay - Enable autoplay on hover
 * @returns {Function} Cleanup function to remove event listeners
 */
function init_video_hover(selector, options = {}) { }

/**
 * Format date according to Dutch locale
 * @param {Date} date - Date to format
 * @param {string} format - Output format ('short' | 'long' | 'relative')
 * @returns {string} Formatted date string
 */
function format_date(date, format = 'short') { }
```

### Debug Logging Pattern

```javascript
// Conditional logging for debug mode
const DEBUG = false;
const LOG_PREFIX = '[ComponentName]';

function log(...args) {
  if (DEBUG) {
    console.log(LOG_PREFIX, ...args);
  }
}

// Usage
log('Initialized with config:', config);
log('Processing item:', item.id);
```

---

<!-- /ANCHOR:commenting-rules -->
<!-- ANCHOR:css-style-conventions -->
## 6. CSS STYLE CONVENTIONS

### Custom Property Naming

Use prefixes to indicate scope and purpose:

| Prefix          | Scope                 | Example                           |
| --------------- | --------------------- | --------------------------------- |
| `--font-*`      | Typography variables  | `--font-from`, `--font-to`        |
| `--vw-*`        | Viewport calculations | `--vw-from`, `--vw-to`            |
| `--component-*` | Component-specific    | `--hero-padding`, `--card-radius` |
| `--state-*`     | Interactive states    | `--state-hover-opacity`           |
| `--global-*`    | Site-wide values      | `--global-max-width`              |

**Production example from fluid_responsive.css:**

```css
:root {
  --font-from: 18;
  --font-to: 18;
  --vw-from: calc(5120 / 100);
  --vw-to: calc(7680 / 100);
  --coefficient: calc((var(--font-to) - var(--font-from)) / (var(--vw-to) - var(--vw-from)));
  --base: calc((var(--font-from) - var(--vw-from) * var(--coefficient)) / 16);
}
```

### Attribute Selectors

**Always use the case-insensitivity flag `i` for custom data attributes:**

```css
/* Correct: Case-insensitive (matches "Base", "base", "BASE") */
[data-render-content="base" i] {
  content-visibility: auto;
}

/* Incorrect: Case-sensitive (only matches exact "base") */
[data-render-content="base"] {
  content-visibility: auto;
}
```

**Why this matters:**
- Webflow attribute panel may produce inconsistent casing
- Users may type "Base" instead of "base"
- Prevents silent CSS selector failures
- Browser support: Chrome 49+, Firefox 47+, Safari 9+, Edge 79+

### Animation CSS

**GPU-accelerated properties only:**

```css
.animated-element {
  /* GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  
  /* Layout properties - AVOID ANIMATING */
  /* width, height, top, left, padding, margin */
}
```

**will-change management:**

```css
/* Set via JavaScript BEFORE animation starts */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes (via JavaScript) */
.animation-complete {
  will-change: auto;
}
```

**Easing standards (aligned with Motion.dev):**

```css
/* General purpose - smooth deceleration */
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

/* Dramatic entrances - strong deceleration */
transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

### File Organization

**One file per component type, grouped by category:**

```
src/1_css/
├── animations/          # Reusable animation classes
├── button/              # Button variants (btn_primary.css, btn_secondary.css)
├── card/                # Card layouts
├── form/                # Form elements
├── global/              # Site-wide styles (fluid_responsive.css, reset.css)
├── label/               # Label styles
├── link/                # Link styles
├── menu/                # Navigation menus
├── slider/              # Carousel/slider styles
├── text/                # Typography components
└── video/               # Video player styles
```

**Naming conventions:**
- Files: `component_variant.css` (snake_case)
- Classes: `.component--element` (BEM with double-dash for elements)
- Modifiers: `.component-modifier` (single-dash for modifiers)

---

<!-- /ANCHOR:css-style-conventions -->
<!-- ANCHOR:quick-reference-checklist -->
## 7. QUICK REFERENCE CHECKLIST

Before committing any code, verify:

### Naming

- [ ] All variables/functions use `snake_case`
- [ ] Constants use `UPPER_SNAKE_CASE`
- [ ] Boolean variables use `is_` or `has_` prefix
- [ ] Semantic prefixes used (`init_`, `handle_`, `get_`, `set_`, etc.)
- [ ] File names use `snake_case` (e.g., `component_name.js`)

### File Structure

- [ ] Three-line file header with box-drawing characters
- [ ] Category and component name in ALL CAPS
- [ ] No metadata in headers (no dates/authors/tickets)
- [ ] Numbered section headers for organization
- [ ] Wrapped in IIFE `(() => { ... })()`

### Formatting

- [ ] 2-space indentation (no tabs)
- [ ] Same-line opening braces (K&R style)
- [ ] Semicolons always used
- [ ] Single quotes for strings
- [ ] Trailing commas in multi-line structures
- [ ] Line length under 120 characters

### Comments

- [ ] Maximum 5 comments per 10 lines
- [ ] Focus on WHY, not WHAT
- [ ] Platform constraints documented (WEBFLOW, MOTION, LENIS)
- [ ] No commented-out code
- [ ] JSDoc for public/exported functions

### CSS

- [ ] Attribute selectors use `i` flag for case-insensitivity
- [ ] Custom properties use semantic prefixes (`--font-*`, `--vw-*`, etc.)
- [ ] GPU-accelerated properties only for animations (transform, opacity)
- [ ] BEM naming: `.block--element`, `.block-modifier`

---

<!-- /ANCHOR:quick-reference-checklist -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Standards Files

- [code_quality_standards.md](./code_quality_standards.md) - Complete quality standards including initialization patterns, animation strategy, and CDN-safe patterns
- [animation_workflows.md](../implementation/animation_workflows.md) - CSS and Motion.dev animation implementation guide

### Workflow Files

- [implementation_workflows.md](../implementation/implementation_workflows.md) - Condition-based waiting and validation patterns
- [debugging_workflows.md](../debugging/debugging_workflows.md) - Debugging workflows for style compliance
- [verification_workflows.md](../verification/verification_workflows.md) - Verification workflows for code standards

### Production Examples

- `src/javascript/video/video_background_hls_hover.js` - Complete example of all conventions
- `src/1_css/global/fluid_responsive.css` - CSS custom property naming example
- `src/javascript/form/file_upload.js` - Form component with full structure

---

**Core principle:** Consistent style makes code predictable. Predictable code is maintainable code.
<!-- /ANCHOR:related-resources -->