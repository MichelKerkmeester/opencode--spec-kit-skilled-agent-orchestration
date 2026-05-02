---
title: "Feedback: Shadow Signal Processing"
description: "Implicit feedback logging, ranking metrics and shadow-evaluation helpers."
trigger_phrases:
  - "implicit feedback"
  - "feedback ledger"
---

# Feedback: Shadow Signal Processing

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

## 1. OVERVIEW

`lib/feedback/` owns shadow feedback capture and evaluation for memory search behavior. It records implicit events, tracks query flow, calculates rank metrics and runs side-effect-free replay checks before any ranking changes are promoted elsewhere.

Current state:

- Feedback writes are shadow-only and must not interrupt search or save operations.
- Ranking metrics are computed from logged activity and replayed result sets.
- Scheduled shadow evaluation samples production queries from telemetry and compares live and proposed ranks.

## 2. ARCHITECTURE

```text
search or save event
    │
    ▼
feedback-ledger.ts
    │
    +--> query-flow-tracker.ts
    +--> batch-learning.ts
    │
    ▼
rank-metrics.ts
    │
    ▼
shadow-scoring.ts
    │
    ▼
shadow-evaluation-runtime.ts
```

## 3. DIRECTORY TREE

```text
feedback/
+-- batch-learning.ts              # Batch processing for feedback signals
+-- feedback-ledger.ts             # SQLite event table and write helpers
+-- query-flow-tracker.ts          # Query reformulation and flow tracking
+-- rank-metrics.ts                # Ranking metric calculations
+-- shadow-evaluation-runtime.ts   # Scheduled shadow replay runtime
+-- shadow-scoring.ts              # Shadow scoring and cycle reports
`-- README.md                      # Folder orientation
```

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `feedback-ledger.ts` | Initializes `feedback_events`, resolves confidence tiers and logs implicit events behind `SPECKIT_IMPLICIT_FEEDBACK_LOG`. |
| `query-flow-tracker.ts` | Tracks query changes that imply satisfaction or dissatisfaction signals. |
| `rank-metrics.ts` | Computes ranking measures over live and shadow result sets. |
| `batch-learning.ts` | Groups signal processing work for batch runs. |
| `shadow-scoring.ts` | Selects holdout queries and builds shadow evaluation reports. |
| `shadow-evaluation-runtime.ts` | Schedules weekly replay, builds side-effect-free search configs and tunes adaptive thresholds after evaluation. |

## 5. BOUNDARIES AND FLOW

This folder may read and write feedback tables. It may run replay searches through the search pipeline when configured for shadow evaluation.

It should not directly change live ranking behavior, rewrite memory records or own user-facing search response formatting.

Main flow:

```text
implicit event
    -> logFeedbackEvent or logFeedbackEvents
    -> metrics and query-flow analysis
    -> holdout replay
    -> ShadowEvaluationReport
    -> adaptive proposal outside this folder
```

## 6. ENTRYPOINTS

| Export | File | Purpose |
|---|---|---|
| `logFeedbackEvent` | `feedback-ledger.ts` | Record one implicit feedback event. |
| `logFeedbackEvents` | `feedback-ledger.ts` | Record a batch of events for one interaction. |
| `initFeedbackLedger` | `feedback-ledger.ts` | Ensure feedback tables and indexes exist. |
| Shadow evaluation runtime exports | `shadow-evaluation-runtime.ts` | Start and execute scheduled shadow replay cycles. |
| Metric helpers | `rank-metrics.ts` | Score live and shadow ranked lists. |

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/feedback/README.md
```

## 8. RELATED

- `../search/README.md`
- `../../handlers/README.md`
