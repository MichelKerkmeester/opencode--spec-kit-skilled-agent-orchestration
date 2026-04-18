# Interim Synthesis - Phase 016 Foundational Runtime Deep Review

**As of: iteration 32** (Domain 4 still in progress at 2/10; Domain 5 not started)
**Author:** synthesis agent (read-only analysis)
**Scope:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-001-initial-research/iterations/iteration-001.md` through `iteration-032.md`
**Note:** Iterations 1-10 are foundational pre-domain passes; domain tagging starts at iteration 11. Actual domain coverage:
- **Foundational (1-10)**: session-lifecycle / hook-state / code-graph / post-insert / shared-payload / compact-cache seam exploration
- **Domain 1 (11-20)**: Silent Fail-Open Patterns
- **Domain 2 (21-30)**: State Contract Honesty
- **Domain 3 (31-32)**: Concurrency and Write Coordination (2 of 10)
- **Domain 4 (Stringly-Typed Governance)**: not started
- **Domain 5 (Test Coverage Gaps)**: not started (currently appears as a subsidiary finding in almost every iteration rather than a dedicated domain)

---

## Section 1 - Finding Inventory

### 1.1 Raw counts

| Metric                          | Count |
| ------------------------------- | ----- |
| Iterations read                 | 32    |
| Total numbered findings emitted | 68    |
| P1 findings                     | 39    |
| P2 findings                     | 29    |
| P0 findings                     | 0 (see §4 for escalation candidates) |
| Unique file surfaces flagged    | 14    |
| Distinct anti-patterns          | 7     |

### 1.2 Findings per source file (after deduplication)

| File                                                                                   | Raw hits | Distinct issues | Dominant domain |
| -------------------------------------------------------------------------------------- | -------- | --------------- | --------------- |
| `mcp_server/handlers/save/post-insert.ts`                                              | 14       | 6               | D1, D2          |
| `mcp_server/hooks/claude/session-stop.ts`                                              | 13       | 7               | D1, D2, D3      |
| `mcp_server/handlers/code-graph/query.ts`                                              | 11       | 6               | D1, D2          |
| `mcp_server/hooks/claude/hook-state.ts`                                                | 10       | 5               | D2, D3          |
| `mcp_server/handlers/save/reconsolidation-bridge.ts`                                   | 8        | 5               | D1, D3          |
| `mcp_server/lib/graph/graph-metadata-parser.ts`                                        | 7        | 4               | D1, D2, D3      |
| `mcp_server/lib/context/shared-payload.ts`                                             | 3        | 2               | D2              |
| `mcp_server/lib/code-graph/startup-brief.ts`                                           | 3        | 1 (dedup R1-001 ≡ R2-001 ≡ R4-001) | Foundational |
| `mcp_server/lib/code-graph/ensure-ready.ts`                                            | 2        | 2               | Foundational    |
| `mcp_server/handlers/session-bootstrap.ts` + `session-resume.ts` + `session-health.ts` | 4        | 3               | D2              |
| `mcp_server/lib/context/opencode-transport.ts`                                         | 2        | 2               | D2              |
| `mcp_server/lib/parsing/memory-parser.ts`                                              | 1        | 1               | D2              |
| `mcp_server/handlers/memory-save.ts` + `save/response-builder.ts`                      | 2        | 2               | D2              |
| `mcp_server/hooks/claude/shared.ts` + `hooks/gemini/session-prime.ts`                  | 2        | 2               | Foundational    |
| `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs                            | 2        | 2               | D3              |

### 1.3 Deduplication notes

The raw 68-finding total includes substantial overlap across iterations. After merging:

| Dedup cluster                                              | Iterations touching it                              | Canonical finding |
| ---------------------------------------------------------- | --------------------------------------------------- | ----------------- |
| `startup-brief` scope-less `loadMostRecentState()`         | R1-001, R2-001, R4-001                              | R2-001            |
| `hook-state` poison-pill JSON.parse loop                   | R2-002, R4-002                                      | R2-002            |
| `code-graph/query.ts` readiness fails open                 | R3-002, R11-003 (blast-radius variant), R22-001, R23-001, R25-002, R27-002 | R3-002 |
| `post-insert.ts` enrichmentStatus boolean collapse         | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R21-001, R25-001, R27-001 | R8-001 |
| `graph-metadata-parser` legacy fallback as success         | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | R11-002 + R21-003 (laundering variant) |
| `reconsolidation-bridge` scope-filter silent drop          | R11-004, R12-003, R13-004 (throws variant), R16-002 (malformed rows), R19-002 (assistive) | R11-004 + R13-004 |
| `hook-state.ts` unvalidated `JSON.parse(raw) as HookState` | R21-002, R23-003, R24-002, R25-004, R28-001, R28-002, R29-001 | R21-002 |
| `session-stop.ts` unlocked RMW + autosave races            | R31-001, R31-002, R32-001, R32-002, R33-002, R33-003, R34-001 | R31-001 + R31-002 |
| `trustStateFromStructuralStatus` missing→stale collapse    | R9-001, R26-001, R30-001                            | R9-001 |
| `opencode-transport` drops richer trust axes               | R9-002, R30-002                                     | R30-002 |

