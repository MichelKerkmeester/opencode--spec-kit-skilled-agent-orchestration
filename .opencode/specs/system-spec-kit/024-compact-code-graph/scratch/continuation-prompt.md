# Continuation Prompt: Spec 024-compact-code-graph — Final 9 Items + Code Quality Audit

## Context

Branch `system-speckit/024-compact-code-graph` (6 commits ahead of main). Spec completion: **246/255 (96.5%)**. All P0/P1 code is implemented and passing. 116 tests pass across 14 test files. TypeScript compiles clean (only pre-existing errors in memory-search.ts and shadow-evaluation-runtime.ts).

## Task 1: Resolve 9 Remaining Checklist Items

All remaining items are testing. Base path for all checklists: `.opencode/specs/system-spec-kit/024-compact-code-graph/`

### Phase 004 — Cross-Runtime Fallback (3 items)

**004-cross-runtime-fallback/checklist.md:**

1. `[ ] Copilot runtime tested (tool fallback by policy)`
   - Run: `copilot -p "What runtime are you? Call code_graph_status and memory_stats" --model gpt-5.4 --allow-all-tools`
   - Verify: runtime detection returns "copilot-cli", hookPolicy returns "unavailable", tool fallback works
   - Document result in checklist

2. `[ ] Gemini runtime tested (tool fallback by policy)`
   - Run: `gemini -p "What runtime are you? Call code_graph_status and memory_stats"`
   - Same verification as above for "gemini-cli"

3. `[ ] 7-scenario test matrix from iter 015 implemented`
   - Add 7 test cases to `mcp_server/tests/cross-runtime-fallback.vitest.ts`
   - Scenarios from research iteration 015:
     1. Claude Code with hooks enabled → direct hook injection
     2. Claude Code with hooks disabled → tool-based fallback
     3. Codex CLI → tool-based fallback (hookPolicy: unavailable)
     4. Copilot CLI → tool-based fallback (hookPolicy: unavailable)
     5. Gemini CLI → tool-based fallback (hookPolicy: unavailable)
     6. Unknown runtime → default to tool-based
     7. Runtime detection failure → graceful degradation

### Phase 007 — Testing & Validation (5 items)

**007-testing-validation/checklist.md:**

4. `[ ] dual-scope-hooks.vitest.ts extended with compaction fixtures`
   - File: `mcp_server/tests/dual-scope-hooks.vitest.ts` (734 lines)
   - Add describe block: "compaction pipeline integration"
   - Fixtures: test that `autoSurfaceAtCompaction` calls `mergeCompactBrief`, verify 3-source merge produces valid brief with sections, test pipeline timeout enforcement
   - Use existing `makeTriggerMatch()` helper pattern

5. `[ ] crash-recovery.vitest.ts extended with real SQLite fixtures`
   - File: `mcp_server/tests/crash-recovery.vitest.ts` (857 lines)
   - Add describe block: "code-graph SQLite recovery"
   - Fixtures: test `initDb` with WAL mode, test schema versioning detection (SCHEMA_VERSION=1), test recovery after corrupted DB file, test `cleanupOrphans()` removes stale nodes/edges
   - Use existing `makeTempDir()` + `createRecoveryDb()` pattern

6. `[ ] Manual testing playbook scenarios executed`
   - Execute at least 3 key scenarios from `manual_testing_playbook/22--context-preservation-and-code-graph/`:
     - 248-precompact-hook.md
     - 250-session-start-startup.md
     - 254-code-graph-scan-query.md
   - Document pass/fail per scenario

7. `[ ] Manual test results documented with pass/fail evidence`
   - Write results to `specs/024-compact-code-graph/scratch/manual-test-results.md`

8. `[ ] Test coverage report generated`
   - Run: `cd mcp_server && npx vitest run --coverage`
   - Note coverage % in checklist

### Phase 012 — CocoIndex UX (1 item)

**012-cocoindex-ux-utilization/checklist.md:**

9. `[ ] Agent routing tests validate CocoIndex-first behavior`
   - Create test in `mcp_server/tests/agent-routing.vitest.ts` or add to `runtime-routing.vitest.ts`
   - Test that `@context` agent configuration prioritizes CocoIndex for semantic queries
   - Verify routing: semantic intent → CocoIndex, structural → code_graph, session → memory

---

## Task 2: sk-code-opencode Compliance Audit

Run the TypeScript checklist from `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md` against all code-graph and hook files.

### Known Issues Found (fix these)

**P1: 13 `catch(err)` blocks missing `: unknown` type annotation**
Files affected:
- `hooks/claude/claude-transcript.ts:113`
- `hooks/claude/compact-inject.ts:228,245`
- `hooks/claude/hook-state.ts:50,73`
- `hooks/claude/session-prime.ts:220`
- `hooks/claude/session-stop.ts:123,196`
- `hooks/claude/shared.ts:40`
- `lib/code-graph/structural-indexer.ts:381`
- `lib/code-graph/code-graph-db.ts` (multiple)
- `lib/code-graph/code-graph-context.ts` (multiple)

Fix: Change `catch (err)` → `catch (err: unknown)` in all locations.

