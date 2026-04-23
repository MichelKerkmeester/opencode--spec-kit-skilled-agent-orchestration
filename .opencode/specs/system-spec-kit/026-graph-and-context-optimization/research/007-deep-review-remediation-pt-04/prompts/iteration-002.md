# Deep-Research Iteration 2 — Fix Design for Indexer Stale-Gate + Parser Duplicate-Symbol Bugs

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 5
Questions: 5/5 answered (root cause confirmed; design questions remain) | Last focus: incremental=false stale gate and duplicate symbol ids
Last 2 ratios: N/A -> 0.88 | Stuck count: 0
Next focus: Design minimal-diff fix for the indexer's stale-gate bug AND the parser duplicate-symbol bug; produce concrete patch-level recommendations with line-level citations and a test plan.

Research Topic: Why mcp__spec_kit_memory__code_graph_scan returned 33 files / 809 nodes / 376 edges after packet 012, when expected was 1000-3000.

Iteration 1 root-cause findings (CONFIRMED, do not re-investigate):
- **F1 (PRIMARY)**: `indexFiles()` in `structural-indexer.ts` unconditionally calls `isFileStale()` (lines 1227, 1246, 1249) — the `incremental` flag is computed correctly in the handler but is NEVER PASSED into `indexFiles(config)` at `handlers/scan.ts:183`. So even when caller passes `incremental:false`, `indexFiles()` skips fresh files. The handler's full-scan cleanup at `handlers/scan.ts:193,196,197,199` then treats the stale-only result as the complete desired graph and DELETEs every tracked path not in that reduced set → DB pruned to 33 files.
- **F2**: `fullReindexTriggered` only fires when git HEAD changes during incremental mode; it does NOT fire for caller-requested `incremental:false`. Naming is misleading but behavior is intentional.
- **F3**: Empirical post-exclude count is **1,425 files** (1,205 .ts, 4 .tsx, 34 .js, 13 .mjs, 34 .cjs, 31 .py, 104 .sh). 4,272 gitignored entries + 204 default-excluded entries. This is well within the handover's 1000-3000 prediction.
- **F4 (SECONDARY BUG)**: The 3 `UNIQUE constraint failed: code_nodes.symbol_id` errors come from duplicate captures inside each parsed file: `structural-indexer.ts` has duplicate `method`/`class:method` and `function`/`foo` captures; `tree-sitter-parser.ts` has duplicate `class:body` and `method:TreeSitterParser.if`; `working-set-tracker.ts` has duplicate `method:WorkingSetTracker.if`, `parameter:WorkingSetTracker.if.existing`, `method:WorkingSetTracker.for`. `symbolId` is `filePath + fqName + kind` (no line number), so semantic name collisions inside one file collapse → constraint violation. Source: `tree-sitter-parser.ts:498,505,520`; `indexer-types.ts:82,83,85`; `structural-indexer.ts:796,799`; `code-graph-db.ts:68,70,305,314,318,328`.
- **F5**: DB did prune (33 files persisted). The unchanged `dbFileSize=473MB` is just SQLite not auto-shrinking after DELETE; `getDbStats()` reports raw `statSync(dbPath).size` (`code-graph-db.ts:683,686,689`).

Iteration 2 focus: produce the FIX. Two distinct bugs need patches.

## STATE FILES

All paths relative to repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-strategy.md`
- Prior iteration: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-001.md`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-002.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deltas/iter-002.jsonl`

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls. Max 15 minutes.
- Write ALL findings to files. No in-context-only state.
- Do NOT modify production code in this iteration. This is design work.

## INVESTIGATION GOALS (priority order)

### G1 (P0): Design the indexer stale-gate fix

Inspect `indexFiles()` in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` and `handlers/code-graph/scan.ts`. Determine:

1. The minimal API change to thread `effectiveIncremental` into `indexFiles()` without breaking other callers (selective inline refresh paths).
2. Where to add the conditional bypass for `isFileStale()` — at the call site or as an `IndexFilesOptions` flag?
3. Are there OTHER callers of `indexFiles()` we'd affect? Use Grep to enumerate.
4. Propose the EXACT diff (3-10 lines max) with file:line annotations.

### G2 (P0): Design the parser duplicate-symbol guard

Inspect `capturesToNodes()` in `structural-indexer.ts:796+`, `tree-sitter-parser.ts:498-520`, and the symbol-id construction in `indexer-types.ts:82-85`. Choose ONE strategy:

**Option A**: Dedupe in `capturesToNodes()` by tracking seen `symbolId`s within one file's parse result. Drop or merge later duplicates (preserve first-seen line). Lossy but safe.

**Option B**: Make `symbolId` unique by appending start-line to the key when a duplicate is detected. More information preserved but breaks symbol_id stability across edits.

**Option C**: Fix at the parser layer — make tree-sitter capture names richer (e.g., include containing scope in the fqName). Solves the root cause but bigger surgery.

Evaluate trade-offs. Recommend ONE option with rationale. Propose the patch (file:line citations).

### G3 (P1): Test plan

For each fix, list the test cases that should be added to:
- `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts`

Tests must cover: (a) `incremental:false` returns ALL post-exclude files (≥1000), not just stale; (b) repeat scan with no file changes returns same count (idempotency); (c) duplicate-symbol-by-design files don't crash and preserve at least one node per logical symbol.

### G4 (P2): Operator-facing rename consideration

`fullReindexTriggered=false` confused the operator (me, in iteration 0). Should it be supplemented with a `fullScanRequested` or `effectiveIncremental` field in the scan response payload? Cite the response shape file.

## OUTPUT CONTRACT (mandatory)

Three artifacts:

1. **Iteration narrative** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-002.md`. Sections: Focus, Actions Taken, Findings (with file:line citations and code-block diffs), Recommended Patches (G1, G2, G4), Test Plan (G3), Questions Answered, Questions Remaining, Next Focus.

2. **JSONL iteration record** APPENDED to state log:
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<insight|thought|partial|error>","focus":"<short string>","graphEvents":[/* findings as nodes/edges */]}
```

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deltas/iter-002.jsonl`. One iteration record + per-event records (finding, observation, edge, recommendation, ruled_out).

## START

Begin Iteration 2. Focus on G1 and G2 first (the actual fixes); G3 and G4 if time permits.
