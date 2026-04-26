# Iteration 11 - Self-Healing Implementation Strategy

## Summary

Q14A-Q14E are answered. The safe implementation path is not a new hidden repair mode; it is an explicit, observable narrowing of the existing `selective_reindex` branch in `ensureCodeGraphReady()`. The branch may auto-run only when the caller allows inline indexing, the state is bounded soft-stale, the latest trusted verification and drift summaries are passing, and the action remains selective. Full scans, verification failures, drift review states, read-only impact paths, and probe errors must return an operator-visible non-fresh readiness result instead of repairing silently.

One implementation caveat matters: the current timeout is a `Promise.race()` against a timer, but the `AbortController` signal is not passed into `indexFiles()`. That bounds the readiness await, not necessarily the underlying indexing work. The self-heal patch should either thread cancellation into `indexFiles()` or record the timeout as a late-work risk. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:189-224`]

## Current Readiness Flow

Decision tree:

1. `EnsureReadyOptions` exposes `allowInlineIndex` and `allowInlineFullScan`; `ensureCodeGraphReady()` defaults inline indexing to `true` and full scan permission to the inline-index value. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:38-41`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-293`]
2. A 5-second debounce returns the prior result for the same `rootDir` plus option shape before rechecking DB state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:261-288`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:295-300`]
3. `detectState()` returns `full_scan` for an empty graph or no tracked files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-116`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:127-130`]
4. Git HEAD drift forces `full_scan` even when tracked files are otherwise current. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-145`]
5. Deleted tracked files with no stale existing files return `action:"none"` plus `freshness:"stale"` so cleanup can occur without reparsing. A fully current graph returns `fresh`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:148-158`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302-312`]
6. More than 50 stale files crosses `SELECTIVE_REINDEX_THRESHOLD` and becomes `full_scan`; 1-50 stale files becomes `selective_reindex`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-51`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:161-186`]
7. The selective path is blocked when `allowInlineIndex:false`; the full-scan path is blocked when `allowInlineFullScan:false`. Both return the stale action and mark `inlineIndexPerformed:false`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:314-330`]
8. The current selective reindex path calls `indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles })`, updates Git HEAD, reruns `detectState()`, and returns the refreshed state with `inlineIndexPerformed:true`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:352-367`]
9. The current full-scan auto path has the same timeout and refresh pattern, but callers such as `code_graph_query` and `code_graph_context` pass `allowInlineFullScan:false`, so query/context can self-heal selectively but not silently full-scan. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1040-1045`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:116-122`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:333-350`]
10. `detect_changes` is the read-only impact boundary: it calls `ensureCodeGraphReady(..., { allowInlineIndex:false, allowInlineFullScan:false })` before diff parsing and blocks for any non-`fresh` readiness. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

## Proposed Self-Heal Branch

The branch should live inside `ensureCodeGraphReady()` after `detectState()` and deleted-file cleanup, but before the current selective indexing call. The read-only gate must remain first for mutation safety.

```ts
const state = detectState(rootDir);
const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);

if (state.action === 'none') return readyOrSoftStaleResult(...);

if (state.action === 'selective_reindex' && !allowInlineIndex) {
  return skipped('inline auto-index skipped for read path');
}

if (state.action === 'full_scan' && !allowInlineFullScan) {
  return skipped('inline full scan skipped for read path');
}

if (state.action === 'selective_reindex') {
  const gate = evaluateSelfHealGate(rootDir, state);
  if (!gate.allowed) {
    recordSelfHealEvent({ result: 'skipped', reason: gate.reason });
    return skipped(`${state.reason}; self-heal skipped: ${gate.reason}`);
  }

  recordSelfHealEvent({ result: 'started', files: state.staleFiles.length });
  await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });
  const refreshedState = detectState(rootDir);

  if (refreshedState.freshness !== 'fresh' || refreshedState.action !== 'none') {
    recordSelfHealEvent({ result: 'partial_failure', remaining: refreshedState.staleFiles.length });
    return refreshedResultWithSelfHealFailure(...);
  }

  recordSelfHealEvent({ result: 'success', files: state.staleFiles.length });
  return healedResult(...);
}
```

Invariant checklist:

- Caller permission: `allowInlineIndex === true`; read-only impact paths keep `false`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]
- Action is exactly `selective_reindex`; never reinterpret `full_scan` as self-heal. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:161-186`; `research/iterations/iteration-007.md:21-29`]
- Stale files are existing tracked files and `1 <= staleFiles.length <= 50`; deleted rows may be cleaned, but they are not reindexed. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:70-83`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:176-186`]
- Git HEAD has not drifted; head drift is hard-stale/full-scan territory. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-145`; `assets/staleness-model.md:9-14`]
- Latest gold verification is present and passing, or the branch reports "verification missing" and skips self-heal. [SOURCE: `assets/code-graph-gold-queries.json:1-10`; `decision-record.md:108-114`]
- Latest edge-drift summary is absent only before baseline creation; once present, review/block drift states skip self-heal. [SOURCE: `research/iterations/iteration-006.md:29-58`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:271-279`]
- The result is observable via `ReadyResult`, persisted metadata, and status output; no silent success/failure. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-36`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`]

