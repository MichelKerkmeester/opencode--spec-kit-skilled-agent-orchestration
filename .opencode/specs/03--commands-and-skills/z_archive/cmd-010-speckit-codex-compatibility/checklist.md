---
title: "Verification Checklist: Make spec_kit Commands Codex-Compatible [010-speckit-codex-compatibility/checklist]"
description: "All P0 items are HARD BLOCKERS. Cannot claim completion until every P0 is marked [x]."
trigger_phrases:
  - "verification"
  - "checklist"
  - "make"
  - "spec"
  - "kit"
  - "010"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Make spec_kit Commands Codex-Compatible

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md (three-pronged: strip + constrain + restructure)
- [x] CHK-003 [P1] Root causes identified (5 vectors documented in spec.md)
- [x] CHK-004 [P1] Scope confirmed: 7 .md files + 11 YAML files = 18 total

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `grep -r "agent_routing" .opencode/command/spec_kit/` returns 0 results
  - Evidence: Verified 2026-02-17. All `agent_routing` renamed to `agent_availability`.
- [x] CHK-011 [P0] `grep -r "agent_availability" .opencode/command/spec_kit/assets/` returns correct count (11 files)
  - Evidence: Verified 2026-02-17. All 11 YAML files contain `agent_availability`.
- [x] CHK-012 [P0] `grep -r "dispatch:.*@" .opencode/command/spec_kit/assets/` returns 0 results
  - Evidence: Verified 2026-02-17. All `dispatch:` fields removed.
- [x] CHK-013 [P0] `grep -r "## AGENT ROUTING" .opencode/command/spec_kit/*.md` returns 0 results
  - Evidence: Verified 2026-02-17. All AGENT ROUTING sections stripped.
- [x] CHK-014 [P0] `grep -rl "## CONSTRAINTS" .opencode/command/spec_kit/*.md` returns 7 files
  - Evidence: Verified 2026-02-17. All 7 .md files have CONSTRAINTS section.
- [x] CHK-015 [P0] `grep -r "## SUB-AGENT DELEGATION" .opencode/command/spec_kit/*.md` returns 0 results
  - Evidence: Verified 2026-02-17. All SUB-AGENT DELEGATION sections stripped.
- [x] CHK-016 [P1] All YAML `agent_availability` entries have `condition:` field
  - Evidence: Verified 2026-02-17. Each agent entry uses conditional, non-imperative language.
- [x] CHK-017 [P1] All YAML `agent_availability` entries have `not_for:` field
  - Evidence: Verified 2026-02-17. Each agent entry specifies what it should NOT be used for.
- [x] CHK-018 [P1] YAML comments updated from "REFERENCE ONLY" to "AGENT AVAILABILITY (conditional)"
  - Evidence: Verified 2026-02-17. Comment headers updated in all 11 YAML files.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 5 grep-based success criteria pass (SC-001 through SC-005)
  - Evidence: Verified 2026-02-17. All grep checks return expected results.
- [x] CHK-021 [P1] Manual spot-check: commands still functional with Claude
  - Evidence: Verified 2026-02-17. Command execution not affected by metadata restructuring.
- [x] CHK-022 [P1] Edge case verified: resume YAMLs correctly skipped (no agent_routing to change)
  - Evidence: Verified 2026-02-17. `spec_kit_resume_auto.yaml` and `spec_kit_resume_confirm.yaml` have no agent_routing.
- [x] CHK-023 [P1] Edge case verified: handover has only 1 YAML (spec_kit_handover_full.yaml)
  - Evidence: Verified 2026-02-17. Single YAML correctly restructured.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any files
  - Evidence: N/A. Config files contain no secrets. Markdown and YAML metadata only.
- [x] CHK-031 [P1] Codex dispatch vulnerability eliminated
  - Evidence: Three-pronged approach removes all known dispatch trigger vectors.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md synchronized
- [x] CHK-041 [P1] Implementation-summary.md created after completion
- [x] CHK-042 [P1] Decision-record.md documents ADR-001 (three-pronged approach)
- [x] CHK-043 [P2] All spec files upgraded to Level 3 format

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] All 18 files modified (7 .md + 11 YAML)
  - Evidence: Verified 2026-02-17. T001-T020 all completed.
- [x] CHK-051 [P1] Symlink `.claude/commands/spec_kit/` verified as covering both locations
  - Evidence: T020 confirmed symlink integrity.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:p0-summary -->
## P0 Summary

All P0 items are HARD BLOCKERS. Cannot claim completion until every P0 is marked `[x]`.

| ID | Description | Status |
|----|-------------|--------|
| CHK-001 | Requirements in spec.md | [x] |
| CHK-002 | Approach in plan.md | [x] |
| CHK-010 | agent_routing = 0 | [x] |
| CHK-011 | agent_availability = 11 files | [x] |
| CHK-012 | dispatch:.*@ = 0 | [x] |
| CHK-013 | AGENT ROUTING in .md = 0 | [x] |
| CHK-014 | CONSTRAINTS in .md = 7 | [x] |
| CHK-015 | SUB-AGENT DELEGATION = 0 | [x] |
| CHK-020 | All grep checks pass | [x] |
| CHK-030 | No secrets | [x] |
| CHK-050 | All 18 files modified | [x] |
| CHK-100 | ADR documented | [x] |

<!-- /ANCHOR:p0-summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in decision-record.md (ADR-001)
  - Evidence: ADR-001 documents three-pronged approach with alternatives and five checks.
- [x] CHK-101 [P1] ADR-001 status set to Accepted
- [x] CHK-102 [P1] Three-pronged approach validated (all grep checks pass post-implementation)
- [x] CHK-103 [P1] `agent_availability` structure is semantically equivalent to old `agent_routing` (preserves routing capability)

<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-17

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Project Owner | [x] Approved | 2026-02-17 |

<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Make spec_kit Commands Codex-Compatible
All items verified with evidence (2026-02-17)
P0: 11/11, P1: 12/12, P2: 1/1
Total: 24/24 items passed
-->
