---
title: "Tasks: minify-javascript - Implementation Breakdown [005-minify-javascript/tasks]"
description: "Minify the JavaScript files in src/2_javascript/z_minified/ in-place, with conservative settings to avoid runtime regressions when embedded in Webflow."
trigger_phrases:
  - "tasks"
  - "minify"
  - "javascript"
  - "implementation"
  - "breakdown"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: minify-javascript - Implementation Breakdown

Minify the JavaScript files in `src/2_javascript/z_minified/` in-place, with conservative settings to avoid runtime regressions when embedded in Webflow.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: minify-javascript, javascript-assets
- **Priority**: P0

### Input
- `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/spec.md`
- `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/plan.md`
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:tasks -->
## 2. TASKS

- [x] T001 [P0] [US1] Inventory `.js` files in `src/2_javascript/z_minified/` and capture pre-minify sizes
- [x] T002 [P0] [US1] Confirm local minifier availability (prefer `terser`) without network installs
- [x] T003 [P0] [US1] Minify all `.js` files in-place using conservative settings (no property mangling, no top-level mangling, no unsafe transforms)
- [x] T004 [P0] [US1] Verify every minified file passes a syntax check (`node --check` or equivalent)
- [x] T005 [P1] [US1] Capture post-minify sizes and confirm size reduction where applicable
- [x] T006 [P1] [US1] Document exact minifier command/options and verification evidence in `.opencode/specs/01--anobel.com/z_archive/005-minify-javascript/checklist.md`
<!-- /ANCHOR:tasks -->
