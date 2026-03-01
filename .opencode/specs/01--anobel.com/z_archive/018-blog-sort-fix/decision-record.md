---
title: "Decision Record: Blog Sort Dropdown Fix [019-blog-sort-fix/decision-record]"
description: "This document records architectural decisions made during the blog sort dropdown fix, including the rationale for choosing the Finsweet Reactive API approach over simpler altern..."
trigger_phrases:
  - "decision"
  - "record"
  - "blog"
  - "sort"
  - "dropdown"
  - "decision record"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Blog Sort Dropdown Fix

<!-- ANCHOR:overview -->
## Overview

This document records architectural decisions made during the blog sort dropdown fix, including the rationale for choosing the Finsweet Reactive API approach over simpler alternatives.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:decision-1-solution-approach -->
## Decision 1: Solution Approach

### Context

The blog page sort dropdown (CustomSelect + FS Bridge) was not triggering Finsweet list sorting when users selected sort options. Initial investigation suggested URL navigation as the solution.

### Decision

**Chosen:** Option B - Finsweet Reactive API with pushState URL update

**Rejected:**
- Option A: URL Navigation (full page reload)
- Option C: Event dispatch fix (may not work)
- Option D: Custom sort implementation (overkill)

### Rationale

| Factor | Option A (URL) | Option B (Reactive API) |
|--------|---------------|------------------------|
| UX | Poor (page reload) | Excellent (instant) |
| Complexity | Low | Medium |
| Reliability | Guaranteed | High (documented API) |
| Future-proof | Yes | Yes |
| URL sync | Yes | Yes (pushState) |

**Key finding from deep dive:** Finsweet exposes a Reactive API that allows programmatic sorting without page reload:
```javascript
listInstance.sorting.value.fieldKey = 'name';
listInstance.sorting.value.direction = 'asc';
```

This discovery invalidated the original assumption that URL navigation was necessary.

### Consequences

- **Positive:** Instant sorting, better UX, no page flicker
- **Positive:** URL still updates for bookmarking/sharing
- **Negative:** Slightly more complex implementation
- **Negative:** Requires Finsweet instance capture

### Status

**Approved** - Proceed with implementation

---
<!-- /ANCHOR:decision-1-solution-approach -->

<!-- ANCHOR:decision-2-tiered-implementation-strategy -->
## Decision 2: Tiered Implementation Strategy

### Context

Multiple solution options exist with varying complexity and reliability. Need to minimize implementation risk while achieving optimal UX.

### Decision

Implement in tiers, testing simplest solution first:

```
Tier 1: Quick Fix (Option C) - Add 'input' event dispatch
    ↓ If fails
Tier 2: Reactive API (Option B) - Full implementation
    ↓ If fails
Tier 3: URL Fallback (Option D) - Guaranteed but poor UX
```

### Rationale

- Quick fix takes 5 minutes to test
- If it works, saves significant implementation effort
- If it fails, Reactive API is well-documented and reliable
- URL fallback ensures we never ship a broken feature

### Consequences

- **Positive:** Risk mitigation through incremental approach
- **Positive:** Fastest path to working solution
- **Negative:** May require testing multiple approaches

### Status

**Approved** - Test Tier 1 first

---
<!-- /ANCHOR:decision-2-tiered-implementation-strategy -->

<!-- ANCHOR:decision-3-value-parsing-method -->
## Decision 3: Value Parsing Method

### Context

Sort option values are formatted as `{field}-{direction}` (e.g., `name-asc`). Need to parse these reliably.

### Options

1. **split('-')** - Simple but breaks on hyphenated fields like `publication-date-asc`
2. **lastIndexOf('-')** - Robust, handles any field name
3. **Regex** - Flexible but overkill

### Decision

**Chosen:** `lastIndexOf('-')` approach

```javascript
const lastHyphen = value.lastIndexOf('-');
const field = value.substring(0, lastHyphen);
const direction = value.substring(lastHyphen + 1);
```

### Rationale

- Handles current values (`name-asc`, `date-asc`, `category-asc`)
- Also handles potential future values (`publication-date-asc`)
- Simple to understand and maintain
- No regex complexity

### Consequences

- **Positive:** Future-proof for hyphenated field names
- **Positive:** Simple implementation
- **Negative:** Assumes direction is always last segment (valid assumption)

### Status

**Approved**

---
<!-- /ANCHOR:decision-3-value-parsing-method -->

<!-- ANCHOR:decision-4-fallback-strategy -->
## Decision 4: Fallback Strategy

### Context

The Finsweet Reactive API may not be available immediately after page load (async initialization). Need graceful degradation.

### Decision

Implement URL navigation as automatic fallback:

```javascript
if (window._finsweetListInstance?.sorting?.value) {
  // Use Reactive API
} else {
  // Fallback to URL navigation
  window.location.href = url.toString();
}
```

### Rationale

- Reactive API requires async Finsweet initialization
- First sort selection may happen before API is ready
- URL fallback guarantees sorting always works
- User sees page reload on edge case, but sort still works

### Consequences

- **Positive:** Never fails silently
- **Positive:** Graceful degradation
- **Negative:** First sort may cause reload if clicked very quickly

### Status

**Approved**

---
<!-- /ANCHOR:decision-4-fallback-strategy -->

<!-- ANCHOR:decision-5-url-parameter-format -->
## Decision 5: URL Parameter Format

### Context

Need to decide how to format sort parameter in URL for bookmarking/sharing.

### Options

1. `?sort_name=asc` - Separate field and direction
2. `?sort=name-asc` - Combined value
3. `?sort=name&direction=asc` - Explicit parameters

### Decision

**Chosen:** Option 2 - `?sort=name-asc`

### Rationale

- Matches the CustomSelect option value format
- Single parameter is cleaner
- Easy to parse on page load for future URL-to-dropdown sync
- Consistent with how we store the value internally

### Consequences

- **Positive:** Clean URL
- **Positive:** Easy to implement
- **Positive:** Matches internal data format

### Status

**Approved**

---
<!-- /ANCHOR:decision-5-url-parameter-format -->

<!-- ANCHOR:decision-6-console-logging -->
## Decision 6: Console Logging

### Context

Need visibility into bridge behavior for debugging and verification.

### Decision

Add informative console logs:

```javascript
console.log('FinsweetBridge: Captured list instance');
console.log(`FinsweetBridge: Sorted by ${field} (${direction})`);
console.warn('FinsweetBridge: Reactive API failed, falling back to URL', err);
```

### Rationale

- Helps verify correct initialization
- Assists debugging if issues arise
- Warns on fallback activation
- Can be removed in production minification if needed

### Consequences

- **Positive:** Easy debugging
- **Positive:** Verification during testing
- **Negative:** Minor console noise (acceptable)

### Status

**Approved**

---
<!-- /ANCHOR:decision-6-console-logging -->

<!-- ANCHOR:summary -->
## Summary

| Decision | Choice | Status |
|----------|--------|--------|
| Solution approach | Finsweet Reactive API | Approved |
| Implementation strategy | Tiered (quick fix first) | Approved |
| Value parsing | lastIndexOf('-') | Approved |
| Fallback strategy | URL navigation | Approved |
| URL format | ?sort=name-asc | Approved |
| Console logging | Informative logs | Approved |

---
<!-- /ANCHOR:summary -->

<!-- ANCHOR:references -->
## References

- Deep dive research: `research.md`
- Finsweet API docs: https://finsweet.com/attributes/attributes-api
- Forum discussion: https://forum.finsweet.com/t/list-combine-and-list-sort-on-attributes-v2/5244
<!-- /ANCHOR:references -->
