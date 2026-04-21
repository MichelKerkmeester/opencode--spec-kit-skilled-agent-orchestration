---
title: "Tasks: 007-skill-advisor-packaging-and-graph Skill Advisor Packaging and Graph Remediation"
description: "Task ledger for 007-skill-advisor-packaging-and-graph Skill Advisor Packaging and Graph Remediation."
trigger_phrases:
  - "tasks 007 skill advisor packaging and graph skill advisor packaging and "
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/007-skill-advisor-packaging-and-graph"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 007-skill-advisor-packaging-and-graph Skill Advisor Packaging and Graph Remediation
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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Confirm consolidated findings source is readable
- [ ] T002 [P0] Verify severity counts against the source report
- [ ] T003 [P1] Identify target source phases before implementation edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] [P1] CF-154: [F002] The reviewed 24-scenario corpus no longer matches the live 47-scenario playbook. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: spec.md:30, spec.md:56, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:40, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101
- [ ] T011 [P] [P1] CF-182: [F-002] Session bootstrap does not include the required skill graph topology summary _(dimension: traceability)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: -
- [ ] T012 [P] [P1] CF-258: [F001] Native-path advisor brief hardcodes the second score as 0.00 _(dimension: correctness)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122
- [ ] T013 [P] [P2] CF-187: [F-006] Skill graph validation rules are duplicated across database, status, validate, and compiler paths _(dimension: maintainability)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: -
- [ ] T014 [P] [P2] CF-261: [F002] Status reports runtime ready before any bridge/probe validation _(dimension: correctness)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/plugins/spec-kit-skill-advisor.js:369
- [ ] T015 [P] [P2] CF-266: [F009] Bridge duplicates advisor rendering/sanitization logic for the native path _(dimension: maintainability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99
- [ ] T016 [P] [P2] CF-273: [F006] Live wrapper only observes exact Read tool names, so runtime aliases can silently evade telemetry. _(dimension: correctness)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: live-session-wrapper.ts:156, live-session-wrapper.ts:158, LIVE_SESSION_WRAPPER_SETUP.md:48, LIVE_SESSION_WRAPPER_SETUP.md:52
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 [P0] Run strict packet validation
- [ ] T901 [P1] Update graph metadata after implementation
- [ ] T902 [P1] Add implementation summary closeout evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly deferred
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
