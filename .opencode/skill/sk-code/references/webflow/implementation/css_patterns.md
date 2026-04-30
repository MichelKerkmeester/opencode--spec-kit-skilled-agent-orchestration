---
title: CSS Patterns - Webflow Implementation Reference
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems.
---

# CSS Patterns - Webflow Implementation Reference

Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems.

---

## 1. OVERVIEW

### Purpose

This reference documents CSS patterns used in example.com's Webflow implementation. These patterns solve common challenges in Webflow projects: managing hover/focus states declaratively, handling form validation visually, ensuring accessibility compliance, and maintaining consistent design tokens.

### Prerequisites

Follow code quality standards for all CSS implementations:
- **Naming:** Use existing conventions documented in this file
- **Accessibility:** Include `prefers-reduced-motion` for all animations
- See [code_quality_standards.md](../standards/code_quality_standards.md) for complete requirements

### When to Use This Reference

- Implementing hover/focus animations on cards or interactive elements
- Building form validation with visual feedback
- Ensuring keyboard vs mouse focus distinction
- Working with Webflow Designer mode previews
- Understanding the existing design token system

### Core Principle

**Declarative CSS state management**: Use CSS custom properties as state signals (`--_state---on/off`) to drive animations, letting HTML data attributes determine behavior and CSS handle the visual response.

### Key Sources

| Source File                                     | Pattern                  |
| ----------------------------------------------- | ------------------------ |
| `/src/1_css/animations/hover_state_machine.css` | State machine pattern    |
| `/src/1_css/form/form_validation.css`           | Validation states        |
| `/src/1_css/form/input_main.css`                | Keyboard focus detection |
| `/src/1_css/form/input_global.css`              | Mobile/browser fixes     |

---

## 2. WEBFLOW CSS TOKEN SYSTEM

### Important Disclaimer

> **WEBFLOW-SPECIFIC**: The naming convention documented in this section (`--_category---subcategory--variant`) is specific to Webflow Designer's generated CSS. This is NOT a recommended general practice for CSS custom properties. This section documents how existing code works to ensure consistency when extending it - NOT as a template for new CSS projects outside Webflow.

### Token Naming Convention

Webflow Designer generates CSS custom properties with a specific naming structure:

```
--_category---subcategory--variant
```

**Structure breakdown:**
- `--_` - Prefix (underscore after double dash)
- `category` - Top-level category (e.g., `color-tokens`, `layout`, `typography`)
- `---` - Triple dash separator
- `subcategory` - Specific token group (e.g., `input-bg`, `border-neutral`)
- `--` - Double dash separator
- `variant` - State or variation (e.g., `enabled`, `hover`, `primary`)

### Color Token Categories

**Input tokens** (form elements):
```css
/* [SOURCE: form_validation.css:19-22, input_main.css:12-14] */

/* Background states */
--_color-tokens---input-bg--enabled       /* Default input background */
--_color-tokens---input-bg--negative      /* Invalid/error state background */
--_color-tokens---input-bg--positive      /* Valid/success state background */

/* Border states */
--_color-tokens---input-border--enabled   /* Default border */
--_color-tokens---input-border--hover     /* Hover state border */
--_color-tokens---input-border--active    /* Focused/active border */
--_color-tokens---input-border--negative  /* Invalid/error state border */

/* Content states */
--_color-tokens---input-content--placeholder        /* Placeholder text */
--_color-tokens---input-content--placeholder_hover  /* Placeholder on hover */
--_color-tokens---input-content--negative           /* Error state text */
```

**Semantic state tokens**:
```css
/* [SOURCE: form_validation.css:180, input_main.css:43-44] */

--_color-tokens---state--focused   /* Keyboard focus ring color */
--_color-tokens---state--warning   /* Warning/error state */
--_color-tokens---state--success   /* Success/valid state */
```

**Neutral tokens** (backgrounds, borders, content):
```css
/* [SOURCE: input_global.css:164-168] */

--_color-tokens---bg-neutral--white           /* White background */
--_color-tokens---bg-neutral--light           /* Light gray background */
--_color-tokens---bg-neutral--base            /* Base gray background */
--_color-tokens---border-neutral--dark        /* Dark gray border */
--_color-tokens---border-neutral--darkest     /* Darkest border */
--_color-tokens---content-neutral--dark       /* Dark text */
--_color-tokens---content-neutral--darkest    /* Darkest text */
```

