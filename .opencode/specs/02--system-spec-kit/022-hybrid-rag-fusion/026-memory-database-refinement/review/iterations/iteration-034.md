# Iteration 034: Correctness — Sprint 3-4 fix verification

**Dimension:** Correctness — P1 Sprint 3-4 fixes
**Scope:** Sprint 3 security + governance fixes, Sprint 4 remaining P1 fixes
**Files reviewed:**
- `mcp_server/lib/errors.ts` + `lib/errors/core.ts` + `lib/errors/index.ts`
- `mcp_server/handlers/causal-graph.ts`
- `mcp_server/core/db-state.ts`
- `mcp_server/lib/storage/access-tracker.ts`
- `mcp_server/handlers/session-learning.ts`
- `mcp_server/lib/graph/graph-signals.ts`
- `mcp_server/lib/parsing/memory-parser.ts`
- `mcp_server/handlers/memory-index.ts`
- `mcp_server/lib/eval/ablation-framework.ts`
- `mcp_server/handlers/eval-reporting.ts`

---

## Sprint 3 Verification

### errors.ts / errors/core.ts — domain-specific error codes

**Status: VERIFIED CORRECT**

`errors/core.ts:75-100` defines `ErrorCodes` with granular causal-graph codes: `CAUSAL_EDGE_NOT_FOUND` (E100), `CAUSAL_CYCLE_DETECTED` (E101), `CAUSAL_INVALID_RELATION` (E102), `CAUSAL_SELF_REFERENCE` (E103), `CAUSAL_GRAPH_ERROR` (E104), `TRAVERSAL_ERROR` (E105). The `DEFAULT_TOOL_ERROR_CODES` map at `core.ts:52-66` correctly wires:
- `memory_drift_why` → `TRAVERSAL_ERROR`
- `memory_causal_link` / `memory_causal_stats` / `memory_causal_unlink` → `CAUSAL_GRAPH_ERROR`

The barrel `errors/index.ts` re-exports all symbols cleanly. No issues found.

---

### causal-graph.ts — graph-specific error codes, direction-aware buckets

**Status: VERIFIED CORRECT with one P2 observation**

Domain error codes are used throughout:
- Invalid relation: `ErrorCodes.CAUSAL_INVALID_RELATION` (E102) at `causal-graph.ts:387` and `causal-graph.ts:617`
- DB error: `'E020'` at `causal-graph.ts:371`, `causal-graph.ts:601`, `causal-graph.ts:680`, `causal-graph.ts:801`
- Graph error: `ErrorCodes.CAUSAL_GRAPH_ERROR` at `causal-graph.ts:632`, `causal-graph.ts:657`, `causal-graph.ts:834`
- Traversal error: `ErrorCodes.TRAVERSAL_ERROR` at `causal-graph.ts:545`

Direction-aware buckets (`DirectionalBuckets`) at `causal-graph.ts:59-71` correctly separate `caused`, `enabled`, `supersedes`, `contradicts`, `derivedFrom`, `supports`. The `flattenCausalTree` function at `causal-graph.ts:131-197` correctly derives `edgeDirection` from the traversal direction parameter. The `mapDirection` helper at `causal-graph.ts:247-256` handles both old-style (`forward`/`backward`) and new-style (`outgoing`/`incoming`) values for backward compatibility.

**[P2] Hardcoded `'E031'` in parameter validation paths not using `ErrorCodes` constant**

`causal-graph.ts:357` uses `code: 'E031'` and `causal-graph.ts:578` likewise uses `code: 'E031'`, and `causal-graph.ts:779` also. These should use `ErrorCodes.MISSING_REQUIRED_PARAM` (which equals `'E031'` in `errors/core.ts:85`) for consistency and refactor safety. The value is correct but the constant is not used, creating a maintenance hazard if the code value ever changes.

---

### db-state.ts — singleton DB rebind listener

**Status: VERIFIED CORRECT**

The singleton listener pattern is fully implemented:
- `subscribedVectorIndex` tracks the currently subscribed instance at `db-state.ts:103`
- `registerVectorIndexListener` at `db-state.ts:125-152` checks `subscribedVectorIndex === nextVectorIndex` before subscribing, preventing duplicate subscriptions
- Old listener cleanup at `db-state.ts:130-133` removes prior subscription before registering a new one
- `suppressVectorIndexListener` flag at `db-state.ts:104` prevents re-entry during the `reinitializeDatabase` close-reinit cycle at `db-state.ts:262-271`
- `rebindDatabaseConsumers` at `db-state.ts:154-177` correctly propagates the new DB handle to all registered consumers including `accessTracker`, `checkpoints`, `hybridSearch`, `sessionManagerRef`, `incrementalIndexRef`, and `dbConsumersRef`
- P4-13 fix comment at `db-state.ts:290-295`: mutex resolve order is correct — `resolveMutex!()` is called before `reinitializeMutex = null` to prevent race where a concurrent caller sees null and starts a second reinit

