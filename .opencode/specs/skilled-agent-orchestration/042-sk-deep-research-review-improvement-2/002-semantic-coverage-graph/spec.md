---
title: "Feature Specification: Semantic Coverage Graph [042.002]"
description: "Define the coverage-graph substrate for deep research and deep review by extracting reusable graph primitives from the Spec Kit Memory MCP server and applying them to deep-loop convergence."
trigger_phrases:
  - "042.002"
  - "semantic coverage graph"
  - "deep-loop graph"
  - "deep_loop_graph_convergence"
  - "deep-loop-graph.sqlite"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Semantic Coverage Graph

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 002 turns semantic convergence from an abstract idea into a concrete implementation plan. The coverage graph is the fourth graph system in the existing Spec Kit Memory stack, following the causal graph, the code structural graph, and the graph-signal layer already present under `.opencode/skill/system-spec-kit/mcp_server/`.

The design target is explicit reuse, not greenfield invention. Research findings revise the reuse estimate to roughly 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Edge management from `causal-edges.ts`, degree/depth metrics from `graph-signals.ts`, contradiction-reporting patterns from `contradiction-detection.ts`, and SQLite setup patterns from `code-graph-db.ts` transfer well, but contradiction adjudication, convergence design, and reducer/MCP integration are not plug-and-play. Phase 001 remains the legal stop-decision foundation. Phase 002 adds graph context so low novelty only permits STOP when coverage, verification, and contradiction state agree.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Parent Packet** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 2 of 8 |
| **Predecessor** | `../001-runtime-truth-foundation/spec.md` |
| **Successor** | `../003-wave-executor/spec.md` |
| **Handoff Criteria** | Phase 003 can consume graph-backed coverage, contradiction, provenance, and convergence signals without introducing a second graph model. |

### Phase Context

**Role in Packet 042**: Phase 001 established legal stop reasons, typed convergence traces, and reducer ownership. Phase 002 adds the semantic substrate needed to explain whether the loop has actually covered the problem space. Phase 003 depends on this phase to drive wave and segment decisions. Phase 004 depends on the persisted graph and snapshots for offline optimization and replay analysis.

**Primary Dependency Surfaces**:
- Parent packet `042-sk-deep-research-review-improvement-2` defines the broader runtime-improvement program for `sk-deep-research` and `sk-deep-review`.
- Phase 001 `001-runtime-truth-foundation` defines the stop-decision contract that Phase 002 must extend rather than replace.
- Existing Spec Kit Memory graph systems under `.opencode/skill/system-spec-kit/mcp_server/` provide the extraction baseline and the implementation pattern.

**Deliverables**:
- Shared coverage-graph CommonJS helpers for edge management, signals, contradictions, and convergence.
- A dedicated `deep-loop-graph.sqlite` store with `coverage_nodes`, `coverage_edges`, and `coverage_snapshots`.
- Four new `deep_loop_graph_*` MCP tools on the existing Spec Kit Memory MCP server: `upsert`, `query`, `status`, and `convergence`.
- Reducer integration that defines the reducer/MCP seam explicitly, writes graph deltas after each iteration, and queries graph-aware convergence.
- Deep-research and deep-review contract updates so iterations emit `graphEvents` and the reducer can render graph summaries.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM & PURPOSE

### Problem Statement

Deep research and deep review currently know a great deal about iteration counts, novelty, and state transitions, but they still lack a first-class semantic model of coverage. The runtime can tell us progress is slowing down, yet it cannot answer the harder questions that matter for legal STOP:

- Have the important questions been answered by more than one finding?
- Are key claims verified or still unresolved?
- Are contradictions isolated and explained, or silently accumulating?
- Has review coverage saturated the hotspot files and dimensions that matter most?

This is not a missing-technology problem. The existing Spec Kit Memory MCP server already contains mature graph patterns for typed weighted edges, breadth-first traversal, contradiction detection, degree and depth signals, historical momentum, and SQLite-backed graph storage. What is missing is a loop-native graph ontology and persistence layer that applies those patterns to deep research and deep review.

