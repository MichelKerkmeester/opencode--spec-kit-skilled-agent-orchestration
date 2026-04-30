---
title: Code Style Enforcement
description: Enforcement rules, validation prompts, and remediation instructions for code quality standards (JavaScript + CSS)
---

# Code Style Enforcement

Active enforcement reference for code quality and style standards. Use this document to validate code compliance and fix violations.

**Related Documents:**
- [code_style_guide.md](./code_style_guide.md) - Complete style conventions (JS + CSS)
- [code_quality_standards.md](./code_quality_standards.md) - Quality patterns
- [code_quality_checklist.md](../../assets/checklists/code_quality_checklist.md) - Validation checklist

**Language Coverage:**
- **JavaScript** (`.js`): Sections 2-7
- **CSS** (`.css`): Section 8

---

## 1. OVERVIEW

### Purpose

This document provides:
- Validation prompts for checking code compliance
- Pattern recognition guidance for identifying violations
- Compliant and non-compliant examples for comparison
- Remediation instructions for fixing common violations

### When to Use

Use this enforcement reference when:
- Validating **JavaScript or CSS** code before claiming implementation complete
- Fixing violations identified by the code quality checklist
- Understanding the difference between compliant and non-compliant patterns
- Training on code style standards

### Enforcement Philosophy

- **P0 violations** are HARD BLOCKERS - must be fixed before completion
- **P1 violations** should be fixed OR documented with approval
- **P2 violations** can be deferred with documented reason
- When in doubt, fix the violation rather than defer

---

## 2. FILE HEADER ENFORCEMENT

### Validation Prompt

> **Check:** Does the file start with a three-line header using box-drawing characters?

**What to look for:**
1. First line: `// ─` followed by 63 more `─` characters (67 total including `// `)
2. Second line: `// CATEGORY: COMPONENT NAME` (ALL CAPS)
3. Third line: Same as first line

### Pattern Recognition

**Compliant Pattern:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────
```

**Violation Patterns:**

| Violation        | Example                 | How to Identify                 |
| ---------------- | ----------------------- | ------------------------------- |
| Missing header   | File starts with code   | No header lines at top          |
| Wrong character  | `// ---...`             | Uses hyphen `-` instead of `─`  |
| Wrong length     | Short header line       | Count characters (should be 67) |
| Metadata present | `// Created 2024-01-15` | Contains dates, names, versions |
| Wrong case       | `// video: Background`  | Not ALL CAPS                    |

### Remediation

**To fix missing header:**
1. Insert three lines at the top of the file
2. Copy the template:
```javascript
// ───────────────────────────────────────────────────────────────
// [CATEGORY]: [COMPONENT NAME]
// ───────────────────────────────────────────────────────────────
```
3. Replace `[CATEGORY]` with component type (VIDEO, FORM, MODAL, etc.)
4. Replace `[COMPONENT NAME]` with descriptive name (2-4 words, ALL CAPS)

**To fix wrong character:**
- Find and replace all `-` (hyphen) with `─` (box-drawing U+2500)
- Use: `// ───────────────────────────────────────────────────────────────`

---

## 3. SECTION ORGANIZATION ENFORCEMENT

### Validation Prompt

> **Check:** Are code sections organized with numbered headers in standard order?

**What to look for:**
1. IIFE wrapper: `(() => { ... })()`
2. Numbered section headers using `/* ─... */` format
3. Standard section order (when applicable)

### Pattern Recognition

**Compliant Pattern:**
```javascript
(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */
  const INIT_FLAG = '__componentInit';

  /* ─────────────────────────────────────────────────────────────
     2. UTILITIES
  ──────────────────────────────────────────────────────────────── */
  function is_valid(el) { }

  /* ─────────────────────────────────────────────────────────────
     3. INITIALIZE
  ──────────────────────────────────────────────────────────────── */
  function init_component() { }

})();
```

**Violation Patterns:**

| Violation    | Example                  | How to Identify                     |
| ------------ | ------------------------ | ----------------------------------- |
| No IIFE      | Code at global scope     | Missing `(() => { ... })()` wrapper |
| No sections  | Flat code structure      | No section headers                  |
| Wrong format | `// === SECTION ===`     | Not using `/* ─...` format          |
| Not numbered | `/* CONFIGURATION */`    | Missing number prefix               |
| Wrong case   | `/* 1. Configuration */` | Title not ALL CAPS                  |

### Remediation

**To add section headers:**
```javascript
/* ─────────────────────────────────────────────────────────────
   [N]. [SECTION NAME]
──────────────────────────────────────────────────────────────── */
```