No issues found.

---

### access-tracker.ts — state reset on DB connection change

**Status: VERIFIED CORRECT with one P2 observation**

The DB-swap accumulator reset at `access-tracker.ts:64-70` correctly detects `db !== database` and calls `accumulators.clear()` before accepting the new handle. This prevents stale accumulator state from bleeding into a new DB context.

The P4-14 accumulator size cap at `access-tracker.ts:18-19` (`MAX_ACCUMULATOR_SIZE = 10000`) and flush-on-overflow at `access-tracker.ts:88-97` are correct. The flush loop at `access-tracker.ts:92` iterates `accumulators` and calls `flushAccessCounts(id)` for each entry before clearing.

The P4-15 shutdown liveness check at `access-tracker.ts:274-279` (`db.prepare('SELECT 1').get()`) is an effective safeguard against writing to a closed handle.

**[P2] Flush interval leak if `init()` is called with a new DB before `dispose()`**

`init()` at `access-tracker.ts:63-77` only starts `flushInterval` if `!flushInterval`. If the DB is swapped via a second `init()` call (e.g. via `db-state.ts` rebind), the existing interval keeps firing against the old DB reference until `dispose()` or the next interval tick. The interval is established correctly once, but the `db` reference it reads is updated atomically, so flushes after a swap will use the new DB — this is actually correct behavior. No bug, just worth noting the dependency on reference semantics.

---

## Sprint 4 Verification

### session-learning.ts — session_id scoping, multi-complete rows

**Status: VERIFIED CORRECT with one P2 finding**

The M2 fix (WeakSet per-DB schema tracking) at `session-learning.ts:194-196` (`schemaInitializedDbs = new WeakSet<Database>()`) correctly prevents stale schema-init tracking across DB reconnects.

The M3 fix at `session-learning.ts:289-293` (`!Number.isFinite(score.value)`) correctly rejects `NaN` values since `typeof NaN === 'number'` would have passed the old check.

Session-id normalization at `session-learning.ts:198-204` (`normalizeSessionId`) correctly collapses empty/whitespace to `null`.

The multi-complete row disambiguation at `session-learning.ts:515-529` correctly throws `INVALID_PARAMETER` when `normalizedSessionId === null` and multiple open preflight or completed records exist, requiring the caller to provide a session ID.

The preflight lookup query at `session-learning.ts:338-347` correctly uses `((? IS NULL AND session_id IS NULL) OR session_id = ?)` pattern for null-safe matching.

**[P2] `handleGetLearningHistory` does not normalize `sessionId` from args**

`handleGetLearningHistory` at `session-learning.ts:692` uses the raw `session_id` value from `args.sessionId` without calling `normalizeSessionId()`. Both the record query at `session-learning.ts:693-695` and the summary query at `session-learning.ts:776-778` apply it directly as `AND session_id = ?`. A caller passing `"   "` (whitespace) will be scoped to a literal whitespace session rather than the null/anonymous bucket that the write paths normalize to. This is a session-scope consistency gap between reads and writes.

**Evidence:** `normalizeSessionId()` is called at `session-learning.ts:334` (preflight) and `session-learning.ts:491` (postflight), but not in `handleGetLearningHistory` at `session-learning.ts:661-857`.

**Fix:** Add `const normalizedSessionId = normalizeSessionId(session_id ?? null);` at the top of `handleGetLearningHistory` and use `normalizedSessionId` in both queries, matching write-side scoping rules.

---

### graph-signals.ts — self-loop dedup, cache invalidation, degree cap at 0.15

**Status: PARTIALLY VERIFIED — one P1 finding**

**Self-loop dedup:** `snapshotDegrees` at `graph-signals.ts:67-110` uses `target_id != source_id` in its UNION ALL query at `graph-signals.ts:77-80`, correctly excluding self-loops from degree counts.

