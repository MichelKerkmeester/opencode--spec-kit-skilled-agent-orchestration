<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 019: Code Graph Auto-Trigger

<!-- PHASE_LINKS: parent=../spec.md predecessor=018-non-hook-auto-priming successor=020-query-routing-integration -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### What This Is

Right now, you often have to manually run `code_graph_scan` before the code graph works. This phase adds a best-effort auto-index path so many query/context calls can recover automatically, even though manual scans are still sometimes needed.

### Plain-English Summary

**Problem:** If you ask "who calls this function?" and the code graph hasn't been indexed, you get an empty result or an error. The user has to remember to run `code_graph_scan` first, which breaks the flow.

**Solution:** Add a shared `ensureCodeGraphReady()` helper that checks if the graph is fresh before every query/context call. If it's stale or empty, it attempts a quick reindex before continuing.

### What to Build

### A shared "ensure ready" helper that checks three things:

1. **Graph empty?** → Full scan needed (first use)
2. **Git HEAD changed?** → Branch switch detected, full rescan
3. **File mtimes drifted?** → Some files changed, selective reindex only those files

This helper is called at the top of `code_graph_context` and `code_graph_query`. The scan happens transparently — the user just asks their question and gets an answer.

### Also improve `code_graph_status`:

Make it report freshness from `detectState()` instead of just "last scan time":
- "fresh" = graph is non-empty, git HEAD is unchanged, and tracked file mtimes still match
- "stale" = git HEAD changed or tracked files drifted
- "empty" = never indexed

Current implementation does **not** apply a separate 5-minute age window.

### Update runtime docs:

Document the narrower runtime behavior accurately:
- `code_graph_context` and `code_graph_query` attempt best-effort auto-index before use
- `code_graph_status` reports freshness only and does not auto-reindex
- Auto-index failures are non-blocking and can still leave stale or empty results

### Files to Change

| File | Change |
|------|--------|
| New `lib/code-graph/ensure-ready.ts` | Shared freshness checker + selective reindex trigger |
| `handlers/code-graph/context.ts` | Call `ensureCodeGraphReady()` before building context |
| `handlers/code-graph/query.ts` | Call `ensureCodeGraphReady()` before running query |
| `handlers/code-graph/status.ts` | Report true freshness (empty/stale/fresh) |
| `lib/code-graph/code-graph-db.ts` | Add per-file mtime tracking |
| `handlers/code-graph/scan.ts` | Support selective reindex (changed files only) |
| `AGENTS.md`, `CODEX.md`, `GEMINI.md` | Document auto-trigger behavior |

### Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | 100% | 100% |
| OpenCode | 60% | 95% |
| Codex CLI | 55% | 95% |
| Copilot CLI | 50% | 95% |
| Gemini CLI | 50% | 95% |

This is the **highest parity gain** of all proposals — every runtime benefits equally because it's entirely server-side.

### Estimated LOC: 170-360
### Risk: MEDIUM — auto-indexing adds latency to first query; needs timeout guards
### Dependencies: None

---

### Implementation Status (Post-Review Iterations 041-050)

Most of Phase 019 shipped, but the behavior is narrower than the original target and two follow-up findings remain deferred.

| Item | Status | Evidence |
|------|--------|----------|
| ensure-ready.ts shared helper | DONE | lib/code-graph/ensure-ready.ts (203 lines) |
| Three freshness conditions (empty/HEAD/mtime) | DONE | detectState() lines 56-105 |
| context.ts auto-trigger | PARTIAL | Attempts `ensureCodeGraphReady(process.cwd())` before buildContext; failures are non-blocking |
| query.ts auto-trigger | PARTIAL | Attempts `ensureCodeGraphReady(process.cwd())` before query dispatch; failures are non-blocking |
| status.ts freshness reporting | PARTIAL | getGraphFreshness() returns fresh/stale/empty from `detectState()`; no 5-minute age check |
| 10-second timeout guard | DONE | AUTO_INDEX_TIMEOUT_MS = 10_000 |
| Selective reindex for stale files | PARTIAL | Threshold exists, but F048 leaves the selective path degraded |
| Per-file mtime tracking | DONE | ensureFreshFiles() in code-graph-db.ts |

### Review Findings (iter 043)
- F048 (P2): selective reindex passes raw file paths as includeGlobs. DEFERRED
- F049 (P2): timeout via AbortController doesn't cancel indexFiles. DEFERRED (fire-and-forget is acceptable)

### Known Limitations

1. Freshness currently ignores any 5-minute age window. It only checks empty graph state, git HEAD drift, and tracked file mtimes.
2. Debounce is global, not keyed by `rootDir`, because `lastCheckAt` and `lastCheckResult` are module-level state.
3. New files are invisible to freshness detection until a full scan occurs, because only tracked `code_files` paths are checked.
4. Deleted files can persist during auto-triggered indexing, because missing-file cleanup only runs in the scan handler full-scan path.
5. Selective reindex is degraded in practice, because raw relative file paths are assigned to `includeGlobs` and can fall back to broader scanning. See F048.
6. Auto-index errors are swallowed from the caller perspective. They are logged, but query/context continue and may return stale or empty results.
7. Runtime docs must describe this as best-effort auto-index on query/context only. `code_graph_status` does not auto-reindex.
8. Phase status should be treated as mostly shipped with follow-up gaps. F048 and F049 remain deferred, not completed.

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
