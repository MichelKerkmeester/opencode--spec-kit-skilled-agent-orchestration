---
title: "Tasks: Offline Loop Optimizer [042.004]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042.004"
  - "tasks"
  - "offline loop optimizer"
  - "phase 4a"
  - "phase 4b"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
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

### AI Execution Protocol

### Pre-Task Checklist
- Confirm whether the task touches corpus building, scoring, replay, promotion, or deferred prompt/meta work.
- Confirm which parameter family is being tuned and whether it is optimizer-managed.
- Confirm the replay or test gate that will decide whether a candidate is safe.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `REQ-LINKED` | Every task must map to at least one optimizer requirement. |
| `REPLAY-FIRST` | Candidate quality must be proven by deterministic replay before any promotion logic runs. |
| `GOVERNED-FIELDS` | Optimizer work may only touch explicitly optimizer-managed config surfaces. |
| `AUDIT-EVERYTHING` | Accepted and rejected candidates both require durable audit output. |
| `MANIFEST-FIRST` | The optimizer manifest must define tunable vs locked fields before search scope expands. |
| `PATCH-NOT-MARKDOWN` | Prompt optimization work must generate prompt packs or patch artifacts, never direct agent markdown edits. |

### Status Reporting Format
- `pending`: task has not started and still matches the optimizer scope.
- `in-progress`: implementation or validation is underway.
- `blocked`: replay fidelity, prerequisite suites, or config governance is unresolved.
- `completed`: implementation and verification are both complete.

### Blocked Task Protocol
- If replay cannot reproduce baseline behavior reliably, block search and promotion tasks instead of tuning against noise.
- If a candidate wants to mutate non-tunable runtime contracts, block it and tighten the config boundary.
- If parity or behavioral tests fail after a candidate improves replay score, keep promotion blocked until the failure is reconciled.
- If the replay fixtures or behavioral suites do not yet exist, keep outputs advisory-only and block any production-promotion task.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase 4a: Corpus, Rubric, and Replay Foundation

**Scope note**: Phase 4a is the realistic near-term track. Packet family `040` is the required replay corpus, `028` is optional holdout data only, and `042` has no implementation traces yet.

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T001 | Completed | REQ-001, REQ-002 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` |
| T002 | Completed | REQ-003 | `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` |
| T003 | Completed | REQ-004 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` |

- [x] T001 Build the `040` replay corpus extractor, with optional compatibility-graded `028` holdout support and explicit exclusion of `042` until traces exist.
- [x] T002 Define the quality rubric for convergence efficiency, recovery success rate, finding accuracy, and synthesis quality.
- [x] T003 Build the deterministic replay runner against baseline and candidate configs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 4a: Search, Audit, and Manifest

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T004 | Completed | REQ-007 | `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` |
| T005 | Completed | REQ-008 | `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`; `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` |
| T006 | Completed | REQ-005, REQ-007 | `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-review/references/convergence.md` |

- [x] T004 Implement the random-search config optimizer for bounded deterministic numeric fields.
- [x] T005 Build the audit trail for optimization runs, including rejected candidates and advisory patch outputs.
- [x] T006 Create the optimizer manifest that separates tunable fields, locked contract fields, and future prompt-pack entrypoints.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 4a: Advisory Promotion Gate

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T007 | Completed | REQ-006, REQ-008 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [x] T007 Implement the advisory-only promotion gate that refuses production mutation until replay fixtures and behavioral suites exist.

### Phase 4b: Deferred Work

**Blocked prerequisite**: behavioral test suite + 2+ corpus families

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T008 | Blocked | REQ-010 | `.opencode/skill/system-spec-kit/scripts/optimizer/prompt-pack-generator.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-prompt-pack.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/prompt-packs/` |
| T009 | Blocked | REQ-011 | `.opencode/skill/system-spec-kit/scripts/optimizer/task-shape-model.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-task-shape-model.vitest.ts` |
| T010 | Blocked | REQ-006, REQ-010 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [ ] [B] T008 DEFERRED: build the prompt-pack generation system for replayable and rollback-safe prompt candidates. Prerequisite: behavioral test suite + 2+ corpus families.
- [ ] [B] T009 DEFERRED: build the cross-packet meta-learning data model for task-shape-aware learning. Prerequisite: behavioral test suite + 2+ corpus families.
- [ ] [B] T010 DEFERRED: implement automatic promotion with behavioral test gating. Prerequisite: behavioral test suite + 2+ corpus families.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task remains mapped to an optimizer requirement and concrete file set.
- [x] Replay determinism is verified before any promotion logic is considered complete.
- [x] Promotion remains advisory-only unless baseline improvement and prerequisite replay plus behavioral gates both exist and pass.
- [x] Optimizer-managed config boundaries stay explicit and rollback-friendly.
- [x] All Phase 4b tasks remain blocked until the behavioral suite and 2+ compatible corpus families exist.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