**Degree cap:** The task description referenced a cap at 0.15. Reviewing the code: `STAGE2_GRAPH_BONUS_CAP` in `ranking-contract.ts:14` is `0.03`, not `0.15`. The momentum bonus is capped at `0.05` (`clamp(momentum * 0.01, 0, 0.05)` at `graph-signals.ts:586`) and the depth bonus is capped at `0.05` (`depth * 0.05`, depth already normalized 0-1, at `graph-signals.ts:588`). Graph walk bonus is capped by `clampStage2GraphBonus` at `0.03`. The combined additive cap across all three bonuses is therefore `0.05 + 0.05 + 0.03 = 0.13` — not 0.15. If 0.15 was the intended total cap, it is not enforced as a combined ceiling; the individual caps rely on the normalization properties of the component scores.

**[P1] Graph-signal cache invalidation is incomplete for direct `causal_edges` writers**

`clearGraphSignalsCache()` at `graph-signals.ts:54-57` clears both `momentumCache` and `depthCache`. This function must be called any time `causal_edges` rows are mutated. However:

- `causal-graph.ts` calls `causal-edges.insertEdge` and `causal-edges.deleteEdge` which go through the `causal-edges.ts` module (that module calls cache invalidation).
- Several other direct mutation surfaces bypass the `causal-edges.ts` helper. From prior audit knowledge: `vector-index-mutations.ts` deletes causal edges during memory removal, `corrections.ts` deletes correction-owned edges, and `graph-lifecycle.ts` updates edge strengths — none of those paths call `clearGraphSignalsCache()`.

The per-session cache (`momentumCache`, `depthCache`) at `graph-signals.ts:24-27` can therefore hold stale scores after mutations made through bypass paths. Within a session this causes ranking to use pre-mutation graph signals.

**Evidence:** `graph-signals.ts:24-27` declares module-level Maps; `graph-signals.ts:54-57` provides the only clearing mechanism; no automatic invalidation hook ties cache lifetime to DB mutation events.

---

### memory-parser.ts — YAML body not re-parsed, anchor nesting validation, frontmatter errors

**Status: VERIFIED CORRECT with one P1 finding**

**YAML body not re-parsed:** `parseMemoryContent` at `memory-parser.ts:237-289` extracts frontmatter via `extractFrontmatterBlock` and separately strips it for body extraction. The body content after stripping is never re-parsed as YAML — it is used as plain text. This is correct and intentional.

**Frontmatter error handling:** `extractFrontmatterBlock` at `memory-parser.ts:449-458` returns `null` on failure (no match). Downstream callers handle `null` gracefully via optional chaining (`frontmatter?.match(...)`).

**Anchor nesting validation:** `validateAnchors` at `memory-parser.ts:791-841` uses a stack-based parser that correctly detects:
- Out-of-order closes (wrong anchor ID at top of stack)
- Orphaned closes (stack empty when close encountered)
- Unclosed opens (non-empty stack at end)

This is correctly implemented.

**[P1] `extractAnchors()` does not respect the validity result of `validateAnchors()`**

`extractAnchors()` at `memory-parser.ts:845-867` uses a simple regex scan: find opening tag, slice to first subsequent closing tag for that ID. It does not call `validateAnchors()` and does not fail on structurally invalid anchor nesting. The result is that when anchors are malformed (out-of-order, crossed, or unclosed), `extractAnchors()` still returns content — but the returned content boundaries are wrong.

`validateParsedMemory` at `memory-parser.ts:869-900` calls `validateAnchors()` and records warnings, but does not prevent callers from later calling `extractAnchors()` on the same content. Callers that request anchor-scoped content (e.g. search result formatters) can receive truncated or cross-contaminated anchor bodies.

**Evidence:** `extractAnchors()` at `memory-parser.ts:848-866` uses a stateless `anchorRegex.exec()` loop with independent `remainingContent.match(closingRegex)`. No validity gate. `validateAnchors()` at `memory-parser.ts:791` and `extractAnchors()` at `memory-parser.ts:845` are independent functions with no shared state or call dependency.

**Fix:** Either: (a) merge extraction into the stack-based validator so extraction only occurs when nesting is valid, or (b) make `extractAnchors()` call `validateAnchors()` first and return an empty map when structural errors exist.

---

### memory-index.ts — incremental scan content-hash detection

**Status: VERIFIED CORRECT**

The incremental scan content-hash detection path in `incremental-index.ts` (referenced by `memory-index.ts`) at `incremental-index.ts:179-184` correctly:
1. Checks if `stored.content_hash` exists
2. Computes `computeFileContentHash(filePath)`
3. Returns `'modified'` when hashes differ

