# Custom Select Implementation Analysis

> **Generated**: 2026-01-24
> **Source Files Analyzed**:
> - `/src/2_javascript/form/input_select.js` (500 lines)
> - `/src/2_javascript/form/input_select_fs_bridge.js` (212 lines)
> - `/src/1_css/form/input_select.css` (210 lines)

---

## 1. Complete Attribute Inventory

### 1.1 Data Attributes (data-*)

| Attribute | Element | Purpose | Required | Set By |
|-----------|---------|---------|----------|--------|
| `data-select="wrapper"` | Container div | Identifies custom select root | **REQUIRED** | HTML |
| `data-select="trigger"` | Clickable area | Toggle dropdown on click | **REQUIRED** | HTML |
| `data-select="input"` | Input element | Displays selected value | **REQUIRED** | HTML |
| `data-select="dropdown"` | Dropdown container | Contains options list | **REQUIRED** | HTML |
| `data-select="option"` | Each option | Selectable option item | **REQUIRED** | HTML |
| `data-value` | Option elements | Actual form value (vs display text) | Optional | HTML |
| `data-placeholder` | Input element | Custom placeholder text | Optional | HTML |
| `data-validate-on-submit-only` | Input element | Skip blur validation | Auto-set | JS (line 131) |
| `data-select-initialized` | Wrapper | Prevents double init | Auto-set | JS (line 465) |
| `data-select="hidden"` | Hidden native select | CSS hiding (form submission) | Auto-set | CSS |

#### Finsweet Bridge Additional Attributes

| Attribute | Element | Purpose | Required |
|-----------|---------|---------|----------|
| `fs-list-element="sort-trigger"` | Wrapper | Identifies as Finsweet sort control | Conditional |

### 1.2 ARIA Attributes (aria-*)

| Attribute | Element | Value | Purpose | Set By |
|-----------|---------|-------|---------|--------|
| `role="combobox"` | Trigger | Static | Identifies as combobox control | JS (line 148) |
| `role="listbox"` | Dropdown | Static | Identifies as listbox | JS (line 159) |
| `role="option"` | Each option | Static | Identifies as option | JS (line 166) |
| `aria-haspopup` | Trigger | `"listbox"` | Indicates popup type | JS (line 151) |
| `aria-expanded` | Trigger | `"true"/"false"` | Dropdown state | JS (lines 154, 345, 358) |
| `aria-controls` | Trigger | `{instance_id}-listbox` | Links to dropdown | JS (line 144) |
| `aria-selected` | Options | `"true"/"false"` | Selection state | JS (lines 168, 394, 397, 449) |
| `aria-activedescendant` | Trigger | Option ID | Currently focused option | JS (lines 359, 374) |

### 1.3 CSS Classes Manipulated

| Class | Element | When Applied | Purpose |
|-------|---------|--------------|---------|
| `is--open` | Wrapper | Dropdown open | Toggle visibility, chevron rotation |
| `is--selected` | Option | When selected | Visual selection indicator |
| `is--has-value` | Input | After selection | Indicates value present |
| `is--disabled` | Wrapper | Disabled state | Disable interactions (CSS only) |
| `hovered` | Input | Mouse hover | Placeholder color change |
| `fs-sort-select--hidden` | Native select | Always (FS Bridge) | Visually hide native select |

### 1.4 Standard HTML Attributes

| Attribute | Element | Value | Purpose | Set By |
|-----------|---------|-------|---------|--------|
| `readonly` | Input | Empty | Prevent typing | JS (line 126) |
| `autocomplete` | Input | `"off"` | Disable autocomplete | JS (line 127) |
| `placeholder` | Input | Text | Fallback placeholder | JS (line 134) |
| `id` | Dropdown | `{instance_id}-listbox` | ARIA reference target | JS (line 141) |
| `id` | Options | `{instance_id}-option-{n}` | ARIA reference target | JS (line 164) |
| `tabindex` | Options | Implied | For focus management | Implicit |

---

## 2. DOM Queries (querySelector Patterns)

### 2.1 Initialization Queries

```javascript
// Main wrapper discovery (line 460)
document.querySelectorAll('[data-select="wrapper"]')

// Child element discovery within container (lines 72-75)
container.querySelector('[data-select="trigger"]')
container.querySelector('[data-select="input"]')
container.querySelector('[data-select="dropdown"]')
container.querySelectorAll('[data-select="option"]')

// Form discovery for reset handler (line 225)
container.closest('form')
```

### 2.2 Event Delegation Queries

```javascript
// Option click/keydown delegation (lines 198, 213)
e.target.closest('[data-select="option"]')
```

### 2.3 Finsweet Bridge Queries

```javascript
// Sort trigger discovery (lines 163-165)
document.querySelectorAll('[data-select="wrapper"][fs-list-element="sort-trigger"]')
```

---

## 3. Expected DOM Structure

### 3.1 Structure Diagram