After deduplication the finding set compresses to approximately **33 distinct issues** across 14 files.

---

## Section 2 - Per-Domain Summary

### 2.1 Foundational Seams (iterations 1-10)

Iterations 1-10 predate the formal domain labeling and act as a reconnaissance pass across the runtime-critical session, graph, and save seams. They establish the baseline that Domains 1-3 later extend.

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

**Central thesis:** the runtime contains many surfaces that return success-shaped payloads after work was skipped, partially applied, or filtered out. Critically, these are not simple thrown-error swallowing; they are **truth-contract erosions** where absence, invalid input, or internal failure is re-interpreted as ordinary benign outcome.

**Key patterns discovered:**

1. **Status erasure at the response boundary.** `session-stop.ts` and `post-insert.ts` both have machine-readable result objects but flatten failed, partial, or skipped work into ordinary success. `response-builder.ts` reduces per-step status nuance into at most a generic warning string (R12-001, R17-002, R21-001).
2. **Input-contract normalization.** Unsupported operations and malformed candidate rows are converted into plausible success states rather than rejected. Examples: `code_graph_query` accepts any `edgeType` string without validating against an allowed set (R12-002, R14-002), transitive traversal bypasses the one-hop `switch` default operation validator (R16-001), and reconsolidation silently coerces malformed vector rows into sentinel values (R16-002).
3. **Absence reinterpreted as truth.** Autosave silently skips when `lastSpecFolder` or `sessionSummary` are missing (R13-001); `graph-metadata-parser.ts` collapses unreadable canonical docs into "doc missing" semantics that then mislead `deriveStatus()` (R13-002); unresolved outline subjects become "file has no symbols" (R13-003); thrown reconsolidation errors become "normal create path" (R13-004).
4. **Second-order truth loss.** Producer-metadata failure also fail-opens the transcript cursor: `storeTokenSnapshot()` already rewrote `lastTranscriptOffset: 0` before the later catch swallows the metadata write failure (R14-001).
5. **Provenance drift in successful envelopes.** Query-level `graphMetadata.detectorProvenance` is a DB-global singleton, so an empty or heuristic-only result still advertises `structured` (R18-001, R20-003). Legacy fallback fabricates `created_at`/`last_save_at` from `new Date().toISOString()` (R20-002). Validation diagnostics degrade to legacy-shape errors when a modern file happens to pass legacy parsing (R18-002).
6. **Packet-target authority drift.** Transcript-driven retargeting silently rewrites the autosave destination (R15-001); the 50 KB tail window can hide the real active packet (R15-002); transcript I/O failure is collapsed into the same "ambiguous transcript" path as normal ambiguity (R15-003).

**Concrete exemplar findings (5 with file:line):**

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

**Central thesis:** the remaining honesty problem is **state promotion and state laundering**. Collapsed producer state becomes harder to recover from once a downstream layer re-emits it as a stronger contract. The system now contains multiple places where ambiguous or recovered state is strengthened into authoritative-looking signals.

**Key patterns discovered:**

1. **State laundering across boundaries.** `memory_save` response drops step detail into warnings (R21-001); hook state drives both prompt text and write targeting without validation (R21-002); legacy graph metadata is rewritten as canonical JSON on refresh with no legacy marker (R21-003).
2. **State promotion at consumer layers.** `code_graph_query` diverges from canonical readiness vocabulary: bootstrap says `missing`, query says `empty` (R23-001). Fallback-migrated graph metadata receives `qualityScore: 1` and a +0.12 packet-search boost (R22-002, R23-002). Compact-cache expiry becomes observationally identical to cache absence (R23-003).
3. **Control-plane asymmetry.** Deferred planner-first saves get a typed `runEnrichmentBackfill` recovery action, but comparable runtime degradation branches get only warning strings (R24-001). Cached resume scope is trusted to choose a packet but not propagated into `opencodeTransport.specFolder` (R24-002).
4. **Regression behavior canonizing degraded contracts.** `tests/post-insert-deferred.vitest.ts:35-47` asserts all-true `enrichmentStatus` for deferred runs. `tests/structural-contract.vitest.ts:90-111` asserts `status=missing` + `trustState=stale` simultaneously. `tests/graph-metadata-schema.vitest.ts:223-245` treats legacy parsing as ordinary success (R25-001 through R25-004).
5. **Health surface weaker than bootstrap/resume.** `session_health` reduces structural trust to the envelope provenance label alone; `session_bootstrap` and `session_resume` carry richer `sections[].structuralTrust` but `session_health` does not (R26-002).
6. **Self-contradictory payloads exported simultaneously.** `session_bootstrap` and `session_resume` serialize both `payloadContract.provenance.trustState = 'stale'` and `graphOps.readiness.canonical = 'missing'` for the same underlying condition; the OpenCode transport then renders only the collapsed envelope label (R30-001, R30-002).
7. **Theatrical schema-drift vocabulary.** `buildCachedSessionSummaryCandidate()` fabricates `schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION` for every loaded `HookState`, even though `HookState` itself has no version field. The `schema_version_mismatch` rejection path is effectively unreachable for real inputs (R29-001).

