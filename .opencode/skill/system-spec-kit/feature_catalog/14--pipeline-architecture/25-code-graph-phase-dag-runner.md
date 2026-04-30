---
title: "Code Graph phase-DAG runner"
description: "Typed phase-DAG runner that wraps the Code Graph structural-indexer scan flow, validates the dependency graph (duplicates, missing deps, cycles), topologically orders phases, and passes each phase only the outputs of phases it explicitly declared as dependencies."
---

# Code Graph phase-DAG runner

## 1. OVERVIEW

Typed phase-DAG runner that wraps the Code Graph structural-indexer scan flow, validates the dependency graph (duplicates, missing deps, cycles), topologically orders phases, and passes each phase only the outputs of phases it explicitly declared as dependencies.

This is a pipeline-architecture entry because it reshapes the internal coordination surface of the structural indexer without changing the public scan tool count or the SQLite schema. The goal is to give Code Graph the same explicit phase contract External Project uses for its 12-phase ingestion DAG, while keeping Public's compact storage model intact (pt-02 §4 "Public adaptation" row).

---

## 2. CURRENT REALITY

The runner lives at `mcp_server/code_graph/lib/phase-runner.ts`. It defines a `Phase<I, O>` interface — `name`, `inputs[]`, optional `output`, `run(deps): O` — and exports `runPhases(phases)` plus `topologicalSort(phases)`. The DAG is validated in three rejection passes before any phase body runs:

1. **Duplicate phase names** → `PhaseRunnerError('duplicate-phase')`. The first colliding name is named in the message.
2. **Missing dependency** → `PhaseRunnerError('missing-dependency')`. A phase listing a name that no other phase produces or owns is rejected with the offending phase named.
3. **Cycles** → `PhaseRunnerError('cycle-detected')`. Detected via a Kahn's-algorithm topological sort; the phases left with non-zero incoming-edge counts after the sort are reported.

Failures inside a phase body bubble through `PhaseRunnerError('phase-failure')`, which carries `phaseName` and the original error as `cause` so callers always see failure attribution (R-002-7).

The structural indexer's `indexFiles()` body now runs through this runner. The flow decomposes into four declared phases:

| Phase | inputs | Role |
|-------|--------|------|
| `find-candidates` | `[]` | Finds workspace files via `findFiles()` or `collectSpecificFiles()` |
| `parse-candidates` | `['find-candidates']` | Reads + parses each candidate, skipping fresh files via `isFileStale` |
| `finalize` | `['parse-candidates']` | Applies cross-file dedup + heuristic edges via `finalizeIndexResults` |
| `emit-metrics` | `['finalize']` | Emits `spec_kit.graph.scan_duration_ms` histogram and per-edge counters when SpecKit metrics are enabled |

The phase contract guarantees `parse-candidates` cannot see `emit-metrics` outputs and vice versa — `deps` only contains the keys listed in `inputs`. Existing exports (`indexFiles`, `parseFile`, `extractEdges`, `capturesToNodes`, `finalizeIndexResults`, `getParser`, `getRequestedParserBackend`, `detectorProvenanceFromParserBackend`) are preserved; the SQLite schema (`code_files`, `code_nodes`, `code_edges`) is unchanged.

The decomposition mirrors the previous inline flow exactly. No phase reorders persistence, no phase changes file-skip semantics, and no phase moves work between scan and post-scan stages. The runner is purely an orchestration wrapper that makes the DAG declarative and auditable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/phase-runner.ts` | Lib | Defines `Phase<I,O>`, `PhaseRunnerError`, `topologicalSort()`, `runPhases()` |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Lib | `buildIndexPhases()` declares the four scan phases; `indexFiles()` invokes `runPhases()` and preserves the historical `IndexFilesResult` shape |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/code_graph/tests/phase-runner.test.ts` | Topological sort correctness, duplicate-name / missing-dep / cycle rejection paths, dependency-only output visibility, async phase awaiting, failure attribution, custom output keys |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` (existing) | Backward-compat coverage for `indexFiles` exports — passes unchanged |
| `mcp_server/code_graph/tests/code-graph-scan.vitest.ts` (existing) | End-to-end scan handler coverage — passes unchanged |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/25-code-graph-phase-dag-runner.md`

- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §4 (Code Graph "Phase registry" + "Runner contract" rows), §11 Packet 1
- Decision record: 012/decision-record.md ADR-012-001 (clean-room), ADR-012-002 (sub-phase split)
