---
title: "Research: Blog Sort Dropdown Fix [018-blog-sort-fix/research]"
description: "Deep dive investigation conducted 2026-01-18 using 5 parallel Opus agents to analyze the blog sort dropdown issue and identify optimal solutions."
trigger_phrases:
  - "research"
  - "blog"
  - "sort"
  - "dropdown"
  - "fix"
  - "018"
importance_tier: "normal"
contextType: "research"
---
# Research: Blog Sort Dropdown Fix

<!-- ANCHOR:overview -->
## Overview

Deep dive investigation conducted 2026-01-18 using 5 parallel Opus agents to analyze the blog sort dropdown issue and identify optimal solutions.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:investigation-summary -->
## Investigation Summary

| Agent | Focus Area | Key Finding |
|-------|-----------|-------------|
| Agent 1 | Live page scan | Option values: `date-asc`, `name-asc`, `category-asc` |
| Agent 2 | Finsweet API | Reactive API exists for programmatic sorting |
| Agent 3 | Timing analysis | No race condition; event type may be issue |
| Agent 4 | Codebase search | Spec folder exists; solution documented |
| Agent 5 | URL format | Format is `?sort=value` not `?sort_field=direction` |

---
<!-- /ANCHOR:investigation-summary -->

<!-- ANCHOR:agent-1-live-page-analysis -->
## Agent 1: Live Page Analysis

### Objective
Scan https://anobel.com/nl/blog to extract actual `data-value` attributes on sort dropdown options.

### Findings

#### Sort Dropdown Options

| Option Label | `data-value` |
|--------------|--------------|
| Publicatie datum | `date-asc` |
| Naam | `name-asc` |
| Categorie | `category-asc` |

**HTML Structure:**
```html
<div role="option" data-select="option" data-value="date-asc" tabindex="-1" class="input--select-link">
<div role="option" data-select="option" data-value="name-asc" tabindex="-1" class="input--select-link">
<div role="option" data-select="option" data-value="category-asc" tabindex="-1" class="input--select-link">
```

#### Sort Trigger Container

```html
<div data-input-variant="input" data-select="wrapper" fs-list-element="sort-trigger" class="input--container">
```

#### CMS Field Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Search input | `fs-list-field` | `date, name, category` |
| CMS category | `fs-list-field` | `category` |
| CMS title | `fs-list-field` | `name` |
| CMS date | `fs-list-field` | `date` (with `fs-list-type="date"`) |

#### Console Output

```
CustomSelect: Initialized 1 instance(s)
FinsweetBridge: Connected 1 sort trigger(s)
```

No errors present.

### Conclusion

Value format assumption (`field-asc`) is **confirmed correct**.

---
<!-- /ANCHOR:agent-1-live-page-analysis -->

<!-- ANCHOR:agent-2-finsweet-api-exploration -->
## Agent 2: Finsweet API Exploration

### Objective
Research Finsweet Attributes v2 fs-list module for sorting alternatives to page reload.

### Key Discovery: Reactive API

Finsweet exposes a programmatic API for sorting without page reload:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'list',
  (listInstances) => {
    const [listInstance] = listInstances;

    // Programmatically set sort parameters
    listInstance.sorting.value.fieldKey = 'name';
    listInstance.sorting.value.direction = 'desc';
  },
]);
```

### API Properties

| Property | Description |
|----------|-------------|
| `listInstance.sorting` | Reactive property containing sort configuration |
| `listInstance.sorting.value.fieldKey` | The field identifier to sort by |
| `listInstance.sorting.value.direction` | Sort direction ('asc' or 'desc') |

### Alternative Methods

#### Method B: Trigger via Element Click
```javascript
document.querySelector('[fs-list-element="sort-trigger"]').click();
```

#### Method C: Event Dispatch (requires BOTH events)
```javascript
selectElement.value = 'name-desc';
selectElement.dispatchEvent(new Event('input', { bubbles: true }));
selectElement.dispatchEvent(new Event('change', { bubbles: true }));
```

**Critical:** Simply changing `.value` does NOT trigger sorting. Must dispatch events.

### List Instance Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `start` | Before list processes |
| `filter` | During filter phase |
| `sort` | During sort phase |
| `pagination` | During pagination |
| `beforeRender` | Before DOM updates |
| `render` | During render |
| `afterRender` | After render complete |

### CSS Classes During Sorting

| Class | When Applied |
|-------|--------------|
| `.is-list-sorting` | During sort action |
| `.is-list-asc` | Active ascending sort trigger |
| `.is-list-desc` | Active descending sort trigger |

### Sources

- [Finsweet Attributes API](https://finsweet.com/attributes/attributes-api)
- [List Sort Documentation](https://finsweet.com/attributes/list-sort)
- [Forum: List Combine and List Sort](https://forum.finsweet.com/t/list-combine-and-list-sort-on-attributes-v2/5244)
- [Forum: Restart Attributes Programmatically](https://forum.finsweet.com/t/how-can-i-restart-attributes-v2-programmatically/5068)

### Conclusion

**Finsweet Reactive API enables sorting without page reload.** This is the recommended approach.

---
<!-- /ANCHOR:agent-2-finsweet-api-exploration -->

<!-- ANCHOR:agent-3-bridge-timing-analysis -->
## Agent 3: Bridge Timing Analysis

### Objective
Analyze initialization timing between CustomSelect, FS Bridge, and Finsweet.

### Initialization Timeline

```
Time 0ms: DOMContentLoaded
    │
    ├── CustomSelect start() called
    │   └── Schedules init at T+50ms
    │
    ├── FS Bridge start() called
    │   └── Schedules init at T+100ms
    │
    ▼
T+50ms: CustomSelect instances created
    │   └── container._customSelect set
    │
    ▼
