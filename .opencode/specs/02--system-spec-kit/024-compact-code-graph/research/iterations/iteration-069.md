# Iteration 69: Testing Strategy for Proposed Code Graph Improvements

## Focus
Design a comprehensive testing strategy for the improvements identified across iterations 56-67, grounded in the existing vitest patterns found in `mcp_server/tests/`. This iteration covers: endLine fix, new edge types, auto-enrichment interceptor, stale-on-read mechanism, cross-runtime fallback, MCP first-call priming, and end-to-end integration.

## Findings

### 1. Existing Code Graph Test Coverage Is Narrow But Well-Patterned

The test suite at `mcp_server/tests/` contains ~100+ vitest files. Code-graph-specific tests include:
- `code-graph-indexer.vitest.ts` -- Tests `parseFile()`, `extractEdges()`, `generateSymbolId()`, `generateContentHash()`, `detectLanguage()`, `getDefaultConfig()`. Uses inline string content passed directly to `parseFile()` (no file I/O). Tests parseHealth, node filtering by kind, edge type checking.
- `budget-allocator.vitest.ts` -- Tests `allocateBudget()`, `createDefaultSources()`, `DEFAULT_FLOORS`. Uses numeric content sizes, asserts budget caps, floor guarantees, overflow redistribution.
- `graph-flags.vitest.ts` -- Tests feature flag `isGraphUnifiedEnabled()` with env var save/restore in `beforeEach`/`afterEach`.
- `graph-regression-flag-off.vitest.ts`, `graph-roadmap-finalization.vitest.ts`, `graph-scoring-integration.vitest.ts`, `graph-calibration.vitest.ts`, `graph-lifecycle.vitest.ts`, `graph-search-fn.vitest.ts`, `graph-signals.vitest.ts` -- Cover causal graph signals, scoring, lifecycle, and search function integration.

**Key pattern**: Tests import directly from source modules (no test harness abstraction), use inline content strings for parsing, and `process.env` save/restore for feature flags. No mocking framework beyond vitest builtins.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:1-146]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:1-67]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts:1-47]

### 2. endLine Fix Test Design -- 8 Test Cases

The endLine bug (all parsers set `endLine = startLine`) is confirmed in `structural-indexer.ts` line 41: `endLine: lineNum`. After the brace-counting fix, tests should validate:

**File: `code-graph-endline-fix.vitest.ts`**

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| 1 | Single-line function | `function f() {}` | endLine === startLine |
| 2 | Multi-line TS function | `function f() {\n  return 1;\n}` (3 lines) | endLine = startLine + 2 |
| 3 | Nested braces in TS | `function f() {\n  if (x) {\n    y();\n  }\n}` (5 lines) | endLine = startLine + 4 |
| 4 | Arrow function multi-line | `const f = (\n) => {\n  return 1;\n};` (4 lines) | endLine = startLine + 3 |
| 5 | Python indentation-based | `def f():\n    if x:\n        pass\n    return 1` (4 lines) | endLine = startLine + 3 |
| 6 | Python nested class method | `class C:\n    def m(self):\n        pass` (3 lines) | Class endLine covers method |
| 7 | Class with methods (TS) | `class C {\n  m1() {}\n  m2() {\n    return;\n  }\n}` (6 lines) | Class endLine = startLine + 5 |
| 8 | String with braces (false positive guard) | `function f() {\n  const s = "{}";\n}` (3 lines) | endLine = startLine + 2 (not confused by string braces) |

**Implementation pattern**: Follows existing `parseFile()` test style -- inline content strings, assert `result.nodes[i].endLine` values directly.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:41]
[INFERENCE: Test cases designed from endLine bug analysis in iterations 056, 060]

### 3. New Edge Type Test Design -- DECORATES, OVERRIDES, TYPE_OF

From iteration 060, three new edge types need concrete regex patterns. Tests should validate extraction accuracy:

**File: `code-graph-edge-types.vitest.ts`**

