---
title: "Deep loop coverage graph query"
description: "Reads deep-loop coverage graph state for uncovered questions, unverified claims, contradictions, provenance, gaps, and hot nodes."
---

# Deep loop coverage graph query

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_query` reads the namespaced research/review coverage graph. It
supports uncovered-question, unverified-claim, contradiction, provenance-chain,
coverage-gap, and hot-node queries for loop synthesis and audit work.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Current runtime behavior is documented in the source files below.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/handlers/coverage-graph/query.ts` | Handler |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Context preservation and code graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/30-coverage-graph-query.md`
<!-- /ANCHOR:source-metadata -->
