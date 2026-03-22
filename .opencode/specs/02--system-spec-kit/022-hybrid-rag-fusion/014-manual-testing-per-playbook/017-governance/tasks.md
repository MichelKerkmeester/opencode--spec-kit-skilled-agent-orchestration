---
title: "Tasks: manual-testing-per-playbook governance phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "governance tasks"
  - "phase 017 tasks"
  - "governance test execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook governance phase

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Open and verify playbook source: `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T002 Load review protocol from playbook §4
- [ ] T003 Confirm feature catalog links for all 5 governance scenarios: `../../feature_catalog/17--governance/`
- [ ] T004 Verify MCP runtime access for `memory_save`, `memory_search`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, `shared_space_membership_set`
- [ ] T005 Record baseline DB config state (shared_memory_enabled value, existing governance_audit row count)
- [ ] T006 Prepare disposable sandbox tenant ID and user/agent IDs for 122 scoped-ingest tests
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Execute 063 — Feature flag governance: enumerate all SPECKIT_ flags, verify age/limits/review cadence against B8 targets, record compliance gaps
- [ ] T008 Execute 064 — Feature flag sunset audit: compare documented dispositions vs. code, verify deprecated/no-op states, record deltas
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Execute 122 step 1 — Attempt memory_save() with tenantId/sessionId but missing provenance fields; capture rejection response
- [ ] T010 Execute 122 step 2 — Save with full {tenantId, userId|agentId, sessionId, provenanceSource, provenanceActor} metadata; capture success response
- [ ] T011 Execute 122 step 3 — Query with matching scope; verify hit appears
- [ ] T012 Execute 122 step 4 — Query with mismatched user/agent or tenant; verify hit is filtered out
- [ ] T013 Execute 122 step 5 — Review governance_audit rows for allow and deny outcomes
- [ ] T014 Execute 123 step 1 — Create space with shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true })
- [ ] T015 Execute 123 step 2 — Call shared_memory_status() for non-member; verify no accessible spaces
- [ ] T016 Execute 123 step 3 — Attempt shared-space save/search as non-member; verify rejection/filtering
- [ ] T017 Execute 123 step 4 — Grant membership with shared_space_membership_set()
- [ ] T018 Execute 123 step 5 — Verify shared access succeeds
- [ ] T019 Execute 123 step 6 — Flip killSwitch:true; verify access is blocked again
- [ ] T020 Execute 148 step 1 — Start MCP without env var; call shared_memory_status(); verify enabled: false
- [ ] T021 Execute 148 step 2 — Call shared_memory_enable(); verify enabled: true, alreadyEnabled: false, readmeCreated: true
- [ ] T022 Execute 148 step 3 — Call shared_memory_enable() again; verify alreadyEnabled: true (idempotent)
- [ ] T023 Execute 148 step 4 — Verify shared-spaces/README.md exists on disk
- [ ] T024 Execute 148 step 5 — Restart MCP (no env var); call shared_memory_status(); verify enabled: true (DB persistence)
- [ ] T025 Execute 148 step 6 — Set SPECKIT_MEMORY_SHARED_MEMORY=true env var; call shared_memory_status() without DB; verify enabled: true (env override)
- [ ] T026 Execute 148 step 7 — Run /memory:shared with feature disabled; verify first-run setup prompt appears
- [ ] T027 Capture evidence bundle for 063: prompt, command sequence, raw output, reviewer notes, verdict (PASS/PARTIAL/FAIL)
- [ ] T028 Capture evidence bundle for 064: prompt, command sequence, raw output, reviewer notes, verdict (PASS/PARTIAL/FAIL)
- [ ] T029 Capture evidence bundle for 122: all 5 steps with raw output, governance_audit rows, verdict (PASS/PARTIAL/FAIL)
- [ ] T030 Capture evidence bundle for 123: all 6 steps with raw output, DB state snapshots, verdict (PASS/PARTIAL/FAIL)
- [ ] T031 Capture evidence bundle for 148: all 7 steps with raw output, disk verification, restart confirmation, verdict (PASS/PARTIAL/FAIL)
- [ ] T032 Restore DB config state (reset shared_memory_enabled, remove test-created shared_spaces and shared_space_members rows, delete sandbox scoped memory records)
- [ ] T033 Report phase coverage as 5/5 scenarios with linked evidence
- [ ] T034 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 5 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [ ] Phase coverage reported as 5/5
- [ ] DB state restored to pre-test baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
