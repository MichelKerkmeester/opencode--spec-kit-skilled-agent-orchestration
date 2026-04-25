---
title: "Implementation Plan: Code Graph Backend Resilience [system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/plan]"
description: "Sequenced 15-task plan landing the 5 backend streams via cli-codex per-task dispatch."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "code graph backend resilience plan"
  - "008-code-graph-backend-resilience plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
    last_updated_at: "2026-04-25T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted 008 plan from iter 12 roadmap"
    next_safe_action: "Execute tasks sequentially via cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0260000000007008000000000000000000000000000000000000000000000002"
      session_id: "008-code-graph-backend-resilience"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Backend Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Live mcp_server backend at `.opencode/skill/system-spec-kit/mcp_server/code_graph/` with the readiness contract in `lib/ensure-ready.ts`, query handlers in `handlers/`, structural indexer in `lib/structural-indexer.ts`, tree-sitter parser in `lib/tree-sitter-parser.ts`, and the SQLite cache wrapper in `lib/code-graph-db.ts`. All TS, sqlite, and tree-sitter primitives in place; no new external deps.

Land the 5 implementation streams in dependency order. Each task targets specific file:line ranges with concrete change instructions. Tests are added per stream. Each task is dispatched to cli-codex as a focused, self-contained patch prompt. The implementation runner script processes tasks sequentially via `codex exec --model gpt-5.4 -c model_reasoning_effort=high -c service_tier=fast -c approval_policy=never --sandbox workspace-write`. After each task: rebuild, run tests, log result. After all 15 tasks: full smoke test + commit + push.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Per-task gates

- TS build passes (zero errors): `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
- No new ESLint errors introduced
- Patch surface matches plan (no scope creep)

### Per-stream gates

- Stream-specific tests pass
- No regression in existing test suite

### Final gates

- All 15 tasks marked `[x]` with `(verified)` in tasks.md
- Full mcp_server test suite passes 100%
- `/doctor:code-graph:auto` smoke test succeeds against modified backend
- `code_graph_verify` MCP tool reachable and returns valid response shape
- Strict spec validation passes 0 errors / 0 warnings on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Stream order

| Stream | Tasks | Why this order |
|--------|-------|---------------|
| Verifier scaffolding | T01-T05 | Land verifier first so subsequent streams have a regression canary |
| Wire verify into scan + status | T06-T07 | Hooks verifier into existing flow; no behavior change yet |
| Hash predicate | T08 | Most isolated; close timestamp-preserving-edit blind spot |
| Resolver upgrades | T09-T10 | Capture metadata first, then cross-file resolution |
| Edge-weight + drift | T11-T12 | Adds config surface + drift module + persistence |
| Self-heal observability | T13 | Last in chain because it composes verifier + drift |
| Tests | T14-T15 | Block-final tests + detect_changes hard-block proof |

### Canonical Patch Surface

| File | Lines | Streams |
|------|-------|---------|
| `mcp_server/code_graph/lib/code-graph-db.ts` | 7-10, 99-103, 117-123, 190-204, 281-321, 380-425 | Hash predicate, metadata helpers |
| `mcp_server/code_graph/lib/ensure-ready.ts` | 30-36, 102-187, 290-367 | Self-heal observability |
| `mcp_server/code_graph/lib/structural-indexer.ts` | 113-126, 485-502, 857-920, 895-1071, 1328-1381, 1357-1377, 1403-1507 | Resolver, edge weights |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | 340-397, 399-465 | Resolver capture |
| `mcp_server/code_graph/lib/indexer-types.ts` | 73-80, 90-93 | IndexerConfig extension |
| `mcp_server/code_graph/handlers/scan.ts` | 186-245, 208-217, 230-245, 247-287 | Hash propagation, drift baseline |
| `mcp_server/code_graph/handlers/status.ts` | 40-62 | Surface drift + last verification |
| `mcp_server/code_graph/handlers/detect-changes.ts` | 245-264 | Preserve hard block (test-only) |
| `mcp_server/code_graph/handlers/index.ts` | 4-11 | Add verify handler export |
| `mcp_server/code_graph/handlers/verify.ts` | NEW | Verify MCP handler |
| `mcp_server/code_graph/lib/gold-query-verifier.ts` | NEW | Verifier library |
| `mcp_server/code_graph/lib/edge-drift.ts` | NEW | PSI / JSD / share drift |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | 5-14, 19-29, 58-96 | Dispatch verify tool |
| `mcp_server/tool-schemas.ts` | 554-647, 915-920 | Register verify schema |
| `mcp_server/code_graph/tests/code-graph-verify.vitest.ts` | NEW | Verifier tests |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verifier scaffolding (T01-T05)

Add the gold-query verifier library, register `code_graph_verify` MCP tool, and prepare metadata helpers. No behavior change to existing flows.

### Phase 2: Wire verify into scan + status (T06-T07)

Hook the verifier into the scan handler (opt-in) and status handler (display fields). Default behavior unchanged.

### Phase 3: Hash predicate (T08)

Make `isFileStale()` hash-aware. Close the timestamp-preserving-edit blind spot.

### Phase 4: Resolver upgrades (T09-T10)

Capture module specifier + import kind + re-export source, then resolve cross-file imports including tsconfig path aliases.

### Phase 5: Edge-weight + drift (T11-T12)

Add `IndexerConfig.edgeWeights`, centralize weight constants, persist baseline distribution, surface drift summary.

### Phase 6: Self-heal observability (T13)

Extend `ReadyResult` with self-heal metadata. Preserve `detect_changes` hard block.

### Phase 7: Tests (T14-T15)

Block-final tests for `detect_changes` hard block; per-stream tests for hash/resolver/edge weight/verifier.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Per-stream

- **Hash predicate (T08):** unit tests in `code-graph-indexer.vitest.ts` covering same-mtime/different-hash, missing-hash fallback, unchanged-content freshness
- **Resolver (T09-T10):** unit tests covering type-only / path-alias / re-export
- **Edge-weight + drift (T11-T12):** unit tests for override resolution + PSI/JSD computation
- **Verifier (T01-T07):** new `code-graph-verify.vitest.ts` covering parsing, blocking on stale, missing-symbol detection
- **Self-heal (T13):** integration test in `ensure-ready.vitest.ts` covering bounded soft-stale auto-runs

### Block-final

- **detect_changes hard block (T14):** verification failure or stale graph returns `status:"blocked"`; never inline mutation
- **Smoke test:** `/doctor:code-graph:auto` against modified backend produces valid diagnostic report
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/`
- **Sibling:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/`
- **Backend target:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/`
- **No external deps** — all changes use existing TypeScript + sqlite + tree-sitter primitives
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Per task

