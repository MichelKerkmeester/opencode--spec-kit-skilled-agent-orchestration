# Recommendations: Turso Migration and HydraDB-Inspired Roadmap for system-spec-kit

## Executive Summary

The best path is a staged migration that separates immediate operational value from higher-risk retrieval engine changes. In practical terms: first create a real adapter boundary, then add libSQL/Turso connectivity while preserving current query semantics, then use Turso branching and replica/sync for team workflows, and only after parity benchmarks evaluate Turso-specific FTS and vector primitives.

This ordering protects current behavior in hybrid retrieval, deferred lexical indexing, causal traversal, and quality-aware save paths while still unlocking near-term wins like shared cloud memory, branch-per-spec databases, and local-fast/remote-shared operation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]

HydraDB-inspired capabilities should be treated as explicit roadmap outcomes, not automatic effects of backend migration. Turso enables them operationally but does not implement evolving state models, timeline-aware memory semantics, or hierarchical tenant governance by itself. (https://hydradb.com/manifesto, https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents)

[Assumes: the requested feature catalog path refers to 022-hybrid-rag-fusion/012-feature-catalog materials because /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion-refinement/feature_catalog/feature_catalog.md does not exist in this workspace.]

[Assumes: HydraDB and Cortex references describe the same product branding based on public site content.]

[Assumes: no public HydraDB source repository was available during this research, so HydraDB architecture is inferred from public site and blog materials.]

## Prioritized Plan by Impact vs Effort

| Phase | Priority | Impact | Effort | Why now |
|---|---|---|---|---|
| P0 Adapter abstraction | Highest | Very high | Medium | Removes hard blocker for backend portability |
| P1 libSQL/Turso connection path | Highest | High | Medium | Enables cloud-backed state without full query rewrite |
| P2 Branching for sandboxes | High | High | Low | Immediate workflow and QA isolation gains |
| P3 Embedded replicas + sync | High | High | Medium | Local-fast + shared-state operating mode |
| P4 Versioned memory + tenant boundaries | Medium | Very high | High | Hydra-inspired differentiation and governance |
| P5 Tantivy/native vector evaluation | Medium | Medium to high | Medium | Performance upside, but only after parity proof |

## P0: Finish Real Adapter Boundaries (Storage, Lexical, Vector)

### Objective

Decouple core memory logic from concrete SQLite APIs before any backend swap.

### Concrete work

1. Introduce production interfaces for storage (`MemoryStore`), lexical search (`LexicalSearchAdapter`), vector search (`VectorSearchAdapter`), and transaction/sync hooks.
2. Move current SQLite behavior behind adapter implementations without changing existing external tool contracts.
3. Keep current SQL behavior as default reference implementation (FTS5 weighted BM25, sqlite-vec path, `embedding_status` gating).

Current code and docs show this as planned but deferred; making it real is the key prerequisite. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md:16-17] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:192-291] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]

### Exit criteria

- No direct `better-sqlite3` references in orchestration layers.
- Stage1, save pipeline, and ingest queue call adapters instead of concrete DB handles.
- Regression tests pass with identical ranking snapshots on reference datasets.

## P1: Add libSQL/Turso Connection Path with Parity Guardrails

### Objective

Enable Turso connectivity without changing retrieval quality expectations yet.

### Concrete work

1. Build libSQL adapter implementation that supports current schema and query responsibilities.
2. Preserve deferred lexical-only indexing semantics and embedding lifecycle state transitions. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:14-17]
3. Preserve save-path guarantees: per-folder locking, dedup by content hash/path, chunking behavior, quality-gate flow. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]
4. Keep ingest-job lifecycle semantics stable (`queued -> parsing -> embedding -> indexing -> complete/failed/cancelled`). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255]

### Risk controls

- Parity harness: compare top-k retrieval overlap and score-order drift per intent type.
- Fallback strategy: if libSQL path fails, route to current local SQLite adapter for that request.
- Readiness gate: no promotion to default until parity target is met on representative workloads.

## P2: Enable Turso Branching for Spec/PR Sandboxes

### Objective

Use branching as an operational capability before deep retrieval rewrites.

### Concrete work

1. Create branch naming convention tied to spec folder/PR id.
2. Wire test and QA pipelines to spawn and teardown branch DBs.
3. Add budget and lifecycle policy to avoid branch sprawl.

