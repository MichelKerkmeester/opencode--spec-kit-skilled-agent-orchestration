---
title: "Verification Checklist: manual-testing-per-playbook governance phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 017 governance manual test packet covering 063, 064, 122, 123, and 148."
trigger_phrases:
  - "governance verification checklist"
  - "phase 017 checklist"
  - "feature flag governance checklist"
  - "shared memory governance testing"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook governance phase

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
- [ ] CHK-002 [P0] All 5 scenario prompts and command sequences verified against `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] CHK-003 [P1] MCP runtime confirmed operational for all required governance tools
- [ ] CHK-004 [P1] Baseline DB config state recorded (shared_memory_enabled, governance_audit row count)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] All 5 scenarios have a PASS, PARTIAL, or FAIL verdict with explicit rationale
- [ ] CHK-021 [P0] Evidence for 122 includes rejection response (step 1), success response (step 2), scope isolation confirmation (steps 3-4), and governance_audit rows (step 5)
- [ ] CHK-022 [P0] Evidence for 123 includes non-member denial (step 2), member access (step 5), and kill-switch block (step 6)
- [ ] CHK-023 [P0] Evidence for 148 includes default-off (step 1), enable response (step 2), idempotent call (step 3), README on disk (step 4), DB persistence (step 5)
- [ ] CHK-024 [P1] No fabricated or inferred evidence; all outputs are captured verbatim from tool calls or code audit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] 063 Feature flag governance executed with evidence captured [Evidence: _pending_]
- [ ] CHK-011 [P0] 064 Feature flag sunset audit executed with evidence captured [Evidence: _pending_]
- [ ] CHK-012 [P0] 122 Governed ingest and scope isolation — all 5 steps executed with evidence captured [Evidence: _pending_]
- [ ] CHK-013 [P0] 123 Shared-space deny-by-default rollout — all 6 steps executed with evidence captured [Evidence: _pending_]
- [ ] CHK-014 [P0] 148 Shared-memory disabled-by-default and first-run setup — all 7 steps executed with evidence captured [Evidence: _pending_]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Disposable sandbox tenant/user IDs used for 122 (no production memory contamination)
- [ ] CHK-031 [P0] DB config state (shared_memory_enabled, shared_spaces, shared_space_members rows) restored to pre-test baseline after 123 and 148
- [ ] CHK-032 [P1] 122 scoped memory records deleted or confirmed isolated to sandbox tenant IDs
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Phase coverage reported as 5/5 scenarios with verdict summary
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
| P0 Items | 11 | 0/11 |
| P1 Items | 6 | 0/6 |
| P2 Items | 3 | 0/3 |

**Verification Date**: _Not Started_
<!-- /ANCHOR:summary -->

---
