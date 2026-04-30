---
title: "Skill graph validate"
description: "Validates skill graph schema versions, broken edges, relation weights, symmetry, and dependency cycles."
---

# Skill graph validate

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`skill_graph_validate` checks the live skill graph for schema drift, broken
edges, recommended weight-band violations, reciprocal-symmetry drift, and
lightweight dependency-cycle errors.
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
- Feature file path: `22--context-preservation-and-code-graph/29-skill-graph-validate.md`

<!-- /ANCHOR:source-metadata -->