**Concrete exemplar findings (5 with file:line):**

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

### 2.4 Domain 3 - Concurrency and Write Coordination (iterations 31-32, 2 of 10 done)

**Central thesis (provisional):** the bug class is not simply "missing locks." These seams do work in two phases - they read or filter shared state, then mutate later while treating that earlier snapshot as authoritative. Atomic rename prevents torn bytes, not stale-state decisions.

**Key patterns discovered (so far):**

1. **Unlocked read-modify-write against deterministic temp filenames.** `hook-state.ts:170-176` uses `filePath + '.tmp'`, so two writers for the same session can swap bytes before rename, not just race on the final file. `updateState()` returns the merged in-memory object even after a failed persist (R31-001, R32-001).
2. **Split-brain stop-hook state.** `processStopHook()` captures `stateBeforeStop = loadState(sessionId)` once, performs multiple independent `recordStateUpdate()` calls, then reloads state inside `runContextAutosave()` — so autosave can persist a mix of fields from different stop events (R31-002, R32-002).
3. **Reconsolidation conflict has no predecessor re-validation.** `executeConflict()` deprecates the top-match row via a pure `UPDATE ... WHERE id = ?` with no scope-version or predecessor-version recheck. Merge path defends against drift; conflict does not (R31-003, R32-003).
4. **Graph-metadata refresh atomic at byte level only.** Temp path is `${canonicalFilePath}.tmp-${process.pid}-${Date.now()}`. Two same-process writes within one millisecond collide on the temp file; no CAS against the target (R31-004, R32-004).
5. **Workflow-documented shared temp handoff.** `/tmp/save-context-data.json` is hardcoded in command assets (plan, implement, complete, deep-research, deep-review) even though `generate-context.ts` supports `--stdin`, `--json`, and arbitrary file inputs. The race is documented, not merely implementation-level (R31-005, R32-005).

**Concrete exemplar findings (all with file:line):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R31-001 | `mcp_server/hooks/claude/hook-state.ts:169-176,221-240` | P1 | Deterministic `filePath + '.tmp'` means two writers for the same session swap bytes before rename |
| R31-002 | `mcp_server/hooks/claude/session-stop.ts:60-67,119-125,261-268,283-309` | P1 | Multiple `recordStateUpdate()` calls plus a final disk reload by `runContextAutosave()` create a torn-state autosave window |
| R31-003 | `mcp_server/handlers/save/reconsolidation-bridge.ts:282-295` + `mcp_server/lib/storage/reconsolidation.ts:467-508` | P1 | `executeConflict()` has no predecessor-version or scope recheck; merge defends, conflict does not |
| R31-005 | `mcp_server/scripts/loaders/data-loader.ts:59-111` + command YAMLs | P2 | `/tmp/save-context-data.json` is a documented shared handoff path |
| R32-003 | `mcp_server/handlers/save/reconsolidation-bridge.ts:270-306`, `reconsolidation.ts:611-656,467-508,806-819,882-929` | P1 | Scope filtering happens outside transaction; subsequent scope mutation is not re-checked at conflict/merge |

**Open questions for Domain 3 (iterations 33-40 should target):**
- Can a predecessor `updated_at` or `content_hash` CAS guard be added to `executeConflict()` without restructuring the reconsolidation orchestrator?
- Does `hook-state.ts` need true file locking, or would a unique temp filename (PID + counter + hash) plus a `current_version` field inside `HookState` be sufficient?
- What is the actual concurrent-writer surface at runtime? Dual `session-stop` events are rare; concurrent compact-inject + stop-hook writes are more likely. A harness measuring real overlap frequency would size the actual blast radius.
- How does the generate-context file-input path interact with deep-research iterations that run `@deep-research` agents in parallel? Could shared `/tmp/save-context-data.json` poison cross-iteration state?

**Bonus iterations 33-34 preview (not counted in the 32 above):** iteration 33 adds the `clearCompactPrime()` identity-free cleanup issue (R33-001), transcript-offset monotonicity regression (R33-002), and autosave-on-failed-persist (R33-003). Iteration 34 identifies `producerMetadataWritten` as an attempted-write flag masquerading as a durability postcondition (R34-001) and the complement-path stale-search duplicate window (R34-002).

---

### 2.5 Domain 4 - Stringly Typed Governance (iterations 31-32, marked "in progress")

**Status:** the task brief states iterations 31-32 are Domain 4 in progress (2 of 10), but the iteration content itself is tagged Domain 3. Either the brief is mis-labeling, or the Domain 3 iterations were dispatched before Domain 4 started and the counter is ahead of the content. This synthesis treats iterations 31-32 as Domain 3 (matching the content) and flags Domain 4 as **not yet started** despite the brief's numbering.

The existing `scratch/cross-cutting-patterns.md` already enumerates Domain-4 candidate surfaces:
- `AGENTS.md` — gate behavior encoded as prose plus trigger-word lists
- `spec_kit_plan_auto.yaml` — interpreter-dependent expressions like `intake_only == TRUE`
- `skill_advisor.py` — literal keyword dictionaries
- `manual-playbook-runner.ts` — regex-matched markdown plus `Function(...)()` eval
- `skill_graph_compiler.py` — string-based skill graph compilation
- `recommendations.md` + packet summary docs — operational promises without CI gates

