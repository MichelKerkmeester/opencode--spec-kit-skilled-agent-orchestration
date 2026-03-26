---
title: "130 -- Lineage backfill rollback drill"
description: "This scenario validates Lineage backfill rollback drill for `130`. It focuses on Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout."
---

# 130 -- Lineage backfill rollback drill

## 1. OVERVIEW

This scenario validates Lineage backfill rollback drill for `130`. It focuses on Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `130` and confirm the expected signals without contradicting evidence.

- Objective: Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout
- Prompt: `Run the lineage backfill + rollback verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback
- Pass/fail: PASS if `memory-lineage-backfill.vitest.ts` completes with all tests passing and shows both execution and rollback evidence

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 130 | Lineage backfill rollback drill | Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout | `Run the lineage backfill + rollback verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npm test -- --run tests/memory-lineage-backfill.vitest.ts` 3) Inspect the output for dry-run counts, successful execution, zero-change rerun, and post-restore empty lineage tables | Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback | Test transcript + suite summary | PASS if `memory-lineage-backfill.vitest.ts` completes with all tests passing and shows both execution and rollback evidence | Re-run `npm test -- --run tests/memory-lineage-backfill.vitest.ts -t rollback`; inspect `lib/storage/lineage-state.ts` and `scripts/migrations/*checkpoint*.ts` if backfill or restore assertions drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 130
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/130-lineage-backfill-rollback-drill.md`