## Gold-Query Floor Plug-in

The gold-query floor should not execute the full battery inside every readiness check. Iteration 12 establishes that the current asset is v1 and needs an adapter, with a reusable verifier library plus `code_graph_verify` tool persisting `last_gold_verification` metadata. [SOURCE: `research/iterations/iteration-012.md:5-8`; `research/iterations/iteration-012.md:9-37`]

Call site:

- In `ensureCodeGraphReady()`, add a cheap `readGoldVerificationGate()` call after the read-only inline-index gate and before `indexWithTimeout()` in the selective branch. This reads persisted verifier metadata only.
- In `handleCodeGraphScan()`, call the verifier after persistence for full scans or explicit verification so future readiness checks have a latest trusted floor. The scan handler already builds the result after persistence at lines 247-287. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-287`; `research/iterations/iteration-012.md:40-46`]
- In `code_graph_verify`, keep `allowInlineIndex:false` so verification itself cannot mutate the graph. [SOURCE: `research/iterations/iteration-012.md:13-28`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

Threshold:

- Overall top-K symbol pass rate must be `>= 0.90`.
- Per edge-focus bucket pass rate must be `>= 0.80`.
- No critical expected symbol may be missing from top-K.

These floors are already materialized in the asset and decision record. [SOURCE: `assets/code-graph-gold-queries.json:5-8`; `decision-record.md:108-112`]

Gate behavior:

- `pass`: selective self-heal may proceed if all other gates pass.
- `missing`: skip self-heal and return stale readiness with `verificationGate:"missing"`.
- `fail`: skip self-heal, set `verificationGate:"failed"`, and surface hard-stale wording through status/doctor.
- `stale`: if the persisted verification predates the latest trusted full scan or Git HEAD, skip self-heal until verification is rerun.

## Edge-Drift Floor Plug-in

Edge drift is a cheap DB/statistics gate, so it can run inline as a metadata read plus optional low-cardinality calculation. Current `getStats()` already returns `edgesByType` and `graphQualitySummary`, while metadata wrappers already support JSON summaries. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:671-716`]

Call site:

- Add `readEdgeDriftGate(rootDir)` beside `readGoldVerificationGate()` in the selective branch before `indexWithTimeout()`.
- If no baseline exists yet, return `unknown_baseline` and allow self-heal only when the stale set is otherwise bounded and gold verification is passing. This prevents a bootstrap deadlock on older DBs.
- Once a baseline exists, compute or read the latest drift summary from `code_graph_metadata`, then skip self-heal on review/block states.

Threshold:

- Warn when any edge type share changes by `> 30% relative` or `> 5 percentage points absolute`.
- Hard review when a previously non-zero edge type drops to zero.
- Warn at PSI `>= 0.10`, require review at PSI `>= 0.25`, and warn at JSD `>= 0.10`.
- For gold-query edge-focus buckets, block trust below `0.80`.

These thresholds come from iteration 6 and the staleness model. [SOURCE: `research/iterations/iteration-006.md:31-58`; `assets/staleness-model.md:21-25`]

## Observability Surface

Existing readiness observability is minimal. `ensure-ready` logs only auto-index failures with `console.error()`, and status surfaces readiness, trust state, timestamps, Git head, DB size, schema version, parse health, and `graphQualitySummary`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:369-378`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`]

Proposed surfaces:

1. Extend `ReadyResult` with:
   - `selfHealAttempted?: boolean`
   - `selfHealResult?: 'skipped' | 'success' | 'failed' | 'timeout' | 'partial_failure'`
   - `selfHealReason?: string`
   - `selfHealFiles?: number`
   - `verificationGate?: 'pass' | 'missing' | 'failed' | 'stale'`
   - `edgeDriftGate?: 'pass' | 'unknown_baseline' | 'warn' | 'review' | 'failed'`
   - `lastSelfHealAt?: string`
2. Persist a compact metadata event under `last_self_heal` and `last_self_heal_at` using the existing metadata table. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204`]
3. Add `lastSelfHealAt`, `lastSelfHeal`, `lastGoldVerification`, and `edgeDriftSummary` to `code_graph_status.data`. This is a clean shape extension because status already includes graph quality and readiness fields. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`; `research/iterations/iteration-012.md:40-45`]
4. Emit one structured log per self-heal attempt:
   - `[ensure-ready] self-heal skipped: <reason>`
   - `[ensure-ready] self-heal started: files=<n>`
   - `[ensure-ready] self-heal success: files=<n> durationMs=<ms>`
   - `[ensure-ready] self-heal failed: <message>`
