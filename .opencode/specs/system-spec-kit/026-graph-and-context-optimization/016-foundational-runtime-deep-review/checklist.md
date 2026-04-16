---
title: "Verification Checklist: Foundational Runtime Remediation"
description: "Verification checklist for Phase 017 remediation of 63 distinct findings. Every item includes acceptance evidence (test file / grep / type-check / manual repro). P0 items block completion; P1 items must complete or get user-approved deferral; P2 items can defer with documented reason."
trigger_phrases:
  - "016 remediation checklist"
  - "foundational runtime remediation verification"
  - "phase 017 checklist"
  - "p0 composite verification"
  - "remediation acceptance criteria"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-16T21:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Stage 2 rewrite — checklist.md now enumerates P0/P1/P2 verification items for every remediation + 7 test migrations + post-remediation verification"
    next_safe_action: "Preflight: resolve OQ1-OQ4 and run closing-pass audit of 11 untouched files"
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:016-remediation-checklist-2026-04-16"
      session_id: "016-remediation-rewrite-session"
      parent_session_id: "016-deep-research-session"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Checklist target: ~70+ items covering P0/P1/P2 findings plus test migration and post-remediation verification"
---
# Verification Checklist: Foundational Runtime Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete. Every P0 item must be verified with evidence before closing the 016 remediation. |
| **[P1]** | Required | Must complete OR get user-approved deferral with documented rationale. |
| **[P2]** | Optional | Can defer with documented reason; track in parent 026 parking-lot. |

**Evidence format.** Every item ends with "verified by [test file / grep / type-check / manual repro / inspection]". Items without evidence cannot be marked verified.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:preflight -->
## Preflight (Week 1)

- [x] CHK-PRE-001 [P0] Phase 016 research complete (50 iterations) — verified by inspection of `FINAL-synthesis-and-review.md` and 50 iteration files
- [x] CHK-PRE-002 [P0] Findings registry structured — verified by `findings-registry.json` existence + JSON schema validation
- [x] CHK-PRE-003 [P0] P0 composite candidates mapped to constituent findings — verified by inspection of `spec.md` §3
- [ ] CHK-PRE-004 [P0] Closing-pass audit of 11 untouched files (`FINAL §8.2`) complete — verified by a `closing-pass-notes.md` in research folder listing any new findings
- [ ] CHK-PRE-005 [P0] OQ1 resolved: `command-spec-kit` Gate 3 enforcement documented — verified by test case + ADR entry
- [ ] CHK-PRE-006 [P0] OQ2 resolved: degraded-contract test compatibility review — verified by per-file annotation in `plan.md` §2 DoR
- [ ] CHK-PRE-007 [P0] OQ3 resolved: HookState `schemaVersion` migration path decided — verified by decision in `../../decision-record.md` or equivalent
- [ ] CHK-PRE-008 [P0] OQ4 resolved: `/spec_kit:*` subcommand enumeration — verified by list in `tasks.md` T-SAP-03
- [ ] CHK-PRE-009 [P1] Adversarial repros constructed for R33-001, R40-001, R46-003, R34-002, R35-001 — verified by test fixtures under `tests/adversarial/`
<!-- /ANCHOR:preflight -->

---

<!-- ANCHOR:p0-composite -->
## P0 Composite Candidates — Elimination Verification

### P0-A: Cross-runtime tempdir control-plane poisoning

- [ ] CHK-P0-A-01 [P0] R21-002, R25-004: `HookStateSchema` (Zod) runtime validation on every `loadState()` and `loadMostRecentState()` — verified by `hook-state.vitest.ts` "rejects drifted state" + grep `Zod` in `hook-state.ts`
- [ ] CHK-P0-A-02 [P0] R29-001: `schemaVersion` field added to `HookState`; mismatched versions rejected with `schema_mismatch` — verified by `T-TEST-NEW-06` (HookState schema-version mismatch rejection)
- [ ] CHK-P0-A-03 [P0] R31-001: Deterministic `.tmp` filename replaced with `.tmp-<pid>-<counter>-<random>` — verified by grep `\.tmp-\$\{process\.pid\}-\$\{counter\}-` in `hook-state.ts` and regression test for two-concurrent-writer race
- [ ] CHK-P0-A-04 [P0] R33-001: `clearCompactPrime()` uses identity check (`cachedAt` / `opaqueId`) — verified by `T-TEST-NEW-05` compact prime identity race test
- [ ] CHK-P0-A-05 [P0] R33-003: `updateState()` returns `{ ok, merged, persisted }`; callers surface persistence failures — verified by type-check + grep `persisted: false` handling in `session-stop.ts`
- [ ] CHK-P0-A-06 [P0] R36-001: mtime re-read after `readFileSync()` in `loadMostRecentState()` with discard-on-change — verified by torn-read regression test
- [ ] CHK-P0-A-07 [P0] R38-001: Per-file isolation in `loadMostRecentState()` — verified by poison-pill-sibling test in `hook-state.vitest.ts`
- [ ] CHK-P0-A-08 [P0] R38-002: Per-file isolation in `cleanStaleStates()` with `{ removed, skipped, errors }` return — verified by partial-sweep test
- [ ] CHK-P0-A-09 [P0] P0-A attack scenario (`FINAL §3.1`, all 10 steps) blocked — verified by new regression test `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` constructing the full attack chain

