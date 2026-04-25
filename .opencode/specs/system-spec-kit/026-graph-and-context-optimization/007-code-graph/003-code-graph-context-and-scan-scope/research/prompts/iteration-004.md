# Deep-Research Iteration 4 — Implementation Plan, Risk Register, Acceptance Criteria

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 5
Questions: 5/5 + 3 design + 4 verification all answered. Implementation hand-off questions remain.
Last 2 ratios: 0.62 -> 0.41 | Stuck count: 0 | Trending toward convergence (avg(0.88, 0.62, 0.41) = 0.637)
Next focus: Define the IMPLEMENTATION PLAN deliverable — which packet folder hosts the fix, sequenced tasks, risk register, post-deploy acceptance criteria. NO production code changes (research scope only).

Research Topic: Why mcp__spec_kit_memory__code_graph_scan returned 33 files / 809 nodes / 376 edges after packet 012, when expected was 1000-3000.

## Confirmed state from iter-1, 2, 3

**Bug 1 (P0):** `indexFiles()` ignores `incremental` flag → DB pruned to stale-only files. Fix: thread `IndexFilesOptions { skipFreshFiles?: boolean }` (default true), pass `{skipFreshFiles: effectiveIncremental}` from scan handler. Other callers safe with default.

**Bug 2 (P0):** Parser captures collapse to same `symbolId` for 3 indexer-self files. Fix: dedup in `capturesToNodes()` via `seenSymbolIds: Set<string>` (Option A). Acceptable for overloads/lexical collisions under current identity model. Edge cases verified in iter-3.

**Operator clarity (P2):** Add `fullScanRequested` and `effectiveIncremental` to scan response. Optionally separate discovered vs parsed file counts.

**Latent follow-ups (P2, not in this fix):** Add `method_signature` to `JS_TS_KIND_MAP`; richer parser scoping for true semantic dedup.

## STATE FILES