5. Treat the persisted metadata event as the v1 telemetry event. There is no separate telemetry bus in the reviewed code-graph readiness path; scan/status already use returned payloads plus metadata as the operational surface. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:230-262`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:271-279`]

## Patch Surface

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-36` - extend `ReadyResult` with self-heal and gate fields.
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:38-41` - optionally add `allowSelfHeal?: boolean` as an alias/defaulted policy knob; keep `allowInlineIndex` as the hard mutation gate.
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:189-224` - either thread an abort signal into `indexFiles()` or document/record that timeout cancels the await but may leave late indexing work.
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302-330` - preserve current `none`, selective-skip, and full-scan-skip ordering; add self-heal gate evaluation only after read-only skip checks.
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:352-367` - replace the raw selective branch with an observable self-heal branch that records started/success/partial-failure metadata and refreshed readiness.
6. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:369-378` - record failed/timeout self-heal metadata before returning stale readiness.
7. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204` - export narrow metadata helpers for `last_self_heal`, `last_gold_verification`, and edge drift summaries, or add typed wrappers beside the existing detector/edge-enrichment helpers.
8. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:271-279` - extend `getGraphQualitySummary()` with gold verification, edge drift, and self-heal summary fields.
9. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62` - surface `lastSelfHealAt`, `lastSelfHeal`, `lastGoldVerification`, `goldVerificationTrust`, and `edgeDriftSummary`.
10. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264` - add regression coverage but do not change the contract; it must keep `allowInlineIndex:false` and `allowInlineFullScan:false`.
11. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1040-1045` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:116-122` - confirm query/context remain selective-only auto-heal callers by keeping `allowInlineFullScan:false`.

## Failure-Path Coverage

- Gate failure before indexing: return the current stale/selective readiness, `inlineIndexPerformed:false`, `selfHealAttempted:false`, and a reason naming the failed gate. This preserves the caller contract while making the operator action visible.
- Read-only path: `detect_changes` continues to block before diff parsing and never triggers self-heal. A verification failure should make upstream readiness/trust non-fresh, not repair inside `detect_changes`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`; `decision-record.md:142-146`]
- Timeout: catch the timeout as `selfHealResult:"timeout"` and return stale readiness with the original `files` list. Because the current `Promise.race()` does not pass cancellation to `indexFiles()`, also record a `lateWorkPossible:true` flag until cancellation is implemented. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:189-224`]
- Per-file persistence failure: `indexWithTimeout()` currently catches and skips individual `persistIndexedFileResult()` failures; those files should remain stale because persistence stages `file_mtime_ms=0` before finalizing mtime. The refreshed `detectState()` must decide success versus `partial_failure`, not the mere completion of `indexFiles()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:208-216`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:360-367`]
- Full-scan required mid-run: if refreshed state becomes `full_scan`, return `selfHealResult:"partial_failure"` and keep `allowInlineFullScan` semantics. Do not escalate into full auto-scan unless the caller explicitly allowed it. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:324-330`; `research/iterations/iteration-007.md:21-29`]
- Verification or drift failure after partial heal: mark the graph non-trusted in status/metadata and tell operators to run full scan plus verification. Partial self-heal is not trust promotion; it is bounded stale-file repair. [SOURCE: `assets/staleness-model.md:11-14`; `decision-record.md:108-124`]

## Files Reviewed

- `research/deep-research-state.jsonl:1-13`
- `research/deep-research-strategy.md:1-80`
- `research/deep-research-config.json:1-17`
- `research/prompts/iteration-011.md:1-58`
- `research/iterations/iteration-004.md:1-220`
- `research/iterations/iteration-006.md:1-117`
- `research/iterations/iteration-007.md:1-88`
- `research/iterations/iteration-012.md:1-138`
- `research/deltas/iteration-010.json:1-63`
- `assets/staleness-model.md:1-27`
- `assets/code-graph-gold-queries.json:1-236`
- `decision-record.md:108-150`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-405`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:1-370`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-77`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1031-1065`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:107-145`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-287`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-279`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:671-716`

## Convergence Signals

- research_questions_answered: ["Q14A", "Q14B", "Q14C", "Q14D", "Q14E"]
- newFindingsRatio: 0.36
- newInfoRatio: 0.36
- status: insight
- dimensionsCovered: ["readiness-decision-tree", "inline-index-gating", "timeout-semantics", "gold-verification-gate", "edge-drift-gate", "status-observability", "failure-paths", "patch-surface"]
- novelty justification: This iteration converts the earlier self-healing boundary into a concrete `ensureCodeGraphReady()` branch design, identifies the timeout cancellation caveat, and ties self-heal eligibility to persisted verification/drift gates plus operator-visible status metadata.
