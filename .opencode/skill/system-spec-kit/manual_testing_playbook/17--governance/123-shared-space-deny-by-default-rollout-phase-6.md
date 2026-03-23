---
title: "123 -- Shared-space deny-by-default rollout (Phase 6)"
description: "This scenario validates Shared-space deny-by-default rollout (Phase 6) for `123`. It focuses on Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls."
---

# 123 -- Shared-space deny-by-default rollout (Phase 6)

## 1. OVERVIEW

This scenario validates Shared-space deny-by-default rollout (Phase 6) for `123`. It focuses on Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `123` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls
- Prompt: `Validate Phase 6 shared-memory rollout controls. Capture the evidence needed to prove Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members
- Pass/fail: PASS: Non-member denied, member allowed, kill switch blocks again; FAIL: Shared access works without membership or kill switch does not stop access

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 123 | Shared-space deny-by-default rollout (Phase 6) | Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls | `Validate Phase 6 shared-memory rollout controls. Capture the evidence needed to prove Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create space with `shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true, actorUserId:"owner-user-1" })` — exactly one actor identity (actorUserId or actorAgentId) is required; first create auto-grants owner access to the actor 2) Call `shared_memory_status({ userId:"non-member-user-2" })` for a non-member and verify no accessible spaces 3) Attempt shared-space save/search as non-member-user-2 and verify rejection/filtering 4) Grant membership with `shared_space_membership_set({ spaceId, tenantId, subjectType:"user", subjectId:"non-member-user-2", role:"editor", actorUserId:"owner-user-1" })` — actor must be an existing owner, exactly one actor identity required 5) Call `shared_memory_status({ userId:"non-member-user-2" })` and verify shared access succeeds 6) Flip kill switch with `shared_space_upsert({ spaceId, tenantId, name, killSwitch:true, actorUserId:"owner-user-1" })` and verify access is blocked again | Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members | Tool outputs for space creation (with actor identity), membership update (with actor identity), status checks, and shared save/search attempts across all three states; verify exactly one actor identity (actorUserId or actorAgentId) is passed on every upsert and membership call | PASS: Non-member denied, member allowed, kill switch blocks again, actor identity required on all mutations; FAIL: Shared access works without membership, kill switch does not stop access, or mutations succeed without actor identity | Verify membership rows in `shared_space_members` → Inspect rollout_enabled and kill_switch flags on `shared_spaces` → Confirm shared-space access path reuses governance checks → Verify actor identity is enforced on `shared_space_upsert` and `shared_space_membership_set` |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 123
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/123-shared-space-deny-by-default-rollout-phase-6.md`
