---
title: "Tasks: Tier 2 Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T1..T20 across 4 source-review sections (D/E/F/G). H deferred to human verification."
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-tier2-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict-validator closure pass"
    next_safe_action: "Keep validators green"
    completion_pct: 100
trigger_phrases:
  - "004-tier2-remediation"
  - "validator hygiene"
importance_tier: "normal"
contextType: "implementation"
---

# Tasks: Tier 2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Tasks are grouped by source review section. P1 tasks gate the sub-phase verdict.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### [REQ] Description. Evidence: file:line or command exit.`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** [REQ-001] Investigate Copilot transport and decide whether current-turn advisor injection is achievable. Evidence: `008/007/decision-record.md:215` records ADR-005.
- [x] **T002** [REQ-001] Document the accepted Copilot next-prompt limitation. Evidence: `008/007/spec.md:109`.
- [x] **T003** [REQ-002] Reconcile stale pending state in 008/007/checklist.md. Evidence: `008/007/checklist.md:88`.
- [x] **T004** [REQ-009] Verify `buildCopilotPromptArg` `@path` large-prompt behavior. Evidence: `mcp_server/tests/deep-loop/cli-matrix.vitest.ts:381`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T005** [REQ-003] Replace stale helper path references in 009/005 canonical docs. Evidence: `rg '.opencode/plugin-helpers' 009/005 canonical docs` returns zero non-review hits.
- [x] **T006** [REQ-003] Record the live `plugin_bridges` path correction in 009/005 implementation summary. Evidence: `009/005/implementation-summary.md:161`.
- [x] **T007** [REQ-010] Close 009/005 P2 advisories with evidence in checklist. Evidence: `009/005/checklist.md:125` and `009/005/checklist.md:126`.
- [x] **T008** [REQ-004] Investigate `.github/hooks/superset-notify.json` routing and record ADR-004. Evidence: `009/002/decision-record.md:95`.
- [x] **T009** [REQ-004] Restore repo-local routing before Superset notification. Evidence: `.github/hooks/superset-notify.json:7` and `.github/hooks/superset-notify.json:21`.
- [x] **T010** [REQ-005] Add explicit custom-instructions cleanup/scoping contract. Evidence: `custom-instructions.ts:129`, `custom-instructions.ts:176`, and `custom-instructions.ts:197`.
- [x] **T011** [REQ-005] Update 009/002/spec.md lifecycle section. Evidence: `009/002/spec.md:121`.
- [x] **T012** [REQ-011] Close 009/002 P2 advisories. Evidence: `009/002/checklist.md:54` and `009/002/checklist.md:55`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T013** [REQ-006] Rewrite 006/008/spec.md to completed-loop state. Evidence: `006/008/spec.md:81` through `006/008/spec.md:86`.
- [x] **T014** [REQ-007] Correct `006/008/description.json` path drift. Evidence: `006/008/description.json:2`.
- [x] **T015** [REQ-007] Correct `006/008/graph-metadata.json` and spec frontmatter. Evidence: `006/008/graph-metadata.json:3` and `006/008/spec.md:13`.
- [x] **T016** [REQ-008] Resolve sibling 006/007 ledger contradictions. Evidence: `006/007/tasks.md:13`, `006/007/checklist.md:14`, and `006/007/implementation-summary.md:355`.
- [x] **T017** [REQ-012] Add acceptance criteria to 006/008/spec.md. Evidence: `006/008/spec.md:81`.
- [x] **T018** [REQ-013] Align research artifact references with on-disk reality. Evidence: `006/008/spec.md:85` and 43 files under `006/008/research/008-deep-research-review-pt-01`.
- [x] **T019** Verify `__tier2-h-deferred.md` documents H P0 status and human action. Evidence: `__tier2-h-deferred.md:11`, `__tier2-h-deferred.md:21`, and `__tier2-h-deferred.md:29`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T020** Run strict validator on this sub-phase. Evidence: closure pass records the strict-validator command and exit code in the temporary hygiene summary.
- [x] **T021** Author `implementation-summary.md` with disposition for each of the 15 actionable findings plus H deferral note. Evidence: `implementation-summary.md:31` and `implementation-summary.md:69`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