### Purpose

Define an implementation-ready semantic coverage graph that reuses existing graph infrastructure, persists loop-scoped graph state in `deep-loop-graph.sqlite`, and feeds graph-backed convergence into the existing Phase 001 stop-decision logic without replacing `newInfoRatio` or other established runtime-truth signals.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- Extract graph primitives from the existing memory MCP server into shared coverage-graph helper libraries.
- Define research and review graph ontologies, including node kinds, relation types, initial weight estimates, metadata contracts, and convergence metrics.
- Create a dedicated `deep-loop-graph.sqlite` schema for graph state and per-iteration snapshots.
- Add four new MCP tools to the existing Spec Kit Memory MCP server.
- Calibrate coverage-specific edge weights during implementation instead of treating inherited memory-causal weights as final.
- Modify the deep-research reducer so it consumes iteration `graphEvents`, defines the reducer/MCP contract explicitly, upserts graph state, queries graph convergence, and falls back to a local JSON graph file when MCP is unavailable.
- Update the deep-research and deep-review reference docs and agent prompts so iterations emit graph events and use graph-aware convergence language.
- Add the listed unit and integration tests for graph core logic, signals, convergence, DB behavior, and tool behavior.

### Out of Scope

- Phase 003 wave scheduling, segment partitioning, or multi-wave orchestration logic.
- Phase 004 replay optimization, threshold tuning, or promotion heuristics derived from graph history.
- Replacing `newInfoRatio` or other Phase 001 signals with graph-only stop logic.
- Rewriting the existing memory causal graph or code structural graph to use the new coverage schema.
- Introducing new command-surface or workflow-YAML files beyond the concrete file set named for this phase.

### Files to Change