None of these are yet audited in the iteration set as of iteration 32.

---

### 2.6 Domain 5 - Test Coverage Gaps (not started as a dedicated domain)

Test-coverage gaps appear as subsidiary evidence in nearly every iteration's Evidence sections. Recurring patterns:

- `tests/startup-brief.vitest.ts:28-76` mocks `loadMostRecentState()` to return a state object unconditionally, masking the scope-less contract break (R2-001, R4-001)
- `tests/code-graph-query-handler.vitest.ts:12-18` hoists `ensureCodeGraphReady` to always return `'fresh'`, making it impossible to test the readiness-fail-open branch (R3-002, R25-002)
- `tests/post-insert-deferred.vitest.ts:11-48` asserts all-true booleans for deferred runs, codifying the collapse (R8-001, R25-001)
- `tests/graph-metadata-schema.vitest.ts:223-245` asserts legacy acceptance without any migration marker, codifying the laundering path (R11-002, R25-003)
- `tests/hook-session-stop-replay.vitest.ts:14-56` runs with autosave disabled, so the autosave failure branches are never exercised (R12-001, R28-001, R33-003)
- `tests/reconsolidation-bridge.vitest.ts:255-330` only covers static thresholding with mocked search results, no concurrent inserts or row mutations

A dedicated Domain 5 pass should harvest these into a concrete missing-test inventory and turn them into adversarial harnesses.

---

## Section 3 - Cross-Cutting Themes

### 3.1 Anti-patterns appearing in 3+ files

| Anti-pattern                                                           | Files affected                                                           | Representative findings |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| Success-shaped envelope masking skip / defer / partial / failed state  | `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts` | R8-001, R12-001, R13-004, R17-002, R21-001 |
| Unvalidated `JSON.parse` feeding both write-target and prompt-visible text | `hook-state.ts`, `shared-payload.ts`, `graph-metadata-parser.ts` (via validator ok=true) | R21-002, R9-002, R11-002 |
| Collapsed state vocabulary (missing vs empty vs stale vs degraded) across trust / readiness / freshness axes | `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts` | R9-001, R22-001, R23-001, R26-001, R30-001, R30-002 |
| Pre-transaction read-then-mutate (snapshot before lock, mutate inside lock without re-read) | `hook-state.ts` + `session-stop.ts`, `reconsolidation-bridge.ts` + `reconsolidation.ts`, `graph-metadata-parser.ts` | R31-001, R31-002, R31-003, R31-004 |
| Deterministic / shared temp path under concurrency                     | `hook-state.ts` (`.tmp`), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs (`/tmp/save-context-data.json`) | R31-001, R31-004, R31-005 |
| Test fixture canonizes degraded contract                               | `tests/post-insert-deferred.vitest.ts`, `tests/code-graph-query-handler.vitest.ts`, `tests/structural-contract.vitest.ts`, `tests/graph-metadata-schema.vitest.ts` | R25-001 through R25-004, R26-001 |
| Flag-based success without helper-result inspection                    | `post-insert.ts` (`enrichmentStatus.summaries`, `.graphLifecycle`, `.causalLinks`, `.entityLinking`) | R8-001, R11-005, R12-004, R12-005 |

### 3.2 Systemic issues not in the original copilot deep-dive

The supporting `high-priority-deep-dive.md`, `medium-priority-deep-dive.md`, and `low-priority-deep-dive.md` enumerate per-file issues; the iterations surfaced several cross-file patterns that are not in those docs:

1. **Self-contradictory payloads exported simultaneously.** A single `session_bootstrap` response can advertise both `trustState=stale` and `graphOps.readiness.canonical=empty` for the same graph. The scratch docs treat trust-state collapse and readiness canonicalization separately; the runtime now ships both together (R30-001).
2. **Theatrical schema-drift vocabulary.** `CACHED_SESSION_SUMMARY_SCHEMA_VERSION` exists; `buildCachedSessionSummaryCandidate()` assigns it unconditionally; no persisted hook state ever carries a version field (R29-001). The original deep-dive flagged the lack of `hook-state` versioning but not the downstream consumer that pretends versions exist.
3. **Cross-runtime control-plane contamination via tempdir state.** The same hook-state file is consumed by Claude session-prime, Claude session-stop, Gemini session-prime, Gemini compact-inject, and Claude compact-cache (R25-004). One corrupt temp file degrades all four runtimes. The deep-dive treated this as a Claude-only concern.
4. **Regression suite codifies dishonest contracts.** Multiple direct tests assert the collapsed state (R25-001 through R25-004, R26-001). Fixing these becomes a test-migration problem, not just a code problem.
5. **Command-surface documentation reinforces concurrency races.** `/tmp/save-context-data.json` is not just an accident; it is documented in `memory/save.md`, `deep-research.md`, and `deep-review.md`, with matching assertions in `generate-context-cli-authority.vitest.ts` (R32-005). The deep-dive flagged one instance; the iterations prove the pattern is workflow-wide.
6. **The complement reconsolidation path has no transactional protection at all.** Merge has predecessor CAS; conflict has scope-mutable UPDATE; complement is pure routing off a pre-transaction search snapshot (R34-002). The deep-dive covered over-fetch and scope-filter but not the complement-specific duplicate window.
7. **`producerMetadataWritten` and `parsedMessageCount` overstate durability.** Both are attempted-write or attempted-parse flags, not durable postconditions. Downstream analytics and resume code treat them as postconditions (R34-001, R28-001).

