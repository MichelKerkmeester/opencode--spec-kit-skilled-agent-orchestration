---
title: "NEW-123 -- Shared-space deny-by-default rollout (Phase 6)"
description: "This scenario validates Shared-space deny-by-default rollout (Phase 6) for `NEW-123`. It focuses on Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls."
---

# NEW-123 -- Shared-space deny-by-default rollout (Phase 6)

## 1. OVERVIEW

This scenario validates Shared-space deny-by-default rollout (Phase 6) for `NEW-123`. It focuses on Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-123` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls
- Prompt: `Validate Phase 6 shared-memory rollout controls.`
- Expected signals: Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members
- Pass/fail: PASS: Non-member denied, member allowed, kill switch blocks again; FAIL: Shared access works without membership or kill switch does not stop access

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-123 | Shared-space deny-by-default rollout (Phase 6) | Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls | `Validate Phase 6 shared-memory rollout controls.` | 1) Create space with `shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true })` 2) Call `shared_memory_status()` for a non-member and verify no accessible spaces 3) Attempt shared-space save/search as a non-member and verify rejection/filtering 4) Grant membership with `shared_space_membership_set()` 5) Verify shared access succeeds 6) Flip `killSwitch:true` and verify access is blocked again | Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members | Tool outputs for space creation, membership update, status checks, and shared save/search attempts across all three states | PASS: Non-member denied, member allowed, kill switch blocks again; FAIL: Shared access works without membership or kill switch does not stop access | Verify membership rows in `shared_space_members` → Inspect rollout_enabled and kill_switch flags on `shared_spaces` → Confirm shared-space access path reuses governance checks |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-123
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/123-shared-space-deny-by-default-rollout-phase-6.md`
