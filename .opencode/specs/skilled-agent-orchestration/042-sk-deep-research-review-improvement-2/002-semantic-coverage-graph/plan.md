---
title: "Implementation Plan: Semantic Coverage Graph [042.002]"
description: "Deliver the deep-loop coverage graph substrate by extracting shared graph primitives, adding dedicated storage and MCP tools, and wiring graph-backed convergence into deep research and deep review."
trigger_phrases:
  - "042.002"
  - "implementation plan"
  - "semantic coverage graph"
  - "deep_loop_graph_query"
  - "deep_loop_graph_convergence"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Semantic Coverage Graph

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server modules, CommonJS shared libraries, Markdown contract docs |
| **Framework** | Existing Spec Kit Memory MCP server plus `sk-deep-research` and `sk-deep-review` runtime contracts |
| **Storage** | Dedicated `deep-loop-graph.sqlite` with `coverage_nodes`, `coverage_edges`, and `coverage_snapshots` |
| **Primary Reuse Sources** | `causal-edges.ts`, `graph-signals.ts`, `contradiction-detection.ts`, `code-graph-db.ts` |
| **Reuse Posture** | `35-45%` direct reuse, `25-30%` adapted reuse, remainder genuinely new loop semantics |
| **Testing** | Vitest unit and integration suites plus strict phase validation |

### Overview

This phase is a concrete build plan, not a moonshot placeholder. We already know which graph primitives exist, how they map to coverage semantics, which tables are required, what the MCP tools need to do, and how graph convergence must interact with Phase 001 runtime truth. Research findings also show that reuse is narrower than first estimated, so the plan now makes adaptation work explicit instead of treating it as incidental. The sequence is:

1. Extract reusable graph primitives from existing memory MCP code.
2. Stand up a dedicated coverage-graph database and query layer.
3. Add the four reducer-facing MCP tools on the current server.
4. Define the reducer/MCP contract, including authority order and latency budget, before reducer integration starts.
5. Wire reducer ingestion, fallback behavior, weight calibration, and convergence decisions.
6. Update loop docs and agents so graph events become part of the canonical runtime artifact flow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent packet 042 is in place and defines why semantic convergence matters.
- [x] Phase 001 exists and defines the stop-decision envelope this phase must extend.
- [x] Existing graph reuse sources are identified by exact module family.
- [x] Research and review relation maps and initial weight estimates are fixed enough to start calibration work.
- [x] Coverage graph schema and four-tool contracts are fixed.
- [x] Scope is constrained to the concrete file list for this phase.

### Definition of Done

- [x] Shared coverage-graph helper files exist and clearly own the reused graph behavior.
- [x] `deep-loop-graph.sqlite` schema and snapshot persistence are implemented through the named MCP server files.
- [x] All four phase-critical `deep_loop_graph_*` tools are wired through handlers and `tool-schemas.ts`.
- [x] The reducer/MCP contract is defined explicitly, including payload shape, authority order, latency budget, and replay behavior.
- [x] `reduce-state.cjs` ingests `graphEvents`, performs MCP upsert/convergence when available, recalibrates inherited weights for coverage semantics, and preserves local fallback behavior.
- [x] Deep-research and deep-review references and agent prompts document graph event emission and graph-aware convergence.
- [x] The five named test files cover core logic, signals, convergence, DB behavior, and tool behavior.
- [x] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-path> --strict` passes for the phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extract once, specialize by ontology, keep JSONL as authority, project through reducer-local state first, and mirror through MCP when available.

### Key Components

- **Coverage graph core**: reusable edge manager and traversal helpers extracted from the causal graph implementation.
- **Coverage graph signals**: reusable signal computations for degree, depth, momentum, and higher-level convergence inputs.
- **Coverage graph contradictions**: shared CONTRADICTS-edge inspection reused by both research and review loops.
- **Coverage graph convergence**: loop-type-aware decision helper that computes graph metrics and produces typed blocker traces.
- **Coverage graph DB/query layer**: SQLite-backed persistence and query engine for nodes, edges, and per-iteration snapshots.
- **Coverage graph MCP handlers**: the external tool surface used by reducers and dashboards.
- **Reducer/MCP contract**: the explicit seam that defines payload shape, latency budget, sync model, and fallback authority ordering between reducer-local state and MCP projection.
- **Reducer integration**: the deep-research reducer that transforms iteration `graphEvents` into persisted graph state and graph-aware stop decisions.
- **Reference/agent contracts**: the docs and prompts that make `graphEvents` part of the runtime contract instead of an implementation detail.

### Concrete Reuse Plan

| Source Module | Reused Pattern | Destination |
|---------------|----------------|-------------|
| `lib/storage/causal-edges.ts` | Edge insertion/update/delete, weight clamping, self-loop prevention, BFS traversal, cumulative path strength | `coverage-graph-core.cjs` |
| `lib/graph/graph-signals.ts` | Degree, topological depth, momentum, graph health metrics | `coverage-graph-signals.cjs` and `coverage-graph-signals.ts` |
| `lib/graph/contradiction-detection.ts` | CONTRADICTS-edge scanning and paired reports | `coverage-graph-contradictions.cjs` |
| `lib/code-graph/code-graph-db.ts` | SQLite setup, schema versioning, transaction safety, indexes | `coverage-graph-db.ts` |

### Data Flow

```text
iteration JSONL append
  -> reducer rebuilds local graph state from authoritative graphEvents
  -> deep_loop_graph_upsert mirrors nodes and edges into SQLite projection when MCP is available
  -> coverage signal + contradiction helpers compute graph metrics
  -> deep_loop_graph_convergence returns decision + blockers + trace
  -> reducer merges graph context into shouldContinue alongside newInfoRatio
  -> status/convergence summaries feed dashboards and synthesis outputs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 2a: Extract Graph Primitives