#### Shared Library Extraction

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` | Create | Shared edge manager, relation-weight maps, clamping, self-loop prevention, edge update history, and provenance traversal helpers extracted from `causal-edges.ts`. |
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` | Create | Shared degree, depth, momentum, and clustering/signal helpers adapted from `graph-signals.ts` and related graph utilities. |
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs` | Create | CONTRADICTS-edge discovery and reporting helpers specialized for deep-loop semantics. |
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Create | Research/review convergence-signal assembly and typed decision-trace helpers. |

#### MCP Server Additions

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Create | SQLite bootstrap, schema versioning, migrations, idempotent upsert support, and snapshot persistence for `deep-loop-graph.sqlite`. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts` | Create | Query engine for gap detection, provenance chains, contradiction lookup, and hot-node ranking. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts` | Create | Server-side metric computation and snapshot generation layered on top of the shared signal helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` | Create | Handler for bulk node/edge upserts with idempotency, clamping, and self-loop rejection. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` | Create | Handler for structured coverage-graph queries. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` | Create | Handler for graph health, counts, relation breakdowns, and signal summaries. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` | Create | Handler for typed graph-aware convergence assessment and blocker reporting. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Add input schemas and tool definitions for the four new `deep_loop_graph_*` MCP tools. |

#### Reducer, References, and Agents

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Ingest iteration `graphEvents`, define the reducer/MCP contract, push graph deltas to MCP, query convergence, enforce the fallback authority chain, and keep a local JSON fallback path. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add the `graphEvents` JSONL contract and graph-backed reducer outputs. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define graph-aware convergence language, decision interplay with `newInfoRatio`, and legal STOP semantics. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add the `graphEvents` JSONL contract for review iterations. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define graph-aware review convergence signals and contradiction handling. |
| `.opencode/agent/deep-research.md` | Modify | Require research iterations to emit graph nodes and edges into JSONL state. |
| `.opencode/agent/deep-review.md` | Modify | Require review iterations to emit graph nodes and edges into JSONL state. |

#### Tests

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts` | Create | Verify edge insertion, update, deletion, self-loop prevention, and provenance traversal. |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts` | Create | Verify degree, depth, momentum, and clustering/signal computations. |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Create | Verify research/review convergence signals and typed STOP decisions. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` | Create | Verify schema creation, namespace isolation, idempotent upsert behavior, and snapshot persistence. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts` | Create | Verify tool validation, handler behavior, and rendered output contracts. |

### Reuse Baseline and Mapping

Research findings revise the original reuse estimate downward: Phase 002 is now planned as 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Direct reuse is concentrated in graph primitives and DB lifecycle patterns; adapted work is concentrated in contradiction handling, convergence design, and reducer/MCP integration.

| Existing System | Existing Surface | Phase 002 Reuse Target | Reuse Intent |
|----------------|------------------|------------------------|--------------|
| Memory causal graph | `lib/storage/causal-edges.ts` | `coverage-graph-core.cjs` | Reuse typed edge insertion/update/delete, strength clamping, self-loop prevention, update history, and BFS traversal. |
| Graph signals | `lib/graph/graph-signals.ts` | `coverage-graph-signals.cjs` and `coverage-graph-signals.ts` | Reuse degree, topological depth, momentum, and clustering-adjacent signal patterns. |
| Contradiction detector | `lib/graph/contradiction-detection.ts` | `coverage-graph-contradictions.cjs` | Reuse CONTRADICTS-edge scanning and paired reporting. |
| Code structural graph DB | `lib/code-graph/code-graph-db.ts` | `coverage-graph-db.ts` | Reuse SQLite setup, schema versioning, index creation, and transaction safety patterns. |

### Research Relation Mapping

The weights below are initial estimates inherited from memory-causal graph heuristics. They are implementation starting points, not final truth constants, and MUST be recalibrated for coverage semantics before convergence thresholds are considered stable.

| Existing Memory Relation | Research Coverage Relation | Initial Weight Estimate | Intended Meaning |
|--------------------------|----------------------------|--------|------------------|
| `caused` | `ANSWERS` | 1.3 | Question to finding |
| `supports` | `SUPPORTS` | 1.0 | Finding to claim |
| `contradicts` | `CONTRADICTS` | 0.8 | Finding to finding |
| `supersedes` | `SUPERSEDES` | 1.5 | Claim to claim |
| `derived_from` | `DERIVED_FROM` | 1.0 | Claim to finding |
| `enabled` | `COVERS` | 1.1 | Question to question |
| `(new)` | `CITES` | 1.0 | Finding to source |

### Review Relation Mapping

These review weights are also initial estimates inherited from memory-causal graph behavior. Implementation MUST validate whether they should influence traversal only, convergence scoring, or both, and recalibrate them accordingly.

| Existing Memory Relation | Review Coverage Relation | Initial Weight Estimate | Intended Meaning |
|--------------------------|--------------------------|--------|------------------|
| `caused` | `COVERS` | 1.3 | Dimension to file |
| `supports` | `EVIDENCE_FOR` | 1.0 | Evidence to finding |
| `contradicts` | `CONTRADICTS` | 0.8 | Finding to finding |
| `supersedes` | `RESOLVES` | 1.5 | Remediation to finding |
| `derived_from` | `CONFIRMS` | 1.0 | Finding to finding |
| `enabled` | `ESCALATES` | 1.2 | Finding to finding |
| `(new)` | `IN_DIMENSION` | 1.0 | Finding to dimension |
| `(new)` | `IN_FILE` | 1.0 | Finding to file |

### Coverage Graph Schema

#### Database

- Database file: `deep-loop-graph.sqlite`
- Namespace boundary: `spec_folder + loop_type + session_id`
- Loop types: `research`, `review`

#### Table: `coverage_nodes`

- `spec_folder TEXT NOT NULL`
- `loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review'))`
- `session_id TEXT NOT NULL`
- `id TEXT NOT NULL`
- `kind TEXT NOT NULL`
- `name TEXT NOT NULL`
- `content_hash TEXT`
- `iteration INTEGER`
- `metadata TEXT`
- `created_at TEXT DEFAULT (datetime('now'))`
- `updated_at TEXT DEFAULT (datetime('now'))`
- `PRIMARY KEY (spec_folder, loop_type, session_id, id)`

