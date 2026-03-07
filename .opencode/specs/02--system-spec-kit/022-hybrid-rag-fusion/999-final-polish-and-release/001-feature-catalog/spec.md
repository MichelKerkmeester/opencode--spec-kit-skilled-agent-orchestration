# Feature Catalog Source File Annotations

## Overview

Add `## Source Files` sections to every feature in the Spec Kit Memory MCP server's feature catalog, linking each feature to its implementing source code files with full transitive dependency tracing.

## Scope

- ~156 per-feature snippet files across 20 category directories
- 1 monolithic `feature_catalog.md` (~12,000 lines after patching)
- Source code inventory: ~216 non-test `.ts` files in `mcp_server/` + 26 in `shared/` + ~244 test files

## Approach

A single Node.js script (`scratch/generate-source-files.mjs`) that:
1. Builds the full import dependency graph from all source files
2. Maps each feature to its entry points via a hardcoded mapping
3. Computes transitive closures using BFS
4. Matches test files by name pattern
5. Generates `## Source Files` sections with `### Implementation` and `### Tests` sub-tables
6. Patches all 156 snippet files
7. Patches the monolithic `feature_catalog.md` (with `####`/`#####` heading levels)

## Format

Per-feature snippets: `## Source Files` → `### Implementation` table → `### Tests` table
Monolith: `#### Source Files` → `##### Implementation` table → `##### Tests` table

Tables use: File | Layer | Role (implementation) and File | Focus (tests)

## Special Cases

- 17-governance: "No dedicated source files — governance process controls"
- 19-decisions (NO-GO): "No dedicated source files — decision record"
- 20-feature-flag-reference: "Source file references included in flag table above"
- Meta/audit features: "No dedicated source files — cross-cutting meta-improvement"
- Deferred features: "No source files yet — planned but not yet implemented"
