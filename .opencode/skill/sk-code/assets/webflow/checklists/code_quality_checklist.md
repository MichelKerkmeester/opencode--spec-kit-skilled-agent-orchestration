---
title: Code Quality Checklist
description: Validation checklist for JavaScript and CSS code quality and style compliance.
---

# Code Quality Checklist

Validation checklist for JavaScript and CSS code quality and style compliance.

---

## 1. OVERVIEW

### Purpose

Validate code against style standards before claiming implementation is complete. This checklist ensures consistent, maintainable code across the codebase.

### Usage

1. **Load** this checklist when completing code implementation
2. **Identify** file type (JavaScript → Sections 2-7, CSS → Section 8)
3. **Validate** each applicable item against the code
4. **Mark** items `[x]` when verified
5. **Block** completion if any P0 item fails
6. **Document** P2 deferrals with reasons

### Language Coverage

| Language | File Extension | Checklist Sections |
|----------|----------------|-------------------|
| JavaScript | `.js` | Sections 2-7 |
| CSS | `.css` | Section 8 |

### Review Baseline Handoff

For formal findings-first review output, run `sk-code-review` as the baseline and use this checklist as the web overlay.

- Severity model and review output contract: `sk-code-review/references/quick_reference.md`
- Baseline security/quality/test review checks: `sk-code-review` references
- This checklist: web-specific JavaScript/CSS standards evidence

### Source Standards

- [code_style_guide.md](../../references/standards/code_style_guide.md) - Naming, formatting, commenting rules
- [code_quality_standards.md](../../references/standards/code_quality_standards.md) - Quality patterns

---

## 2. FILE HEADER CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 3](../../references/standards/code_style_guide.md#3-📁-file-structure)

### File Header Format

- [ ] **[P0] CHK-HDR-01**: File starts with three-line header
- [ ] **[P0] CHK-HDR-02**: Header uses box-drawing character `─` (U+2500), not hyphen `-`
- [ ] **[P0] CHK-HDR-03**: Header line width is 67 characters
- [ ] **[P1] CHK-HDR-04**: Category label is ALL CAPS
- [ ] **[P1] CHK-HDR-05**: Component name is descriptive (2-4 words)
- [ ] **[P2] CHK-HDR-06**: No metadata (dates, authors, version numbers) in header

**Compliant Example:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────
```

**Non-Compliant Examples:**
```javascript
// WRONG: Using hyphens instead of box-drawing characters
// -------------------------------------------------------------------
// VIDEO: BACKGROUND HLS HOVER
// -------------------------------------------------------------------

// WRONG: Missing header entirely
(() => {
  // code starts without header
})();

// WRONG: Metadata in header
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER - Created 2024-01-15 by Developer
// ───────────────────────────────────────────────────────────────
```

---

## 3. SECTION ORGANIZATION CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 3](../../references/standards/code_style_guide.md#3-📁-file-structure)

### Section Headers

- [ ] **[P0] CHK-SEC-01**: Code is wrapped in IIFE `(() => { ... })()`
- [ ] **[P0] CHK-SEC-02**: Section headers use multi-line comment format `/* ... */`
- [ ] **[P0] CHK-SEC-03**: Section headers are numbered (1, 2, 3, etc.)
- [ ] **[P1] CHK-SEC-04**: Section titles are ALL CAPS
- [ ] **[P1] CHK-SEC-05**: Section header line width is 68 characters
- [ ] **[P1] CHK-SEC-06**: Opening line starts with `/* ─`
- [ ] **[P1] CHK-SEC-07**: Closing line starts with `──` (not `*/` on same line as title)

### Standard Section Order

- [ ] **[P1] CHK-SEC-08**: Sections follow standard order (when applicable):
  1. CONFIGURATION
  2. UTILITIES
  3. CORE FUNCTIONS
  4. EVENT HANDLERS
  5. INITIALIZE
  6. PUBLIC API (optional)

- [ ] **[P2] CHK-SEC-09**: Each section contains related code only

**Compliant Example:**
```javascript
/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */
const INIT_FLAG = '__componentNameInit';
const INIT_DELAY_MS = 50;

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */
function is_valid(element) { }
```

**Non-Compliant Examples:**
```javascript
// WRONG: Missing numbered sections
/* CONFIGURATION */
const INIT_FLAG = '__componentNameInit';

