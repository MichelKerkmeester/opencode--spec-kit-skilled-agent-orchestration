---
title: "Tasks: 008-hydra-db-based-features [02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "hydra"
  - "memory mcp"
  - "roadmap"
importance_tier: "critical"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
---
# Tasks: 008-hydra-db-based-features

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

**Task Format**: `T### [P?] [W:WORKSTREAM] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Research and Closure Baseline

- [x] T001 [W:FOUNDATION] Review active Level 3 and 3+ templates before normalizing the Hydra pack (`.opencode/skill/system-spec-kit/templates/level_3/`, `.opencode/skill/system-spec-kit/templates/level_3+/`)
- [x] T002 [W:FOUNDATION] Reproduce parent-pack and phase-pack validation failures plus the runtime review findings (`spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`)
- [x] T003 [W:FOUNDATION] Lock the March 17 2026 rerun set as the authoritative evidence baseline for this closure pass (`implementation-summary.md`)
- [x] T004 [W:FOUNDATION] Confirm the closure scope covers parent docs, all six phase packs, targeted runtime fixes, and live five-CLI proof capture (`spec.md`, `plan.md`, `tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Documentation Normalization

- [x] T010 [W:DOCS] Normalize the parent pack to active Level 3 structure and remove absorbed `017-markovian-architectures` content (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T011 [W:DOCS] Normalize all six Hydra phase packs to active Level 3+ structure with restored anchors and canonical section headers (`001-baseline-and-safety-rails/` through `006-shared-memory-rollout/`)
- [x] T012 [W:DOCS] Align phase README status language so shipped phases no longer read as drafts (`001-*/README.md` through `006-*/README.md`)
- [x] T013 [W:DOCS] Refresh authoritative March 17 2026 evidence totals and remove dead root references (`spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`)

### Runtime and Proof Corrections

- [x] T020 [W:RUNTIME] Fix owner-only shared-space access enforcement (`mcp_server/lib/collab/shared-spaces.ts`, `mcp_server/tests/shared-spaces.vitest.ts`)
- [x] T021 [W:RUNTIME] Fix retention sweeps so deletion uses the passed database handle (`mcp_server/lib/governance/scope-governance.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/tests/memory-governance.vitest.ts`)
- [x] T022 [W:PROOF] Execute and capture live prompt proof for all five CLIs, then align operator docs with the recorded outcomes (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`, `implementation-summary.md`)
- [x] T023 [W:PROOF] Tighten Hydra truth-sync regression coverage for dates, totals, and CLI-proof wording (`mcp_server/tests/hydra-spec-pack-consistency.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 [W:VERIFY] Re-run root and recursive Hydra spec validation (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T031 [W:VERIFY] Re-run targeted shared-space and retention regressions plus Hydra/doc suites in `mcp_server`
- [x] T032 [W:VERIFY] Re-run `npx tsc --noEmit`, `npm run build`, `npm run test:hydra:phase1`, and full `npm test` in `mcp_server`
- [x] T033 [W:VERIFY] Re-run scripts-side `npm run check`, `npm run build`, and targeted multi-CLI capture suites in `.opencode/skill/system-spec-kit/scripts`
- [x] T034 [W:VERIFY] Re-run `python3 ../sk-code--opencode/scripts/verify_alignment_drift.py --root .` in `.opencode/skill/system-spec-kit`
- [x] T035 [W:VERIFY] Record the final closure outcome and remaining non-technical governance limits in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

### AI Execution Protocol

#### Pre-Task Checklist

- Re-read the current parent pack and affected phase pack before changing wording.
- Confirm whether a claim belongs in parent coordination docs, a phase pack, runtime code, or operator docs.
- Verify the recorded evidence baseline before changing dates, totals, or support statements.

#### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SCOPE | Parent docs coordinate, phase packs hold detailed history, runtime fixes stay tied to review findings |
| TASK-VERIFY | Do not refresh claims without rerunning or citing the authoritative check |
| TASK-TRUTH | Narrow claims when the repo proves less than earlier wording suggested |
| TASK-SYNC | Keep parent docs, phase docs, runtime tests, and operator docs aligned |

#### Status Reporting Format

- `STARTED:` target slice and verification scope
- `IN PROGRESS:` current normalization or fix batch
- `BLOCKED:` conflicting evidence or validation drift
- `DONE:` commands rerun and closure outcome captured

#### Blocked Task Protocol

1. Stop when docs, runtime behavior, and recorded evidence disagree.
2. Identify the authoritative source before broadening scope.
3. Update `implementation-summary.md` when a blocker changes the closure outcome.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Parent pack and six phase packs follow active template structure and required anchors.
- [x] No absorbed `017` merged sections or dead Hydra closure references remain.
- [x] Runtime review findings are fixed and covered by passing regression tests.
- [x] March 17 2026 evidence totals are consistent in authoritative closure docs.
- [x] Live five-CLI prompt proof and CLI wording are aligned to the evidence actually captured in this pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Decision Records**: See `decision-record.md`
- **Operator Docs**: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
<!-- /ANCHOR:cross-refs -->
