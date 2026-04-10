---
title: "Tasks: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042"
  - "tasks"
  - "deep research"
  - "deep review"
  - "runtime improvement"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Deep Research and Deep Review Runtime Improvement Bundle

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
- Confirm the target requirement and packet phase before editing.
- Confirm the exact files in scope for the task.
- Confirm the behavior or parity check that will prove the task is complete.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `REQ-LINKED` | Every task must map to at least one packet requirement. |
| `FILES-EXPLICIT` | Every task must name its concrete file targets before implementation starts. |
| `OPT-IN-LAST` | Council and coordination-board tasks stay behind the foundational runtime work. |
| `VERIFY-WITH-TESTS` | Behavior/parity/reducer tests are the closeout gate for implementation tasks. |

### Status Reporting Format
- `pending`: task has not started and still matches the current packet scope.
- `in-progress`: active implementation or validation work is underway.
- `blocked`: task is waiting on a prerequisite contract or failing verification.
- `completed`: implementation and listed verification steps are done.

### Blocked Task Protocol
- If a task depends on an unresolved stop/done/resume contract, mark it blocked instead of starting partial implementation.
- If parity or behavior tests fail, keep the task open until the failing contract is reconciled.
- If scope expands beyond the packet, split follow-on work into a separate packet instead of widening the task silently.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T001 | Pending | REQ-001 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
| T002 | Pending | REQ-001 | `.opencode/skill/sk-deep-review/SKILL.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
| T003 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
| T004 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-review/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
| T005 | Pending | REQ-003 | `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
| T006 | Pending | REQ-003 | `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |

- [ ] T001 Define the shared stop-reason taxonomy for deep research.
- [ ] T002 Define the shared stop-reason taxonomy for deep review.
- [ ] T003 Add the legal done-gate model to deep research.
- [ ] T004 Add the legal done-gate model to deep review.
- [ ] T005 Add resume/start-from-run semantics to deep research.
- [ ] T006 Add resume/start-from-run semantics to deep review.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T007 | Pending | REQ-004 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
| T008 | Pending | REQ-004 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md` |
| T009 | Pending | REQ-005 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
| T010 | Pending | REQ-007 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
| T011 | Pending | REQ-007 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
| T012 | Pending | REQ-008, REQ-009 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/agent/deep-research.md` |
| T013 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/skill/sk-deep-research/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
| T014 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/sk-deep-review/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
| T015 | Pending | REQ-013 | `.opencode/agent/deep-research.md`; `.claude/agents/deep-research.md`; `.gemini/agents/deep-research.md`; `.codex/agents/deep-research.toml`; `.agents/agents/deep-research.md` |
| T016 | Pending | REQ-013 | `.opencode/agent/deep-review.md`; `.claude/agents/deep-review.md`; `.gemini/agents/deep-review.md`; `.codex/agents/deep-review.toml` |
| T022 | Pending | REQ-010 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/agent/deep-research.md` |
| T023 | Pending | REQ-011 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |

- [ ] T007 Add the deep-research audit journal and journal-aware rollups.
- [ ] T008 Add the deep-review audit journal and journal-aware rollups.
- [ ] T009 Add the deep-research claim-verification ledger contract and synthesis references.
- [ ] T010 Extend the deep-research dashboard and reducer metrics.
- [ ] T011 Extend the deep-review dashboard and contract metrics.
- [ ] T012 Add publication critique, runtime inventory, and promotion-checkpoint sections to deep research.
- [ ] T013 Update deep-research command docs and quick-reference surfaces.
- [ ] T014 Update deep-review command docs and quick-reference surfaces.
- [ ] T015 Update canonical deep-research contracts and runtime mirrors to preserve parity.
- [ ] T016 Update canonical deep-review contracts and runtime mirrors to preserve parity.
- [ ] T022 Add council-style synthesis as an explicit opt-in deep-research profile.
- [ ] T023 Add the packet-local coordination-board artifact for large multi-phase research.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T017 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` |
| T018 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
| T019 | Pending | REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
| T020 | Pending | REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
| T021 | Pending | REQ-013 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` |
| T024 | Pending | REQ-010, REQ-011 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` |

- [ ] T017 Create deep-research behavior-first tests.
- [ ] T018 Create deep-review behavior-first tests.
- [ ] T019 Extend deep-research reducer tests for journal, ledger, and dashboard behavior.
- [ ] T020 Extend deep-review reducer/schema tests for stop reasons, journals, dashboard metrics, and resume cursor fields.
- [ ] T021 Extend deep-research and deep-review contract parity tests for the new artifact paths and lifecycle fields.
- [ ] T024 Add behavior/parity coverage proving that council mode and coordination-board mode remain optional.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task remains mapped to a parent requirement and concrete file set
- [ ] No task is left without a verification path
- [ ] Optional advanced-mode work remains sequenced after foundational runtime truth
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