### 3.3 Findings that reinforce each other

- **R13-002 (unreadable canonical doc → status=planned) + R11-002 (legacy fallback → ok=true with fabricated timestamps)**: together, a packet with transient read failures can be indexed as a freshly-saved `planned` packet that then receives a +0.12 search boost.
- **R21-002 (unvalidated hook-state JSON) + R28-001 (null collapse indistinguishable from cold start) + R33-002 (transcript offset regresses)**: together, a corrupt tempdir file produces re-parsed transcripts, duplicate token counting, and cross-session state bleed in the same event.
- **R9-001 (missing→stale trust collapse) + R30-001 (self-contradictory bootstrap payload) + R30-002 (transport exports the collapsed label)**: together, the runtime has richer state internally than it exposes, and the dishonest label is the one that reaches hookless OpenCode consumers.
- **R8-001 (enrichmentStatus booleans) + R21-001 (response-builder drops nuance) + R24-001 (only deferred gets a typed recovery action)**: together, save-path consumers literally cannot tell "skipped vs failed vs deferred" and cannot mechanically recover from runtime degradation.
- **R31-001 (unlocked hook-state RMW) + R31-002 (split-brain stop-hook) + R33-003 (autosave proceeds after saveState failure)**: together, Claude stop-hook continuity is multiply vulnerable — concurrent writers can corrupt state, the stop hook reads torn state, and a failed persist does not stop autosave.

---

## Section 4 - Severity Escalation Candidates

### 4.1 Proposed P0 (data integrity, cross-boundary control plane)

Combining interactions across findings, the following deserve P0 consideration:

**P0-candidate-A: Cross-runtime tempdir control-plane poisoning**
- Constituent findings: R21-002 + R25-004 + R28-001 + R29-001 + R31-001 + R33-003
- Rationale: a single corrupt or drifted temp-state file can simultaneously (1) inject forged provenance into Claude prompt text, (2) misroute Gemini startup continuity, (3) force transcript re-parsing with duplicate token counting, (4) bypass the cached-summary schema guard (because persisted state has no schemaVersion field), (5) pair one stop-hook's summary with another's packet target via `updateState()` without CAS, and (6) proceed with autosave after `saveState()` failure.
- Why P0: this is a single-point-of-failure that spans Claude + Gemini, spans write-side + read-side, spans prompt-visible + on-disk, and spans tempdir + continuity + analytics. The blast radius is the entire hook-based session lane.

**P0-candidate-B: Reconsolidation conflict + complement duplicate/corruption window**
- Constituent findings: R31-003 + R32-003 + R34-002
- Rationale: the conflict path deprecates a row with no scope or version revalidation; the complement path selects "create anyway" from a pre-transaction search snapshot. Two concurrent governed saves can deprecate each other or double-insert the same content while governance metadata diverges.
- Why P0: this writes incorrect deprecation / lineage edges into the persistent memory store. Unlike continuity loss, this is permanent data corruption that propagates into every downstream search, causal traversal, and graph-backed retrieval.