Required indexes:
- `idx_coverage_folder_type(spec_folder, loop_type)`
- `idx_coverage_kind(kind)`
- `idx_coverage_session(spec_folder, loop_type, session_id)`
- `idx_coverage_iteration(iteration)`

Research node kinds and metadata:
- `QUESTION`: `{ text, source, status, iteration_introduced }`
- `FINDING`: `{ text, newInfoRatio, confidence, source_type }`
- `CLAIM`: `{ text, verification_status, promotion_status }`
- `SOURCE`: `{ ref, type, quality_class }`

Review node kinds and metadata:
- `DIMENSION`: `{ name, status }`
- `FILE`: `{ path, lines, hotspot_score, iteration_first_seen }`
- `FINDING`: `{ text, severity, dimension, adversarial_checked }`
- `EVIDENCE`: `{ ref, code_snippet_hash }`
- `REMEDIATION`: `{ text, finding_id, status }`

#### Table: `coverage_edges`

- `spec_folder TEXT NOT NULL`
- `loop_type TEXT NOT NULL`
- `session_id TEXT NOT NULL`
- `id TEXT NOT NULL`
- `source_id TEXT NOT NULL`
- `target_id TEXT NOT NULL`
- `relation TEXT NOT NULL`
- `weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 2.0)`
- `metadata TEXT`
- `created_at TEXT DEFAULT (datetime('now'))`
- `CHECK(source_id != target_id)`
- `PRIMARY KEY (spec_folder, loop_type, session_id, id)`
- `FOREIGN KEY (spec_folder, loop_type, session_id, source_id) REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id)`
- `FOREIGN KEY (spec_folder, loop_type, session_id, target_id) REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id)`

Required indexes:
- `idx_coverage_edge_source(spec_folder, loop_type, session_id, source_id)`
- `idx_coverage_edge_target(spec_folder, loop_type, session_id, target_id)`
- `idx_coverage_edge_relation(relation)`
- `idx_coverage_edge_folder_type(spec_folder, loop_type)`
- `idx_coverage_edge_session(spec_folder, loop_type, session_id)`

#### Table: `coverage_snapshots`

- `id INTEGER PRIMARY KEY AUTOINCREMENT`
- `spec_folder TEXT NOT NULL`
- `loop_type TEXT NOT NULL`
- `session_id TEXT NOT NULL`
- `iteration INTEGER NOT NULL`
- `metrics TEXT`
- `node_count INTEGER`
- `edge_count INTEGER`
- `created_at TEXT DEFAULT (datetime('now'))`
- `UNIQUE(spec_folder, loop_type, session_id, iteration)`

Required indexes:
- `idx_coverage_snapshot_session(session_id)`

Research snapshot metrics:
- `questionCoverage`
- `claimVerificationRate`
- `contradictionDensity`
- `sourceDiversity`
- `evidenceDepth`
- `nodeCount`
- `edgeCount`

Review snapshot metrics:
- `dimensionCoverage`
- `findingStability`
- `p0ResolutionRate`
- `evidenceDensity`
- `hotspotSaturation`
- `nodeCount`
- `edgeCount`

### MCP Tool Contracts

| Tool | Purpose | Required Behavior |
|------|---------|-------------------|
| `deep_loop_graph_upsert` | Reducer writes graph deltas after each iteration | Idempotent node/edge upsert, clamped weights, self-loop rejection, metadata updates on repeated IDs |
| `deep_loop_graph_query` | Structured analysis of graph state | Support `uncovered_questions`, `unverified_claims`, `contradictions`, `provenance_chain`, `coverage_gaps`, and `hot_nodes` |
| `deep_loop_graph_status` | Health and metrics overview | Return node/edge counts, grouped counts, signal values, last iteration, and schema version |
| `deep_loop_graph_convergence` | Composite convergence assessment | Return `decision`, `signals`, `blockers`, and a typed `trace` explaining STOP legality |

Standalone visualization is explicitly deferred to a later phase. Phase 002 only requires the four reducer-facing MCP tools above; dashboards can render summaries from status/convergence outputs and the local derived graph state.

