# Deep-Research Iteration 3 — Fix Verification, Edge-Case Stress, Test Plan

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 5
Questions: 5/5 answered, 3 design questions resolved | Last focus: minimal fix design for stale gate and duplicate symbol ids
Last 2 ratios: 0.88 -> 0.62 | Stuck count: 0
Next focus: Validate the proposed fixes against all callers and edge cases; produce concrete vitest snippets; identify any leftover correctness gaps before recommending implementation.

Research Topic: Why mcp__spec_kit_memory__code_graph_scan returned 33 files / 809 nodes / 376 edges after packet 012, when expected was 1000-3000.

## Confirmed root causes (iter-1) and proposed fixes (iter-2)

**Bug 1 (P0 — stale gate):** `indexFiles(config)` at `structural-indexer.ts:1227` always applies `if (!isFileStale(file)) continue` at line 1249. Handler `scan.ts:183` calls `indexFiles(config)` without passing `effectiveIncremental`. Full-scan cleanup at `scan.ts:193-201` then prunes DB to the stale-only set. Caller-requested `incremental:false` is silently ignored.

**Proposed fix 1:** Add `IndexFilesOptions { skipFreshFiles?: boolean }` to `indexFiles()`. Default `true` (preserve current behavior). Handler call site: `indexFiles(config, { skipFreshFiles: effectiveIncremental })`.

**Other callers of `indexFiles()`:**
- `lib/ensure-ready.ts:190` — bounded auto-indexing; should keep stale-only (default OK).
- `tests/tree-sitter-parser.vitest.ts:162, 184` — uses mocked `isFileStale: true`.

**Bug 2 (P0 — duplicate symbols):** Parser captures inside one file produce multiple `(filePath, fqName, kind)` tuples that collapse to the same `symbolId`. `code_nodes.symbol_id` is UNIQUE → INSERT fails. Affects 3 indexer-self files.

**Proposed fix 2 (Option A):** Dedupe in `capturesToNodes()` — track `seenSymbolIds: Set<string>` (seeded with `moduleNode.symbolId`), `flatMap` to drop duplicates after first.

**Trade-off context:** Option A is lossy for legitimately distinct symbols sharing `(filePath, fqName, kind)`. Iter-2 argued current graph identity already cannot represent them, so dedup is consistent.

**Operator clarity (G4):** Add `fullScanRequested` and `effectiveIncremental` fields to scan response — DO NOT rename `fullReindexTriggered`.

## STATE FILES

All paths relative to repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-strategy.md`
- Prior iterations: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-001.md`, `iteration-002.md`
- State Log (APPEND): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-state.jsonl`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/iterations/iteration-003.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls. Max 15 minutes.
- Write ALL findings to files.
- Do NOT modify production code in this iteration. Verification + tests only.

## INVESTIGATION GOALS (priority order)

### G1 (P0): Verify Fix 1 is safe for ALL `indexFiles()` callers

1. Read `lib/ensure-ready.ts:160-220` to confirm what calls `indexFiles(config)` there. Is the bounded auto-indexer truly stale-only by intent, or could it be a bug-by-omission too?
2. Read `tests/tree-sitter-parser.vitest.ts:155-200` to confirm whether the test mocks would still pass with the new optional parameter (signature change should be backward-compatible).
3. Run `rg -n 'indexFiles\(' .opencode/skill/system-spec-kit/mcp_server` to enumerate ALL call sites and confirm none were missed.
4. For each caller, state explicitly: keeps default (`skipFreshFiles=true`)? OR needs explicit override?

### G2 (P0): Stress-test Fix 2 against legitimate duplicate scenarios

Identify cases where Option A's dedup might silently drop important symbols:

1. **TypeScript function overloads** — multiple signatures, one implementation. Do they collapse to one `symbolId`? Read `tree-sitter-parser.ts` to see what `fqName` is generated.
2. **Class with same-name method on different overloaded types** (TS interfaces).
3. **Python `@overload` decorators** — does the parser distinguish?
4. **Anonymous functions / closures with name collisions** — e.g., two `const handler = () => {...}` at different scopes.
5. **Test files with `describe.each` / generated test functions** — do they produce predictable duplicates?

For each scenario, decide: is dedup acceptable? Or does it warrant Option B (line-suffixed symbolId on collision) or Option C (richer fqName)?

### G3 (P1): Concrete vitest snippets for the test plan

Write actual test code (not pseudocode) for `tests/structural-contract.vitest.ts` additions:

```typescript
describe('indexFiles options', () => {
  it('returns ALL post-exclude files when skipFreshFiles=false', async () => {
    // setup: minimal IndexerConfig with 2-3 mock files all DB-fresh
    // assert: results.length === expected post-exclude count, not 0
  });
  it('skips fresh files when skipFreshFiles=true (default)', async () => { ... });
  it('preserves stale-only behavior when option omitted', async () => { ... });
});

describe('scan handler integration', () => {
  it('incremental:false returns ≥N files matching post-exclude count', async () => {
    // call handleScan with incremental:false against a fixture workspace
    // assert: result.filesIndexed >= 1000 (or appropriate fixture count)
    // assert: result.fullScanRequested === true
    // assert: result.effectiveIncremental === false
  });
  it('idempotent: second incremental:false scan returns same count', async () => { ... });
});
```

And for `tests/tree-sitter-parser.vitest.ts`:

```typescript
describe('capturesToNodes dedup', () => {
  it('drops duplicate (filePath, fqName, kind) captures, preserving first', () => { ... });
  it('does not dedup the moduleNode (always 1)', () => { ... });
  it('regression: indexing structural-indexer.ts produces no duplicate symbolIds', () => { ... });
});
```

Provide actual fixture content + assertion code.

### G4 (P2): Identify any other latent indexer bugs surfaced by this investigation

Are there other call sites that compute "modified files" and might have the same stale-gate confusion? Search for `isFileStale` callers and `incremental` flag handling. Note any P1/P2 issues for follow-up packets without expanding scope of this fix.

## OUTPUT CONTRACT (mandatory)

Three artifacts:

1. **Iteration narrative** at `.../iterations/iteration-003.md`. Sections: Focus, Actions Taken, Findings (G1 verification per caller, G2 edge cases per scenario, G4 latent bugs), Test Plan (G3 — actual vitest code blocks), Questions Answered, Questions Remaining, Next Focus.

2. **JSONL iteration record** APPENDED to state log:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|thought|partial|error>","focus":"<short string>","graphEvents":[]}
```

3. **Per-iteration delta file** at `.../deltas/iter-003.jsonl`. Iteration record + per-event records (verification, edge_case, recommendation, ruled_out, test_case).

## START

Begin Iteration 3. G1 first (caller safety), then G2 (edge cases), then G3 (test code), then G4 if time.