Docs indicate branch DBs can be created from existing DB or snapshots, with explicit cleanup and quota implications. This is low-effort, high-leverage process value. (https://docs.turso.tech/features/branching)

### Exit criteria

- Every integration run can target isolated DB branch.
- Team can reproduce memory-index bugs using branch snapshots.
- Branch lifecycle automation exists (create, tag, cleanup).

## P3: Adopt Embedded Replicas and Sync for Local-First Shared Memory

### Objective

Reach local-fast and shared-state mode for MCP workloads.

### Concrete work

1. Add environment profile for embedded replica mode (`path`, `url`, `authToken`, `syncInterval`).
2. Choose sync policy per workflow (manual `pull/push/sync` vs scheduled sync).
3. Implement conflict strategy for last-push-wins risk in write-heavy sessions.
4. Add operational constraints in runtime docs: avoid opening local DB out-of-band during active sync; avoid serverless/filesystem-less deployment for this mode.

Public docs and local snapshot support these requirements and constraints. (https://docs.turso.tech/features/embedded-replicas/introduction, https://docs.turso.tech/sync/usage) [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/bindings/javascript/sync/README.md:15-50]

### Exit criteria

- Median query latency in local mode remains near current baseline.
- Cross-device state propagation is reliable under expected sync intervals.
- Conflict incidents are observable and bounded.

## P4: Build HydraDB-Inspired Features on Top of Turso Foundation

### Objective

Deliver real state-intelligent memory features, not just storage migration.

### Recommended feature set

1. Versioned memory state objects
- Extend history from event log to retrievable state versions with lineage metadata.
- Keep current history table as immutable audit base and add state snapshots per logical memory id. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204]

2. Timeline-aware retrieval policy
- Blend FSRS retrievability, access recency, and causal graph proximity into explicit timeline correctness scoring.
- Reuse existing FSRS and access tracker signals instead of inventing a separate temporal stack. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218]

3. Hierarchical tenant boundaries
- Add explicit user/agent/workspace scoping columns and policy checks at query/save time.
- Use current artifact routing and spec-folder scoping as intermediate stepping stones. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:12-148]

4. Shared learning and retrieval feedback loops
- Persist retrieval feedback events and periodically update weighting profiles per tenant/agent class.
- Start with safe bounded reweighting before automated policy mutation.

Hydra public materials justify these themes as strategic direction. (https://hydradb.com/, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures)

### Exit criteria

- Version lineage query API exists.
- Retrieval can request time-scoped state.
- Tenant boundaries are enforceable and audited.

## P5: Evaluate Turso-Native FTS and Vector Primitives After Benchmarks

### Objective

Only adopt Turso-specific retrieval primitives where they beat parity baseline under realistic workloads.

### Concrete work

1. FTS evaluation
- Compare existing FTS5 weighted behavior vs Turso `USING fts` and `fts_score` semantics.
- Tune tokenizer and field weights to reduce ranking drift.

2. Vector evaluation
- Measure brute-force vector distance cost at realistic scale.
- Do not claim ANN parity until indexed vector path is available and validated.

3. Decision gate
- Promote Turso-native retrieval only if quality and latency meet threshold.

Evidence supports caution: local Turso snapshot documents brute-force vector search; docs show rich vector functions but not a guaranteed indexed ANN path for all deployments. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:9-12] [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:193-203] (https://docs.turso.tech/guides/vector-search)

## Risks and Mitigations

1. Ranking regressions from lexical engine differences
- Mitigation: parity harness, intent-segmented benchmark set, safe fallback to baseline adapter.

2. Sync conflict corruption in collaborative edits
- Mitigation: scoped write ownership, conflict detection logs, optional merge queue for high-value tiers.

3. Operational cost growth from branch proliferation
- Mitigation: branch TTL policies, automated cleanup jobs, quota dashboards.

4. Premature feature divergence
- Mitigation: preserve public MCP contract and reference behavior through P1-P3 before P4 expansion.

## Suggested Implementation Sequencing

1. Week 1-2: P0 adapter interfaces and SQLite reference implementation extraction.
2. Week 3-4: P1 libSQL/Turso connection path with parity harness and safety fallback.
3. Week 5: P2 branch-based sandbox rollout for CI and manual QA.
4. Week 6-7: P3 embedded replica and sync pilot for selected workflows.
5. Week 8+: P4 versioned-state and tenant boundary slices, then P5 optimization experiments.

## Final Recommendation

Commit to migration, but with strict phase gates. The fastest safe value comes from operational capabilities (shared, branchable, sync-aware memory). Retrieval engine changes should remain benchmark-gated. Hydra-inspired intelligence should be planned as explicit product features on top of this new operational base, not treated as automatic outcomes of moving from SQLite to Turso.