```
[data-select="wrapper"]                    <!-- Container (REQUIRED) -->
├── [data-select="trigger"]                <!-- Clickable trigger (REQUIRED) -->
│   ├── [data-select="input"]              <!-- Display input (REQUIRED) -->
│   │       placeholder="..."              <!-- (Optional) placeholder text -->
│   │       data-placeholder="..."         <!-- (Optional) advanced placeholder -->
│   └── [data-hover="input-select"]        <!-- (Optional) chevron icon -->
│
└── [data-select="dropdown"]               <!-- Options container (REQUIRED) -->
    ├── [data-select="option"]             <!-- Option item (REQUIRED, 1+) -->
    │       data-value="actual-value"      <!-- (Optional) form value -->
    │       tabindex="0"                   <!-- (Recommended) for a11y -->
    ├── [data-select="option"]
    │       data-value="..."
    └── ...more options
```

### 3.2 Finsweet Sort Integration Structure

```
[data-select="wrapper"]
    fs-list-element="sort-trigger"         <!-- Triggers FS Bridge -->
├── [data-select="trigger"]
│   └── [data-select="input"]
├── [data-select="dropdown"]
│   └── [data-select="option"]
│           data-value="field-asc"         <!-- Format: {field}-{asc|desc} -->
│
└── <select>                               <!-- AUTO-GENERATED by FS Bridge -->
        fs-list-element="sort-trigger"
        class="fs-sort-select--hidden"
```

### 3.3 Minimal Valid Example

```html
<div data-select="wrapper">
  <div data-select="trigger">
    <input data-select="input" type="text" placeholder="Select...">
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="opt1" tabindex="0">Option 1</div>
    <div data-select="option" data-value="opt2" tabindex="0">Option 2</div>
  </div>
</div>
```

---

## 4. Required vs Optional Attributes

### 4.1 REQUIRED (Script will fail/warn without these)

| Attribute | Element | Validation | Consequence if Missing |
|-----------|---------|------------|------------------------|
| `data-select="wrapper"` | Container | Initialization query | Component not initialized |
| `data-select="trigger"` | Trigger | Line 90 check | Warning logged, init aborted |
| `data-select="input"` | Input | Line 90 check | Warning logged, init aborted |
| `data-select="dropdown"` | Dropdown | Line 90 check | Warning logged, init aborted |
| `data-select="option"` | Options | Line 75 | Empty array, dropdown won't open |

### 4.2 OPTIONAL (Component works without, but behavior differs)

| Attribute | Element | Default Behavior |
|-----------|---------|------------------|
| `data-value` | Options | Uses `textContent` as value |
| `data-placeholder` | Input | Uses `placeholder` attr or "Selecteer..." |
| `placeholder` | Input | Defaults to "Selecteer..." |
| `tabindex` | Options | Focus management still works |
| `fs-list-element` | Wrapper | No Finsweet integration |

### 4.3 AUTO-SET (Script adds these automatically)

| Attribute | Element | When Set |
|-----------|---------|----------|
| `readonly` | Input | On init |
| `autocomplete="off"` | Input | On init |
| `data-validate-on-submit-only` | Input | On init |
| `data-select-initialized` | Wrapper | On init |
| `role="combobox"` | Trigger | On init (if missing) |
| `role="listbox"` | Dropdown | On init (if missing) |
| `role="option"` | Options | On init (if missing) |
| `aria-haspopup="listbox"` | Trigger | On init (if missing) |
| `aria-expanded` | Trigger | On init and toggle |
| `aria-controls` | Trigger | On init |
| `aria-selected` | Options | On init and selection |
| `aria-activedescendant` | Trigger | On focus change |
| `id` | Dropdown, Options | On init (unique per instance) |
| `data-value` | Input | On selection |

---

## 5. Error Handling Assessment

### 5.1 Missing Element Handling

**Location**: Lines 89-98

```javascript
if (!this.trigger || !this.input || !this.dropdown) {
  console.warn('CustomSelect: Missing required elements', {
    container,
    trigger: !!this.trigger,
    input: !!this.input,
    dropdown: !!this.dropdown,
  });
  return;  // Aborts initialization, does NOT throw
}
```

**Assessment**:
- Graceful degradation (no crash)
- Console warning with diagnostic info
- Component simply not initialized
- **Gap**: No visual indicator for developers

### 5.2 Empty Options Handling

**Location**: Lines 340-341

```javascript
open() {
  if (this.options.length === 0) return;  // Silent early return
  ...
}
```

**Assessment**:
- Prevents opening empty dropdown
- **Gap**: No warning logged

### 5.3 Double Initialization Prevention

**Location**: Lines 463-465

```javascript
if (container.dataset.selectInitialized) return;
container.dataset.selectInitialized = 'true';
```

**Assessment**: Robust, uses data attribute flag

### 5.4 Missing Finsweet Instance Handling

**Location**: Lines 170-174

```javascript
const instance = container._customSelect;
if (!instance) {
  console.warn('FinsweetBridge: CustomSelect instance not found', container);
  return;
}
```

