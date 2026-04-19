---
title: "Feature Specification: Foundational Runtime Remediation"
description: "Charter for 63 distinct findings from 50-iter Phase 016 deep-research: 4 P0 composites, 7 structural refactors, 13 medium, 29 quick wins, 7 test migrations."
trigger_phrases: ["foundational runtime remediation", "016 remediation charter"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research"
    last_updated_at: "2026-04-16T21:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Stage 2 rewrite"
    next_safe_action: "Phase 1 P0-D solo sprint"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Foundational Runtime Remediation (Phase 016 → Phase 016 remediation Charter)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (four composite candidates) + P1 (structural refactors) |
| **Status** | Research Complete, Ready for Implementation |
| **Created** | 2026-04-16 |
| **Updated** | 2026-04-16 (Stage 2: remediation charter rewrite) |
| **Branch** | `main` |
| **Research Source** | `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` (1537 lines, 50-iteration Opus 4.7 synthesis) |
| **Findings Registry** | `../research/016-foundational-runtime-pt-01/findings-registry.json` (structured) |
| **Iteration Evidence** | `../research/016-foundational-runtime-pt-01/iterations/iteration-{001..050}.md` |
| **Effort Budget** | 24.5 engineer-weeks (6 engineer-months, parallelizable to 10–12 weeks wall clock at 3 engineers) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Phase 016 50-iteration deep-research pass (Opus 4.7 synthesis, 2026-04-16) surveyed `.opencode/skill/system-spec-kit/mcp_server/` and associated governance surfaces and emitted **129 raw findings (66 P1, 63 P2, 0 individual P0)**. After deduplication these compress to **~63 distinct issues across 37 files**. The research confirmed that the runtime is **not broken in obvious ways** — there are no crashes, no unhandled exceptions, no compile errors. Instead, every failure mode is **silent, success-shaped, and layered**.

Although no single finding reached P0 severity on its own, the synthesis identified **four P0-escalation composite candidates** where layered P1 + P2 findings combine into systemic, persistent data-integrity or control-plane failures:

- **P0-A — Cross-runtime tempdir control-plane poisoning.** 10 constituent findings across `hook-state.ts` + `session-stop.ts`. Claude, Gemini, and OpenCode hook entrypoints all consume the same temp directory; one corrupt file poisons five hook entrypoints simultaneously.
- **P0-B — Reconsolidation conflict + complement duplicate/corruption window.** 8 constituent findings across `reconsolidation-bridge.ts` + `lib/storage/reconsolidation.ts`. Governed memory writes can fork lineage, double-insert complement rows, and admit or exclude candidates with mixed-snapshot scope reads.
- **P0-C — Graph-metadata laundering + packet-search boost.** 6 constituent findings across `graph-metadata-parser.ts` + `memory-parser.ts`. Malformed modern `graph-metadata.json` is accepted as legacy, stamped with fresh timestamps, rewritten as canonical JSON, assigned `qualityScore: 1`, and boosted +0.12 in packet search — all while the original corruption signal is erased.
- **P0-D — TOCTOU cleanup erasing fresh state under live session load.** 4 constituent findings across `hook-state.ts` + `session-stop.ts`. A routine `--finalize` cleanup sweep overlapping with live writers deletes the newest session state, makes the next startup look like a cold start, and double-counts tokens on transcript re-parse. **Triggered by normal maintenance rather than abnormal load.**

Additionally, **Watch-priority-1** (one confirmed step away from P0) documents a Domain-4 routing misdirection chain that can upgrade to P0-E if `command-spec-kit` proceeds into spec-folder creation when invoked via bridge with `/spec_kit:deep-research` intent.

### Purpose

Define the remediation charter that closes **all 63 distinct findings** across five sequenced phases:

1. **P0 composite eliminations** (4 candidates, each bundling constituent P1/P2 findings into structural fixes).
2. **Structural refactors** (7 items: enum status, transactional reconsolidation, HookState schema versioning, trust-state vocabulary expansion, graph-metadata migration markers, Gate 3 typed classifier, playbook runner isolation, YAML predicate grammar).
3. **Medium refactors** (13 items bridging quick wins to structural change).
4. **Quick wins** (29 small isolated fixes addressing ~25 of the 63 distinct findings).
5. **Test suite migration** (7 test files currently codify degraded behavior and must be rewritten alongside code changes).

The charter exists because the review's central conclusion is that **remediation must be structural, not patchwork.** Fixing one constituent finding in isolation produces partial progress at best and creates new "looks correct" surfaces at worst.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — Remediation of 63 Distinct Findings Across ~37 Files

Concrete file surfaces the remediation touches (grouped by top-10 distinct-issue count from `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §9.3):

| Rank | File | Distinct | Dominant Pattern | Primary Workstream |
|------|------|----------|------------------|--------------------|
| 1 | `mcp_server/hooks/claude/session-stop.ts` | 10 | Split-brain autosave + success-shaped durability | S2 (P0-A), P0-D |
| 2 | `mcp_server/hooks/claude/hook-state.ts` | 9 | Unlocked RMW + TOCTOU + unvalidated parse | S2 (P0-A), P0-D |
| 3 | `mcp_server/handlers/save/reconsolidation-bridge.ts` | 8 | Pre-transaction snapshots | S1 (P0-B) |
| 4 | `mcp_server/handlers/save/post-insert.ts` | 6 | `enrichmentStatus` boolean collapse | M13 |
| 5 | `mcp_server/handlers/code-graph/query.ts` | 6 | Readiness fail-open + vocabulary divergence | Quick wins + M8 |
| 6 | `skill/skill-advisor/scripts/skill_advisor.py` | 5 | Invisible-discard + prefix collapse | S4 |
| 7 | `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | 4 | `Function(...)` eval + silent drop | S6 |
| 8 | `skill/skill-advisor/scripts/skill_graph_compiler.py` | 4 | Advisory validation + warning amnesia + 2-node-only cycle check | S4 (+ QW #5, #6) |
| 9 | `mcp_server/lib/graph/graph-metadata-parser.ts` | 4 | Legacy laundering + temp-path collision | S3 (P0-C) |
| 10 | `command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` | 4 | `when:` overload + untyped boolean DSL + vocabulary fragmentation | S7 |

Additional in-scope files (each with 1–3 distinct findings):
- `mcp_server/lib/storage/reconsolidation.ts` — R31-003, R32-003, R35-001 (S1)
- `mcp_server/lib/context/shared-payload.ts` — R9-001, R9-002, R26-001 (M8)
- `mcp_server/lib/context/opencode-transport.ts` — R9-002, R30-002 (M8)
- `mcp_server/lib/code-graph/startup-brief.ts` — R1-001 dedup cluster (S2)
- `mcp_server/lib/code-graph/ensure-ready.ts` — R5-001, R5-002 (Medium)
- `mcp_server/handlers/session-{bootstrap,resume,health}.ts` — R24-002, R26-002, R29-001, R30-001, R38-001 (S2/M8)
- `mcp_server/handlers/save/response-builder.ts` — R21-001, R24-001 (M13)
- `mcp_server/handlers/memory-save.ts` — R24-001, R34-002 (M13/S1)
- `mcp_server/hooks/claude/shared.ts` — R10-002 (Medium)
- `mcp_server/hooks/gemini/session-prime.ts` — R10-001 (Medium)
- `mcp_server/lib/parsing/memory-parser.ts` — R22-002 (S3)
- `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs + runtime root docs — R31-005, R32-005, R35-003, R36-003 (QW #10, #11)
- `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` — R35-003, R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 (QW #10, S5)
- `skill/skill-advisor/scripts/skill_advisor_runtime.py` — R42-002, R43-001, R44-002 (S4)
- `skill/skill-advisor/graph-metadata.json` + per-skill `graph-metadata.json` — R42-002, R43-001 (S4)
- Command YAMLs: `spec_kit_complete_auto.yaml`, `spec_kit_deep-research_auto.yaml` — R48-002, R50-001 (S5, S7)
- `.opencode/skill/system-spec-kit/references/intake-contract.md` — R41-001, R47-002 (S7)
- Test files codifying degraded contracts (7 listed in §7, "Test-suite migration" subsection).

### Out of Scope

- **Remediation of Domain-5 test-coverage gaps not catalogued** — see Phase 016 remediation Week 1 closing-pass in `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §8.2.
- **Real-load concurrency frequency measurement** — structural fixes work regardless; measurement deferred to Phase 017.
- **Gemini lane cross-audit** — spot-checked only; dedicated Gemini parity audit deferred to Phase 017.
- **Handover-state routing enum** — prose `handover_state` vocabulary never audited; deferred.
- **`opencode.json` / `.utcp_config.json` naming contracts** — stringly-typed MCP namespace pattern never audited; deferred.
- **`generate-context.js` trigger-phrase surface** — memory category/triggers/scope fields never audited; deferred.
- **New feature development or architectural redesign beyond what each fix strictly requires.**
- **Re-reviewing files already covered by 015 unless a 016 finding explicitly requires revisit.**

### Finding Inventory Summary

**Severity distribution (distinct findings after deduplication):**

| Severity | Count | % of ~63 distinct |
|----------|-------|-------------------|
| P0 (individual) | 0 | 0% |
| P0 (escalation composites) | 4 confirmed + 1 Watch-P1 + 1 Watch-P2 | — |
| P1 (distinct) | ~33 | ~52% |
| P2 (distinct) | ~30 | ~48% |

**By domain (raw findings from all 50 iterations):**

| Domain | Label | P1 raw | P2 raw | Total raw | Distinct | Peak iteration |
|--------|-------|--------|--------|-----------|----------|----------------|
| Foundational (1–10) | Session, graph, save seams | 14 | 9 | 23 | 10 | 5, 8, 10 |
| D1 (11–20) | Silent fail-open patterns | 16 | 12 | 28 | 14 | 13, 17 |
| D2 (21–30) | State contract honesty | 15 | 9 | 24 | 11 | 21, 24, 30 |
| D3 (31–40) | Concurrency + write coordination | 15 | 11 | 26 | 14 | 33, 35, 37, 40 |
| D4 (41–50) | Stringly-typed governance | 8 | 20 | 28 | ~14 | 43, 45, 46 |

### P0 Composite Candidates (explicit enumeration)

Each candidate bundles multiple P1/P2 constituent findings into an interaction effect that requires structural remediation:

#### P0-A: Cross-runtime tempdir control-plane poisoning

| Constituent | File | Severity |
|-------------|------|----------|
| R21-002 | `hook-state.ts:83-87` | P1 |
| R25-004 | `hook-state.ts:83-87` | P1 |
| R28-001 | `session-stop.ts:244-275` | P1 |
| R29-001 | `session-resume.ts:174-208` | P1 |
| R31-001 | `hook-state.ts:169-176,221-240` | P1 |
| R33-003 | `hook-state.ts:170-180,221-241`; `session-stop.ts:60-67,119-125,261-309` | P1 |
| R33-001 | `hook-state.ts:184-205`; `session-prime.ts:43-46,281-287` | P1 |
| R36-001 | `hook-state.ts:140-155,170-176` | P2 |
| R38-001 | `hook-state.ts:131-165`; `session-resume.ts:348-366` | P2 |
| R38-002 | `hook-state.ts:243-263`; `session-stop.ts:321-328`; `gemini/session-stop.ts:77-84` | P2 |

Attack scenario: a single corrupt/drifted/concurrently-replaced temp-state file simultaneously (1) injects forged provenance into Claude prompts, (2) misroutes Gemini startup continuity, (3) forces transcript re-parsing with duplicate token counts, (4) bypasses the cached-summary schema guard, (5) pairs one stop-hook's summary with another's packet target without CAS, (6) proceeds with autosave after a known saveState failure, (7) has fresh precompact payload silently deleted by older consumer's `clearCompactPrime()`, (8) returns freshness from one generation with content from another, (9) suppresses all sibling recovery when one file is transiently unreadable, (10) returns a partial `cleanStaleStates` sweep as if complete.

**Remediation:** S2 structural overhaul (HookState schema versioning + runtime validation + unique temp paths + per-file isolation + TOCTOU identity check + CAS in `updateState()`). See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.1.

#### P0-B: Reconsolidation conflict + complement duplicate/corruption window

| Constituent | File | Severity |
|-------------|------|----------|
| R31-003 | `reconsolidation-bridge.ts:282-295` + `reconsolidation.ts:467-508` | P1 |
| R32-003 | `reconsolidation-bridge.ts:270-306` + `reconsolidation.ts:611-656` | P1 |
| R34-002 | `reconsolidation-bridge.ts:261-306`; `reconsolidation.ts:599-694`; `memory-save.ts:2159-2171,2250-2304` | P1 |
| R35-001 | `reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508,610-658,952-993` | P1 |
| R36-002 | `reconsolidation-bridge.ts:453-501`; `memory-save.ts:2159-2170,2250-2304` | P2 |
| R37-003 | `reconsolidation-bridge.ts:261-306,453-500` | P2 |
| R39-002 | `reconsolidation-bridge.ts:203-237,282-306` | P1 |
| R40-002 | `reconsolidation-bridge.ts:203-236,282-295,453-465` | P1 |

Attack scenario: two concurrent governed `memory_save` requests against overlapping candidates can (1) fork lineage because `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)`, (2) deprecate a predecessor already superseded because `executeConflict()` runs `UPDATE ... WHERE id = ?` without version or scope recheck, (3) insert duplicate complement rows because `runReconsolidationIfEnabled()` runs vector search + scope filter before the writer transaction, (4) admit/exclude candidates with mixed-source snapshots because `readStoredScope()` issues a fresh per-candidate `SELECT` outside any transaction, (5) generate stale assistive recommendations from a second pre-transaction search that differs from TM-06 planning.

**Remediation:** S1 structural refactor (transactional reconsolidation: predecessor CAS, complement-inside-transaction, batched scope reads, assistive-in-transaction or stale-flag). See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.2.

#### P0-C: Graph-metadata laundering + packet-search boost

| Constituent | File | Severity |
|-------------|------|----------|
| R11-002 | `graph-metadata-parser.ts:223-233` | P2 |
| R13-002 | `graph-metadata-parser.ts:280-285,457-475,831-860` | P1 |
| R20-002 | `graph-metadata-parser.ts:167-205,223-233` | P2 |
| R21-003 | `graph-metadata-parser.ts:223-233,264-275,1015-1019` | P1 |
| R22-002 | `memory-parser.ts:293-330` | P1 |
| R23-002 | `graph-metadata-parser.ts:223-233` | P1 |

Attack scenario: a malformed modern `graph-metadata.json` (1) gets accepted as legacy with `ok: true` and no migration marker, (2) gets fabricated `created_at`/`last_save_at` via `new Date().toISOString()` erasing original timestamp evidence, (3) gets reinterpreted through `deriveStatus()` as `planned`/`complete` when `readDoc()` collapses I/O failure into `null`, (4) gets rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()` erasing the corruption evidence at the persistence layer, (5) gets `qualityScore: 1` and empty `qualityFlags: []` through the memory-parser fallback path, (6) gets +0.12 packet-search boost in stage-1 candidate generation, outranking legitimate spec docs.

**Remediation:** S3 structural propagation (`migrated: boolean` flag propagation from `graph-metadata-parser.ts` through `memory-parser.ts` into stage-1 candidate ranking; remove +0.12 boost for `migrated=true` or `qualityScore: 1` rows). See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.3.

#### P0-D: TOCTOU cleanup erasing fresh state under live session load

| Constituent | File | Severity |
|-------------|------|----------|
| R40-001 | `hook-state.ts:170-176,247-255`; `session-stop.ts:321-328` | P2 |
| R38-001 | `hook-state.ts:131-165`; `session-resume.ts:348-366` | P2 |
| R33-002 | `session-stop.ts:119-125,244-268`; `hook-state.ts:221-241` | P1 |
| R37-001 | `session-stop.ts:175-190,244-252,257-268` | P1 |

Attack scenario: a routine `--finalize` sweep overlapping with a live session can (1) delete a freshly-written session state because `cleanStaleStates()` stat-then-unlink crosses a live rename, (2) make the next `loadMostRecentState()` return `null` for all consumers because of the single try/catch wrapping the whole directory loop, (3) re-parse transcript from offset 0 because the next stop hook sees `lastTranscriptOffset: 0` sentinel, (4) compound via overlap-induced offset regression without a `Math.max()` monotonicity guard. **Triggered by normal maintenance**, not abnormal concurrent load.

**Remediation:** D1–D5 (TOCTOU identity check, per-file isolation, zero-offset sentinel elimination, `Math.max()` monotonicity). ~2 days solo engineer. See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.4.

#### Watch-priority-1: Domain-4 routing misdirection chain

Constituent findings: R46-001 + R43-001/R44-001 + R42-002 + R41-003 + R46-002. One confirmed concrete step (R46-001: `/spec_kit:deep-research` → `command-spec-kit` 0.95) pending resolution of whether `command-spec-kit` proceeds into spec-folder creation when invoked via bridge. Upgrade trigger and fix chain (A0 + A2) documented in `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.5.

#### Watch-priority-2: Playbook runner `Function(...)` trust-boundary expansion

Constituent findings: R41-004 + R45-004 + R46-003 + R50-002. Dev/CI isolation currently contains blast radius. Upgrade trigger: external payload influence reaches `runtimeState.lastJobId`. Fix chain: S6 (typed step executor). ~1.5 weeks. See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.6.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete before claiming remediation done)

| ID | Requirement | Acceptance Criteria | Primary Findings |
|----|-------------|---------------------|------------------|
| REQ-001 | P0-A (cross-runtime tempdir control-plane poisoning) eliminated via structural overhaul S2 | Runtime `HookStateSchema` (Zod) validation on every read; unique temp path `.tmp-<pid>-<counter>-<random>`; `schemaVersion` field with migration; identity-based `clearCompactPrime()`; re-read mtime after JSON read; per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()`; TOCTOU identity check before `unlinkSync()`; `updateState()` returns `{ ok, merged, persisted }` with callers surfacing persistence failures | R21-002, R25-004, R28-001, R29-001, R31-001, R33-001, R33-003, R36-001, R38-001, R38-002 |
| REQ-002 | P0-B (reconsolidation conflict + complement duplicate/corruption) eliminated via transactional reconsolidation S1 | Predecessor `content_hash` + `is_deprecated = FALSE` CAS in `executeConflict()`; complement decision inside writer transaction or re-run vector search before insert; batched scope reads instead of per-candidate `readStoredScope()`; assistive review inside transaction or flags `advisory_stale: true`; structured warning emitted when scope filter drops candidates | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 |
| REQ-003 | P0-C (graph-metadata laundering + packet-search boost) eliminated via migration propagation S3 | `validateGraphMetadataContent()` returns `{ ok, metadata, migrated, migrationSource? }`; consumers propagate `migrated` through memory-parser and ranking; `refreshGraphMetadataForSpecFolder()` preserves `migrated` marker; stage-1 indexing penalizes (not boosts) `migrated=true` rows; I/O failure in `readDoc()` distinguished from "file does not exist" via `status: 'unknown'` | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| REQ-004 | P0-D (TOCTOU cleanup erasing fresh state) eliminated via D1–D5 quick-win stack | TOCTOU identity check via re-stat or open+fstat before `unlinkSync()`; per-file isolation in `loadMostRecentState()` returning `{ ok, skipped, errors }`; per-file isolation in `cleanStaleStates()` returning `{ removed, skipped, errors }`; zero-offset sentinel eliminated from `storeTokenSnapshot()`; `Math.max()` monotonicity guard on `metrics.lastTranscriptOffset` | R33-002, R37-001, R38-001, R38-002, R40-001 |

### P1 - Required (complete OR user-approved deferral) — one REQ per systemic theme

| ID | Requirement | Acceptance Criteria | Primary Findings |
|----|-------------|---------------------|------------------|
| REQ-005 | Systemic theme §5.1 eliminated: success-shaped envelope no longer masks skip/defer/partial/failed state | M13 enum-status refactor: `OperationResult<T>` with `'ran' \| 'skipped' \| 'failed' \| 'deferred' \| 'partial'`; applied to `enrichmentStatus`, `autosaveOutcome`, `responseBuilder.postInsertEnrichment`, `reconsolidationResult`, `graphMetadataRefreshResult`; regression tests migrated off all-true boolean assertions | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001, R21-001, R24-001 |
| REQ-006 | Systemic theme §5.2 eliminated: pre-transaction read-then-mutate with stale-decision commit blocked | CAS at commit, same-transaction re-read, single-snapshot batched reads — applied to reconsolidation (REQ-002), HookState `updateState()` (REQ-001), and graph-metadata refresh (REQ-003) | R31-001..R31-004, R34-002, R35-001, R39-002, R40-002 |
| REQ-007 | Systemic theme §5.3 eliminated: collapsed state vocabulary expanded | M8 trust-state vocabulary: introduce `absent` (graph does not exist) and `unavailable` (graph should exist but inaccessible) as distinct from `stale`; migrate `trustStateFromGraphState()` / `trustStateFromStructuralStatus()` / opencode-transport renderer / bootstrap/resume/health consumers + test fixtures | R9-001, R22-001, R23-001, R26-001, R26-002, R30-001, R30-002 |
| REQ-008 | Systemic theme §5.4 eliminated: governance signal amnesia closed | Every transition either asserts faithful artifact forwarding or explicitly logs intentional drop. Concretely: (a) `intent_signals` wired into `analyze_request()` scoring (S4/A2); (b) topology warnings serialized into compiled graph + surfaced in `health_check()` (S4/A5, QW #4); (c) `<!-- Keywords: -->` comment blocks captured in `parse_frontmatter_fast()` (S4, QW #3); (d) per-subcommand `COMMAND_BRIDGES` entries for all `/spec_kit:*` (S4, QW #2); (e) `conflicts_with` reciprocity in `validate_edge_symmetry()` (QW #5); (f) arbitrary-length cycle detection (QW #6); (g) Gate 3 typed classifier replaces prose trigger list with save/resume additions + read-only disqualifiers (S5) | R41-002, R41-003, R42-002, R43-001, R44-001, R44-002, R45-001, R45-003, R45-004, R46-001, R46-002, R47-001, R47-002, R48-001, R49-001, R49-003, R50-001 |
| REQ-009 | Systemic theme §5.5 (flag-based success without helper-result inspection) eliminated | All boolean-literal `true` assignments in `post-insert.ts` and `session-stop.ts` replaced with helper-return inspection yielding `OperationResult<T>`; `producerMetadataWritten` and `touchedPaths` documented as attempted-write flags or removed | R8-001, R11-005, R12-004, R12-005, R34-001, R35-002 |
| REQ-010 | Systemic theme §5.7 eliminated: deterministic / shared temp paths under concurrency removed | `/tmp/save-context-data.json` removed from all 4 runtime root docs + 4 command YAMLs + `data-loader.ts` `NO_DATA_FILE` error text; `.tmp-<pid>-<counter>-<random>` suffix in `hook-state.ts:saveState()` and `graph-metadata-parser.ts:writeGraphMetadataFile()` | R31-001, R31-004, R31-005, R32-005, R35-003, R36-003 |
| REQ-011 | Playbook runner trust-boundary isolated (Watch-P2 prevented from escalating to P0) | `Function(...)()` + `substitutePlaceholders()` replaced with typed step executor + schema-validated arg parser; explicit `automatable: boolean` on scenario metadata; `parsedCount == filteredCount` assertion before coverage computation; adversarial `lastJobId` injection test added | R41-004, R42-003, R45-004, R46-003, R50-002 |
| REQ-012 | YAML `when:` predicate grammar pinned | `BooleanExpr` schema defined; string literals replaced with typed boolean conditions; `when:` (predicate) separated from `after:`/`trigger:` (prose timing); asset-predicate test suite covering `/spec_kit:plan` Step 0 branch inputs and `intake_triggered`/`intake_completed` event fields | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria | Primary Findings |
|----|-------------|---------------------|------------------|
| REQ-013 | Shared payload marker sanitization | Escape provenance fields in `[PROVENANCE:]` wrapper; reject `]` or newline in `producer` string | R10-002 |
| REQ-014 | Gemini compact-recovery symmetry | Gemini wrapper forwards `payloadContract.provenance` to match Claude | R10-001 |
| REQ-015 | Domain-5 test coverage catch-up | 5-iteration dedicated pass during Phase 016 remediation Week 1 producing regression-harness inventory | — (cross-cutting) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every one of the ~63 distinct findings (R1-001 through R50-002 after deduplication) has either (a) a closing commit linked in `implementation-summary.md` with the finding ID cited, or (b) a documented deferral with written rationale and a tracked parking-lot entry.
- **SC-002**: All 4 P0 composite candidates eliminated via composite remediation (REQ-001..004). Each elimination requires: (a) structural fix landed, (b) attack scenario's regression test added and passing, (c) every constituent finding closed.
- **SC-003**: Watch-priority-1 (Domain-4 routing misdirection) resolved either by (a) confirming `command-spec-kit` does not proceed into spec-folder creation on bridge invocation (closes chain), or (b) upgrading to P0-E and remediating via S4/A0 + A2.
- **SC-004**: Watch-priority-2 (playbook runner trust-boundary) contained by REQ-011 (typed step executor). Adversarial `lastJobId` injection test passes.
- **SC-005**: All 7 test files codifying degraded contracts (see §7 Risks table) are migrated alongside their corresponding code changes. New tests required by `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §6.5 (listed in `checklist.md` CHK-TEST-*) are added.
- **SC-006**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research --strict` passes.
- **SC-007**: Full repository type-check passes (`tsc --noEmit`), Vitest suite passes, Python test suite passes, no new warnings from `skill_graph_compiler.py --validate-only`.
- **SC-008**: `health_check()` returns `status: "degraded"` (not `status: "ok"`) when topology warnings are present (regression for R45-003).
- **SC-009**: `memory_save` / `session_bootstrap` / `session_resume` / `session_health` responses expose distinct state vocabulary (`live`, `stale`, `absent`, `unavailable`) with no self-contradictory field pairs (regression for R30-001).
- **SC-010**: Manual attack-scenario reproduction for each P0 candidate (§8.3 of `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md`) is constructed and confirmed to now fail (i.e., the attack is prevented).

### Acceptance Scenarios

**Given** the 4 P0 composite candidates (P0-A cross-runtime tempdir poisoning, P0-B reconsolidation conflict/complement duplication, P0-C graph-metadata laundering, P0-D TOCTOU cleanup) have landed structural fixes (S2, S1, S3, and D1–D5 respectively), **when** the corresponding adversarial attack-scenario regression tests (`p0-a-*.vitest.ts`, `p0-b-*.vitest.ts`, `p0-c-*.vitest.ts`, `p0-d-*.vitest.ts`) run, **then** every step in each attack chain is blocked and the tests pass green on CI.

**Given** prior Phase 016 commits (Wave A quick wins, Wave B structural refactors, Wave C medium refactors, Phase 4 test migrations) are already on main, **when** this remediation's remaining structural + test commits land on the same main branch, **then** the full repository Vitest suite, Python test suite (`test_skill_advisor.py`, `test_skill_graph_compiler.py`), and the 14 canonical + 20 adversarial tests enumerated in `checklist.md` CHK-TEST-* all pass without regressing previously-green tests.

**Given** the Phase 016 remediation is declared complete, **when** `tsc --noEmit` and `skill_graph_compiler.py --validate-only` run over the full repository, **then** both exit 0 with zero new errors or warnings beyond the pre-remediation baseline, and all `OperationResult<T>` / `TrustState` / `HookStateSchema` / `BooleanExpr` type usages compile without `any` escape hatches.

**Given** every Phase 016 code commit carries a `Closes-Finding: R??-???` trailer citing finding IDs from `../research/016-foundational-runtime-pt-01/findings-registry.json`, **when** `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research --strict` runs, **then** spec/plan/tasks/checklist/implementation-summary remain internally consistent (strict pass: 0 errors, 0 warnings), every completed checklist item retains its `[EVIDENCE: ...]` citation, and the finding-to-commit mapping in `implementation-summary.md` is exhaustive for all 63 distinct findings.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **Test suite codifies degraded contracts.** 7 test files explicitly assert the collapsed/fail-open behavior; any structural fix without simultaneous test migration will break CI. | **HIGH — blocks remediation work** | Every code change MUST identify corresponding test updates. Migration effort is ~15% of refactor time (~2100 LOC of test changes). See §7 "Test-Suite Migration Mandate" below. |
| Risk | Remediation of one P0 candidate masks the next. E.g., fixing R21-002 (unvalidated parse) in isolation hides R36-001 (torn read) because the parse failure was masking the read race. | Medium | Structural refactors bundle constituent findings (S2 addresses all of P0-A's 10 findings together). Do not land partial fixes for P0 candidates. |
| Risk | HookState schema-version migration breaks already-quiesced state files. | Medium | Open question resolution during Phase 016 remediation Week 1. If breaks exist, add A3 migration step that reads legacy → writes current schema. Otherwise, reject mismatched-version state with distinct `schema_mismatch` reason rather than crash. |
| Risk | Regression tests that codify degraded contracts may be intentional compatibility shims, not oversights. Delete-and-replace would break legitimate compatibility. | Medium | Resolve before starting S1/S2/S3: review each test's original PR message and commit log for compatibility intent. Default assumption: oversight unless evidence otherwise. |
| Risk | Concurrent writer surface at runtime is characterized (7 interleavings) but not measured. Structural fixes work regardless of frequency, but test harness priorities may miss the actual high-frequency cases. | Low | 2-day measurement pass before S1/S2 (optional; fixes sound either way). |
| Risk | Phase 015 remediation may have modified H6/H7 files concurrently with this research. | Low | Verify current-state of `reconsolidation-bridge.ts` and `post-insert.ts` against findings-registry line numbers before S1/S2/M13 starts. |
| Dependency | `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` must remain the authoritative source throughout implementation. | High | Treat it as read-only during Phase 016 remediation. Any new findings discovered during implementation get appended to `implementation-summary.md` with cross-reference; do not amend the synthesis. |
| Dependency | `/spec_kit:deep-review` pipeline used for closing-pass audits of the 11 untouched files (see `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §8.2). | Medium | Gate: at Phase 016 remediation Week 1, run a 5-iteration closing-pass on the 11 untouched files before starting P0-A/B/C remediation, to avoid discovering new P1/P2 findings mid-refactor. |
| Dependency | Copilot concurrency cap (3 per account) for parallel deep-review dispatches during remediation validation. | Low | Plan dispatch schedule accordingly; use per-iter delta files to avoid shared-write races. |

