---
title: "Verification Checklist: manual-testing-per-playbook feature-flag-reference phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 019 feature-flag-reference manual test packet covering EX-028 through EX-034 and scenario 125."
trigger_phrases:
  - "feature flag reference checklist"
  - "phase 019 verification"
  - "flag catalog test quality gates"
  - "SPECKIT flag audit checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook feature-flag-reference phase

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

- [ ] CHK-001 [P0] Playbook source and review protocol loaded before execution begins
- [ ] CHK-002 [P0] All 8 scenario prompts and command sequences verified against `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] CHK-003 [P0] MCP runtime confirmed operational for `memory_search` and `memory_context`
- [ ] CHK-004 [P1] Flag documentation indexed or feature catalog triage path documented
- [ ] CHK-005 [P1] Dist build at `capability-flags.js` confirmed current before 125 runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] All 8 scenarios have a PASS, PARTIAL, or FAIL verdict with explicit rationale
- [ ] CHK-021 [P0] 125 step 1 confirms `phase:"shared-rollout"` with `capabilities.graphUnified:true` (live flag did not alter roadmap)
- [ ] CHK-022 [P0] 125 step 2 confirms `phase:"graph"` with `capabilities.graphUnified:false` (SPECKIT_HYDRA_* prefix opts out)
- [ ] CHK-023 [P1] EX-028 through EX-034 zero-result cases have EVIDENCE GAP documented with feature catalog triage applied
- [ ] CHK-024 [P1] No fabricated or inferred evidence; all outputs captured verbatim or triaged via feature catalog cross-reference per playbook instructions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] EX-028 Flag catalog verification executed and evidence captured [Evidence: _pending_]
- [ ] CHK-011 [P0] EX-029 Session policy audit executed and evidence captured [Evidence: _pending_]
- [ ] CHK-012 [P0] EX-030 MCP limits audit executed and evidence captured [Evidence: _pending_]
- [ ] CHK-013 [P0] EX-031 Storage precedence check executed and evidence captured [Evidence: _pending_]
- [ ] CHK-014 [P0] EX-032 Provider selection audit executed and evidence captured [Evidence: _pending_]
- [ ] CHK-015 [P0] EX-033 Observability toggle check executed and evidence captured [Evidence: _pending_]
- [ ] CHK-016 [P0] EX-034 Branch metadata source audit executed and evidence captured [Evidence: _pending_]
- [ ] CHK-017 [P0] 125 Hydra snapshot test: both node invocations executed and JSON outputs captured [Evidence: _pending_]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No real API keys (COHERE_API_KEY, OPENAI_API_KEY, VOYAGE_API_KEY) in evidence artifacts
- [ ] CHK-031 [P0] SPECKIT_HYDRA_* env vars unset after 125 completes
- [ ] CHK-032 [P1] EX-029 and EX-032 credential env var names referenced only by name, not value
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Phase coverage reported as 8/8 scenarios with verdict summary
- [ ] CHK-041 [P1] `implementation-summary.md` updated with execution results and verdict table
- [ ] CHK-042 [P2] Findings saved to `memory/` via generate-context.js
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Evidence artifacts stored in `scratch/` only during execution
- [ ] CHK-051 [P2] `scratch/` cleaned of intermediate drafts after completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 7 | 0/7 |
| P2 Items | 3 | 0/3 |

**Verification Date**: _Not Started_
<!-- /ANCHOR:summary -->

---
