---
title: "Plan: Generic Memory Filename Fix in Stateless Mode"
description: "Apply review fixes for stateless-only enrichment, generic detection alignment, and regression coverage"
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Generic Memory Filename Fix in Stateless Mode
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->

---

<!-- ANCHOR:approach -->
## Approach

Small multi-file refinement. Keep enrichment behavior for stateless mode, but enforce an explicit JSON-mode guard, align generic-task detection with slug semantics, and add focused regression tests.

| Step | What | Why |
|------|------|-----|
| 1 | Keep `extractSpecTitle()` fallback in `workflow.ts` | Preserve descriptive stateless filenames |
| 2 | Add stateless-only decision helper in `task-enrichment.ts` | Satisfy REQ-004 (JSON mode unchanged) |
| 3 | Align generic detection in `slug-utils.ts` | Prevent drift between enrichment and slug handling |
| 4 | Cover `Implementation and updates` explicitly | Match known generic task variant |
| 5 | Add regression tests in `task-enrichment.vitest.ts` | Lock JSON-vs-stateless behavior and slug outcomes |
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:architecture -->
## Architecture

### Existing helper: `extractSpecTitle(specFolderPath)`
- Reads `spec.md` from the spec folder
- Extracts `title:` from YAML frontmatter
- Strips `Feature Specification:` prefix and `[template:...]` suffix
- Returns empty string on any failure (graceful fallback)

### New guard: `shouldEnrichTaskFromSpecTitle(task, source, dataFilePath)`
- Returns `false` for JSON/file-backed mode (`source === 'file'` or `dataFilePath` present)
- Returns `true` only for stateless mode with generic task labels
- Uses shared `isGenericContentTask()` so guardrails follow slug-domain generic semantics

### Modified: Generic task classification
- `isGenericContentTask()` now treats `implementation-and-updates` as generic
- Keeps `generateContentSlug()` behavior unchanged while aligning enrichment eligibility

### Modified: Consumer calls
- `generateContentSlug(enrichedTask, folderBase)` — was `implSummary.task`
- `buildMemoryTitle(enrichedTask, specFolderName, date)` — was `implSummary.task`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## Execution

1. Update `workflow.ts`, `slug-utils.ts`, and `task-enrichment.ts`
2. Add regression suite in `scripts/tests/task-enrichment.vitest.ts`
3. Run `npx tsc --noEmit`
4. Run `npm run build`
5. Run `npm run test:task-enrichment` from `.opencode/skill/system-spec-kit`
<!-- /ANCHOR:phases -->
