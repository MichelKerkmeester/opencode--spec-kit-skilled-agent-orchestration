---
title: "...c-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 016 tasks"
  - "multi-cli parity tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Multi-CLI Parity Hardening

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Confirm the shipped parity behavior in `phase-classifier.ts`, `content-filter.ts`, and `input-normalizer.ts` without widening runtime scope.
- [x] T002 Audit the phase-016 validator failures in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] T003 Identify the missing parity-specific regression seams in `phase-classification.vitest.ts`, `runtime-memory-inputs.vitest.ts`, and the content-filter test surface.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T004 Add a direct `View -> Research` regression in `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`.
- [x] T005 Create `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` for Copilot lifecycle noise, Codex reasoning markers, and empty XML wrappers.
- [x] T006 Extend `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` to prove `Read ...` titles and `_provenance: 'tool'` on CLI-derived `FILES`.
- [x] T007 Rewrite phase-016 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the current Level 2 structure with evidence-backed completion.
- [x] T012 Relax ALIGNMENT_BLOCK Block A from hard abort to warning when the spec folder is explicitly provided via CLI argument (`scripts/core/workflow.ts`).
- [x] T013 Add a dedicated `TECHNICAL_CONTEXT` template section that preserves key-value structure from JSON input (`scripts/utils/input-normalizer.ts`, `scripts/extractors/collect-session-data.ts`, `scripts/types/session-types.ts`, `.opencode/skill/system-spec-kit/templates/context_template.md`, `scripts/lib/simulation-factory.ts`).
- [x] T014 Parse confidence from string-form decisions using explicit confidence regex, choice verb detection, and rationale indicators (`scripts/extractors/decision-extractor.ts`).
- [x] T015 Extract duplicated `mapTechnicalContext` helper in `input-normalizer.ts` (review follow-up).
- [x] T016 Remove the unnecessary `as unknown[]` cast in `collect-session-data.ts` (review follow-up).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T008 Run focused Vitest coverage for `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, `runtime-memory-inputs.vitest.ts`, and `description-enrichment.vitest.ts`.
- [x] T009 Run `.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js` and record the final totals.
- [x] T010 Run `npm run typecheck` and `npm run build` from `.opencode/skill/system-spec-kit`.
- [x] T011 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on the phase-016 folder and reconcile the remaining template/evidence findings.
- [x] T017 Update the alignment-block tests to match the new Block A warning behavior (`tests/workflow-e2e.vitest.ts`, `tests/task-enrichment.vitest.ts`).
- [x] T018 Rebuild and rerun the full script and MCP baselines after the 2026-03-18 continuation fixes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All parity requirements have direct regression coverage.
- [x] Phase-016 docs describe the reopened proof pass rather than the earlier assumed-complete state.
- [x] Focused Vitest, extractor-loader baseline, typecheck, build, and phase-folder validation all pass.
- [x] ALIGNMENT_BLOCK relaxation, technicalContext rendering, and decision confidence parsing all implemented and tested (2026-03-18).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parity tests**: `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`
<!-- /ANCHOR:cross-refs -->
