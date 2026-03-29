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

For race-fix coverage, operators also run a concurrent-create scenario against the same `space_id` and verify that only the request whose insert actually creates the row reports owner bootstrap. The final database state must contain exactly one `owner` membership row for that shared space.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 123 | Shared-space deny-by-default rollout (Phase 6) | Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls | `Validate Phase 6 shared-memory rollout controls. Capture the evidence needed to prove Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create space with `shared_space_upsert({ spaceId, tenantId, name, rolloutEnabled:true, actorUserId:"owner-user-1" })` — exactly one actor identity (actorUserId or actorAgentId) is required; first create auto-grants owner access to the actor 2) Call `shared_memory_status({ userId:"non-member-user-2" })` for a non-member and verify no accessible spaces 3) Attempt shared-space save/search as non-member-user-2 and verify rejection/filtering 4) Grant membership with `shared_space_membership_set({ spaceId, tenantId, subjectType:"user", subjectId:"non-member-user-2", role:"editor", actorUserId:"owner-user-1" })` — actor must be an existing owner, exactly one actor identity required 5) Call `shared_memory_status({ userId:"non-member-user-2" })` and verify shared access succeeds 6) Flip kill switch with `shared_space_upsert({ spaceId, tenantId, name, killSwitch:true, actorUserId:"owner-user-1" })` and verify access is blocked again | Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members | Tool outputs for space creation (with actor identity), membership update (with actor identity), status checks, and shared save/search attempts across all three states; verify exactly one actor identity (actorUserId or actorAgentId) is passed on every upsert and membership call | PASS: Non-member denied, member allowed, kill switch blocks again, actor identity required on all mutations; FAIL: Shared access works without membership, kill switch does not stop access, or mutations succeed without actor identity | Verify membership rows in `shared_space_members` → Inspect rollout_enabled and kill_switch flags on `shared_spaces` → Confirm shared-space access path reuses governance checks → Verify actor identity is enforced on `shared_space_upsert` and `shared_space_membership_set` |
| 123 | Shared-space deny-by-default rollout (Phase 6) | Confirm concurrent create attempts for the same space bootstrap exactly one owner | `Validate Phase 6 shared-space create race handling. Capture the evidence needed to prove Exactly one concurrent create for the same space_id reports created plus owner bootstrap; the losing request is treated as an update; only one owner row exists after both requests finish. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Choose a fresh `spaceId` and one valid creator/admin identity for the environment 2) From two terminals or sessions, start `shared_space_upsert({ spaceId, tenantId, name:"Race A", rolloutEnabled:true, actorUserId:"owner-user-1" })` and `shared_space_upsert({ spaceId, tenantId, name:"Race B", rolloutEnabled:true, actorUserId:"owner-user-1" })` as close together as possible 3) Capture both responses and verify only one returns `created:true` with `ownerBootstrap:true`, while the other returns `created:false` with `ownerBootstrap:false` and still succeeds as an update 4) Query `shared_space_members` for that `spaceId` and verify exactly one row has `role = 'owner'` and `subject_id = "owner-user-1"` 5) Query `shared_spaces` for that `spaceId` and verify the space row exists exactly once with a valid final name/flags from the winning create or later update | Exactly one concurrent create reports `created:true` and `ownerBootstrap:true`; the losing create is treated as an update; the final membership state contains exactly one owner row for the space | Both `shared_space_upsert` responses, timestamped launch evidence showing the requests overlapped, `shared_space_members` query output for owner count, and final `shared_spaces` row output for the raced `spaceId` | PASS: Exactly one request bootstraps owner, the second request succeeds without a second owner bootstrap, and owner count remains 1; FAIL: Both requests claim creation, both bootstrap owner, or owner count differs from 1 | Re-check whether the requests truly overlapped → Inspect `handleSharedSpaceUpsert()` response payloads for `created` and `ownerBootstrap` → Query `shared_space_members` for duplicate owner rows → Inspect `shared_spaces` row history and final flags |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 123
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/123-shared-space-deny-by-default-rollout-phase-6.md`
