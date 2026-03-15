---
title: "Tasks: remediation-revalidation [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "remediation tasks"
  - "revalidation backlog"
  - "phase 021"
importance_tier: "high"
contextType: "general"
---
# Tasks: remediation-revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 021 folder context and parent linkage targets (`../spec.md`, `../plan.md`, `../tasks.md`, `../synthesis.md`)
- [x] T002 Verify stale-parent-state symptoms and over-claims in current 021 packet (phase 021 docs)
- [x] T003 [P] Verify repository evidence for already-applied remediation fixes (`mcp_server/tests/chunk-thinning.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`, `feature_catalog/01--*` through `18--*`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Reconciliation Implementation

- [x] T004 Update phase 021 `spec.md` scope/requirements to match already-applied remediation reality (`spec.md`)
- [x] T005 Update phase 021 `plan.md` to remove over-claims and reflect factual verification strategy (`plan.md`)
- [x] T006 Update phase 021 task backlog to truthful state tracking (`tasks.md`)
- [x] T007 Update parent `spec.md` and `plan.md` to align with phase 021 reconciliation model (`../spec.md`, `../plan.md`)
- [x] T008 Update parent `tasks.md` from stale unchecked baseline to current remediation-aware state (`../tasks.md`)
- [x] T009 Rewrite parent synthesis report so old counts are historical/superseded and phase 021 is current reconciliation record (`../synthesis.md`)
- [x] T010 Update phase 020 `Next Phase` metadata to `../021-remediation-revalidation/spec.md` (`../020-feature-flag-reference/spec.md`)
- [x] T011 Replace 021 implementation summary template residue with factual completion narrative (`implementation-summary.md`)
- [x] T012 Synchronize 021 checklist evidence references with actual file/task state (`checklist.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run recursive spec validation for parent + child phase docs (`validate.sh --recursive`) [RESULT: PASS on 2026-03-15 — `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --recursive .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog` returned `All 21 phases passed. Summary: Errors: 0, Warnings: 0`.]
- [x] T014 Run placeholder scan for phase 021 docs (`rg` placeholder pattern scan) [RESULT: PASS, no placeholder hits (rg exit 1)]
- [x] T015 Record actual verification outputs in `checklist.md` and `implementation-summary.md` (`checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T013-T015 marked complete with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Parent and phase 021 docs remain mutually consistent after verification
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