### Test-Suite Migration Mandate

Every code change in this remediation MUST identify its corresponding test updates in the same commit (or an immediately-following commit with a cross-reference). Seven existing test files codify the degraded contract and must be rewritten alongside their structural fix:

| Test file | Current assertion | New assertion required | Fix chain | Est. LOC |
|-----------|-------------------|------------------------|-----------|----------|
| `post-insert-deferred.vitest.ts` | All-true booleans for deferred | Enum status with `'deferred'` | M13 | ~80 |
| `structural-contract.vitest.ts` | `status=missing` + `trustState=stale` | Distinct labels per axis | M8 | ~120 |
| `graph-metadata-schema.vitest.ts` | Legacy fallback = clean success | `{ ok: true, migrated: true, migrationSource: 'legacy' }` | S3 | ~150 |
| `code-graph-query-handler.vitest.ts` | Hoisted `fresh` readiness | Test fail-open branch explicitly | QW #14 | ~50 |
| `handler-memory-save.vitest.ts` | Post-insert all-true | Enum status | M13 | ~200 |
| `hook-session-stop-replay.vitest.ts` | Autosave disabled | Enabled with failure injection | S2 | ~150 |
| `opencode-transport.vitest.ts` | Only `trustState=live` | `missing`/`absent` cases | M8 | ~80 |