**P1: 9 exported functions missing explicit return type annotations**
Files affected:
- `hooks/claude/claude-transcript.ts:56` — `parseTranscript()`
- `hooks/claude/shared.ts:92` — `calculatePressureAdjustedBudget()`
- `lib/code-graph/budget-allocator.ts:52,119` — `allocateBudget()`, `createDefaultSources()`
- `lib/code-graph/code-graph-db.ts:97,331` — `upsertFile()`, `getTokenUsageRatio()`
- `lib/code-graph/compact-merger.ts:107` — `mergeCompactBrief()`
- `lib/code-graph/structural-indexer.ts:195,346` — `extractEdges()`, `parseFile()`

Fix: Add explicit return type annotations to each exported function.

### Compliance Checks to Verify (should pass)

- [x] All files have box header (`// MODULE: ...`) — VERIFIED CLEAN
- [x] No `any` in public API — VERIFIED CLEAN
- [x] PascalCase for all interfaces, types, enums — VERIFIED CLEAN
- [x] No commented-out code blocks — VERIFIED CLEAN
- [x] No non-null assertions without justification — VERIFIED CLEAN
- [x] ESM imports with `.js` extensions — VERIFIED CLEAN
- [x] No `require()` or `module.exports` — VERIFIED CLEAN

---

## File Inventory (all files in scope)

### Hook scripts (`mcp_server/hooks/claude/`)
- `compact-inject.ts` — PreCompact hook, 3-source merge
- `session-prime.ts` — SessionStart hook, source routing
- `session-stop.ts` — Stop hook, token tracking
- `hook-state.ts` — Per-session state management
- `claude-transcript.ts` — Transcript JSONL parser
- `shared.ts` — Common utilities, constants

### Code graph library (`mcp_server/lib/code-graph/`)
- `structural-indexer.ts` — Regex-based parser (JS/TS/Python/Bash)
- `code-graph-db.ts` — SQLite storage + CRUD
- `code-graph-context.ts` — LLM-oriented neighborhoods
- `seed-resolver.ts` — CocoIndex → graph node resolution
- `budget-allocator.ts` — Token distribution (floor + overflow)
- `compact-merger.ts` — 3-source merge for compaction
- `working-set-tracker.ts` — Recency-weighted tracking
- `runtime-detection.ts` — Runtime ID + hook policy
- `indexer-types.ts` — Type definitions

### Handlers (`mcp_server/handlers/code-graph/`)
- `scan.ts`, `query.ts`, `status.ts`, `context.ts` — 4 core MCP tools
- `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` — 3 CocoIndex tools
- `index.ts` — Handler barrel export

### Test files (`mcp_server/tests/`)
- `hook-shared.vitest.ts` (8), `hook-state.vitest.ts` (9), `hook-session-start.vitest.ts` (6)
- `hook-precompact.vitest.ts` (5), `hook-stop-token-tracking.vitest.ts` (8)
- `code-graph-indexer.vitest.ts` (18), `budget-allocator.vitest.ts` (7)
- `compact-merger.vitest.ts` (5), `runtime-detection.vitest.ts` (6)
- `cross-runtime-fallback.vitest.ts` (13), `runtime-routing.vitest.ts` (11)
- `token-snapshot-store.vitest.ts` (3), `session-token-resume.vitest.ts` (4)
- `edge-cases.vitest.ts` (13)
- `dual-scope-hooks.vitest.ts` (existing, extend)
- `crash-recovery.vitest.ts` (existing, extend)

---

## Execution Strategy

1. **Fix code quality issues first** (catch types + return types) — ~30 files, mechanical edits
2. **Write test extensions** (dual-scope, crash-recovery, 7-scenario, agent-routing) — 4 files
3. **Run live runtime tests** (copilot, gemini) — 2 CLI commands
4. **Execute manual playbook scenarios** — 3 scenarios
5. **Generate coverage report** — 1 command
6. **Update checklists** — mark all resolved items
7. **Rebuild dist** — `npx tsc --build`
8. **Final test run** — `npx vitest run` (all tests)
9. **Commit + push** to `system-speckit/024-compact-code-graph`

## Verification

```bash
# 1. TypeScript compiles
cd mcp_server && npx tsc --noEmit 2>&1 | grep -v "handlers/memory-search\|lib/feedback/shadow-evaluation"

# 2. All tests pass
npx vitest run tests/hook-*.vitest.ts tests/runtime-*.vitest.ts tests/budget-*.vitest.ts tests/compact-*.vitest.ts tests/code-graph-*.vitest.ts tests/cross-runtime-*.vitest.ts tests/edge-cases.vitest.ts tests/agent-routing.vitest.ts

# 3. No catch without unknown
grep -rn "catch (err)" hooks/claude/*.ts lib/code-graph/*.ts handlers/code-graph/*.ts | grep -v "unknown"
# Expected: 0 results

# 4. Checklist count
grep -r "\- \[x\]" ../../../specs/system-spec-kit/024-compact-code-graph/checklist.md ../../../specs/system-spec-kit/024-compact-code-graph/*/checklist.md | wc -l
# Target: 255/255

# 5. Coverage
npx vitest run --coverage
```

## Constraints

- ESM only: `import`/`export` with `.js` extensions. No `require()` or `module.exports`
- TypeScript strict mode
- All hooks must exit cleanly (exit 0) — never block Claude
- Follow existing test patterns (vitest, describe/it/expect)
- Branch: `system-speckit/024-compact-code-graph` — do NOT merge to main
