# Iteration 033: TESTING STRATEGY

## Focus
TESTING STRATEGY: How should we test the adopted patterns? Unit tests, integration tests, memory quality regression tests. Concrete test plans.

## Findings

### Finding 1: The integrity lane should use **fixture-driven lexical unit suites**, not broad end-to-end tests
- **Source**: prior adopt-now scope plus Mex’s own checker/parser tests [SOURCE: `research/iterations/iteration-032.md:50-89`; `external/test/claims.test.ts:23-129`; `external/test/checkers.test.ts:40-118`; `external/test/checkers.test.ts:122-160`; `external/test/checkers.test.ts:164-202`; `external/test/checkers.test.ts:260-301`; `external/test/markdown.test.ts:18-85`; `external/test/scanner.test.ts:26-143`]
- **What it does**: Mex proves its drift layer with tiny temp-dir fixtures and deterministic parser/checker assertions: path extraction, placeholder suppression, negated sections, frontmatter edges, missing commands/dependencies, and index-sync orphan/missing cases.
- **Why it matters**: our adopt-now slice is the lexical integrity lane, so Spec Kit should copy the **test shape**, not Mex’s whole product. The safest first lane is pure fixture coverage for `path`, `edges`, and `index-sync`, including Spec Kit-specific alias normalization and scope controls.
- **Concrete test plan**:
  - Add an `integrity-unit` lane for claim extraction + checker behavior.
  - Seed fixtures for: valid path/edge/index; missing path; dead edge; orphan index entry; missing index entry.
  - Add false-positive guards for: `<name>` and `[slug]` placeholders, `example_*` / `your_*` placeholders, HTML comments, negated headings, example pattern files, and alias-equivalent `.opencode/specs/...` vs `specs/...` paths.
  - Assert exact **issue code**, **severity**, and **normalized target path** for every seeded case.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: The guided maintenance surface should be tested as **contract integration** around existing authority boundaries
- **Source**: prior adopt-now wrapper direction plus current Spec Kit handler tests [SOURCE: `research/iterations/iteration-032.md:50-89`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:221-347`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:333-440`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:39-147`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:72-123`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:10-162`; `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:50-153`; `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:1-220`; `.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326-330`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52-69`]
- **What it does**: Spec Kit already has strong contract tests for duplicate no-op saves, deferred embedding, confirmation-only `memory_health`, `session_bootstrap` stale/fresh routing, session-state persistence in `memory_context`, code-graph full-reindex vs incremental behavior, and `generate-context` CLI target authority.
- **Why it matters**: a thin maintenance surface or future `spec-kit doctor` should be tested by proving it **preserves** these contracts, not by inventing a new opaque end-to-end flow. The key risk is accidental mutation or authority drift.
- **Concrete test plan**:
  - Add a `contract-integration` lane covering:
    1. `memory_save` dry-run vs write vs duplicate no-op
    2. `memory_health` autoRepair confirmation-only behavior
    3. `session_bootstrap` fresh vs stale structural responses
    4. `memory_context` routing and spec-folder/session persistence
    5. `code_graph_scan` HEAD-change full reindex vs incremental deleted-file cleanup
    6. `generate-context.js` explicit CLI target precedence over payload/default resolution
  - Pass bar: exact response-envelope fields remain stable, and non-mutating flows do **not** write, clear caches, or trigger repair side effects.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Retrieval quality needs a **fixed regression corpus with metrics and per-channel attribution**
- **Source**: existing eval/logging/ablation tests [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1-150`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1-121`; `.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:41-162`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1-12`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:44-153`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:177-227`; `.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:1-10`; `.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:83-149`; `.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:154-236`]
- **What it does**: Spec Kit already has pure metric tests for `MRR`, `NDCG`, `Recall`, and `Hit Rate`, plus eval logging and ablation infrastructure that records per-channel contributions and `Recall@20` deltas.
- **Why it matters**: the adopted maintenance/integrity work will eventually touch retrieval context and operator trust. Unit correctness will not catch “results got worse but still look valid” regressions; only a stable eval corpus with channel attribution will.
- **Concrete test plan**:
  - Add a `quality-regression` lane with a fixed query set spanning `memory_search`, `memory_context`, and trigger retrieval.
  - For every run:
    1. compute `Recall@20`, `MRR@5`, and `NDCG@10`
    2. assert eval rows exist for final results and per-channel rows
    3. run ablation for `vector`, `bm25`, `fts5`, `graph`, and `trigger`
  - Suggested failure thresholds for merge-blocking runs:
    - `Recall@20` drop > **3 percentage points**
    - `MRR@5` drop > **2 percentage points**
    - any missing per-channel attribution rows
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: Adaptive ranking and learned-feedback changes belong in a **shadow replay lane**, not the default merge gate
- **Source**: shadow evaluation runtime and trigger reliability tests [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:138-219`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:144-210`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:212-260`]
- **What it does**: Spec Kit already has a holdout replay model that samples past queries from logs, reruns ranking, compares deltas, and avoids repeated evaluation within the same window. The trigger layer also guards “no match” and degraded-matching paths so telemetry remains complete.
- **Why it matters**: adaptive ranking, learned feedback, and shadow tuning are valuable, but they are less deterministic than lexical integrity or handler-envelope contracts. They should measure production-like behavior without becoming a flaky pre-merge blocker.
- **Concrete test plan**:
  - Keep a `shadow-replay` lane as nightly or release-candidate coverage.
  - Replay a bounded holdout query set from logged usage.
  - Compare production vs shadow `MRR`/`NDCG` deltas and record promoted/demoted IDs.
  - Require scheduler windowing and no duplicate-cycle thrash.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `research/iterations/iteration-032.md:50-89`
