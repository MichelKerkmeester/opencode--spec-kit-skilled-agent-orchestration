---
title: "Tasks: Blog Sort Dropdown Fix [019-blog-sort-fix/tasks]"
description: "┌─────────────────────────────────────────────────────────────────────────────┐"
trigger_phrases:
  - "tasks"
  - "blog"
  - "sort"
  - "dropdown"
  - "fix"
  - "019"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Blog Sort Dropdown Fix

<!-- ANCHOR:task-breakdown -->
## Task Breakdown

### Phase 0: Quick Fix Test (Option C)

- [ ] **T0.1** Add `input` event dispatch to `sync_to_native()`
- [ ] **T0.2** Test on blog page - does sort work?
- [ ] **T0.3** If works: Skip to Phase 4 (Deployment)
- [ ] **T0.4** If fails: Proceed to Phase 1

### Phase 1: Finsweet Instance Capture

- [ ] **T1.1** Add `capture_finsweet_instance()` function to bridge
- [ ] **T1.2** Call capture function in `start()` before bridge init
- [ ] **T1.3** Verify console shows "Captured list instance" on blog page
- [ ] **T1.4** Verify `window._finsweetListInstance` is populated

### Phase 2: Reactive API Integration

- [ ] **T2.1** Add `update_url_param()` helper function
- [ ] **T2.2** Add `fallback_url_navigation()` helper function
- [ ] **T2.3** Rewrite `sync_to_native()` with Reactive API logic
- [ ] **T2.4** Add robust value parsing (lastIndexOf for hyphens)
- [ ] **T2.5** Add direction validation (asc/desc only)
- [ ] **T2.6** Add try/catch with fallback on API failure

### Phase 3: Testing

- [ ] **T3.1** Test sort by Name - instant, no reload
- [ ] **T3.2** Test sort by Category - instant, no reload
- [ ] **T3.3** Test sort by Date - instant, no reload
- [ ] **T3.4** Verify URL updates with pushState
- [ ] **T3.5** Test page reload - sort persists
- [ ] **T3.6** Test contact form selects - no URL navigation
- [ ] **T3.7** Test werken_bij form selects - no URL navigation
- [ ] **T3.8** Test vacature form selects - no URL navigation
- [ ] **T3.9** Verify console logs show correct flow

### Phase 4: Deployment

- [ ] **T4.1** Minify using `minify-webflow.mjs`
- [ ] **T4.2** Verify with `verify-minification.mjs`
- [ ] **T4.3** Test minified file locally
- [ ] **T4.4** Upload to R2 CDN with version bump (v1.1.0)
- [ ] **T4.5** Update `blog.html` CDN URL version
- [ ] **T4.6** Test live blog page

### Phase 5: Documentation

- [ ] **T5.1** Update checklist.md with completion evidence
- [ ] **T5.2** Create implementation-summary.md

---
<!-- /ANCHOR:task-breakdown -->

<!-- ANCHOR:priority-order -->
## Priority Order

| Priority | Tasks | Rationale |
|----------|-------|-----------|
| P0 | T0.1-T0.4 | Quick fix test - may avoid additional work |
| P0 | T1.1-T1.4, T2.1-T2.6 | Core implementation if quick fix fails |
| P0 | T3.1-T3.4 | Verify primary functionality |
| P1 | T3.5-T3.9 | Regression and edge cases |
| P0 | T4.1-T4.6 | Deployment |
| P1 | T5.1-T5.2 | Documentation |

---
<!-- /ANCHOR:priority-order -->