- Each task produces a focused diff. Failed tasks can be reverted via `git checkout HEAD -- <files>`.
- cli-codex dispatch logs preserved under `scratch/codex-logs/T<NN>.log` for forensics.

### Whole packet

- Tag commit before runner starts: `git tag pre-008-implementation`
- Disaster recovery: `git reset --hard pre-008-implementation` (only with explicit user confirmation)
- Database is rebuildable from scratch via `code_graph_scan({ incremental: false })`; no schema migration to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
T01 → T02 → T03 → T04 → T05 (verifier scaffolding)
T05 → T06 → T07 (wire into scan + status)
T05 → T08 (hash predicate; depends on T05 only for canary)
T08 → T09 → T10 (resolver)
T10 → T11 → T12 (edge weight + drift)
T07,T12 → T13 (self-heal observability)
T13 → T14 → T15 (tests)
```

**Critical path:** T01 → T05 → T08 → T10 → T12 → T13 → T15 (7 tasks)
**Parallel opportunities:** none in current design — sequential by intent for safety.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Task | LOC estimate | cli-codex dispatch time | Cumulative |
|------|--------------|-----------------------|-----------|
| T01-T05 (verifier scaffold) | 250 | 5×~5min = 25min | 25min |
| T06-T07 (wire into scan/status) | 80 | 2×~3min = 6min | 31min |
| T08 (hash predicate) | 100 | ~5min | 36min |
| T09-T10 (resolver) | 200 | 2×~6min = 12min | 48min |
| T11-T12 (edge weight + drift) | 200 | 2×~5min = 10min | 58min |
| T13 (self-heal) | 80 | ~4min | 62min |
| T14-T15 (tests) | 200 | 2×~6min = 12min | 74min |
| Build + verify between tasks | (overhead) | 15× ~30s = 7.5min | 82min |
| **Total** | ~1110 LOC | **~80-90 min** | |

Per saved memory feedback: cli-codex with `-c service_tier="fast"` gives noticeably faster turnaround than default tier. Plan budgets with fast tier active.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Failure modes + recovery

- **TS build error after task:** halt runner; operator inspects log; `git checkout HEAD~1` if no useful work; otherwise edit and rebuild.
- **Test regression in existing suite:** halt runner; identify which task caused; revert that task's diff; re-dispatch with refined prompt.
- **`code_graph_scan` corrupts DB:** delete `database/code-graph.sqlite*`, re-scan from scratch (DB is rebuildable cache).
- **All tasks complete but smoke test fails:** review per-stream tests; if streams individually pass, the failure is in integration — investigate self-heal/verifier wiring (T13).
<!-- /ANCHOR:enhanced-rollback -->
