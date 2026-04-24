---
title: "...zation/007-deep-review-remediation/005-006-campaign-findings-remediation/007-skill-advisor-packaging-and-graph/tasks]"
description: "Task ledger for 007-skill-advisor-packaging-and-graph Skill Advisor Packaging and Graph Remediation."
trigger_phrases:
  - "tasks 007 skill advisor packaging and graph skill advisor packaging and"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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

- [x] T001 [P0] Confirm consolidated findings source is readable. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:381`.
- [x] T002 [P0] Verify severity counts against the source report. Evidence: consolidated Theme 7 reports `P0=0 P1=3 P2=4` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:383`.
- [x] T003 [P1] Identify target source phases before implementation edits. Evidence: P1 rows identify `002-manual-testing-playbook`, `006-skill-graph-sqlite-migration`, and `006-smart-router-remediation-and-opencode-plugin` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:394`, `:395`, and `:396`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] [P1] CF-154: [F002] The reviewed 24-scenario corpus no longer matches the live 47-scenario playbook. _(dimension: correctness)_ Closed by preserving the live 47-scenario root playbook and adding an inventory regression. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:103`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/manual-testing-playbook.vitest.ts:39`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/manual-testing-playbook.vitest.ts:47`, targeted vitest `skill-advisor/tests/manual-testing-playbook.vitest.ts` passed 1/1.
- [x] T011 [P] [P1] CF-182: [F-002] Session bootstrap does not include the required skill graph topology summary _(dimension: traceability)_ Closed by adding `skillGraphTopology` to `session_bootstrap`, including total skills, edge count, family distribution, hub skills, staleness, and validation in the structured result plus payload section. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:35`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:47`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:278`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:485`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:543`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:154`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:189`, targeted vitest `tests/session-bootstrap.vitest.ts` passed 2/2.
- [x] T012 [P] [P1] CF-258: [F001] Native-path advisor brief hardcodes the second score as 0.00 _(dimension: correctness)_ Closed by rendering `top.uncertainty` in the native bridge and adding a regression that rejects the literal hardcode. Evidence: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:48`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:51`, targeted vitest `skill-advisor/tests/compat/plugin-bridge.vitest.ts` passed 4/4.
- [x] T013 [P] [P2] CF-187: [F-006] Skill graph validation rules are duplicated across database, status, validate, and compiler paths _(dimension: maintainability)_ Triaged and deferred: P2 maintainability consolidation is outside this P0/P1 implementation slice and should be remediated in a validation-rule unification packet.
- [x] T014 [P] [P2] CF-261: [F002] Status reports runtime ready before any bridge/probe validation _(dimension: correctness)_ Triaged and deferred: P2 plugin readiness semantics should be handled with the bridge/probe validation follow-up so status output changes land atomically.
- [x] T015 [P] [P2] CF-266: [F009] Bridge duplicates advisor rendering/sanitization logic for the native path _(dimension: maintainability)_ Triaged and deferred: P2 renderer deduplication remains valid follow-up after CF-258's correctness patch.
- [x] T016 [P] [P2] CF-273: [F006] Live wrapper only observes exact Read tool names, so runtime aliases can silently evade telemetry. _(dimension: correctness)_ Triaged and deferred: P2 live-wrapper alias coverage is outside the skill-advisor packaging P1 code paths touched here.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation. Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/007-skill-advisor-packaging-and-graph --strict --no-recursive` exited 0 with `RESULT: PASSED`.
- [x] T901 [P1] Update graph metadata after implementation. Evidence: `graph-metadata.json` status/key files updated for closeout.
- [x] T902 [P1] Add implementation summary closeout evidence. Evidence: `implementation-summary.md` created for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
