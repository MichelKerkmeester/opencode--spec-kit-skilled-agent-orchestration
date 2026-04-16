# Interim Synthesis - Phase 016 Foundational Runtime Deep Review

**As of: iteration 38** [NEW since 32] (Domain 3 now 8/10; Domain 4 still not started; Domain 5 still embedded in subsidiary evidence)
**Author:** synthesis agent (read-only analysis)
**Scope:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/iterations/iteration-001.md` through `iteration-038.md`
**Note:** Iterations 1-10 are foundational pre-domain passes; domain tagging starts at iteration 11. Actual domain coverage:
- **Foundational (1-10)**: session-lifecycle / hook-state / code-graph / post-insert / shared-payload / compact-cache seam exploration
- **Domain 1 (11-20)**: Silent Fail-Open Patterns (complete)
- **Domain 2 (21-30)**: State Contract Honesty (complete)
- **Domain 3 (31-38)**: Concurrency and Write Coordination (8 of 10) [NEW since 32: +6 iterations]
- **Domain 4 (Stringly-Typed Governance)**: not started
- **Domain 5 (Test Coverage Gaps)**: not started (still appearing as subsidiary finding in almost every iteration rather than a dedicated domain)

---

## Section 1 - Finding Inventory

### 1.1 Raw counts [NEW since 32: all metrics updated]

| Metric                          | Count (iter 32) | Count (iter 38) | Delta |
| ------------------------------- | --------------- | --------------- | ----- |
| Iterations read                 | 32              | 38              | +6    |
| Total numbered findings emitted | 68              | 82              | +14   |
| P1 findings                     | 39              | 47              | +8    |
| P2 findings                     | 29              | 35              | +6    |
| P0 findings                     | 0               | 0               | 0     (see §4 for escalation candidates) |
| Unique file surfaces flagged    | 14              | 15              | +1    (runtime root instruction files: AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md collapsed to 1 surface) |
| Distinct anti-patterns          | 7               | 9               | +2    (identity-free cleanup; selection-vs-content torn reads; directory-level single-try loops are the additions) |

### 1.2 Findings per source file (after deduplication) [NEW since 32: tallies updated]

| File                                                                                   | Raw hits (32 → 38) | Distinct issues (32 → 38) | Dominant domain |
| -------------------------------------------------------------------------------------- | ------------------ | ------------------------- | --------------- |
| `mcp_server/hooks/claude/hook-state.ts`                                                | 10 → 17            | 5 → 9                     | D2, D3          |
| `mcp_server/hooks/claude/session-stop.ts`                                              | 13 → 20            | 7 → 11                    | D1, D2, D3      |
| `mcp_server/handlers/save/post-insert.ts`                                              | 14 → 14            | 6 → 6                     | D1, D2          |
| `mcp_server/handlers/code-graph/query.ts`                                              | 11 → 11            | 6 → 6                     | D1, D2          |
| `mcp_server/handlers/save/reconsolidation-bridge.ts`                                   | 8 → 13             | 5 → 8                     | D1, D3          |
| `mcp_server/lib/graph/graph-metadata-parser.ts`                                        | 7 → 7              | 4 → 4                     | D1, D2, D3      |
| `mcp_server/lib/context/shared-payload.ts`                                             | 3 → 3              | 2 → 2                     | D2              |
| `mcp_server/lib/code-graph/startup-brief.ts`                                           | 3 → 3              | 1 → 1 (dedup R1-001 ≡ R2-001 ≡ R4-001) | Foundational |
| `mcp_server/lib/code-graph/ensure-ready.ts`                                            | 2 → 2              | 2 → 2                     | Foundational    |
| `mcp_server/handlers/session-bootstrap.ts` + `session-resume.ts` + `session-health.ts` | 4 → 5              | 3 → 4                     | D2, D3          |
| `mcp_server/lib/context/opencode-transport.ts`                                         | 2 → 2              | 2 → 2                     | D2              |
| `mcp_server/lib/parsing/memory-parser.ts`                                              | 1 → 1              | 1 → 1                     | D2              |
| `mcp_server/handlers/memory-save.ts` + `save/response-builder.ts`                      | 2 → 4              | 2 → 3                     | D2, D3          |
| `mcp_server/hooks/claude/shared.ts` + `hooks/gemini/session-prime.ts`                  | 2 → 3              | 2 → 3                     | Foundational, D3 |
| `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs                            | 2 → 3              | 2 → 3                     | D3              |
| **[NEW since 32]** `AGENTS.md` + `CLAUDE.md` + `CODEX.md` + `GEMINI.md` (runtime root instructions) | 0 → 1 | 0 → 1 | D3 |
| **[NEW since 32]** `mcp_server/hooks/gemini/session-stop.ts` + `hooks/gemini/compact-inject.ts` | 0 → 2 | 0 → 2 | D3 |

### 1.3 Deduplication notes [NEW since 32: three new clusters appended]

The raw 82-finding total includes substantial overlap across iterations. After merging:

| Dedup cluster                                              | Iterations touching it                                                                            | Canonical finding |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------- |
| `startup-brief` scope-less `loadMostRecentState()`         | R1-001, R2-001, R4-001                                                                            | R2-001 |
| `hook-state` poison-pill JSON.parse loop                   | R2-002, R4-002, **[NEW since 32]** R38-001                                                        | R2-002 (extended by R38-001: directory-level all-or-nothing scan) |
| `code-graph/query.ts` readiness fails open                 | R3-002, R11-003 (blast-radius variant), R22-001, R23-001, R25-002, R27-002                         | R3-002 |
| `post-insert.ts` enrichmentStatus boolean collapse         | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R21-001, R25-001, R27-001           | R8-001 |
| `graph-metadata-parser` legacy fallback as success         | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003                             | R11-002 + R21-003 (laundering variant) |
| `reconsolidation-bridge` scope-filter silent drop          | R11-004, R12-003, R13-004 (throws variant), R16-002 (malformed rows), R19-002 (assistive)         | R11-004 + R13-004 |
| `hook-state.ts` unvalidated `JSON.parse(raw) as HookState` | R21-002, R23-003, R24-002, R25-004, R28-001, R28-002, R29-001                                     | R21-002 |
| `session-stop.ts` unlocked RMW + autosave races            | R31-001, R31-002, R32-001, R32-002, R33-002, R33-003, R34-001, **[NEW since 32]** R35-002, R37-001, R37-002 | R31-001 + R31-002 (extended by R35-002 for `touchedPaths` mirror, R37-001 for hidden zero-offset write, R37-002 for stale `currentSpecFolder` preference) |
| `trustStateFromStructuralStatus` missing→stale collapse    | R9-001, R26-001, R30-001                                                                          | R9-001 |
| `opencode-transport` drops richer trust axes               | R9-002, R30-002                                                                                   | R30-002 |
| **[NEW since 32]** Compact-cache identity-free cleanup     | R33-001                                                                                           | R33-001 (standalone; no prior overlap) |
| **[NEW since 32]** Reconsolidation conflict multi-successor fan-out | R31-003, R32-003 (predecessor/scope), R35-001 (multi-successor fan-out)                 | R31-003 + R35-001 (distinct scope: R31/R32 = lost updates; R35 = forked lineage) |
| **[NEW since 32]** Complement / assistive pre-transaction snapshots | R34-002 (complement), R36-002 (assistive stale recommendation), R37-003 (split-snapshot per request) | R34-002 + R36-002 (assistive variant) + R37-003 (intra-request split) |
| **[NEW since 32]** `/tmp/save-context-data.json` shared path | R31-005, R32-005, R35-003 (root instruction files), R36-003 (runtime error contract)            | R31-005 (extended by R35-003 for cross-runtime root-doc prescription; R36-003 for executable error message) |
| **[NEW since 32]** Hook-state loader torn read (stat vs content generation) | R36-001                                                                                | R36-001 (standalone; orthogonal to RMW writer races) |
| **[NEW since 32]** `cleanStaleStates` single-try sweep     | R38-002                                                                                           | R38-002 (standalone; mirrors R2-002 / R38-001 pattern for cleanup lane) |

After deduplication the finding set compresses to approximately **40 distinct issues** across 15 surfaces (prior: ~33 across 14). [NEW since 32: +7 distinct issues]

---

## Section 2 - Per-Domain Summary

### 2.1 Foundational Seams (iterations 1-10)

Iterations 1-10 predate the formal domain labeling and act as a reconnaissance pass across the runtime-critical session, graph, and save seams. They establish the baseline that Domains 1-3 later extend. (Unchanged since iteration 32.)

**Key patterns discovered:**

1. **Scope contract split between session-start and session-resume.** The startup-brief continuity lane calls `loadMostRecentState()` with no scope, while the canonical hook-state contract hard-rejects scope-less reads (R1-001, R2-001, R4-001). Gemini startup depends on this lane directly, so Gemini always gets a continuity-free startup surface.
2. **Readiness and freshness report asymmetry.** Inline reindex completes while still reporting `freshness: 'stale'` (R5-001); partial persistence writes `file_mtime_ms` before node/edge failure so failed files look fresh on the next scan (R5-002).
3. **Trust-vocabulary collapse in shared payload.** `trustStateFromGraphState()` and `trustStateFromStructuralStatus()` both collapse `missing` and `empty` into `stale` (R9-001). `coerceSharedPayloadEnvelope()` only validates shape, not semantic provenance (R9-002).
4. **Asymmetric compact-cache replay across runtimes.** Gemini replay drops provenance metadata entirely; Claude preserves it but interpolates it directly into the `[PROVENANCE: ...]` prompt line with no escaping (R10-001, R10-002).

**Representative exemplars:**

```
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:179-192 — buildSessionContinuity() calls loadMostRecentState() with no scope
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:131-166 — poison-pill JSON.parse loop
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:283-317 — successful inline reindex keeps pre-refresh freshness
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:592-601 — missing/empty collapsed into stale
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:55-68 — Gemini compact replay drops provenance
```

**Open questions:**
- Does `ensure-ready.ts`'s `setLastGitHead()` on partial-persistence success actually block subsequent staleness detection for the unpersisted files?
- Are there other consumers of `trustStateFromStructuralStatus()` that read the collapsed label without reading the richer sibling contract (Iteration 30 found two; the OpenCode transport and health surface)?

---

### 2.2 Domain 1 - Silent Fail-Open Patterns (iterations 11-20, complete)

**Central thesis:** the runtime contains many surfaces that return success-shaped payloads after work was skipped, partially applied, or filtered out. These are truth-contract erosions where absence, invalid input, or internal failure is re-interpreted as ordinary benign outcome. (Unchanged since iteration 32 — no new Domain 1 iterations.)

**Key patterns discovered:**

1. **Status erasure at the response boundary.** `session-stop.ts` and `post-insert.ts` both have machine-readable result objects but flatten failed, partial, or skipped work into ordinary success. `response-builder.ts` reduces per-step status nuance into at most a generic warning string (R12-001, R17-002, R21-001).
2. **Input-contract normalization.** Unsupported operations and malformed candidate rows are converted into plausible success states rather than rejected. Examples: `code_graph_query` accepts any `edgeType` string without validating against an allowed set (R12-002, R14-002), transitive traversal bypasses the one-hop `switch` default operation validator (R16-001), and reconsolidation silently coerces malformed vector rows into sentinel values (R16-002).
3. **Absence reinterpreted as truth.** Autosave silently skips when `lastSpecFolder` or `sessionSummary` are missing (R13-001); `graph-metadata-parser.ts` collapses unreadable canonical docs into "doc missing" semantics that then mislead `deriveStatus()` (R13-002); unresolved outline subjects become "file has no symbols" (R13-003); thrown reconsolidation errors become "normal create path" (R13-004).
4. **Second-order truth loss.** Producer-metadata failure also fail-opens the transcript cursor: `storeTokenSnapshot()` already rewrote `lastTranscriptOffset: 0` before the later catch swallows the metadata write failure (R14-001). **[NEW since 32]** Iteration 37's R37-001 now proves this `0` write is observable by concurrent readers even on the happy path, not only after exception.
5. **Provenance drift in successful envelopes.** Query-level `graphMetadata.detectorProvenance` is a DB-global singleton, so an empty or heuristic-only result still advertises `structured` (R18-001, R20-003). Legacy fallback fabricates `created_at`/`last_save_at` from `new Date().toISOString()` (R20-002). Validation diagnostics degrade to legacy-shape errors when a modern file happens to pass legacy parsing (R18-002).
6. **Packet-target authority drift.** Transcript-driven retargeting silently rewrites the autosave destination (R15-001); the 50 KB tail window can hide the real active packet (R15-002); transcript I/O failure is collapsed into the same "ambiguous transcript" path as normal ambiguity (R15-003). **[NEW since 32]** R37-002 extends this with a stale-snapshot preference: `detectSpecFolder()` keeps the old packet when `currentSpecFolder` is itself sourced from an unlocked earlier read.

