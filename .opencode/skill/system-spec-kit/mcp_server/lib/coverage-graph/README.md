---
title: "Coverage Graph"
description: "Deep-loop coverage graph storage, querying, and convergence helpers."
trigger_phrases:
  - "coverage graph"
  - "deep loop coverage"
---

# Coverage Graph

## 1. OVERVIEW

`lib/coverage-graph/` owns the dedicated deep-loop graph store used by research and review loops.

- `coverage-graph-db.ts` - SQLite schema, namespace handling, and upsert primitives.
- `coverage-graph-query.ts` - uncovered-question, contradiction, provenance, and hot-node queries.
- `coverage-graph-signals.ts` - convergence and graph-health metrics.

This subsystem is separate from the causal memory graph and is scoped by `specFolder`, `loopType`, and `sessionId`.

## 2. RELATED

- `../../handlers/coverage-graph/README.md`
- `../graph/README.md`