### Convergence Signals

#### Research

Weighted signals:
1. `questionCoverage = count(questions with >= 2 ANSWERS edges) / count(all questions)`
2. `claimVerificationRate = count(claims with status != "unresolved") / count(all claims)`
3. `contradictionDensity = count(CONTRADICTS edges) / count(all edges)`

Blocking guards:
4. `sourceDiversity = average distinct source quality classes per question`
5. `evidenceDepth = average path length from question -> finding -> source`

`sourceDiversity` and `evidenceDepth` are blocking guards, not informational votes. STOP remains blocked when either guard is below threshold, even if the weighted signals look favorable.

#### Review

1. `dimensionCoverage = count(dimensions with >= 1 COVERS edge) / count(all dimensions)`
2. `findingStability = count(findings with 0 CONTRADICTS edges) / count(all findings)`
3. `p0ResolutionRate = count(P0 findings with RESOLVES edge) / count(P0 findings)`
4. `evidenceDensity = average EVIDENCE_FOR edges per finding`
5. `hotspotSaturation = count(hotspot files with >= 2 dimension coverage) / count(hotspot files)`

### Reducer Integration Flow

#### Authority Order and Contract Note

When MCP is unavailable, truth flows in this order: append-only iteration JSONL (`graphEvents`) -> local derived JSON graph rebuilt by the reducer -> SQLite projection maintained by MCP. The current spec deliberately calls out that the reducer/MCP seam is under-specified today; implementation MUST define the exact contract for payload shape, sync model, latency budget, fallback behavior, and replay semantics before reducer integration is considered complete.

