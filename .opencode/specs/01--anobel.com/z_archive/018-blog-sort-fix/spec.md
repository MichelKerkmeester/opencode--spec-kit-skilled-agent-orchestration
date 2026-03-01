---
title: "Spec: Blog Sort Dropdown Fix [019-blog-sort-fix/spec]"
description: "Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting. Currently, selecting a sort option updates the hidden select value but does not trigger list re-sor..."
trigger_phrases:
  - "spec"
  - "blog"
  - "sort"
  - "dropdown"
  - "fix"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# Spec: Blog Sort Dropdown Fix

<!-- ANCHOR:overview -->
## Overview

Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting. Currently, selecting a sort option updates the hidden select value but does not trigger list re-sorting.

**Related Spec:** `012-form-input-components` (Custom Select + FS Bridge implementation)

**Level:** 3 (requires decision-record.md)

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem-statement -->
## Problem Statement

The blog page (`/nl/blog`) has a sort dropdown built with:
1. **CustomSelect** (`input_select.js`) - Custom dropdown UI
2. **FS Bridge** (`input_select_fs_bridge.js`) - Bridges CustomSelect to Finsweet

### Current Behavior (Broken)
1. User selects sort option (e.g., "Naam")
2. CustomSelect dispatches `change` event
3. Bridge syncs value to hidden `<select>` element
4. **List does NOT re-sort**

### Expected Behavior
1. User selects sort option
2. List re-sorts **instantly** (no page reload)
3. URL updates to reflect sort state (for bookmarking/sharing)

---
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:root-cause-analysis -->
## Root Cause Analysis

### Primary Finding

**Finsweet fs-list uses URL parameters for initial sort state, but exposes a Reactive API for programmatic sorting without page reload.**

### Deep Dive Evidence (2026-01-18)

| Investigation | Finding |
|---------------|---------|
| Live page scan | Option values confirmed: `date-asc`, `name-asc`, `category-asc` |
| Finsweet API research | Reactive API exists: `listInstance.sorting.value.fieldKey` |
| Bridge timing analysis | No race condition - hidden select created 400ms+ before Finsweet |
| Event dispatch test | Bridge dispatches only `change` event; may need `input` event too |
| URL format verification | Format is `?sort={value}` not `?sort_{field}={direction}` |

### Why Current Bridge Fails

1. **Event Type Mismatch**: Bridge dispatches only `change` event, Finsweet may require `input` event
2. **No Reactive API Usage**: Bridge doesn't use Finsweet's programmatic sorting API
3. **Value Sync Only**: Setting hidden select value doesn't trigger Finsweet's internal sort

### Verified Sort Field Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Search input | `fs-list-field` | `date, name, category` |
| CMS item category | `fs-list-field` | `category` |
| CMS item title | `fs-list-field` | `name` |
| CMS item date | `fs-list-field` | `date` (with `fs-list-type="date"`) |

### Verified Sort Option Values

| Option Label | `data-value` |
|--------------|--------------|
| Publicatie datum | `date-asc` |
| Naam | `name-asc` |
| Categorie | `category-asc` |

---
<!-- /ANCHOR:root-cause-analysis -->

<!-- ANCHOR:requirements -->
## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Selecting sort option re-sorts the list | P0 |
| FR-2 | Sorting happens instantly (no page reload) | P0 |
| FR-3 | URL reflects current sort state | P1 |
| FR-4 | Sort persists on page reload | P1 |
| FR-5 | Default sort works when no URL param | P1 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | No full page reload (use Finsweet Reactive API) | P0 |
| NFR-2 | Maintain backward compatibility with existing pages | P0 |
| NFR-3 | Works with existing CustomSelect component | P0 |
| NFR-4 | Form selects unaffected (no URL navigation) | P0 |

---
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- Modify `input_select_fs_bridge.js` to use Finsweet Reactive API
- Add Finsweet instance capture on initialization
- Update URL with `pushState` (no reload)
- Test on blog page (`/nl/blog`)
- Update CDN with new version

### Out of Scope
- Changes to CustomSelect core (`input_select.js`)
- Changes to Finsweet configuration in Webflow
- Other pages using CustomSelect (contact forms, etc.)

---
<!-- /ANCHOR:scope -->

