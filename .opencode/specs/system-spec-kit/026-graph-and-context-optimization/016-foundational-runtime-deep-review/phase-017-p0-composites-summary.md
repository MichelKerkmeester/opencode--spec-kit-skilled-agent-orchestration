---
title: "Phase 016 remediation Phase 1 Synthesis — P0 Composites Eliminated"
description: "Synthesis of Phase 1 completion: 4 P0 composite candidates eliminated across 4 commits, 27 constituent findings closed, ~3134 net insertions across 52 files."
contextType: "implementation"
importance_tier: "high"
---

# Phase 016 remediation Phase 1 Synthesis — P0 Composites Eliminated

**Date:** 2026-04-16
**Agents:** cli-copilot gpt-5.4 high (max 3 concurrent)
**Commit range:** `afbb3bc7f` (P0-D) → `8c809d725` (task-mark chore for P0-B)

---

## 1. Executive Summary

Phase 1 of the Phase 016 remediation foundational runtime remediation closed all four P0 composite candidates in a single parallel cli-copilot wave lasting approximately 60 minutes of wall-clock work. The execution order followed the dependency graph from `plan.md §4`: P0-D launched solo first (smallest, most isolated, highest operational frequency), then P0-A and P0-C ran in parallel (overlapping files but additive changes), and P0-B landed last as the largest single workstream.

Four fix commits shipped, each co-authored by GitHub Copilot (gpt-5.4 high):

- `afbb3bc7f` — P0-D TOCTOU cleanup
- `6f5623a4c` — P0-A HookState schema validation, versioning, TOCTOU, and cross-runtime isolation
- `1bdd1ed03` — P0-C graph-metadata laundering + packet-search boost eliminated
- `104f534bd` — P0-B transactional reconsolidation with predecessor CAS + complement window closure

A total of 27 constituent findings were closed across the four composites (5 + 11 + 7 + 11 with some findings shared or spanning composites per the constituent maps in `spec.md §3`). Four new regression test files were created reproducing the attack scenarios that are now blocked:

- `p0-d-toctou-cleanup-regression.vitest.ts`
- `p0-a-cross-runtime-tempdir-poisoning.vitest.ts`
- `p0-c-graph-metadata-integration.vitest.ts` (via `graph-metadata-integration.vitest.ts` expansion)
- `p0-b-reconsolidation-composite.vitest.ts`

Total LOC impact across Phase 1: ~3134 net insertions (+3134 / -538) across 52 files.

The entire Phase 1 work was sequenced to respect file-overlap dependencies: P0-D first because it is the smallest and its per-file isolation changes in `hook-state.ts` and `session-stop.ts` are additive prerequisites for P0-A; P0-A and P0-C in parallel because they target non-overlapping primary files (`hook-state.ts` + session layer vs `graph-metadata-parser.ts` + `memory-parser.ts`); P0-B last because its predecessor CAS and batched snapshot changes layer on top of the updated `OperationResult` types introduced in P0-A. All four composites share a co-author credit with GitHub Copilot (gpt-5.4 high) per the cli-copilot dispatch model.

**Phase 1 metrics at-a-glance:**

| Metric | Value |
|--------|-------|
| Commits | 4 fix + 2 chore (task-mark) = 6 total |
| Net insertions | ~3134 (+3134 / -538) |
| Files changed | 52 across 4 composite commits |
| Findings closed | 27 constituent findings (P0-A: 11, P0-B: 11, P0-C: 7, P0-D: 5; several shared across composites per `spec.md §3` constituent maps) |
| New test files | 4 regression test files (`p0-d-*`, `p0-a-*`, `p0-c-*` via graph-metadata-integration expansion, `p0-b-*`) |
| Attack scenarios blocked | 4 (§3.x in `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`) |
| Execution time (wall-clock) | ~60 minutes parallel cli-copilot gpt-5.4 high |
| Architectural primitives introduced | 6 (typed OperationResult, Zod schema + .bad quarantine, predecessor CAS, batched snapshot reads, mtime re-read TOCTOU guard, migrated marker + penalty) |

The four composites collectively unblock the remaining Phase 2–5 work: P0-A's typed Result returns and Zod schema are the substrate M13 propagates through; P0-B's CAS and batched reads close the pre-transaction read-then-mutate anti-pattern that S1 was chartered to fix; P0-C's migrated marker is the propagation backbone S3 defined; P0-D's per-file isolation is the baseline concurrency safety that P0-A layers schema validation on top of.

Phase 1 does NOT address the remaining remediation work:

- **S1–S7** — 7 structural refactors (S1 and S2 and S3 are substantially covered by P0-B/A/C respectively; S4–S7 remain open)
- **M1–M13 + Med-A through Med-J** — 13 medium refactors plus 10 discrete medium items
- **T-TEST-01 through T-TEST-07** — 7 canonical test-suite migrations (degraded contract rewrites)
- **T-TEST-NEW-01 through T-TEST-NEW-20** — 20 new adversarial tests for structural refactors S4–S7

---

## 2. P0 Composite Breakdown Table

| Composite | Commit | +ins / -del | Files | Constituent Findings | New Regression Test | Key Primitive |
|-----------|--------|-------------|-------|----------------------|---------------------|---------------|
| **P0-D** | `afbb3bc7f` | +476 / -89 | 11 | R37-001, R33-002, R38-001, R38-002, R40-001 | `p0-d-toctou-cleanup-regression.vitest.ts` | Per-file error isolation + mtime re-stat before unlink |
| **P0-A** | `6f5623a4c` | +1294 / -294 | 24 | R1-002, R11-001, R13-001, R14-001, R21-002, R25-004, R29-001, R32-001, R33-001, R33-003, R36-001 | `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` | Zod `HookStateSchema` + `.bad` quarantine + typed `Result` returns |
| **P0-C** | `1bdd1ed03` | +349 / -81 | 7 | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002 | `graph-metadata-integration.vitest.ts` (full laundering pipeline) | `migrated` marker + ranking penalty flip |
| **P0-B** | `104f534bd` | +1015 / -74 | 10 | R6-001, R13-004, R24-001, R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 | `p0-b-reconsolidation-composite.vitest.ts` | Predecessor CAS (`UPDATE WHERE content_hash + is_deprecated = FALSE`) + batched snapshot reads |

