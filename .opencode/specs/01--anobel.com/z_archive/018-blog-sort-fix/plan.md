---
title: "Plan: Blog Sort Dropdown Fix [019-blog-sort-fix/plan]"
description: "┌─────────────────────────────────────────────────────────────────────────────┐"
trigger_phrases:
  - "plan"
  - "blog"
  - "sort"
  - "dropdown"
  - "fix"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# Plan: Blog Sort Dropdown Fix

<!-- ANCHOR:architecture-overview -->
## Architecture Overview

### Current Flow (Broken)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CURRENT FLOW                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CustomSelect    ──change──▶  FS Bridge  ──sync──▶  Hidden <select>        │
│  (click option)              (listener)             value = "name-asc"     │
│                                                           │                │
│                                                           ▼                │
│                                               dispatch Event('change')     │
│                                                           │                │
│                                                           ▼                │
│                                               Finsweet IGNORES             │
│                                               (doesn't listen to events)   │
│                                                           │                │
│                                                           ▼                │
│                                               List UNCHANGED ✗             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fixed Flow (Finsweet Reactive API)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FIXED FLOW - Option B (Recommended)                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CustomSelect    ──change──▶  FS Bridge  ──parse──▶  field: "name"         │
│  (click option)              (listener)              direction: "asc"      │
│                                                           │                │
│                                         ┌─────────────────┴─────────────┐  │
│                                         ▼                               ▼  │
│                              Finsweet Reactive API            pushState    │
│                              sorting.value.fieldKey           ?sort=...    │
│                              sorting.value.direction                       │
│                                         │                                  │
│                                         ▼                                  │
│                              List SORTED INSTANTLY ✓                       │
│                              (no page reload)                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
<!-- /ANCHOR:architecture-overview -->

<!-- ANCHOR:implementation-strategy -->
## Implementation Strategy

### Strategy: Tiered Approach

Test simplest solution first, escalate if needed:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: Quick Fix (Option C)                                                │
│ Add 'input' event dispatch alongside 'change'                               │
│ Effort: ~5 min | Risk: May not work                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                           ↓ If fails                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: Reactive API (Option B) ★ RECOMMENDED                               │
│ Use Finsweet's listInstance.sorting.value API                               │
│ Effort: ~30 min | Risk: Low (documented API)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                           ↓ If fails                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: URL Fallback (Option D)                                             │
│ Navigate with window.location.href (full reload)                            │
│ Effort: ~10 min | Risk: None (guaranteed)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
<!-- /ANCHOR:implementation-strategy -->

<!-- ANCHOR:implementation-phases -->
## Implementation Phases

### Phase 0: Quick Fix Test (Option C)

**File:** `src/2_javascript/form/input_select_fs_bridge.js`

Minimal change to test if Finsweet responds to `input` event:

```javascript
// Current (broken):
function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}

// Quick fix attempt:
function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('input', { bubbles: true }));
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

**Test:** If sort works after this change, no further work needed.

---

### Phase 1: Finsweet Instance Capture

**File:** `src/2_javascript/form/input_select_fs_bridge.js`

Add Finsweet instance capture at module level:

```javascript
/* ─────────────────────────────────────────────────────────────
   1.5 FINSWEET INSTANCE CAPTURE
──────────────────────────────────────────────────────────────── */

// Capture Finsweet list instance when it initializes
// This enables programmatic sorting without page reload
function capture_finsweet_instance() {
  window.FinsweetAttributes = window.FinsweetAttributes || [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      // Store first list instance (blog page has one list)
      if (listInstances.length > 0) {
        window._finsweetListInstance = listInstances[0];
        console.log('FinsweetBridge: Captured list instance for programmatic sorting');
      }
    },
  ]);
}
```

**Call this in the `start()` function before bridge initialization.**

---

### Phase 2: Updated sync_to_native()

**File:** `src/2_javascript/form/input_select_fs_bridge.js`

Replace `sync_to_native()` with Reactive API integration:

```javascript
/* ─────────────────────────────────────────────────────────────
   3. SYNC HELPER
──────────────────────────────────────────────────────────────── */

// Sync selection to Finsweet (via Reactive API) or hidden select
function sync_to_native(native_select, value) {
  // Always sync to hidden select for fallback/accessibility
  native_select.value = value;
  native_select.dispatchEvent(new Event('input', { bubbles: true }));
  native_select.dispatchEvent(new Event('change', { bubbles: true }));

  // Only proceed with Finsweet API if this is a sort trigger
  if (!native_select.hasAttribute(FS_ATTR)) return;
  if (!value) return;

  // Parse value: "name-asc" → field: "name", direction: "asc"
  // Use lastIndexOf to handle hyphenated field names like "publication-date-asc"
  const lastHyphen = value.lastIndexOf('-');
  if (lastHyphen === -1) return;

  const field = value.substring(0, lastHyphen);
  const direction = value.substring(lastHyphen + 1);

  // Validate direction
  if (direction !== 'asc' && direction !== 'desc') return;

  // Use Finsweet Reactive API if available (no page reload)
  if (window._finsweetListInstance?.sorting?.value) {
    try {
      window._finsweetListInstance.sorting.value.fieldKey = field;
      window._finsweetListInstance.sorting.value.direction = direction;

      // Update URL for bookmarking/sharing (no reload)
      update_url_param(value);

      console.log(`FinsweetBridge: Sorted by ${field} (${direction})`);
      return; // Success - exit early
    } catch (err) {
      console.warn('FinsweetBridge: Reactive API failed, falling back to URL', err);
    }
  }

  // Fallback: URL navigation (causes page reload)
  fallback_url_navigation(value);
}