**Concrete exemplar findings (5 with file:line):** (unchanged from iteration 32)

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R8-001  | `mcp_server/handlers/save/post-insert.ts:86-213,223-238` | P1 | `enrichmentStatus = true` for four different outcomes: success, feature-disabled skip, "nothing to do" skip, and full deferral |
| R11-003 | `mcp_server/handlers/code-graph/query.ts:367-385` | P1 | `blast_radius` silently degrades unresolved subjects into seed file paths via `resolveSubjectFilePath(candidate) ?? candidate` |
| R13-002 | `mcp_server/lib/graph/graph-metadata-parser.ts:280-285,457-475,849-860` | P1 | `readDoc()` collapses I/O failure into `null`, `deriveStatus()` then reinterprets missing docs as `planned` or `complete` |
| R13-004 | `mcp_server/handlers/save/reconsolidation-bridge.ts:261-270,438-442` | P1 | Any thrown error (checkpoint, reconsolidate, similarity, conflict store) is caught and falls through to normal create without a structured warning |
| R20-001 | `mcp_server/hooks/claude/session-stop.ts:199-218,248-268` | P1 | `buildProducerMetadata()` re-stats the live transcript, so metadata can describe a later transcript state than the parsed one |

**Open questions for Domain 1:**
- Can the response-builder layer be refactored to surface per-step `status: 'ran' | 'deferred' | 'skipped' | 'partial' | 'failed'` without breaking the regression contract that currently asserts all-true booleans?
- Is there any machine-readable way for the runtime itself to distinguish "autosave disabled by config" from "autosave failed to find required state"?
- Does `code_graph_context` inherit the same readiness-fail-open pattern as `code_graph_query`? (Iteration 5 hints yes via `handlers/code-graph/context.ts:96-105,169-194`; not fully audited.)

---

### 2.3 Domain 2 - State Contract Honesty (iterations 21-30, complete)

**Central thesis:** the remaining honesty problem is **state promotion and state laundering**. Collapsed producer state becomes harder to recover from once a downstream layer re-emits it as a stronger contract. (Unchanged since iteration 32 — no new Domain 2 iterations.)

**Key patterns discovered:**

1. **State laundering across boundaries.** `memory_save` response drops step detail into warnings (R21-001); hook state drives both prompt text and write targeting without validation (R21-002); legacy graph metadata is rewritten as canonical JSON on refresh with no legacy marker (R21-003).
2. **State promotion at consumer layers.** `code_graph_query` diverges from canonical readiness vocabulary: bootstrap says `missing`, query says `empty` (R23-001). Fallback-migrated graph metadata receives `qualityScore: 1` and a +0.12 packet-search boost (R22-002, R23-002). Compact-cache expiry becomes observationally identical to cache absence (R23-003).
3. **Control-plane asymmetry.** Deferred planner-first saves get a typed `runEnrichmentBackfill` recovery action, but comparable runtime degradation branches get only warning strings (R24-001). Cached resume scope is trusted to choose a packet but not propagated into `opencodeTransport.specFolder` (R24-002).
4. **Regression behavior canonizing degraded contracts.** `tests/post-insert-deferred.vitest.ts:35-47` asserts all-true `enrichmentStatus` for deferred runs. `tests/structural-contract.vitest.ts:90-111` asserts `status=missing` + `trustState=stale` simultaneously. `tests/graph-metadata-schema.vitest.ts:223-245` treats legacy parsing as ordinary success (R25-001 through R25-004).
5. **Health surface weaker than bootstrap/resume.** `session_health` reduces structural trust to the envelope provenance label alone; `session_bootstrap` and `session_resume` carry richer `sections[].structuralTrust` but `session_health` does not (R26-002).
6. **Self-contradictory payloads exported simultaneously.** `session_bootstrap` and `session_resume` serialize both `payloadContract.provenance.trustState = 'stale'` and `graphOps.readiness.canonical = 'missing'` for the same underlying condition; the OpenCode transport then renders only the collapsed envelope label (R30-001, R30-002).
7. **Theatrical schema-drift vocabulary.** `buildCachedSessionSummaryCandidate()` fabricates `schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION` for every loaded `HookState`, even though `HookState` itself has no version field. The `schema_version_mismatch` rejection path is effectively unreachable for real inputs (R29-001).

**Concrete exemplar findings (5 with file:line):** (unchanged from iteration 32)

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R21-003 | `mcp_server/lib/graph/graph-metadata-parser.ts:223-233,1015-1019` | P1 | `refreshGraphMetadataForSpecFolder()` rewrites malformed modern JSON as canonical current JSON via the legacy lane |
| R22-002 | `mcp_server/lib/parsing/memory-parser.ts:293-330` | P1 | Fallback-recovered `graph-metadata` gets `qualityScore: 1`, then stage-1 candidate gen boosts it +0.12 over spec docs |
| R24-002 | `mcp_server/handlers/session-resume.ts:174-188,415-429,560-563` | P1 | Cached scope drives `buildResumeLadder()` as `fallbackSpecFolder`, but `buildOpenCodeTransportPlan` uses `args.specFolder ?? null` |
| R28-001 | `mcp_server/hooks/claude/session-stop.ts:244-275` | P1 | `loadState()` returning `null` on parse failure is indistinguishable from a genuine cold start; `startOffset = 0` re-parses transcript |
| R30-001 | `mcp_server/handlers/session-bootstrap.ts:321-347`, `session-resume.ts:530-551` | P1 | Same payload carries `trustState=stale` and `graphOps.readiness.canonical=empty` for the same missing-graph condition |

**Open questions for Domain 2:**
- When multiple machine-readable trust fields disagree, which one do real production consumers key off? The synthesis shows the transport layer prefers the collapsed one, but agent-side consumers are not yet fully audited.
- Can `HookState` gain a schema version field without breaking existing tempdir artifacts, and where is the migration boundary for already-quiesced state files?
- Should `session_health` grow `sections[].structuralTrust` to match `session_bootstrap` and `session_resume`, or should the transport layer read `graphOps.readiness.canonical` instead of envelope trustState?

---

### 2.4 Domain 3 - Concurrency and Write Coordination (iterations 31-38, 8 of 10 done) [NEW since 32: +6 iterations, 14 new findings]

**Central thesis (updated):** the bug class is not simply "missing locks." The domain has now resolved into five distinct coordination sub-patterns, not the two originally seen at iteration 32:

1. **Unlocked read-modify-write** (R31-001, R31-002, R33-003) — original finding
2. **Identity-free cleanup** [NEW since 32] (R33-001) — consumers that clear shared state without proving they operate on the same payload they read
3. **Success flags stronger than the write contract** [NEW since 32] (R34-001, R35-002) — machine-readable result fields that claim durability before durability is re-verified
4. **Pre-transaction snapshots driving later decisions** [NEW since 32] (R31-003, R34-002, R35-001, R36-002, R37-003) — planning reads that are re-emitted as authoritative after the underlying state could have moved
5. **Directory-level single-try loops** [NEW since 32] (R38-001, R38-002) — recovery and cleanup scans that abort the whole pass on a single concurrent-turnover failure instead of degrading per file

Atomic rename prevents torn bytes, not stale-state decisions, not torn readers, and not torn recoveries.

**Key patterns discovered (iterations 31-38):**

1. **Unlocked read-modify-write against deterministic temp filenames.** `hook-state.ts:170-176` uses `filePath + '.tmp'`, so two writers for the same session can swap bytes before rename, not just race on the final file. `updateState()` returns the merged in-memory object even after a failed persist (R31-001, R32-001).
2. **Split-brain stop-hook state.** `processStopHook()` captures `stateBeforeStop = loadState(sessionId)` once, performs multiple independent `recordStateUpdate()` calls, then reloads state inside `runContextAutosave()` — so autosave can persist a mix of fields from different stop events (R31-002, R32-002).
3. **Reconsolidation conflict has no predecessor re-validation.** `executeConflict()` deprecates the top-match row via a pure `UPDATE ... WHERE id = ?` with no scope-version or predecessor-version recheck (R31-003, R32-003).
4. **Graph-metadata refresh atomic at byte level only.** Temp path is `${canonicalFilePath}.tmp-${process.pid}-${Date.now()}`. Two same-process writes within one millisecond collide on the temp file; no CAS against the target (R31-004, R32-004).
5. **Workflow-documented shared temp handoff.** `/tmp/save-context-data.json` is hardcoded in command assets (plan, implement, complete, deep-research, deep-review) (R31-005, R32-005).
6. **[NEW since 32] Identity-free compact-cache cleanup.** `clearCompactPrime()` nulls `pendingCompactPrime` by session ID only, with no payload equality check against what the consumer actually read. A fresh precompact write landing between `readCompactPrime()` and `clearCompactPrime()` is deleted silently (R33-001).
7. **[NEW since 32] Transcript-offset non-monotonicity.** `updateState()` performs a blind spread-merge on `metrics.lastTranscriptOffset` with no `Math.max()` guard, so an older overlapping stop hook can persist a smaller offset after a newer one advanced it (R33-002).
8. **[NEW since 32] Autosave after known persistence failure.** `saveState()` returns `false` on write/rename failure; `updateState()` only logs a warning; `recordStateUpdate()` ignores the outcome; `runContextAutosave()` then reloads state from disk and proceeds anyway (R33-003).
9. **[NEW since 32] Success-shaped durability mirrors.** `producerMetadataWritten` (R34-001) and `touchedPaths` (R35-002) are both attempted-write flags exposed as `SessionStopProcessResult` fields, but neither is re-verified after the write. Downstream consumers treat them as postconditions.
10. **[NEW since 32] Complement duplicate window.** `runReconsolidationIfEnabled()` performs vector search + scope filtering before the writer transaction; if another save inserts a near-duplicate between planning and commit, the current save still proceeds as a normal complement (R34-002).
11. **[NEW since 32] Conflict lineage fan-out.** `executeConflict()` plus `insertSupersedesEdge()` deduplicates only identical `(source_id, target_id, relation)` triples, so two concurrent conflict saves can both supersede the same predecessor with different successor IDs (R35-001).
12. **[NEW since 32] `/tmp/save-context-data.json` is not just a doc problem.** It is now prescribed in AGENTS.md + CLAUDE.md + CODEX.md + GEMINI.md (R35-003) and re-emitted by the live `data-loader.ts` runtime error message (R36-003), so operators and wrappers have three independent teaching surfaces pulling them to the shared path.
13. **[NEW since 32] Torn read: freshness stat vs content generation.** `loadMostRecentState()` captures `mtimeMs` from `statSync()` and then separately does `readFileSync()` + `JSON.parse()`. A writer that lands `renameSync()` between those two reads mates freshness from generation N with content from generation N+1 (R36-001).
14. **[NEW since 32] Hidden zero-offset write window.** `storeTokenSnapshot()` persists `lastTranscriptOffset: 0` as a first step before the later `recordStateUpdate(... newOffset ...)`. A second stop hook that reads state during that window re-parses the transcript from zero (R37-001).
15. **[NEW since 32] Stale `currentSpecFolder` preference.** `detectSpecFolder()` prefers the supplied `currentSpecFolder` when multiple packet paths are present in the transcript tail, but `processStopHook()` sources that value from `stateBeforeStop.lastSpecFolder` — a stale snapshot (R37-002).
16. **[NEW since 32] Split-snapshot per save request.** TM-06 reconsolidation planning and assistive review each run their own `vectorSearch` + scope-filter pass before the writer transaction, so one save request can reason about two different candidate universes in one response (R37-003).
17. **[NEW since 32] Directory-level single-try recovery.** `loadMostRecentState()` wraps the entire directory scan in one `try` block: one unreadable or vanishing sibling returns `null` for the whole lookup, suppressing the otherwise-valid recent state (R38-001).
18. **[NEW since 32] Directory-level single-try cleanup.** `cleanStaleStates()` has the same shape: a single `statSync`/`unlinkSync` failure on any file aborts the whole sweep and still returns a partial `removed` count with no indication that other files were skipped. Both Claude and Gemini `session-stop --finalize` trust the count (R38-002).