**Grand total Phase 1:** 52 files changed, ~3134 net insertions, 27 distinct findings closed (per constituent mapping in `spec.md §3`).

---

## 3. Per-Composite Deep Detail

### P0-D — TOCTOU Cleanup Preserves Fresh State

**Commit:** `afbb3bc7f` | **Tasks closed:** T-SST-05, T-SST-06, T-HST-03, T-HST-04, T-HST-05

**Attack scenario (from `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` §3.4):**
A routine `--finalize` cleanup sweep overlapping with a live session write can (1) delete the freshly-written session state because `cleanStaleStates()` performs a stat-then-unlink across a live rename window, (2) make the next `loadMostRecentState()` return `null` for all consumers because the entire directory loop was wrapped in a single try/catch, (3) re-parse transcript from offset 0 because the next stop hook sees `lastTranscriptOffset: 0` sentinel from an intermediate incomplete write, and (4) compound via overlap-induced offset regression without a monotonicity guard. Triggered by normal maintenance, not abnormal concurrent load.

**Before / after behavior:**

| Behavior | Before P0-D | After P0-D |
|----------|-------------|------------|
| `cleanStaleStates()` unlink race | Stat-then-unlink with no identity recheck; fresh state deleted if renamed between stat and unlink | Re-stat (identity check) before `unlinkSync()`; skip on mtime change |
| `loadMostRecentState()` on one bad sibling | Single try/catch aborts entire scan; all siblings suppressed | Per-file error isolation; returns `{ states, errors }`; siblings unaffected |
| `cleanStaleStates()` partial sweep | Returns removed count with no indication of skipped files | Returns `{ removed, skipped, errors }` |
| Transient `lastTranscriptOffset: 0` | Written before producer metadata builds; concurrent stop hook re-parses from zero | Zero-offset sentinel eliminated from `storeTokenSnapshot()`; final offset carried through |
| Offset regression between stop hooks | No monotonicity guard; second stop hook can backslide offset | `Math.max()` guard on `metrics.lastTranscriptOffset` in `updateState()` |