// Update URL without page reload
function update_url_param(value) {
  const url = new URL(window.location);
  url.searchParams.set('sort', value);
  history.pushState({ sort: value }, '', url);
}

// Fallback for when Reactive API unavailable
function fallback_url_navigation(value) {
  const url = new URL(window.location);
  url.searchParams.set('sort', value);
  window.location.href = url.toString();
}
```

---

### Phase 3: Updated Initialization

**File:** `src/2_javascript/form/input_select_fs_bridge.js`

Update `start()` function:

```javascript
// Initialize after CustomSelect is ready
const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // Capture Finsweet instance first (for Reactive API)
  capture_finsweet_instance();

  // Delay to ensure CustomSelect has initialized first
  setTimeout(init_finsweet_bridge, 100);
};
```

---
<!-- /ANCHOR:implementation-phases -->

<!-- ANCHOR:data-flow-fixed -->
## Data Flow (Fixed)

```
1. User clicks "Naam" option in CustomSelect
   │
   ▼
2. CustomSelect.select_option() called
   │
   ├── Updates input.value = "Naam"
   ├── Sets input.dataset.value = "name-asc"
   └── Dispatches 'change' event on input
   │
   ▼
3. Bridge change listener fires
   │
   ├── Gets value: "name-asc"
   └── Calls sync_to_native(hiddenSelect, "name-asc")
   │
   ▼
4. sync_to_native() executes
   │
   ├── Syncs to hidden select (fallback)
   ├── Parses: field="name", direction="asc"
   │
   ├── IF Finsweet Reactive API available:
   │   ├── Sets listInstance.sorting.value.fieldKey = "name"
   │   ├── Sets listInstance.sorting.value.direction = "asc"
   │   ├── Updates URL: history.pushState(?sort=name-asc)
   │   └── List re-sorts INSTANTLY ✓
   │
   └── ELSE (fallback):
       └── window.location.href = "?sort=name-asc" (page reload)
   │
   ▼
5. List displayed in sorted order ✓
```

---
<!-- /ANCHOR:data-flow-fixed -->

<!-- ANCHOR:initialization-timeline -->
## Initialization Timeline

```
Time 0ms: DOMContentLoaded
    │
    ▼
T+0ms: CustomSelect start() → schedules init at T+50ms
T+0ms: FS Bridge start() → captures Finsweet, schedules init at T+100ms
    │
    ▼
T+50ms: CustomSelect instances created
    │
    ▼
T+100ms: FS Bridge creates hidden selects, attaches listeners
    │
    ▼
T+???ms: window.load event fires
    │
    ▼
T+load: Finsweet script injected dynamically
    │
    ▼
T+load+network: Finsweet initializes
    │
    ├── Scans for fs-list-element attributes
    ├── Sees hidden <select> with sort-trigger
    ├── Adds is-list-active class
    └── Calls registered callbacks → window._finsweetListInstance set
```

**Key Point:** Finsweet instance is available AFTER `window.load` + network latency. Bridge sync calls that happen before this will use the fallback (URL navigation).

---
<!-- /ANCHOR:initialization-timeline -->

<!-- ANCHOR:edge-cases -->
## Edge Cases

### 1. Empty Selection (Placeholder)

```javascript
if (!value) return; // Guard at start of sync_to_native()
```

### 2. Same Selection (No-op)

```javascript
// Could add optimization:
const currentSort = new URL(window.location).searchParams.get('sort');
if (value === currentSort) return;
```

### 3. Finsweet Not Yet Initialized

```javascript
// Fallback to URL navigation if Reactive API unavailable
if (!window._finsweetListInstance?.sorting?.value) {
  fallback_url_navigation(value);
}
```

### 4. Hyphenated Field Names

```javascript
// Use lastIndexOf instead of split('-')
const lastHyphen = value.lastIndexOf('-');
const field = value.substring(0, lastHyphen);     // "publication-date"
const direction = value.substring(lastHyphen + 1); // "asc"
```

### 5. Form Selects (Non-Sort)

```javascript
// Guard: only process sort triggers
if (!native_select.hasAttribute(FS_ATTR)) return;
```

---
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:testing-checklist -->
## Testing Checklist

See `checklist.md` for full QA validation.

**Quick Verification:**
1. Open browser DevTools console
2. Navigate to `/nl/blog`
3. Verify console shows: `FinsweetBridge: Captured list instance`
4. Click sort option
5. Verify: List re-sorts instantly, URL updates, no page reload

---
<!-- /ANCHOR:testing-checklist -->

<!-- ANCHOR:rollback-plan -->
## Rollback Plan

If issues arise:

1. **Quick revert:** Restore previous CDN version of `input_select_fs_bridge.js`
2. **Update HTML:** Change version number in `blog.html` back to `1.0.0`
3. **Clear cache:** Purge R2 CDN cache if needed
4. **Verify:** Test that original (broken) behavior is restored

**Previous working version:** `v1.0.0` (without sort functionality, but stable)

---
<!-- /ANCHOR:rollback-plan -->

<!-- ANCHOR:future-improvements -->
## Future Improvements

After successful implementation:

1. **Descending sort options:** Add `name-desc`, `date-desc`, `category-desc` to Webflow
2. **Default sort from URL:** On page load, sync CustomSelect UI to match URL param
3. **Sort indicator:** Add visual indicator showing current sort direction
4. **Multiple lists:** Support multiple Finsweet list instances on same page
<!-- /ANCHOR:future-improvements -->
