# Iteration 033: TESTING STRATEGY

## Focus
TESTING STRATEGY: How should we test the adopted patterns? Unit tests, integration tests, memory quality regression tests. Concrete test plans.

## Findings

### Finding 1: Storage-layer invariants should be the first gate for any hygiene or thread-key adoption
- **Source**: `001-engram-main/external/internal/store/store_test.go` [SOURCE: `001-engram-main/external/internal/store/store_test.go:68-110`; `001-engram-main/external/internal/store/store_test.go:112-169`; `001-engram-main/external/internal/store/store_test.go:261-311`; `001-engram-main/external/internal/store/store_test.go:543-590`; `001-engram-main/external/internal/store/store_test.go:869-930`]
- **What it does**: Engram uses real-store tests to lock down duplicate reuse, `duplicate_count`, scope-filtered search/context, topic-key normalization, topic upsert `revision_count`, and passive-capture dedupe.
- **Why it matters**: For Public, any adopted `thread_key`/exact-key lane, recent-session digest persistence, hygiene counters, or passive/session-end save wrapper will fail in subtle ways at the DB boundary before they fail at the handler boundary. **Concrete plan:** add fixture-backed storage tests for duplicate reuse vs new-row creation, normalized key reuse, governed-scope isolation, soft-delete exclusion from search/context, and session-summary persistence into resume-visible state.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: MCP surface changes need contract tests, not just implementation tests
- **Source**: `001-engram-main/external/internal/mcp/mcp_test.go`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts` [SOURCE: `001-engram-main/external/internal/mcp/mcp_test.go:921-1231`; `001-engram-main/external/internal/mcp/mcp_test.go:1249-1319`; `001-engram-main/external/internal/mcp/mcp_test.go:1339-1490`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:50-135`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77-122`]
- **What it does**: Engram tests profile allowlists, profile non-overlap, core-vs-deferred tool annotations, and default project-scoped session IDs; Public already tests `session_resume`/`session_bootstrap` payload contracts, stale-graph hints, and minimal-mode behavior.
- **Why it matters**: If Public adopts thin agent/admin tool bundles, a one-command runtime setup layer, or an additive recent-session digest, the public MCP contract becomes the product. **Concrete plan:** add contract tests for tool visibility, annotation flags, feature-flagged digest fields, payload stability in full/minimal modes, and failure-mode hints when graph/memory subsystems are stale or unavailable.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Passive capture and session-close behavior should be tested as end-to-end save flows
- **Source**: `001-engram-main/external/internal/store/store_test.go`; `001-engram-main/external/internal/mcp/mcp_test.go` [SOURCE: `001-engram-main/external/internal/store/store_test.go:803-930`; `001-engram-main/external/internal/store/store_test.go:1427-1480`; `001-engram-main/external/internal/mcp/mcp_test.go:1351-1462`]
- **What it does**: Engram tests passive extraction counts, saved vs duplicate counts, missing-session failure, persisted end-session summaries, timeline defaults, and automatic project-scoped session creation from save/session-summary/passive handlers.
- **Why it matters**: Prior iterations already ranked passive capture and explicit lifecycle wrappers as possible additions. Those should not ship with parser-only coverage. **Concrete plan:** when prototyping these features in Public, add end-to-end cases for extracted/saved/duplicate counters, governance/provenance enforcement, default-session fallback, session-end summary visibility in resume/bootstrap, and dedupe against existing saved memories.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 4: Public already has the right memory-quality regression harness; it should become the promotion gate
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:4-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:52-77`; `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:170-196`; `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:218-260`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1-12`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:45-77`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:455-617`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:703-787`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:908-1150`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1-12`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:117-149`]
- **What it does**: Public already supports channel ablation, ground-truth alignment checks, Recall@20 deltas, multi-metric reporting/storage, and per-channel attribution logging.
- **Why it matters**: This is the strongest reusable testing asset for adopted patterns. **Concrete plan:** build a fixed eval pack with exact-artifact queries, concept queries, startup/resume queries, trigger-heavy prompts, and future thread-key lookups; run shadow ablations before promoting lexical boosts, digest-derived boosts, trigger weighting, or graph-context changes.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: The main testing gap in Public is reusable stateful fixtures, not missing assertions
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:23-24`; `.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:46-124`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:70-133`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:144-332`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:208-257`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:15-84`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:221-418`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:90-154`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`]
- **What it does**: Public has some deferred DB-dependent suites and some source-inspection tests, but it also already proves that full fixture-backed save and lineage tests are feasible and valuable.
- **Why it matters**: The adopted patterns now span search, save, lineage, governance, and startup continuity. **Concrete plan:** build one reusable seeded-fixture harness that can provision `memory_index`, eval DB rows, governed scope fields, trigger cache fixtures, and session/bootstrap inputs; then use it to un-defer trigger/save integration tests and add full-path tests for `generate-context.js`-produced memories, lineage supersedes, and governed resume/search behavior.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `001-engram-main/external/internal/store/store_test.go:68-110`
- `001-engram-main/external/internal/store/store_test.go:112-169`
- `001-engram-main/external/internal/store/store_test.go:261-311`
- `001-engram-main/external/internal/store/store_test.go:803-930`
- `001-engram-main/external/internal/store/store_test.go:1427-1480`
- `001-engram-main/external/internal/mcp/mcp_test.go:921-1231`
- `001-engram-main/external/internal/mcp/mcp_test.go:1249-1319`
- `001-engram-main/external/internal/mcp/mcp_test.go:1339-1490`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:50-135`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77-122`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:4-20`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:455-617`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:117-149`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:221-418`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:90-203`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:144-332`
- `.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:23-124`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:208-257`