**Sessions**: 3  
**Scope**: REQ-001, REQ-006, REQ-009

**Goal**: Create a shared coverage-graph helper layer so research and review reuse one graph engine instead of each embedding their own logic.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`

**Implementation notes**:
- Keep extraction seams narrow and distinguish direct-transfer primitives from adaptation-heavy semantics.
- Map existing memory relations to research/review relation enums inside the coverage layer, but treat current weight values as provisional inputs to later calibration.
- Preserve strength clamping, self-loop prevention, edge update semantics, and provenance traversal behavior from the causal graph implementation.
- Reuse degree, depth, and momentum patterns instead of inventing new graph-signal math.

**Exit criteria**:
- Shared libraries express the graph rules required by both loop types.
- No loop-specific persistence or MCP logic leaks into the shared extraction layer.

**Verification**:
- `coverage-graph-core.vitest.ts`
- `coverage-graph-signals.vitest.ts`
- `coverage-graph-convergence.vitest.ts`

### Phase 2b: Build Coverage Graph Database

**Sessions**: 2  
**Scope**: REQ-002, REQ-003, REQ-004, REQ-009

**Goal**: Create the dedicated graph store and server-side query/signal layer that persists the research and review ontologies exactly as defined in the phase spec.

**Files to change**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`

**Implementation notes**:
- Follow `code-graph-db.ts` conventions for schema versioning, index creation, and transaction safety.
- Keep `coverage_nodes` generic enough for both loop types, with loop-specific metadata in JSON.
- Generate `coverage_snapshots` once per iteration so later phases can consume graph history directly.

**Exit criteria**:
- Schema, indexes, uniqueness rules, and snapshot writes are fully implemented.
- Query layer can answer the six structured query types without ad hoc SQL in handlers.

**Verification**:
- `coverage-graph-db.vitest.ts`
- Targeted signal and convergence tests against persisted graph fixtures

### Phase 2c: Add MCP Tools

**Sessions**: 2  
**Scope**: REQ-005, REQ-010

**Goal**: Surface the coverage graph through four stable MCP tools on the existing Spec Kit Memory MCP server.

**Files to change**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

**Implementation notes**:
- `deep_loop_graph_upsert` must be idempotent and reject self-loops.
- `deep_loop_graph_query` must support coverage gaps, contradictions, provenance chains, and hot-node queries.
- `deep_loop_graph_convergence` must return a typed `decision`, `signals`, `blockers`, and `trace`.
- `deep_loop_graph_visualize` is deferred to a follow-up phase and is not part of Phase 002 critical-path delivery.

**Exit criteria**:
- All four phase-critical tools are defined in `tool-schemas.ts`.
- Handlers map cleanly to query/signal/DB helpers without duplicating domain logic.

**Verification**:
- `coverage-graph-tools.vitest.ts`
- `coverage-graph-db.vitest.ts`

### Phase 2d: Define Reducer/MCP Contract and Integrate Reducer

**Sessions**: 3  
**Scope**: REQ-006, REQ-007

**Goal**: Make graph state part of the canonical deep-research reducer lifecycle.