All paths relative to repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-strategy.md`
- Prior iterations: iteration-001.md, iteration-002.md, iteration-003.md (all in research/007-deep-review-remediation-pt-04/iterations/)
- State Log (APPEND): `.../007-deep-review-remediation-pt-04/deep-research-state.jsonl`
- Write iteration narrative: `.../007-deep-review-remediation-pt-04/iterations/iteration-004.md`
- Write delta file: `.../007-deep-review-remediation-pt-04/deltas/iter-004.jsonl`

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls. Max 15 minutes.
- **DO NOT modify production code.** This iteration produces a plan deliverable.
- Convergence note: rolling avg is 0.637 — likely 1-2 more iterations to reach threshold 0.05.

## INVESTIGATION GOALS (priority order)

### G1 (P0): Spec folder topology — where does the fix live?

The bugs were INTRODUCED by packet 012 (.gitignore-aware walk + new excludes). This investigation is technically a remediation of packet 012. The campaign is `007-deep-review-remediation/`. Determine:

1. Should this fix be a NEW sub-packet (e.g., `013-code-graph-scan-incremental-flag-fix`) under `007-deep-review-remediation/`?
2. Or should it amend packet 012 with a Phase 2 sub-folder (`012-.../002-incremental-flag-fix`)?
3. List the canonical-spec-doc skeleton: spec.md sections, plan.md task breakdown, tasks.md gate, checklist.md P0/P1 items, decision-record.md ADR sketch.

Cite: spec folder conventions in `.opencode/skill/system-spec-kit/SKILL.md` and `templates/level_2/` or `level_3/`.

### G2 (P0): Sequenced implementation tasks (the plan)

Produce an ordered task list ready to drop into `tasks.md`. Each task must include: file path, what to change (1-line summary), expected diff size, and dependency. Format:

```
T-001 [code] structural-indexer.ts:1227 — Add IndexFilesOptions interface + skipFreshFiles parameter (≤8 lines)
T-002 [code] structural-indexer.ts:1249 — Conditional stale-gate (≤2 lines)
T-003 [code] handlers/scan.ts:183 — Pass {skipFreshFiles: effectiveIncremental} (1 line)
T-004 [code] structural-indexer.ts:796-812 — Dedup in capturesToNodes (≤10 lines)
T-005 [code] handlers/scan.ts:21-33,248-261 — Add fullScanRequested + effectiveIncremental fields (≤6 lines)
T-006 [test] tests/structural-contract.vitest.ts — indexFiles options tests (3 cases)
T-007 [test] tests/structural-contract.vitest.ts — scan handler integration test (incremental:false → ≥1000 files)
T-008 [test] tests/tree-sitter-parser.vitest.ts — capturesToNodes dedup regression test
T-009 [build] npm run build in mcp_server/
T-010 [verify] Restart MCP server; run code_graph_scan({incremental:false}); assert filesScanned >= 1000 and no UNIQUE errors
T-011 [doc] Update code-graph/README.md surface matrix with new response fields
```

Include rationale for ordering (dependencies, risk-first vs scaffold-first, etc.).

### G3 (P0): Risk register

For each potential rollout risk, provide: risk → likelihood (L/M/H) → impact (L/M/H) → mitigation. Include at minimum:

1. **R1**: Adding `IndexFilesOptions` parameter breaks downstream callers that use TypeScript `Parameters<typeof indexFiles>`. Mitigation: optional param with default → backward-compatible.
2. **R2**: Dedup in `capturesToNodes()` silently drops legitimately distinct symbols. Mitigation: log dropped duplicates with file:line via debug channel; downstream test for known overload patterns.
3. **R3**: After fix, scan goes from 33 → ~1425 files. DB grows back toward original size. Will the scan duration explode (was 47s when only indexing 33 files)? Will dependent MCP queries (`code_graph_query`, `code_graph_context`) handle the bigger graph? 
4. **R4**: `fullReindexTriggered` field name is unchanged but new fields (`fullScanRequested`, `effectiveIncremental`) might break consumers parsing the response strictly. Mitigation: additive only; document as additive change.
5. **R5**: VACUUM not in this fix's scope but the existing 473MB DB has stale rows from old 26K scan. Will the new scan re-insert correctly without rebuilding from scratch? Is a one-time `code_graph_scan` followed by VACUUM sufficient?
6. **R6**: The 3 originally-erroring files (structural-indexer.ts, tree-sitter-parser.ts, working-set-tracker.ts) will now succeed via dedup. Will the resulting graph be less complete for these files? Quantify: how many symbols dropped?

Add any other risks discovered.

### G4 (P1): Acceptance criteria

Concrete pass/fail conditions for declaring the fix complete:

```
AC-1: code_graph_scan({rootDir:repo, incremental:false}) returns filesScanned >= 1000
AC-2: code_graph_scan response includes fullScanRequested:true AND effectiveIncremental:false
AC-3: Zero entries in scan response errors[] array
AC-4: code_graph_status reports totalFiles in [1000, 3000] range
AC-5: Re-running scan immediately returns same totalFiles (idempotent)
AC-6: Existing vitest suites all pass (structural-contract 20+ tests, tree-sitter-parser 17+ tests)
AC-7: New tests added: at least 3 indexFiles option tests + 1 dedup regression test
AC-8: No regressions in code_graph_query, code_graph_context, code_graph_status response shapes
```

Note any gaps in acceptance coverage.

### G5 (P2): Operator runbook

One-paragraph operator instructions for verifying the fix post-deploy. Include the exact `mcp__spec_kit_memory__code_graph_scan({...})` invocation and the expected response shape diff.

## OUTPUT CONTRACT (mandatory)

Three artifacts:

1. **Iteration narrative** at `.../iterations/iteration-004.md`. Sections: Focus, Actions Taken, Spec Folder Decision (G1), Implementation Tasks (G2 — ordered table), Risk Register (G3 — table per risk), Acceptance Criteria (G4 — checklist), Operator Runbook (G5), Questions Answered, Questions Remaining, Next Focus.

2. **JSONL iteration record** APPENDED to state log:
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|thought|partial|error>","focus":"<short string>","graphEvents":[]}
```

3. **Per-iteration delta file** at `.../deltas/iter-004.jsonl`. Iteration record + per-event records (decision, task, risk, acceptance_criterion, recommendation, ruled_out).

## START

Begin Iteration 4. G1 first (where does the fix live?), then G2 (tasks), then G3 (risks), then G4/G5.
