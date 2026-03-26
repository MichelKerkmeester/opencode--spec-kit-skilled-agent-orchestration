---
title: "Shadow scoring with holdout evaluation"
description: "Shadow scoring compares would-have-changed rankings against live rankings on a deterministic holdout slice of queries, tracking weekly improvement cycles and gating promotion of learned signals to production via the SPECKIT_SHADOW_FEEDBACK flag."
---

# Shadow scoring with holdout evaluation

## 1. OVERVIEW

Shadow scoring compares would-have-changed rankings against live rankings on a deterministic holdout slice of queries, tracking weekly improvement cycles and gating promotion of learned signals to production via the `SPECKIT_SHADOW_FEEDBACK` flag.

Before switching to new ranking logic in production, you want proof that it actually improves results. This feature runs the new ranking in parallel on a random 20% of queries, compares what would have changed, and keeps a weekly scorecard. Only after two consecutive weeks of measurable improvement does it recommend promotion. Nothing changes for users until an explicit decision is made — it is purely observational.

---

## 2. CURRENT REALITY

The shadow scoring module computes per-result rank deltas between live and shadow rankings, producing Kendall tau correlation, NDCG delta, and MRR delta metrics. Holdout queries are deterministically selected via a seed (default 20% holdout). Results are logged to the `shadow_scoring_log` table for auditability, with per-query comparison results and cycle-level aggregation stored in `shadow_cycle_results`.

Promotion requires 2+ consecutive weeks of stable improvement (`PROMOTION_THRESHOLD_WEEKS = 2`). The evaluation window is 7 days (`EVALUATION_WINDOW_MS`). The promotion gate returns one of three recommendations: `promote`, `wait`, or `rollback`.

Enabled by default (graduated). Set `SPECKIT_SHADOW_FEEDBACK=false` to disable. Key invariants: shadow-only (no live ranking columns are mutated), holdout queries are deterministically selected via seed, all results logged for auditability.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/feedback/shadow-scoring.ts` | Lib | Rank comparison, Kendall tau, NDCG/MRR deltas, cycle aggregation, promotion gate |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Lib | Production runtime scheduler that replays holdout queries weekly, wired into `context-server.ts` |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isShadowFeedbackEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shadow-scoring-holdout.vitest.ts` | Flag behavior, rank comparison, holdout selection, cycle evaluation, promotion gate logic |
| `mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | Runtime scheduler lifecycle, replay execution, weekly cycle detection |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Shadow scoring with holdout evaluation
- Current reality source: mcp_server/lib/feedback/shadow-scoring.ts module header and implementation