**Standard section order:**
1. CONFIGURATION - Constants, settings, selectors
2. UTILITIES - Helper functions
3. CORE FUNCTIONS - Main logic
4. EVENT HANDLERS - Event handler functions
5. INITIALIZE - Initialization function
6. PUBLIC API - (optional) Exposed window methods

---

## 4. COMMENT QUALITY ENFORCEMENT

### Validation Prompt

> **Check:** Do comments explain WHY, not WHAT? Are there any commented-out code blocks?

**What to look for:**
1. No commented-out code (delete it, git preserves history)
2. Comments explain reasoning, constraints, or platform requirements
3. Platform prefixes: WEBFLOW, MOTION, LENIS, HLS.JS

### Pattern Recognition

**Compliant Comments (WHY):**
```javascript
// Prevent background scroll while modal is open
if (window.lenis) { window.lenis.stop(); }

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;

// Add 10 second timeout to prevent infinite hang
setTimeout(() => reject(new Error('Timeout')), 10000);

// MOTION: Animation requires Motion.dev library loaded globally
if (!window.Motion) { return; }
```

**Non-Compliant Comments (WHAT):**
```javascript
// Set price to price times 100 ← WRONG: narrates code
const price_cents = price * 100;

// Loop through items ← WRONG: states the obvious
for (const item of items) { }

// Check if element exists ← WRONG: describes what, not why
if (element) { }

// Add click handler ← WRONG: code is self-explanatory
button.addEventListener('click', handle_click);
```

### Remediation

**To fix "WHAT" comments:**
1. Delete if the code is self-explanatory
2. OR replace with WHY: explain reasoning, constraints, or edge case

**Before:**
```javascript
// Check if element exists
if (element) {
  // Set the text content
  element.textContent = 'Hello';
}
```

**After:**
```javascript
// Guard: Some pages may not have this optional element
if (element) {
  element.textContent = 'Hello';
}
```

**To remove commented-out code:**
1. Delete the commented code block entirely
2. If you need to preserve it, git history has it
3. If it's important context, add a comment explaining WHY it was removed

---

## 5. NAMING CONVENTION ENFORCEMENT

### Validation Prompt

> **Check:** Are all identifiers using snake_case? Do boolean variables use is_/has_ prefix?

**What to look for:**
1. Variables: `snake_case`
2. Functions: `snake_case` with semantic prefixes
3. Constants: `UPPER_SNAKE_CASE`
4. Booleans: `is_` or `has_` prefix

### Pattern Recognition

**Compliant Naming:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const _internal_cache = {};

// Constants
const INIT_FLAG = '__componentInit';
const MAX_RETRIES = 3;
const INIT_DELAY_MS = 50;

// Functions
function is_valid_email(email) { }
function get_form_data(form) { }
function handle_submit(event) { }
function init_component() { }
```

**Non-Compliant Naming (camelCase):**
```javascript
// WRONG: camelCase variables
const hoverTimer = null;        // Should be: hover_timer
const isAttached = false;       // Should be: is_attached

// WRONG: camelCase functions
function isValidEmail(email) { }  // Should be: is_valid_email
function getFormData(form) { }    // Should be: get_form_data
function handleSubmit(event) { }  // Should be: handle_submit

// WRONG: Missing prefix on boolean
const attached = false;           // Should be: is_attached
const required = true;            // Should be: is_required or has_required
```

### Remediation

**Conversion rules:**
| From            | To               |
| --------------- | ---------------- |
| `camelCase`     | `snake_case`     |
| `isActive`      | `is_active`      |
| `hasLoaded`     | `has_loaded`     |
| `getUserData`   | `get_user_data`  |
| `handleClick`   | `handle_click`   |
| `initComponent` | `init_component` |

**Semantic prefix guide:**

| Prefix      | Use When         | Returns            |
| ----------- | ---------------- | ------------------ |
| `is_`       | Boolean check    | true/false         |
| `has_`      | Presence check   | true/false         |
| `get_`      | Data retrieval   | data (no mutation) |
| `set_`      | Data mutation    | void/success       |
| `handle_`   | Event handler    | void               |
| `init_`     | Initialization   | void               |
| `bind_`     | Event binding    | void               |
| `toggle_`   | State toggle     | void               |
| `validate_` | Validation       | boolean/errors     |
| `load_`     | Resource loading | Promise            |

---

## 6. INITIALIZATION PATTERN ENFORCEMENT

### Validation Prompt

> **Check:** Does the file use the CDN-safe initialization pattern with guard flag and Webflow.push?

**What to look for:**
1. `INIT_FLAG` constant with unique name
2. Guard check: `if (window[INIT_FLAG]) return;`
3. Guard set: `window[INIT_FLAG] = true;`
4. `INIT_DELAY_MS` constant
5. DOM ready handling with setTimeout
6. Webflow.push with fallback

### Pattern Recognition

**Compliant Initialization:**
```javascript
const INIT_FLAG = '__componentNameCdnInit';
const INIT_DELAY_MS = 50;

