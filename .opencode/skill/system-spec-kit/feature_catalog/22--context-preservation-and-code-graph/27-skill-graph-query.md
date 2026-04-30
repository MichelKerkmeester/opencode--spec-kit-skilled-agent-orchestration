---
title: "Skill graph query"
description: "Runs relationship traversals over the SQLite-backed skill graph."
---

# Skill graph query

## 1. OVERVIEW

`skill_graph_query` reads the live skill graph with query types such as
`depends_on`, `dependents`, `enhances`, `family_members`, `transitive_path`,
`hub_skills`, `orphans`, and `subgraph`.

## 2. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/tools/skill-graph-tools.ts` | Dispatcher |

