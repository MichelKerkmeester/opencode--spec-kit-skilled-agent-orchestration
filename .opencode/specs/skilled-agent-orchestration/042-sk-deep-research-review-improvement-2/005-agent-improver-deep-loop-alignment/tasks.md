---
title: "Tasks: Agent-Improver Deep-Loop Alignment [005]"
description: "Completed task record for the improve-agent runtime-truth alignment, rewritten to the current Level 3 tasks template with evidence."
trigger_phrases:
  - "005"
  - "agent improver tasks"
  - "sk-improve-agent tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable at implementation time |

**Task Format**: `T### Description` followed by evidence in brackets.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the earlier 042 runtime-truth phases and mapped the improve-agent work to those patterns. `[EVIDENCE: ../001-runtime-truth-foundation/spec.md; ../002-semantic-coverage-graph/spec.md; commit 080cf549e summary]`
- [x] T002 Identified the improve-agent surfaces that needed alignment: skill, assets, command, runtime mirror, scripts, tests, and playbooks. `[EVIDENCE: commit 080cf549e summary; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
- [x] T003 Preserved the proposal-only model by keeping journal writes in orchestrator-owned surfaces instead of the target agent body. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "orchestrator-only constraint is preserved"; .opencode/agent/improve-agent.md]`
- [x] T004 Defined the delivered helper surface for the phase: journal, coverage, trade-off, lineage, and stability modules. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; mutation-coverage.cjs; trade-off-detector.cjs; candidate-lineage.cjs; benchmark-stability.cjs]`
- [x] T005 Established release evidence for packet closeout. `[EVIDENCE: commit 080cf549e; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Created the append-only improvement journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs]`
- [x] T007 Created the mutation coverage helper for improvement sessions. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs]`
- [x] T008 Created the trade-off detector helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs]`
- [x] T009 Created the candidate-lineage helper for optional parallel exploration. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs]`
- [x] T010 Created the benchmark stability helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs]`
- [x] T011 Updated improve-agent configuration to carry runtime-truth settings. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_config.json]`
- [x] T012 Updated the improve-agent charter with audit-trail and legal-stop obligations. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_charter.md]`
- [x] T013 Updated the improve-agent strategy asset with convergence, exhaustion, and trade-off guidance. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_strategy.md]`
- [x] T014 Published the runtime-truth contract in the skill documentation. `[EVIDENCE: .opencode/skill/sk-improve-agent/SKILL.md; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
- [x] T015 Updated the visible improve command documentation. `[EVIDENCE: .opencode/command/improve/agent.md; commit 080cf549e summary]`
- [x] T016 Updated the runtime mirror document at the current path. `[EVIDENCE: .opencode/agent/improve-agent.md]`
- [x] T017 Added end-to-end playbook scenarios for mutation coverage, trade-off detection, and candidate lineage. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md; 023-trade-off-detection.md; 024-candidate-lineage.md]`
- [x] T018 Added runtime-truth playbook scenarios for stop reasons, journal emission, legal-stop gates, stability, trajectory, and optional parallel candidates. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md through 031-parallel-candidates-opt-in.md]`
- [x] T019 Captured the delivered work in the release note for `v1.1.0.0`. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Added dedicated Vitest coverage for the journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts]`
- [x] T021 Added dedicated Vitest coverage for the coverage helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts]`
- [x] T022 Added dedicated Vitest coverage for the trade-off detector. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts]`
- [x] T023 Added dedicated Vitest coverage for candidate lineage. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts]`
- [x] T024 Added dedicated Vitest coverage for benchmark stability. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts]`
- [x] T025 Recorded the shipped verification summary in the release note. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "31/31 PASS" and "10,335 passing"]`
- [x] T026 Recorded the later lifecycle-contract correction so the packet closeout matches current reality. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
- [x] T027 Normalized the phase packet to the current Level 3 template. `[EVIDENCE: this phase folder; validate.sh --strict]`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required runtime-truth helper files are present at current `sk-improve-agent` paths. `[EVIDENCE: T006-T010]`
- [x] Skill, asset, command, and runtime mirror docs are aligned to the delivered phase outcome. `[EVIDENCE: T011-T016]`
- [x] Dedicated test and playbook coverage exists for the phase additions. `[EVIDENCE: T017-T025]`
- [x] The packet uses current runtime naming and avoids stale static-profile wording. `[EVIDENCE: spec.md, plan.md, implementation-summary.md]`
- [x] Strict validation passes for this phase folder. `[EVIDENCE: validate.sh --strict]`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Document | Purpose |
|----------|---------|
| `spec.md` | Final requirement and success-criteria record for the delivered phase |
| `plan.md` | Delivered implementation-phases view and dependency graph |
| `checklist.md` | Evidence-backed verification record |
| `decision-record.md` | Consolidated architectural rationale for the five accepted decisions |
| `implementation-summary.md` | Completed-state narrative and verification summary |

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Read packet docs and live runtime surfaces before editing. `[EVIDENCE: packet rewrite grounded in current file inventory and release artifacts]`
- [x] Keep documentation aligned to live `sk-improve-agent` naming. `[EVIDENCE: packet docs reference `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`]`

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SCOPE | Only phase-folder docs are edited during closeout. |
| TASK-EVIDENCE | Every completed task uses a concrete file, commit, changelog, or validator citation. |
| TASK-NAMING | Current runtime references use `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
| TASK-HISTORY | Historical outcomes are preserved, but superseded lifecycle claims are not reintroduced as current truth. |

#### Status Reporting Format

`Phase 005 [COMPLETE] — packet aligned, evidence added, strict validation passed`

#### Blocked Task Protocol

No blocked tasks remain in this closeout pass.
<!-- /ANCHOR:cross-refs -->