- `external/package.json:36-41`
- `external/test/claims.test.ts:23-129`
- `external/test/checkers.test.ts:40-118`
- `external/test/checkers.test.ts:122-160`
- `external/test/checkers.test.ts:164-202`
- `external/test/checkers.test.ts:260-301`
- `external/test/markdown.test.ts:18-85`
- `external/test/scanner.test.ts:26-143`
- `.opencode/skill/system-spec-kit/mcp_server/package.json:17-29`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:221-347`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:333-440`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:39-147`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:72-123`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:10-162`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:50-153`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1-150`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1-121`
- `.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:41-162`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1-12`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:44-153`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:177-227`
- `.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:1-10`
- `.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:83-236`
- `.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:138-219`
- `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:1-220`
- `.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326-330`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52-69`

## Assessment
- **New information ratio**: 0.17
- **Questions addressed**: how to test the integrity lane; how to test the thin maintenance surface without changing authority; how to catch retrieval-quality regressions; where adaptive/shadow evaluation belongs
- **Questions answered**: the right structure is a three-lane core plan — fixture-driven lexical unit tests, contract integration tests around existing handlers/scripts, and metric-plus-ablation quality regression — with shadow replay reserved for prototype-later adaptive work
- **Novelty justification**: prior iterations identified what to build, but this pass maps each adopted slice to exact existing test harnesses, response contracts, and measurable pass bars

## Ruled Out
- A single end-to-end “doctor works” suite as the main safety signal, because both Mex and Spec Kit already separate lexical correctness, handler contracts, and ranking quality into different testable concerns.
- Using one blended drift/health score as the main regression gate, because it hides whether the failure came from integrity parsing, wrapper behavior, or retrieval ranking.
- Making live-provider or live-embedding behavior part of the default merge-blocking lane, because the existing strongest tests are deterministic fixtures, mocks, and replay-based evaluation.

## Reflection
- **What worked**: reading the external and local test suites directly was the fastest route, because the testing strategy is encoded more clearly in tests than in README prose
- **What did not work**: memory-context retrieval and file writes were permission-denied in this session, so I had to rely on direct source inspection and could not persist the repaired iteration artifact
- **What I would do differently**: turn this into a literal acceptance matrix next, with one file target, one fixture corpus, and one pass/fail threshold per lane

## Recommended Next Focus
Convert the plan into implementation-ready slices:
1. add the `integrity-unit` fixture corpus for `path`, `edges`, and `index-sync`
2. add the guided-surface contract suite around `memory_save`, `memory_health`, `session_bootstrap`, `memory_context`, `code_graph_scan`, and `generate-context.js`
3. lock a fixed eval corpus and explicit `Recall@20` / `MRR@5` thresholds for the regression lane

## Accumulated Findings Summary

### Finding 1: Testing should mirror the rollout sequence, not collapse into one generalized suite
- **Source**: `research/iterations/iteration-032.md:50-89`; `external/test/checkers.test.ts:40-301`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:221-347`; `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1-227`
- **What it does**: the adopt-now integrity lane gets deterministic fixture tests, the adopt-now maintenance surface gets contract integration tests, and retrieval-quality changes get metric/ablation regression coverage; shadow replay stays prototype-later
- **Why it matters**: this keeps Q1 implementation safe and measurable without mixing lexical correctness, authority preservation, and ranking experiments into one noisy gate
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary


Total usage est:        1 Premium request
API time spent:         4m 10s
Total session time:     4m 30s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.8m in, 17.0k out, 1.7m cached, 9.3k reasoning (Est. 1 Premium request)