`memory-index.ts:344-365` correctly calls `incrementalIndex.categorizeFilesForIndexing(files)` which routes through `shouldReindex()` per file.

The SAFETY INVARIANT comment at `memory-index.ts:368-373` is correctly implemented — `successfullyIndexedFiles` is only populated after confirmed successful indexing (`memory-index.ts:410-426`), and `batchUpdateMtimes` is called only on those files at `memory-index.ts:464-467`.

Stale record cleanup at `memory-index.ts:469-477` is correctly gated: only runs when `results.failed === 0`, preventing premature deletion of records when replacement files failed to index.

No issues found.

---

### ablation-framework.ts — ground-truth alignment guard

**Status: VERIFIED CORRECT**

`assertGroundTruthAlignment` at `ablation-framework.ts:314-352` correctly:
1. Calls `inspectGroundTruthAlignment` to check every relevance ID against `memory_index`
2. Throws with a descriptive error when `chunkRelevanceCount > 0` (relevance IDs are chunk records, not parent memories) OR `missingRelevanceCount > 0` (relevance IDs not in DB at all)
3. Returns the summary when the alignment is clean

The guard is invoked in `runAblation` at `ablation-framework.ts:581-586` when `config.alignmentDb` is provided, and also at the call site in `eval-reporting.ts:252-261` before the search function is constructed.

The double-guard pattern (both `runAblation` and the handler call `assertGroundTruthAlignment`) is intentional: the handler provides early-exit before the expensive search loop, while `runAblation` re-validates when called with `alignmentDb` to protect programmatic callers.

No issues found.

---

### eval-reporting.ts — per-channel breakdown

**Status: VERIFIED CORRECT**

`handleEvalRunAblation` at `eval-reporting.ts:227-327` correctly:
- Returns `report.results` which is `AblationResult[]` — one entry per channel
- Each `AblationResult` at `ablation-framework.ts:115-136` includes per-channel: `baselineRecall20`, `ablatedRecall20`, `delta`, `pValue`, `queriesChannelHelped`, `queriesChannelHurt`, `queriesUnchanged`, `queryCount`, and the full `metrics` breakdown (`AblationMetrics` with 9 metric entries)
- `buildAggregatedMetrics` at `ablation-framework.ts:486-533` produces the per-channel breakdown correctly using `entry()` helper
- The L2 fix at `ablation-framework.ts:505-512` correctly filters zero/undefined token usage to avoid synthetic zero averages when `tokenUsage` is not populated

No issues found.

---

## Summary

**P0: 0**

**P1: 2**

1. `graph-signals.ts:54-57` — Cache invalidation incomplete: direct `causal_edges` writers (vector-index-mutations, corrections, graph-lifecycle) bypass `clearGraphSignalsCache()`, causing stale momentum/depth scores in ranking until an unrelated session boundary.

2. `memory-parser.ts:845-867` — `extractAnchors()` does not gate on `validateAnchors()` result. Structurally invalid (crossed/unclosed) anchors produce wrong content boundaries in anchor-scoped reads. The validator detects the problem but extraction still runs, allowing corrupted anchor bodies to reach callers.

**P2: 2**

3. `session-learning.ts:661+` — `handleGetLearningHistory` does not call `normalizeSessionId()` on the incoming `sessionId`. Write paths normalize blank/whitespace to null; the read path does not, creating session-scope inconsistency.

4. `causal-graph.ts:357,578,779` — Hardcoded `'E031'` string literals instead of `ErrorCodes.MISSING_REQUIRED_PARAM` constant. Functionally correct but creates refactor hazard.

**Verified correct (no issues):**
- `errors.ts` / `errors/core.ts`: domain-specific causal error codes E100-E105 fully implemented and wired
- `db-state.ts`: singleton DB rebind listener, suppress-during-reinit, mutex resolve ordering all correct
- `access-tracker.ts`: DB-swap accumulator reset, size cap, shutdown liveness check all correct
- `session-learning.ts`: WeakSet per-DB schema init (M2), NaN rejection in score validation (M3), multi-complete disambiguation all correct
- `graph-signals.ts`: self-loop dedup in `snapshotDegrees`, individual bonus caps correctly bounded
- `memory-index.ts`: incremental content-hash detection, mtime-update ordering, stale-cleanup guard all correct
- `ablation-framework.ts`: ground-truth alignment guard, double-guard pattern, token-usage filter all correct
- `eval-reporting.ts`: per-channel breakdown with 9 metrics, early alignment check all correct
