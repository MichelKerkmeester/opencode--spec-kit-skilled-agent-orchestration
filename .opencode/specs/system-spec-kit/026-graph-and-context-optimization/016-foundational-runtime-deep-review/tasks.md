---
title: "Tasks: Foundational Runtime Remediation"
description: "One task per distinct finding (63 canonical tasks) grouped by source file with dependency markers. Cites finding IDs (R??-???) for traceability."
trigger_phrases: ["016 remediation tasks", "phase 017 tasks"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-16T21:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Stage 2 rewrite"
    next_safe_action: "Phase 1a P0-D sprint + QW"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Foundational Runtime Remediation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable with other `[P]` tasks in the same group |
| `[B:T-XXX-NN]` | Blocked by the referenced task |

**Task Format**: `T-<FILE>-<NN> [SEV] [FLAGS] <finding-id>: <one-line description> (file:line)`

- `<FILE>` is a short file-code (e.g., SST for `session-stop.ts`, HST for `hook-state.ts`)
- `<NN>` is a sequential number within the file group
- `[SEV]` is `[P0]` (composite-only; see Phase-Progress), `[P1]`, or `[P2]`
- `[FLAGS]` are optional `[P]` or `[B:...]`
- `<finding-id>` cites the canonical R??-??? from the findings registry

### File-code Legend

| Code | File |
|------|------|
| SST | `mcp_server/hooks/claude/session-stop.ts` |
| HST | `mcp_server/hooks/claude/hook-state.ts` |
| RCB | `mcp_server/handlers/save/reconsolidation-bridge.ts` |
| RCN | `mcp_server/lib/storage/reconsolidation.ts` |
| PIN | `mcp_server/handlers/save/post-insert.ts` |
| CGQ | `mcp_server/handlers/code-graph/query.ts` |
| GMP | `mcp_server/lib/graph/graph-metadata-parser.ts` |
| MPR | `mcp_server/lib/parsing/memory-parser.ts` |
| SHP | `mcp_server/lib/context/shared-payload.ts` |
| OCT | `mcp_server/lib/context/opencode-transport.ts` |
| SBR | `mcp_server/lib/code-graph/startup-brief.ts` |
| ENR | `mcp_server/lib/code-graph/ensure-ready.ts` |
| SBS | `mcp_server/handlers/session-bootstrap.ts` |
| SRS | `mcp_server/handlers/session-resume.ts` |
| SHS | `mcp_server/handlers/session-health.ts` |
| MSV | `mcp_server/handlers/memory-save.ts` |
| RBD | `mcp_server/handlers/save/response-builder.ts` |
| GSH | `mcp_server/hooks/claude/shared.ts` |
| GSP | `mcp_server/hooks/gemini/session-prime.ts` |
| SAP | `skill/skill-advisor/scripts/skill_advisor.py` |
| SAR | `skill/skill-advisor/scripts/skill_advisor_runtime.py` |
| SGC | `skill/skill-advisor/scripts/skill_graph_compiler.py` |
| MPR-RUN | `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` |
| DLS | `mcp_server/scripts/loaders/data-loader.ts` (+ command YAMLs) |
| YML-PLN | `command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` |
| YML-CMP | `command/spec_kit/assets/spec_kit_complete_auto.yaml` |
| YML-DPR | `command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| DOC-RT | `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` runtime root docs |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-progress -->
## Phase Progress

Every task below maps to a phase in `plan.md` §4. The mapping is:

| Phase | Workstream | Tasks |
|-------|-----------|-------|
| Phase 1a | P0-D TOCTOU cleanup | T-SST-05, T-SST-06, T-HST-03, T-HST-04, T-HST-05 |
| Phase 1b | P0-A HookState overhaul (S2) | T-HST-01, T-HST-02, T-HST-06 through T-HST-09, T-SST-01 through T-SST-07, T-SBR-01, T-SRS-01, T-SRS-02 |
| Phase 1c | P0-C Graph-metadata laundering (S3) | T-GMP-01 through T-GMP-04, T-MPR-01 |
| Phase 1d | P0-B Transactional reconsolidation (S1) | T-RCB-01 through T-RCB-08, T-RCN-01, T-RCN-02, T-MSV-01, T-MSV-02 |
| Phase 2 S4 | Skill routing trust chain | T-SAP-01 through T-SAP-05, T-SAR-01, T-SAR-02, T-SGC-01 through T-SGC-04 |
| Phase 2 S5 | Gate 3 typed classifier | T-DOC-01, T-DOC-02, T-DOC-03, T-YML-DPR-01, T-YML-CMP-01 |
| Phase 2 S6 | Playbook runner isolation | T-MPR-RUN-01 through T-MPR-RUN-04 |
| Phase 2 S7 | YAML predicate grammar | T-YML-PLN-01 through T-YML-PLN-04 |
| Phase 3 M8 | Trust-state vocabulary | T-SHP-01, T-SHP-02, T-OCT-01, T-SBS-01, T-SRS-03, T-SHS-01 |
| Phase 3 M13 | Enum status refactor | T-PIN-01 through T-PIN-06, T-RBD-01, T-RBD-02 |
| Phase 3 Med | Discrete medium refactors | T-ENR-01, T-ENR-02, T-RCB-09, T-SST-08, T-SST-09, T-SST-10, T-GSH-01, T-GSP-01 |
| Phase 4 QW | Quick wins (inline with file groups) | Spread across all groups; tagged in description |
| Phase 5 | Test migration | T-TEST-01 through T-TEST-07 + T-TEST-NEW-01 through T-TEST-NEW-18 |

**Completion invariant:** every canonical task (T-XXX-NN, total ~63) must be either `[x]` or marked with a documented deferral rationale.
<!-- /ANCHOR:phase-progress -->

---

<!-- ANCHOR:preflight -->
## Phase 0: Preflight (Week 1)

- [x] T-PRE-01 Phase 016 research complete (50 iterations, FINAL-synthesis-and-review.md)
- [x] T-PRE-02 Findings registry structured (findings-registry.json)
- [x] T-PRE-03 P0 composite candidates identified and constituent findings mapped
- [ ] T-PRE-04 [P0] Closing-pass audit of 11 untouched files (FINAL §8.2): `ensure-ready.ts`, `code-graph/context.ts`, `graph-lifecycle.ts`, `reconsolidation.ts:executeMerge`, `entity-linker.ts`, `memory-save.ts` timeline, `hooks/claude/shared.ts` producer-string exploit, `hooks/claude/compact-inject.ts`, three additional command YAMLs, `generate-context.js` trigger surface, handover-state enum, `opencode.json` + `.utcp_config.json` naming
- [x] T-PRE-05 [P0] Resolve OQ1: does `command-spec-kit` enforce Gate 3 independently of skill routing? (Determines Watch-P1 upgrade.)
- [x] T-PRE-06 [P0] Resolve OQ2: are the 7 degraded-contract test files intentional compatibility shims or oversights? (Gates S1/S2/S3.)
- [x] T-PRE-07 [P0] Resolve OQ3: can HookState gain schemaVersion without breaking already-quiesced state files? (Gates T-HST-M2.)
- [x] T-PRE-08 [P0] Resolve OQ4: full enumeration of `/spec_kit:*` subcommands needing bridge entries. (Gates T-SAP-05.)
- [ ] T-PRE-09 [P1] Construct §8.3 adversarial repros: R33-001 compact-prime identity race; R40-001 cleanup TOCTOU; R46-003 adversarial lastJobId; R34-002 complement duplicate window; R35-001 conflict fork
<!-- /ANCHOR:preflight -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**P0 Composite Eliminations — file-grouped tasks.** This phase covers all P0 composite candidate eliminations. Tasks are grouped by source file for clarity, but all groups within this section collectively constitute Phase 1 of `plan.md` §4.

<!-- ANCHOR:group-sst -->
### Group: `mcp_server/hooks/claude/session-stop.ts` (10 distinct findings)

Top-1 file by distinct-issue count. Primary workstream: S2 (P0-A) + P0-D (D4, D5).

- [x] T-SST-01 [P1] R1-002: `input.session_id ?? 'unknown'` collapses unrelated sessions onto shared state file; reject or quarantine missing `session_id` payloads (`session-stop.ts:60-105,240-309`)
- [x] T-SST-02 [P1] R11-001: Transcript/producer-metadata failure degrades to warning-only; no machine-readable outcome → surface as typed `OperationResult` with `failed` status (`session-stop.ts:199-218,248-276`) [B:T-PIN-M13 for typed contract]
- [x] T-SST-03 [P1] R13-001: `runContextAutosave` silently skips when `lastSpecFolder`/`sessionSummary` unset → emit `autosaveOutcome: 'skipped'` (`session-stop.ts:60-67,308-312`) [B:T-SST-07]
- [x] T-SST-04 [P1] R14-001: `storeTokenSnapshot` writes `lastTranscriptOffset: 0` before producer metadata builds; catch swallows later failure → eliminate intermediate zero-offset write (`session-stop.ts:175-193,257-268,274-276`) [B:T-SST-06 (D4)]
- [x] T-SST-05 [P0-D] [P] R37-001: Transient `lastTranscriptOffset: 0` sentinel between two writes; second concurrent stop hook can re-parse from zero; carry final offset through to `recordStateUpdate()` (`session-stop.ts:175-190,244-252,257-268`) — Phase 1a / QW #21
- [x] T-SST-06 [P0-D] [P] R33-002: Overlapping stop hooks can regress `lastTranscriptOffset` backwards; `Math.max()` monotonicity guard in `updateState()` (also lands in T-HST group) (`session-stop.ts:119-125,244-268`) — Phase 1a / QW #9
- [x] T-SST-07 [P1] R39-001: Autosave outcome (ran/skipped/failed) never surfaced in `SessionStopProcessResult`; add `autosaveOutcome` field (`session-stop.ts:60-67,108-117,299-318`) — Phase 1a / QW #22
- [x] T-SST-08 [P1] R15-001, R15-002, R15-003: Transcript-driven retargeting silently rewrites autosave destination; 50 KB tail window can hide real active packet; transcript I/O failure collapsed into "ambiguous" → emit retarget-reason field; configurable tail window; distinguish I/O vs ambiguity (`session-stop.ts:61-77,281-309,294-295,340-378`) [Phase 3 Med-F]
- [x] T-SST-09 [P1] R20-001: `buildProducerMetadata()` re-stats live transcript; metadata describes later state than parsed one → snapshot transcript stat before producer metadata builds (`session-stop.ts:199-218,248-268`) [Phase 3 Med-E]
- [x] T-SST-10 [P1] R31-002 + R32-002 (dedup): Multiple `recordStateUpdate()` + final disk reload in `runContextAutosave()` create torn-state autosave window → collapse three writes into single atomic patch (M3 from S2) (`session-stop.ts:60-67,119-125,244-246,261-268,281-289,302-309`) — Phase 1b / M3
- [x] T-SST-11 [P1] R37-002: Stale `currentSpecFolder` preference suppresses legitimate packet retarget when another writer advanced target → refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` OR change "prefer currentSpecFolder" rule (M4 from S2) (`session-stop.ts:128-145,244-246,281-296,340-369`) — Phase 1b / M4
- [x] T-SST-12 [P1] R33-003 consumer side: Failed `saveState` does not abort autosave → consume `updateState()` typed return and abort autosave on `persisted: false` (paired with T-HST-08) (`session-stop.ts:60-67,119-125,261-309`) — Phase 1b / A8

<!-- /ANCHOR:group-sst -->

---

<!-- ANCHOR:group-hst -->
### Group: `mcp_server/hooks/claude/hook-state.ts` (9 distinct findings)

Top-2 file by distinct-issue count. Primary workstream: S2 (P0-A) + P0-D (D1, D2, D3, D5).

- [x] T-HST-01 [P1] R21-002, R25-004 (dedup): `JSON.parse(raw) as HookState` with no validation; feeds prompt replay + autosave routing across 5 hook entrypoints → add runtime `HookStateSchema` (Zod); quarantine to `.bad` on validation failure (M1 from S2) (`hook-state.ts:83-87`) — Phase 1b / M1
- [x] T-HST-02 [P1] R29-001: Cached-summary `schemaVersion` check fabricated; HookState has no version field → add `schemaVersion` field; reject mismatched versions with `schema_mismatch` reason; migration step if OQ3 resolves negatively (M2 from S2) (`hook-state.ts`; also `session-resume.ts:174-208`) — Phase 1b / M2 [B:T-HST-01]
- [x] T-HST-03 [P0-D] [P] R38-001: `loadMostRecentState` all-or-nothing `try` block; one bad sibling aborts entire scan → per-file error isolation; return `{ states, errors }` (`hook-state.ts:131-165`) — Phase 1a / QW #24
- [x] T-HST-04 [P0-D] [P] R38-002: `cleanStaleStates` all-or-nothing `try` block; partial removed count returned with no indication of skipped files → per-file isolation; return `{ removed, skipped, errors }` (`hook-state.ts:243-263`) — Phase 1a / QW #24
- [x] T-HST-05 [P0-D] [P] R40-001: `cleanStaleStates` TOCTOU stat-then-unlink can delete fresh state → identity check (re-stat or open+fstat) before `unlinkSync()` (`hook-state.ts:170-176,247-255`) — Phase 1a / QW #25
- [x] T-HST-06 [P1] R31-001: Deterministic `filePath + '.tmp'` means two writers for same session swap bytes before rename → `.tmp-<pid>-<counter>-<random>` + retry loop (A2 from S2) (`hook-state.ts:169-176,221-240`) — Phase 1b / QW #12
- [x] T-HST-07 [P1] R33-001: `clearCompactPrime()` clears by session ID only, not payload identity; newer payload erased on overlap → identity-based clear (check `cachedAt` or `opaqueId`) (A4 from S2) (`hook-state.ts:184-205`; also `session-prime.ts:43-46,281-287`) — Phase 1b / QW #20
- [x] T-HST-08 [P2] R36-001: `loadMostRecentState` stat-then-read race: concurrent rename can swap generation between mtime and content → re-read mtime after `readFileSync()` and discard candidate if changed (A5 from S2) (`hook-state.ts:140-155,170-176`) — Phase 1b
- [x] T-HST-09 [P1] R32-001 + R33-003 (producer side): `updateState` returns merged after failed persist → return `{ ok, merged, persisted }`; consumers surface persistence failures (A8 from S2) (`hook-state.ts:170-176,221-241`) — Phase 1b
- [ ] T-HST-10 [P2] R4-003: Recent-state authority based on filesystem mtime, not `state.updatedAt` → rank by `updatedAt` field (`hook-state.ts:142-155`)
- [x] T-HST-11 [P0-D] [P] T-SST-06 counterpart: `Math.max()` offset monotonicity guard in `updateState()` (`hook-state.ts:221-241`) — Phase 1a / QW #9

<!-- /ANCHOR:group-hst -->

---

<!-- ANCHOR:group-rcb -->
### Group: `mcp_server/handlers/save/reconsolidation-bridge.ts` (8 distinct findings)

Top-3 file by distinct-issue count. Primary workstream: S1 (P0-B).

- [x] T-RCB-01 [P1] R6-001: Assistive reconsolidation gated by planner/full-auto switch; default OFF despite docs "default ON" → align assistive-default docs with runtime switch (`reconsolidation-bridge.ts:66-73,243-255,446-454`) [Phase 3 Med-C]
- [x] T-RCB-02 [P1] R6-002: `ASSISTIVE_AUTO_MERGE_THRESHOLD` promises auto-merge; runtime only logs and falls through → rename threshold OR implement auto-merge [Phase 3 Med-C, QW-equivalent]
- [x] T-RCB-03 [P1] R13-004: Any thrown error (checkpoint, reconsolidate, similarity, conflict store) caught and falls through to normal create without structured warning → emit typed `OperationResult` with `failed` status + reason (`reconsolidation-bridge.ts:261-270,438-442`) [B:T-PIN-M13]
- [x] T-RCB-04 [P1] R31-003 + R35-001 (dedup): `executeConflict()` has no predecessor-version or scope recheck; merge defends, conflict does not; two concurrent saves can both supersede same predecessor, forking lineage → predecessor CAS (B1 from S1) (`reconsolidation-bridge.ts:282-295` + `reconsolidation.ts:467-508`) — Phase 1d / B1
- [x] T-RCB-05 [P1] R32-003: Scope-retag between filter and commit not re-checked at conflict/merge → re-check scope inside writer transaction (part of B1/B3) (`reconsolidation-bridge.ts:270-306`) — Phase 1d
- [x] T-RCB-06 [P1] R34-002: Complement path: stale-search duplicate window between `runReconsolidationIfEnabled` and `writeTransaction` → move complement decision inside writer transaction or re-run search (B2 from S1) (`reconsolidation-bridge.ts:261-306`) — Phase 1d / B2 [B:T-RCB-04]
- [x] T-RCB-07 [P1] R39-002 + R40-002 (dedup): Governed scope filter reads each candidate's row individually outside any transaction; mixed-snapshot candidate universe → batched scope reads or wrap in transaction (B3/M6 from S1) (`reconsolidation-bridge.ts:203-237,282-306`) — Phase 1d / B3
- [x] T-RCB-08 [P2] R36-002 + R37-003 (dedup): Assistive reconsolidation recommendation built from pre-transaction snapshot; can be stale on delivery → re-run assistive search inside transaction OR flag `advisory_stale: true` (B4 from S1) (`reconsolidation-bridge.ts:453-501`; `memory-save.ts:2159-2170,2250-2304`) — Phase 1d / B4 [B:T-RCB-07]
- [ ] T-RCB-09 [P2] R11-004 + R12-003 (dedup): Scope-filtered reconsolidation candidates vanish silently; limit-pre-filter can starve in-scope candidates → structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` (B5 from S1) (`reconsolidation-bridge.ts:283-295`) — Phase 1d / B5
- [ ] T-RCB-10 [P2] R16-002: Malformed vector-search rows coerced into sentinel values → reject malformed rows in `reconsolidation-bridge` (`reconsolidation-bridge.ts:295-305`) [Phase 3 Med-G]
- [ ] T-RCB-11 [P2] R19-002: Assistive reconsolidation failures fall open to ordinary save; no machine-readable signal → surface as structured failure (`reconsolidation-bridge.ts:453-511,514-518`) [Phase 3 Med-H]
<!-- /ANCHOR:group-rcb -->

---

<!-- ANCHOR:group-rcn -->
### Group: `mcp_server/lib/storage/reconsolidation.ts` (3 distinct findings, coupled to RCB)

Primary workstream: S1 (P0-B). Paired with T-RCB-04, T-RCB-05, T-RCB-06.

- [x] T-RCN-01 [P1] R31-003 + R35-001 counterpart in storage layer: `executeConflict()` `UPDATE ... WHERE id = ?` without CAS → add `content_hash` + `is_deprecated = FALSE` guard; return `'conflict_stale_predecessor'` outcome when predecessor changed (`reconsolidation.ts:467-508`) — Phase 1d / B1
- [x] T-RCN-02 [P1] R34-002 counterpart in storage layer: complement insert logic needs re-check against duplicates inside transaction (`reconsolidation.ts:599-694`) — Phase 1d / B2
<!-- /ANCHOR:group-rcn -->

---

<!-- ANCHOR:group-pin -->
### Group: `mcp_server/handlers/save/post-insert.ts` (6 distinct findings)

Top-4 file by distinct-issue count. Primary workstream: M13 (enum status refactor).

- [x] T-PIN-01 [P1] R7-002: Entity extraction soft-fails but flag set `true`; linking runs on stale rows → gate entity linking on successful extraction (via `OperationResult<T>`) (`post-insert.ts:116-125,159-173`) — Phase 3 M13
- [x] T-PIN-02 [P1] R8-001: `enrichmentStatus = true` for four different outcomes (success, feature-disabled skip, "nothing to do" skip, full deferral) → replace with `OperationResult<T>` map (M13 canonical fix) (`post-insert.ts:86-213,223-238`) — Phase 3 M13 (anchor)
- [x] T-PIN-03 [P1] R8-002: Entity linking gated only by feature flags, not successful extraction → gate on `extraction.status == 'ran'` (`post-insert.ts:116-129,157-181`) [B:T-PIN-02]
- [x] T-PIN-04 [P1] R14-003 (dedup of R12-004): Partial causal-link failures normalized into successful enrichment → propagate `partial` status (`post-insert.ts:94-113`) [B:T-PIN-02]
- [x] T-PIN-05 [P2] R11-005: `summary`/`graphLifecycle` no-ops normalized to `true` → `skipped` status with reason (`post-insert.ts:136-147,187-200`) [B:T-PIN-02]
- [x] T-PIN-06 [P2] R12-005 (dedup of R14-004): `entityLinking.skippedByDensityGuard` collapsed into success → `skipped` status with `reason: 'density_guard'` (`post-insert.ts:159-173`) [B:T-PIN-02]
- [ ] T-PIN-07 [P2] R17-002: Exception-driven enrichment failures still report `executionStatus=ran` → `failed` status with exception reason (`post-insert.ts:106-109,126-129,148-151,174-177,201-214`) [B:T-PIN-02]
- [ ] T-PIN-08 [P1] R27-001: `graphLifecycle=true` even when `onIndex` returns `skipped:true`; `runEnrichmentBackfill` can't unblock → propagate underlying skip reason (`post-insert.ts:187-200`) [B:T-PIN-02]
<!-- /ANCHOR:group-pin -->

---

<!-- ANCHOR:group-cgq -->
### Group: `mcp_server/handlers/code-graph/query.ts` (6 distinct findings)

Top-5 file by distinct-issue count. Primary workstream: Quick wins + M8 cascades.

- [x] T-CGQ-01 [P1] R3-001: `resolveSubject()` picks first `fq_name`/`name` match with `LIMIT 1`; no `ambiguous_subject` signal → return `ambiguous_subject` on multi-row match (`code-graph/query.ts:42-58`) [QW]
- [x] T-CGQ-02 [P1] R3-002: Readiness gate fails open; `ensureCodeGraphReady()` exceptions swallowed → surface as `status: "error"` (`code-graph/query.ts:319-334`) [QW #14]
- [x] T-CGQ-03 [P2] R3-003: Response-level edge trust derived from `result.edges[0]` only → aggregate edge trust, not first edge (`code-graph/query.ts:551-564`) [QW]
- [x] T-CGQ-04 [P1] R11-003: `blast_radius` silently degrades unresolved subjects into seed file paths → return `status: "error"` if resolution fails (`code-graph/query.ts:367-385`) [QW #16]
- [x] T-CGQ-05 [P2] R12-002 + R14-002 (dedup): Unsupported/misspelled `edgeType` returns ok with empty result → reject with `status: "error"` (`code-graph/query.ts:26-29,441-549`) [QW #8]
- [x] T-CGQ-06 [P2] R13-003: Outline queries degrade unknown/path-mismatched files into ok with `nodeCount: 0` → validate outline subject path first (`code-graph/query.ts:340-364`) [QW #13]
- [x] T-CGQ-07 [P1] R16-001: `includeTransitive: true` runs before switch-level validation; unsupported ops default to CALLS → validate operation before transitive branch (`code-graph/query.ts:417-436,547-548`) [QW]
- [x] T-CGQ-08 [P2] R17-001: Dangling edges returned as successful relationships with raw `edge.targetId` → flag dangling edges as corruption (`code-graph/query.ts:442-559`) [QW #17]
- [ ] T-CGQ-09 [P2] R18-001 + R20-003 (dedup): Query-level `detectorProvenance` silently degrades to global last-index snapshot → compute query-level provenance or omit field (`code-graph/query.ts:94-99,551-565`)
- [ ] T-CGQ-10 [P2] R19-001: Transitive traversal silently degrades dangling nodes into ok with null metadata → surface as corruption (paired with T-CGQ-08) (`code-graph/query.ts:127-166,417-436`) [Phase 3 Med-H]
- [ ] T-CGQ-11 [P1] R22-001 + R23-001 (dedup): Self-contradictory success payload (readiness `empty` + `detectorProvenance: structured`); query exposes `empty` readiness while bootstrap canonicalizes same condition as `missing` → align vocabulary via M8 (`code-graph/query.ts:61-83,94-99,319-364,551-564`) [B:T-SHP-01]
- [ ] T-CGQ-12 [P1] R27-002: Routing still recommends `code_graph_query` despite readiness-fail-open gap → update routing recommendations in `context-server.ts:801-816` [B:T-CGQ-02]
<!-- /ANCHOR:group-cgq -->

---

<!-- ANCHOR:group-gmp -->
### Group: `mcp_server/lib/graph/graph-metadata-parser.ts` (4 distinct findings)

Top-9 file by distinct-issue count. Primary workstream: S3 (P0-C).

- [x] T-GMP-01 [P1] R11-002 + R21-003 + R23-002 (dedup cluster): Legacy fallback returns `ok: true` with no migration marker; `refreshGraphMetadataForSpecFolder()` launders malformed modern JSON into canonical → return `{ ok, metadata, migrated, migrationSource? }` and propagate migrated marker through refresh path (M7/C1/C4 from S3) (`graph-metadata-parser.ts:223-233,264-275,1015-1019`) — Phase 1c / M7
- [x] T-GMP-02 [P1] R13-002: `readDoc()` collapses I/O failure to `null`; `deriveStatus()` misreads as `planned`/`complete` → distinguish I/O failure from "file does not exist"; propagate as `status: 'unknown'` (C3 from S3) (`graph-metadata-parser.ts:280-285,457-475,831-860`) — Phase 1c / C3
- [x] T-GMP-03 [P2] R18-002: Legacy fallback discards original current-schema validation errors → preserve original validation errors in diagnostic set (C2 from S3) (`graph-metadata-parser.ts:228-242`) — Phase 1c / C2
- [x] T-GMP-04 [P2] R20-002: Legacy fallback fabricates `created_at`/`last_save_at` via `new Date().toISOString()` → preserve original timestamps when available; emit migrated marker when fabricating (paired with T-GMP-01) (`graph-metadata-parser.ts:167-205,223-233`) — Phase 1c
- [x] T-GMP-05 [P2] R31-004 + R32-004 (dedup): `process.pid + Date.now()` temp path collides at ms precision → unique temp filenames via `.tmp-<pid>-<counter>-<random>` (`graph-metadata-parser.ts:969-989`) [QW #15]
<!-- /ANCHOR:group-gmp -->

---

<!-- ANCHOR:group-mpr -->
### Group: `mcp_server/lib/parsing/memory-parser.ts` (1 distinct finding)

Primary workstream: S3 (P0-C).

- [x] T-MPR-01 [P1] R22-002: Fallback-recovered `graph-metadata` gets `qualityScore: 1`, +0.12 packet boost → propagate `migrated` flag; penalize (not boost) `migrated=true` rows in stage-1 ranking (C5 from S3) (`memory-parser.ts:293-330`) — Phase 1c / C5 [B:T-GMP-01]
<!-- /ANCHOR:group-mpr -->

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Structural Refactors — S4 Skill Routing + S5 Gate 3 + S6 Playbook + S7 YAML.**

Structural workstreams addressing governance-layer findings. Runs in parallel with Phase 1 where possible.

---

<!-- ANCHOR:group-shp -->
### Group: `mcp_server/lib/context/shared-payload.ts` (2 distinct findings)

Primary workstream: M8 (trust-state vocabulary).

- [ ] T-SHP-01 [P1] R9-001: `trustStateFromGraphState()` / `trustStateFromStructuralStatus()` collapse `missing` + `empty` into `stale` → introduce `absent`/`unavailable` distinct from `stale`; migrate producers (M8) (`shared-payload.ts:592-601`) — Phase 3 M8
- [x] T-SHP-02 [P2] R9-002: `coerceSharedPayloadEnvelope()` is shape-only, not contract-level → runtime validation of `SharedPayloadKind`/`producer` (`shared-payload.ts:598-601`) [QW #18]
<!-- /ANCHOR:group-shp -->

---

<!-- ANCHOR:group-oct -->
### Group: `mcp_server/lib/context/opencode-transport.ts` (1 distinct finding, coupled to SHP)

Primary workstream: M8.

- [x] T-OCT-01 [P1] R30-002: OpenCode transport drops richer structural truth; renders only collapsed provenance label → migrate to `absent`/`unavailable` vocabulary; render distinct axes (M8 consumer side) (`opencode-transport.ts:64-71,98-149`) — Phase 3 M8 [B:T-SHP-01]
<!-- /ANCHOR:group-oct -->

---

<!-- ANCHOR:group-sbr -->
### Group: `mcp_server/lib/code-graph/startup-brief.ts` (1 distinct finding after dedup)

Primary workstream: S2 (P0-A).

- [x] T-SBR-01 [P1] R1-001 (+ R2-001 + R4-001 dedup): `buildSessionContinuity()` calls `loadMostRecentState()` with no scope; hook-state rejects scope-less calls → scope the continuity call, or fix `loadMostRecentState` to not reject scope-less (`startup-brief.ts:179-192`) — Phase 1b / S2
<!-- /ANCHOR:group-sbr -->

---

<!-- ANCHOR:group-enr -->
### Group: `mcp_server/lib/code-graph/ensure-ready.ts` (2 distinct findings)

Primary workstream: Phase 3 Med-A, Med-B.

- [x] T-ENR-01 [P1] R5-001: Successful inline refresh still reports pre-refresh freshness → refresh readiness/freshness reports after inline reindex completes (`ensure-ready.ts:283-317`) [Phase 3 Med-A]
- [ ] T-ENR-02 [P1] R5-002: Partial persistence failures silently treated as successful refresh (file_mtime_ms written before node/edge failure) → don't write mtime until nodes+edges persist (`ensure-ready.ts:183-217`) [Phase 3 Med-B]
<!-- /ANCHOR:group-enr -->

---

<!-- ANCHOR:group-sbs-srs-shs -->
### Group: `session-bootstrap.ts` / `session-resume.ts` / `session-health.ts` (4 distinct findings)

Primary workstream: S2 (P0-A) + M8.

- [ ] T-SBS-01 [P1] R30-001: Same payload carries `trustState=stale` AND `graphOps.readiness.canonical=empty` → align vocabulary to M8 expansion (`session-bootstrap.ts:321-347` + `session-resume.ts:530-551`) — Phase 3 M8 [B:T-SHP-01]
- [x] T-SRS-01 [P1] R24-002: Cached scope drives `fallbackSpecFolder` but OpenCode transport uses `args.specFolder ?? null` → `handleSessionResume` forwards fallback scope (`session-resume.ts:174-188,415-429,560-563`) [QW]
- [x] T-SRS-02 [P1] R29-001 consumer side: schema-version rejection path unreachable → paired with T-HST-02 to enable it (`session-resume.ts:174-208`) [B:T-HST-02]
- [ ] T-SRS-03 [P2] R38-001 extension: `session-resume.ts:348-366` has same all-or-nothing scan; inherits T-HST-03 fix [B:T-HST-03]
- [x] T-SHS-01 [P2] R26-002: `session_health` doesn't attach section-level `structuralTrust` axes → add structural-trust section (QW #19) (`session-health.ts:136-166`) [QW #19]
- [ ] T-SRS-04 [P2] R29-002: Claude startup collapses all rejection reasons into same "no cached continuity" state → distinct reason codes per M1/M2 (`session-prime.ts:130-143`) [B:T-HST-01, T-HST-02]
<!-- /ANCHOR:group-sbs-srs-shs -->

---

<!-- ANCHOR:group-msv-rbd -->
### Group: `mcp_server/handlers/memory-save.ts` + `response-builder.ts` (2 distinct findings)

Primary workstream: M13 + S1.

- [x] T-MSV-01 [P1] R24-001: `runEnrichmentBackfill` advertised before enrichment runs; only deferred case gets typed recovery → all runtime-degradation branches get typed recovery via `OperationResult<T>` (`memory-save.ts:1616-1678,2362-2384`) [B:T-PIN-02]
- [x] T-MSV-02 [P1] R34-002 orchestrator side: Complement duplicate window orchestrated at memory-save; paired with T-RCB-06 (`memory-save.ts:2159-2171,2250-2304`) — Phase 1d / B2 [B:T-RCB-06]
- [x] T-RBD-01 [P1] R21-001: `memory_save` response collapses post-insert truth further than `post-insert.ts` does → propagate typed `OperationResult<T>` through response (`response-builder.ts:311-322,569-573`) — Phase 3 M13 [B:T-PIN-02]
<!-- /ANCHOR:group-msv-rbd -->

---

<!-- ANCHOR:group-gsh-gsp -->
### Group: `hooks/claude/shared.ts` + `hooks/gemini/session-prime.ts` (2 distinct findings)

Primary workstream: Phase 3 Med.

- [x] T-GSH-01 [P2] R10-002: Wrapper interpolates provenance directly into `[PROVENANCE:]` without escaping → escape provenance fields; adversarial test for `]`/newline in `producer` (`hooks/claude/shared.ts:109-123`) [Phase 3 Med-J; REQ-013] [B:T-HST-01]
- [x] T-GSP-01 [P1] R10-001: Gemini compact-recovery drops cached provenance entirely; Claude preserves it → Gemini wrapper forwards `payloadContract.provenance` (`hooks/gemini/session-prime.ts:55-68`) [Phase 3 Med-I; REQ-014]
<!-- /ANCHOR:group-gsh-gsp -->

---

<!-- ANCHOR:group-sap -->
### Group: `skill/skill-advisor/scripts/skill_advisor.py` (5 distinct findings)

Top-6 file by distinct-issue count. Primary workstream: S4.

- [x] T-SAP-01 [P1] R43-001 + R44-001 (dedup): Live skill router does not consume per-skill `intent_signals`/`derived.trigger_phrases`; `signals` map populated but has no consumer in `analyze_request()` → wire signals into scoring (A2 from S4) (`skill_advisor.py:105-116,140-152,180-187,1669-1694`) — Phase 2 S4 / QW #1
- [x] T-SAP-02 [P2] R45-002: Deep-research prompts containing `audit`/`review` tokens score within 0.02 of `sk-code-review`; no ranking-stability test → disambiguation tier for deep-research vs review (A2b from S4) (`skill_advisor.py:568-577,771-813,1669-1694`) [B:T-SAP-01]
- [ ] T-SAP-03 [P1] R46-001: `COMMAND_BRIDGES` registers only `/spec_kit` prefix; all `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority=2` → per-subcommand bridges (A0 from S4) (`skill_advisor.py:980-1021,1404-1410,1647,1741-1768`) — Phase 2 S4 / QW #2 [B:T-PRE-08]
- [x] T-SAP-04 [P1] R46-002: `validate_edge_symmetry()` never inspects `conflicts_with` edges; unilateral metadata edit silently creates bilateral runtime penalty → reciprocity check (paired with T-SGC-03) (A4 from S4) (`skill_advisor.py:141-187,321-339`) — Phase 2 S4
- [x] T-SAP-05 [P1] R41-003: Skill-graph topology checks advisory-only; `--validate-only` returns success for graphs violating routing invariants → promote to hard errors (paired with T-SGC-02) (`skill_advisor.py:203-265`) [QW #27]
<!-- /ANCHOR:group-sap -->

---

<!-- ANCHOR:group-sar -->
### Group: `skill_advisor_runtime.py` (3 distinct findings)

Primary workstream: S4.

- [x] T-SAR-01 [P2] R42-002: Skill-routing authority split across two unsynchronized inventories: SKILL.md discovery vs compiled graph; `health_check()` returns ok even when inventories disagree → inventory comparison in health_check (A5 cascade) (`skill_advisor_runtime.py:93-97,165-203`) — Phase 2 S4
- [x] T-SAR-02 [P2] R44-002: `parse_frontmatter_fast()` stores only `key: value` scalar lines; `<!-- Keywords: ... -->` comment blocks stripped before routing → capture comment blocks (A1 from S4) (`skill_advisor_runtime.py:161-203`) — Phase 2 S4 / QW #3
<!-- /ANCHOR:group-sar -->

---

<!-- ANCHOR:group-sgc -->
### Group: `skill_graph_compiler.py` (4 distinct findings)

Top-8 file by distinct-issue count. Primary workstream: S4.

- [x] T-SGC-01 [P1] R41-003 counterpart in compiler: topology check exit code → hard-error on violations (paired with T-SAP-05) (`skill_graph_compiler.py:272-353,630-663`) [QW #27]
- [x] T-SGC-02 [P1] R45-003: Topology warning state non-durable: ZERO-EDGE WARNINGS emitted then dropped from serialized graph; `health_check()` returns `status: ok` after warnings → serialize warning payloads into compiled graph; expose in `health_check()` (A5 from S4) (`skill_graph_compiler.py:559-568,630-663`) — Phase 2 S4 / QW #4
- [x] T-SGC-03 [P1] R46-002 counterpart in compiler: `validate_edge_symmetry()` must inspect `conflicts_with` edges → reciprocity check (paired with T-SAP-04) (`skill_graph_compiler.py:272-319,501-568,630-663`) [QW #5]
- [x] T-SGC-04 [P1] R49-003: `validate_dependency_cycles()` only detects two-node reciprocal cycles; longer `depends_on` loops pass `--validate-only` → arbitrary-length cycle detection (Tarjan SCC or DFS color-marking) (`skill_graph_compiler.py:437-472,623-663`) [QW #6]
<!-- /ANCHOR:group-sgc -->

---

<!-- ANCHOR:group-mpr-run -->
### Group: `manual-playbook-runner.ts` (4 distinct findings)

Top-7 file by distinct-issue count. Primary workstream: S6.

- [x] T-MPR-RUN-01 [P1] R41-004: Markdown → `Function(...)()` eval with no sandbox; documentation drift can become arbitrary Node-side execution → typed step executor replacing `Function(...)()` (M9 from S6) (`manual-playbook-runner.ts:224-246,251-317,438-445`) — Phase 2 S6
- [x] T-MPR-RUN-02 [P2] R42-003: Automation eligibility governed by filename substrings + prose-shaped command parsing → explicit `automatable: boolean` field on scenario metadata (S6/C1) (`manual-playbook-runner.ts:319-375,983-1016`)
- [x] T-MPR-RUN-03 [P1] R45-004: `parseScenarioDefinition()` returns null on parse failure; `main()` filters nulls before coverage count; 10/291 active scenario files unparseable 2026-04-16 → `parsedCount == filteredCount` assertion; emit named warning on drop (`manual-playbook-runner.ts:245-271,1203-1217`) [QW #7]
- [x] T-MPR-RUN-04 [P1] R46-003: `parsedStepArgs()` routes brace-prefixed text to `evaluateObjectLiteral()`; `substitutePlaceholders()` injects `runtimeState.lastJobId` from prior handler payloads into `Function(...)` string → typed schema-validated arg parser (paired with T-MPR-RUN-01) (`manual-playbook-runner.ts:181-194,427-445,930-943,1112-1117`) — Phase 2 S6
- [x] T-MPR-RUN-05 [P2] R50-002: Live corpus contains two incompatible argument dialects for same tool family (`memory_ingest_status({jobId})` vs `memory_ingest_status({ jobId:"<job-id>" })`); shorthand form depends on undefined JS scoping → reject shorthand dialect; add schema validation (`manual-playbook-runner.ts:438-445,544-548,612-616`) [Phase 2 S6]
<!-- /ANCHOR:group-mpr-run -->

---

<!-- ANCHOR:group-dls -->
### Group: `data-loader.ts` + command YAMLs + runtime root docs (shared-path hazard)

Primary workstream: QW #10, #11.

- [x] T-DLS-01 [P2] R31-005 + R32-005 (dedup): `/tmp/save-context-data.json` documented shared handoff path; parallel runtime sessions overwrite each other → remove from 4 command surfaces + 4 runtime root docs + `data-loader.ts` `NO_DATA_FILE` error text (`data-loader.ts:59-111` + `command/memory/save.md`, `spec_kit/deep-research.md`, `spec_kit/deep-review.md` + `generate-context.ts:61-82`) [QW #10, #11]
<!-- /ANCHOR:group-dls -->

---

<!-- ANCHOR:group-doc-rt -->
### Group: runtime root docs `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` (3 distinct findings across root docs)

Primary workstream: QW #10 + S5.

- [x] T-DOC-01 [P2] R35-003: All four runtime root docs prescribe shared `/tmp/save-context-data.json` → remove (paired with T-DLS-01) (`AGENTS.md:205-207`; `CLAUDE.md:152-155`; `CODEX.md:205-207`; `GEMINI.md:205-207`) [QW #10]
- [x] T-DOC-02 [P2] R41-002 + R45-001 + R47-001 (dedup): Gate 3 trigger list is prose English word list; different runtimes can classify same request differently; trigger list includes `analyze`, `decompose`, `phase` tokens that false-positive on read-only review prompts → extract into shared module / JSON schema; read-only disqualifier tokens (S5 core) (`AGENTS.md:182-186`; `plan.md:86-89`; `complete.md:74-77`; `002-confirm-mode-checkpointed-review.md:26-32`) — Phase 2 S5 / M10 — shared classifier landed at `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`; AGENTS/CLAUDE/GEMINI/CODEX + plan.md/complete.md + implement YAML asset blocks cite it; 29-case vitest suite in `scripts/tests/gate-3-classifier.vitest.ts`
- [x] T-DOC-03 [P2] R48-001 + R49-001 + R50-001 (dedup): Gate 3 trigger list false-negatives for `save context`, `save memory`, `/memory:save`, `resume` even though same file declares `MEMORY SAVE RULE` and deep-research `resume` produces writes → add save/resume/continue trigger phrases (S5) (`AGENTS.md:138-145,182-204`) — Phase 2 S5 — `MEMORY_SAVE_TRIGGERS` + `RESUME_TRIGGERS` now codify `save context`, `save memory`, `/memory:save`, `/spec_kit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration`; runtime docs reflect them as positive triggers.
<!-- /ANCHOR:group-doc-rt -->

---

<!-- ANCHOR:group-yml-pln -->
### Group: `command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` (4 distinct findings)

Top-10 file by distinct-issue count. Primary workstream: S7.

- [x] T-YML-PLN-01 [P2] R41-001: Autonomous plan workflow uses `populated` while canonical contract uses `populated-folder`; interpreter-dependent string comparison → align vocabulary (`spec_kit_plan_auto.yaml:338-355,371-372`; `intake-contract.md:66-77,217-222`) [QW #26]
- [x] T-YML-PLN-02 [P2] R42-001 + R43-002 + R44-003 (dedup): `intake_only == TRUE` / `folder_state == populated` as quoted string expressions; no mechanical grammar contract → `BooleanExpr` typed schema (M11 from S7) (`spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-416`) — Phase 2 S7 / M11
- [x] T-YML-PLN-03 [P2] R47-002: `/spec_kit:plan` maintains two-vocabulary state machine: local `folder_state` classifier → canonical `start_state`; top-level docs collapse → mark boundary with explicit comments; emit both fields (S7) (`spec_kit_plan_auto.yaml:337-373`; `spec_kit_plan_confirm.yaml:360-398`; `intake-contract.md:39-49,56-76`; `SKILL.md:563,931`; `README.md:624-626`) [QW #28]
- [x] T-YML-PLN-04 [P2] R48-002 + R49-002 (dedup): `when:` field overloaded as executable predicate AND prose timing note within same asset → separate `when:` (predicate) from `after:` (prose timing) (S7) (`spec_kit_plan_auto.yaml:354-391,548-555`; `spec_kit_plan_confirm.yaml:372-416,606-612`) — Phase 2 S7
<!-- /ANCHOR:group-yml-pln -->

---

<!-- ANCHOR:group-yml-cmp-dpr -->
### Group: other command YAMLs (2 distinct findings)

Primary workstream: S5 + S7.

- [x] T-YML-CMP-01 [P2] R48-002 extension in `spec_kit_complete_auto.yaml:465-483,1008-1012` — paired with T-YML-PLN-04 (S7)
- [x] T-YML-DPR-01 [P1] R50-001 orchestrator side: `spec_kit_deep-research_auto.yaml:159-167,521-526` — `resume` is a tested write flow producing `iteration-NNN.md` + JSONL appends; paired with T-DOC-03 Gate 3 trigger addition (S5)
<!-- /ANCHOR:group-yml-cmp-dpr -->

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Medium Refactors + Test Migration + Completion — M8 Trust-State + M13 Enum Status + Med-A through Med-J.**

Medium-track refactors for trust-state vocabulary expansion, enum status propagation, and discrete medium items scattered across files. Runs Weeks 6-9. Individual medium items are inlined in the groups above (SHP, OCT, SBR, ENR, SBS-SRS-SHS, MSV-RBD, GSH-GSP) and cross-referenced by their "[Phase 3 Med-*]" tags. No new tasks are introduced here; the anchor exists as an organizational pointer.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:test-migration -->
## Test Suite Migration (Phase 5)

Every code-changing task above must be paired with a test commit. The 7 canonical test files that codify degraded contracts:

- [ ] T-TEST-01 [P0] Migrate `post-insert-deferred.vitest.ts:11-48` from all-true booleans to enum `'deferred'` — paired with T-PIN-02 (M13) [~80 LOC]
- [ ] T-TEST-02 [P0] Migrate `structural-contract.vitest.ts:90-111` from `status=missing` + `trustState=stale` to distinct labels per axis — paired with T-SHP-01 (M8) [~120 LOC]
- [ ] T-TEST-03 [P0] Migrate `graph-metadata-schema.vitest.ts:223-245` from legacy fallback = clean success to `{ ok: true, migrated: true, migrationSource: 'legacy' }` — paired with T-GMP-01 (S3) [~150 LOC]
- [ ] T-TEST-04 [P1] Migrate `code-graph-query-handler.vitest.ts:12-18` from hoisted `fresh` readiness to explicit fail-open branch test — paired with T-CGQ-02 (QW #14) [~50 LOC]
- [ ] T-TEST-05 [P0] Migrate `handler-memory-save.vitest.ts:546-557,2286-2307` from post-insert all-true to enum status — paired with T-PIN-02 + T-RBD-01 (M13) [~200 LOC]
- [ ] T-TEST-06 [P0] Migrate `hook-session-stop-replay.vitest.ts:14-56` from "autosave disabled" to "autosave enabled with failure injection" — paired with T-SST-07, T-SST-12, T-HST-09 (S2) [~150 LOC]
- [ ] T-TEST-07 [P0] Migrate `opencode-transport.vitest.ts:33-60` from only `trustState=live` to `missing`/`absent` cases — paired with T-OCT-01 (M8) [~80 LOC]

**Additional test updates** (paired with respective structural work; not primary codifiers but affected):

- [ ] T-TEST-08 [P1] Update `hook-state.vitest.ts:4-224` with TOCTOU + all-or-nothing + torn-read cases — paired with T-HST-03, T-HST-04, T-HST-05, T-HST-08 [~180 LOC]
- [ ] T-TEST-09 [P0] Update `reconsolidation.vitest.ts:790-855` with two-concurrent-writer infra — paired with T-RCN-01 (S1) [~300 LOC]
- [ ] T-TEST-10 [P0] Update `reconsolidation-bridge.vitest.ts:255-330` with governed-scope mutation infra — paired with T-RCB-06, T-RCB-07 (S1) [~200 LOC]
- [ ] T-TEST-11 [P0] Update `test_skill_advisor.py:73-186` with `/spec_kit:deep-research` → `sk-deep-research` assertion + intent_signals boost verification — paired with T-SAP-01 + T-SAP-03 (S4) [~250 LOC]
- [ ] T-TEST-12 [P1] Update `transcript-planner-export.vitest.ts:146-217` with YAML `when:` predicate evaluation — paired with T-YML-PLN-02 (S7) [~100 LOC]
- [ ] T-TEST-13 [P0] Update `assistive-reconsolidation.vitest.ts:17-234` with competing candidate insert between recommendation and commit — paired with T-RCB-08 (S1) [~150 LOC]
- [ ] T-TEST-14 [P1] Update `skill-graph-schema.vitest.ts:1-156` with compiler invariants (symmetry, weight-band, orphans, cycle length >2) — paired with T-SGC-01 through T-SGC-04 (S4) [~150 LOC]

**New adversarial tests** (no current coverage):

- [ ] T-TEST-NEW-01 [P0] Two-concurrent-conflict save against same predecessor (R35-001, P0-B) [T-RCN-01]
- [ ] T-TEST-NEW-02 [P0] Mixed-snapshot scope filter under governed-scope mutation (R39-002, R40-002, P0-B) [T-RCB-07]
- [ ] T-TEST-NEW-03 [P0] TOCTOU cleanup → all-or-nothing scan abort → cold-start (R40-001, R38-001, R37-001, P0-D) [T-HST-03..T-HST-05]
- [ ] T-TEST-NEW-04 [P0] Two-stop overlap exposing transient `lastTranscriptOffset: 0` (R37-001, R33-002, P0-A) [T-SST-05, T-SST-06]
- [ ] T-TEST-NEW-05 [P0] Compact prime identity race (R33-001, P0-A) [T-HST-07]
- [ ] T-TEST-NEW-06 [P0] HookState schema-version mismatch rejection (R29-001, P0-A) [T-HST-02]
- [ ] T-TEST-NEW-07 [P1] `Function(...)` with injected adversarial `lastJobId` (R46-003, W2/REQ-011) [T-MPR-RUN-01, T-MPR-RUN-04]
- [ ] T-TEST-NEW-08 [P1] Ranking-stability: `sk-deep-research` vs `sk-code-review` margin ≥ 0.10 (R45-002, S4) [T-SAP-02]
- [ ] T-TEST-NEW-09 [P1] `/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` (R46-001, S4) [T-SAP-03]
- [ ] T-TEST-NEW-10 [P1] Unilateral `conflicts_with` does NOT penalize non-declaring skill (R46-002, S4) [T-SAP-04, T-SGC-03]
- [ ] T-TEST-NEW-11 [P1] `health_check()` returns `status: "degraded"` when topology warnings present (R45-003, S4) [T-SGC-02]
- [ ] T-TEST-NEW-12 [P1] Scenario count before vs after null-filter equals (R45-004, S6) [T-MPR-RUN-03]
- [ ] T-TEST-NEW-13 [P1] `intake_triggered`/`intake_completed` events contain both `folderState` and `startState` with distinct values (R47-002, S7) [T-YML-PLN-03]
- [ ] T-TEST-NEW-14 [P1] `phase transition` prompt preceded by `confirm` does NOT trigger Gate 3 (R45-001, R47-001, S5) [T-DOC-02]
- [ ] T-TEST-NEW-15 [P1] `synthesis phase` prompt preceded by `verify` does NOT trigger Gate 3 (R47-001, S5) [T-DOC-02]
- [ ] T-TEST-NEW-16 [P1] `save context` / `save memory` / `/memory:save` prompts DO trigger Gate 3 (R48-001, R49-001, S5) [T-DOC-03]
- [ ] T-TEST-NEW-17 [P1] `resume deep research` prompt DOES trigger Gate 3 (R50-001, S5) [T-DOC-03]
- [ ] T-TEST-NEW-18 [P1] Arbitrary-length `depends_on` cycle fails `--validate-only` (R49-003, S4) [T-SGC-04]
- [ ] T-TEST-NEW-19 [P1] YAML `when:` predicate with `true`/`false` lowercase or `True`/`False` titlecase does NOT match `TRUE`/`FALSE` contract (R42-001, R43-002, R44-003, S7) [T-YML-PLN-02]
- [ ] T-TEST-NEW-20 [P1] `implement` / `rename` prompts trigger Gate 3 regardless of context (regression for false negatives) [T-DOC-02]
<!-- /ANCHOR:test-migration -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All canonical tasks (T-XXX-NN) marked `[x]` or documented deferral rationale in `implementation-summary.md`
- [ ] No `[B:...]` blocked tasks remaining (dependencies all resolved)
- [ ] All 4 P0 composite candidates eliminated with attack-scenario regression tests passing
- [ ] All 7 structural refactors (S1–S7) landed
- [ ] All 13 medium refactors (M1–M13 + Med-A..Med-J) landed
- [ ] All 29 quick wins landed
- [ ] All test migration tasks (T-TEST-01..07) + new tests (T-TEST-NEW-01..20) passing
- [ ] `validate.sh --strict` passes on 016 packet
- [ ] Full repo type-check + Vitest + pytest passes
- [ ] `implementation-summary.md` written with commit-by-commit finding closure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-summary -->
## Task Count Summary

| Category | Count | Coverage |
|----------|-------|----------|
| Preflight (T-PRE-*) | 9 | Open-question resolution, closing-pass audit |
| `session-stop.ts` (T-SST-*) | 12 | 10 distinct findings (some tasks bundle dedup clusters) |
| `hook-state.ts` (T-HST-*) | 11 | 9 distinct findings |
| `reconsolidation-bridge.ts` (T-RCB-*) | 11 | 8 distinct findings (includes med-F, med-G, med-H) |
| `reconsolidation.ts` (T-RCN-*) | 2 | 3 distinct findings (coupled to RCB) |
| `post-insert.ts` (T-PIN-*) | 8 | 6 distinct findings (some dedup clusters) |
| `code-graph/query.ts` (T-CGQ-*) | 12 | 6 distinct findings (some dedup + cross-file) |
| `graph-metadata-parser.ts` (T-GMP-*) | 5 | 4 distinct findings |
| `memory-parser.ts` (T-MPR-*) | 1 | 1 distinct finding |
| `shared-payload.ts` (T-SHP-*) | 2 | 2 distinct findings |
| `opencode-transport.ts` (T-OCT-*) | 1 | 1 distinct finding |
| `startup-brief.ts` (T-SBR-*) | 1 | 1 distinct finding (dedup cluster) |
| `ensure-ready.ts` (T-ENR-*) | 2 | 2 distinct findings |
| `session-{bootstrap,resume,health}.ts` (T-SBS/SRS/SHS) | 6 | 4 distinct findings (+ cross-file) |
| `memory-save.ts` + `response-builder.ts` (T-MSV/RBD) | 3 | 2 distinct findings (+ cross-file) |
| `hooks/claude/shared.ts` + `gemini/session-prime.ts` (T-GSH/GSP) | 2 | 2 distinct findings |
| `skill_advisor.py` (T-SAP-*) | 5 | 5 distinct findings |
| `skill_advisor_runtime.py` (T-SAR-*) | 2 | 3 distinct findings (subset) |
| `skill_graph_compiler.py` (T-SGC-*) | 4 | 4 distinct findings |
| `manual-playbook-runner.ts` (T-MPR-RUN-*) | 5 | 4 distinct findings |
| `data-loader.ts` + YAMLs (T-DLS-*) | 1 | 2 distinct findings (cross-file hazard) |
| Runtime root docs (T-DOC-*) | 3 | 3 distinct findings |
| `spec_kit_plan_{auto,confirm}.yaml` (T-YML-PLN-*) | 4 | 4 distinct findings |
| Other command YAMLs (T-YML-CMP/DPR-*) | 2 | 2 distinct findings |
| Test migration canonical (T-TEST-01..07) | 7 | 7 test files |
| Test migration supporting (T-TEST-08..14) | 7 | 7 test files |
| New adversarial tests (T-TEST-NEW-01..20) | 20 | 20 new tests |
| **Total canonical task count** | **~147** | Covers all 63 distinct findings plus test migrations and preflight |

Note: the task count exceeds 63 because (a) some dedup clusters are implemented via multiple coordinated tasks across files, (b) test migration is tracked as distinct tasks, (c) new adversarial tests are tracked separately.
<!-- /ANCHOR:task-summary -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Authoritative Research**: `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`
- **Findings Registry**: `../research/016-foundational-runtime-deep-review/findings-registry.json`
- **Research Narrative**: `../research/016-foundational-runtime-deep-review/research.md`
- **Iteration Evidence**: `../research/016-foundational-runtime-deep-review/iterations/iteration-{001..050}.md`
- **Prior Deep Review**: `../015-implementation-deep-review/`
<!-- /ANCHOR:cross-refs -->