1. Agent writes the next iteration report artifact and appends JSONL containing `graphEvents`.
2. Reducer rebuilds and normalizes the local graph model from authoritative JSONL `graphEvents`.
3. If MCP is available and within latency budget, reducer calls `deep_loop_graph_upsert` to mirror the local graph into SQLite projection state.
4. Reducer calls `deep_loop_graph_convergence`.
5. Convergence result is merged into the existing `shouldContinue` decision alongside `newInfoRatio`, with blocker guards able to prevent STOP.
6. Dashboard/synthesis surfaces consume status/convergence summaries plus locally derived graph context.
7. If MCP is unavailable, reducer preserves replayability from JSONL plus the local JSON graph artifact until MCP recovers.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 002 MUST reuse existing Spec Kit Memory graph primitives instead of inventing a second edge or traversal stack. | The implementation plan names `causal-edges.ts`, `graph-signals.ts`, `contradiction-detection.ts`, and `code-graph-db.ts` as the extraction baseline; shared coverage-graph helper files own the adapted logic. |
| REQ-002 | The phase MUST define `deep-loop-graph.sqlite` with the exact `coverage_nodes`, `coverage_edges`, and `coverage_snapshots` schema described in this spec. | Table names, loop-type constraints, unique snapshot key, no-self-loop rule, and indexes are all documented and carried through plan/tasks. |
| REQ-003 | Research coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `QUESTION`, `FINDING`, `CLAIM`, and `SOURCE` are canonical; all listed research relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; research metrics use the defined formulas. |
| REQ-004 | Review coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION` are canonical; all listed review relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; review metrics use the defined formulas. |
| REQ-005 | The Spec Kit Memory MCP server MUST expose the four `deep_loop_graph_*` tools with the contracts defined in this phase. | `upsert`, `query`, `status`, and `convergence` are all represented in handler scope and `tool-schemas.ts`; query types and output shapes are explicit; visualization is explicitly deferred. |
| REQ-006 | Graph convergence MUST contextualize Phase 001 stop logic without replacing `newInfoRatio`. | The phase explicitly states that low novelty plus strong coverage can allow legal STOP, while low novelty plus uncovered questions, unresolved contradictions, or failed coverage guards (`sourceDiversity`, `evidenceDepth`) must block legal STOP. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The deep-research reducer MUST ingest `graphEvents`, persist them, and query graph convergence after each iteration. | `reduce-state.cjs` is named in scope; reducer flow is documented step by step; fallback behavior is defined for MCP-unavailable runs. |
| REQ-008 | Deep-research and deep-review state/convergence references and agents MUST emit graph-native artifacts. | Both state-format reference files document `graphEvents`; both convergence reference files explain graph-aware signals; both agent files instruct iterations to emit graph nodes and edges. |
| REQ-009 | The phase MUST add the listed verification files for shared graph logic and MCP behavior. | `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts`, `coverage-graph-db.vitest.ts`, and `coverage-graph-tools.vitest.ts` all appear in scope and tasks with clear verification targets. |
| REQ-010 | Human-readable graph status summaries MUST be part of the contract, not a debugging afterthought. | `deep_loop_graph_status` returns documented counts and signal summaries suitable for dashboards and synthesis surfaces; standalone visualization is deferred to a later phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: The phase documents the coverage graph as the fourth graph system in the Spec Kit Memory stack and clearly reuses existing graph patterns.
- **SC-002**: The schema for `deep-loop-graph.sqlite` is concrete enough to implement without inventing additional tables or ambiguous fields.
- **SC-003**: Research and review graph ontologies are fully specified, including kinds, relations, initial weight estimates, metadata, convergence metrics, and the requirement to calibrate weights during implementation.
- **SC-004**: The four MCP tools are documented with explicit responsibilities and non-overlapping behavior, and visualization is clearly deferred.
- **SC-005**: The reducer integration path explains the reducer/MCP contract, when graph upsert happens, when convergence is queried, and how fallback authority works.
- **SC-006**: The plan and tasks stay scoped to the concrete file set named in this phase instead of drifting into unrelated workflow or runtime surfaces.
- **SC-007**: Graph-aware convergence is explicitly additive to Phase 001 runtime truth rather than a competing decision channel.
- **SC-008**: Verification covers both shared graph logic and MCP-facing behavior.

### Acceptance Scenarios

1. **Given** a research packet with low novelty and high question coverage, **when** `deep_loop_graph_convergence` runs, **then** it can support legal STOP only if claims are verified and contradictions are within tolerance.
2. **Given** a research packet with low novelty but uncovered questions, **when** convergence is evaluated, **then** the decision must be `STOP_BLOCKED` and the blockers must name the uncovered questions.
3. **Given** a review packet with unresolved contradictory findings, **when** convergence is evaluated, **then** legal STOP is blocked even if iteration novelty has fallen.
4. **Given** the reducer replays the same `graphEvents` twice, **when** `deep_loop_graph_upsert` runs twice, **then** graph state remains idempotent and weights stay clamped.
5. **Given** an operator needs a packet summary, **when** `deep_loop_graph_status` runs, **then** it emits counts and signal summaries suitable for dashboards while standalone visualization remains deferred.
6. **Given** MCP is unavailable mid-run, **when** the reducer processes graph events, **then** it preserves the authority chain `JSONL -> local JSON graph -> SQLite projection` instead of dropping graph state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 remains the canonical stop-decision envelope | High | Keep graph convergence additive and typed so stop legality still flows through Phase 001 decisions. |
| Dependency | Existing memory graph primitives stay stable enough to extract | Medium | Keep extraction seams narrow and validate old behavior through new shared helper tests. |
| Risk | Reuse may still be overestimated after planning | High | Track direct vs adapted reuse explicitly, keep adaptation work visible in plan/tasks, and refuse to label reducer/convergence work as plug-and-play extraction. |
| Risk | Coverage graph reuse drifts into copy-paste instead of extraction | High | Treat shared helper files as the only allowed adaptation layer and map each reuse source explicitly. |
| Risk | Research and review relations diverge in hidden ways | Medium | Centralize relation maps and convergence formulas so only domain ontology changes between loop types. |
| Risk | Graph writes become a replay or performance bottleneck | Medium | Reuse SQLite transaction patterns, support idempotent upsert, and persist iteration snapshots once per iteration. |
| Risk | Reducer/MCP integration may surface latency issues | Medium | Define a latency budget as part of the reducer/MCP contract and preserve local-authority fallback when MCP round-trips exceed budget. |
| Risk | MCP unavailability causes silent graph loss | Medium | Require reducer fallback to a local JSON graph artifact until MCP writes recover. |
<!-- /ANCHOR:risks -->

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Graph upsert plus convergence lookup must be lightweight enough to run after every iteration.
- Snapshot generation must be incremental and tied to iteration boundaries, not full graph reconstruction on every query.
- The reducer/MCP contract must define a concrete latency budget so reducer-local replay remains authoritative if MCP projection becomes too slow.

### Reliability

- Upserts must be idempotent under reducer replay.
- Self-loops must be rejected and invalid weights clamped before persistence.
- Fallback graph persistence must preserve enough state to replay into MCP later.

### Maintainability

- Shared graph behavior must live in the extracted coverage-graph helpers, not be reimplemented separately in reducer or MCP handlers.
- Research/review specialization must happen through explicit relation maps and metric formulas.

---

## 9. EDGE CASES

- A node is emitted with the same ID but updated metadata on a later iteration. Upsert must merge the update without duplicating the node.
- An edge attempts to reference its own source node as target. The upsert contract must reject the self-loop.
- A packet stores both research and review graph data under the same `spec_folder`. `loop_type` isolation must prevent query bleed.
- A graph contains zero questions or zero dimensions. Convergence code must return safe zero-state metrics instead of dividing by zero.
- Contradictions exist but are only partially resolved. Convergence must surface unresolved blockers instead of treating any contradiction edge as a full stop.
- A provenance chain spans repeated nodes. Traversal must detect cycles and return cumulative path strength without infinite recursion.

---

## 10. COMPLEXITY ASSESSMENT

| Axis | Assessment |
|------|------------|
| **Reuse Discipline** | High: the hardest part is preserving proven graph behavior while extracting only the reusable parts. |
| **Schema Design** | Medium-High: the schema is concrete, but it must serve both research and review without leaking one ontology into the other. |
| **Reducer Integration** | High: graph writes, convergence reads, fallback behavior, and `newInfoRatio` interplay all converge in `reduce-state.cjs`. |
| **MCP Surface** | High: four tools plus the reducer/MCP contract still add meaningful handler and schema surface area, even with visualization deferred. |
| **Overall** | High: this phase is foundational for downstream wave execution and offline optimization, so ambiguity costs compound quickly. |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|------------|--------|----------|
| Reuse assumptions hide required adaptation work | Medium | High | Keep reuse percentages explicit and verify shared helper extraction through targeted tests. |
| Graph convergence drifts away from Phase 001 stop legality | Low | High | Treat graph convergence as additive and preserve the typed legal-stop trace as the authority boundary. |
| MCP latency or availability weakens iteration closeout | Medium | Medium | Document the reducer/MCP latency budget and keep the local JSON fallback path explicit. |
| Research and review ontologies diverge in undocumented ways | Medium | Medium | Centralize relation maps and convergence formulas in the shared coverage-graph layer. |

---

## 11. USER STORIES

- As a maintainer of deep research, I want graph-backed convergence signals so I can see unanswered questions, unverified claims, and contradiction hotspots before STOP becomes legal.
- As a maintainer of deep review, I want coverage graph queries that show which files, dimensions, and findings still need evidence so reducer decisions stay explainable.
- As a runtime owner, I want the graph substrate to reuse proven graph primitives with an explicit fallback path so MCP loss does not erase packet-local truth.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking product-scope questions remain for planning.
- Implementation MUST still define the reducer/MCP seam precisely: sync vs async handoff, latency budget, fallback authority behavior, and replay semantics.
- Implementation should confirm the exact handler registration touchpoints in the current MCP server runtime, but that is now part of the contract-definition prerequisite rather than an afterthought.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- Parent packet specification: `../spec.md`
- Parent packet plan: `../plan.md`
- Predecessor phase: `../001-runtime-truth-foundation/spec.md`
- Successor phase: `../003-wave-executor/spec.md`