**Additional new tests (no current coverage; must be added before declaring each P0 candidate "done"):**

- Two-concurrent-conflict save against same predecessor (R35-001, P0-B)
- Mixed-snapshot scope filter under governed-scope mutation (R39-002, R40-002, P0-B)
- TOCTOU cleanup → all-or-nothing scan abort → cold-start (R40-001, R38-001, R37-001, P0-D)
- Two-stop overlap exposing transient `lastTranscriptOffset: 0` (R37-001, R33-002, P0-A)
- Compact prime identity race (`readCompactPrime` → write → `clearCompactPrime`) (R33-001, P0-A)
- HookState schema-version mismatch rejection (R29-001, P0-A)
- `Function(...)` with injected adversarial `lastJobId` (R46-003, W2/REQ-011)
- Ranking-stability: `sk-deep-research` vs `sk-code-review` margin ≥ 0.10 for audit-vocabulary prompts (R45-002, S4)
- `/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` (R46-001, S4)
- Unilateral `conflicts_with` does NOT penalize non-declaring skill (R46-002, S4)
- `health_check()` returns `status: "degraded"` when topology warnings present (R45-003, S4)
- Scenario count before vs after null-filter equals (R45-004, S6)
- Arbitrary-length `depends_on` cycle fails `--validate-only` (R49-003, QW #6)
- Gate 3 false-positive + false-negative regression battery (S5)
- YAML `when:` predicate typed-grammar violation (R42-001, R43-002, R44-003, S7)

**Total migration effort: ~2100 LOC at ~300 LOC/day = ~7 engineer-days of pure test work.** Distributed across weeks 4–9 of the Phase 016 remediation week-by-week plan (`plan.md` §4).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Remediation must not regress existing throughput benchmarks. Specifically: CAS additions (REQ-002) must not increase writer-lock contention measurably under single-concurrent-save load.
- **NFR-P02**: Schema validation (REQ-001) runs on every HookState load; must stay <1ms p99 to avoid session-startup regression. Use Zod with cached schema instances.

### Security

- **NFR-S01**: REQ-011 (playbook runner) must close the `Function(...)` eval surface. Acceptance: repo-wide grep for `new Function(` returns zero occurrences in `manual-playbook-runner.ts` and its helpers.
- **NFR-S02**: REQ-013 (shared payload sanitization): `[PROVENANCE:]` marker injection must fail under adversarial `producer` strings containing `]`, newline, or nested bracket patterns.

### Reliability

- **NFR-R01**: Every remediation commit must cite the finding ID(s) it addresses. Git trailer format: `Closes-Finding: R21-002, R25-004` (extensible list).
- **NFR-R02**: After each P0-candidate remediation lands, all constituent attack scenarios from `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.x must have a regression test and those tests must pass.
- **NFR-R03**: `validate.sh --strict` must pass on this packet at every commit. CI gate on the 016 subfolder.

### Maintainability

- **NFR-M01**: New types (`OperationResult<T>`, `TrustState`, `HookStateSchema`, `BooleanExpr`) must have JSDoc with at least one worked example each.
- **NFR-M02**: Each systemic-theme elimination (REQ-005..009) must update cross-references in systemic-themes.md (if it exists) or equivalent narrative doc.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- **Legacy graph-metadata still on disk at time of S3 rollout.** Migration path: on first read after S3 deploys, propagate `migrated: true`; downstream ranking penalizes until human review re-authors. Do NOT automatically upgrade legacy to current schema.
- **HookState files in-flight during S2 deploy.** Migration path: reject unrecognised `schemaVersion` with quarantine-to-`.bad`; do NOT silently accept. Acceptance: no silent schema drift.
- **Concurrent Phase 016 remediation engineer commits.** Guarantee: every commit cites finding IDs. Engineer 1, 2, 3 tracks should not touch the same files concurrently (§7.5 week-by-week plan).

### Error Scenarios

- **Finding reproduced but fix is out-of-scope (e.g., requires new API).** Mitigation: document in `implementation-summary.md` as deferred; add parking-lot entry in parent 026 spec.
- **Test migration reveals legitimate compatibility requirement.** Mitigation: land the test as both old+new (shim-guarded); add ADR entry in `../decision-record.md`.
- **Attack-scenario regression test is flaky under race.** Mitigation: stabilise with deterministic scheduling harness; do NOT land flaky tests. If stabilisation is infeasible within one engineer-day, escalate to user.

### State Transitions

- **P0-A fix lands but P0-D still open.** Safe: both target overlapping files but P0-D changes are additive to S2. Do not gate P0-D on P0-A completion.
- **S1 lands but M13 not yet.** Acceptable: M13 resolves per-status-field collapse; S1 resolves per-row duplication. Both target `memory_save` but at different layers.
- **Watch-P1 upgrade mid-remediation.** If confirmed, upgrade to P0-E with 3-day fix estimate (A0 + A2); insert into P0-B/S4 parallel track. Do NOT delay remediation to wait for confirmation — run both tracks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | 63 distinct findings across ~37 files; 4 P0 composites; 7 structural + 13 medium + 29 quick-win refactors; 7 test migrations |
| Risk | 22/25 | Every fix is a structural change to production runtime paths; test-suite migration is load-bearing; silent-fail-open mode is the worst diagnostic profile |
| Research | 18/20 | 50-iteration Opus 4.7 synthesis + 129 raw findings complete; remaining unknown is Domain-5 test gap audit (§8.2) and 5 adversarial repros (§8.3) |
| **Total** | **64/70** | **Level 2 (upper band)** — flagged for Level 3 upgrade consideration if Watch-P1 escalates mid-implementation |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Four questions remain unanswered from the research and must resolve during Phase 016 remediation Week 1:

1. **Does `command-spec-kit` enforce Gate 3 independently of skill routing?** (Determines whether Watch-P1 becomes P0-E.) Resolve via code inspection of the `command-spec-kit` dispatcher plus live repro: invoke `/spec_kit:deep-research` → `command-spec-kit` bridge and observe whether spec-folder creation occurs.
2. **Are the existing regression tests that encode degraded contracts intentional compatibility shims or oversights?** (Determines whether test migration is clean delete-and-replace or requires compatibility shims.) Resolve via git log + PR message archaeology for each of the 7 test files in §7.
3. **Can `HookState` gain a `schemaVersion` field without breaking already-quiesced state files?** (Determines whether A3 needs a migration step.) Resolve by scanning `/tmp` on reference machines for existing HookState files and attempting schema-upgrade dry-run.
4. **Full enumeration of `/spec_kit:*` subcommands needing bridge entries?** (Determines scope of S4/A0.) Enumerate via `grep` over `command/spec_kit/` and feature catalog. Initial set: `plan`, `complete`, `implement`, `deep-research`, `deep-review`, `resume`.

Additional open questions (not blocking Phase 016 remediation start):

5. Does `setLastGitHead()` on partial-persistence success block later stale detection? (`ensure-ready.ts`)
6. Does `handlers/code-graph/context.ts` inherit readiness-fail-open from `code_graph_query`?
7. Does `executeMerge()` CAS also check governance scope, or only `updated_at` + `content_hash`?
8. `entity-linker.ts` — cross-memory or per-memory stale-entity blast radius?
9. Real timeline between reconsolidation planning and `writeTransaction` acquisition under load?
10. Can a crafted `producer` string with `]` or newline break `[PROVENANCE:]` marker exploitably? (§8.3 adversarial repro required before REQ-013)
11. Complete enumeration of `runtimeState` fields that can be injected into `substitutePlaceholders()`; any network/external-API-origin fields?
12. Shared event schema for `intake_triggered` / `intake_completed`, or does each asset emit independently?
13. Does `.opencode/skill/system-spec-kit/references/intake-contract.md` define `folderState` as valid synonym for `startState`, or is `.opencode/skill/system-spec-kit/SKILL.md` / `.opencode/skill/system-spec-kit/README.md` usage undocumented drift?

See `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §8.4 for full question list with file:line references.