**Concrete exemplar findings (10 with file:line; 5 carried forward, 5 [NEW since 32]):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R31-001 | `mcp_server/hooks/claude/hook-state.ts:169-176,221-240` | P1 | Deterministic `filePath + '.tmp'` means two writers for the same session swap bytes before rename |
| R31-002 | `mcp_server/hooks/claude/session-stop.ts:60-67,119-125,261-268,283-309` | P1 | Multiple `recordStateUpdate()` calls plus a final disk reload by `runContextAutosave()` create a torn-state autosave window |
| R31-003 | `mcp_server/handlers/save/reconsolidation-bridge.ts:282-295` + `mcp_server/lib/storage/reconsolidation.ts:467-508` | P1 | `executeConflict()` has no predecessor-version or scope recheck; merge defends, conflict does not |
| R31-005 | `mcp_server/scripts/loaders/data-loader.ts:59-111` + command YAMLs | P2 | `/tmp/save-context-data.json` is a documented shared handoff path |
| R32-003 | `mcp_server/handlers/save/reconsolidation-bridge.ts:270-306`, `reconsolidation.ts:611-656,467-508,806-819,882-929` | P1 | Scope filtering happens outside transaction; subsequent scope mutation is not re-checked at conflict/merge |
| **[NEW]** R33-001 | `mcp_server/hooks/claude/hook-state.ts:184-217` + Claude/Gemini prime+compact-inject | P1 | `clearCompactPrime()` nulls whatever `pendingCompactPrime` is current at clear time; a fresh precompact write between read and clear is deleted |
| **[NEW]** R34-002 | `mcp_server/handlers/save/reconsolidation-bridge.ts:261-306` + `reconsolidation.ts:617-694` + `memory-save.ts:2159-2171,2250-2304` | P1 | Complement path: `vectorSearch` + scope filter runs before `writeTransaction`; a concurrent duplicate insert between the two is missed |
| **[NEW]** R35-001 | `mcp_server/handlers/save/reconsolidation-bridge.ts:270-295` + `reconsolidation.ts:467-508,610-658,952-993` | P1 | `insertSupersedesEdge()` dedupes only by `(source_id, target_id, relation)`; two conflict saves can both supersede the same predecessor |
| **[NEW]** R37-001 | `mcp_server/hooks/claude/session-stop.ts:175-190,244-252,257-268` | P1 | `storeTokenSnapshot()` writes `lastTranscriptOffset: 0` before the final offset write; overlapping stop hook reads zero and re-parses from zero |
| **[NEW]** R37-002 | `mcp_server/hooks/claude/session-stop.ts:128-145,244-246,281-296,340-369` | P1 | `detectSpecFolder()` prefers the supplied `currentSpecFolder`, but `processStopHook()` passes a stale `stateBeforeStop.lastSpecFolder` |

**Open questions for Domain 3 (iterations 39-40 should target):** [NEW since 32: two questions answered, three new ones raised]

*Resolved since iteration 32:*
- ~~What is the actual concurrent-writer surface at runtime?~~ Iterations 33-38 have characterized at least seven distinct interleavings: compact-read vs compact-clear (R33-001), stop-hook vs stop-hook (R33-002, R37-001), stop-hook metrics vs autosave (R33-003), conflict vs conflict (R35-001), complement vs complement (R34-002), TM-06 vs assistive within one request (R37-003), and reader vs writer mid-stat (R36-001).
- ~~How does the generate-context file-input path interact with deep-research iterations?~~ R35-003 and R36-003 now confirm the shared-path prescription spans runtime root instruction files and the runtime error contract itself, not only command assets.

*Still open:*
- Can a predecessor `updated_at` or `content_hash` CAS guard be added to `executeConflict()` without restructuring the reconsolidation orchestrator?
- Does `hook-state.ts` need true file locking, or would a unique temp filename (PID + counter + hash) plus a `current_version` field inside `HookState` be sufficient? (Iteration 32 asked the same question; still open.)
- **[NEW since 32]** Does `clearCompactPrime()` need a payload-hash equality check, or should the hook-state schema carry an `expiresAt` + `opaqueId` pair that the consumer asserts before clearing?
- **[NEW since 32]** Should `loadMostRecentState()` degrade per file instead of aborting the scan? And should `cleanStaleStates()` return `{ removed: number; partial: boolean; errors: Array<{file, reason}> }` so finalize callers can distinguish a clean sweep from an aborted one?
- **[NEW since 32]** Is there a single coordination primitive (directory-level advisory lock, per-session mutex, or transactional DB swap) that would address R31-001, R31-002, R33-001, R33-002, R36-001, R37-001, and R37-002 together? Or does each seam need its own fix?

**Bonus iterations 39-40 preview (not yet performed):** the remaining two Domain 3 passes should probably cover (a) cross-runtime writer overlap (Claude compact-inject + Claude stop-hook + Gemini stop-hook writing the same hook-state file) to exercise the combined interleavings above, and (b) `writeTransaction` boundary mapping (exactly which operations hold the SQLite writer lock, and which operations run outside it). The prior "iterations 33-34 preview" notes in the 32-iter synthesis have now been absorbed into the main coverage.

---

### 2.5 Domain 4 - Stringly Typed Governance (still not started)

**Status unchanged since iteration 32.** The task brief still labels iterations 31-32 as Domain 4 in progress, but iterations 33-38 continue to be tagged Domain 3 by content. This synthesis treats iterations 31-38 as Domain 3 (matching the content) and flags Domain 4 as **not yet started** despite the brief's numbering.

The existing `scratch/cross-cutting-patterns.md` already enumerates Domain-4 candidate surfaces:
- `AGENTS.md` — gate behavior encoded as prose plus trigger-word lists **[NEW since 32: also now confirmed as Domain 3 evidence via R35-003]**
- `spec_kit_plan_auto.yaml` — interpreter-dependent expressions like `intake_only == TRUE`
- `skill_advisor.py` — literal keyword dictionaries
- `manual-playbook-runner.ts` — regex-matched markdown plus `Function(...)()` eval
- `skill_graph_compiler.py` — string-based skill graph compilation
- `recommendations.md` + packet summary docs — operational promises without CI gates

None of these are yet audited in the iteration set as of iteration 38.

---

### 2.6 Domain 5 - Test Coverage Gaps (still not started as a dedicated domain)

Test-coverage gaps continue to appear as subsidiary evidence in nearly every iteration. [NEW since 32: six additional test gaps identified]

Recurring patterns (32-iter list):
- `tests/startup-brief.vitest.ts:28-76` mocks `loadMostRecentState()` to return a state object unconditionally, masking the scope-less contract break (R2-001, R4-001)
- `tests/code-graph-query-handler.vitest.ts:12-18` hoists `ensureCodeGraphReady` to always return `'fresh'`, making it impossible to test the readiness-fail-open branch (R3-002, R25-002)
- `tests/post-insert-deferred.vitest.ts:11-48` asserts all-true booleans for deferred runs, codifying the collapse (R8-001, R25-001)
- `tests/graph-metadata-schema.vitest.ts:223-245` asserts legacy acceptance without any migration marker, codifying the laundering path (R11-002, R25-003)
- `tests/hook-session-stop-replay.vitest.ts:14-56` runs with autosave disabled, so the autosave failure branches are never exercised (R12-001, R28-001, R33-003)
- `tests/reconsolidation-bridge.vitest.ts:255-330` only covers static thresholding with mocked search results, no concurrent inserts or row mutations

New (iterations 33-38):
- **[NEW since 32]** `tests/hook-precompact.vitest.ts:23-48` and `tests/hook-session-start.vitest.ts:27-107` cover only sequential `pendingCompactPrime` store/load; no overlap harness for `readCompactPrime()` → new write → `clearCompactPrime()` (R33-001)
- **[NEW since 32]** `tests/hook-stop-token-tracking.vitest.ts:65-89` + `tests/token-snapshot-store.vitest.ts:25-35` exercise incremental parsing and sequential overwrites, but never run two stop hooks against the same session concurrently (R33-002, R37-001)
- **[NEW since 32]** `tests/hook-session-stop-replay.vitest.ts:17-24` asserts one `touchedPaths` entry inside the sandbox but never forces `saveState()` failure before trusting the result (R35-002)
- **[NEW since 32]** `tests/reconsolidation.vitest.ts:790-855` covers single-writer conflict only; no regression for concurrent conflict writers or multi-successor fan-out (R35-001)
- **[NEW since 32]** `tests/assistive-reconsolidation.vitest.ts:17-234` only checks feature-flag/classifier/logging helpers; no interleaving writer that changes the candidate after the recommendation forms (R36-002)
- **[NEW since 32]** `tests/hook-state.vitest.ts:21-223` stops at `loadMostRecentState()` coverage and never exercises `cleanStaleStates()` at all (R38-002); it also never replaces a candidate file between `statSync` and `readFileSync` (R36-001, R38-001)

A dedicated Domain 5 pass should harvest these into a concrete missing-test inventory and turn them into adversarial harnesses. The concurrency harness list now has enough specificity to stage 10+ independent tests without additional investigation.

---

## Section 3 - Cross-Cutting Themes

### 3.1 Anti-patterns appearing in 3+ files [NEW since 32: two new rows, one row extended]