**Brand/highlight tokens**:
```css
/* [SOURCE: link_card.css:25-29, input_global.css:29] */

--_color-tokens---border-highlight--primary   /* Primary brand border */
--_color-tokens---border-brand--base          /* Brand color border */
--_color-tokens---content-highlight--primary  /* Primary highlight (caret) */
```

### Layout Tokens

```css
/* [SOURCE: input_upload.css:32] */

--_layout---radius--base  /* Standard border radius */
```

### Typography Tokens

```css
/* [SOURCE: link_card.css:17] */

--_typography---size--extra-large  /* Extra large text size */
```

### Using Tokens in CSS

**Pattern:** Always reference tokens via `var()` function:

```css
/* [SOURCE: input_main.css:12-14] */

/* Correct: Reference Webflow tokens */
.input {
  background-color: var(--_color-tokens---input-bg--enabled);
  border: 1.5px solid var(--_color-tokens---input-border--enabled);
}

/* Incorrect: Hardcoded values */
.input {
  background-color: #ffffff;  /* DON'T - use token */
  border: 1.5px solid #d1d5db; /* DON'T - use token */
}
```

### Component-Scoped Variables

For component-specific customization, define local CSS variables that reference Webflow tokens:

```css
/* [SOURCE: link_card_product.css:8-16] */

[data-product] {
  /* Map component vars to Webflow tokens */
  --product-border-default: var(--_color-tokens---link-product--border);
  --product-border-hover: var(--_color-tokens---link-product--border_hover);
  --product-button-bg-default: var(--_color-tokens---link-product--button);
  --product-button-bg-hover: var(--_color-tokens---link-product--button_hover);
}
```

**Benefits:**
- Component is self-contained
- Easy to customize per-instance
- Tokens remain the single source of truth

---

## 3. CSS STATE MACHINE PATTERN

### Core Concept

The state machine pattern uses CSS custom properties (`--_state---on` and `--_state---off`) as binary signals (0 or 1) to drive animations. This enables:

1. **Declarative behavior:** HTML attributes define WHAT happens, CSS defines HOW
2. **Composable states:** Multiple triggers (hover, focus, preview) use same variables
3. **Designer preview:** Webflow Designer can trigger states via `data-state="preview"`

### State Variable Declaration

```css
/* [SOURCE: hover_state_machine.css:9-12] */

/* Default: All states start OFF */
[data-state] {
  --_state---on: 0;
  --_state---off: 1;
}
```

**Key insight:** Elements with `data-state` attribute get state variables. The values are:
- `--_state---on: 0` (OFF state) or `--_state---on: 1` (ON state)
- `--_state---off: 1` (OFF state) or `--_state---off: 0` (ON state)

These are always inverses: when one is 0, the other is 1.

### Using State Variables in Animations

**Mathematical interpolation** - Use `calc()` with state variables:

```css
/* [SOURCE: link_card_image.css:6-8] */

/* Width expands from 0% to 100% based on state */
[data-state] [data-hover="divider"] {
  width: calc(100% * clamp(0, var(--_state---on, 0), 1));
  transition: width 300ms ease-out;
}
```

**How it works:**
- When OFF: `width: calc(100% * 0)` = 0%
- When ON: `width: calc(100% * 1)` = 100%
- Transition handles the animation between states

```css
/* [SOURCE: link_card_image.css:23-26] */

/* Scale from 1.0 to 1.05 (5% zoom) */
[data-state] [data-hover="image"] {
  transform: scale(calc(1 + (0.05 * clamp(0, var(--_state---on, 0), 1))));
  transition: transform 300ms ease-out;
}
```

**How it works:**
- When OFF: `scale(1 + (0.05 * 0))` = `scale(1.0)`
- When ON: `scale(1 + (0.05 * 1))` = `scale(1.05)`

```css
/* [SOURCE: link_card_image.css:16-20] */

/* Opacity from 0 to 1 */
@media (min-width: 991px) {
  [data-state] [data-hover="icon"] {
    opacity: calc(0 + (1 * clamp(0, var(--_state---on, 0), 1)));
    transition: opacity 300ms ease-out;
  }
}
```

