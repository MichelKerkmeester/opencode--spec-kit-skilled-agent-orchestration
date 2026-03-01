---
title: "Tasks: Workflows-Code Skill Alignment [001-workflows-code-codebase-alignment/tasks]"
description: "Implementation task breakdown for aligning workflows-code skill with anobel.com production patterns."
trigger_phrases:
  - "tasks"
  - "workflows"
  - "code"
  - "skill"
  - "alignment"
  - "020"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Workflows-Code Skill Alignment

Implementation task breakdown for aligning workflows-code skill with anobel.com production patterns.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

<!-- ANCHOR:notation -->
## Summary

All 9 implementation tasks completed by 5 parallel sub-agents.

**Execution**: Tasks distributed across parallel agents for maximum efficiency:
- Agent 1: T001 (wait_patterns.js)
- Agent 2: T002 (validation_patterns.js)
- Agent 3: T003, T004, T005 (observer + lenis + animation)
- Agent 4: T006, T007 (code quality + quick reference)
- Agent 5: T008, T009 (HLS + third-party integrations)

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Priority 1 - Critical Fixes

**Goal**: Fix core asset files with outdated/anti-patterns

- [x] T001 [P1] Rewrite `wait_patterns.js` with Observer-based patterns (651 lines)
  - Replaced polling-based patterns with MutationObserver/IntersectionObserver
  - Added cleanup/disconnect patterns for all observers
  - Included RAF batching from table_of_content.js

- [x] T002 [P1] Update `validation_patterns.js` with Webflow/Botpoison integration (1,300 lines)
  - Added Webflow form integration patterns from form_submission.js
  - Documented Botpoison challenge flow
  - Preserved existing SafeDOM and APIClient classes

**Checkpoint**: Critical anti-patterns eliminated from core asset files

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Priority 2 - Important Additions

**Goal**: Add missing reference documentation and patterns

- [x] T003 [P2] Create `observer_patterns.md` reference file
  - MutationObserver with working examples
  - IntersectionObserver with rootMargin examples
  - ResizeObserver patterns
  - Cleanup patterns for each type

- [x] T004 [P2] Create `lenis_patterns.js` asset file (13 functions)
  - Global `window.lenis` access pattern
  - `scrollTo()` with offset and easing
  - Scroll event listener patterns
  - IntersectionObserver coordination

- [x] T005 [P2] Update `animation_workflows.md` with Motion.dev examples
  - Motion.dev `timeline()` from hero_general.js
  - Motion.dev `stagger()` examples
  - Motion.dev `inView()` trigger pattern
  - Cleanup with `controls.stop()`

- [x] T006 [P2] Add CSS section to `code_quality_standards.md`
  - Custom property naming conventions
  - Fluid typography `clamp()` formula
  - Component file organization

- [x] T007 [P2] Update `quick_reference.md` with common one-liners
  - MutationObserver one-liner
  - IntersectionObserver one-liner
  - Lenis scrollTo one-liner

**Checkpoint**: All important additions complete

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Priority 3 - Nice-to-Have

**Goal**: Additional patterns for completeness

- [x] T008 [P3] Create `hls_patterns.js` asset file (10 functions)
  - HLS.js CDN loading pattern
  - `Hls.isSupported()` feature detection
  - `MANIFEST_PARSED` event handling
  - Quality level management
  - Error recovery patterns

- [x] T009 [P3] Create `third_party_integrations.md` reference
  - Overview of all external libraries
  - CDN loading patterns
  - Version pinning recommendations

**Checkpoint**: All nice-to-have additions complete

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Summary

| Priority | Tasks | Status |
|----------|-------|--------|
| P1 (Critical) | 2/2 | ✅ Complete |
| P2 (Important) | 5/5 | ✅ Complete |
| P3 (Nice-to-Have) | 2/2 | ✅ Complete |
| **Total** | **9/9** | **✅ Complete** |

<!-- /ANCHOR:completion -->

---

## Files Modified

| File | Type | Lines | Agent |
|------|------|-------|-------|
| `assets/wait_patterns.js` | Rewrite | 651 | Agent 1 |
| `assets/validation_patterns.js` | Update | 1,300 | Agent 2 |
| `references/observer_patterns.md` | Create | ~200 | Agent 3 |
| `assets/lenis_patterns.js` | Create | 13 funcs | Agent 3 |
| `references/animation_workflows.md` | Update | +150 | Agent 3 |
| `references/code_quality_standards.md` | Update | +CSS section | Agent 4 |
| `references/quick_reference.md` | Update | +one-liners | Agent 4 |
| `assets/hls_patterns.js` | Create | 10 funcs | Agent 5 |
| `references/third_party_integrations.md` | Create | ~150 | Agent 5 |

---

## Verification

All tasks verified against checklist.md criteria. See checklist.md for detailed verification status.