// WRONG: Using single-line comments for sections
// ═══════════════════════════════════════════════════════════════
// 1. CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// WRONG: Title not in ALL CAPS
/* ─────────────────────────────────────────────────────────────
   1. Configuration
──────────────────────────────────────────────────────────────── */
```

---

## 4. COMMENT QUALITY CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 5](../../references/standards/code_style_guide.md#5-💬-commenting-rules)

### Comment Principles

- [ ] **[P0] CHK-CMT-01**: No commented-out code (delete unused code, git preserves history)
- [ ] **[P1] CHK-CMT-02**: Comments explain WHY, not WHAT
- [ ] **[P1] CHK-CMT-03**: Maximum 5 comments per 10 lines of code (not over-commented)
- [ ] **[P1] CHK-CMT-04**: Platform constraints documented (WEBFLOW, MOTION, LENIS, HLS.JS)

### Function Comments

- [ ] **[P1] CHK-CMT-05**: Functions have single-line purpose comment above
- [ ] **[P2] CHK-CMT-06**: Complex/public functions have JSDoc with `@param` and `@returns`

**Compliant Comments (WHY):**
```javascript
// Prevent background scroll while modal is open
if (window.lenis) {
  window.lenis.stop();
}

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;

// Add 10 second timeout to prevent infinite hang
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);
```

**Non-Compliant Comments (WHAT):**
```javascript
// WRONG: Narrates implementation
// Set price to price times 100
const price_cents = price * 100;

// WRONG: States the obvious
// Loop through items
for (const item of items) { }

// WRONG: Describes what code does, not why
// Check if element exists
if (element) { }
```

---

## 5. NAMING CONVENTION CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 2](../../references/standards/code_style_guide.md#2-📝-naming-conventions)

### Variable Naming

- [ ] **[P0] CHK-NAM-01**: Variables use `snake_case` (not camelCase)
- [ ] **[P0] CHK-NAM-02**: Constants use `UPPER_SNAKE_CASE`
- [ ] **[P1] CHK-NAM-03**: Boolean variables use `is_` or `has_` prefix
- [ ] **[P1] CHK-NAM-04**: Private variables use `_snake_case` prefix

### Function Naming

- [ ] **[P0] CHK-NAM-05**: Functions use `snake_case` (not camelCase)
- [ ] **[P1] CHK-NAM-06**: Functions use semantic prefixes:
  - `is_` / `has_` - Boolean checks
  - `get_` - Data retrieval (no mutation)
  - `set_` - Data mutation
  - `handle_` - Event handlers
  - `init_` - Initialization
  - `bind_` - Event binding
  - `toggle_` - State toggles
  - `validate_` - Validation
  - `load_` - Resource loading

**Compliant Naming:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const INIT_FLAG = '__componentNameInit';
const _internal_cache = {};

// Functions
function is_valid_email(email) { }
function get_form_data(form) { }
function handle_submit(event) { }
function init_component() { }
```

**Non-Compliant Naming:**
```javascript
// WRONG: camelCase variables
const hoverTimer = null;
const isAttached = false;

// WRONG: camelCase functions
function isValidEmail(email) { }
function getFormData(form) { }
function handleSubmit(event) { }

// WRONG: Missing semantic prefix
function email(value) { }  // Should be: is_valid_email or validate_email
function data(form) { }    // Should be: get_form_data
```

---

## 6. INITIALIZATION PATTERN CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_quality_standards.md Section 2](../../references/standards/code_quality_standards.md#2-🔧-initialization-pattern-cdn-safe)

### CDN-Safe Initialization

- [ ] **[P0] CHK-INI-01**: Unique `INIT_FLAG` constant defined
- [ ] **[P0] CHK-INI-02**: Guard check prevents double initialization: `if (window[INIT_FLAG]) return;`
- [ ] **[P0] CHK-INI-03**: Guard flag set: `window[INIT_FLAG] = true;`
- [ ] **[P1] CHK-INI-04**: `INIT_DELAY_MS` constant defined (default 50)
- [ ] **[P1] CHK-INI-05**: Uses setTimeout with INIT_DELAY_MS for DOM readiness
- [ ] **[P1] CHK-INI-06**: DOMContentLoaded listener uses `{ once: true }`
- [ ] **[P1] CHK-INI-07**: Webflow.push integration with fallback

