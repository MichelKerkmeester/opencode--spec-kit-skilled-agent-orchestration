---
title: "222 -- Governance audit review and rollout metrics"
description: "This scenario validates Governance audit review and rollout metrics for `222`. It focuses on confirming governance review stays scoped by default and returns matching audit, rollout, cohort, membership, and conflict summaries when filters are explicit."
---

# 222 -- Governance audit review and rollout metrics

## 1. OVERVIEW

This scenario validates Governance audit review and rollout metrics for `222`. It focuses on confirming governance review stays scoped by default and returns matching audit, rollout, cohort, membership, and conflict summaries when filters are explicit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `222` and confirm the expected signals without contradicting evidence.

- Objective: confirming governance review stays scoped by default and returns matching audit, rollout, cohort, membership, and conflict summaries when filters are explicit
- Prompt: `Validate governance audit review and rollout metrics without broad enumeration. Prove that unscoped audit review is blocked unless explicitly allowed, filtered audit review returns matching rows plus aggregate summaries, and shared-space rollout, cohort, and conflict helpers report the expected coverage totals for the seeded tenant and space.`
- Expected signals: unscoped audit review returns an empty result set unless `allowUnscoped: true`; filtered review returns rows plus `totalMatching`, `returnedRows`, `byAction`, `byDecision`, and `latestCreatedAt`; rollout metrics report total spaces, enabled or disabled rollout, kill-switch coverage, memberships, conflicts, and cohort counts; cohort summary groups spaces by cohort including uncohorted entries; conflict summary groups by strategy with counts and latest timestamps
- Pass/fail: PASS if unscoped enumeration is blocked by default and the filtered audit plus rollout summary outputs stay aligned with the same seeded governance state

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 222 | Governance audit review and rollout metrics | Confirm governance review stays scoped by default and returns matching audit, rollout, cohort, membership, and conflict summaries when filters are explicit | `Validate governance audit review and rollout metrics without broad enumeration. Prove that unscoped audit review is blocked unless explicitly allowed, filtered audit review returns matching rows plus aggregate summaries, and shared-space rollout, cohort, and conflict helpers report the expected coverage totals for the seeded tenant and space.` | 1) Seed a disposable governance database with audit rows, shared spaces, memberships, rollout cohorts, and conflict rows for at least one tenant and one target space. 2) Call `reviewGovernanceAudit(db, {})` and verify it returns no rows or summaries unless `allowUnscoped: true` is explicitly supplied. 3) Call `reviewGovernanceAudit(db, { tenantId: "tenant-a", sharedSpaceId: "space-9", limit: 10 })` and capture the returned rows plus the `totalMatching`, `returnedRows`, `byAction`, `byDecision`, and `latestCreatedAt` summary fields. 4) Call `getSharedRolloutMetrics(db, "tenant-a")` and `getSharedRolloutCohortSummary(db, "tenant-a")` and confirm the totals, rollout-enabled counts, kill-switch counts, membership totals, cohort counts, and uncohorted bucket all match the seeded state. 5) Call `getSharedConflictStrategySummary(db, "space-9")` and verify the strategy-level counts, distinct logical-key totals, and latest timestamps match the same fixture window. | unscoped audit review returns an empty result set unless `allowUnscoped: true`; filtered review returns rows plus `totalMatching`, `returnedRows`, `byAction`, `byDecision`, and `latestCreatedAt`; rollout metrics report total spaces, enabled or disabled rollout, kill-switch coverage, memberships, conflicts, and cohort counts; cohort summary groups spaces by cohort including uncohorted entries; conflict summary groups by strategy with counts and latest timestamps | saved fixture seed, captured function outputs for blocked and filtered audit review, rollout metrics output, cohort summary output, and conflict-strategy summary output | PASS if unscoped enumeration is blocked by default and the filtered audit plus rollout summary outputs stay aligned with the same seeded governance state | Inspect `reviewGovernanceAudit()` filter handling and `allowUnscoped` guard, verify the fixture rows actually share the same tenant or space filters, and confirm cohort labels plus conflict strategies were seeded consistently before comparing totals |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/07-governance-audit-review-and-rollout-metrics.md](../../feature_catalog/17--governance/07-governance-audit-review-and-rollout-metrics.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 222
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/222-governance-audit-review-and-rollout-metrics.md`
