---
title: "Skill graph scan"
description: "Indexes skill graph metadata into the SQLite-backed skill graph."
---

# Skill graph scan

## 1. OVERVIEW

`skill_graph_scan` indexes `.opencode/skill/*/graph-metadata.json` files into
the SQLite skill graph. It is the maintenance entry point for refreshing skill
relationships before structural skill queries.

## 2. SOURCE FILES

| File | Role |
|------|------|
| `mcp_server/tool-schemas.ts` | Public MCP descriptor |
| `mcp_server/tools/skill-graph-tools.ts` | Dispatcher |

