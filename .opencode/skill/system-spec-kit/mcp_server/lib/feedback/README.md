---
title: "Feedback"
description: "Implicit feedback logging, ranking metrics, and shadow-evaluation helpers."
trigger_phrases:
  - "implicit feedback"
  - "feedback ledger"
---

# Feedback

## 1. OVERVIEW

`lib/feedback/` contains the runtime pieces behind learned relevance and shadow feedback analysis.

- `feedback-ledger.ts` - stores feedback events.
- `query-flow-tracker.ts` - tracks query-to-query behavior.
- `rank-metrics.ts` - computes ranking metrics from logged activity.
- `batch-learning.ts` - batches signal processing work.
- `shadow-scoring.ts` and `shadow-evaluation-runtime.ts` - evaluate feedback impacts without live ranking side effects.

## 2. RELATED

- `../search/README.md`
- `../../handlers/README.md`
