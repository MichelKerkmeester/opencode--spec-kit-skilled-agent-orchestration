---
title: "Skill graph query"
description: "Runs relationship traversals over the SQLite-backed skill graph."
---

# Skill graph query

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`skill_graph_query` reads the live skill graph with query types such as
`depends_on`, `dependents`, `enhances`, `family_members`, `transitive_path`,
`hub_skills`, `orphans`, and `subgraph`.
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
| `mcp_server/tools/skill-graph-tools.ts` | Dispatcher |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Context preservation and code graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/27-skill-graph-query.md`
<!-- /ANCHOR:source-metadata -->