**Compliant Pattern:**
```javascript
const INIT_FLAG = '__componentNameCdnInit';
const INIT_DELAY_MS = 50;

function init_component() {
  // Your initialization code here
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

---

## 7. FORMATTING CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code_style_guide.md Section 4](../../references/standards/code_style_guide.md#4-🎨-formatting)

### Basic Formatting

- [ ] **[P1] CHK-FMT-01**: 2-space indentation (no tabs)
- [ ] **[P1] CHK-FMT-02**: Same-line opening braces (K&R style)
- [ ] **[P1] CHK-FMT-03**: Semicolons always used
- [ ] **[P1] CHK-FMT-04**: Single quotes for strings
- [ ] **[P2] CHK-FMT-05**: Trailing commas in multi-line structures
- [ ] **[P2] CHK-FMT-06**: Line length under 120 characters

---

## 8. CSS STYLE CHECKS

**Applies to:** CSS (`.css`)

**Reference:** [code_style_guide.md Section 6](../../references/standards/code_style_guide.md#6-🎯-css-style-conventions)

### Custom Property Naming

- [ ] **[P0] CHK-CSS-01**: Custom properties use semantic prefixes (`--font-*`, `--vw-*`, `--component-*`, `--state-*`, `--global-*`)
- [ ] **[P1] CHK-CSS-02**: Component-specific properties include component name (`--hero-padding`, `--card-radius`)
- [ ] **[P2] CHK-CSS-03**: Calculation properties are clearly named (`--coefficient`, `--base`)

### Attribute Selectors

- [ ] **[P0] CHK-CSS-04**: Attribute selectors use case-insensitivity flag `i` for custom data attributes
- [ ] **[P1] CHK-CSS-05**: Data attributes use kebab-case values (`data-render-content="base"`)

### BEM Naming

- [ ] **[P0] CHK-CSS-06**: Class names follow BEM convention: `.block`, `.block__element`, `.block--modifier`
- [ ] **[P1] CHK-CSS-07**: Elements use double-underscore separator (`__`)
- [ ] **[P1] CHK-CSS-08**: Modifiers use double-dash separator (`--`)

### Animation Properties

- [ ] **[P0] CHK-CSS-09**: Animations use GPU-accelerated properties only (`transform`, `opacity`, `scale`)
- [ ] **[P1] CHK-CSS-10**: Layout properties NOT animated (`width`, `height`, `top`, `left`, `padding`, `margin`)
- [ ] **[P1] CHK-CSS-11**: `will-change` managed dynamically (set before animation, reset to `auto` after)

### File Organization

- [ ] **[P1] CHK-CSS-12**: File names use `snake_case` (`btn_app_store.css`, `form_file_upload.css`)
- [ ] **[P2] CHK-CSS-13**: One file per component type, grouped by category

**Compliant Examples:**

```css
/* Custom Properties - Semantic prefixes */
:root {
  --font-from: 18;
  --font-to: 24;
  --vw-from: calc(1920 / 100);
  --vw-to: calc(2560 / 100);
  --hero-padding: 2rem;
  --state-hover-opacity: 0.8;
}

/* Attribute Selectors - Case-insensitive */
[data-render-content="base" i] {
  content-visibility: auto;
}

/* BEM Naming */
.hero { }                    /* Block */
.hero__title { }             /* Element (double-underscore) */
.hero__overlay { }           /* Element */
.hero--featured { }          /* Modifier (double-dash) */

/* GPU-Accelerated Animation */
.animated-element {
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  /* AVOID: width, height, top, left, padding, margin */
}
```

**Non-Compliant Examples:**

```css
/* WRONG: No semantic prefix */
:root {
  --from: 18;              /* Should be: --font-from */
  --padding: 2rem;         /* Should be: --component-padding or --hero-padding */
}

