---
title: "Tasks: Multi-CLI Parity Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 016 tasks"
  - "multi-cli parity tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Multi-CLI Parity Hardening

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

- [x] T001 Confirm the shipped parity behavior in `phase-classifier.ts`, `content-filter.ts`, and `input-normalizer.ts` without widening runtime scope.
- [x] T002 Audit the phase-016 validator failures in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] T003 Identify the missing parity-specific regression seams in `phase-classification.vitest.ts`, `runtime-memory-inputs.vitest.ts`, and the content-filter test surface.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a direct `View -> Research` regression in `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`.
- [x] T005 Create `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` for Copilot lifecycle noise, Codex reasoning markers, and empty XML wrappers.
- [x] T006 Extend `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` to prove `Read ...` titles and `_provenance: 'tool'` on CLI-derived `FILES`.
- [x] T007 Rewrite phase-016 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the current Level 2 structure with evidence-backed completion.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run focused Vitest coverage for `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, `runtime-memory-inputs.vitest.ts`, and `description-enrichment.vitest.ts`.
- [x] T009 Run `.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js` and record the final totals.
- [x] T010 Run `npm run typecheck` and `npm run build` from `.opencode/skill/system-spec-kit`.
- [x] T011 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on the phase-016 folder and reconcile the remaining template/evidence findings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All parity requirements have direct regression coverage.
- [x] Phase-016 docs describe the reopened proof pass rather than the earlier assumed-complete state.
- [x] Focused Vitest, extractor-loader baseline, typecheck, build, and phase-folder validation all pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parity tests**: `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`
<!-- /ANCHOR:cross-refs -->