<!-- ANCHOR:solution-options -->
## Solution Options

### Option A: URL Navigation (DEPRECATED)
~~Update URL and trigger navigation when sort changes.~~

**Status:** Superseded by Option B after deep dive discovered Reactive API.

**Cons:** Full page reload, poor UX

---

### Option B: Finsweet Reactive API (RECOMMENDED)
Use Finsweet's reactive property system for instant sorting.

```javascript
// Capture Finsweet instance on init
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'list',
  (listInstances) => {
    const [listInstance] = listInstances;
    window._finsweetListInstance = listInstance;
  },
]);

// In sync_to_native():
function sync_to_native(native_select, value) {
  if (!native_select.hasAttribute(FS_ATTR)) return;
  if (!value) return;

  const lastHyphen = value.lastIndexOf('-');
  if (lastHyphen === -1) return;

  const field = value.substring(0, lastHyphen);
  const direction = value.substring(lastHyphen + 1);

  // Use Finsweet Reactive API - NO PAGE RELOAD
  if (window._finsweetListInstance) {
    window._finsweetListInstance.sorting.value.fieldKey = field;
    window._finsweetListInstance.sorting.value.direction = direction;

    // Update URL for bookmarking (no reload)
    const url = new URL(window.location);
    url.searchParams.set('sort', value);
    history.pushState({}, '', url);
  }
}
```

**Pros:** Instant sorting, excellent UX, URL updated for bookmarking
**Cons:** Requires Finsweet instance capture, slightly more complex

---

### Option C: Event Dispatch Fix (QUICK FIX - Test First)
Add `input` event dispatch alongside `change` event.

```javascript
function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('input', { bubbles: true }));
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

**Pros:** Minimal code change, quick to test
**Cons:** May not work if Finsweet doesn't listen to either event

---

### Option D: URL Navigation Fallback
If Options B and C fail, fall back to URL navigation with page reload.

```javascript
function sync_to_native(native_select, value) {
  // ... parse value ...
  const url = new URL(window.location);
  url.searchParams.set('sort', value);
  window.location.href = url.toString();
}
```

**Pros:** Guaranteed to work
**Cons:** Full page reload

---
<!-- /ANCHOR:solution-options -->

<!-- ANCHOR:recommended-approach -->
## Recommended Approach

1. **First:** Test Option C (event dispatch fix) - minimal change
2. **If fails:** Implement Option B (Finsweet Reactive API)
3. **Fallback:** Option D (URL navigation) if all else fails

See `decision-record.md` for full rationale.

---
<!-- /ANCHOR:recommended-approach -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. User selects "Naam" → List sorted alphabetically by name **instantly**
2. User selects "Categorie" → List sorted alphabetically by category **instantly**
3. User selects "Publicatie datum" → List sorted by date **instantly**
4. **No page reload** during sort
5. URL updates to reflect sort selection
6. Refreshing page maintains sort order
7. No console errors
8. Works on desktop and mobile
9. Contact form selects unaffected

---
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## Dependencies

- `src/2_javascript/form/input_select_fs_bridge.js` (file to modify)
- Finsweet Attributes v2 (fs-list module)
- Blog page with `fs-list-field` attributes on items
- `window.FinsweetAttributes` API

---
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:estimated-effort -->
## Estimated Effort

- **LOC:** ~80-120 (bridge modification + Finsweet capture)
- **Level:** 3 (requires decision-record due to API discovery)
- **Complexity:** Medium (API integration)

---
<!-- /ANCHOR:estimated-effort -->

<!-- ANCHOR:files-to-modify -->
## Files to Modify

| File | Change |
|------|--------|
| `src/2_javascript/form/input_select_fs_bridge.js` | Add Finsweet Reactive API integration |
| `src/2_javascript/z_minified/form/input_select_fs_bridge.js` | Re-minify |
| `src/0_html/blog.html` | Update CDN version number |

---
<!-- /ANCHOR:files-to-modify -->

<!-- ANCHOR:references -->
## References

- Finsweet Attributes API: https://finsweet.com/attributes/attributes-api
- List Sort Documentation: https://finsweet.com/attributes/list-sort
- Deep Dive Research: See `research.md`
- Decision Rationale: See `decision-record.md`
<!-- /ANCHOR:references -->
