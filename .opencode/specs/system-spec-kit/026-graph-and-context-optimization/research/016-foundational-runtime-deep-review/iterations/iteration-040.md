# Iteration 40 — Domain 3: Concurrency and Write Coordination (10/10)

## Investigation Thread
I treated Iterations 031-038 as the baseline and avoided reusing the already-claimed split-brain autosave, shared `/tmp/save-context-data.json`, and graph-metadata temp-path findings. This final pass stayed on the same concurrency domain but targeted two remaining unclaimed seams: the hook-state stale-cleanup delete path, and the governed reconsolidation scope filter that still runs outside any transaction and stitches together two unsynchronized reads.

## Findings

### Finding R40-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `hook-state.ts:170-176, 247-255`; `session-stop.ts:321-328`
- **Severity:** P2
- **Description:** `cleanStaleStates()` can delete a freshly-written session state because its stale-file decision is made from a pre-delete `statSync()`, while `saveState()` replaces the whole pathname with `renameSync()`. If cleanup stats an old file, then a live writer renames a new generation onto the same `filePath` before `unlinkSync(filePath)`, the cleanup pass deletes the fresh state and still increments `removed` as if it had deleted the stale one.
- **Evidence:** `saveState()` writes `filePath + '.tmp'` and then swaps it into place with `renameSync(tmpPath, filePath)` (`hook-state.ts:170-176`). `cleanStaleStates()` separately does `const stat = statSync(filePath)` and, if that old `mtimeMs` is below cutoff, later calls `unlinkSync(filePath)` on the same pathname without re-checking the file identity (`hook-state.ts:247-255`). Claude finalize mode trusts the returned `removed` count and reports it as the cleanup result (`session-stop.ts:321-328`). The checked-in hook-state suite never exercises this path: `tests/hook-state.vitest.ts:4-224` imports `cleanStaleStates` but contains no invocation of it, so there is no regression for a save-between-stat-and-unlink interleave.
- **Downstream Impact:** A finalize sweep that overlaps with live hook writers can erase the newest continuity state and make the next startup/resume look like a cold start. Because the cleanup count still looks normal, operators get a false maintenance-success signal instead of a visible lost-state failure.

### Finding R40-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `203-236`, `282-295`, `453-465`
- **Severity:** P1
- **Description:** Governed reconsolidation candidate filtering is internally split-brain even before the later write transaction race. The bridge first ranks candidates with `vectorSearch(...)`, then separately re-reads each candidate's governance scope via `SELECT tenant_id, user_id, agent_id, session_id FROM memory_index WHERE id = ?`. A concurrent writer can therefore change or remove the candidate between those reads, so one candidate is admitted or rejected using similarity/content from one snapshot and scope from another.
- **Evidence:** `readStoredScope()` issues a fresh per-candidate `SELECT ... FROM memory_index WHERE id = ?` (`reconsolidation-bridge.ts:203-217`). `candidateMatchesRequestedScope()` uses that live row when governed scope is present (`reconsolidation-bridge.ts:219-236`). Both the main TM-06 path and the assistive path run `vectorSearch(...)` first and only then apply `candidateMatchesRequestedScope(...)` during filtering (`reconsolidation-bridge.ts:282-295, 453-465`). No test exercises that mixed-source window: `tests/reconsolidation-bridge.vitest.ts:255-330` uses fixed vector results plus a fixed `database.prepare().get()` response, and the handler ordering regression only proves reconsolidation planning finishes before the normal write transaction starts (`tests/handler-memory-save.vitest.ts:1056-1093`).
- **Downstream Impact:** Under concurrent governed saves, reconsolidation can silently drop a real duplicate, keep a candidate that has already moved out of scope, or generate an assistive recommendation against a candidate universe that no longer matches the ranked search results. That makes duplicate suppression nondeterministic and weakens the trustworthiness of save-time lineage decisions.

## Novel Insights
- The remaining Domain 3 bugs are now mostly **TOCTOU identity problems**, not just generic "missing lock" writes. In `hook-state.ts`, the same pathname can change identity between stale-check and delete. In `reconsolidation-bridge.ts`, the same candidate can change identity between ranking and scope validation.
- Earlier iterations already covered the visible autosave split-brain and shared-temp-path seams. This pass shows that even the supposed cleanup and governance guardrails still make decisions from paths or rows that can change underneath them.

## Next Investigation Angle
If this domain gets any follow-up work, it should switch from discovery to harness construction: one adversarial test that renames a fresh hook-state file into place between `statSync()` and `unlinkSync()`, and one reconsolidation regression that mutates or deletes a governed candidate between `vectorSearch()` and `readStoredScope()`.