**P0-candidate-C: Graph-metadata laundering + search boost**
- Constituent findings: R11-002 + R13-002 + R20-002 + R21-003 + R22-002 + R23-002
- Rationale: a malformed modern `graph-metadata.json` gets (1) accepted as legacy with `ok=true`, (2) assigned `qualityScore: 1` and `qualityFlags: []` by `memory-parser`, (3) stamped with freshly-minted `created_at`/`last_save_at`, (4) rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()`, and (5) boosted +0.12 in packet-search stage-1 candidate generation. The original corruption signal is erased, and the corrupt artifact outranks spec docs.
- Why P0: "state laundering" is a consent-boundary issue. Callers authorize a refresh operation and receive a stronger contract than the input justified.

### 4.2 P1 findings that should stay P1 but with strict ordering

These should be prioritized ahead of other P1 work because their fix paths unlock other fixes:

- R21-001 (response-builder erases step detail) — unlocks R8-001, R24-001
- R9-001 (trust-state collapse at the vocabulary layer) — unlocks R26-001, R26-002, R30-001, R30-002
- R31-001 (hook-state unlocked RMW) — unlocks R31-002, R32-002, R33-002, R33-003, R34-001

### 4.3 P2 interactions that approach P1

- R14-001 (transcript cursor reverts to 0 on metadata failure) + R33-002 (offset monotonicity regression): together create repeatable duplicate token accounting, which is a cost-analytics correctness issue.
- R12-002/R14-002 (unvalidated edgeType string) + R17-001 (dangling edge as successful relationship): an agent passing a typo edge type gets an empty result on one query and a phantom relationship on the next.

---

## Section 5 - Remediation Backlog (Draft)

### 5.1 Grouped by file

#### `mcp_server/hooks/claude/hook-state.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add runtime `HookStateSchema` (zod) validation to `loadState()` and `loadMostRecentState()`; on validation failure, quarantine the file (rename to `.bad`) rather than returning parseable-but-drifted state | **Medium** | R21-002, R25-004, R28-001, R29-001 |
| Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` + retry loop | **Small** | R31-001, R32-001, R31-004 |
| Make `updateState()` return a structured result `{ ok: boolean; merged: HookState; persisted: boolean }` and have `recordStateUpdate()` surface persistence failures | **Small** | R31-001, R33-003 |
| Add a `schemaVersion` field to `HookState` and a migration step; `loadState()` rejects mismatched versions with a distinct `schema_mismatch` reason | **Medium** | R29-001 |
| Add a `Math.max()` guard on `metrics.lastTranscriptOffset` in `updateState()` to enforce monotonicity | **Small** | R33-002 |

#### `mcp_server/hooks/claude/session-stop.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Collapse three separate `recordStateUpdate()` calls in `processStopHook()` into a single atomic patch so `runContextAutosave()` cannot observe torn state | **Medium** | R31-002, R32-002 |
| Derive `producerMetadataWritten` from a post-write re-read, or remove the flag if true durability cannot be proven | **Small** | R34-001 |
| Expand `SessionStopProcessResult` with `autosaveOutcome: 'succeeded' | 'failed' | 'skipped_no_input' | 'disabled'` | **Small** | R12-001, R13-001 |
| Distinguish retarget-by-detection from retarget-by-missing-input; add `retargetReason: 'detected_different_packet' | 'no_previous_packet' | 'transcript_io_failed' | null` | **Small** | R15-001, R15-003 |
| Increase or configure `SPEC_FOLDER_TAIL_BYTES` beyond 50 KB, and/or sample both head and tail for large transcripts | **Small** | R15-002 |

#### `mcp_server/handlers/save/post-insert.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Replace `enrichmentStatus: Record<string, boolean>` with `Record<string, 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial'>` and propagate per-step results | **Large** | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001 |
| Consume `summaryResult.stored` and `indexResult.skipped` instead of flipping booleans unconditionally | **Small** | R11-005 |
| Gate entity linking on successful entity extraction, not just feature flags | **Small** | R8-002, R7-002 |

#### `mcp_server/handlers/save/reconsolidation-bridge.ts` + `lib/storage/reconsolidation.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add predecessor `content_hash` + scope CAS inside `executeConflict()`; abort if row changed since search snapshot | **Medium** | R31-003, R32-003 |
| Move complement decision inside the writer transaction, or re-run `vectorSearch()` + scope filter just before insert and fall through to merge/conflict if a new near-duplicate appeared | **Large** | R34-002 |
| Append a structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` when `candidateMatchesRequestedScope` filters out all results | **Small** | R11-004, R12-003 |
| Add structured warning when assistive path throws | **Small** | R19-002 |
| Reject malformed vector-search rows (`id === 0`, missing `content_text`) instead of coercing to sentinels | **Small** | R16-002 |
| Rename `ASSISTIVE_AUTO_MERGE_THRESHOLD` or make the threshold actually perform the promised auto-merge | **Small** | R6-002 |

#### `mcp_server/handlers/code-graph/query.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Validate `edgeType` against an allowed enum; reject unsupported values with `status: "error"` | **Small** | R12-002, R14-002 |
| Apply the `Unknown operation` validation before the transitive branch runs | **Small** | R16-001 |
| Resolve `blast_radius` subjects via `resolveSubjectFilePath()` with no string fallback; empty resolution returns `status: "error"` | **Small** | R11-003 |
| Don't swallow `ensureCodeGraphReady()` exceptions — surface them as `status: "error"` with a distinct `reason` | **Small** | R3-002, R22-001, R23-001, R25-002, R27-002 |
| Validate outline subject via `resolveSubjectFilePath()` before calling `queryOutline()`; unknown file returns `status: "error"` | **Small** | R13-003 |
| Emit per-result detector provenance, not the global `last_detector_provenance` singleton, or at minimum label the top-level as `graphMetadata.detectorProvenanceScope: 'global' | 'result'` | **Medium** | R18-001, R20-003 |
| Enforce `ambiguous_subject` error when `fq_name` or `name` match count > 1 | **Small** | R3-001 |
| Flag dangling edges (null target/source node) as graph corruption, not as a normal relationship | **Small** | R17-001, R19-001 |

#### `mcp_server/lib/graph/graph-metadata-parser.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Have `validateGraphMetadataContent()` return `{ ok: true, metadata, migrated: boolean, migrationSource?: 'legacy' }` when legacy fallback succeeds; have consumers propagate `migrated` all the way through `memory-parser` and ranking | **Medium** | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| Preserve the original current-schema validation errors in the returned diagnostic set when legacy fallback also fails | **Small** | R18-002 |
| Distinguish `readDoc()` I/O failure from "file does not exist"; propagate I/O failure into `deriveStatus()` as `status: 'unknown'` rather than `planned`/`complete` | **Small** | R13-002 |
| Use unique temp filenames in `writeGraphMetadataFile()` (pid + counter + hash); add retry + CAS against target mtime | **Small** | R31-004, R32-004 |