function init_component() {
  // initialization code
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

**Non-Compliant Patterns:**

| Violation         | Example                 | Problem                         |
| ----------------- | ----------------------- | ------------------------------- |
| No guard          | Missing INIT_FLAG check | Script runs multiple times      |
| No delay          | Direct call to init     | DOM/libraries not ready         |
| No Webflow.push   | Only DOMContentLoaded   | Misses Webflow page transitions |
| Hardcoded timeout | `setTimeout(init, 100)` | No configurable constant        |

### Remediation

**To add initialization pattern:**
1. Add at the top of your code:
```javascript
const INIT_FLAG = '__[componentName]CdnInit';
const INIT_DELAY_MS = 50;
```

2. Wrap initialization in guarded start function
3. Add Webflow.push with fallback
4. See code_quality_standards.md Section 2 for complete template

---

## 7. CSS STYLE ENFORCEMENT

### 7.1 Custom Property Naming Enforcement

#### Validation Prompt

> **Check:** Do CSS custom properties use semantic prefixes?

**What to look for:**
1. `--font-*` for typography values
2. `--vw-*` for viewport calculations
3. `--component-*` or `--{name}-*` for component-specific values
4. `--state-*` for interactive states
5. `--global-*` for site-wide values

#### Pattern Recognition

**Compliant Pattern:**
```css
:root {
  --font-from: 18;
  --font-to: 24;
  --vw-from: calc(1920 / 100);
  --vw-to: calc(2560 / 100);
  --hero-padding: 2rem;
  --state-hover-opacity: 0.8;
  --global-max-width: 1440px;
}
```

**Violation Patterns:**

| Violation | Example | How to Identify |
|-----------|---------|-----------------|
| No prefix | `--from: 18;` | Generic name without context |
| Wrong scope | `--padding: 2rem;` | Ambiguous - which component? |
| Inconsistent naming | `--heropadding: 2rem;` | Missing dash separator |

#### Remediation

**Conversion rules:**
| From | To |
|------|-----|
| `--from` | `--font-from` or `--vw-from` |
| `--padding` | `--hero-padding` or `--card-padding` |
| `--color` | `--state-color` or `--theme-color` |

---

### 7.2 Attribute Selector Enforcement

#### Validation Prompt

> **Check:** Do attribute selectors for custom data attributes include the case-insensitivity flag `i`?

**What to look for:**
1. `[data-*="value" i]` - note the `i` flag after the closing quote
2. Applies to ALL custom data attributes
3. Prevents silent selector failures from casing variations

#### Pattern Recognition

**Compliant Pattern:**
```css
/* Case-insensitive - matches "Base", "base", "BASE" */
[data-render-content="base" i] {
  content-visibility: auto;
}

[data-component="hero" i] {
  position: relative;
}
```

**Non-Compliant Pattern:**
```css
/* WRONG: Case-sensitive - only matches exact "base" */
[data-render-content="base"] {
  content-visibility: auto;
}
```

#### Remediation

**To fix missing `i` flag:**
1. Find all `[data-*="value"]` selectors
2. Add ` i` after the closing quote: `[data-*="value" i]`

**Browser support:** Chrome 49+, Firefox 47+, Safari 9+, Edge 79+

---

### 7.3 BEM Naming Enforcement

#### Validation Prompt

> **Check:** Do CSS class names follow BEM convention with correct separators?

**What to look for:**
1. Block: `.block` (single class)
2. Element: `.block--element` (double-dash separator)
3. Modifier: `.block-modifier` (single-dash separator)

#### Pattern Recognition

**Compliant Pattern:**
```css
.hero { }                    /* Block */
.hero--title { }             /* Element (double-dash) */
.hero--overlay { }           /* Element */
.hero-featured { }           /* Modifier (single-dash) */
.btn { }                     /* Block */
.btn--icon { }               /* Element */
.btn-primary { }             /* Modifier */
```

**Violation Patterns:**

| Violation | Example | Correct |
|-----------|---------|---------|
| camelCase | `.heroTitle` | `.hero--title` |
| snake_case | `.hero_title` | `.hero--title` |
| Wrong separator | `.hero-title` (element) | `.hero--title` |
| Mixed styles | `.Hero--Title` | `.hero--title` |

#### Remediation

**Conversion rules:**
| From | To |
|------|-----|
| `.heroTitle` | `.hero--title` (element) |
| `.hero_overlay` | `.hero--overlay` (element) |
| `.Hero-Featured` | `.hero-featured` (modifier) |

---

### 7.4 Animation Property Enforcement

#### Validation Prompt

> **Check:** Do animations use only GPU-accelerated properties?

**What to look for:**
1. **ALLOWED (GPU-accelerated):** `transform`, `opacity`, `scale`
2. **FORBIDDEN (layout triggers):** `width`, `height`, `top`, `left`, `right`, `bottom`, `padding`, `margin`
3. `will-change` is set dynamically, not permanently

#### Pattern Recognition

**Compliant Pattern:**
```css
.animated-element {
  /* GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* will-change set via JavaScript before animation */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes */
.animation-complete {
  will-change: auto;
}
```

**Non-Compliant Pattern:**
```css
/* WRONG: Animating layout properties causes reflow */
.slide-in {
  transition: left 0.3s;        /* Should use: transform: translateX() */
}

.expand {
  transition: width 0.3s;       /* Should use: transform: scaleX() */
}

.move {
  transition: top 0.3s, left 0.3s;  /* Should use: transform: translate() */
}

/* WRONG: Permanent will-change wastes GPU memory */
.always-ready {
  will-change: transform, opacity;  /* Set dynamically, not in CSS */
}
```

#### Remediation

**Property conversion:**
| From (Layout) | To (GPU-accelerated) |
|---------------|----------------------|
| `left: 100px` | `transform: translateX(100px)` |
| `top: 50px` | `transform: translateY(50px)` |
| `width: 200%` | `transform: scaleX(2)` |
| `height: 0` to `height: auto` | Use `transform: scaleY()` or `clip-path` |

**For `will-change`:**
1. Remove from CSS
2. Set via JavaScript BEFORE animation: `element.style.willChange = 'transform, opacity'`
3. Reset AFTER animation: `element.style.willChange = 'auto'`

---

## 8. ENFORCEMENT WORKFLOW

### Pre-Completion Gate

Before claiming "done" or "complete" on **JavaScript or CSS** implementation:

1. **Identify file type** - JavaScript (Sections 2-7) or CSS (Section 8)
2. **Load** [code_quality_checklist.md](../../assets/checklists/code_quality_checklist.md)
3. **Check** each P0 item systematically for that file type
4. **Fix** any P0 violations found
5. **Check** P1 items
6. **Fix** or document approved deferrals for P1
7. **Document** P2 deferrals with reasons
8. **Only then** claim completion

For formal findings-first review output, run `sk-code-review` baseline and use this workflow as web overlay evidence.

### Language-Specific Gate Selection

| File Type | Checklist Sections | P0 Item Count |
|-----------|-------------------|---------------|
| JavaScript (`.js`) | Sections 2-7 | 13 items |
| CSS (`.css`) | Section 8 | 4 items |
| Both | All sections | 17 items |

### Violation Resolution Flow

```
Violation Found
    │
    ├─► P0 Violation → MUST FIX → Fix violation → Re-check
    │
    ├─► P1 Violation → Fix OR get approval to defer
    │                   │
    │                   ├─► Fix → Re-check
    │                   └─► Defer → Document reason → Continue
    │
    └─► P2 Violation → Can defer → Document reason → Continue
```

### Escalation

If you cannot resolve a violation:
1. Document the specific violation
2. Explain why it cannot be fixed
3. Ask for guidance or approval to deviate
4. Route unresolved findings through `sk-code-review` for severity-ranked reporting

---

## 9. RELATED RESOURCES

### Primary Standards
- [code_style_guide.md](./code_style_guide.md) - Complete style conventions (JS + CSS)
- [code_quality_standards.md](./code_quality_standards.md) - Quality patterns

### Checklists
- [code_quality_checklist.md](../../assets/checklists/code_quality_checklist.md) - Validation checklist

### Production Examples

**JavaScript:**
- `src/javascript/video/video_background_hls_hover.js` - Complete compliant example
- `src/javascript/form/file_upload.js` - Form component with full structure

**CSS:**
- `src/1_css/global/fluid_responsive.css` - Custom property naming example
- `src/1_css/button/btn_primary.css` - BEM naming example
- `src/1_css/animations/hover_state_machine.css` - GPU-accelerated animations
