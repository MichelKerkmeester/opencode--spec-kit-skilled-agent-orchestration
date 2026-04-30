---
title: Focus Management - Accessibility Patterns
description: Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs.
---

# Focus Management - Accessibility Patterns

Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs.

---

## 1. OVERVIEW

### Purpose

Provides systematic patterns for implementing keyboard accessibility in modal dialogs and interactive components, ensuring WCAG 2.1 compliance for focus management.

### When to Use

Apply these patterns when:
- Building modal dialogs or overlays
- Implementing dropdown menus or popovers
- Creating any component that traps user focus
- Handling focus styling for mixed input devices (keyboard, mouse, touch)

### Core Principle

**Focus must be trapped within modals, saved on open, and restored on close.** Users navigating with keyboards must never lose context or get trapped outside visible UI.

### Key Sources

| Source File                           | Lines        | Pattern                         |
| ------------------------------------- | ------------ | ------------------------------- |
| `modal/modal_cookie_consent.js`       | 706-761      | Focus trap + FOCUSABLE_SELECTOR |
| `modal/modal_welcome.js`              | 430-442, 485 | Focus save/restore              |
| `form/form_submission.js`             | 15, 223-268  | Focus trap with cleanup         |
| `contact/input_focus_handler.js`      | 1-79         | Touch/keyboard detection        |
| `video/video_background_hls_hover.js` | 27-42        | Touch device detection          |

---

## 2. FOCUSABLE_SELECTOR CONSTANT

### The Canonical Selector

The `FOCUSABLE_SELECTOR` constant defines all interactive elements that can receive keyboard focus.

**Source:** `src/javascript/modal/modal_cookie_consent.js:707`

```javascript
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
```

### Selector Breakdown

| Selector                                     | Purpose                   | Exclusions                     |
| -------------------------------------------- | ------------------------- | ------------------------------ |
| `a[href]`                                    | Links with destinations   | Anchor-only links without href |
| `button:not([disabled])`                     | Enabled buttons           | Disabled buttons               |
| `input:not([disabled]):not([type="hidden"])` | Visible, enabled inputs   | Hidden inputs, disabled inputs |
| `textarea:not([disabled])`                   | Enabled textareas         | Disabled textareas             |
| `select:not([disabled])`                     | Enabled dropdowns         | Disabled selects               |
| `[tabindex]:not([tabindex="-1"])`            | Custom focusable elements | Programmatically unfocusable   |

### Variant with Modal-Specific Elements

**Source:** `src/javascript/form/form_submission.js:15`

```javascript
const FOCUSABLE_SELECTOR = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-modal-close], .modal--close-button';
```

**Additional elements:**
- `[data-modal-close]` - Close trigger elements
- `.modal--close-button` - Webflow modal close buttons

### Get Focusable Elements Function

**Source:** `src/javascript/modal/modal_cookie_consent.js:709-718`

```javascript
function get_focusable(container) {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  return nodes.filter((el) =>
    el instanceof HTMLElement &&
    el.tabIndex !== -1 &&
    el.getAttribute('aria-hidden') !== 'true' &&
    el.offsetParent !== null
  );
}
```

**Filter criteria:**
1. `el instanceof HTMLElement` - Must be HTML element
2. `el.tabIndex !== -1` - Not programmatically removed from tab order
3. `el.getAttribute('aria-hidden') !== 'true'` - Not hidden from assistive tech
4. `el.offsetParent !== null` - Element is visible (not display:none or hidden ancestor)

---

## 3. FOCUS TRAP IMPLEMENTATION

### Pattern Overview

Focus traps intercept Tab key navigation to keep focus within a container (modal, dialog, dropdown). When reaching the last focusable element, Tab wraps to the first; Shift+Tab from first wraps to last.

### Basic Focus Trap

**Source:** `src/javascript/form/form_submission.js:223-268`