**Files to change**:
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`

**Prerequisite sub-steps**:
1. Define the reducer/MCP contract: payload shape, sync-vs-async behavior, latency budget, authority order, and replay semantics.
2. Calibrate coverage-specific edge weights against reducer outputs and convergence behavior instead of blindly inheriting memory-causal values.

**Implementation notes**:
- Start from authoritative JSONL replay and reducer-local graph rebuild, then mirror into MCP projection state when available.
- Parse `graphEvents` from iteration JSONL deltas after each iteration.
- Upsert graph nodes/edges before computing final convergence, but fall back to reducer-local state whenever MCP exceeds the defined latency budget or is unavailable.
- Merge graph convergence with the Phase 001 `shouldContinue` decision instead of bypassing it.
- Preserve a local JSON graph artifact as fallback when MCP is unavailable or startup fails.
- Record calibrated relation weights and guard thresholds as implementation outputs of this phase, not post-hoc tuning work.

**Exit criteria**:
- Reducer/MCP contract is documented and implemented.
- Reducer can persist graph state, read graph convergence, and explain STOP blockers with graph context.
- Fallback path is explicit, replay-safe, and ordered `JSONL -> local JSON -> SQLite projection`.

**Verification**:
- Existing deep-research reducer tests from Phase 001 if touched
- Named coverage-graph convergence/tool suites

### Phase 2e: Agent and Convergence Integration

**Sessions**: 2  
**Scope**: REQ-008, REQ-010

**Goal**: Make graph events and graph-aware convergence part of the human- and agent-facing loop contract.

**Files to change**:
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-review/references/state_format.md`
- `.opencode/skill/sk-deep-review/references/convergence.md`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`

**Implementation notes**:
- Both loop products must emit `graphEvents` in their JSONL state.
- Deep-research docs must explain question/claim/source coverage; deep-review docs must explain dimension/file/finding coverage.
- Agents must produce structured node/edge data rather than prose-only graph summaries.

**Exit criteria**:
- Runtime documentation, prompts, and reducer expectations agree on `graphEvents`.
- Convergence docs explain how graph context modifies legal STOP reasoning.

**Verification**:
- Strict doc validation on the phase folder
- Contract sanity checks through the named convergence/tool suites
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Primary Files |
|-----------|-------|---------------|
| Unit | Edge manager behavior, traversal, signal math, contradiction handling, convergence helpers | `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts` |
| Integration | SQLite bootstrap, schema rules, idempotent upsert, snapshot persistence | `coverage-graph-db.vitest.ts` |
| MCP Tool | Input validation, query dispatch, status output, and convergence output contracts | `coverage-graph-tools.vitest.ts` |
| Runtime Contract | Reducer graph-event ingestion and graph-aware stop behavior | Existing Phase 001 reducer/runtime suites if touched during implementation |
| Documentation Validation | Spec folder structure, placeholders, frontmatter, phase links | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-path> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent packet `042-sk-deep-research-review-improvement-2` | Internal | Green | Phase intent and downstream sequencing become unclear. |
| Phase `001-runtime-truth-foundation` | Internal | Green | Graph convergence would have no legal stop-decision envelope to extend. |
| Existing memory graph primitives under `system-spec-kit/mcp_server/` | Internal | Green | Reuse target disappears and the phase regresses to greenfield design. |
| Current Spec Kit Memory MCP server registration flow | Internal | Green | Handlers and schemas could be implemented but not reachable. |
| Deep-research reducer ownership of post-iteration state | Internal | Green | Graph state cannot become part of canonical runtime truth. |
<!-- /ANCHOR:dependencies -->

---

### Implementation Assumptions

- The current MCP server already has a registration path that can expose the new tool schemas without opening a second server surface.
- Phase 001 reducer ownership remains authoritative for legal STOP decisions and final `shouldContinue` synthesis.
- Research and review may share graph infrastructure, but their ontologies stay intentionally separate.
- JSONL `graphEvents` remain the authority when MCP projection state is missing or stale.
- Existing Phase 001 reducer/runtime tests can be extended if graph integration touches those contracts, even though this phase only adds five new named test files.

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Graph extraction breaks existing graph behavior, or graph convergence produces incorrect legal STOP decisions.
- **Procedure**:
  1. Disable the four new `deep_loop_graph_*` tool definitions in `tool-schemas.ts`.
  2. Revert reducer convergence back to Phase 001 scalar-only behavior.
  3. Leave the dedicated graph store and extracted helper files isolated until behavior is corrected and replay-tested.
- **Safety Note**: Rollback must not modify or corrupt the existing memory causal graph or code structural graph stores. `deep-loop-graph.sqlite` is additive and can be recreated independently.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 2a (Extract shared graph helpers)
  -> Phase 2b (Create SQLite storage and query layer)
  -> Phase 2c (Expose four MCP tools)
  -> Phase 2d (Define reducer/MCP contract and integrate reducer)
  -> Phase 2e (Update agents and runtime references)
  -> Phase 3 verification
```

| Workstream | Depends On | Produces | Blocks |
|------------|------------|----------|--------|
| Phase 2a graph helper extraction | Existing graph primitives | Shared coverage-graph libraries | 2b, 2c, 2d |
| Phase 2b DB/query layer | Phase 2a helpers | SQLite schema, query engine, snapshot support | 2c, 2d |
| Phase 2c MCP tool surface | Phases 2a-2b | `deep_loop_graph_*` handlers and schemas | 2d, verification |
| Phase 2d reducer integration | Phases 2a-2c plus Phase 001 runtime truth | Graph-aware reducer flow and fallback authority chain | 2e, verification |
| Phase 2e agent and reference alignment | Phase 2d contract | Canonical `graphEvents` runtime contract | verification |
<!-- /ANCHOR:dependency-graph -->
