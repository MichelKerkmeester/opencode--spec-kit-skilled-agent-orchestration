You are running iteration 10 of 12 in a deep-research loop on code-graph resilience.

# Iteration 10 — Edge-Weight Tuning Surface + Drift Detection Implementation

## Goal

Iteration 6 found edge weights are hard-coded (CONTAINS=1.0, IMPORTS=1.0, EXTENDS=0.95, ..., TESTED_BY=0.6) with no runtime override. Iteration 10 designs:
1. An `IndexerConfig` extension with per-edge-class weight overrides
2. The drift detection runtime (PSI + JSD + edge-share computation against a baseline)

## Research Questions
- Q13A: What's the current `IndexerConfig` schema? Where is it loaded? What's the override resolution order?
- Q13B: Where exactly are the hard-coded weights produced (function-by-function)? List the patch points.
- Q13C: How would baseline edge distributions be persisted and re-loaded? (in DB? in a JSON file? in `code_graph_metadata`?)
- Q13D: What's the minimal runtime to compute PSI / JSD between two distributions, and where would that live?
- Q13E: How should a drift report be surfaced? (return value of which handler? new MCP tool?)

## Required reads
1. `research/iterations/iteration-006.md`
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` — `IndexerConfig` interface, edge type enum, weight constants
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` — focus on edge-emission functions (lines 895-1071, 1357-1377)
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` — `code_graph_metadata` table schema (line 95-115)
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` — current status response shape

## What to look for
- Where `IndexerConfig` is defined and what fields it has
- Whether config is loaded from a file, env vars, or both
- How weight constants are referenced inside emit functions (direct constant? named export? object lookup?)
- Whether `code_graph_metadata` table can hold a baseline distribution snapshot
- Where status.ts could surface drift as a new field

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-010.md`

Required sections:
- **Summary**
- **Current Config Schema** (file:line + interface definition)
- **Weight Production Points** (per-emit-function file:line for every edge type)
- **Proposed Config Extension** (new fields with type signatures + default values)
- **Drift Computation Module** (function signatures + cost analysis)
- **Baseline Persistence** (schema + load/save signatures)
- **Surface Decision** (new MCP tool vs. status.ts extension; trade-offs)
- **Patch Surface List** (file:line per change, minimum 6 patch points)
- **Files Reviewed**
- **Convergence Signals**

### 2. Delta JSON
Path: `research/deltas/iteration-010.json`. `research_questions_answered: ["Q13A"..."Q13E"]`, `iteration: 10`, `focus: "edge-weight tuning + drift detection"`.

### 3. State log append.

## Constraints
- Read-only.
- Drift math must be implementable in TypeScript without external deps (or cite the exact npm package + size).
- Minimum 8 distinct file:line citations.