### P0-B: Reconsolidation conflict + complement duplicate/corruption window

- [ ] CHK-P0-B-01 [P0] R31-003, R35-001, R32-003: `executeConflict()` predecessor CAS (`content_hash + is_deprecated = FALSE`); aborts with `'conflict_stale_predecessor'` — verified by `T-TEST-NEW-01` two-concurrent-conflict save test
- [ ] CHK-P0-B-02 [P0] R34-002: Complement decision inside writer transaction OR re-runs vector search + scope filter before insert — verified by new test `p0-b-two-concurrent-complement.vitest.ts`
- [ ] CHK-P0-B-03 [P0] R39-002, R40-002: Batched scope reads (NOT per-candidate `readStoredScope()`) — verified by `T-TEST-NEW-02` mixed-snapshot scope filter test
- [ ] CHK-P0-B-04 [P0] R36-002, R37-003: Assistive review runs inside transaction OR flags `advisory_stale: true` when snapshot predates commit — verified by updated `assistive-reconsolidation.vitest.ts`
- [ ] CHK-P0-B-05 [P0] P0-B attack scenario (`FINAL §3.2`, all 5 steps) blocked — verified by `p0-b-reconsolidation-composite.vitest.ts` constructing the full attack chain

### P0-C: Graph-metadata laundering + packet-search boost

- [ ] CHK-P0-C-01 [P0] R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003: `validateGraphMetadataContent()` returns `{ ok, metadata, migrated, migrationSource? }`; consumers propagate `migrated` — verified by type-check + updated `graph-metadata-schema.vitest.ts`
- [ ] CHK-P0-C-02 [P0] R13-002: `readDoc()` I/O failure distinguished from "file does not exist"; propagated as `status: 'unknown'` — verified by new `graph-metadata-io-failure.vitest.ts`
- [ ] CHK-P0-C-03 [P0] R21-003, R22-002 (consumer): `refreshGraphMetadataForSpecFolder()` preserves `migrated` marker in rewritten JSON — verified by refresh test with legacy-input fixture
- [ ] CHK-P0-C-04 [P0] R22-002, R23-002 (ranker): Stage-1 indexing penalizes (does NOT boost) `migrated=true` or `qualityScore: 1` rows — verified by stage-1 ranker test with mixed migrated/clean corpus
- [ ] CHK-P0-C-05 [P0] P0-C attack scenario (`FINAL §3.3`, all 6 steps) blocked — verified by `p0-c-graph-metadata-laundering.vitest.ts` constructing the full laundering pipeline

### P0-D: TOCTOU cleanup erasing fresh state under live session load

