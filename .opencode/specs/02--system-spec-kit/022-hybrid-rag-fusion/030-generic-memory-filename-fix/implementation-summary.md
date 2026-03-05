---
title: "Implementation Summary: Generic Memory Filename Fix in Stateless Mode"
description: "Resolved review fixes for stateless-only enrichment, generic-task alignment, and regression test coverage"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-generic-memory-filename-fix |
| **Completed** | 2026-03-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This review-fix pass finalizes the memory filename behavior by preserving the original stateless enrichment intent while adding explicit mode guardrails and regression coverage.

When stateless mode yields a generic task label, `extractSpecTitle()` in `workflow.ts` still supplies a meaningful fallback from `spec.md` frontmatter for slug and memory-title generation. New shared guard logic now ensures this enrichment is blocked in JSON/file-backed mode (REQ-004), and generic-task classification is aligned with slug handling to include `Implementation and updates`.

### Key design decisions
- **Stateless-only enrichment** — `shouldEnrichTaskFromSpecTitle()` blocks enrichment whenever JSON/file-backed input is present
- **Shared generic semantics** — enrichment eligibility uses `isGenericContentTask()` to match slug-domain generic handling (`implementation-and-updates` included)
- **Honest template content** — `IMPL_TASK` still uses original `implSummary.task`; only slug/title enrichment path changes
- **Graceful fallback** — missing/invalid `spec.md` title keeps original behavior
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Changes were delivered across workflow, utility, and test layers:
1. `scripts/core/workflow.ts`: keeps `extractSpecTitle()` + enriched slug/title consumption and now delegates guard decision to shared helper
2. `scripts/utils/task-enrichment.ts`: adds `shouldEnrichTaskFromSpecTitle(task, source, dataFilePath)` to enforce stateless-only enrichment
3. `scripts/utils/slug-utils.ts`: adds explicit `implementation-and-updates` generic coverage for enrichment/slug alignment
4. `scripts/tests/task-enrichment.vitest.ts`: adds regression tests for JSON-vs-stateless behavior and expected slug outcomes
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Uses stateless guard for spec-title enrichment and enriched task for slug/title consumers |
| `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` | New `shouldEnrichTaskFromSpecTitle()` helper for JSON-vs-stateless gate |
| `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` | Generic task classification aligned with slug handling (`implementation-and-updates`) |
| `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` | New regression tests for mode divergence and slug outcomes |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS (0 errors) |
| `npm run build` | PASS |
| `npm run test:task-enrichment` (from `.opencode/skill/system-spec-kit`) | PASS |
| REQ-004 stateless guard | PASS (`shouldEnrichTaskFromSpecTitle` blocks JSON/file mode) |
| `IMPL_TASK` unchanged | PASS (still uses `implSummary.task`) |
<!-- /ANCHOR:verification -->
