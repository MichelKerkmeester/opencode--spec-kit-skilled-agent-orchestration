---
title: "221 -- Shared-memory admin-identity governance"
description: "This scenario validates Shared-memory admin-identity governance for `221`. It focuses on confirming shared-space admin mutations bind to one configured admin identity, reject ambiguous hints or configuration, and return the resolved admin subject."
---

# 221 -- Shared-memory admin-identity governance

## 1. OVERVIEW

This scenario validates Shared-memory admin-identity governance for `221`. It focuses on confirming shared-space admin mutations bind to one configured admin identity, reject ambiguous hints or configuration, and return the resolved admin subject.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `221` and confirm the expected signals without contradicting evidence.

- Objective: confirming shared-space admin mutations bind to one configured admin identity, reject ambiguous hints or configuration, and return the resolved admin subject
- Prompt: `Validate shared-memory admin identity governance for shared-space mutations. Prove that matching configured-admin hints succeed, ambiguous actor hints are rejected, mismatched hints fail authorization, and missing or dual admin env configuration fails closed with the documented reason codes.`
- Expected signals: matching `actorUserId` with a single configured admin succeeds and returns the resolved subject; dual actor hints are rejected as ambiguous; mismatched hints fail with `shared_memory_admin_identity_mismatch`; dual admin env vars fail with `shared_memory_admin_ambiguous`; no configured admin fails with `shared_memory_admin_unconfigured`
- Pass/fail: PASS if the mutation path only trusts one configured admin identity, rejects ambiguous caller input or server configuration, and returns the configured admin subject on success

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 221 | Shared-memory admin-identity governance | Confirm shared-space admin mutations bind to one configured admin identity, reject ambiguous hints or configuration, and return the resolved admin subject | `Validate shared-memory admin identity governance for shared-space mutations. Prove that matching configured-admin hints succeed, ambiguous actor hints are rejected, mismatched hints fail authorization, and missing or dual admin env configuration fails closed with the documented reason codes.` | 1) Start the MCP server with only `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID=user-admin-1` configured, then call `shared_space_upsert` with `actorUserId: "user-admin-1"` and capture the resolved actor in the success payload. 2) Call `shared_space_membership_set` for the same space while sending both `actorUserId` and `actorAgentId`, and verify the request is rejected as ambiguous instead of being silently resolved. 3) Call `shared_space_upsert` or `shared_space_membership_set` with a mismatched caller hint such as `actorUserId: "user-other"` or an `actorAgentId` while the configured admin is a user, and verify `shared_memory_admin_identity_mismatch`. 4) Restart the server with both `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` and `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` set, rerun `shared_space_upsert`, and verify the request fails with `shared_memory_admin_ambiguous`. 5) Restart the server with neither admin env var set, rerun `shared_space_upsert`, and verify the request fails with `shared_memory_admin_unconfigured`. | matching `actorUserId` with a single configured admin succeeds and returns the resolved subject; dual actor hints are rejected as ambiguous; mismatched hints fail with `shared_memory_admin_identity_mismatch`; dual admin env vars fail with `shared_memory_admin_ambiguous`; no configured admin fails with `shared_memory_admin_unconfigured` | MCP tool transcripts for `shared_space_upsert` and `shared_space_membership_set`, server env configuration used for each run, and captured error payloads showing the reason codes | PASS if the mutation path only trusts one configured admin identity, rejects ambiguous caller input or server configuration, and returns the configured admin subject on success | Check `resolveAdminActor()` env resolution, confirm only one admin env var is set per success case, inspect schema validation for dual actor hints, and verify the handler is returning the documented authorization/internal error reasons |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/06-shared-memory-admin-identity-governance.md](../../feature_catalog/17--governance/06-shared-memory-admin-identity-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 221
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/221-shared-memory-admin-identity-governance.md`