**DECORATES edge** (Python @decorator pattern, 0.85 confidence):
| # | Input | Expected Edge |
|---|-------|---------------|
| 1 | `@app.route("/api")\ndef handler():` | DECORATES from `app.route` to `handler` |
| 2 | `@staticmethod\ndef helper():` | DECORATES from `staticmethod` to `helper` |
| 3 | `@property\ndef name(self):` | DECORATES from `property` to `name` |
| 4 | No decorator | No DECORATES edges emitted |

**OVERRIDES edge** (class method overriding parent, 0.7-0.95 confidence):
| # | Input | Expected Edge |
|---|-------|---------------|
| 1 | `class Parent:\n  def run(self):\n    pass\nclass Child(Parent):\n  def run(self):` | OVERRIDES from `Child.run` to `Parent.run` |
| 2 | TS with `override` keyword: `class C extends B { override method() {} }` | OVERRIDES edge detected from keyword |
| 3 | Method with same name but no inheritance | No OVERRIDES edge |

**TYPE_OF edge** (typed variables, params, returns, 0.85 confidence):
| # | Input | Expected Edge |
|---|-------|---------------|
| 1 | `const x: MyType = ...` | TYPE_OF from `x` to `MyType` |
| 2 | `function f(arg: Config): Result {}` | TYPE_OF from `arg` to `Config`, return TYPE_OF to `Result` |
| 3 | Python type hint: `def f(x: int) -> str:` | TYPE_OF from `x` to `int`, return to `str` |

[INFERENCE: Edge type designs from iteration 060 regex patterns + iteration 066 S-expression queries]

### 4. Auto-Enrichment Interceptor Test Design

From iterations 057 and 061, auto-enrichment uses the `memory-surface.ts` pattern with a `GRAPH_AWARE_TOOLS` set. Testing this requires mocking the tool dispatch layer.

**File: `code-graph-auto-enrichment.vitest.ts`**

| # | Test Case | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Enrichment fires for graph-aware tool | Mock `code_graph_query` call, mock graph DB with symbols | Response includes graph context in envelope |
| 2 | Enrichment skips for non-graph tools | Call `memory_search` | No graph context appended |
| 3 | Recursion guard (GRAPH_AWARE_TOOLS) | Call `code_graph_context` (which is itself graph-aware) | Does NOT recursively auto-enrich |
| 4 | File path hint extraction | Request with `filePath` parameter | `extractFilePathHint()` returns correct path |
| 5 | Latency budget: async-parallel | Mock slow graph query (>250ms) | Enrichment runs in parallel, does not block response |
| 6 | Empty graph (cold start) | No indexed files | Enrichment gracefully returns empty, no error |

**Test pattern**: Use `vi.fn()` to mock the graph DB and timer functions. Follow the existing pattern in `mcp-tool-dispatch.vitest.ts` for handler mocking.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts (pattern reference)]
[INFERENCE: Design from iteration 057 (three-tier architecture) and iteration 061 (dispatch pass-through analysis)]

### 5. Stale-on-Read Mechanism Test Design

From iteration 067, per-file staleness checking uses `mtime` fast-path with content hash fallback.

**File: `code-graph-staleness.vitest.ts`**

| # | Test Case | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Fresh file (mtime unchanged) | DB mtime matches file mtime | `isFileStale()` returns false, no reindex |
| 2 | Stale file (mtime changed) | DB mtime < file mtime | Returns true, triggers reindex |
| 3 | Missing file (deleted) | File in DB but not on disk | Returns stale + skip (no crash) |
| 4 | New file (not in DB) | File exists on disk but no DB entry | Returns stale, triggers index |
| 5 | Batch threshold: sync vs async | 1 stale file = sync, 4+ stale files = async | Sync returns inline, async returns Promise |
| 6 | `ensureFreshFiles()` end-to-end | 3 files: 1 fresh, 1 stale, 1 missing | Reindexes stale, skips fresh, handles missing |
| 7 | mtime fast-path precision | Two files same content, different mtime | mtime alone triggers reindex (conservative) |