#### `mcp_server/lib/context/shared-payload.ts` + `lib/context/opencode-transport.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| `trustStateFromGraphState()` and `trustStateFromStructuralStatus()` emit distinct labels for `missing` (new: `absent` or `unavailable`) vs `stale` | **Medium** | R9-001, R26-001, R30-001 |
| `renderBlockContent()` inspects `graphOps.readiness.canonical` and section-level `structuralTrust` instead of only `payloadContract.provenance.trustState` | **Medium** | R9-002, R30-002 |
| Validate `SharedPayloadKind` and `producer` at runtime, not just TypeScript-level | **Small** | R9-002 |

#### `mcp_server/handlers/session-*.ts`

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| `handleSessionResume()` propagates derived `scopeFallback` into `buildOpenCodeTransportPlan({ specFolder })` instead of overwriting with `args.specFolder ?? null` | **Small** | R24-002 |
| `handleSessionHealth()` attaches `structuralTrust` to the `structural-context` section like resume/bootstrap | **Small** | R26-002 |

#### `scripts/memory/generate-context.ts` + command YAMLs

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Remove `/tmp/save-context-data.json` from all command surfaces; default examples to `--stdin` or `--json '<inline>'` | **Small** | R31-005, R32-005 |
| If file handoff is preserved, require unique path per-invocation (e.g., `/tmp/save-context-data-${pid}-${uuid}.json`) and fail if the file already exists | **Small** | R31-005, R32-005 |

### 5.2 Quick wins vs structural refactors

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

**Structural refactors (Medium/Large effort):**

1. **Replace `enrichmentStatus` boolean record with enum-valued status map** — touches `post-insert.ts`, `memory-save.ts`, `response-builder.ts`, `follow-up-api.ts`, plus corresponding tests. Required for R8-001 + its descendants. **Large.**
2. **Transactional reconsolidation** — move scope filter + complement decision inside the writer transaction; add predecessor CAS to conflict path. Touches `reconsolidation-bridge.ts`, `reconsolidation.ts`, `memory-save.ts`. **Large.**
3. **HookState schema versioning + runtime validation + unique temp paths** — touches `hook-state.ts`, `session-stop.ts`, `session-prime.ts` (Claude + Gemini), `session-resume.ts`. **Medium.**
4. **Trust-state vocabulary expansion** — introduce `absent`/`unavailable` as distinct from `stale`; migrate `trustStateFromGraphState`, `trustStateFromStructuralStatus`, transport renderer, bootstrap/resume/health consumers, and test fixtures. **Medium-to-Large.**
5. **Graph-metadata `migrated` flag propagation** — touches `graph-metadata-parser.ts`, `memory-parser.ts`, stage-1 candidate gen, tests. **Medium.**

### 5.3 Test suite changes required

Any structural refactor above must also update these regression tests that currently canonize the degraded contract:

- `tests/post-insert-deferred.vitest.ts:11-48` — currently asserts all-true for deferred; must accept enum status
- `tests/structural-contract.vitest.ts:90-111` — currently asserts `status=missing` + `trustState=stale` simultaneously; must assert distinct labels
- `tests/graph-metadata-schema.vitest.ts:223-245` — currently asserts legacy acceptance without migration marker
- `tests/code-graph-query-handler.vitest.ts:12-18` — hoisted `fresh` readiness mock prevents testing the fail-open branch
- `tests/handler-memory-save.vitest.ts:546-557,2286-2307` — stubs post-insert as all-true success; must test enum-valued status
- `tests/hook-session-stop-replay.vitest.ts:14-56` — autosave disabled; must cover autosave failure paths
- `tests/opencode-transport.vitest.ts:33-60` — only happy-path trustState=live; must cover `missing`/`absent` cases

---

## Section 6 - Gaps for Remaining Iterations (33-50)

### 6.1 Domain 3 completion (iterations 33-40, 8 more passes)

**Must cover:**
1. **Adversarial harness design** (already staged in iteration 31's next-angle and iteration 32's next-angle):
   - Dual-writer `hook-state` test proving lost `lastSpecFolder` under overlap
   - Two concurrent `processStopHook()` calls proving `lastTranscriptOffset` regress
   - Reconsolidation conflict regression that mutates predecessor scope between `findSimilar` and commit
   - Two same-millisecond graph-metadata refreshes
   - Dual `generate-context.js` invocations with overlapping `/tmp/save-context-data.json` writes
2. **Compact-cache identity races** (previewed in iteration 33): `readCompactPrime()` → write new `pendingCompactPrime` → `clearCompactPrime()` clears the newer payload
3. **Cross-runtime writer overlap**: Claude compact-inject + Claude stop-hook + Gemini stop-hook writing the same hook-state file
4. **Failure-mode cascades**: what happens when `saveState()` fails, `updateState()` returns in-memory merged, autosave reads disk, and all three observers disagree about state
5. **`writeTransaction` boundary mapping**: document exactly which operations hold the SQLite writer lock and which operations (reconsolidation planning, entity extraction, graph lifecycle) run outside it
6. **Checkpoint/restore races**: `checkpoint_create` + concurrent save, then `checkpoint_restore`; does this create dangling vector/BM25 rows?
7. **Background `memory_ingest` + foreground saves**: ingest is async; what happens when ingest's embedding update races a save's `updatedAt` write?

