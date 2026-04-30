---
title: "Skill graph validate"
description: "Validates skill graph schema versions, broken edges, relation weights, symmetry, and dependency cycles."
---

# Skill graph validate

## 1. OVERVIEW

`skill_graph_validate` checks the live skill graph for schema drift, broken
edges, recommended weight-band violations, reciprocal-symmetry drift, and
lightweight dependency-cycle errors.

## 2. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/tools/skill-graph-tools.ts` | Dispatcher |