| Anti-pattern                                                           | Files affected                                                           | Representative findings |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| Success-shaped envelope masking skip / defer / partial / failed state  | `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts` | R8-001, R12-001, R13-004, R17-002, R21-001 |
| Unvalidated `JSON.parse` feeding both write-target and prompt-visible text | `hook-state.ts`, `shared-payload.ts`, `graph-metadata-parser.ts` (via validator ok=true) | R21-002, R9-002, R11-002 |
| Collapsed state vocabulary (missing vs empty vs stale vs degraded) across trust / readiness / freshness axes | `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts` | R9-001, R22-001, R23-001, R26-001, R30-001, R30-002 |
| Pre-transaction read-then-mutate (snapshot before lock, mutate inside lock without re-read) | `hook-state.ts` + `session-stop.ts`, `reconsolidation-bridge.ts` + `reconsolidation.ts`, `graph-metadata-parser.ts` | R31-001, R31-002, R31-003, R31-004, **[NEW since 32]** R34-002, R35-001, R37-003 |
| Deterministic / shared temp path under concurrency                     | `hook-state.ts` (`.tmp`), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs (`/tmp/save-context-data.json`), **[NEW since 32]** runtime root instructions (AGENTS/CLAUDE/CODEX/GEMINI.md), **[NEW since 32]** `data-loader.ts` error contract | R31-001, R31-004, R31-005, **[NEW since 32]** R35-003, R36-003 |
| Test fixture canonizes degraded contract                               | `tests/post-insert-deferred.vitest.ts`, `tests/code-graph-query-handler.vitest.ts`, `tests/structural-contract.vitest.ts`, `tests/graph-metadata-schema.vitest.ts`, **[NEW since 32]** `tests/hook-session-stop-replay.vitest.ts` (touchedPaths), `tests/reconsolidation.vitest.ts` (single-writer conflict) | R25-001 through R25-004, R26-001, **[NEW since 32]** R35-001, R35-002 |
| Flag-based success without helper-result inspection                    | `post-insert.ts` (`enrichmentStatus.summaries`, `.graphLifecycle`, `.causalLinks`, `.entityLinking`), **[NEW since 32]** `session-stop.ts` (`producerMetadataWritten`, `touchedPaths`) | R8-001, R11-005, R12-004, R12-005, **[NEW since 32]** R34-001, R35-002 |
| **[NEW since 32]** Identity-free cleanup of shared state | `hook-state.ts` (`clearCompactPrime`), `session-stop.ts` (all three `recordStateUpdate` calls keyed on `sessionId` only) | R33-001, R31-002 |
| **[NEW since 32]** Single-try loop over shared directory | `hook-state.ts` (`loadMostRecentState`, `cleanStaleStates`) | R2-002, R38-001, R38-002 |

### 3.2 Systemic issues not in the original copilot deep-dive [NEW since 32: three new items]

The supporting `high-priority-deep-dive.md`, `medium-priority-deep-dive.md`, and `low-priority-deep-dive.md` enumerate per-file issues; the iterations surfaced several cross-file patterns that are not in those docs:

