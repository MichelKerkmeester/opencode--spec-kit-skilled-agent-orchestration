---
title: "Skill graph scan"
description: "Indexes skill graph metadata into the SQLite-backed skill graph."
---

# Skill graph scan

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`skill_graph_scan` indexes `.opencode/skill/*/graph-metadata.json` files into
the SQLite skill graph. It is the maintenance entry point for refreshing skill
relationships before structural skill queries.
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
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/26-skill-graph-scan.md`

<!-- /ANCHOR:source-metadata -->
