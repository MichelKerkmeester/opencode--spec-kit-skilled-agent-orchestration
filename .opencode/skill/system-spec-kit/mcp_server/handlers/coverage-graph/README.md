---
title: "Coverage Graph Handlers"
description: "MCP handlers for deep-loop research and review coverage graphs."
trigger_phrases:
  - "coverage graph handlers"
  - "deep loop graph"
---

# Coverage Graph Handlers

## 1. OVERVIEW

`handlers/coverage-graph/` exposes the MCP-facing handler layer for the deep-loop coverage graph tools. The handlers validate tool inputs and delegate storage/query work to `lib/coverage-graph/`.

Current handler modules:

- `upsert.ts` - validates and upserts nodes and edges.
- `query.ts` - serves uncovered-question, contradiction, provenance, and hot-node queries.
- `status.ts` - reports graph health and convergence metrics.
- `convergence.ts` - computes stop/continue guidance for research and review loops.
- `index.ts` - barrel export for the handler surface.

## 2. RELATED

- `../../lib/coverage-graph/README.md`
- `../README.md`