## Assessment
- **New information ratio**: 0.56
- **Questions addressed**: storage-level unit strategy; MCP integration strategy; passive/session lifecycle coverage; retrieval-quality regression strategy; save/lineage fixture strategy
- **Questions answered**: which adopted patterns need DB-backed invariants first; which need MCP contract tests; how to regression-test ranking changes; where Public already has eval/save/lineage scaffolding; what missing fixture layer is blocking fuller end-to-end coverage
- **Novelty justification**: Prior iterations identified which ideas to adopt; this iteration turns them into a layered verification plan and identifies Public’s real bottleneck as reusable stateful fixtures, not missing ranking metrics.

## Ruled Out
- Relying on source-string assertions alone for retrieval changes — useful for smoke coverage, but insufficient for ranking, governance, or session-continuity behavior [`memory-search-integration.vitest.ts:208-257`].
- Copying Engram’s coarse `project`/`personal` scope test matrix as-is — Public must test tenant/user/agent/shared-space boundaries too [`001-engram-main/external/internal/store/store_test.go:112-169`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-331`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`].
- Treating memory quality as manual QA — Public already has better automated ablation machinery, so ranking changes should not rely on ad hoc spot checks [`ablation-framework.ts:4-20,52-77`; `ablation-framework.vitest.ts:455-617`].

## Reflection
- **What worked**: Reading Engram’s test files before rereading more production code surfaced the intended behavioral guarantees fastest; then comparing them directly to Public’s existing test/eval suites made the missing layers obvious.
- **What did not work**: The packet brief still referenced a nonexistent `external/engram-main` subtree and missing reducer state files, so direct state-file continuity from the phase folder was not usable.
- **What I would do differently**: On the next pass, start from the real `external/` root and immediately split findings into three bins — storage invariants, MCP contracts, and quality regressions — to reduce search noise.

## Recommended Next Focus
Implementation rollout and acceptance criteria: define the shadow-mode thresholds, fixture datasets, and pass/fail gates for promoting the adopted patterns into Public without regressing resume quality, exact-artifact lookup, or governed memory isolation.


Total usage est:        1 Premium request
API time spent:         4m 36s
Total session time:     4m 54s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.5m in, 16.7k out, 1.4m cached, 7.9k reasoning (Est. 1 Premium request)