**Test pattern**: Use `vi.spyOn(fs, 'statSync')` to mock file mtimes. Create temp DB entries with known timestamps.

[INFERENCE: Design from iteration 067 (stale-on-read mechanism) and memory system's incremental-index.ts mtime pattern]

### 6. Cross-Runtime Fallback Testing Without Actual Runtimes

The four-tier fallback (T1 hooks, T1.5 MCP first-call priming, T2 instruction-file triggers, T3 commands, T4 Gate 1 auto) cannot rely on having Claude/Codex/Gemini runtimes available in CI.

**Strategy: Environment simulation + unit isolation**

| Tier | Test Approach | Mock |
|------|--------------|------|
| T1 (hooks) | Existing hook tests in `hooks/claude/` -- test script I/O | Stdin JSON, verify stdout format |
| T1.5 (first-call priming) | Unit test `FirstCallTracker` singleton | `resolveTrustedSession()` returns `{trusted: false, requestedSessionId: null}` to simulate non-hook client |
| T2 (instruction-file) | Verify CODEX.md / CLAUDE.md contain correct trigger instructions | Static file content assertion (grep for `memory_context` call patterns) |
| T3 (commands) | Test `/spec_kit:resume` YAML parsing and dispatch | Mock command executor, verify `memory_context` call shape |
| T4 (Gate 1) | Test `memory_match_triggers` handler with prompt input | Standard handler test with mock DB |

**File: `code-graph-cross-runtime.vitest.ts`**

Key test: **First-call priming detection**
```
describe('FirstCallTracker', () => {
  it('detects non-hook session: trusted=false, no requestedSessionId', () => {
    // Simulate resolveTrustedSession returning non-hook indicators
    // Assert priming injection fires on first tool call
  });
  it('skips priming for hook-based session (trusted=true)', () => {
    // Hook sessions get context via SessionStart hook, no double-inject
  });
  it('fires only once per logical session (TTL-based)', () => {
    // First call: primes. Second call within TTL: skips.
  });
});
```

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts (resolveTrustedSession)]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts (pattern)]
[INFERENCE: From iteration 062 (MCP first-call priming) and iteration 058 (four-tier fallback)]

### 7. Integration Test Design: Scan to Query to Context to Compact Merge

End-to-end test covering the full code graph pipeline.

**File: `code-graph-integration-e2e.vitest.ts`**

```
describe('Code Graph E2E Pipeline', () => {
  // Setup: create temp directory with known source files
  // Teardown: remove temp directory and DB

  it('scan → query → context: full pipeline', async () => {
    // 1. SCAN: Index 3 files (TS function, Python class, JS module)
    const scanResult = await codeScan({ rootDir: tmpDir });
    expect(scanResult.filesIndexed).toBe(3);

    // 2. QUERY: outline for one file
    const outline = await codeQuery({ operation: 'outline', subject: 'test.ts' });
    expect(outline.symbols.length).toBeGreaterThan(0);

    // 3. QUERY: calls_from for a function
    const calls = await codeQuery({ operation: 'calls_from', subject: 'myFunc' });
    expect(calls.edges).toBeDefined();

    // 4. CONTEXT: neighborhood expansion
    const ctx = await codeContext({
      seeds: [{ provider: 'manual', symbolName: 'myFunc' }],
      queryMode: 'neighborhood',
      budgetTokens: 1200
    });
    expect(ctx.compactOutput.length).toBeLessThanOrEqual(1200 * 4); // chars approx

    // 5. Verify token budget enforcement
    expect(ctx.tokenEstimate).toBeLessThanOrEqual(1200);
  });

  it('stale file triggers reindex on query', async () => {
    // 1. Scan initial state
    // 2. Modify file content (change function signature)
    // 3. Query — staleness check detects mtime change
    // 4. Verify updated symbols appear in results
  });

  it('CocoIndex seeds resolve through code graph', async () => {
    // 1. Mock CocoIndex search result with file + range
    // 2. Pass as seeds to code_graph_context
    // 3. Verify seed resolution maps to correct symbols
    // 4. Verify neighborhood expansion from those symbols
  });

  it('3-source budget allocation in context merge', async () => {
    // 1. Provide constitutional (mock), codeGraph, cocoIndex content
    // 2. Call budget allocator with 4000 token budget
    // 3. Verify floors respected, overflow redistributed
    // 4. Verify total <= budget
  });
});
```

