---
title: "Skill graph status"
description: "Reports skill graph health, staleness, families, categories, schema versions, and DB status."
---

# Skill graph status

## 1. OVERVIEW

`skill_graph_status` is the read-only health surface for the SQLite skill graph.
It reports totals, family/category breakdowns, staleness, validation status, and
database availability.

## 2. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/tools/skill-graph-tools.ts` | Dispatcher |