### Color Interpolation with color-mix()

For color transitions, use `color-mix()` with state percentage:

```css
/* [SOURCE: link_card_product.css:22-27] */

/* Border color transitions from default to hover color */
[data-product][data-state] [data-hover="border"] {
  border-color: color-mix(in srgb,
      var(--product-border-default),
      var(--product-border-hover) calc(var(--_state---on, 0) * 100%));
  transition: border-color 200ms ease-out;
}
```

**How it works:**
- When OFF: `color-mix(default, hover 0%)` = 100% default color
- When ON: `color-mix(default, hover 100%)` = 100% hover color
- Transition animates between

```css
/* [SOURCE: link_card_product.css:40-47] */

/* Button background color transition */
[data-product][data-state] [data-hover="button"] {
  background-color: color-mix(in srgb,
      var(--product-button-bg-default),
      var(--product-button-bg-hover) calc(var(--_state---on, 0) * 100%));
  transition: background-color 200ms ease-out;
}
```

---

## 4. STATE TRIGGERS

### Hover Trigger

```css
/* [SOURCE: hover_state_machine.css:43-48] */

@media (hover: hover) {
  /* Basic hover: Activates on element hover */
  [data-state~="hover"]:hover {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**HTML usage:**
```html
<div data-state="hover">
  <img data-hover="image" src="..." />
</div>
```

**Key points:**
- `@media (hover: hover)` prevents activation on touch devices
- `data-state~="hover"` uses attribute contains word selector (allows multiple values)
- On hover, state flips from OFF to ON

### Conditional Hover (Clickable Content)

```css
/* [SOURCE: hover_state_machine.css:50-55] */