### 6.2 Domain 4 (Stringly Typed Governance, 10 passes)

**Proposed angles (not yet covered):**
1. `AGENTS.md` Gate 1/2/3 prose contract — which gate triggers are trigger-words vs semantic intent? Drift risk?
2. `spec_kit_plan_auto.yaml` `intake_only == TRUE` and similar expressions — which interpreter evaluates this? What happens on typos?
3. `skill_advisor.py` keyword dictionaries — which files' contents drive skill selection? Silent drift when file contents change?
4. `manual-playbook-runner.ts` — `Function(...)()` eval of object literals from repository content; escape-hatch analysis
5. `skill_graph_compiler.py` — string-based traversal, cycle detection, rename safety
6. `recommendations.md` + `implementation-summary.md` operational promises — which CI gates validate them? None?
7. `opencode.json` + `.utcp_config.json` MCP naming contracts — `{manual_name}.{manual_name}_{tool_name}` is stringly typed
8. `generate-context.js` trigger-word surface for memory category / triggers / scope
9. Handover-state routing rules — string-based `handover_state` enum with no runtime validator
10. Cross-cutting: which prose contracts could be mechanized with low effort? (e.g., JSON schema + `jsonschema` check in CI)

### 6.3 Domain 5 (Test Coverage Gaps, 10 passes)

**Proposed angles:**
1. Concurrent-writer harness inventory (derived from Domain 3)
2. Malformed-state harness inventory (JSON parse failures, truncated files, schema drift)
3. Fail-open fallback branch harness (swallowed exceptions as identified in Domain 1)
4. Regression-suite dishonesty audit (tests that assert the collapsed state)
5. End-to-end save-path integration tests (currently mostly helper-level)
6. End-to-end hook-based session lifecycle tests (currently mostly unit-level)
7. Adversarial test fixtures for `graph-metadata.json` legacy fallback vs modern malformed
8. Test-scaffolding for `runtime` vs `test-only` schemas (several tests hoist unrealistic mocks)
9. Concurrency in reconsolidation and complement paths
10. Cross-runtime (Claude ↔ Gemini) parity tests for hook-state + compact-cache

### 6.4 Files with unanswered questions as of iteration 32

| File | Open question |
| ---- | ------------- |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Does `setLastGitHead()` on partial-persistence success actually block later stale detection for the unpersisted files? (Iteration 5 hinted yes but did not confirm.) |
| `mcp_server/handlers/code-graph/context.ts` | Does this surface inherit the readiness-fail-open pattern from `code_graph_query`? (Iteration 5 line 13 hints yes via `context.ts:96-105,169-194`, not fully audited.) |
| `mcp_server/lib/search/graph-lifecycle.ts` | `onIndex(...)` returns `{ skipped: true }` under three different conditions (graph refresh off, entity linking disabled, empty content); are they all semantically equivalent to `post-insert.ts`? (R27-001 suggests no.) |
| `mcp_server/lib/storage/reconsolidation.ts` | `executeMerge()` has version CAS; does it also check governance scope, or only `updated_at` + `content_hash`? (R32-003 evidence suggests no scope check.) |
| `mcp_server/lib/search/entity-linker.ts:527-550,608-640,1096-1132` | If `refreshAutoEntitiesForMemory()` soft-fails, subsequent `runEntityLinkingForMemory()` uses stale rows. Is there a cross-memory blast radius, or is the stale-entity effect contained per-memory? (R7-002 did not fully investigate.) |
| `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs | Do the `/tmp/save-context-data.json` parallel writes actually corrupt state, or does `generate-context.js` read-and-unlink fast enough to mask the race? (R31-005 hypothesizes, doesn't prove.) |
| `mcp_server/handlers/memory-save.ts:2159-2171,2250-2304` | What is the actual timeline between reconsolidation planning and `writeTransaction` acquisition? Is the window measurable under real load? (R34-002 hypothesizes, doesn't measure.) |
| `mcp_server/hooks/claude/shared.ts:109-123` | Can a crafted `payloadContract.provenance.producer` string containing `]` or newline actually break the `[PROVENANCE: ...]` marker and enable prompt injection? (R10-002 identifies the risk but doesn't confirm exploitability.) |
| `mcp_server/hooks/claude/compact-inject.ts:393-407,416-422` | Does compact-inject use the same unlocked `updateState()` pattern, or does it serialize on a different path? (R31-001 flags concurrent producers; precise interleaving not yet characterized.) |

---

## Appendix A - Finding Catalog (full list, as of iteration 32)

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
```

**End of interim synthesis. Total distinct findings: ~33. Total files flagged: 14. P1 volume: 39 raw / ~22 distinct. Next useful increment: complete Domain 3 (8 more passes), begin Domain 4 (new ground), and spawn Domain 5 as a dedicated pass rather than subsidiary evidence.**
