---
title: "Spec: Generic Memory Filename Fix in Stateless Mode"
description: "Resolve review fixes for stateless-only enrichment, generic task alignment, and JSON-vs-stateless regression coverage"
importance_tier: "normal"
contextType: "implementation"
---
# Specification: Generic Memory Filename Fix in Stateless Mode
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->

---

<!-- ANCHOR:parent-ref -->
## Parent Reference

**Parent Spec:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`
**Phase:** 032 of 034 (Hybrid RAG Fusion Refinement)
<!-- /ANCHOR:parent-ref -->

---

<!-- ANCHOR:problem -->
## Problem

Review follow-up required tightening and proving the filename-fallback behavior:

1. Enrichment must run only in stateless mode (JSON mode must remain unchanged)
2. Generic task detection must match slug handling, including explicit coverage for `Implementation and updates`
3. Regression tests must prove JSON-vs-stateless behavior and slug outcomes

Without these guardrails, generic labels can still produce non-descriptive filenames in stateless mode or unintentionally alter JSON mode behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:requirements -->
## Requirements

- REQ-001: When task is generic in stateless mode, extract title from `spec.md` frontmatter as fallback
- REQ-002: Enriched task feeds slug generation (`generateContentSlug`) and title generation (`buildMemoryTitle`)
- REQ-003: Template content (`IMPL_TASK`) must still use original `implSummary.task` (stay honest)
- REQ-004: JSON data mode must remain unaffected via explicit stateless guard before enrichment
- REQ-005: Generic detection used for enrichment must align with slug generic handling, including `Implementation and updates`
- REQ-006: Regression tests must explicitly verify JSON-vs-stateless divergence and slug outcome expectations
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`: Apply stateless-only enrichment guard and consume enriched task for slug/title
- `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts`: Align generic task detection with slug behavior (`implementation-and-updates` coverage)
- `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts`: Centralize enrichment decision guard (`shouldEnrichTaskFromSpecTitle`)
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`: Add regression tests for JSON-vs-stateless behavior and slug outcomes

### Out of Scope
- `semantic-summarizer.ts` — no changes
- Template content — `IMPL_TASK` unchanged
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. `npx tsc --noEmit` passes
2. `npm run build` succeeds
3. `npm run test:task-enrichment` passes (run from `.opencode/skill/system-spec-kit`)
4. Stateless mode produces descriptive filename derived from spec.md title for generic tasks
5. JSON mode remains unchanged due to stateless guard (REQ-004)
<!-- /ANCHOR:success-criteria -->
