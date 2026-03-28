---
title: "148 -- Shared-memory disabled-by-default and first-run setup"
description: "This scenario validates Shared-memory disabled-by-default and first-run setup for `148`. It focuses on Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent."
---

# 148 -- Shared-memory disabled-by-default and first-run setup

## 1. OVERVIEW

This scenario validates Shared-memory disabled-by-default and first-run setup for `148`. It focuses on Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `148` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent
- Prompt: `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared_space_upsert updates preserve existing rollout cohort and metadata; and /memory:manage shared command shows setup prompt when disabled. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared-space updates preserve existing rollout cohort and metadata; /memory:manage shared command shows setup prompt when disabled
- Pass/fail: PASS: Default off, enable persists, idempotent, README created, restart persistence, env override works, partial updates preserve stored space metadata, and command gate triggers; FAIL: Feature enabled without setup, enable not idempotent, README missing, persistence lost on restart, env override ignored, metadata wiped on partial update, or command gate skipped

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 148 | Shared-memory disabled-by-default and first-run setup | Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent | `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared_space_upsert updates preserve existing rollout cohort and metadata; and /memory:manage shared command shows setup prompt when disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start MCP server without env var → call `shared_memory_status()` → verify `enabled: false` 2) Call `shared_memory_enable()` → verify `enabled: true, alreadyEnabled: false, readmeCreated: true` 3) Call `shared_memory_enable()` again → verify `alreadyEnabled: true` (idempotent) 4) Verify `shared-spaces/README.md` exists on disk 5) Restart MCP server (no env var) → call `shared_memory_status()` → verify `enabled: true` (DB persistence) 6) Set `SPECKIT_MEMORY_SHARED_MEMORY=true` env var → call `shared_memory_status()` without DB → verify `enabled: true` (env override) 7) Create a shared space with `rolloutCohort` and `metadata`, then perform a partial `shared_space_upsert()` that changes another field only and verify the existing cohort plus metadata remain intact 8) Run `/memory:manage shared` with feature disabled → verify first-run setup prompt appears | Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared-space updates preserve existing rollout cohort and metadata; /memory:manage shared command shows setup prompt when disabled | Tool outputs for status (disabled state), enable (first run + idempotent), status (enabled state after restart), env override verification, README existence check, partial-update preservation proof, command setup prompt | PASS: Default off, enable persists, idempotent, README created, restart persistence, env override works, partial updates preserve stored metadata, and command gate triggers; FAIL: Feature enabled without setup, enable not idempotent, README missing, persistence lost on restart, env override ignored, metadata wiped on partial update, or command gate skipped | Verify `config` table has `shared_memory_enabled=true` row → Check `isSharedMemoryEnabled()` two-tier resolution → Inspect `handleSharedMemoryEnable()` idempotency check → Verify `createSharedSpacesReadme()` skip-if-exists logic → Confirm `/memory:manage shared` Section 0 enablement gate → Inspect `shared_space_upsert()` COALESCE behavior if cohort or metadata disappear |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 148
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md`