@media (hover: hover) {
  /* Only activates if element contains clickable content */
  [data-state~="hover-if-clickable"]:has(.clickable--w:not(.w-condition-invisible)):hover {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**Use case:** CMS-driven cards that sometimes have links, sometimes don't. Hover effect only activates when there's actually something to click.

### Focus Trigger

```css
/* [SOURCE: hover_state_machine.css:27-30] */

/* Activates when element or children receive focus */
[data-state~="focus"]:is(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Key points:**
- `:focus-visible` only shows for keyboard navigation
- `:has(:focus-visible)` catches focus on child elements
- Combined with `:is()` for either condition

### Group Focus (Sibling Highlighting)

```css
/* [SOURCE: hover_state_machine.css:32-38] */

/* When one "focus-other" item is focused, activate state on all NON-focused siblings */
[data-state~="group"]:has([data-state~="focus-other"]:focus-visible, [data-state~="focus-other"] :focus-visible)
  [data-state~="focus-other"]:not(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Use case:** Grid of cards where focusing one card dims/highlights all others.

**HTML structure:**
```html
<div data-state="group">
  <div data-state="focus-other">Card 1</div>
  <div data-state="focus-other">Card 2</div>
  <div data-state="focus-other">Card 3</div>
</div>
```

### Group Hover (Sibling Dimming)

```css
/* [SOURCE: hover_state_machine.css:57-70] */

@media (hover: hover) {
  /* Activate state on non-hovered siblings when any sibling is hovered */
  [data-state~="group"]:has([data-state~="hover-other"]:hover)
    [data-state~="hover-other"]:not(:hover) {
    --_state---on: 1;
    --_state---off: 0;
  }

  /* Override: Keep hovered element at default state */
  [data-state~="hover-other"]:hover {
    --_state---on: 0 !important;
    --_state---off: 1 !important;
  }
}
```

**Use case:** Hover one card, dim all other cards in the same container.

**Important:** The `!important` on the hovered element ensures it stays at default state while siblings get the "dimmed" state.

### Mobile State (Touch Devices)

```css
/* [SOURCE: hover_state_machine.css:76-81] */

/* Always active on touch devices (no hover capability) */
@media (hover: none) {
  [data-state~="mobile"] {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**Use case:** Show expanded state by default on mobile where hover is impossible.

### Preview State (Webflow Designer)

```css
/* [SOURCE: hover_state_machine.css:17-21] */

/* Force ON state in Webflow Designer for preview */
.wf-design-mode [data-state~="preview"] {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Use case:** Preview hover/focus animations while editing in Webflow Designer.

**HTML usage:**
```html
<!-- Add "preview" to data-state to see animation in Designer -->
<div data-state="hover preview">
  ...
</div>
```

**Important:** Remove "preview" before publishing to production.

---

## 5. DATA ATTRIBUTE SELECTOR PATTERNS

### Attribute Presence Selector

```css
/* [SOURCE: hover_state_machine.css:9] */

/* Matches any element with data-state attribute */
[data-state] {
  --_state---on: 0;
  --_state---off: 1;
}
```

### Attribute Contains Word Selector (~=)

```css
/* [SOURCE: hover_state_machine.css:45] */

/* Matches when data-state contains "hover" as a word */
[data-state~="hover"]:hover { }
```

**Matches:**
- `data-state="hover"` - yes
- `data-state="hover focus"` - yes
- `data-state="hover-other"` - NO (word boundary)

### Attribute Equals Selector

```css
/* [SOURCE: input_select.css:10-11] */

/* Matches exact value */
[data-select="input"] {
  background-color: var(--_color-tokens---input-bg--enabled);
}
```

### Case-Insensitive Selector (i)

```css
/* [SOURCE: performance.css:15-18] */

/* Matches regardless of case */
[data-render-content="large" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 45rem;
}
```

**Matches:**
- `data-render-content="large"` - yes
- `data-render-content="LARGE"` - yes
- `data-render-content="Large"` - yes

### Descendant + Attribute Selector

```css
/* [SOURCE: link_card_image.css:5-6] */

/* Target descendants of state container by their role */
[data-state] [data-hover="divider"] {
  width: calc(100% * clamp(0, var(--_state---on, 0), 1));
}

[data-state] [data-hover="image"] {
  transform: scale(...);
}

[data-state] [data-hover="icon"] {
  opacity: calc(...);
}
```

**Pattern:** Container has `data-state`, children have `data-hover` to identify their animation role.

### Component State Selectors

```css
/* [SOURCE: input_upload.css:236-241] */

/* Target by component-specific state attribute */
.filepond--item[data-filepond-item-state="processing"] .filepond--item-panel {
  background-color: var(--filepond-bg-processing);
}

.filepond--item[data-filepond-item-state="processing-complete"] .filepond--item-panel {
  background-color: var(--filepond-bg-complete);
}

.filepond--item[data-filepond-item-state="processing-error"] .filepond--item-panel {
  background-color: var(--filepond-bg-error);
}
```

**Pattern:** Third-party components (FilePond) expose state via data attributes.

---

## 6. FORM VALIDATION STATE ARCHITECTURE

### Validation Class Pattern

Form validation uses CSS classes on the form field container:

| Class                 | State         | Visual Feedback                        |
| --------------------- | ------------- | -------------------------------------- |
| (none)                | Default       | Standard styling                       |
| `.validation-invalid` | Invalid/Error | Red border, red background, error text |
| `.validation-valid`   | Valid/Success | Success icon, optional green styling   |

### Container Structure

```html
<!-- Validation class goes on [data-form-field] container -->
<div data-form-field class="validation-invalid">
  <input class="input" data-form-input type="text" />
  <div id="input-success"><!-- checkmark icon --></div>
  <div data-error-container>Error message</div>
</div>
```

### Invalid State Styling

```css
/* [SOURCE: form_validation.css:55-60] */

/* Input border and background change to error colors */
[data-form-field].validation-invalid input.input[data-form-input]:not([type="checkbox"]):not([type="radio"]),
[data-form-field].validation-invalid textarea.input[data-form-input] {
  border: 1.5px solid;
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
}
```

```css
/* [SOURCE: form_validation.css:69-80] */

/* Placeholder text changes to error color */
[data-form-field].validation-invalid input.input[data-form-input]::placeholder,
[data-form-field].validation-invalid textarea.input[data-form-input]::placeholder {
  color: var(--_color-tokens---input-content--negative) !important;
  opacity: 1 !important;
}
```

```css
/* [SOURCE: form_validation.css:190-194] */

/* Helper text shows error color */
[data-form-field].validation-invalid [data-error-container],
[data-form-field].validation-invalid .input--helper-w {
  color: var(--_color-tokens---state--warning);
}
```

### Valid State Styling

```css
/* [SOURCE: form_validation.css:85-90] */

/* Success icon becomes visible */
[data-form-field].validation-valid input.input[data-form-input]:not([type="checkbox"]):not([type="radio"])~#input-success,
[data-form-field].validation-valid textarea.input[data-form-input]~#input-success,
[data-form-field].validation-valid #input-success {
  display: flex;
  opacity: 1;
}
```

```css
/* [SOURCE: form_validation.css:198-201] */

/* Helper text shows success color */
[data-form-field].validation-valid [data-error-container],
[data-form-field].validation-valid .input--helper-w {
  color: var(--_color-tokens---state--success);
}
```

### Autofill Override Pattern

Browser autofill adds its own styling that must be overridden to show validation states:

```css
/* [SOURCE: form_validation.css:10-22] */

/* Invalid autofill - force error colors */
[data-form-field].validation-invalid input:-webkit-autofill,
[data-form-field].validation-invalid input:-webkit-autofill:hover,
[data-form-field].validation-invalid input:-webkit-autofill:focus,
[data-form-field].validation-invalid input:-webkit-autofill:active {
  /* Box-shadow trick overrides autofill background */
  -webkit-box-shadow: 0 0 0px 1000px var(--_color-tokens---input-bg--negative) inset !important;
  box-shadow: 0 0 0px 1000px var(--_color-tokens---input-bg--negative) inset !important;
  border-color: var(--_color-tokens---input-border--negative) !important;
}
```

**Why the box-shadow trick:** Browsers ignore `background-color` on autofilled inputs. The large inset box-shadow visually covers the browser's autofill background.

### Select (Custom Dropdown) Validation

```css
/* [SOURCE: form_validation.css:99-106] */

/* Custom select components use same validation pattern */
[data-form-field].validation-invalid .input[data-select="input"],
[data-form-field].validation-invalid [data-select="input"],
.input--container.validation-invalid .input[data-select="input"],
[data-select="wrapper"].validation-invalid [data-select="input"] {
  border: 1.5px solid;
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
}
```

### File Upload (FilePond) Validation

```css
/* [SOURCE: form_validation.css:153-160] */

/* FilePond component validation */
[data-form-field].validation-invalid .input--file-upload .filepond--panel-root,
[data-form-field].validation-invalid [data-file-upload="wrapper"] .filepond--panel-root {
  border-color: var(--_color-tokens---input-border--negative);
  border-style: solid;
  background-color: var(--_color-tokens---input-bg--negative);
}
```

### Checkbox/Radio Validation

```css
/* [SOURCE: form_validation.css:176-182] */

/* Checkbox/radio show outline on error */
[data-form-field].validation-invalid .input--checkbox,
[data-form-field].validation-invalid .input--radio {
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
  outline: 4px solid var(--_color-tokens---state--focused);
  outline-offset: 0px;
}
```

---

## 7. KEYBOARD VS MOUSE FOCUS DETECTION

### The Problem

Mouse users don't need visible focus rings (they know where they clicked), but keyboard users need them for navigation. CSS `:focus` applies to both, `:focus-visible` helps but has edge cases.

### Solution: Body Class Pattern

JavaScript detects input method and adds class to `<body>`:

```javascript
// Keyboard navigation detected
document.body.classList.add('using-keyboard');

// Mouse click detected
document.body.classList.remove('using-keyboard');
```

### CSS Implementation

```css
/* [SOURCE: input_main.css:30-37] */

/* Mouse focus: Hide outline */
.input:focus,
.w-input:focus {
  background-color: var(--_color-tokens---input-bg--enabled);
  border-color: var(--_color-tokens---input-border--active);
  outline: none !important;
  outline-width: 0 !important;
}
```

```css
/* [SOURCE: input_main.css:39-45] */

/* Keyboard focus: Show visible outline */
body.using-keyboard .input:focus,
body.using-keyboard .w-input:focus {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

```css
/* [SOURCE: input_main.css:47-53] */

/* Fallback: :focus-visible (modern browsers) */
.input:focus-visible,
.w-input:focus-visible {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

```css
/* [SOURCE: input_main.css:55-60] */

/* Explicit mouse override: Hide outline */
body:not(.using-keyboard) .input:focus,
body:not(.using-keyboard) .w-input:focus {
  outline: none !important;
  outline-width: 0 !important;
}
```

### Priority Order

1. `body:not(.using-keyboard)` - Mouse users: no outline
2. `body.using-keyboard` - Keyboard users: visible outline
3. `:focus-visible` - Fallback for browsers/cases where JS hasn't run

### Select Input Implementation

```css
/* [SOURCE: input_select.css:40-46] */

/* Keyboard focus for custom select */
body.using-keyboard .input[data-select="input"]:focus,
body.using-keyboard [data-select="input"]:focus {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

---

## 8. ACCESSIBILITY PATTERNS

### Reduced Motion Support

**MANDATORY:** All animations must respect user's motion preference.

```css
/* [SOURCE: link_card_image.css:29-36] */

@media (prefers-reduced-motion: reduce) {
  [data-state] [data-hover="divider"],
  [data-state] [data-hover="icon"],
  [data-state] [data-hover="image"] {
    transition-duration: 0ms;
  }
}
```

```css
/* [SOURCE: link_card_product.css:52-58] */

@media (prefers-reduced-motion: reduce) {
  [data-product][data-state] [data-hover="border"],
  [data-product][data-state] [data-hover="image"],
  [data-product][data-state] [data-hover="button"] {
    transition-duration: 0ms;
  }
}
```

**Pattern:** Set `transition-duration: 0ms` rather than removing the transition property. This ensures:
- State changes still happen (no broken functionality)
- No animation occurs (respects user preference)
- Easier maintenance (one line change)

### Focus Visibility

Use `:focus-visible` instead of `:focus` for keyboard-only focus indicators:

```css
/* [SOURCE: hover_state_machine.css:27-30] */

/* Only activates on keyboard focus, not mouse clicks */
[data-state~="focus"]:is(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

### Color Contrast

Validation states use semantic color tokens with sufficient contrast:

| State   | Background Token       | Border Token               |
| ------- | ---------------------- | -------------------------- |
| Error   | `--input-bg--negative` | `--input-border--negative` |
| Success | `--input-bg--positive` | (optional)                 |
| Focus   | (unchanged)            | `--state--focused`         |

### Screen Reader Hidden Elements

```css
/* [SOURCE: input_select.css:200-210] */

/* Visually hidden but accessible to screen readers */
[data-select="hidden"] {
  position: absolute !important;
  width: 1.5px !important;
  height: 1.5px !important;
  padding: 0 !important;
  margin: -1.5px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
```

**Use case:** Hidden `<select>` element for form submission while showing custom dropdown UI.

---

## 9. MOBILE AND BROWSER-SPECIFIC PATTERNS

### Hover Media Query

```css
/* [SOURCE: hover_state_machine.css:43, input_global.css:48] */

/* Only apply hover styles on devices that support hover */
@media (hover: hover) {
  .element:hover { }
}
```

**Why:** Touch devices trigger `:hover` on tap and it stays until you tap elsewhere. This media query prevents sticky hover states on mobile.

### Touch Device Detection

```css
/* [SOURCE: input_global.css:114] */

/* Target touch devices with coarse pointer */
@media (hover: none) and (pointer: coarse) {
  /* Touch-specific styles */
}
```

### Mobile Zoom Prevention

iOS Safari zooms in on inputs with font-size < 16px. This prevents zoom:

```css
/* [SOURCE: input_global.css:64-111] */

@media screen and (max-width: 991px) {
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  textarea,
  select,
  .input,
  .w-input {
    font-size: 16px !important;
    -webkit-text-size-adjust: 100% !important;
  }
}
```

**Key points:**
- `16px` is the exact threshold - iOS only zooms on smaller fonts
- Applied at tablet/mobile breakpoint (991px)
- `!important` overrides Webflow's responsive font sizes

### Safari Hover Fix

```css
/* [SOURCE: input_global.css:47-58] */

@media (hover: hover) {
  .input:hover:not(:focus),
  .w-input:hover:not(:focus) {
    border-color: var(--_color-tokens---border-neutral--darkest);
  }
}
```

**Why `:not(:focus)`:** Prevents border color flashing when clicking into input (hover -> focus transition).

### Autofill Neutralization

```css
/* [SOURCE: input_global.css:152-175] */

/* Remove browser's autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px var(--_color-tokens---bg-neutral--white) inset !important;
  box-shadow: 0 0 0px 1000px var(--_color-tokens---bg-neutral--white) inset !important;
  -webkit-text-fill-color: var(--_color-tokens---content-neutral--darkest) !important;
  border: 1.5px solid var(--_color-tokens---border-neutral--dark) !important;
  transition: background-color 5000s ease-in-out 0s !important;
}

/* Firefox autofill */
input:autofill {
  background-color: var(--_color-tokens---bg-neutral--white) !important;
}
```

---

## 10. WEBFLOW DESIGNER MODE SUPPORT

### Designer Mode Detection

Webflow adds `.wf-design-mode` class to body when in Designer:

```css
/* [SOURCE: hover_state_machine.css:17-21] */

.wf-design-mode [data-state~="preview"] {
  --_state---on: 1;
  --_state---off: 0;
}
```

### Preview Pattern Usage

**Development workflow:**

1. Add `preview` to `data-state` attribute:
```html
<div data-state="hover preview">
```

2. See hover animation in Designer without hovering

3. Remove `preview` before publishing:
```html
<div data-state="hover">
```

### Conditional Visibility Classes

Webflow generates `.w-condition-invisible` for conditional visibility:

```css
/* [SOURCE: hover_state_machine.css:52] */

/* Only activate if clickable content is visible (not conditionally hidden) */
[data-state~="hover-if-clickable"]:has(.clickable--w:not(.w-condition-invisible)):hover {
  --_state---on: 1;
}
```

### Webflow Form Classes

```css
/* [SOURCE: input_global.css:8-21] */

/* Support Webflow's form container classes */
.w-form .input,
.w-form .w-input,
.form-block .input,
.form-block .w-input {
  /* Styles here apply to inputs inside Webflow forms */
}
```

---

## 11. COMPONENT STATE PATTERNS

### Open/Closed State (Dropdown)

```css
/* [SOURCE: input_select.css:105-118] */

/* Parent container controls child states */
.input--container.is--open .input[data-select="input"],
[data-select="wrapper"].is--open [data-select="input"] {
  border-color: var(--_color-tokens---input-border--active);
}

/* Chevron rotation when open */
.input--container.is--open [data-hover="input-select"],
[data-select="wrapper"].is--open [data-hover="input-select"] {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
```

### Visibility Toggle (No Display None)

```css
/* [SOURCE: input_select.css:131-151] */

/* Hidden: Use opacity + visibility + pointer-events (NOT display:none) */
.input--dropdown-w,
[data-select="dropdown"] {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transform: translateY(-4px);
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;
}

/* Visible */
.input--container.is--open .input--dropdown-w,
[data-select="wrapper"].is--open [data-select="dropdown"] {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transform: translateY(0);
}
```

**Why not `display: none`:** Cannot transition from `display: none`. Using opacity/visibility enables smooth fade animations.

### Disabled State

```css
/* [SOURCE: input_select.css:188-193] */

.input--container.is--disabled .input[data-select="input"],
[data-select="wrapper"].is--disabled [data-select="input"] {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

### Selected State

```css
/* [SOURCE: input_select.css:172-182] */

/* Option selected state */
.input--option.is--selected,
[data-select="option"].is--selected {
  background-color: var(--_color-tokens---bg-neutral--base);
  font-weight: 500;
}

/* Hover + Selected combined */
.input--option.is--selected:hover,
[data-select="option"].is--selected:hover {
  background-color: var(--_color-tokens---bg-neutral--base);
}
```

---

## 12. PERFORMANCE PATTERNS

### Content Visibility

```css
/* [SOURCE: performance.css:14-30] */

/* Large sections (~720px) */
[data-render-content="large" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 45rem;
}

/* Base sections (~480px) */
[data-render-content="base" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 30rem;
}

/* Small sections (~320px) */
[data-render-content="small" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 20rem;
}
```

**How it works:**
- `content-visibility: auto` - Browser skips rendering off-screen sections
- `contain-intrinsic-size` - Provides placeholder size for scroll calculations

### Overflow-Safe Containment

```css
/* [SOURCE: performance.css:36-39] */

/* For sections with overflow (CTAs, decorative elements) */
[data-render-content="overflow" i] {
  contain: layout style;
  contain-intrinsic-block-size: auto 30rem;
}
```

**Why:** `content-visibility: auto` clips overflow. Using `contain: layout style` gives partial performance benefit while preserving overflow.

### Will-Change Property

```css
/* [SOURCE: link_card.css:58] */

.link--card .link--divider-line {
  will-change: width;
}
```

**Use sparingly:** Only on elements that will actually animate. Overuse hurts performance.

### Transition Best Practices

```css
/* [SOURCE: input_main.css:16-17] */

/* Transition specific properties, not 'all' */
.input {
  transition: border-color 0.2s ease-in-out, outline 0.1s ease-in-out;
}
```

**Why:** `transition: all` is inefficient and can cause unexpected animations.

---

## 13. QUICK REFERENCE

### State Machine Setup

```html
<!-- Container with trigger type -->
<div data-state="hover">
  <!-- Children with animation roles -->
  <img data-hover="image" src="..." />
  <div data-hover="divider"></div>
  <span data-hover="icon">...</span>
</div>
```

### State Variable Usage

```css
/* Width/scale/opacity from 0 to X */
property: calc(0 + (X * clamp(0, var(--_state---on, 0), 1)));

/* Width from Y to Z */
property: calc(Y + ((Z - Y) * clamp(0, var(--_state---on, 0), 1)));

/* Color interpolation */
property: color-mix(in srgb, var(--default), var(--hover) calc(var(--_state---on, 0) * 100%));
```

### State Triggers

| Trigger | Attribute Value                 | Activation       |
| ------- | ------------------------------- | ---------------- |
| Hover   | `data-state="hover"`            | Mouse hover      |
| Focus   | `data-state="focus"`            | Keyboard focus   |
| Mobile  | `data-state="mobile"`           | Touch devices    |
| Preview | `data-state="hover preview"`    | Webflow Designer |
| Group   | `data-state="group"` + children | Sibling effects  |

### Validation Classes

| Class                 | Applied To          | Effect          |
| --------------------- | ------------------- | --------------- |
| `.validation-invalid` | `[data-form-field]` | Error styling   |
| `.validation-valid`   | `[data-form-field]` | Success styling |
| `.is--open`           | Container           | Show dropdown   |
| `.is--disabled`       | Container           | Disable input   |
| `.is--selected`       | Option              | Selected option |

### Focus Handling

```css
/* Mouse focus: hide outline */
.element:focus { outline: none; }

/* Keyboard focus: show outline */
body.using-keyboard .element:focus { outline: 4px solid var(--state--focused); }

/* Fallback */
.element:focus-visible { outline: 4px solid var(--state--focused); }
```

### Accessibility Checklist

```
[ ] All animations have @media (prefers-reduced-motion: reduce) variant
[ ] Focus states use :focus-visible or body.using-keyboard
[ ] Color contrast meets WCAG requirements
[ ] Hidden elements use proper screen reader pattern
[ ] Touch targets are at least 44x44px on mobile
```

---

## 14. RELATED RESOURCES

### Reference Files

- [animation_workflows.md](./animation_workflows.md) - Animation implementation patterns
- [code_quality_standards.md](../standards/code_quality_standards.md) - General coding standards
- [webflow_patterns.md](./webflow_patterns.md) - Webflow platform constraints

### Source Files

- `/src/1_css/animations/hover_state_machine.css` - State machine core
- `/src/1_css/animations/link_card_image.css` - Card image animations
- `/src/1_css/animations/link_card_product.css` - Product card animations
- `/src/1_css/form/form_validation.css` - Validation states
- `/src/1_css/form/input_main.css` - Input base styles + focus
- `/src/1_css/form/input_select.css` - Custom select component
- `/src/1_css/form/input_global.css` - Mobile/browser fixes
- `/src/1_css/global/performance.css` - Performance optimizations