1. **Self-contradictory payloads exported simultaneously.** A single `session_bootstrap` response can advertise both `trustState=stale` and `graphOps.readiness.canonical=empty` for the same graph (R30-001).
2. **Theatrical schema-drift vocabulary.** `CACHED_SESSION_SUMMARY_SCHEMA_VERSION` exists; `buildCachedSessionSummaryCandidate()` assigns it unconditionally; no persisted hook state ever carries a version field (R29-001).
3. **Cross-runtime control-plane contamination via tempdir state.** The same hook-state file is consumed by Claude session-prime, Claude session-stop, Gemini session-prime, Gemini compact-inject, and Claude compact-cache (R25-004). One corrupt temp file degrades all four runtimes.
4. **Regression suite codifies dishonest contracts.** Multiple direct tests assert the collapsed state (R25-001 through R25-004, R26-001). **[NEW since 32]** Iterations 34-35 added two more: the stop-hook replay harness codifies `producerMetadataWritten` and `touchedPaths` as truthful postconditions (R34-001, R35-002), and the reconsolidation suite codifies single-writer conflict semantics (R35-001).
5. **Command-surface documentation reinforces concurrency races.** `/tmp/save-context-data.json` is documented in `memory/save.md`, `deep-research.md`, and `deep-review.md` (R32-005). **[NEW since 32]** Iteration 35 extends this to every runtime root instruction file (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`) with R35-003, and iteration 36 extends it further to the live runtime error contract in `data-loader.ts` (R36-003). The pattern now spans docs, workflow assets, runtime root instructions, and executable error messages — four independent teaching surfaces.
6. **The complement reconsolidation path has no transactional protection at all.** Merge has predecessor CAS; conflict has scope-mutable UPDATE; complement is pure routing off a pre-transaction search snapshot (R34-002).
7. **`producerMetadataWritten` and `parsedMessageCount` overstate durability.** Both are attempted-write or attempted-parse flags, not durable postconditions. Downstream analytics and resume code treat them as postconditions (R34-001, R28-001).
8. **[NEW since 32] Multi-successor conflict fan-out.** `insertSupersedesEdge()` uses `INSERT OR IGNORE` keyed on `(source_id, target_id, relation)`, so two concurrent conflict saves produce distinct successor rows both pointing at the same predecessor. Lineage traversal then has no single "current successor" (R35-001). The deep-dive treated predecessor protection and successor edges as separate concerns; R35-001 shows they are one coordination problem.
9. **[NEW since 32] Intra-request split snapshot.** A single save request can run two independent `vectorSearch` + scope-filter passes (TM-06 planning and assistive review), and the two passes do not share a snapshot token. The same save response can therefore advertise a TM-06 "complement" decision plus an assistive recommendation against a newer candidate universe (R37-003).
10. **[NEW since 32] Torn read between selection and content.** `loadMostRecentState()`'s `statSync` → `readFileSync` sequence is not atomic, so the freshness axis used to rank candidates and the bytes that become the result can come from different generations of the same file (R36-001). The deep-dive treated reader safety and writer atomicity separately; R36-001 is a reader-side race that exists even though writers are byte-atomic.

### 3.3 Findings that reinforce each other [NEW since 32: three new chains]

- **R13-002 (unreadable canonical doc → status=planned) + R11-002 (legacy fallback → ok=true with fabricated timestamps)**: together, a packet with transient read failures can be indexed as a freshly-saved `planned` packet that then receives a +0.12 search boost.
- **R21-002 (unvalidated hook-state JSON) + R28-001 (null collapse indistinguishable from cold start) + R33-002 (transcript offset regresses)**: together, a corrupt tempdir file produces re-parsed transcripts, duplicate token counting, and cross-session state bleed in the same event.
- **R9-001 (missing→stale trust collapse) + R30-001 (self-contradictory bootstrap payload) + R30-002 (transport exports the collapsed label)**: together, the runtime has richer state internally than it exposes, and the dishonest label is the one that reaches hookless OpenCode consumers.
- **R8-001 (enrichmentStatus booleans) + R21-001 (response-builder drops nuance) + R24-001 (only deferred gets a typed recovery action)**: together, save-path consumers literally cannot tell "skipped vs failed vs deferred" and cannot mechanically recover from runtime degradation.
- **R31-001 (unlocked hook-state RMW) + R31-002 (split-brain stop-hook) + R33-003 (autosave proceeds after saveState failure)**: together, Claude stop-hook continuity is multiply vulnerable — concurrent writers can corrupt state, the stop hook reads torn state, and a failed persist does not stop autosave.
- **[NEW since 32] R33-001 (identity-free compact cleanup) + R36-001 (torn `statSync` vs `readFileSync`) + R38-001 (directory-level all-or-nothing scan)**: together, the compact-recovery lane is vulnerable on three axes simultaneously — a fresh precompact write can be cleared by an older consumer, the loader can mate stale `mtime` with fresh content, and one unreadable sibling aborts the whole recovery even when a valid state file still exists.
- **[NEW since 32] R34-001 (`producerMetadataWritten`) + R35-002 (`touchedPaths`) + R33-003 (autosave after saveState failure)**: together, `SessionStopProcessResult` exports multiple machine-readable fields that overstate durability. A stop hook can return a result that advertises "metadata written" and "touched this path" while the on-disk state file actually lost the race or failed to persist at all.
- **[NEW since 32] R31-003 (executeConflict has no predecessor CAS) + R35-001 (multi-successor fan-out) + R34-002 (complement duplicate window)**: together, the reconsolidation stack has coordination gaps on every non-merge path. Merge has predecessor `updated_at` + `content_hash` CAS; conflict has neither; complement does not even check if a duplicate appeared between search and commit. Two concurrent governed saves can pick the same predecessor, conflict on it with different successor IDs, or both create complement rows that should have merged.
- **[NEW since 32] R33-002 (offset non-monotonicity) + R37-001 (hidden zero-offset write) + R14-001 (prior: zero-offset written before producer-metadata catch)**: together, the transcript-offset surface has three distinct ways to regress to zero or to an older value: an overlapping stop hook persisting a smaller offset, a consumer reading the sentinel zero before the final offset write, and a producer-metadata failure leaving zero in place. Any one causes duplicate token accounting.
- **[NEW since 32] R35-003 (runtime root instructions) + R36-003 (runtime error contract) + R31-005/R32-005 (command assets)**: together, the `/tmp/save-context-data.json` shared path is taught at four independent surfaces. Removing it from one surface leaves the others to re-propagate the same hazard; a single coherent fix must update all four.

---

## Section 4 - Severity Escalation Candidates

### 4.1 Proposed P0 (data integrity, cross-boundary control plane) [NEW since 32: candidates expanded with new constituent findings]

Combining interactions across findings, the following deserve P0 consideration:

**P0-candidate-A: Cross-runtime tempdir control-plane poisoning** [NEW since 32: constituent-finding list expanded]
- Constituent findings: R21-002 + R25-004 + R28-001 + R29-001 + R31-001 + R33-003 + **[NEW since 32]** R33-001 + R36-001 + R38-001 + R38-002
- Rationale: a single corrupt, drifted, concurrently-replaced, or unreadable temp-state file can simultaneously (1) inject forged provenance into Claude prompt text, (2) misroute Gemini startup continuity, (3) force transcript re-parsing with duplicate token counting, (4) bypass the cached-summary schema guard, (5) pair one stop-hook's summary with another's packet target via `updateState()` without CAS, (6) proceed with autosave after `saveState()` failure, (7) **[NEW since 32]** have a fresh precompact payload silently deleted by an older consumer (R33-001), (8) **[NEW since 32]** return freshness from one generation with content from another (R36-001), (9) **[NEW since 32]** suppress all sibling-state recovery when one file is transiently unreadable (R38-001), and (10) **[NEW since 32]** return a partial `cleanStaleStates` sweep as if complete (R38-002).
- Why P0: this is a single-point-of-failure that spans Claude + Gemini, spans write-side + read-side, spans prompt-visible + on-disk, and spans tempdir + continuity + analytics + cleanup. The blast radius is the entire hook-based session lane. **[NEW since 32]** The iterations since 32 have expanded the pattern from writer races to include cleanup races, reader races, and cross-runtime identity-free deletions. A single HookState schema + locking overhaul is now the highest-leverage fix the review has surfaced.

**P0-candidate-B: Reconsolidation conflict + complement duplicate/corruption window** [NEW since 32: multi-successor fan-out added]
- Constituent findings: R31-003 + R32-003 + R34-002 + **[NEW since 32]** R35-001 + R36-002 + R37-003
- Rationale: the conflict path deprecates a row with no scope or version revalidation; the complement path selects "create anyway" from a pre-transaction search snapshot; **[NEW since 32]** the conflict path can also fan out into multiple successors for the same predecessor because `insertSupersedesEdge()` dedupes only by edge triple (R35-001); **[NEW since 32]** the assistive review lane forms recommendations from a second pre-transaction snapshot that can disagree with TM-06 planning (R36-002, R37-003). Two concurrent governed saves can therefore deprecate each other, double-insert the same content, or fork lineage with conflicting successors, while governance metadata diverges across all three decision paths.
- Why P0: this writes incorrect deprecation, lineage, and complement edges into the persistent memory store. Unlike continuity loss, this is permanent data corruption that propagates into every downstream search, causal traversal, and graph-backed retrieval. **[NEW since 32]** The fan-out finding (R35-001) is particularly severe because the memory graph's "current successor" invariant is silently violated; lineage consumers assume a single active successor per predecessor, and that assumption is now known to break under concurrent conflict saves.

**P0-candidate-C: Graph-metadata laundering + search boost** (unchanged since iter 32)
- Constituent findings: R11-002 + R13-002 + R20-002 + R21-003 + R22-002 + R23-002
- Rationale: a malformed modern `graph-metadata.json` gets (1) accepted as legacy with `ok=true`, (2) assigned `qualityScore: 1` and `qualityFlags: []` by `memory-parser`, (3) stamped with freshly-minted `created_at`/`last_save_at`, (4) rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()`, and (5) boosted +0.12 in packet-search stage-1 candidate generation. The original corruption signal is erased, and the corrupt artifact outranks spec docs.
- Why P0: "state laundering" is a consent-boundary issue. Callers authorize a refresh operation and receive a stronger contract than the input justified.

**[NEW since 32] P0-candidate-D: Stop-hook success flags overstating durability**
- Constituent findings: R34-001 + R35-002 + R33-003 + R33-002 + R37-001
- Rationale: `SessionStopProcessResult` exports at least two machine-readable fields (`producerMetadataWritten`, `touchedPaths`) that are set immediately after `recordStateUpdate()` returns, with no post-write re-verification. The underlying `updateState()` can lose the shared `.tmp` race (R31-001) or fail to persist while still returning the merged in-memory object (R33-003). An overlapping stop hook can regress `lastTranscriptOffset` below a sentinel zero (R37-001) or below a previously advanced value (R33-002). Any caller that treats these flags as postconditions is building analytics, autosave decisions, or provenance claims on a false foundation.
- Why P0: the collapsed signal is machine-readable, not prose. Downstream callers cannot recover ground truth from the result object; they have to independently re-read hook-state from disk and hope they win the race. This is a contract violation at the same level as P0-candidate-A but exposed via the result object rather than the state file.
- Status: proposed, not yet accepted. Could reasonably be merged into P0-candidate-A once both are remediated with the same HookState locking + durability-re-verification overhaul.

### 4.2 P1 findings that should stay P1 but with strict ordering [NEW since 32: list extended]

These should be prioritized ahead of other P1 work because their fix paths unlock other fixes:

- R21-001 (response-builder erases step detail) — unlocks R8-001, R24-001
- R9-001 (trust-state collapse at the vocabulary layer) — unlocks R26-001, R26-002, R30-001, R30-002
- R31-001 (hook-state unlocked RMW) — unlocks R31-002, R32-002, R33-002, R33-003, R34-001, **[NEW since 32]** R35-002, R36-001, R37-001, R37-002, R38-001, R38-002
- **[NEW since 32]** R34-002 (complement path pre-transaction snapshot) — unlocks R31-003, R32-003, R35-001, R36-002, R37-003 (all rely on the same "planning runs before writer transaction" invariant)

### 4.3 P2 interactions that approach P1 [NEW since 32: two new interactions]

- R14-001 (transcript cursor reverts to 0 on metadata failure) + R33-002 (offset monotonicity regression) + **[NEW since 32]** R37-001 (hidden zero-offset write on happy path): together create repeatable duplicate token accounting on three independent paths.
- R12-002/R14-002 (unvalidated edgeType string) + R17-001 (dangling edge as successful relationship): an agent passing a typo edge type gets an empty result on one query and a phantom relationship on the next.
- **[NEW since 32]** R38-001 (single-try directory scan) + R38-002 (single-try cleanup sweep): together, hook-state recovery and cleanup are both poison-pill-fragile. One unreadable sibling aborts recovery; one failing `unlinkSync` aborts cleanup. Neither surface surfaces "aborted with partial result" as a distinct outcome. Under concurrent file turnover, both can misreport silently at the same moment.
- **[NEW since 32]** R35-003 (runtime root instructions) + R36-003 (runtime error contract) + R31-005/R32-005 (command assets): together, the `/tmp/save-context-data.json` hazard has four independent teaching surfaces. A quick-win fix that only touches command assets (the iteration 32 backlog) still leaves the other three surfaces re-propagating the same hazard.

---

## Section 5 - Remediation Backlog (Draft)

### 5.1 Grouped by file [NEW since 32: rows extended]

#### `mcp_server/hooks/claude/hook-state.ts` [NEW since 32: +4 change rows]

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add runtime `HookStateSchema` (zod) validation to `loadState()` and `loadMostRecentState()`; on validation failure, quarantine the file (rename to `.bad`) rather than returning parseable-but-drifted state | Medium | R21-002, R25-004, R28-001, R29-001 |
| Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` + retry loop | Small | R31-001, R32-001, R31-004 |
| Make `updateState()` return a structured result `{ ok: boolean; merged: HookState; persisted: boolean }` and have `recordStateUpdate()` surface persistence failures | Small | R31-001, R33-003 |
| Add a `schemaVersion` field to `HookState` and a migration step; `loadState()` rejects mismatched versions with a distinct `schema_mismatch` reason | Medium | R29-001 |
| Add a `Math.max()` guard on `metrics.lastTranscriptOffset` in `updateState()` to enforce monotonicity | Small | R33-002 |
| **[NEW since 32]** Add payload-identity check to `clearCompactPrime()`: accept `expectedCachedAt` or `expectedOpaqueId` and abort the clear if the current `pendingCompactPrime` differs | Small | R33-001 |
| **[NEW since 32]** Degrade `loadMostRecentState()` per-file: move `try/catch` inside the for-loop and continue on individual failure; expose total candidates + failure count in the debug log | Small | R38-001 |
| **[NEW since 32]** Re-read mtime after `readFileSync()` in `loadMostRecentState()` and discard the candidate if it changed (or read mtime from a `stat` inside the open file handle) | Small | R36-001 |
| **[NEW since 32]** Eliminate the hidden `storeTokenSnapshot` zero-offset write: carry `newOffset` all the way to the final `recordStateUpdate()` and remove the intermediate `lastTranscriptOffset: 0` persistence | Small | R37-001 |

#### `mcp_server/hooks/claude/session-stop.ts` [NEW since 32: +4 change rows]

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Collapse three separate `recordStateUpdate()` calls in `processStopHook()` into a single atomic patch so `runContextAutosave()` cannot observe torn state | Medium | R31-002, R32-002 |
| Derive `producerMetadataWritten` from a post-write re-read, or remove the flag if true durability cannot be proven | Small | R34-001 |
| Expand `SessionStopProcessResult` with `autosaveOutcome: 'succeeded' \| 'failed' \| 'skipped_no_input' \| 'disabled'` | Small | R12-001, R13-001 |
| Distinguish retarget-by-detection from retarget-by-missing-input; add `retargetReason: 'detected_different_packet' \| 'no_previous_packet' \| 'transcript_io_failed' \| null` | Small | R15-001, R15-003 |
| Increase or configure `SPEC_FOLDER_TAIL_BYTES` beyond 50 KB, and/or sample both head and tail for large transcripts | Small | R15-002 |
| **[NEW since 32]** Derive `touchedPaths` from a post-write re-read rather than immediately after `updateState()`; alternatively, change `touchedPaths` semantics to `attemptedPaths` and expose a separate `persistedPaths` subset | Small | R35-002 |
| **[NEW since 32]** Refresh `stateBeforeStop.lastSpecFolder` before calling `detectSpecFolder()` (or replace `detectSpecFolder()`'s "prefer currentSpecFolder" rule with an equality check against transcript-tail majority) | Small | R37-002 |
| **[NEW since 32]** Document and enforce that `producerMetadataWritten`, `touchedPaths`, and `autosaveOutcome` are all attempted-write signals; any consumer that wants durability must re-read hook-state | Documentation | R34-001, R35-002 |
| **[NEW since 32]** `cleanStaleStates()` returns `{ removed: number; partial: boolean; errors: Array<{file, reason}> }`; finalize entrypoints log partial sweeps at warn level | Small | R38-002 |

#### `mcp_server/handlers/save/post-insert.ts` (unchanged since iter 32)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Replace `enrichmentStatus: Record<string, boolean>` with `Record<string, 'ran' \| 'skipped' \| 'failed' \| 'deferred' \| 'partial'>` and propagate per-step results | Large | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001 |
| Consume `summaryResult.stored` and `indexResult.skipped` instead of flipping booleans unconditionally | Small | R11-005 |
| Gate entity linking on successful entity extraction, not just feature flags | Small | R8-002, R7-002 |

#### `mcp_server/handlers/save/reconsolidation-bridge.ts` + `lib/storage/reconsolidation.ts` [NEW since 32: +3 change rows]

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add predecessor `content_hash` + scope CAS inside `executeConflict()`; abort if row changed since search snapshot | Medium | R31-003, R32-003 |
| Move complement decision inside the writer transaction, or re-run `vectorSearch()` + scope filter just before insert and fall through to merge/conflict if a new near-duplicate appeared | Large | R34-002 |
| Append a structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` when `candidateMatchesRequestedScope` filters out all results | Small | R11-004, R12-003 |
| Add structured warning when assistive path throws | Small | R19-002 |
| Reject malformed vector-search rows (`id === 0`, missing `content_text`) instead of coercing to sentinels | Small | R16-002 |
| Rename `ASSISTIVE_AUTO_MERGE_THRESHOLD` or make the threshold actually perform the promised auto-merge | Small | R6-002 |
| **[NEW since 32]** Serialize concurrent conflict writers for the same predecessor: add a `WHERE NOT EXISTS (supersedes-edge with any other source for target_id)` guard, or require a predecessor-scoped advisory lock before `insertSupersedesEdge()` | Medium | R35-001 |
| **[NEW since 32]** Share the TM-06 planner's vector-search snapshot with the assistive block (pass the same `searchResults` array into both decision paths) rather than running a second `vectorSearch` | Small | R37-003 |
| **[NEW since 32]** Re-run `vectorSearch` + scope filter inside the writer transaction for the assistive lane, or mark assistive recommendations as `{ provisional: true, basedOnSnapshot: <timestamp> }` so downstream tooling knows the recommendation may already be stale | Medium | R36-002 |

#### `mcp_server/handlers/code-graph/query.ts` (unchanged since iter 32)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Validate `edgeType` against an allowed enum; reject unsupported values with `status: "error"` | Small | R12-002, R14-002 |
| Apply the `Unknown operation` validation before the transitive branch runs | Small | R16-001 |
| Resolve `blast_radius` subjects via `resolveSubjectFilePath()` with no string fallback; empty resolution returns `status: "error"` | Small | R11-003 |
| Don't swallow `ensureCodeGraphReady()` exceptions — surface them as `status: "error"` with a distinct `reason` | Small | R3-002, R22-001, R23-001, R25-002, R27-002 |
| Validate outline subject via `resolveSubjectFilePath()` before calling `queryOutline()`; unknown file returns `status: "error"` | Small | R13-003 |
| Emit per-result detector provenance, not the global `last_detector_provenance` singleton, or at minimum label the top-level as `graphMetadata.detectorProvenanceScope: 'global' \| 'result'` | Medium | R18-001, R20-003 |
| Enforce `ambiguous_subject` error when `fq_name` or `name` match count > 1 | Small | R3-001 |
| Flag dangling edges (null target/source node) as graph corruption, not as a normal relationship | Small | R17-001, R19-001 |

#### `mcp_server/lib/graph/graph-metadata-parser.ts` (unchanged since iter 32)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Have `validateGraphMetadataContent()` return `{ ok: true, metadata, migrated: boolean, migrationSource?: 'legacy' }` when legacy fallback succeeds; have consumers propagate `migrated` all the way through `memory-parser` and ranking | Medium | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| Preserve the original current-schema validation errors in the returned diagnostic set when legacy fallback also fails | Small | R18-002 |
| Distinguish `readDoc()` I/O failure from "file does not exist"; propagate I/O failure into `deriveStatus()` as `status: 'unknown'` rather than `planned`/`complete` | Small | R13-002 |
| Use unique temp filenames in `writeGraphMetadataFile()` (pid + counter + hash); add retry + CAS against target mtime | Small | R31-004, R32-004 |

#### `mcp_server/lib/context/shared-payload.ts` + `lib/context/opencode-transport.ts` (unchanged since iter 32)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| `trustStateFromGraphState()` and `trustStateFromStructuralStatus()` emit distinct labels for `missing` (new: `absent` or `unavailable`) vs `stale` | Medium | R9-001, R26-001, R30-001 |
| `renderBlockContent()` inspects `graphOps.readiness.canonical` and section-level `structuralTrust` instead of only `payloadContract.provenance.trustState` | Medium | R9-002, R30-002 |
| Validate `SharedPayloadKind` and `producer` at runtime, not just TypeScript-level | Small | R9-002 |

#### `mcp_server/handlers/session-*.ts` (unchanged since iter 32)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| `handleSessionResume()` propagates derived `scopeFallback` into `buildOpenCodeTransportPlan({ specFolder })` instead of overwriting with `args.specFolder ?? null` | Small | R24-002 |
| `handleSessionHealth()` attaches `structuralTrust` to the `structural-context` section like resume/bootstrap | Small | R26-002 |

#### `scripts/memory/generate-context.ts` + command YAMLs + runtime root instruction files [NEW since 32: +2 change rows]

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Remove `/tmp/save-context-data.json` from all command surfaces; default examples to `--stdin` or `--json '<inline>'` | Small | R31-005, R32-005 |
| If file handoff is preserved, require unique path per-invocation (e.g., `/tmp/save-context-data-${pid}-${uuid}.json`) and fail if the file already exists | Small | R31-005, R32-005 |
| **[NEW since 32]** Remove `/tmp/save-context-data.json` from `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md` (runtime root instructions); replace with `--stdin` / `--json` guidance to match CLI help | Small | R35-003 |
| **[NEW since 32]** Update `data-loader.ts`'s `NO_DATA_FILE` error message to recommend `--stdin` or `--json '<inline>'`; if a file path is still shown, make it `/tmp/save-context-data-<pid>-<uuid>.json` | Small | R36-003 |

### 5.2 Quick wins vs structural refactors [NEW since 32: +6 quick wins, +2 structural refactors]

**Quick wins (Small effort, 1-3 file edits, <100 LOC each):**

1. Reject invalid `edgeType` in `code-graph/query.ts` (R12-002, R14-002)
2. Add `Math.max()` offset monotonicity guard in `hook-state.ts` (R33-002)
3. Remove `/tmp/save-context-data.json` from command YAMLs (R31-005, R32-005)
4. Validate outline subject path before `queryOutline()` (R13-003)
5. Stop swallowing `ensureCodeGraphReady()` exceptions (R3-002)
6. Use unique temp filenames in `graph-metadata-parser.ts` writer (R31-004)
7. Guard `blast_radius` against unresolved subjects (R11-003)
8. Flag dangling edges as corruption in query payload (R17-001)
9. Validate `SharedPayloadKind`/`producer` at runtime (R9-002)
10. Add `handleSessionHealth()` structural trust section (R26-002)
11. **[NEW since 32]** Add `expectedCachedAt` / `expectedOpaqueId` to `clearCompactPrime()` so identity-free clears fail closed (R33-001)
12. **[NEW since 32]** Move `try/catch` inside the `loadMostRecentState()` scan loop so one bad sibling no longer aborts the whole pass (R38-001)
13. **[NEW since 32]** Re-read mtime after `readFileSync()` in `loadMostRecentState()` and discard if changed, preventing selection/content generation mismatch (R36-001)
14. **[NEW since 32]** Remove the intermediate `storeTokenSnapshot` zero-offset write; carry `newOffset` directly to the final `recordStateUpdate()` (R37-001)
15. **[NEW since 32]** Remove `/tmp/save-context-data.json` from all four runtime root instruction files (R35-003) and from `data-loader.ts`'s error message (R36-003) — the same commit can address both
16. **[NEW since 32]** `cleanStaleStates()` returns structured `{ removed, partial, errors }` so finalize callers no longer treat partial sweeps as clean (R38-002)

**Structural refactors (Medium/Large effort):**

1. **Replace `enrichmentStatus` boolean record with enum-valued status map** — touches `post-insert.ts`, `memory-save.ts`, `response-builder.ts`, `follow-up-api.ts`, plus corresponding tests. Required for R8-001 + its descendants. Large.
2. **Transactional reconsolidation** — move scope filter + complement decision inside the writer transaction; add predecessor CAS to conflict path; **[NEW since 32]** add multi-successor guard to `insertSupersedesEdge()` (R35-001); **[NEW since 32]** share the TM-06 snapshot with the assistive lane or mark assistive recommendations as provisional (R36-002, R37-003). Touches `reconsolidation-bridge.ts`, `reconsolidation.ts`, `memory-save.ts`. Large.
3. **HookState schema versioning + runtime validation + unique temp paths** — touches `hook-state.ts`, `session-stop.ts`, `session-prime.ts` (Claude + Gemini), `session-resume.ts`. **[NEW since 32]** Should also absorb `touchedPaths` / `producerMetadataWritten` durability re-verification (R34-001, R35-002), identity-free-clear protection (R33-001), directory-level per-file degradation (R38-001, R38-002), and torn `statSync`/`readFileSync` fixes (R36-001) — the entire `hook-state.ts` surface is now in scope for one coherent pass. Medium → **[NEW since 32] Medium-to-Large** given the expanded scope.
4. **Trust-state vocabulary expansion** — introduce `absent`/`unavailable` as distinct from `stale`; migrate `trustStateFromGraphState`, `trustStateFromStructuralStatus`, transport renderer, bootstrap/resume/health consumers, and test fixtures. Medium-to-Large.
5. **Graph-metadata `migrated` flag propagation** — touches `graph-metadata-parser.ts`, `memory-parser.ts`, stage-1 candidate gen, tests. Medium.
6. **[NEW since 32] `/tmp/save-context-data.json` coherent removal** — single coordinated edit across `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `data-loader.ts`, command YAMLs in `.opencode/command/`, and the CLI authority tests that still assert the fixed filename. Not a refactor per se but needs to land as one commit to avoid one surface re-teaching the hazard. Medium (coordination cost, not line-count cost).
7. **[NEW since 32] Stop-hook durability re-verification** — if structural refactor (3) is not possible short-term, a narrower alternative is to change `SessionStopProcessResult` to distinguish attempted-write from persisted signals: introduce `attemptedWrites: { producerMetadata: boolean; touchedPaths: string[] }` and `persistedWrites: { producerMetadata: boolean; persistedPaths: string[] }`, where the `persisted*` set is populated only after a post-write `loadState()` re-read. Touches `session-stop.ts`, `hook-state.ts`, the replay harness. Medium.

### 5.3 Test suite changes required [NEW since 32: +6 regression files]

Any structural refactor above must also update these regression tests that currently canonize the degraded contract:

- `tests/post-insert-deferred.vitest.ts:11-48` — currently asserts all-true for deferred; must accept enum status
- `tests/structural-contract.vitest.ts:90-111` — currently asserts `status=missing` + `trustState=stale` simultaneously; must assert distinct labels
- `tests/graph-metadata-schema.vitest.ts:223-245` — currently asserts legacy acceptance without migration marker
- `tests/code-graph-query-handler.vitest.ts:12-18` — hoisted `fresh` readiness mock prevents testing the fail-open branch
- `tests/handler-memory-save.vitest.ts:546-557,2286-2307` — stubs post-insert as all-true success; must test enum-valued status
- `tests/hook-session-stop-replay.vitest.ts:14-56` — autosave disabled; must cover autosave failure paths **[NEW since 32]** plus `touchedPaths` / `producerMetadataWritten` under failure (R34-001, R35-002)
- `tests/opencode-transport.vitest.ts:33-60` — only happy-path trustState=live; must cover `missing`/`absent` cases
- **[NEW since 32]** `tests/hook-precompact.vitest.ts:23-48` + `tests/hook-session-start.vitest.ts:27-107` — need overlap harness for `readCompactPrime` → new write → `clearCompactPrime` (R33-001)
- **[NEW since 32]** `tests/hook-stop-token-tracking.vitest.ts:65-89` + `tests/token-snapshot-store.vitest.ts:25-35` — need concurrent stop-hook harness proving `lastTranscriptOffset` regresses (R33-002, R37-001)
- **[NEW since 32]** `tests/reconsolidation.vitest.ts:790-855` — currently single-writer conflict; must cover two concurrent conflict writers proving multi-successor fan-out (R35-001)
- **[NEW since 32]** `tests/assistive-reconsolidation.vitest.ts:17-234` — needs an interleaving writer that changes the candidate after recommendation forms (R36-002)
- **[NEW since 32]** `tests/hook-state.vitest.ts:21-223` — needs `cleanStaleStates` coverage + `loadMostRecentState` coverage under mid-scan file replacement (R36-001, R38-001, R38-002)
- **[NEW since 32]** `scripts/tests/generate-context-cli-authority.vitest.ts:55-75,77-106,223-247` — still normalizes the fixed `/tmp/save-context-data.json` filename in examples; must assert the loader's error message does not recommend the shared path (R36-003)

---

## Section 6 - Gaps for Remaining Iterations (39-50) [NEW since 32: section renumbered and trimmed]

### 6.1 Domain 3 completion (iterations 39-40, 2 more passes) [NEW since 32: list pruned as iterations 33-38 addressed several items]

*Already covered by iterations 33-38 (no longer gaps):*
- ~~Adversarial harness design~~ — iterations 33-38 have now specified harnesses for nine distinct interleavings.
- ~~Compact-cache identity races~~ — R33-001 is documented.
- ~~Failure-mode cascades for `saveState` failure + autosave~~ — R33-003 is documented.

*Still open for iterations 39-40:*
1. **Cross-runtime writer overlap**: Claude compact-inject + Claude stop-hook + Gemini stop-hook writing the same hook-state file. Are the interleavings additive or do they create novel corruptions?
2. **`writeTransaction` boundary mapping**: document exactly which operations hold the SQLite writer lock and which operations (reconsolidation planning, entity extraction, graph lifecycle) run outside it. This is now the last unaudited structural dimension of Domain 3.
3. **Checkpoint/restore races**: `checkpoint_create` + concurrent save, then `checkpoint_restore`; does this create dangling vector/BM25 rows?
4. **Background `memory_ingest` + foreground saves**: ingest is async; what happens when ingest's embedding update races a save's `updatedAt` write?
5. **[NEW since 32]** Directory-wide poison-pill audit: are `loadMostRecentState` (R38-001) and `cleanStaleStates` (R38-002) the only directory-level single-try loops, or does the runtime have other scans with the same shape (e.g., session-resume manifest scans, graph-metadata directory walks, spec-folder scans)?

### 6.2 Domain 4 (Stringly Typed Governance, 10 passes) (unchanged since iter 32)

**Proposed angles (not yet covered):**
1. `AGENTS.md` Gate 1/2/3 prose contract — which gate triggers are trigger-words vs semantic intent? Drift risk? **[NEW since 32]** Now also implicated as a Domain 3 doc-surface concern via R35-003.
2. `spec_kit_plan_auto.yaml` `intake_only == TRUE` and similar expressions — which interpreter evaluates this? What happens on typos?
3. `skill_advisor.py` keyword dictionaries — which files' contents drive skill selection? Silent drift when file contents change?
4. `manual-playbook-runner.ts` — `Function(...)()` eval of object literals from repository content; escape-hatch analysis
5. `skill_graph_compiler.py` — string-based traversal, cycle detection, rename safety
6. `recommendations.md` + `implementation-summary.md` operational promises — which CI gates validate them? None?
7. `opencode.json` + `.utcp_config.json` MCP naming contracts — `{manual_name}.{manual_name}_{tool_name}` is stringly typed
8. `generate-context.js` trigger-word surface for memory category / triggers / scope
9. Handover-state routing rules — string-based `handover_state` enum with no runtime validator
10. Cross-cutting: which prose contracts could be mechanized with low effort? (e.g., JSON schema + `jsonschema` check in CI)

### 6.3 Domain 5 (Test Coverage Gaps, 10 passes) (unchanged since iter 32)

**Proposed angles:**
1. Concurrent-writer harness inventory (derived from Domain 3) **[NEW since 32]** — iterations 33-38 have now specified 10+ concrete harnesses; Domain 5 iteration 1 should enumerate them as a backlog rather than repeat the investigation.
2. Malformed-state harness inventory (JSON parse failures, truncated files, schema drift)
3. Fail-open fallback branch harness (swallowed exceptions as identified in Domain 1)
4. Regression-suite dishonesty audit (tests that assert the collapsed state)
5. End-to-end save-path integration tests (currently mostly helper-level)
6. End-to-end hook-based session lifecycle tests (currently mostly unit-level)
7. Adversarial test fixtures for `graph-metadata.json` legacy fallback vs modern malformed
8. Test-scaffolding for `runtime` vs `test-only` schemas (several tests hoist unrealistic mocks)
9. Concurrency in reconsolidation and complement paths
10. Cross-runtime (Claude ↔ Gemini) parity tests for hook-state + compact-cache

### 6.4 Files with unanswered questions as of iteration 38 [NEW since 32: two questions answered, list trimmed]

*Answered since iteration 32:*
- ~~`mcp_server/hooks/claude/compact-inject.ts:393-407,416-422` — Does compact-inject use the same unlocked `updateState()` pattern?~~ Iteration 33 confirms: yes, `clearCompactPrime()` is the exact same seam and also lacks identity-free protection (R33-001).
- ~~`mcp_server/lib/storage/reconsolidation.ts` — `executeMerge()` has version CAS; does it also check governance scope?~~ Iteration 35's R35-001 dives further into the conflict lane and confirms no scope check; by analogy merge is at least as protected as conflict, but the scope-check question remains open for merge specifically.

*Still open:*

| File | Open question |
| ---- | ------------- |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Does `setLastGitHead()` on partial-persistence success actually block later stale detection for the unpersisted files? |
| `mcp_server/handlers/code-graph/context.ts` | Does this surface inherit the readiness-fail-open pattern from `code_graph_query`? |
| `mcp_server/lib/search/graph-lifecycle.ts` | `onIndex(...)` returns `{ skipped: true }` under three different conditions; are they all semantically equivalent? (R27-001 suggests no.) |
| `mcp_server/lib/search/entity-linker.ts:527-550,608-640,1096-1132` | Cross-memory blast radius for stale auto-entity rows? |
| `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs | Do the `/tmp/save-context-data.json` parallel writes actually corrupt state at runtime, or does `generate-context.js` read-and-unlink fast enough? **[NEW since 32]** R35-003 + R36-003 make the hazard surface wider, but the actual race observation window is still unmeasured. |
| `mcp_server/handlers/memory-save.ts:2159-2171,2250-2304` | What is the actual timeline between reconsolidation planning and `writeTransaction` acquisition? **[NEW since 32]** R34-002, R36-002, R37-003 all hypothesize against this window; iteration 39 or 40 should measure it. |
| `mcp_server/hooks/claude/shared.ts:109-123` | Can a crafted `payloadContract.provenance.producer` string containing `]` or newline break the `[PROVENANCE: ...]` marker? |
| **[NEW since 32]** `mcp_server/hooks/claude/hook-state.ts:190-205` | Is `clearCompactPrime()`'s identity-free delete exploitable in practice? Specifically: how often does a new `pendingCompactPrime` land between `readCompactPrime()` and the clear in real Claude + Gemini workloads? |
| **[NEW since 32]** `mcp_server/hooks/claude/hook-state.ts:131-165` | Does `loadMostRecentState()`'s single-try scan cause observable continuity loss in practice, or is it typically masked by the caller's subsequent `loadState(sessionId)` retry? (The blast radius depends on whether callers retry or treat `null` as authoritative.) |
| **[NEW since 32]** `mcp_server/lib/storage/reconsolidation.ts:952-993` | `insertSupersedesEdge()`'s `INSERT OR IGNORE` on `(source_id, target_id, relation)` allows multi-successor fan-out (R35-001). Does lineage analytics already break under concurrent conflict writes today, or is the hazard currently masked by low write concurrency? |
| **[NEW since 32]** `mcp_server/hooks/claude/session-stop.ts:175-190` | Is the intermediate `lastTranscriptOffset: 0` write (R37-001) load-bearing for any consumer, or is it pure leftover from a prior design? If the latter, the fix is a pure deletion. |

---

## Appendix A - Finding Catalog (full list, as of iteration 38) [NEW since 32: +14 findings appended]

Format: `RN-NNN` | File:lines | Severity | Short description

```
R1-001  | mcp_server/lib/code-graph/startup-brief.ts:179-192              | P1 | buildSessionContinuity() calls loadMostRecentState() with no scope; hook-state rejects scope-less calls
R1-002  | mcp_server/hooks/claude/session-stop.ts:60-105,240-309          | P1 | input.session_id ?? 'unknown' collapses unrelated sessions onto shared state file
R2-001  | mcp_server/lib/code-graph/startup-brief.ts:179-183              | P1 | (dedup of R1-001) Gemini startup loses continuity section
R2-002  | mcp_server/hooks/claude/hook-state.ts:131-165                    | P1 | loadMostRecentState() wraps whole scan in one try; one malformed file aborts entire lookup
R3-001  | mcp_server/handlers/code-graph/query.ts:42-58                   | P1 | resolveSubject() picks first fq_name/name match with LIMIT 1; no ambiguity signal
R3-002  | mcp_server/handlers/code-graph/query.ts:319-334                 | P1 | readiness gate fails open; ensureCodeGraphReady() exceptions swallowed
R3-003  | mcp_server/handlers/code-graph/query.ts:551-564                 | P2 | response-level edge trust derived from result.edges[0] only
R4-001  | mcp_server/lib/code-graph/startup-brief.ts:179-198              | P1 | (dedup of R1-001)
R4-002  | mcp_server/hooks/claude/hook-state.ts:131-166                   | P1 | (dedup of R2-002)
R4-003  | mcp_server/hooks/claude/hook-state.ts:142-155                   | P2 | recent-state authority based on filesystem mtime, not state.updatedAt
R5-001  | mcp_server/lib/code-graph/ensure-ready.ts:283-317               | P1 | successful inline refresh still reports pre-refresh freshness
R5-002  | mcp_server/lib/code-graph/ensure-ready.ts:183-217               | P1 | partial persistence failures silently treated as successful refresh
R6-001  | mcp_server/handlers/save/reconsolidation-bridge.ts:66-73,243-255,446-454 | P1 | assistive reconsolidation gated behind planner/full-auto switch; default OFF despite docs "default ON"
R6-002  | mcp_server/handlers/save/reconsolidation-bridge.ts:55-66,80-83,478-482 | P1 | ASSISTIVE_AUTO_MERGE_THRESHOLD promises auto-merge; runtime only logs and falls through
R7-001  | mcp_server/api/indexing.ts:111-122                               | P1 | runEnrichmentBackfill uses incremental:true,force:false — fast-path skips unchanged files
R7-002  | mcp_server/handlers/save/post-insert.ts:116-125,159-173         | P1 | entity extraction soft-fails but flag set true; linking runs on stale rows
R8-001  | mcp_server/handlers/save/post-insert.ts:86-213,223-238          | P1 | EnrichmentStatus booleans collapse success/skip/defer/disabled into true
R8-002  | mcp_server/handlers/save/post-insert.ts:116-129,157-181         | P1 | entity linking gated only by feature flags, not by successful extraction
R9-001  | mcp_server/lib/context/shared-payload.ts:592-601                | P1 | trustStateFromGraphState/trustStateFromStructuralStatus collapse missing/empty into stale
R9-002  | mcp_server/lib/context/opencode-transport.ts:40-54              | P2 | coerceSharedPayloadEnvelope is shape-only, not contract-level
R10-001 | mcp_server/hooks/gemini/session-prime.ts:55-68                  | P1 | Gemini compact-recovery drops cached provenance metadata; Claude preserves it
R10-002 | mcp_server/hooks/claude/shared.ts:109-123                       | P2 | wrapper interpolates provenance directly into [PROVENANCE:] line without escaping
R11-001 | mcp_server/hooks/claude/session-stop.ts:199-218,248-276         | P1 | transcript/producer-metadata failure degrades to warning-only; no machine-readable outcome
R11-002 | mcp_server/lib/graph/graph-metadata-parser.ts:223-233           | P2 | legacy fallback returns ok:true with no migration marker
R11-003 | mcp_server/handlers/code-graph/query.ts:367-385                 | P1 | blast_radius silently degrades unresolved subjects into seed file paths
R11-004 | mcp_server/handlers/save/reconsolidation-bridge.ts:283-295      | P2 | scope-filtered reconsolidation candidates vanish silently
R11-005 | mcp_server/handlers/save/post-insert.ts:136-147,187-200         | P2 | summary/graphLifecycle no-ops normalized to true
R12-001 | mcp_server/hooks/claude/session-stop.ts:85-105,112-117,313-317 | P1 | runContextAutosave returns void; no autosave outcome field in SessionStopProcessResult
R12-002 | mcp_server/handlers/code-graph/query.ts:26-29,441-549           | P2 | unsupported/misspelled edgeType returns ok with empty result
R12-003 | mcp_server/handlers/save/reconsolidation-bridge.ts:283-294      | P2 | (opts.limit ?? 3) * 3 pre-filter window can starve in-scope candidates
R12-004 | mcp_server/handlers/save/post-insert.ts:96-105                  | P2 | causalLinks status set true before checking unresolved.length
R12-005 | mcp_server/handlers/save/post-insert.ts:159-173                 | P2 | entityLinking skippedByDensityGuard collapsed into success
R13-001 | mcp_server/hooks/claude/session-stop.ts:60-67,308-312           | P1 | runContextAutosave silently skips when lastSpecFolder/sessionSummary unset
R13-002 | mcp_server/lib/graph/graph-metadata-parser.ts:280-285,457-475,831-860 | P1 | readDoc collapses I/O failure to null; deriveStatus misreads as planned/complete
R13-003 | mcp_server/handlers/code-graph/query.ts:340-364                 | P2 | outline queries degrade unknown/path-mismatched files into ok with nodeCount:0
R13-004 | mcp_server/handlers/save/reconsolidation-bridge.ts:261-270,438-442 | P1 | save-time reconsolidation fails open on internal exceptions; warning-only
R13-005 | mcp_server/handlers/save/post-insert.ts:96-109,210-214          | P2 | causal-link partial unresolved refs treated as successful run
R14-001 | mcp_server/hooks/claude/session-stop.ts:175-193,257-268,274-276 | P1 | storeTokenSnapshot writes lastTranscriptOffset:0 before producer metadata builds; catch swallows later failure
R14-002 | mcp_server/handlers/code-graph/query.ts:26-39,442-555           | P2 | (dup of R12-002)
R14-003 | mcp_server/handlers/save/post-insert.ts:94-113                  | P1 | partial causal-link failures normalized into successful enrichment
R14-004 | mcp_server/handlers/save/post-insert.ts:159-177                 | P2 | (dup of R12-005)
R15-001 | mcp_server/hooks/claude/session-stop.ts:61-77,281-309           | P1 | transcript-driven retargeting silently rewrites autosave destination
R15-002 | mcp_server/hooks/claude/session-stop.ts:294-295,340-369         | P2 | 50 KB tail window can hide real active packet
R15-003 | mcp_server/hooks/claude/session-stop.ts:294-295,370-378         | P1 | transcript I/O failure collapsed into same "ambiguous" path as normal ambiguity
R16-001 | mcp_server/handlers/code-graph/query.ts:417-436,547-548         | P1 | includeTransitive:true runs before switch-level validation; unsupported ops default to CALLS
R16-002 | mcp_server/handlers/save/reconsolidation-bridge.ts:295-305      | P2 | malformed vector-search rows coerced into sentinel values
R17-001 | mcp_server/handlers/code-graph/query.ts:442-559                 | P2 | dangling edges returned as successful relationships with raw edge.targetId
R17-002 | mcp_server/handlers/save/post-insert.ts:106-109,126-129,148-151,174-177,201-214 | P2 | exception-driven enrichment failures still report executionStatus=ran
R18-001 | mcp_server/handlers/code-graph/query.ts:94-99,551-565           | P2 | query-level detectorProvenance silently degrades to global last-index snapshot
R18-002 | mcp_server/lib/graph/graph-metadata-parser.ts:228-242           | P2 | legacy fallback discards original current-schema validation errors
R19-001 | mcp_server/handlers/code-graph/query.ts:127-166,417-436         | P2 | transitive traversal silently degrades dangling nodes into ok with null metadata
R19-002 | mcp_server/handlers/save/reconsolidation-bridge.ts:453-511,514-518 | P2 | assistive reconsolidation failures fall open to ordinary save; no machine-readable signal
R20-001 | mcp_server/hooks/claude/session-stop.ts:199-218,248-268         | P1 | producer metadata describes later transcript state than parsed one
R20-002 | mcp_server/lib/graph/graph-metadata-parser.ts:167-205,223-233   | P2 | legacy fallback fabricates created_at/last_save_at via new Date().toISOString()
R20-003 | mcp_server/handlers/code-graph/query.ts:94-105,551-564          | P2 | (dup of R18-001)
R21-001 | mcp_server/handlers/save/response-builder.ts:311-322,569-573    | P1 | memory_save response collapses post-insert truth further than post-insert does
R21-002 | mcp_server/hooks/claude/hook-state.ts:83-87                     | P1 | JSON.parse(raw) as HookState with no validation; feeds prompt replay + autosave routing
R21-003 | mcp_server/lib/graph/graph-metadata-parser.ts:223-233,264-275,1015-1019 | P1 | refreshGraphMetadataForSpecFolder launders malformed modern JSON into canonical refreshed artifact
R22-001 | mcp_server/handlers/code-graph/query.ts:61-83,94-99,319-364,551-564 | P1 | self-contradictory success payload: readiness empty + detectorProvenance structured
R22-002 | mcp_server/lib/parsing/memory-parser.ts:293-330                 | P1 | fallback-recovered graph-metadata gets qualityScore:1, +0.12 packet boost
R23-001 | mcp_server/handlers/code-graph/query.ts:319-361                 | P1 | query exposes empty readiness while bootstrap canonicalizes same condition as missing
R23-002 | mcp_server/lib/graph/graph-metadata-parser.ts:223-233           | P1 | schema-invalid-as-legacy → first-class graph_metadata indexing → retrieval priority upgrade
R23-003 | mcp_server/hooks/claude/hook-state.ts:83-87                     | P2 | compact-cache expiry observationally identical to cache absence
R24-001 | mcp_server/handlers/memory-save.ts:1616-1678,2362-2384          | P1 | runEnrichmentBackfill advertised before enrichment runs; only deferred case gets typed recovery
R24-002 | mcp_server/handlers/session-resume.ts:174-188,191-327,415-429,560-563 | P1 | cached scope drives fallbackSpecFolder but OpenCode transport uses args.specFolder ?? null
R25-001 | mcp_server/handlers/save/post-insert.ts:223-237                 | P2 | deferred-enrichment all-booleans-true contract codified by tests
R25-002 | mcp_server/handlers/code-graph/query.ts:319-334                 | P2 | ambiguous readiness branch effectively unguarded; tests hoist fresh/structured defaults
R25-003 | mcp_server/lib/graph/graph-metadata-parser.ts:223-233           | P2 | schema-invalid-as-legacy fallback codified as clean success contract
R25-004 | mcp_server/hooks/claude/hook-state.ts:83-87                     | P1 | unvalidated JSON.parse fans out across Claude + Gemini runtimes
R26-001 | mcp_server/lib/context/shared-payload.ts:598-601                | P2 | missing→stale collapse now directly asserted public contract via tests
R26-002 | mcp_server/handlers/session-health.ts:136-166                   | P2 | session_health doesn't attach section-level structuralTrust axes
R27-001 | mcp_server/handlers/save/post-insert.ts:187-200                 | P1 | graphLifecycle=true even when onIndex returns skipped:true; runEnrichmentBackfill can't unblock
R27-002 | mcp_server/context-server.ts:801-816                            | P1 | routing still recommends code_graph_query despite readiness-fail-open gap
R28-001 | mcp_server/hooks/claude/session-stop.ts:244-275                 | P1 | null collapse from loadState indistinguishable from cold start; re-parses transcript
R28-002 | mcp_server/hooks/claude/session-stop.ts:60-67,279-309,340-369   | P1 | null collapse also strips currentSpecFolder disambiguator for detectSpecFolder
R29-001 | mcp_server/handlers/session-resume.ts:174-208                   | P1 | cached-summary schemaVersion check fabricated; HookState has no version field
R29-002 | mcp_server/hooks/claude/session-prime.ts:130-143                | P2 | Claude startup collapses all rejection reasons into same "no cached continuity" state
R30-001 | mcp_server/handlers/session-bootstrap.ts:321-347 + session-resume.ts:530-551 | P1 | same payload carries trustState=stale AND graphOps.readiness.canonical=empty
R30-002 | mcp_server/lib/context/opencode-transport.ts:64-71,98-149       | P1 | OpenCode transport drops richer structural truth; renders only collapsed provenance label
R31-001 | mcp_server/hooks/claude/hook-state.ts:169-176,221-240           | P1 | unlocked RMW against deterministic temp filename
R31-002 | mcp_server/hooks/claude/session-stop.ts:60-67,119-125,261-268,283-309 | P1 | multiple recordStateUpdate + final disk reload create torn-state autosave window
R31-003 | mcp_server/handlers/save/reconsolidation-bridge.ts:282-295     | P1 | executeConflict has no predecessor-version or scope recheck
R31-004 | mcp_server/lib/graph/graph-metadata-parser.ts:969-989           | P2 | process.pid + Date.now() temp path collides at millisecond precision
R31-005 | mcp_server/scripts/loaders/data-loader.ts:59-111                | P2 | /tmp/save-context-data.json is documented shared handoff; workflow-level race
R32-001 | mcp_server/hooks/claude/hook-state.ts:170-176,221-241           | P1 | (dup of R31-001) updateState returns merged even after failed persist
R32-002 | mcp_server/hooks/claude/session-stop.ts:60-67,119-125,244-246,261-268,281-289,302-309 | P1 | (dup of R31-002)
R32-003 | mcp_server/handlers/save/reconsolidation-bridge.ts:270-306 + reconsolidation.ts:611-656 | P1 | (dup+extension of R31-003) scope-retag between filter and commit not re-checked
R32-004 | mcp_server/lib/graph/graph-metadata-parser.ts:969-989           | P2 | (dup of R31-004)
R32-005 | .opencode/command/{memory/save.md, spec_kit/deep-research.md, spec_kit/deep-review.md} + generate-context.ts:61-82 | P2 | (dup+extension of R31-005) multiple command surfaces hardcode the shared path
R33-001 | mcp_server/hooks/claude/hook-state.ts:184-217 + hooks/{claude,gemini}/session-prime + hooks/gemini/compact-inject | P1 | [NEW] clearCompactPrime() nulls pendingCompactPrime by session only; fresh precompact write between read and clear is silently deleted
R33-002 | mcp_server/hooks/claude/session-stop.ts:119-125,244-268 + hook-state.ts:221-241 | P1 | [NEW] lastTranscriptOffset non-monotonic under overlapping stop hooks; no Math.max guard
R33-003 | mcp_server/hooks/claude/hook-state.ts:170-180,221-241 + session-stop.ts:60-67,119-125,261-309 | P1 | [NEW] updateState returns in-memory merged even after saveState failure; runContextAutosave then reloads disk and proceeds anyway
R34-001 | mcp_server/hooks/claude/session-stop.ts:119-125,261-269,302-318 + hook-state.ts:221-240 | P1 | [NEW] producerMetadataWritten set immediately after recordStateUpdate; no post-write re-read, no durability proof
R34-002 | mcp_server/handlers/save/reconsolidation-bridge.ts:261-306 + reconsolidation.ts:599-694 + memory-save.ts:2159-2171,2250-2304 | P1 | [NEW] complement path: vectorSearch + scope filter runs before writeTransaction; concurrent near-duplicate insert missed
R35-001 | mcp_server/handlers/save/reconsolidation-bridge.ts:270-295 + reconsolidation.ts:467-508,610-658,952-993 | P1 | [NEW] insertSupersedesEdge dedupes by (source,target,relation); two conflict saves produce multiple successors for same predecessor
R35-002 | mcp_server/hooks/claude/session-stop.ts:119-125,313-317 + hook-state.ts:170-180,221-240 | P2 | [NEW] touchedPaths appended unconditionally; saveState failure logged but path still returned as touched
R35-003 | AGENTS.md:205-207 + CLAUDE.md:152-155 + CODEX.md:205-207 + GEMINI.md:205-207 + generate-context.ts:61-83 | P2 | [NEW] /tmp/save-context-data.json prescribed in all four runtime root instruction files despite CLI preferring --stdin/--json
R36-001 | mcp_server/hooks/claude/hook-state.ts:140-155,170-176         | P2 | [NEW] loadMostRecentState mtime read from statSync but content from separate readFileSync; torn selection vs content generation
R36-002 | mcp_server/handlers/save/reconsolidation-bridge.ts:453-501 + memory-save.ts:2159-2170,2250-2304 | P2 | [NEW] assistive reconsolidation recommendation formed from pre-transaction snapshot; concurrent save can stale the recommendation before return
R36-003 | mcp_server/scripts/loaders/data-loader.ts:63-68 + generate-context.ts:61-83 | P2 | [NEW] data-loader NO_DATA_FILE error message still recommends shared /tmp/save-context-data.json path
R37-001 | mcp_server/hooks/claude/session-stop.ts:175-190,244-252,257-268 | P1 | [NEW] storeTokenSnapshot persists lastTranscriptOffset:0 before final offset write; overlapping stop hook reads zero and reparses from zero
R37-002 | mcp_server/hooks/claude/session-stop.ts:128-145,244-246,281-296,340-369 | P1 | [NEW] detectSpecFolder prefers currentSpecFolder when multiple packets present; but processStopHook passes stale stateBeforeStop.lastSpecFolder
R37-003 | mcp_server/handlers/save/reconsolidation-bridge.ts:261-306,453-500 | P2 | [NEW] TM-06 planner and assistive review each run independent vectorSearch+scope-filter; single request reasons about two candidate universes
R38-001 | mcp_server/hooks/claude/hook-state.ts:131-165 + handlers/session-resume.ts:348-366 | P2 | [NEW] loadMostRecentState wraps entire directory scan in one try; single bad sibling returns null and suppresses all cached summary reuse
R38-002 | mcp_server/hooks/claude/hook-state.ts:243-263 + hooks/{claude,gemini}/session-stop finalize | P2 | [NEW] cleanStaleStates wraps entire sweep in one try; partial removed count returned on first error with no partial-sweep indicator
```

**End of interim synthesis. Total distinct findings: ~40 (was ~33). Total files flagged: 15 surfaces (was 14). P1 volume: 47 raw / ~27 distinct (was 39 / ~22). P2 volume: 35 raw (was 29). Next useful increment: complete Domain 3 (2 more passes targeting cross-runtime writer overlap and `writeTransaction` boundary mapping), begin Domain 4 (new ground, including the root-instruction doc audit opened by R35-003), and spawn Domain 5 as a dedicated pass with the 10+ harness backlog already specified across iterations 33-38.**