**Assessment**: Graceful with warning

### 5.5 Error Handling Summary

| Scenario | Handling | Severity |
|----------|----------|----------|
| Missing trigger/input/dropdown | Warning + abort | Good |
| Empty options array | Silent skip | Acceptable |
| Double initialization | Silently skipped | Good |
| Missing CustomSelect for FS Bridge | Warning + skip | Good |
| Missing Finsweet Reactive API | Fallback to URL | Good |
| Invalid sort value format | Early return | Acceptable |

---

## 6. Finsweet Migration Status

### 6.1 Current Finsweet References

| Reference | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `fs-list-element` | FS Bridge (line 16) | Sort trigger identification | **ACTIVE** |
| `fs-list-element="sort-trigger"` | FS Bridge (line 17) | Value constant | **ACTIVE** |
| `window.FinsweetAttributes` | FS Bridge (line 28) | API callback registration | **ACTIVE** |
| `window._finsweetListInstance` | FS Bridge (line 34) | Captured instance reference | **ACTIVE** |
| `.sorting.value` | FS Bridge (line 137) | Reactive API access | **ACTIVE** |

### 6.2 Migration Assessment

| Component | Finsweet Dependency | Migration Path |
|-----------|---------------------|----------------|
| `input_select.js` | **NONE** | Fully independent |
| `input_select_fs_bridge.js` | **HEAVY** | Bridge-only, isolated |
| `input_select.css` | **NONE** | Fully independent |

### 6.3 Finsweet Dependency Architecture

```
input_select.js          ← Core implementation (NO Finsweet)
       ↓
input_select_fs_bridge.js ← Optional plugin (REQUIRES Finsweet)
       ↓
Finsweet List-Sort        ← External dependency
```

**Key Finding**: The architecture correctly isolates Finsweet dependencies in the bridge file. The core `input_select.js` is completely Finsweet-agnostic.

### 6.4 Deprecated Finsweet References

**NONE FOUND** in core files.

The FS Bridge uses current Finsweet patterns:
- `FinsweetAttributes.push()` - Current callback API
- `listInstances[n].sorting.value` - Current Reactive API

---

## 7. Event Listener Targets Summary

### 7.1 DOM Event Listeners

| Target | Event | Handler | Purpose |
|--------|-------|---------|---------|
| `trigger` | `click` | Toggle dropdown | Primary interaction |
| `input` | `click` | Toggle dropdown | Input-specific |
| `trigger` | `keydown` | Keyboard nav | Accessibility |
| `input` | `keydown` | Keyboard nav | Input-specific |
| `dropdown` | `click` | Option selection | Event delegation |
| `dropdown` | `keydown` | Option keyboard | Event delegation |
| `document` | `click` | Close on outside | Shared (1 listener) |
| `form` | `reset` | Reset select | Form integration |
| `input` | `change` | FS sync (Bridge) | Finsweet sync |

### 7.2 Dispatched Events

| Event | Target | When | Purpose |
|-------|--------|------|---------|
| `change` | Input | On selection | Form validation |
| `input` | Input | On selection | Live validation |
| `input` | Native select (FS) | On sync | Finsweet trigger |
| `change` | Native select (FS) | On sync | Finsweet trigger |

---

## 8. CSS Token Dependencies

### 8.1 Color Tokens Used

| Token | Usage |
|-------|-------|
| `--_color-tokens---input-bg--enabled` | Background color |
| `--_color-tokens---input-border--enabled` | Default border |
| `--_color-tokens---input-border--hover` | Hover border |
| `--_color-tokens---input-border--active` | Active/open border |
| `--_color-tokens---input-content--placeholder` | Placeholder text |
| `--_color-tokens---input-content--placeholder_hover` | Placeholder hover |
| `--_color-tokens---state--focused` | Focus ring |
| `--_color-tokens---bg-neutral--light` | Option focus bg |
| `--_color-tokens---bg-neutral--base` | Option selected bg |

---

## 9. Recommendations

### 9.1 Documentation Gaps

1. **Missing**: No JSDoc comments on public API methods
2. **Missing**: No inline documentation of expected DOM structure
3. **Missing**: No validation of `data-value` format for Finsweet integration

### 9.2 Potential Improvements

1. **Add empty options warning**: Log when dropdown has no options
2. **Validate sort value format**: Check `field-direction` pattern in FS Bridge
3. **Add TypeScript types**: For better IDE support

### 9.3 Attribute Audit Checklist

For form audit, verify each custom select has:

- [ ] `data-select="wrapper"` on container
- [ ] `data-select="trigger"` on clickable area
- [ ] `data-select="input"` on input element
- [ ] `data-select="dropdown"` on options container
- [ ] `data-select="option"` on each option
- [ ] `data-value` on options (if different from display text)
- [ ] `tabindex="0"` on options (for accessibility)
- [ ] `placeholder` or `data-placeholder` on input (optional)