```javascript
function create_focus_trap(container) {
  if (!container) {
    console.warn('create_focus_trap: container is required');
    return () => {};
  }

  const had_tabindex = container.hasAttribute('tabindex');
  if (!had_tabindex) {
    container.setAttribute('tabindex', '-1');
  }

  const get_focusable = () => {
    const nodes = to_array(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.tabIndex === -1) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
      if (node.hasAttribute('disabled')) return false;
      if (node.offsetParent === null) return false;
      return true;
    });
    return nodes.length ? nodes : [container];
  };

  const keydown_handler = (event) => {
    if (event.key !== 'Tab') return;
    const focusable = get_focusable();
    if (!focusable.length) return;

    const active = document.activeElement;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (!container.contains(active) || active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      }
    } else if (!container.contains(active) || active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  document.addEventListener('keydown', keydown_handler, true);

  return () => {
    document.removeEventListener('keydown', keydown_handler, true);
    if (!had_tabindex && container.getAttribute('tabindex') === '-1') {
      container.removeAttribute('tabindex');
    }
  };
}
```

**Key implementation details:**
1. **Container tabindex** - Add `tabindex="-1"` if missing (allows focus() call)
2. **Capture phase** - Use `true` for event capture to intercept before other handlers
3. **preventScroll** - Avoid jarring scroll jumps when focusing
4. **Cleanup function** - Returns function to remove listener and restore tabindex

### Advanced Focus Trap with State Management

**Source:** `src/javascript/modal/modal_cookie_consent.js:720-761`

```javascript
function ensure_focus_trap(group, getContainerFn) {
  function keydown_handler(event) {
    if (event.key !== 'Tab') return;
    const container = typeof getContainerFn === 'function' ? getContainerFn() : null;
    if (!container || !is_visible(container)) return;
    const focusable = get_focusable(container);
    if (!focusable.length) return;

    const active = document.activeElement;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (!container.contains(active) || active === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (!container.contains(active) || active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return {
    attach() {
      if (state.focus_traps[group]) return;
      document.addEventListener('keydown', keydown_handler, true);
      state.focus_traps[group] = { keydown_handler };
      state.cleanups.push(() => {
        try { document.removeEventListener('keydown', keydown_handler, true); } catch (_) {}
      });
    },
    detach() {
      const trap = state.focus_traps[group];
      if (!trap) return;
      try { document.removeEventListener('keydown', trap.keydown_handler, true); } catch (_) {}
      state.focus_traps[group] = null;
    },
  };
}
```

**Advanced features:**
1. **Group-based traps** - Multiple independent focus traps by group name
2. **Dynamic container** - `getContainerFn` allows container to change/animate
3. **Visibility check** - Only trap when container is visible
4. **Attach/detach API** - Explicit control over trap lifecycle
5. **Cleanup registration** - Auto-cleanup on module teardown

### Focus Trap Validation Checklist

```markdown
FOCUS TRAP VALIDATION:
[ ] Tab from last element wraps to first
[ ] Shift+Tab from first element wraps to last
[ ] Tab outside container moves focus inside
[ ] Disabled/hidden elements are skipped
[ ] Focus visible indicator shows on all elements
[ ] Cleanup function removes event listener
[ ] Container receives tabindex="-1" if needed
```

---

## 4. FOCUS RESTORATION

### Save Focus on Modal Open

**Source:** `src/javascript/modal/modal_welcome.js:485`

```javascript
state.last_focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
```

**Pattern:**
1. Save `document.activeElement` before showing modal
2. Type-check ensures it's a focusable HTMLElement
3. Store in state for later restoration

### Restore Focus on Modal Close

**Source:** `src/javascript/modal/modal_welcome.js:430-442`

```javascript
const restore_focus = () => {
  // ACCESSIBILITY: Return focus to pre-open element
  const focus_target = state.last_focus;
  state.last_focus = null;
  if (!focus_target) return;
  try {
    if (document.contains(focus_target)) {
      focus_target.focus({ preventScroll: true });
    }
  } catch {
    /* Element may have been removed */
  }
};
```

**Defensive checks:**
1. **Null check** - Element might not have been captured
2. **DOM containment** - Element may have been removed during modal lifecycle
3. **Try-catch** - Focus can fail on detached or unusual elements
4. **preventScroll** - Avoid layout shift when restoring focus

### Complete Save/Restore Pattern