### Cross-Cutting Systemic Themes

The 63 distinct findings distribute across 5 architectural anti-patterns plus a 10-item cross-file anti-pattern roster. The five strongest signals (per `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §5):

1. **§5.1 Success-shaped envelope masking skip/defer/partial/failed state.** Files: `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts`, `graph-metadata-parser.ts`. Architectural fix: `OperationResult<T>` uniform result shape. ~2 weeks. Resolves ~15 findings. Hardest part is test migration.

2. **§5.2 Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit).** Files: `hook-state.ts` + `session-stop.ts`; `reconsolidation-bridge.ts` + `reconsolidation.ts`; `graph-metadata-parser.ts`. Architectural fix: (a) CAS at commit, (b) same-transaction re-read, (c) single-snapshot batched reads. Core of P0-B (S1) and P0-A (S2 `updateState()`). ~3 weeks.

3. **§5.3 Collapsed state vocabulary (missing/empty/stale/degraded).** Files: `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts`. Architectural fix: introduce `absent` and `unavailable` as distinct labels. M8. ~1.5 weeks.

4. **§5.4 Governance signal amnesia.** Files: `skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, SKILL.md files, `graph-metadata.json` files, `manual-playbook-runner.ts`, `AGENTS.md`, `/spec_kit:*` YAML assets. Architectural fix: every transition asserts faithful forwarding OR explicitly logs intentional drop. Iterative across S4, S5, S6, S7. ~4 weeks total.

5. **§5.7 Deterministic / shared temp path under concurrency.** Files: `hook-state.ts`, `graph-metadata-parser.ts`, command YAMLs, runtime root docs, `data-loader.ts`. Architectural fix: remove `/tmp/save-context-data.json` from 4 surfaces + unique temp suffix. ~1 day (mostly doc editing).

Full 10-item cross-file anti-pattern roster and 16-item reinforcement-chain map in `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §5.5 and §5.6.

### Related Documents

- **Canonical Research Source**: `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` (1537 lines, Opus 4.7 synthesis)
- **Structured Finding Inventory**: `../research/016-foundational-runtime-pt-01/findings-registry.json`
- **Narrative Research**: `../research/016-foundational-runtime-pt-01/research.md`
- **Iteration Evidence**: `../research/016-foundational-runtime-pt-01/iterations/iteration-{001..050}.md`
- **Interim Syntheses**: `interim-synthesis-{32,38,41,44,47}-iterations.md` (in research folder)
- **Deep-Research State**: `../research/016-foundational-runtime-pt-01/deep-research-{config.json,state.jsonl,strategy.md,dashboard.md}`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Prior Deep Review**: `../015-deep-review-and-remediation/`
- **Parent 026 Spec**: `../spec.md`
<!-- /ANCHOR:questions -->