- [ ] CHK-P0-D-01 [P0] R40-001: TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` — verified by `T-TEST-NEW-03` (TOCTOU cleanup → cold-start test)
- [ ] CHK-P0-D-02 [P0] R38-001: Per-file error isolation in `loadMostRecentState()` (covered by CHK-P0-A-07; required again here) — verified by same test
- [ ] CHK-P0-D-03 [P0] R37-001: Transient `lastTranscriptOffset: 0` sentinel eliminated — verified by `T-TEST-NEW-04` (two-stop overlap test)
- [ ] CHK-P0-D-04 [P0] R33-002: `Math.max()` monotonicity guard on `lastTranscriptOffset` in `updateState()` — verified by offset-regression-blocked test in `hook-state.vitest.ts`
- [ ] CHK-P0-D-05 [P0] P0-D attack scenario (`FINAL §3.4`, all 4 steps) blocked — verified by `p0-d-toctou-cleanup-composite.vitest.ts` constructing the full attack chain
<!-- /ANCHOR:p0-composite -->

---

<!-- ANCHOR:p1-findings -->
## P1 Findings — Closure Verification (~37 items)

Each P1 finding must be individually closed with evidence. Organized by source file:

### session-stop.ts

- [ ] CHK-P1-01 [P1] R1-002: `session_id ?? 'unknown'` fallback rejected or quarantined — verified by test "unknown session ID rejected" in `hook-state.vitest.ts`
- [ ] CHK-P1-02 [P1] R11-001: Transcript/producer-metadata failure surfaced as typed `OperationResult` — verified by `OperationResult<T>` type in response + integration test
- [ ] CHK-P1-03 [P1] R13-001: `runContextAutosave` emits `autosaveOutcome: 'skipped'` when inputs missing — verified by test "autosave skip outcome" + type-check
- [ ] CHK-P1-04 [P1] R14-001: `storeTokenSnapshot` no longer writes transient `lastTranscriptOffset: 0` — verified by grep `lastTranscriptOffset: 0` returns no intermediate writes
- [ ] CHK-P1-05 [P1] R15-001, R15-002, R15-003: Transcript retargeting reports typed reason; tail window configurable; I/O failure distinguished — verified by `transcript-retargeting.vitest.ts` with 3 scenarios
- [ ] CHK-P1-06 [P1] R20-001: Transcript stat snapshotted before `buildProducerMetadata()` — verified by test for generation-consistency
- [ ] CHK-P1-07 [P1] R27-002: Routing recommendations no longer recommend `code_graph_query` under readiness fail-open — verified by `context-server.ts` update + routing test
- [ ] CHK-P1-08 [P1] R28-001: `loadState()` null return distinguishable from cold start; `startOffset = 0` reasoning gated — verified by integration test for cold-start-looks-different-from-parse-failure
- [ ] CHK-P1-09 [P1] R28-002: Null collapse no longer strips `currentSpecFolder` disambiguator — verified by `detectSpecFolder` test

### hook-state.ts (P1 beyond P0-A coverage)

- [ ] CHK-P1-10 [P1] R1-001 (dedup): `buildSessionContinuity()` scope either provided or `loadMostRecentState()` accepts scope-less calls — verified by Gemini startup test
- [ ] CHK-P1-11 [P1] R2-002 (dedup): Single-try directory scan replaced with per-file isolation (covered by CHK-P0-A-07 + CHK-P0-D-02) — verified by same tests

### reconsolidation-bridge.ts (P1 beyond P0-B coverage)

- [ ] CHK-P1-12 [P1] R6-001: Assistive reconsolidation default aligned with documentation — verified by `reconsolidation-bridge.vitest.ts` "default matches docs" test
- [ ] CHK-P1-13 [P1] R6-002: `ASSISTIVE_AUTO_MERGE_THRESHOLD` either renamed OR auto-merge implemented — verified by grep for threshold usage + auto-merge test
- [ ] CHK-P1-14 [P1] R13-004: Thrown errors in reconsolidation surface structured warnings (not silent fall-through) — verified by `OperationResult<T>` handling test

### post-insert.ts (all six distinct findings via M13)

- [ ] CHK-P1-15 [P1] R7-002: Entity linking gated on successful extraction — verified by `T-PIN-01` test
- [ ] CHK-P1-16 [P1] R8-001: `enrichmentStatus` is `OperationResult<T>` map (anchor finding of M13) — verified by type-check + updated tests
- [ ] CHK-P1-17 [P1] R8-002: Entity linking gated on `extraction.status == 'ran'` — verified by feature-flag + extraction combo test
- [ ] CHK-P1-18 [P1] R14-003 (dedup R12-004): Partial causal-link failures propagate `partial` status — verified by test
- [ ] CHK-P1-19 [P1] R27-001: `graphLifecycle` skip reason propagated — verified by backfill unblock test

### code-graph/query.ts (P1)

- [ ] CHK-P1-20 [P1] R3-001: `resolveSubject()` returns `ambiguous_subject` on multi-row match — verified by test
- [ ] CHK-P1-21 [P1] R3-002: `ensureCodeGraphReady()` exceptions surfaced as `status: "error"` — verified by `T-TEST-04` (migrated)
- [ ] CHK-P1-22 [P1] R11-003: `blast_radius` unresolved-subject returns error — verified by test
- [ ] CHK-P1-23 [P1] R16-001: Operation validated before transitive branch — verified by "unknown operation rejected" test
- [ ] CHK-P1-24 [P1] R22-001 + R23-001 (dedup): Readiness vocabulary aligned with bootstrap via M8 — verified by CHK-P1-M8-*

### graph-metadata-parser.ts (P1 beyond P0-C coverage)

(All four P1 findings are in P0-C constituent list; covered by CHK-P0-C-*.)

### shared-payload.ts + opencode-transport.ts (M8)

- [ ] CHK-P1-25 [P1] R9-001: `trustStateFromGraphState()` / `trustStateFromStructuralStatus()` use `absent`/`unavailable` distinct from `stale` — verified by `T-TEST-02` (migrated)
- [ ] CHK-P1-26 [P1] R30-001: Same payload no longer carries `trustState=stale` AND `readiness.canonical=empty` simultaneously — verified by `T-TEST-07` (migrated) + integration test
- [ ] CHK-P1-27 [P1] R30-002: OpenCode transport renders richer axes — verified by `T-TEST-07` (migrated)

### session-{bootstrap,resume,health}.ts (P1)

- [ ] CHK-P1-28 [P1] R24-002: `handleSessionResume` forwards fallback scope — verified by resume test with args.specFolder=null
- [ ] CHK-P1-29 [P1] R29-001 consumer: schema-version rejection path reachable (gated by CHK-P0-A-02) — verified by same test

### response-builder.ts / memory-save.ts (P1)

- [ ] CHK-P1-30 [P1] R21-001: `memory_save` response propagates `OperationResult<T>` — verified by `T-TEST-05` (migrated)
- [ ] CHK-P1-31 [P1] R24-001: All runtime-degradation branches get typed recovery — verified by test across 4 degradation types

### shared.ts / gemini/session-prime.ts

- [ ] CHK-P1-32 [P1] R10-001: Gemini wrapper forwards `payloadContract.provenance` — verified by Gemini compact-recovery test

### ensure-ready.ts

- [ ] CHK-P1-33 [P1] R5-001: Inline reindex refreshes readiness/freshness reports — verified by test
- [ ] CHK-P1-34 [P1] R5-002: mtime not written until nodes+edges persist — verified by partial-persistence failure test

### Domain 4 — P1 findings

- [ ] CHK-P1-35 [P1] R41-003 + R45-003: Topology checks promoted to hard errors in compiler + warnings surfaced in `health_check()` — verified by `T-TEST-NEW-11` + `T-TEST-NEW-18`
- [ ] CHK-P1-36 [P1] R41-004 + R46-003: `Function(...)()` eval replaced with typed step executor — verified by grep `new Function\(` returns zero in `manual-playbook-runner.ts` + `T-TEST-NEW-07`
- [ ] CHK-P1-37 [P1] R43-001 + R44-001 (dedup): `intent_signals` wired into `analyze_request()` scoring — verified by `T-TEST-NEW-08` + grep for signals consumer
- [ ] CHK-P1-38 [P1] R45-004: `parsedCount == filteredCount` assertion before coverage — verified by `T-TEST-NEW-12`
- [ ] CHK-P1-39 [P1] R46-001: Per-subcommand bridges in `COMMAND_BRIDGES` — verified by `T-TEST-NEW-09`
- [ ] CHK-P1-40 [P1] R46-002: `conflicts_with` reciprocity check in `validate_edge_symmetry()` — verified by `T-TEST-NEW-10`
- [ ] CHK-P1-41 [P1] R49-003: Arbitrary-length cycle detection — verified by `T-TEST-NEW-18`
- [ ] CHK-P1-42 [P1] R50-001: Gate 3 triggers on `resume deep research` — verified by `T-TEST-NEW-17`
<!-- /ANCHOR:p1-findings -->

---

<!-- ANCHOR:p2-findings -->
## P2 Findings — Closure Verification (~30 items)

P2 findings may be deferred with documented reason. Default expectation is closure within the 10-week schedule.

### session-stop.ts

- [ ] CHK-P2-01 [P2] R15-002 alone (tail-window-hides-packet scenario): 50 KB tail configurable — verified by test with large transcript
- [ ] CHK-P2-02 [P2] R35-002: `touchedPaths` gated on confirmed persist — verified by grep + test
- [ ] CHK-P2-03 [P2] R34-001: `producerMetadataWritten` documented OR removed (attempted-write vs durable) — verified by inline comment or removal grep

### hook-state.ts

- [ ] CHK-P2-04 [P2] R4-003: Recent-state authority uses `state.updatedAt` not mtime — verified by test
- [ ] CHK-P2-05 [P2] R23-003: Compact-cache expiry distinct from absence — verified by compact cache state test

### reconsolidation-bridge.ts

- [ ] CHK-P2-06 [P2] R11-004 + R12-003: Structured warning on scope-filter drop — verified by warning test
- [ ] CHK-P2-07 [P2] R16-002: Malformed vector-search rows rejected — verified by test
- [ ] CHK-P2-08 [P2] R19-002: Assistive failures surface machine-readable signal — verified by response contract test

### post-insert.ts

- [ ] CHK-P2-09 [P2] R11-005: `summary`/`graphLifecycle` skip status — verified by test (via M13)
- [ ] CHK-P2-10 [P2] R12-005 (dedup R14-004): Density-guard skip status — verified by test (via M13)
- [ ] CHK-P2-11 [P2] R17-002: Five-failure-types-unified issue resolved via `OperationResult<T>` — verified by type-check

### code-graph/query.ts

- [ ] CHK-P2-12 [P2] R3-003: Edge trust aggregated (not first-edge-only) — verified by test
- [ ] CHK-P2-13 [P2] R12-002 + R14-002 (dedup): Unsupported `edgeType` rejected — verified by test (QW #8)
- [ ] CHK-P2-14 [P2] R13-003: Outline subject path validated — verified by test (QW #13)
- [ ] CHK-P2-15 [P2] R17-001: Dangling edges flagged as corruption — verified by test (QW #17)
- [ ] CHK-P2-16 [P2] R18-001 + R20-003 (dedup): Query-level `detectorProvenance` either computed per-query OR omitted — verified by response contract test
- [ ] CHK-P2-17 [P2] R19-001: Transitive traversal dangling nodes surfaced — verified by test

### graph-metadata-parser.ts

- [ ] CHK-P2-18 [P2] R18-002 (subset of P0-C): Original validation errors preserved — verified by legacy-fallback test diagnostic output
- [ ] CHK-P2-19 [P2] R20-002 (subset of P0-C): Original timestamps preserved when available — verified by legacy-fallback test
- [ ] CHK-P2-20 [P2] R31-004 + R32-004 (dedup): Unique temp filenames — verified by grep + concurrent-write test

### shared-payload.ts

- [ ] CHK-P2-21 [P2] R9-002: Runtime validation of `SharedPayloadKind`/`producer` — verified by `T-TEST-07` plus runtime schema test

### hook-state.ts / session-resume.ts

- [ ] CHK-P2-22 [P2] R26-001: Missing→stale collapse removed from public contract via M8 — verified by `T-TEST-02` (migrated)
- [ ] CHK-P2-23 [P2] R26-002: `session_health` has structural-trust section — verified by health response test (QW #19)
- [ ] CHK-P2-24 [P2] R29-002: Startup collapses distinct rejection reasons — verified by `session-prime.ts` test

### /tmp/save-context-data.json hazard

- [ ] CHK-P2-25 [P2] R31-005, R32-005, R35-003, R36-003 (dedup): `/tmp/save-context-data.json` removed from 4 doc surfaces + `data-loader.ts` error text — verified by `grep -R '/tmp/save-context-data.json' .opencode/` returns zero (except this checklist or historical notes)

### Tests codifying degraded contracts (R25-001..R25-004, R26-001)

- [ ] CHK-P2-26 [P2] R25-001: `post-insert-deferred` test migrated — verified by `T-TEST-01`
- [ ] CHK-P2-27 [P2] R25-002: `code-graph-query-handler` test migrated — verified by `T-TEST-04`
- [ ] CHK-P2-28 [P2] R25-003: `graph-metadata-schema` test migrated — verified by `T-TEST-03`
- [ ] CHK-P2-29 [P2] R25-004 (consumer tests): `hook-state.vitest` schema version test — verified by `T-TEST-NEW-06`
- [ ] CHK-P2-30 [P2] R26-001: `structural-contract` test migrated — verified by `T-TEST-02`

### Domain 4 — P2 findings

- [ ] CHK-P2-31 [P2] R41-001 + R47-002 (dedup): `folder_state` / `populated` vocabulary aligned; two-vocabulary boundary commented — verified by `T-TEST-NEW-13`
- [ ] CHK-P2-32 [P2] R41-002 + R45-001 + R47-001 (dedup): Gate 3 prose trigger list replaced with typed classifier (S5 anchor) — verified by `T-TEST-NEW-14`, `T-TEST-NEW-15`
- [ ] CHK-P2-33 [P2] R42-001 + R43-002 + R44-003 (dedup): `when:` predicate typed grammar — verified by `T-TEST-NEW-19`
- [ ] CHK-P2-34 [P2] R42-002: `health_check()` compares two inventories — verified by new health test
- [ ] CHK-P2-35 [P2] R42-003: `automatable: boolean` on scenario metadata — verified by grep + runner test
- [ ] CHK-P2-36 [P2] R44-002: Keyword comment blocks captured in frontmatter parse — verified by skill_advisor_runtime test
- [ ] CHK-P2-37 [P2] R45-002: Ranking stability test — verified by `T-TEST-NEW-08`
- [ ] CHK-P2-38 [P2] R48-001 + R49-001 (dedup): Gate 3 triggers for save/memory — verified by `T-TEST-NEW-16`
- [ ] CHK-P2-39 [P2] R48-002 + R49-002 (dedup): `when:` separated from prose `after:` — verified by S7 asset-predicate suite
- [ ] CHK-P2-40 [P2] R50-002: Playbook runner rejects shorthand argument dialect — verified by playbook-runner dialect test

### P2 reconciliation / escape hatches

- [ ] CHK-P2-41 [P2] R10-002: Provenance escaping in `[PROVENANCE:]` wrapper (REQ-013) — verified by adversarial test with `]` / newline / bracket in `producer`
<!-- /ANCHOR:p2-findings -->

---

<!-- ANCHOR:test-migration-checklist -->
## Test Migration Verification (7 canonical + supporting)

- [ ] CHK-TEST-01 [P0] `post-insert-deferred.vitest.ts` migrated from all-true booleans to enum `'deferred'` — verified by diff review + tests pass
- [ ] CHK-TEST-02 [P0] `structural-contract.vitest.ts` migrated from collapsed vocabulary to distinct labels — verified by diff review + tests pass
- [ ] CHK-TEST-03 [P0] `graph-metadata-schema.vitest.ts` migrated to `{ ok, migrated, migrationSource }` shape — verified by diff review + tests pass
- [ ] CHK-TEST-04 [P1] `code-graph-query-handler.vitest.ts` migrated from hoisted fresh readiness to explicit fail-open branch — verified by diff review + tests pass
- [ ] CHK-TEST-05 [P0] `handler-memory-save.vitest.ts` migrated to enum status — verified by diff review + tests pass
- [ ] CHK-TEST-06 [P0] `hook-session-stop-replay.vitest.ts` migrated from disabled-autosave to enabled + failure injection — verified by diff review + tests pass
- [ ] CHK-TEST-07 [P0] `opencode-transport.vitest.ts` migrated to include missing/absent cases — verified by diff review + tests pass
- [ ] CHK-TEST-08 [P1] `hook-state.vitest.ts` extended with TOCTOU + all-or-nothing + torn-read cases — verified by new test names present
- [ ] CHK-TEST-09 [P0] `reconsolidation.vitest.ts` extended with two-concurrent-writer infra — verified by new test names present
- [ ] CHK-TEST-10 [P0] `reconsolidation-bridge.vitest.ts` extended with governed-scope mutation infra — verified by new test names present
- [ ] CHK-TEST-11 [P0] `test_skill_advisor.py` extended with `/spec_kit:deep-research` + intent_signals assertions — verified by new test names present
- [ ] CHK-TEST-12 [P1] `transcript-planner-export.vitest.ts` extended with YAML predicate cases — verified by new test names present
- [ ] CHK-TEST-13 [P0] `assistive-reconsolidation.vitest.ts` extended with competing-candidate insert — verified by new test names present
- [ ] CHK-TEST-14 [P1] `skill-graph-schema.vitest.ts` extended with compiler invariants — verified by new test names present

### New Adversarial Tests

- [ ] CHK-TEST-NEW-01 [P0] Two-concurrent-conflict save against same predecessor — verified by `reconsolidation-conflict-fork.vitest.ts`
- [ ] CHK-TEST-NEW-02 [P0] Mixed-snapshot scope filter test — verified by `reconsolidation-scope-mixed-snapshot.vitest.ts`
- [ ] CHK-TEST-NEW-03 [P0] TOCTOU cleanup → cold-start cascade — verified by `hook-state-toctou-cleanup.vitest.ts`
- [ ] CHK-TEST-NEW-04 [P0] Two-stop overlap transient zero-offset — verified by `session-stop-transient-offset.vitest.ts`
- [ ] CHK-TEST-NEW-05 [P0] Compact prime identity race — verified by `session-prime-identity-race.vitest.ts`
- [ ] CHK-TEST-NEW-06 [P0] HookState schema-version mismatch rejection — verified by `hook-state-schema-version.vitest.ts`
- [ ] CHK-TEST-NEW-07 [P1] `Function(...)` adversarial `lastJobId` injection — verified by `manual-playbook-runner-injection.vitest.ts`
- [ ] CHK-TEST-NEW-08 [P1] Ranking stability (deep-research vs review ≥0.10) — verified by `test_skill_advisor.py::test_ranking_stability`
- [ ] CHK-TEST-NEW-09 [P1] `/spec_kit:deep-research` → `sk-deep-research` routing — verified by `test_skill_advisor.py::test_subcommand_routing`
- [ ] CHK-TEST-NEW-10 [P1] Unilateral `conflicts_with` non-penalty — verified by `test_skill_advisor.py::test_conflicts_with_reciprocity`
- [ ] CHK-TEST-NEW-11 [P1] Health degraded under topology warnings — verified by `test_skill_advisor.py::test_health_degraded`
- [ ] CHK-TEST-NEW-12 [P1] Scenario parse=filter invariant — verified by `manual-playbook-runner-coverage.test.ts`
- [ ] CHK-TEST-NEW-13 [P1] Intake event carries both `folderState` + `startState` — verified by asset-predicate suite test
- [ ] CHK-TEST-NEW-14 [P1] Gate 3 false-positive `phase transition` read-only — verified by `gate3-classifier.test.ts::test_phase_transition_readonly`
- [ ] CHK-TEST-NEW-15 [P1] Gate 3 false-positive `synthesis phase` read-only — verified by `gate3-classifier.test.ts::test_synthesis_phase_readonly`
- [ ] CHK-TEST-NEW-16 [P1] Gate 3 true-positive `save context`/`save memory` — verified by `gate3-classifier.test.ts::test_save_context`
- [ ] CHK-TEST-NEW-17 [P1] Gate 3 true-positive `resume deep research` — verified by `gate3-classifier.test.ts::test_resume_deep_research`
- [ ] CHK-TEST-NEW-18 [P1] Arbitrary-length dependency cycle fails validate — verified by `test_skill_graph_compiler.py::test_long_cycle`
- [ ] CHK-TEST-NEW-19 [P1] YAML `when:` grammar rejects untyped string literals — verified by asset-predicate suite
- [ ] CHK-TEST-NEW-20 [P1] Gate 3 true-positive `implement`/`rename` regardless of context — verified by `gate3-classifier.test.ts::test_implement_rename`
<!-- /ANCHOR:test-migration-checklist -->

---

<!-- ANCHOR:post-remediation -->
## Post-Remediation Verification

Runs at the very end of Phase 017, before declaring the 016 packet complete:

- [ ] CHK-VERIFY-01 [P0] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review --strict` exits 0 — verified by CI run
- [ ] CHK-VERIFY-02 [P0] Full TypeScript type-check passes — verified by `tsc --noEmit` exits 0
- [ ] CHK-VERIFY-03 [P0] Full Vitest suite passes — verified by `vitest run` exits 0 with zero failures
- [ ] CHK-VERIFY-04 [P0] Python test suite passes — verified by `pytest` exits 0
- [ ] CHK-VERIFY-05 [P0] `skill_graph_compiler.py --validate-only` emits zero new warnings — verified by CI log diff
- [ ] CHK-VERIFY-06 [P0] `grep -R 'new Function(' .opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` returns zero — verified by repo-wide grep
- [ ] CHK-VERIFY-07 [P0] `grep -R '/tmp/save-context-data.json' .opencode/` returns zero matches in code/docs (only matches allowed in historical notes / this checklist) — verified by grep
- [ ] CHK-VERIFY-08 [P0] `health_check()` in live repro returns `status: "degraded"` when topology warnings present — verified by manual CLI invocation
- [ ] CHK-VERIFY-09 [P0] `memory_save` / `session_bootstrap` / `session_resume` / `session_health` responses carry `live` / `stale` / `absent` / `unavailable` values appropriately; no self-contradictory pairs — verified by `structural-contract.vitest.ts` + manual inspection of 3 live session lifecycles
- [ ] CHK-VERIFY-10 [P0] All 4 P0 composite candidate attack scenarios (CHK-P0-A-09, CHK-P0-B-05, CHK-P0-C-05, CHK-P0-D-05) blocked by tests — verified by CI
- [ ] CHK-VERIFY-11 [P1] Watch-priority-1 resolved: either (a) confirmed non-P0 with `command-spec-kit` Gate 3 evidence, or (b) upgraded to P0-E and remediated via S4/A0 + A2 — verified by ADR or CHK-P0-E entry in follow-up packet
- [ ] CHK-VERIFY-12 [P1] Watch-priority-2 contained: typed step executor in place; adversarial `lastJobId` test passes — verified by CHK-TEST-NEW-07
- [ ] CHK-VERIFY-13 [P1] Every finding in `findings-registry.json` has either (a) a `closing_commit_sha` field populated, or (b) a `deferred_reason` string — verified by script check (could be a tiny `jq` one-liner)
- [ ] CHK-VERIFY-14 [P0] `implementation-summary.md` written with commit-by-commit finding closure and list of attack-scenario tests — verified by file existence + content inspection
- [ ] CHK-VERIFY-15 [P1] Parent 026 `spec.md` updated with 016 completion status — verified by diff
<!-- /ANCHOR:post-remediation -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-DOC-01 [P1] `implementation-summary.md` written with remediation narrative — verified by existence + content review
- [ ] CHK-DOC-02 [P1] Parent 026 spec.md updated with 016 entry (completion status, links) — verified by diff
- [ ] CHK-DOC-03 [P1] `description.json` status updated to `implemented` (from `ready_for_implementation` during implementation, from `planning` pre-Stage-2) — verified by JSON inspection
- [ ] CHK-DOC-04 [P1] `graph-metadata.json` status reflects final state — verified by JSON inspection
- [ ] CHK-DOC-05 [P2] Review findings archived in appropriate subfolder — verified by file tree inspection
- [ ] CHK-DOC-06 [P1] Cross-references from systemic-themes narrative (if created) to `FINAL-synthesis-and-review.md` §5 — verified by inspection
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-FILE-01 [P1] Temp files in `scratch/` only — verified by repo tree inspection
- [ ] CHK-FILE-02 [P1] `scratch/` cleaned before completion — verified by `ls scratch/` showing only intended artifacts
- [ ] CHK-FILE-03 [P1] Canonical spec docs (spec, plan, tasks, checklist, implementation-summary, description.json, graph-metadata.json) present — verified by file existence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Preflight (CHK-PRE-*) | 9 | 3/9 |
| P0 Composite (CHK-P0-A/B/C/D-*) | 23 | 0/23 |
| P1 Findings (CHK-P1-*) | 42 | 0/42 |
| P2 Findings (CHK-P2-*) | 41 | 0/41 |
| Test Migration Canonical (CHK-TEST-01..14) | 14 | 0/14 |
| New Adversarial Tests (CHK-TEST-NEW-01..20) | 20 | 0/20 |
| Post-Remediation (CHK-VERIFY-*) | 15 | 0/15 |
| Documentation (CHK-DOC-*) | 6 | 0/6 |
| File Organization (CHK-FILE-*) | 3 | 0/3 |
| **Total** | **173** | **3/173** |

**P0 verification items total: 67** (P0-composite + P0 within P1 + P0 within test + post-remediation P0). All 67 must be verified with evidence before claiming 016 remediation done.

**Verification Date**: 2026-04-16 (Stage 2 rewrite; verification starts Phase 017 Week 1)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Authoritative Research**: `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`
- **Findings Registry**: `../research/016-foundational-runtime-deep-review/findings-registry.json`
<!-- /ANCHOR:cross-refs -->