```javascript
// STATE: Track previous focus
const modal_state = {
  last_focus: null,
  is_open: false
};

function open_modal(container) {
  // 1. Save current focus BEFORE any DOM changes
  modal_state.last_focus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  // 2. Show modal
  container.style.display = 'block';
  container.setAttribute('aria-hidden', 'false');
  modal_state.is_open = true;

  // 3. Move focus to modal (first focusable or container itself)
  const first_focusable = container.querySelector(FOCUSABLE_SELECTOR);
  if (first_focusable) {
    first_focusable.focus({ preventScroll: true });
  } else {
    container.focus({ preventScroll: true });
  }
}

function close_modal(container) {
  if (!modal_state.is_open) return;

  // 1. Hide modal
  container.style.display = 'none';
  container.setAttribute('aria-hidden', 'true');
  modal_state.is_open = false;

  // 2. Restore focus
  const focus_target = modal_state.last_focus;
  modal_state.last_focus = null;

  if (focus_target && document.contains(focus_target)) {
    try {
      focus_target.focus({ preventScroll: true });
    } catch {
      // Element may reject focus
    }
  }
}
```

### Focus Restoration Validation Checklist

```markdown
FOCUS RESTORATION VALIDATION:
[ ] Focus saved before modal opens
[ ] Focus saved only if element is HTMLElement
[ ] Focus restored after modal closes
[ ] DOM containment checked before restore
[ ] Try-catch wraps focus() call
[ ] preventScroll used to avoid layout shift
[ ] Saved reference cleared after restore (prevent memory leak)
```

---

## 5. TOUCH DETECTION

### Purpose

Detect input method (keyboard, mouse, touch) to apply appropriate focus styling. Keyboard users need visible focus indicators; mouse/touch users often find them distracting.

### Keyboard Navigation Detection

**Source:** `src/javascript/contact/input_focus_handler.js:1-79`

```javascript
(() => {
  function initFocusHandler() {
    /* 1. STATE MANAGEMENT */
    let usingKeyboard = false;

    /* 2. KEYBOARD DETECTION */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        usingKeyboard = true;
        document.body.classList.add("using-keyboard");
      }
    });

    /* 3. MOUSE/TOUCH DETECTION */
    document.addEventListener("mousedown", () => {
      usingKeyboard = false;
      document.body.classList.remove("using-keyboard");
    });

    document.addEventListener(
      "touchstart",
      () => {
        usingKeyboard = false;
        document.body.classList.remove("using-keyboard");
      },
      { passive: true }
    );
  }

  /* 4. INITIALIZE */
  const INIT_FLAG = '__focusHandlerCdnInit';

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState !== 'loading') {
      setTimeout(initFocusHandler, 0);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(initFocusHandler, 0),
      { once: true }
    );
  };

  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }
})();
```

**CSS usage:**

```css
/* Hide focus ring for mouse/touch users */
:focus {
  outline: none;
}

/* Show focus ring only for keyboard users */
.using-keyboard :focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Media Query-Based Detection

**Source:** `src/javascript/form/form_submission.js:284-294`

```javascript
function has_fine_pointer() {
  try {
    // Check if primary pointing device is precise (mouse/trackpad)
    // Returns false for touch-only devices
    return window.matchMedia('(pointer: fine)').matches;
  } catch {
    // Fallback: assume fine pointer if detection fails (desktop default)
    return true;
  }
}
```

**Source:** `src/javascript/molecules/link_grid.js:11-14`

```javascript
function isDesktopDevice() {
  // Check if device has precise pointer and hover capability
  return window.matchMedia("(pointer: fine) and (hover: hover)").matches;
}
```

### Comprehensive Touch Detection

**Source:** `src/javascript/video/video_background_hls_hover.js:27-42`

```javascript
let _mobile_detection_cached = false;
let _is_touch_like = false;

