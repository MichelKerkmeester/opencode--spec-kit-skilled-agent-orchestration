---
title: "Learned relevance feedback"
description: "Learned relevance feedback captures query terms from user result selections and boosts future searches with a 0.7x weight via isolated `learned_triggers`."
---

# Learned relevance feedback

## 1. OVERVIEW

Learned relevance feedback captures query terms from user result selections and boosts future searches with a 0.7x weight via isolated `learned_triggers`.

When you mark a search result as useful, the system remembers which search terms led you to it. Next time similar terms appear in a question, the system gives that memory a small boost. Over time, the system learns which results are genuinely helpful based on your actual selections, like a music app that gets better at recommending songs the more you use it.

---

## 2. CURRENT REALITY

The system learns from user result selections. When a user marks a search result as useful via `memory_validate` with a `queryId`, query terms are extracted and stored in a separate `learned_triggers` column. This column is explicitly isolated from the FTS5 index to prevent contamination, which would be irreversible without a full re-index.

Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.

**Sprint 8 update:** The R11 shadow-period safeguard remains active in runtime. `isInShadowPeriod()` and its guards in `recordSelection()` / `queryLearnedTriggers()` were retained as Safeguard #6 (1-week shadow mode: log-but-don't-apply). Sprint 8 dead-code cleanup removed other retired flag helpers (`isShadowScoringEnabled`, `isRsfEnabled`), but not the R11 shadow-period guard.

Learned triggers boost future searches via a 0.7x weight applied during the feedback signals step in Stage 2. The boost applies alongside the query, not replacing it. Runs behind the `SPECKIT_LEARN_FROM_SELECTION` flag (default ON, set to `false` to disable).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/feedback-denylist.ts` | Lib | Feedback denylist management |
| `mcp_server/lib/search/learned-feedback.ts` | Lib | Learned relevance feedback |
| `mcp_server/lib/storage/learned-triggers-schema.ts` | Lib | Learned triggers schema |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/feedback-denylist.vitest.ts` | Feedback denylist tests |
| `mcp_server/tests/learned-feedback.vitest.ts` | Learned feedback tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Learned relevance feedback
- Current reality source: FEATURE_CATALOG.md