<!-- ANCHOR:dependencies -->
## Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: Quick Fix Test                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  T0.1 ──▶ T0.2 ──▶ [DECISION POINT]                                        │
│                         │                                                   │
│              ┌──────────┴──────────┐                                        │
│              ▼                     ▼                                        │
│          SUCCESS               FAILURE                                      │
│              │                     │                                        │
│              ▼                     ▼                                        │
│          T0.3                   T0.4                                        │
│        (skip to              (proceed)                                      │
│         Phase 4)                  │                                         │
│              │                    │                                         │
└──────────────┼────────────────────┼─────────────────────────────────────────┘
               │                    │
               │                    ▼
               │  ┌─────────────────────────────────────────────────────────┐
               │  │ PHASE 1-2: Full Implementation                          │
               │  ├─────────────────────────────────────────────────────────┤
               │  │                                                         │
               │  │  T1.1 ──▶ T1.2 ──▶ T1.3 ──▶ T1.4                       │
               │  │                               │                         │
               │  │                               ▼                         │
               │  │  T2.1 ──▶ T2.2 ──▶ T2.3 ──▶ T2.4 ──▶ T2.5 ──▶ T2.6    │
               │  │                                                │        │
               │  └────────────────────────────────────────────────┼────────┘
               │                                                   │
               └───────────────────────────────┬───────────────────┘
                                               ▼
               ┌─────────────────────────────────────────────────────────────┐
               │ PHASE 3: Testing                                            │
               ├─────────────────────────────────────────────────────────────┤
               │                                                             │
               │  T3.1 ──┬──▶ T3.4 ──▶ T3.5                                 │
               │  T3.2 ──┤                                                   │
               │  T3.3 ──┘                                                   │
               │                                                             │
               │  T3.6 ──┬──▶ T3.9                                          │
               │  T3.7 ──┤                                                   │
               │  T3.8 ──┘                                                   │
               │                                                             │
               └─────────────────────────────────┬───────────────────────────┘
                                                 │
                                                 ▼
               ┌─────────────────────────────────────────────────────────────┐
               │ PHASE 4: Deployment                                         │
               ├─────────────────────────────────────────────────────────────┤
               │                                                             │
               │  T4.1 ──▶ T4.2 ──▶ T4.3 ──▶ T4.4 ──▶ T4.5 ──▶ T4.6        │
               │                                                             │
               └─────────────────────────────────┬───────────────────────────┘
                                                 │
                                                 ▼
               ┌─────────────────────────────────────────────────────────────┐
               │ PHASE 5: Documentation                                      │
               ├─────────────────────────────────────────────────────────────┤
               │                                                             │
               │  T5.1 ──▶ T5.2                                              │
               │                                                             │
               └─────────────────────────────────────────────────────────────┘
```

---
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:task-details -->
## Task Details

### T0.1: Add Input Event Dispatch

**File:** `src/2_javascript/form/input_select_fs_bridge.js`
**Line:** ~80-83
**Change:**
```javascript
// Before:
native_select.dispatchEvent(new Event('change', { bubbles: true }));

// After:
native_select.dispatchEvent(new Event('input', { bubbles: true }));
native_select.dispatchEvent(new Event('change', { bubbles: true }));
```

### T1.1: Add Finsweet Capture Function

**File:** `src/2_javascript/form/input_select_fs_bridge.js`
**Location:** After CONFIGURATION section
**Add:**
```javascript
function capture_finsweet_instance() {
  window.FinsweetAttributes = window.FinsweetAttributes || [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      if (listInstances.length > 0) {
        window._finsweetListInstance = listInstances[0];
        console.log('FinsweetBridge: Captured list instance');
      }
    },
  ]);
}
```

### T2.3: Rewrite sync_to_native()

See `plan.md` Phase 2 for complete implementation.

---
<!-- /ANCHOR:task-details -->

<!-- ANCHOR:verification-commands -->
## Verification Commands

```bash
# Minify
node src/4_scripts/minify-webflow.mjs src/2_javascript/form/input_select_fs_bridge.js

# Verify minification
node src/4_scripts/verify-minification.mjs src/2_javascript/form/input_select_fs_bridge.js

# Test minified runtime (if available)
node src/4_scripts/test-minified-runtime.mjs src/2_javascript/z_minified/form/input_select_fs_bridge.js
```
<!-- /ANCHOR:verification-commands -->
