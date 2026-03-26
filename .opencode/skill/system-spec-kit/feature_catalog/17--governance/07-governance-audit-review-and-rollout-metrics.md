---
title: "Governance audit review and rollout metrics"
description: "Governance audit review exposes filtered audit rows with aggregate summaries, while shared-memory rollout metrics report tenant, cohort, membership, kill-switch, and conflict coverage for governance operations."
---

# Governance audit review and rollout metrics

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Governance audit review and rollout metrics make governance behavior inspectable by returning filtered audit histories together with rollout, cohort, membership, and conflict summaries for shared-memory spaces.

The practical goal is operational visibility. Instead of querying raw tables by hand, maintainers can review who was allowed or denied, how many actions matched a filter, whether rollout is enabled or paused across spaces, how coverage is distributed by cohort, and which conflict-resolution strategies are showing up in collaboration flows.

---

## 2. CURRENT REALITY

`reviewGovernanceAudit()` is the primary review surface for governance decisions. It reads from `governance_audit`, applies scope-aware filters, and returns both the matching rows and a compact summary with `totalMatching`, `returnedRows`, `byAction`, `byDecision`, and `latestCreatedAt`.

The review path is intentionally protected against blind enumeration. If the caller does not provide any scope or audit filters, `reviewGovernanceAudit()` blocks the request by returning an empty result set and summary unless `allowUnscoped: true` is explicitly set. That turns broad audit enumeration into an explicit opt-in rather than a default behavior.

When filters are provided, the function supports the same governance dimensions used elsewhere in the system: `tenantId`, `userId`, `agentId`, `sessionId`, `sharedSpaceId`, plus optional `action`, `decision`, and `limit`. Rows are ordered newest-first by descending `id`, metadata is parsed back into structured JSON, and the summary is built from aggregate SQL over the same filtered window so the counts match the row scope being reviewed.

Shared-memory rollout visibility is implemented separately in `shared-spaces.ts` through aggregate reporting helpers. `getSharedRolloutMetrics()` summarizes per-tenant or global counts for total spaces, rollout-enabled spaces, rollout-disabled spaces, kill-switched spaces, total memberships, total conflicts, and the number of distinct rollout cohorts.

`getSharedRolloutCohortSummary()` adds a cohort-level view over the same shared-space state. It groups spaces by `rollout_cohort`, rolls up how many spaces exist in each cohort, how many are rollout-enabled, how many are kill-switched, and the total membership assigned across those spaces. Empty or blank cohort labels are normalized to `null`, which keeps uncohorted spaces visible as their own review bucket.

Conflict-review metrics round out the rollout surface. `getSharedConflictStrategySummary()` groups `shared_space_conflicts` by strategy and reports both total conflict rows and distinct logical keys, along with the latest timestamp for each strategy. That gives reviewers a quick read on whether spaces are mostly using append-only conflict handling or escalating into repeated `manual_merge` style outcomes.

Together, these functions provide the current governance observability layer: audit review for allow/deny/delete/conflict decisions, tenant and cohort rollout coverage for shared spaces, and conflict-strategy summaries for collaboration hot spots.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/governance/scope-governance.ts` | Lib | Implements `reviewGovernanceAudit()`, scoped audit filtering, unscoped-enumeration blocking, row parsing, and aggregate action/decision summaries |
| `mcp_server/lib/collab/shared-spaces.ts` | Lib | Implements `getSharedRolloutMetrics()`, `getSharedRolloutCohortSummary()`, and `getSharedConflictStrategySummary()` for rollout, cohort, membership, kill-switch, and conflict reporting |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-governance.vitest.ts` | Filtered governance audit review, aggregate summaries, and explicit `allowUnscoped` behavior |
| `mcp_server/tests/shared-spaces.vitest.ts` | Shared rollout metrics, cohort summaries, and conflict-strategy aggregation |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Governance audit review and rollout metrics
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of governance review and shared-space metrics helpers