function compute_mobile_detection() {
  if (_mobile_detection_cached) return;
  _mobile_detection_cached = true;

  const prefers_coarse_pointer = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
  const prefers_pointer_coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const has_touch_points = typeof navigator !== 'undefined' && Number.isFinite(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0;
  _is_touch_like = prefers_coarse_pointer || prefers_pointer_coarse || has_touch_points;
}
```

**Detection methods combined:**
1. `(hover: none)` - Device cannot hover (touch screens)
2. `(pointer: coarse)` - Imprecise pointing device (finger vs mouse)
3. `navigator.maxTouchPoints > 0` - Device supports touch events

### Touch Detection Decision Tree

```
Detect Input Method
├─ Tab key pressed
│  └─ Add .using-keyboard class
│     └─ Show focus indicators
├─ Mouse/touch event
│  └─ Remove .using-keyboard class
│     └─ Hide focus indicators
└─ Initial device check
   ├─ (pointer: fine) AND (hover: hover)
   │  └─ Desktop with mouse
   ├─ (pointer: coarse) OR (hover: none)
   │  └─ Touch device
   └─ navigator.maxTouchPoints > 0
      └─ Touch-capable device
```

### Touch Detection Patterns Summary

| Method         | Media Query                | Use Case                 |
| -------------- | -------------------------- | ------------------------ |
| Fine pointer   | `(pointer: fine)`          | Mouse/trackpad precision |
| Coarse pointer | `(pointer: coarse)`        | Touch/stylus             |
| Hover capable  | `(hover: hover)`           | Can hover elements       |
| No hover       | `(hover: none)`            | Touch-only               |
| Touch points   | `navigator.maxTouchPoints` | Touch hardware present   |

---

## 6. ANTI-PATTERNS

### Focus Trap Anti-Patterns

**Never:**
- Use `tabindex` on non-interactive elements (creates keyboard traps)
- Forget to remove event listeners (memory leak)
- Skip visibility checks (traps focus in hidden content)
- Use `tabindex > 0` (breaks natural tab order)

```javascript
// BAD: Positive tabindex disrupts natural order
<button tabindex="5">First</button>
<button tabindex="1">Second</button>

// GOOD: Natural order or tabindex="0"
<button>First</button>
<button>Second</button>
```

### Focus Restoration Anti-Patterns

**Never:**
- Forget to check `document.contains()` before focusing
- Store focus reference without instanceof check
- Skip try-catch around focus() calls
- Leave stale focus references (memory leak)

```javascript
// BAD: No defensive checks
function restore_focus() {
  saved_focus.focus();  // Crashes if element removed!
}

// GOOD: Full defensive pattern
function restore_focus() {
  const target = saved_focus;
  saved_focus = null;  // Clear reference
  if (target && document.contains(target)) {
    try {
      target.focus({ preventScroll: true });
    } catch {}
  }
}
```

### Touch Detection Anti-Patterns

**Never:**
- Detect touch once and cache forever (devices can change)
- Remove focus styles entirely (breaks accessibility)
- Use touch detection to disable keyboard navigation
- Assume touch = mobile (desktop touchscreens exist)

```javascript
// BAD: Removes focus styling entirely
:focus { outline: none; }  // WCAG violation!

// GOOD: Hide for mouse, show for keyboard
.using-keyboard :focus { outline: 2px solid blue; }
```

---

## 7. INTEGRATION CHECKLIST

### Before Modal Implementation

```markdown
FOCUS MANAGEMENT CHECKLIST:
[ ] FOCUSABLE_SELECTOR constant defined
[ ] get_focusable() filters hidden/disabled elements
[ ] Focus trap intercepts Tab and Shift+Tab
[ ] Focus saved before modal opens
[ ] Focus moves to first focusable on open
[ ] Focus restored after modal closes
[ ] Cleanup function removes event listeners
[ ] Touch detection initializes on page load
[ ] .using-keyboard class toggles focus styles
```

### WCAG 2.1 Compliance

| Criterion              | Requirement                           | Implementation                          |
| ---------------------- | ------------------------------------- | --------------------------------------- |
| 2.1.1 Keyboard         | All functionality keyboard accessible | Focus trap + tab navigation             |
| 2.1.2 No Keyboard Trap | Users can tab away from any component | Trap only when modal open               |
| 2.4.3 Focus Order      | Logical, meaningful sequence          | Natural DOM order, no positive tabindex |
| 2.4.7 Focus Visible    | Focus indicator visible               | .using-keyboard styles                  |

---

## 8. RELATED RESOURCES

### Reference Files

- [webflow_patterns.md](./webflow_patterns.md) - Modal component patterns
- [animation_workflows.md](./animation_workflows.md) - Focus during transitions
- [security_patterns.md](./security_patterns.md) - Input validation for forms

### Source Files

- `src/javascript/modal/modal_cookie_consent.js` - Complete focus trap implementation
- `src/javascript/modal/modal_welcome.js` - Focus save/restore pattern
- `src/javascript/form/form_submission.js` - Form modal focus management
- `src/javascript/contact/input_focus_handler.js` - Touch/keyboard detection

### External Resources

- [WCAG 2.1 Focus Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) - W3C focus visibility requirements
- [MDN: Using tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) - Tabindex best practices