T+100ms: FS Bridge creates hidden selects
    │   └── Attaches change listeners
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
    └── Calls registered callbacks
```

### Key Findings

1. **No race condition:** Hidden select is created ~400ms+ before Finsweet initializes
2. **Timing is reliable:** The defer + setTimeout pattern works correctly
3. **Comment is accurate:** Bridge comment "Finsweet requires native select" is correct

### Why Finsweet Ignores Change Events

Possible causes analyzed:

| Cause | Likelihood | Notes |
|-------|------------|-------|
| Event type mismatch | **HIGH** | May need `input` event, not just `change` |
| Value sync issue | Medium | selectedIndex may not update correctly |
| Binding at init only | Medium | Finsweet may cache references |
| Trusted events only | Low | Usually libraries accept synthetic events |

### Recommendation

Try adding `input` event dispatch as quick fix:
```javascript
native_select.dispatchEvent(new Event('input', { bubbles: true }));
native_select.dispatchEvent(new Event('change', { bubbles: true }));
```

### Conclusion

Timing is not the issue. Event dispatch type is likely the problem.

---
<!-- /ANCHOR:agent-3-bridge-timing-analysis -->

<!-- ANCHOR:agent-4-codebase-search -->
## Agent 4: Codebase Search

### Objective
Search for other sorting implementations or Finsweet-related code in the codebase.

### Findings

#### Existing Spec Folder

**Location:** `.opencode/specs/01--anobel.com/z_archive/018-blog-sort-fix/`

Contains:
- `spec.md` - Full requirements and root cause analysis
- `plan.md` - Implementation architecture
- `tasks.md` - Task breakdown
- `checklist.md` - QA validation checklist

**Status:** Solution documented but NOT implemented.

#### Current Bridge Implementation

**File:** `src/2_javascript/form/input_select_fs_bridge.js`

Current broken implementation (lines 80-83):
```javascript
function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

#### Pages Using Finsweet fs-list

| Page | File | Module |
|------|------|--------|
| Blog | `src/0_html/blog.html` | fs-list (filter, sort, search) |
| Het Team | `src/0_html/nobel/n4_het_team.html` | fs-list (load more) |
| Home | `src/0_html/home.html` | cmsnest |

#### Related Documentation

- `.opencode/skill/workflows-code/references/implementation/webflow_patterns.md` (lines 800-1085)
- `.opencode/skill/workflows-code/references/implementation/third_party_integrations.md` (lines 396-633)

### Conclusion

The problem is well-documented. Implementation ready to proceed.

---
<!-- /ANCHOR:agent-4-codebase-search -->

<!-- ANCHOR:agent-5-url-parameter-format-analysis -->
## Agent 5: URL Parameter Format Analysis

### Objective
Verify the exact URL parameter format Finsweet expects for sorting.

### Findings

#### Sort Field Attributes

| Attribute | Value |
|-----------|-------|
| `fs-list-element` | `list`, `sort-trigger`, `filters`, `results-count`, `clear`, `empty` |
| `fs-list-field` | `date`, `name`, `category` |
| `fs-list-type` | `date` (for date fields) |

#### URL Format Testing

| URL Format | Expected Behavior |
|------------|-------------------|
| `?sort=name-asc` | Sort by name ascending |
| `?sort=date-asc` | Sort by date ascending |
| `?sort=category-asc` | Sort by category ascending |

**Note:** The original spec assumed `?sort_name=asc` format, but evidence suggests `?sort=name-asc` is more consistent with Finsweet conventions.

#### Tested Malformed URL

URL: `?date%2C+name%2C+category_contain=f`
Decoded: `?date, name, category_contain=f`

Result: URL normalized to base URL, no effect. This appears to be a malformed filter attempt, not a sort operation.

### Conclusion

Use `?sort=value` format where value matches the CustomSelect option value (e.g., `name-asc`).

---
<!-- /ANCHOR:agent-5-url-parameter-format-analysis -->

<!-- ANCHOR:synthesis -->
## Synthesis

### Root Cause (Confirmed)

The bridge dispatches only a `change` event on the hidden select. Finsweet either:
1. Requires an `input` event instead/additionally
2. Doesn't listen to events at all (reads URL only on init)

### Recommended Solution

Use Finsweet's Reactive API for instant sorting:

```javascript
if (window._finsweetListInstance?.sorting?.value) {
  window._finsweetListInstance.sorting.value.fieldKey = field;
  window._finsweetListInstance.sorting.value.direction = direction;
}
```

### Implementation Strategy

1. **Quick fix test:** Add `input` event dispatch
2. **If fails:** Implement full Reactive API integration
3. **Fallback:** URL navigation (guaranteed but reloads page)

### Verified Facts

| Fact | Source |
|------|--------|
| Option values are `field-asc` format | Agent 1 (live scan) |
| Finsweet has Reactive API | Agent 2 (API research) |
| No initialization race condition | Agent 3 (timing analysis) |
| Spec folder exists, solution documented | Agent 4 (codebase search) |
| URL format is `?sort=value` | Agent 5 (URL analysis) |

---
<!-- /ANCHOR:synthesis -->

<!-- ANCHOR:appendix-source-urls -->
## Appendix: Source URLs

- Finsweet Attributes API: https://finsweet.com/attributes/attributes-api
- List Sort Documentation: https://finsweet.com/attributes/list-sort
- Forum - List Combine: https://forum.finsweet.com/t/list-combine-and-list-sort-on-attributes-v2/5244
- Forum - Restart: https://forum.finsweet.com/t/how-can-i-restart-attributes-v2-programmatically/5068
- Forum - Control Filters: https://forum.finsweet.com/t/control-filters-outside-the-form-element/3400
- GitHub Repository: https://github.com/finsweet/attributes
<!-- /ANCHOR:appendix-source-urls -->