**Dependencies**: Requires temp directory creation (`mkdtemp`), actual SQLite DB init (in-memory `:memory:` or temp file), and real `parseFile` calls. No external services needed.

[INFERENCE: Integration design synthesized from iterations 046 (bridge), 049 (budget allocation), 052 (3-source merge), and current test patterns]

### 8. Test File Organization and Naming Convention

Following the existing convention in `mcp_server/tests/`:

| New Test File | Coverage Area | Est. Tests | Priority |
|---------------|--------------|------------|----------|
| `code-graph-endline-fix.vitest.ts` | endLine brace-counting (TS) + indentation (Python) | 8 | P0 (bug fix) |
| `code-graph-edge-types.vitest.ts` | DECORATES, OVERRIDES, TYPE_OF extraction | 10 | P1 (new feature) |
| `code-graph-staleness.vitest.ts` | Per-file mtime check, ensureFreshFiles, sync/async threshold | 7 | P0 (infrastructure) |
| `code-graph-auto-enrichment.vitest.ts` | Interceptor, GRAPH_AWARE_TOOLS, file path hint | 6 | P1 (auto-utilization) |
| `code-graph-cross-runtime.vitest.ts` | FirstCallTracker, session detection, TTL | 5 | P1 (UX parity) |
| `code-graph-integration-e2e.vitest.ts` | Full pipeline: scan-query-context-merge | 4 | P2 (integration) |
| **Total** | | **40** | |

Existing tests to update:
- `code-graph-indexer.vitest.ts` -- Add endLine assertions to existing `parseFile` tests (currently none check endLine)
- `budget-allocator.vitest.ts` -- Add intent-aware priority tests, min-floor trim protection tests

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/ (file listing)]
[INFERENCE: Priority assignment from iteration 064 consolidated backlog]

## Ruled Out
- **Snapshot testing** for parse results: Too brittle for regex-based parsers where output format may change. Use explicit property assertions instead.
- **E2E tests requiring actual CLI runtimes**: Cannot reliably run Claude/Codex/Gemini in CI. Use environment simulation instead.
- **Mocking tree-sitter WASM in tests**: Not needed for current regex parser. Tree-sitter tests belong to the migration phase, not current test suite.

## Dead Ends
- None identified this iteration. All proposed testing approaches are viable with existing vitest infrastructure.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts` (full file, 146 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts` (full file, 67 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts` (full file, 47 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts` (lines 1-60, endLine bug confirmation)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` (resolveTrustedSession reference)
- Glob results: 14 graph-related test files, 4 budget-related test files

## Assessment
- New information ratio: 0.65
- Questions addressed: All 6 testing sub-questions from the dispatch focus
- Questions answered: All 6 (test patterns understood, test cases designed for each improvement area, cross-runtime testing strategy defined, integration test architecture specified)

## Reflection
- What worked and why: Reading actual test files first (code-graph-indexer, budget-allocator, graph-flags) before designing new tests ensured the proposed test strategy follows established patterns exactly -- inline content strings, direct module imports, env var save/restore. This prevents test style drift.
- What did not work and why: N/A -- all research actions were productive.
- What I would do differently: Could have also read `mcp-tool-dispatch.vitest.ts` to get the handler mocking pattern for auto-enrichment tests, but the 12-call budget precluded it. The design is sound without it.

## Recommended Next Focus
Iteration 070 should be a CONSOLIDATION iteration: read the full `research/research.md` and all iteration findings from 056-069 to produce a final prioritized implementation plan with LOC estimates, dependency ordering, and phase gates. This is the penultimate synthesis before research closure.
