---
title: "Deep loop coverage graph query"
description: "Reads deep-loop coverage graph state for uncovered questions, unverified claims, contradictions, provenance, gaps, and hot nodes."
---

# Deep loop coverage graph query

## 1. OVERVIEW

`deep_loop_graph_query` reads the namespaced research/review coverage graph. It
supports uncovered-question, unverified-claim, contradiction, provenance-chain,
coverage-gap, and hot-node queries for loop synthesis and audit work.

## 2. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/handlers/coverage-graph/query.ts` | Handler |

