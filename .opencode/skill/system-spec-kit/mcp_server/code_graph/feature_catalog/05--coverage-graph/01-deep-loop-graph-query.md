---
title: "deep_loop_graph_query"
description: "Manual coverage-graph read tool for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps, and hot nodes."
trigger_phrases:
  - "deep_loop_graph_query"
  - "code_graph runtime catalog"
  - "deep_loop_graph_query"
importance_tier: "important"
---

# deep_loop_graph_query

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_query` is the read side of the deep-loop coverage graph. It inspects research/review graph state but does not run from command YAML automatically.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. There is no YAML, bootstrap, watcher, or after-tool auto-fire path.

### Class

manual, copied from the current reality map.

### Caveats / Fallback

Requires `specFolder`, `loopType`, and `sessionId`; reads are session-scoped.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-120` | Handler | validates namespace fields and routes query types |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:33-49` | Tool surface | registers and dispatches the tool |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851-866` | Schema | defines the public schema |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/01-deep-loop-graph-query.md`

Related references:

- [02-deep-loop-graph-status.md](./02-deep-loop-graph-status.md)
- [03-deep-loop-graph-upsert.md](./03-deep-loop-graph-upsert.md)
<!-- /ANCHOR:source-metadata -->
