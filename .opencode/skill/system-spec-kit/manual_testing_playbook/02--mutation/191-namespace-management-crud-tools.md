---
title: "191 -- Namespace management CRUD tools"
description: "This scenario validates Namespace management CRUD tools for `191`. It focuses on Confirm shared-memory lifecycle enablement, scoped access, and membership mutations."
---

# 191 -- Namespace management CRUD tools

## 1. OVERVIEW

This scenario validates Namespace management CRUD tools for `191`. It focuses on Confirm shared-memory lifecycle enablement, scoped access, and membership mutations.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `191` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared-memory lifecycle enablement, scoped access, and membership mutations
- Prompt: `Validate shared-memory lifecycle CRUD behavior. Capture the evidence needed to prove shared_memory_enable activates the subsystem; shared_space_upsert creates or updates a space only for the configured shared-memory admin identity; shared_space_membership_set enforces deny-by-default membership with owner/editor/viewer roles; shared_memory_status returns only allowedSharedSpaceIds for the provided scope. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `shared_memory_enable` reports enabled subsystem state; first successful create auto-grants owner access to the configured admin identity; membership remains deny-by-default until explicitly granted; `shared_memory_status` echoes scope IDs and only returns allowed shared-space IDs for that scope
- Pass/fail: PASS if enablement succeeds, admin-scoped create/update works, deny-by-default membership is preserved, and scoped status results only expose explicitly allowed shared spaces

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 191 | Namespace management CRUD tools | Confirm shared-memory lifecycle enablement, scoped access, and membership mutations | `Validate shared-memory lifecycle CRUD behavior. Capture the evidence needed to prove shared_memory_enable activates the subsystem; shared_space_upsert creates or updates a space only for the configured shared-memory admin identity; shared_space_membership_set enforces deny-by-default membership with owner/editor/viewer roles; shared_memory_status returns only allowedSharedSpaceIds for the provided scope. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run `shared_memory_status({ tenantId, userId })` before enablement and capture disabled state 2) run `shared_memory_enable()` and confirm subsystem enablement plus shared-spaces bootstrap output 3) run `shared_space_upsert({ spaceId, tenantId, name, actorUserId or actorAgentId })` with the configured shared-memory admin identity and confirm first-create owner grant 4) run `shared_memory_status({ tenantId, userId })` for an unrelated scope and confirm deny-by-default with no allowed space IDs 5) run `shared_space_membership_set({ spaceId, tenantId, subjectType, subjectId, role, actorUserId or actorAgentId })` to grant access 6) rerun `shared_memory_status({ tenantId, userId or agentId })` for the granted subject and confirm the target `spaceId` appears in `allowedSharedSpaceIds` 7) rerun `shared_space_upsert(...)` as an update for the same space and confirm it succeeds only when the configured admin identity already owns the space | `shared_memory_enable` reports enabled subsystem state; first successful create auto-grants owner access to the configured admin identity; membership remains deny-by-default until explicitly granted; `shared_memory_status` echoes scope IDs and only returns allowed shared-space IDs for that scope | Enable/status outputs + create/update mutation results + membership mutation result + before/after scoped status comparison | PASS if enablement succeeds, admin-scoped create/update works, deny-by-default membership is preserved, and scoped status results only expose explicitly allowed shared spaces | Verify `shared_memory_enable` completed infrastructure setup; confirm only one actor hint is supplied and it matches the configured admin identity; inspect shared-space ownership state before updates; confirm status checks use the intended tenant/user/agent scope |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/07-namespace-management-crud-tools.md](../../feature_catalog/02--mutation/07-namespace-management-crud-tools.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 191
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/191-namespace-management-crud-tools.md`