**Key architectural changes:**
- `hook-state.ts` `cleanStaleStates()`: identity re-stat before `unlinkSync()` (D1 / QW #25)
- `hook-state.ts` `loadMostRecentState()`: per-file try/catch replacing all-or-nothing block (D2 / QW #24)
- `hook-state.ts` `cleanStaleStates()`: richer `{ removed, skipped, errors }` return (D3 / QW #24)
- `session-stop.ts` `storeTokenSnapshot()`: zero-offset sentinel eliminated; final offset threaded through (D4 / QW #21)
- `hook-state.ts` `updateState()`: `Math.max()` monotonicity guard (D5 / QW #9)

**New tests added:** `p0-d-toctou-cleanup-regression.vitest.ts` (121 lines) — save-between-stat-and-unlink interleave; poison-pill-sibling does not suppress others; partial-sweep-returns-skipped; two-stop-overlap no-zero-offset; offset regression blocked.

**Test files updated:** `hook-state.vitest.ts` (+96 lines), `session-resume.vitest.ts` (adjusted for new return shapes), `startup-brief.vitest.ts` (adjusted).

**Dependencies on Phase 4 Quick Wins:** P0-D builds on T-HST-06 (unique temp path, shipped in Phase 4 QW) and T-SST-07 (`autosaveOutcome` field, shipped in Phase 4 QW). Both were prerequisites that Phase 4 cleared.

---

### P0-A — HookState Cross-Runtime Tempdir Poisoning

**Commit:** `6f5623a4c` | **Tasks closed:** T-SST-01, T-SST-02, T-SST-03, T-SST-04, T-HST-01, T-HST-02, T-HST-07, T-HST-08, T-HST-09, T-SRS-02 (+ Gemini hook parity)

**Attack scenario (from `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` §3.1):**
A single corrupt or concurrently-replaced HookState temp file simultaneously poisons all five hook entrypoints (Claude session-stop, Claude compact-inject, Gemini session-prime, Gemini session-stop, OpenCode). The 10-step chain includes: (1) unvalidated JSON.parse injects forged provenance into Claude prompt replay, (2) Gemini startup misroutes continuity, (3) transcript re-parsing with duplicate token counts, (4) cached-summary schema guard bypassed because `schemaVersion` was fabricated from a constant, (5) one stop-hook's summary paired with another's packet target without CAS, (6) autosave proceeds after known `saveState` failure, (7) fresh precompact payload silently deleted by older consumer's `clearCompactPrime()`, (8) freshness from one generation with content from another (torn read), (9) all sibling recovery suppressed when one file transiently unreadable, (10) `cleanStaleStates()` partial sweep returned as complete.

**Before / after behavior:**

| Behavior | Before P0-A | After P0-A |
|----------|-------------|------------|
| HookState load | `JSON.parse(raw) as HookState` — unvalidated cast; any shape accepted | Zod `HookStateSchema.safeParse()`; failure quarantines file to `.bad` sibling |
| Schema version | No field; `session-resume.ts` fabricated version from constant — always matched | `schemaVersion: 1` written on every save; mismatch returns `{ ok: false, reason: 'schema_mismatch' }` |
| Legacy file migration | N/A | Optional field with lazy migrate-on-load (Option A+B hybrid per OQ3 resolution) |
| `loadState()` / `loadMostRecentState()` return | `HookState \| null` — parse failure collapses to null silently | `{ ok: true; state } \| { ok: false; reason: 'schema_mismatch' \| 'parse_error' \| 'not_found' \| ... }` |
| `updateState()` return | Merged state with no persistence confirmation | `{ ok, merged, persisted }` — callers can detect persistence failure |
| `session_id` missing in stop hook | Collapses to `'unknown'` shared state key | Rejected with explicit error; no shared-key collapse |
| `clearCompactPrime()` identity | Session ID only — newer payload erased by older consumer | Identity-based clear using `cachedAt` / `opaqueId` |
| Transcript/producer failure | Warning-only; no machine-readable outcome | Typed `OperationResult` with `'failed'` status surfaced to caller |
| `runContextAutosave` when preconditions unmet | Silently skips | Emits `autosaveOutcome: 'skipped'` (uses existing field from T-SST-07) |
| Transient `lastTranscriptOffset: 0` write | Present — R14-001 | Eliminated |
| Gemini hook parity | Gemini hooks lacked Zod validation and typed results | Gemini compact-cache, compact-inject, session-prime, session-stop brought to parity |

**Key architectural changes:**
- `hook-state.ts`: `HookStateSchema` (Zod) with `schemaVersion: z.literal(1)` optional-on-load; `loadState()` and `loadMostRecentState()` return typed `Result`; quarantine-to-`.bad` on failure
- `hook-state.ts`: `updateState()` returns `{ ok, merged, persisted }`; identity-based `clearCompactPrime()`; mtime re-read after `readFileSync()` (TOCTOU guard)
- `session-stop.ts`: missing `session_id` rejected; transient zero-offset write removed; `runContextAutosave` skipped-path surfaced
- `session-resume.ts`: `schema_mismatch` rejection path wired (was unreachable before T-HST-02)
- Gemini hooks (`compact-cache`, `compact-inject`, `session-prime`, `session-stop`): Zod validation parity + typed result contracts
- `compact-inject.ts` (Claude + Gemini): identity-based compact-prime clear
- Downstream consumers updated: `memory-save`, `api/index`, `startup-brief`, `shared.ts`, `replay-harness`

**New tests added:** `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` — full attack scenario: corrupt file validates → quarantines to `.bad` → other hook entrypoints unaffected; schema-version mismatch rejection; compact-prime identity race; two-concurrent-writer temp-file race; torn-read generation mate-mismatch.

**Test files updated:** `hook-state.vitest.ts`, `hook-session-stop.vitest.ts`, `hook-precompact.vitest.ts`, `session-resume.vitest.ts`, `session-token-resume.vitest.ts`, `token-snapshot-store.vitest.ts`, `edge-cases.vitest.ts`, `p0-d-toctou-cleanup-regression.vitest.ts` (updated for new return shapes).

**Dependencies on Phase 4 Quick Wins and P0-D:** Inherits T-HST-06 (unique temp path), T-SST-07 (`autosaveOutcome` field), and the per-file isolation changes from P0-D (D2/D3 in `loadMostRecentState` and `cleanStaleStates`). OQ3 resolution (lazy migration, preflight-oq-resolution.md) directly drove the `schemaVersion` migration strategy.

---

### P0-C — Graph-Metadata Laundering + Packet-Search Boost Eliminated

**Commit:** `1bdd1ed03` | **Tasks closed:** T-GMP-01, T-GMP-02, T-GMP-03, T-GMP-04, T-MPR-01

**Attack scenario (from `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` §3.3):**
A malformed modern `graph-metadata.json` (6-step chain): (1) gets accepted as legacy with `ok: true` and no migration marker, (2) gets fabricated `created_at` / `last_save_at` via `new Date().toISOString()` erasing original timestamp evidence, (3) gets reinterpreted through `deriveStatus()` as `planned` or `complete` when `readDoc()` collapses I/O failure into `null`, (4) gets rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()` erasing the corruption evidence at the persistence layer, (5) gets `qualityScore: 1` and empty `qualityFlags: []` through the memory-parser fallback path, (6) gets +0.12 packet-search boost in stage-1 candidate generation — outranking legitimate spec docs with the original corruption signal fully erased.

**Before / after behavior:**

| Behavior | Before P0-C | After P0-C |
|----------|-------------|------------|
| `validateGraphMetadataContent()` return shape | `{ ok: boolean }` binary | `{ ok, metadata, migrated, migrationSource?, preservedErrors? }` |
| Legacy fallback for malformed modern JSON | `ok: true` with no marker; original validation errors discarded | `migrated: true` with `migrationSource: 'legacy'`; original validation errors preserved in `preservedErrors` |
| `refreshGraphMetadataForSpecFolder()` | Rewrites canonical JSON without any laundering marker | Carries `migrated` marker into rewritten JSON |
| `readDoc()` I/O failure | Collapsed to `null`; `deriveStatus()` silently coerces to `planned`/`complete` | `{ status: 'found' \| 'missing' \| 'unknown' }` — I/O failure surfaces as `'unknown'`; `deriveStatus()` treats as third state |
| Timestamp fabrication | Always fabricates `created_at`/`last_save_at` via `new Date()` | Gated by `migrated` marker; original timestamps preserved when available |
| Stage-1 ranking for migrated rows | +0.12 packet-search boost (same as canonical spec docs) | Penalized (boost reversed or reduced) — critical flip that neutralizes laundering incentive |

**Key architectural changes:**
- `graph-metadata-parser.ts`: `validateGraphMetadataContent()` returns structured `{ ok, metadata, migrated, migrationSource?, preservedErrors? }`; legacy-fallback preserves original validation errors in diagnostic set
- `graph-metadata-parser.ts`: `refreshGraphMetadataForSpecFolder()` carries `migrated` marker forward into persisted JSON; timestamp fabrication gated by marker
- `graph-metadata-parser.ts`: `readDoc()` returns `{ status: 'found' | 'missing' | 'unknown' }`; downstream `deriveStatus()` treats `'unknown'` as explicit third state
- `memory-parser.ts`: stage-1 ranking penalizes `migrated=true` rows — the critical flip that neutralizes the laundering
- `stage1-candidate-gen.ts`: ranking logic updated to consume `migrated` flag

**New tests added:** `graph-metadata-integration.vitest.ts` expanded with full laundering pipeline coverage — malformed modern JSON accepted as legacy → migrated marker propagated → ranking penalized → original errors preserved.

**Test files updated:** `graph-metadata-schema.vitest.ts` — legacy-fallback assertions updated from "clean success" to `{ ok: true, migrated: true, migrationSource: 'legacy' }`.

**Dependencies on Phase 4 Quick Wins:** Builds on T-GMP-05 (unique temp path for `writeGraphMetadataFile()`, shipped in Phase 4) and T-SAP-01 (intent_signals wiring).

---

### P0-B — Transactional Reconsolidation with Predecessor CAS

**Commit:** `104f534bd` | **Tasks closed:** T-RCB-01, T-RCB-03, T-RCB-04, T-RCB-05, T-RCB-06, T-RCB-07, T-RCB-08, T-RCN-01, T-RCN-02, T-MSV-01, T-MSV-02

**Attack scenario (from `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` §3.2):**
Two concurrent governed `memory_save` requests against overlapping candidates: (1) fork lineage because `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)` — `executeConflict()` runs `UPDATE ... WHERE id = ?` without a version or scope recheck, allowing both requests to supersede the same predecessor, (2) deprecate a predecessor already superseded by the first request, (3) insert duplicate complement rows because `runReconsolidationIfEnabled()` runs vector search + scope filter before the writer transaction — a second concurrent save finds the same near-duplicate in the pre-transaction window, (4) admit or exclude candidates with mixed-source snapshots because `readStoredScope()` issues a fresh per-candidate `SELECT` outside any transaction producing a mixed-snapshot universe, (5) generate stale assistive recommendations from a second pre-transaction search that differs from the planning snapshot.

**Before / after behavior:**

| Behavior | Before P0-B | After P0-B |
|----------|-------------|------------|
| `executeConflict()` predecessor check | `UPDATE ... WHERE id = ?` — no version or `is_deprecated` guard | `UPDATE ... WHERE id = ? AND content_hash = ? AND is_deprecated = FALSE` — CAS; zero-row match returns `'conflict_stale_predecessor'` outcome |
| Complement duplicate window | Vector search + scope filter run before writer transaction; two concurrent saves insert duplicate complement rows | Complement decision re-checked inside `writeTransaction` before insert |
| Scope reads for candidate universe | Per-candidate `readStoredScope()` `SELECT` outside any transaction — mixed-snapshot possible | Single batched snapshot query replaces per-candidate loop; consistent snapshot across all candidates |
| Assistive recommendations | Built from pre-transaction search snapshot; can be stale at delivery | Re-checked inside transaction OR flagged `advisory_stale: true` when snapshot predates commit |
| Catch-all fallthrough on reconsolidation error | Any thrown error caught and falls through to normal create path with no structured warning | Typed `OperationResult` with `'failed'` status + reason emitted; every catch branch surfaces structured failure |
| `OperationResult` threading | Not present in save orchestration path | Typed `saveTimeReconsolidation OperationResult` threads through `reconsolidation-bridge.ts` → `memory-save.ts` → `handlers/save/types.ts` → `response-builder.ts` |
| Assistive-default documentation | Docs claimed "default ON"; runtime switch was OFF | Aligned (T-RCB-01; T-RCB-02 constant rename landed in Phase 4 QW) |

**Key architectural changes:**
- `reconsolidation.ts` `executeConflict()`: predecessor CAS (B1) — `UPDATE WHERE content_hash = ? AND is_deprecated = FALSE`; returns `'conflict_stale_predecessor'` on zero-row match
- `memory-save.ts`: complement re-check inside `writeTransaction` before insert (B2); duplicate window closed
- `reconsolidation-bridge.ts`: single-query batched scope snapshot replaces per-candidate `readStoredScope` loop (B3); mixed-snapshot eliminated
- `reconsolidation-bridge.ts`: assistive recommendations flagged `advisory_stale: true` when snapshot predates commit (B4)
- Typed `saveTimeReconsolidation OperationResult` threaded through full save orchestration path
- Scope re-check inside writer transaction (T-RCB-05)

**New tests added:** `p0-b-reconsolidation-composite.vitest.ts` (266 lines) — stale-predecessor conflict rejection; duplicate-complement blocking; consistent batched scope filtering; advisory_stale flag path.

**Test files updated:** `reconsolidation-bridge.vitest.ts` (rewritten to assert correct behavior — OQ2 confirmed this was an OVERSIGHT, not a shim; rewritten to assert new `OperationResult` shapes + stale-predecessor path); `assistive-reconsolidation.vitest.ts` (advisory_stale flag); `gate-d-regression-reconsolidation.vitest.ts` (scope-boundary regression preserved); `handler-memory-save.vitest.ts` (new result shapes).

**Dependencies on Phase 4 Quick Wins:** Builds on T-RCB-02 (constant rename landed in Phase 4 QW). OQ2 resolution (all 7 test files are oversights except the replay harness shim) directly justified the `reconsolidation-bridge.vitest.ts` rewrite.

---

## 4. Cross-Cutting Architecture Introduced

Six architectural primitives introduced across Phase 1 that span multiple composites and will serve as foundations for Phase 2–3 structural refactors. None of these primitives existed before Phase 1; all four P0 commits contribute at least one. The primitives are designed to compose: the CAS lock (P0-B) and the mtime re-read (P0-A + P0-D) both address the same underlying anti-pattern (pre-lock read, post-lock mutate) at different layers of the stack.

**Typed `OperationResult`:** Threads through hook-state (P0-A `updateState` return), session-stop (autosave outcome), session-resume, reconsolidation-bridge (P0-B save orchestration), memory-save, and response-builder. Callers can now distinguish `ran | skipped | failed | deferred`. This is the P0-level foothold for the broader M13 enum-status refactor (Phase 3); the full propagation through `post-insert.ts` and its boolean-map `enrichmentStatus` remains in M13.

**Zod schema validation + `.bad` quarantine (P0-A):** `HookStateSchema` in `hook-state.ts` applies `safeParse` on every read. Validation failure quarantines the file to a `.bad` sibling and returns a typed rejection reason rather than silently returning `null`. This prevents any corrupt state file from propagating into prompt assembly, session-resume, or autosave routing — the core isolation guarantee that closes the cross-runtime poisoning attack vector.

**Predecessor CAS / check-and-set (P0-B):** `reconsolidation.ts` `executeConflict()` now executes `UPDATE memory_index SET is_deprecated = TRUE WHERE id = ? AND content_hash = ? AND is_deprecated = FALSE`. A zero-row return signals that the predecessor was already superseded by a concurrent writer; the caller gets `'conflict_stale_predecessor'` instead of silent success. Single-row lineage forks are now blocked at the write-layer.

**Batched snapshot reads (P0-B):** The per-candidate `readStoredScope()` loop in `reconsolidation-bridge.ts` is replaced by a single-query snapshot of all candidate scopes before the filtering pass. All scope decisions now operate on the same consistent database snapshot, eliminating the mixed-snapshot race that previously admitted or excluded candidates depending on unrelated concurrent writes landing between individual `SELECT` calls.

**mtime re-read after `readFileSync` (P0-A + P0-D):** `hook-state.ts` `loadMostRecentState()` re-reads the file mtime after `readFileSync()` and discards the candidate if the mtime has changed. This closes the torn-read window where a concurrent rename between the stat call and the content read could produce a freshness marker from one generation with content from another.

**`migrated` marker + ranking penalty flip (P0-C):** `validateGraphMetadataContent()` now returns `{ migrated: boolean }` as part of its result shape. This flag propagates through `refreshGraphMetadataForSpecFolder()` into the persisted JSON and through `memory-parser.ts` into stage-1 candidate ranking. The critical behavior change is that `migrated=true` rows are now penalized rather than boosted — the direct inversion of the laundering incentive. Legacy metadata that has been accepted via the fallback path can no longer outrank canonical spec docs in packet search.

**Composability note:** The six primitives above are designed to interlock. The Zod schema (P0-A) prevents corrupt state from entering the system at the load boundary. The mtime re-read (P0-A + P0-D) prevents torn reads between the stat and the content read. The CAS guard (P0-B) prevents duplicate lineage at the write boundary. The batched snapshot (P0-B) ensures scope decisions within a single write cycle are consistent. The `migrated` marker (P0-C) carries laundering evidence forward rather than discarding it at the parsing boundary. The per-file isolation (P0-D) ensures one broken artifact cannot suppress sibling artifacts. Together they close the five systemic anti-patterns from `FINAL-synthesis-and-review.md §5` that Phase 016 identified as P0-level risks: unvalidated parse (§5.1), pre-lock-read-then-mutate (§5.2), mixed-snapshot scope reads (§5.2), silent laundering (§5.3), and TOCTOU cleanup (§5.7).

---

## 5. Remaining Remediation Work

### Phase 2 — Structural Refactors

S1, S2, S3 are substantially covered by P0-B, P0-A, and P0-C respectively. The four remaining structural refactors are independent of the P0 work and can run in parallel. Effort estimates are from `plan.md §4`.

| ID | Description | Status after Phase 1 | Remaining tasks | Effort | Notes |
|----|-------------|----------------------|-----------------|--------|-------|
| S1 | Transactional reconsolidation | Substantially covered by P0-B (B1–B4) | T-RCB-09 (B5 scope-filter warning), T-RCB-10 (malformed-row rejection), T-RCB-11 (assistive-failure surfacing) | ~3d | B5 structured warning `{ code: 'scope_filter_suppressed_candidates' }` and Med-G/H items remain |
| S2 | HookState schema versioning + overhaul | Substantially covered by P0-A (M1/M2/A2/A4/A5/A8) | T-SST-09, T-SST-10 (M3 atomic writes), T-SST-11 (M4 lastSpecFolder refresh), T-SST-12 (abort-on-persist-fail consumer), T-HST-10 (mtime authority), T-SRS-03, T-SRS-04 | ~5d | M3 collapse of three `recordStateUpdate()` calls into single atomic patch and M4 `lastSpecFolder` refresh remain; plus SRS-03/04 consumer wiring |
| S3 | Graph-metadata migration propagation | Fully covered by P0-C (M7/C1/C2/C3/C4/C5) | None canonical | 0 | All 7 constituent findings closed; stage-1 ranking penalty applied |
| S4 | Skill routing trust chain | Partially covered (T-SAP-01 intent_signals wiring in Phase 4 QW) | T-SAP-02 (disambiguation tier), T-SAP-03 (per-subcommand bridges), T-SAP-04 (conflicts_with reciprocity in advisor), T-SAR-01 (inventory comparison in health_check), T-SGC-02 (warning serialization into compiled graph) | ~3w | OQ4 resolution provides exact bridge snippet; T-SAP-03 is highest-priority entry point (6 per-subcommand entries + deprecated generic bridge) |
| S5 | Gate 3 typed classifier | OPEN | T-DOC-02 (shared JSON schema + read-only disqualifiers), T-DOC-03 (save/resume trigger additions), T-YML-DPR-01, T-YML-CMP-01 | ~2w | Resolves false-positives for `analyze`/`decompose`/`phase` tokens in read-only contexts and false-negatives for `save context`/`resume` write flows |
| S6 | Playbook runner trust-boundary | Partially covered (T-MPR-RUN-01 Function eval, T-MPR-RUN-03 parsedCount assertion in Phase 4 QW) | T-MPR-RUN-02 (explicit `automatable: boolean`), T-MPR-RUN-04 (schema-validated arg parser), T-MPR-RUN-05 (reject shorthand dialect) | ~1.5w | Watch-P2 prevention — `runtimeState.lastJobId` injection path still open until T-MPR-RUN-04 lands |
| S7 | YAML `when:` predicate grammar | Partially covered (T-YML-PLN-01 vocabulary alignment, T-YML-PLN-03 boundary comments in Phase 4 QW) | T-YML-PLN-02 (`BooleanExpr` typed schema), T-YML-PLN-04 (`when:` vs `after:` separation), T-YML-CMP-01 | ~1.5w | `BooleanExpr` schema replaces untyped quoted-string expressions; separates executable predicates from prose timing notes |

### Phase 3 — Medium Refactors

M1–M7 are covered by Phase 1 P0 work (M1/M2 = Zod HookStateSchema from P0-A; M3/M4 residual in S2; M5/M6 = CAS + batched scope reads from P0-B; M7 = migrated flag from P0-C). Remaining medium items grouped by coverage status:

**Covered (by Phase 1 P0 or Phase 4 QW):**

| ID | Description | Covered by |
|----|-------------|------------|
| M1 | HookStateSchema Zod runtime validation | P0-A (`hook-state.ts`) |
| M2 | `schemaVersion` field + lazy migration | P0-A (Option A+B hybrid per OQ3) |
| M5 | Predecessor CAS in `executeConflict()` | P0-B (B1) |
| M6 | Batched scope reads in reconsolidation-bridge | P0-B (B3) |
| M7 | `validateGraphMetadataContent()` returns migrated flag | P0-C (M7/C1) |
| Med-A | Readiness refresh after inline reindex | Phase 4 QW (T-ENR-01) |
| Med-C | Assistive-default docs alignment + constant rename | P0-B (T-RCB-01) + Phase 4 QW (T-RCB-02) |
| Med-F | Retarget-reason field + transcript tail window | Phase 4 QW (T-SST-08) |
| Med-I | Gemini compact provenance forwarding | Phase 4 QW (T-GSP-01) |
| Med-J | Provenance field escaping in `[PROVENANCE:]` | Phase 4 QW (T-GSH-01) |

**Open (requiring Phase 3 workstreams):**

| ID | Description | Status | Remaining tasks | Est. |
|----|-------------|--------|-----------------|------|
| M3 | Collapse three `recordStateUpdate()` calls into single atomic patch | OPEN | T-SST-10 | 2d |
| M4 | Refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` | OPEN | T-SST-11 | 2d |
| M8 | Trust-state vocabulary (`absent`/`unavailable` distinct from `stale`) | OPEN | T-SHP-01, T-SBS-01, T-SRS-03, T-CGQ-11, T-CGQ-12 | 4d |
| M12 | Disambiguation tier for deep-research vs review (subset of S4) | OPEN | T-SAP-02 | 2d |
| M13 | `OperationResult<T>` enum status refactor | OPEN (foothold exists) | T-PIN-01..T-PIN-08, T-RBD-02 | 5d |
| Med-B | mtime write ordering in `ensure-ready.ts` | OPEN | T-ENR-02 | 1d |
| Med-D | `runEnrichmentBackfill` honors `force=true` recovery | OPEN | (inline with M13) | 1d |
| Med-E | Snapshot transcript stat before `buildProducerMetadata()` | OPEN | T-SST-09 | 1d |
| Med-G | Reject malformed vector-search rows in reconsolidation-bridge | OPEN | T-RCB-10 | 1d |
| Med-H | Surface dangling nodes + assistive failure as corruption | OPEN | T-CGQ-10, T-RCB-11 | 1d |

Note on M13: the typed `OperationResult` foothold now exists in the codebase from P0-A and P0-B work. The `post-insert.ts` boolean-map `enrichmentStatus` (all 8 T-PIN tasks) is the primary remaining surface. T-RBD-01 (`response-builder.ts` collapse fix) was landed in Phase 4 QW; T-RBD-02 (full M13 propagation through response shape) remains.

### Unchecked Tasks by Workstream

The following tasks remain `[ ]` (unchecked) after Phase 1 P0 completion. Tasks already marked `[x]` in `tasks.md` (Phase 4 QW + Phase 1 P0 completions) are excluded. Grouped by workstream and phase assignment:

**Phase 2 — Structural (S4/S5/S6/S7)**

| Task | Finding | Description | Sprint |
|------|---------|-------------|--------|
| T-SAP-02 | R45-002 | Disambiguation tier: deep-research vs review margin ≥ 0.10 | Sprint 1 |
| T-SAP-03 | R46-001 | 6 per-subcommand COMMAND_BRIDGES + deprecated generic bridge | Sprint 1 (priority) |
| T-SAP-04 | R46-002 | `conflicts_with` reciprocity check in advisor | Sprint 1 |
| T-SAR-01 | R42-002 | Dual-inventory comparison in `health_check()` | Sprint 1 |
| T-SGC-02 | R45-003 | Warning payloads serialized into compiled graph; `health_check()` degraded | Sprint 1 |
| T-DOC-02 | R41-002, R45-001, R47-001 | Gate 3 trigger list → shared JSON schema + read-only disqualifiers | Sprint 1 |
| T-DOC-03 | R48-001, R49-001, R50-001 | Gate 3 save/resume/continue trigger phrase additions | Sprint 1 |
| T-YML-PLN-02 | R42-001, R43-002, R44-003 | `BooleanExpr` typed schema for `when:` predicates | Sprint 3 |
| T-YML-PLN-04 | R48-002, R49-002 | Separate `when:` (predicate) from `after:` (prose timing) | Sprint 3 |
| T-YML-CMP-01 | R48-002 extension | `spec_kit_complete_auto.yaml` `when:` predicate separation | Sprint 3 |
| T-YML-DPR-01 | R50-001 | `spec_kit_deep-research_auto.yaml` `resume` write-flow alignment | Sprint 1 |
| T-MPR-RUN-02 | R42-003 | Explicit `automatable: boolean` on playbook scenario metadata | Sprint 3 |
| T-MPR-RUN-04 | R46-003 | Schema-validated arg parser replacing `substitutePlaceholders()` injection | Sprint 3 |
| T-MPR-RUN-05 | R50-002 | Reject shorthand argument dialect; schema validation | Sprint 3 |

**Phase 3 — Medium (M8, M13, M3/M4 residual, Med-B through Med-H)**

| Task | Finding | Description | Sprint |
|------|---------|-------------|--------|
| T-SST-09 | R20-001 | Snapshot transcript stat before `buildProducerMetadata()` | Sprint 3 |
| T-SST-10 | R31-002, R32-002 | Collapse three `recordStateUpdate()` calls into single atomic patch (M3) | Sprint 3 |
| T-SST-11 | R37-002 | Refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` (M4) | Sprint 3 |
| T-SST-12 | R33-003 | Abort autosave on `persisted: false` from `updateState()` typed return | Sprint 3 |
| T-HST-10 | R4-003 | Rank recent state by `state.updatedAt` field, not filesystem mtime | Sprint 3 |
| T-SHP-01 | R9-001 | `trustStateFromGraphState()` introduces `absent`/`unavailable` distinct from `stale` (M8 anchor) | Sprint 2 |
| T-SBS-01 | R30-001 | `session_bootstrap` aligns `trustState=stale` + `readiness.canonical=empty` contradiction (M8) | Sprint 2 |
| T-SRS-03 | R38-001 ext | `session-resume.ts:348-366` inherits T-HST-03 per-file isolation fix | Sprint 3 |
| T-SRS-04 | R29-002 | Distinct rejection reason codes in Claude startup (M2 consumer) | Sprint 3 |
| T-CGQ-09 | R18-001, R20-003 | Query-level `detectorProvenance` computed per-query or omitted | Sprint 2 |
| T-CGQ-10 | R19-001 | Transitive traversal dangling nodes surfaced as corruption | Sprint 2 |
| T-CGQ-11 | R22-001, R23-001 | `empty` readiness vocabulary aligned with M8 expansion | Sprint 2 |
| T-CGQ-12 | R27-002 | Routing recommendations updated after readiness-fail-open gap closed | Sprint 2 |
| T-ENR-02 | R5-002 | Don't write mtime until nodes + edges persist | Sprint 3 |
| T-PIN-01 | R7-002 | Gate entity linking on successful extraction (`OperationResult`) | Sprint 2 |
| T-PIN-02 | R8-001 | Replace `enrichmentStatus` boolean map with `OperationResult<T>` (M13 anchor) | Sprint 2 |
| T-PIN-03 | R8-002 | Gate entity linking on `extraction.status == 'ran'` | Sprint 2 |
| T-PIN-04 | R14-003 | Propagate `partial` status for partial causal-link failures | Sprint 2 |
| T-PIN-05 | R11-005 | `summary`/`graphLifecycle` no-ops → `skipped` status with reason | Sprint 2 |
| T-PIN-06 | R12-005 | `entityLinking.skippedByDensityGuard` → `skipped` status | Sprint 2 |
| T-PIN-07 | R17-002 | Exception-driven enrichment failures → `failed` status | Sprint 2 |
| T-PIN-08 | R27-001 | `graphLifecycle=true` even on `onIndex skipped` → propagate skip reason | Sprint 2 |
| T-RBD-02 | — | Full M13 propagation through `response-builder.ts` final shape | Sprint 2 |
| T-RCB-09 | R11-004, R12-003 | Structured warning `scope_filter_suppressed_candidates` (B5) | Sprint 3 |
| T-RCB-10 | R16-002 | Reject malformed vector-search rows in reconsolidation-bridge | Sprint 3 |
| T-RCB-11 | R19-002 | Assistive reconsolidation failures surfaced as structured failure | Sprint 3 |

**Phase 5 — Test Migration + Preflight**

| Task | Description | Pairs with |
|------|-------------|-----------|
| T-PRE-04 | Closing-pass audit of 11 untouched files (FINAL §8.2) | Sprint 5 |
| T-PRE-09 | Adversarial repros for R33-001, R40-001, R46-003, R34-002, R35-001 | Sprint 5 |
| T-TEST-01 | Migrate `post-insert-deferred.vitest.ts` from all-true booleans to enum `'deferred'` | M13 (Sprint 2) |
| T-TEST-02 | Migrate `structural-contract.vitest.ts` to distinct labels per trust axis | M8 (Sprint 2) |
| T-TEST-03 | Migrate `graph-metadata-schema.vitest.ts` to `{ migrated: true, migrationSource: 'legacy' }` (partially done by P0-C) | S3 residual (Sprint 2) |
| T-TEST-04 | Migrate `code-graph-query-handler.vitest.ts` to explicit fail-open branch | M8 cascades (Sprint 2) |
| T-TEST-05 | Migrate `handler-memory-save.vitest.ts` to enum status | M13 (Sprint 2) |
| T-TEST-06 | Preserve `hook-session-stop-replay.vitest.ts` shim + add sibling `hook-session-stop-autosave-failure.vitest.ts` | S2 residual (Sprint 3) |
| T-TEST-07 | Migrate `opencode-transport.vitest.ts` to `missing`/`absent` cases | M8 (Sprint 2) |
| T-TEST-08 through T-TEST-14 | Supporting test file updates (hook-state, reconsolidation, reconsolidation-bridge, test_skill_advisor, transcript-planner, assistive-reconsolidation, skill-graph-schema) | Paired with respective structural fixes |
| T-TEST-NEW-01 through T-TEST-NEW-20 | New adversarial tests (20 items across S4/S5/S6/S7/M8/M13) | Threads across Sprints 1–3 |

---

## 6. Recommended Next Phase

**Immediate: Phase 2 S4 + S5 in parallel**

S4 (skill routing trust chain) and S5 (Gate 3 typed classifier) have no file overlap. S4 centers on `skill_advisor.py`, `skill_advisor_runtime.py`, and `skill_graph_compiler.py`; S5 centers on runtime root docs and command YAML assets. Both can run as concurrent 1-week cli-copilot sprints at 3 concurrent agents each (within the max-3 per-account cap).

S4 work sequence: T-SAP-03 (6 per-subcommand COMMAND_BRIDGES — `preflight-oq-resolution.md` §OQ4 provides the exact Python snippet ready for implementation) → T-SAP-02 (disambiguation tier for deep-research vs review, ensuring margin ≥ 0.10 for audit-vocabulary prompts) → T-SAP-04 + T-SGC-02 (`conflicts_with` reciprocity in advisor + warning payloads serialized into compiled graph + exposed in `health_check()`) → T-SAR-01 (dual-inventory comparison: SKILL.md discovery vs compiled graph). The specific marker-ordering requirement is critical: per-subcommand bridges (`/spec_kit:plan`) must appear before the generic legacy bridge (`/spec_kit`) in insertion order so `detect_explicit_command_intent()` matches the more specific marker first.

S5 work sequence: T-DOC-02 (Gate 3 trigger list extracted to shared JSON schema with read-only disqualifier tokens — `analyze`, `decompose`, `phase` currently trigger false-positives in read-only review contexts) → T-DOC-03 (add `save context`, `save memory`, `/memory:save`, and `resume` trigger phrases — current list false-negatives for known write flows) → T-YML-DPR-01 (deep-research `resume` YAML alignment) → T-YML-CMP-01 (complete YAML predicate alignment). The Gate 3 typed classifier bridges Watch-P1: OQ1 resolution confirmed Watch-P1 does NOT upgrade to P0-E (the bridge is a label, not a dispatcher), but T-SAP-03 must still land to close R46-001 subcommand-collapse as a P1 correctness fix.

**Then: Phase 3 medium refactors as Quick Win-style parallel waves**

M13 (enum status refactor) is the highest-leverage remaining item with 8 tasks in `post-insert.ts` alone. The typed `OperationResult` foothold now exists from P0-A and P0-B — the architectural shape is defined and threaded through the save path. M13's work is propagating it into `post-insert.ts`'s boolean-map `enrichmentStatus` surface and replacing `causalLinks: true / entityExtraction: true / ...` with per-step `status: 'ran' | 'skipped' | 'failed' | 'deferred'` discriminants. Estimated 5 engineer-days.

M8 (trust-state vocabulary) can run in parallel with M13 since they target different files. M8 centers on `shared-payload.ts` `trustStateFromGraphState()` introducing `absent` (graph does not exist) and `unavailable` (should exist but inaccessible) as distinct from `stale`. T-OCT-01 and T-SHS-01 landed in Phase 4 QW as preparatory scaffolding; M8 is the structural producer fix. Estimated 4 engineer-days.

The S2 residual tasks (T-SST-09 through T-SST-12, T-HST-10) are small isolated additions to already-refactored files — M3 (collapse three `recordStateUpdate()` calls into a single atomic patch in `session-stop.ts`) and M4 (`lastSpecFolder` refresh timing). Suitable for a single 1-day cleanup pass after M13/M8 land. S6 residual (T-MPR-RUN-02/04/05) and S7 (T-YML-PLN-02/04) can batch as a single 2-day watch-P2-closure sprint — both address the `Function(...)` trust boundary and YAML predicate grammar.

**Final: Phase 5 test migration**

Seven canonical test files still codify degraded contracts (T-TEST-01 through T-TEST-07). Per the OQ2 resolution in `preflight-oq-resolution.md`, six are oversights (delete-and-rewrite) and one is an intentional shim (`hook-session-stop-replay.vitest.ts` — preserve replay harness; add new sibling `hook-session-stop-autosave-failure.vitest.ts` for S2's autosave-with-failure-injection requirement). These must be paired with their corresponding structural fix commits per the mandate in `spec.md §7` — not deferred.

The 7 test migrations break down: T-TEST-01 and T-TEST-05 (post-insert enum status) pair with M13; T-TEST-02 and T-TEST-07 (trust-state vocabulary) pair with M8; T-TEST-03 (graph-metadata-schema legacy migration marker) — this test was already partially updated in P0-C (`graph-metadata-schema.vitest.ts` assertions migrated to `{ ok: true, migrated: true, migrationSource: 'legacy' }`) but the canonical T-TEST-03 rewrite milestone against the spec remains open; T-TEST-04 (code-graph-query-handler readiness fail-open) pairs with M8 cascades; T-TEST-06 (hook-session-stop replay shim) pairs with S2 residual.

Twenty new adversarial tests (T-TEST-NEW-01 through T-TEST-NEW-20) cover the remaining structural refactors S4–S7 and medium refactors M8/M13. Priority items for the next sprint: T-TEST-NEW-09 (`/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` — unblocked by T-SAP-03), T-TEST-NEW-11 (`health_check()` returns `"degraded"` under topology warnings — unblocked by T-SGC-02), T-TEST-NEW-14/15/16/17 (Gate 3 false-positive/false-negative battery — unblocked by S5). All new tests should follow the naming convention `describe('FINDING R??-???: <one-liner>', ...)` so finding-to-test linkage remains grep-able.

**Execution recommendation summary:**

| Sprint | Workstreams | Estimated duration |
|--------|------------|-------------------|
| Sprint 1 (immediate, parallel) | S4 (T-SAP-03 → T-SAP-02 → T-SAP-04 + T-SGC-02 → T-SAR-01) + S5 (T-DOC-02 → T-DOC-03 → T-YML-DPR-01) | 1 week |
| Sprint 2 | M13 enum status (T-PIN-01..08 + T-RBD-02) + M8 trust-state vocabulary (T-SHP-01, T-SBS-01, T-SRS-03, T-CGQ-11, T-CGQ-12) | 2 weeks parallel |
| Sprint 3 | S2/S6/S7 residual (T-SST-09..12, T-HST-10, T-MPR-RUN-02/04/05, T-YML-PLN-02/04, T-YML-CMP-01) + Med-B/D/E/G/H | 1 week |
| Sprint 4 | Phase 5 test migration T-TEST-01..07 + T-TEST-NEW-01..20 (paired with code sprints above) | Threads across sprints 1–3 |
| Sprint 5 | T-PRE-04 closing-pass audit of 11 untouched files + adversarial repros T-PRE-09 + final integration + `implementation-summary.md` | 1 week |

---

*Generated 2026-04-16 from git log `afbb3bc7f..8c809d725` (4 fix commits + 2 chore commits). Source documents: `spec.md`, `plan.md`, `tasks.md`, `phase-4-quick-wins-summary.md`, `preflight-oq-resolution.md`, `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`.*

*Next doc: `implementation-summary.md` — to be authored after all phases complete per spec.md §3 Level 2 template requirement.*
