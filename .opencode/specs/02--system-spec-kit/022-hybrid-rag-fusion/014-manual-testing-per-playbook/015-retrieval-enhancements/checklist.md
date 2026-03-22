---
title: "Verification Checklist: Manual Testing — Retrieval Enhancements (Phase 015)"
description: "Verification checklist for Phase 015 retrieval enhancements manual test execution. One P0 item per scenario, all unchecked. 11 scenarios: 055, 056, 057, 058, 059, 060, 077, 093, 094, 096, 145."
trigger_phrases:
  - "retrieval enhancements checklist"
  - "phase 015 verification checklist"
  - "manual testing retrieval enhancements checks"
  - "055 056 057 retrieval checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Retrieval Enhancements (Phase 015)

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Playbook loaded — rows for all 11 scenario IDs (055, 056, 057, 058, 059, 060, 077, 093, 094, 096, 145) are accessible
- [ ] CHK-002 [P0] Review protocol loaded — PASS/FAIL/SKIP verdict rules available before any execution
- [ ] CHK-003 [P1] Feature catalog links confirmed for all 11 scenarios in `../../feature_catalog/15--retrieval-enhancements/`
- [ ] CHK-004 [P1] Baseline env var state recorded (SPECKIT_RESPONSE_TRACE, SPECKIT_CONTEXT_HEADERS, SPECKIT_CONSOLIDATION, SPECKIT_ENTITY_LINKING, SPECKIT_MEMORY_SUMMARIES)
- [ ] CHK-005 [P1] Disposable sandbox prepared for stateful scenarios 058 and 060
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Scenario 055 executed and verdicted — Dual-scope memory auto-surface (TM-05)
- [ ] CHK-011 [P0] Scenario 056 executed and verdicted — Constitutional memory as expert knowledge injection (PI-A4)
- [ ] CHK-012 [P0] Scenario 057 executed and verdicted — Spec folder hierarchy as retrieval structure (S4)
- [ ] CHK-013 [P0] Scenario 058 executed and verdicted in sandbox — Lightweight consolidation (N3-lite)
- [ ] CHK-014 [P0] Scenario 059 executed and verdicted — Memory summary search channel (R8)
- [ ] CHK-015 [P0] Scenario 060 executed and verdicted in sandbox — Cross-document entity linking (S5)
- [ ] CHK-016 [P0] Scenario 077 executed and verdicted — Tier-2 fallback channel forcing
- [ ] CHK-017 [P0] Scenario 093 executed and verdicted — Implemented: memory summary generation (R8)
- [ ] CHK-018 [P0] Scenario 094 executed and verdicted — Implemented: cross-document entity linking (S5)
- [ ] CHK-019 [P0] Scenario 096 executed and verdicted — Provenance-rich response envelopes (P0-2)
- [ ] CHK-020 [P0] Scenario 145 executed and verdicted — Contextual tree injection (P1-4)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All 11 scenarios have a verdict — no "Not Started" entries remain
- [ ] CHK-031 [P0] Each verdict has an evidence note (transcript snippet, command output, or explicit skip reason)
- [ ] CHK-032 [P0] All FAIL verdicts have defect notes capturing observed vs expected behaviour
- [ ] CHK-033 [P1] Stateful scenarios (058, 060) have sandbox isolation evidence recorded
- [ ] CHK-034 [P1] Scenario 096 evidence covers all four sub-steps: includeTrace=true, no includeTrace with env unset, env override, and all 7 score sub-fields verified
- [ ] CHK-035 [P1] Scenario 145 evidence covers both flag states: header-injected ([parent > child — desc] format, truncated at 100 chars) and header-suppressed
- [ ] CHK-036 [P1] Any SKIP verdicts have explicit reasons (scenario file not found, sandbox not available, corpus threshold not met, etc.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets or credentials added to phase 015 documents
- [ ] CHK-041 [P0] Stateful scenario execution (058, 060) confined to sandbox — no production environment modified
- [ ] CHK-042 [P1] Env var state restored to baseline after scenarios 096 and 145 complete
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md, and checklist.md are synchronised — no contradictions in scenario names or IDs across documents
- [ ] CHK-051 [P2] implementation-summary.md updated with final verdict summary after all scenarios complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Only the expected phase documents exist in `015-retrieval-enhancements/` — no stray temp files at folder root
- [ ] CHK-061 [P2] Evidence files placed in `scratch/` subdirectory only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 8 | 0/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