/* WRONG: Missing case-insensitivity flag */
[data-render-content="base"] {  /* Should include 'i' flag */
  content-visibility: auto;
}

/* WRONG: Inconsistent BEM */
.heroTitle { }             /* Should be: .hero__title (BEM element) */
.hero_overlay { }          /* Should be: .hero__overlay (double-underscore) */

/* WRONG: Animating layout properties */
.slide-in {
  transition: left 0.3s;   /* Should use: transform: translateX() */
  transition: width 0.3s;  /* Layout property - causes reflow */
}
```

---

## 9. VERIFICATION SUMMARY TEMPLATE

After completing validation, document the results using the appropriate template.

### JavaScript Files

```markdown
## Code Quality Verification Summary

**File**: [filename.js]
**Date**: [YYYY-MM-DD]

### Results

| Category | P0 | P1 | P2 | Status |
|----------|----|----|----|----|
| File Header | X/3 | X/2 | X/1 | ✅/❌ |
| Section Organization | X/3 | X/4 | X/1 | ✅/❌ |
| Comment Quality | X/1 | X/4 | X/1 | ✅/❌ |
| Naming Conventions | X/3 | X/2 | X/0 | ✅/❌ |
| Initialization Pattern | X/3 | X/4 | X/0 | ✅/❌ |
| Formatting | X/0 | X/4 | X/2 | ✅/❌ |

**P0 Status**: All passed? [YES/NO]
**P1 Status**: All passed or deferred? [YES/NO]
**Gate Result**: [PASS/BLOCKED]

### Deferred Items (if any)
- [Item ID]: [Reason for deferral]
```

### CSS Files

```markdown
## Code Quality Verification Summary

**File**: [filename.css]
**Date**: [YYYY-MM-DD]

### Results

| Category | P0 | P1 | P2 | Status |
|----------|----|----|----|----|
| Custom Property Naming | X/1 | X/1 | X/1 | ✅/❌ |
| Attribute Selectors | X/1 | X/1 | X/0 | ✅/❌ |
| BEM Naming | X/1 | X/2 | X/0 | ✅/❌ |
| Animation Properties | X/1 | X/2 | X/0 | ✅/❌ |
| File Organization | X/0 | X/1 | X/1 | ✅/❌ |

**P0 Status**: All passed? [YES/NO]
**P1 Status**: All passed or deferred? [YES/NO]
**Gate Result**: [PASS/BLOCKED]

### Deferred Items (if any)
- [Item ID]: [Reason for deferral]
```

---

## 10. QUICK REFERENCE

### JavaScript Pass Criteria

| Check Category | Minimum for PASS |
|----------------|------------------|
| File Header | All P0 items (CHK-HDR-01 to CHK-HDR-03) |
| Section Organization | All P0 items (CHK-SEC-01 to CHK-SEC-03) |
| Comment Quality | All P0 items (CHK-CMT-01) |
| Naming Conventions | All P0 items (CHK-NAM-01, CHK-NAM-02, CHK-NAM-05) |
| Initialization Pattern | All P0 items (CHK-INI-01 to CHK-INI-03) |
| Formatting | All P1 items recommended |

### CSS Pass Criteria

| Check Category | Minimum for PASS |
|----------------|------------------|
| Custom Property Naming | All P0 items (CHK-CSS-01) |
| Attribute Selectors | All P0 items (CHK-CSS-04) |
| BEM Naming | All P0 items (CHK-CSS-06) |
| Animation Properties | All P0 items (CHK-CSS-09) |
| File Organization | All P1 items recommended |

### Gate Rule

**If ANY P0 item fails, completion is BLOCKED until fixed.**

---

## 11. RELATED RESOURCES

### Source Standards

- [code_style_guide.md](../../references/standards/code_style_guide.md) - Naming, formatting, commenting rules
- [code_quality_standards.md](../../references/standards/code_quality_standards.md) - Quality patterns

### Enforcement Reference

- [code_style_enforcement.md](../../references/standards/code_style_enforcement.md) - Validation prompts, examples, remediation

### Parent Skill

- [SKILL.md](../../SKILL.md) - (Phase 1.5: Code Quality Gate)
