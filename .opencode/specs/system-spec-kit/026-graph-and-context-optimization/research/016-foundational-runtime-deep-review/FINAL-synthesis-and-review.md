# FINAL Synthesis and Review — Phase 016 Foundational Runtime Deep Review

**Status:** AUTHORITATIVE. 50 iterations complete. Domains 1–4 complete; Domain 5 recovered as a transversal pass from subsidiary evidence.
**Source span:** `iteration-001.md` through `iteration-050.md` (50 iterations) plus interim syntheses at iterations 32, 38, 41, 44, 47.
**Author:** synthesis agent (read-only analysis pass)
**Date:** 2026-04-16
**Scope:** `.opencode/skill/system-spec-kit/mcp_server/` and associated governance surfaces (`skill_advisor/`, command assets, manual playbook runner, runtime root docs).

This document is the final deliverable of Phase 016. It consolidates the raw iteration findings, the five interim syntheses, and the original Copilot deep-dive into a single action-oriented report intended to drive Phase 017+ remediation.

---

## 1. Executive Summary

### 1.1 Headline numbers

| Metric | Final count (iterations 1–50) |
| ------ | ----------------------------- |
| Iterations read | 50 |
| Raw findings emitted (incl. cross-domain duplicates) | 129 |
| P1 findings (raw) | 66 |
| P2 findings (raw) | 63 |
| P0 findings (raw) | 0 |
| **Distinct issues after deduplication** | **~63** |
| **Unique file/surface hits** | **37** |
| **Distinct anti-patterns (cross-cutting)** | **10** |
| P0-escalation candidates (composite) | 4 confirmed (A, B, C, D) + 1 watch-priority-1 |

### 1.2 Highest-severity threats (P0 candidates)

Phase 016 did not raise any single iteration-level finding to P0. Instead, it assembled **four distinct interaction-effect P0 candidates** where layered P1 + P2 findings combine into systemic, persistent data-integrity or control-plane failures:

- **P0-candidate-A — Cross-runtime tempdir control-plane poisoning.** Hook-state corruption reaches Claude + Gemini + OpenCode simultaneously and spans prompt-visible text, write targeting, cost analytics, and cleanup. Ten constituent findings.
- **P0-candidate-B — Reconsolidation conflict + complement duplicate/corruption window.** Governed memory writes can fork lineage, double-insert complement rows, and admit or exclude candidates based on mid-transaction scope changes. Six constituent findings.
- **P0-candidate-C — Graph-metadata laundering + packet-search boost.** Malformed modern `graph-metadata.json` is accepted as legacy, stamped with fresh timestamps, rewritten as canonical JSON, assigned `qualityScore: 1`, and boosted +0.12 in packet search — all while the original corruption signal is erased. Six constituent findings.
- **P0-candidate-D — TOCTOU cleanup erasing fresh state under live session load.** A routine `--finalize` cleanup sweep overlapping with live writers can delete the newest session state, make the next startup look like a cold start, and double-count tokens on transcript re-parse. Four constituent findings. Triggered by normal maintenance rather than abnormal load.

A fifth candidate — **Domain-4 routing misdirection chain** — is currently **watch-priority-1** (one confirmed step away from P0) after R46-001 identified a concrete routing path from `/spec_kit:deep-research` to the planner bridge at 0.95 confidence.

A sixth candidate — **Stop-hook success-flag durability overstatement** — was considered in the 38-iteration synthesis but has been folded into P0-candidate-A for remediation purposes; both share the same HookState locking + durability-re-verification fix.

### 1.3 What this research means for Phase 017+

The deep review confirms that the runtime is **not broken in obvious ways** — there are no crashes, no unhandled exceptions, no compile errors. Every failure mode is **silent**, **success-shaped**, and **layered**. This has three consequences:

1. **Remediation must be structural, not patchwork.** Each P0 candidate is an interaction effect across multiple files. Fixing one constituent finding in isolation produces partial progress at best and creates new "looks correct" surfaces at worst. Phase 017 should commit to structural refactors (enum-valued status fields, transactional reconsolidation, HookState schema + locking, typed governance vocabularies) rather than per-file patches.
2. **Regression tests encode the degraded contract.** At least eight test files in `mcp_server/tests/` assert the collapsed or fail-open behavior and must be rewritten as part of any structural fix (see §6.3). Remediation is a test-migration problem, not only a code problem.
3. **Governance is unmechanized.** Domain 4 revealed that Gate 3 triggers, intake-state vocabularies, skill-routing signals, `when:` predicates, and `conflicts_with` edges are all expressed as prose or string tables with no typed enforcement. The routing toolchain is fully wired but terminates before scoring. The most leveraged fix — wiring `intent_signals` into `analyze_request()` plus bridge disambiguation — unlocks accurate routing for the entire `/spec_kit:*` command surface and is a single-week effort.

Phase 017 should treat the four P0 candidates as **anchor workstreams** (one per candidate, roughly parallel) and the ~30 P1 findings as dependency-ordered supporting work. The estimated effort budget is **8–12 engineer-weeks** for all four P0 candidates plus their supporting P1s; see §8 for the detailed sequencing.

---

## 2. Complete Finding Registry

### 2.1 Findings grouped by source file (deduplicated, cumulative through iteration 50)

| File (all paths under `.opencode/` unless noted) | Raw hits | Distinct issues | Dominant domains | Finding IDs |
| -------------------------------------------- | -------- | --------------- | ---------------- | ----------- |
| `skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | 22 | 10 | D1, D2, D3 | R1-002, R11-001, R12-001, R13-001, R14-001, R15-001, R15-002, R15-003, R20-001, R27-001 (subset), R28-001, R28-002, R31-002, R32-002, R33-002, R33-003, R34-001, R35-002, R37-001, R37-002, R39-001 |
| `skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | 18 | 9 | D2, D3 | R2-002, R4-002, R4-003, R21-002, R23-003, R25-004, R29-001 (assignment), R31-001, R32-001, R33-001, R36-001, R38-001, R38-002, R40-001 |
| `skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | 16 | 8 | D1, D3 | R6-001, R6-002, R11-004, R12-003, R13-004, R16-002, R19-002, R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 |
| `skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | 14 | 6 | D1, D2 | R7-002, R8-001, R8-002, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001, R27-001 |
| `skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | 11 | 6 | D1, D2 | R3-001, R3-002, R3-003, R11-003, R12-002, R13-003, R16-001, R17-001, R18-001, R19-001, R22-001, R23-001, R25-002 |
| `skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 7 | 4 | D1, D2, D3 | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003, R31-004, R32-004 |
| `skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` | 5 | 3 | D3 | R31-003 (same lib), R32-003, R35-001 |
| `skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | 3 | 2 | D2 | R9-001, R9-002, R26-001 |
| `skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` | 3 | 1 (dedup R1-001 ≡ R2-001 ≡ R4-001) | Foundational | R1-001, R2-001, R4-001 |
| `skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` | 2 | 2 | Foundational | R5-001, R5-002 |
| `skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` / `session-resume.ts` / `session-health.ts` | 5 | 4 | D2, D3 | R24-002, R26-002, R29-001, R30-001, R38-001 |
| `skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts` | 2 | 2 | D2 | R9-002, R30-002 |
| `skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | 1 | 1 | D2 | R22-002 |
| `skill/system-spec-kit/mcp_server/handlers/memory-save.ts` / `save/response-builder.ts` | 2 | 2 | D2 | R21-001, R24-001 |
| `skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` / `hooks/gemini/session-prime.ts` | 2 | 2 | Foundational | R10-001, R10-002 |
| `skill/system-spec-kit/mcp_server/scripts/loaders/data-loader.ts` + command YAMLs | 4 | 2 | D3 | R31-005, R32-005, R35-003, R36-003 |
| `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` | 5 | 3 | D3, D4 | R35-003, R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 |
| `command/spec_kit/assets/spec_kit_plan_auto.yaml` | 6 | 4 | D4 | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 |
| `command/spec_kit/assets/spec_kit_plan_confirm.yaml` | 4 | 3 | D4 | R42-001, R44-003, R47-002, R48-002 |
| `command/spec_kit/assets/spec_kit_complete_auto.yaml` | 2 | 1 | D4 | R48-002 |
| `command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | 1 | 1 | D4 | R50-001 |
| `skill/skill-advisor/scripts/skill_advisor.py` | 7 | 5 | D4 | R41-003, R42-002, R43-001, R44-001, R46-001, R46-002 |
| `skill/skill-advisor/scripts/skill_advisor_runtime.py` | 4 | 3 | D4 | R42-002, R43-001, R44-002 |
| `skill/skill-advisor/scripts/skill_graph_compiler.py` | 5 | 4 | D4 | R41-003, R45-003, R46-002, R49-003 |
| `skill/skill-advisor/graph-metadata.json` + per-skill `graph-metadata.json` | 2 | 2 | D4 | R42-002, R43-001 |
| `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | 5 | 4 | D4 | R41-004, R42-003, R45-004, R46-003, R50-002 |
| `skill/skill-advisor/tests/test_skill_advisor.py` | 4 | 3 | D4 (subsidiary) | R43-001, R45-002, R46-001 |
| `skill/sk-deep-research/SKILL.md` / `skill/system-spec-kit/SKILL.md` | 3 | 2 | D4 | R44-002, R47-002 |
| `skill/skill-advisor/feature_catalog/04--testing/02-health-check.md` | 1 | 1 | D4 | R42-002 |
| `skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md` | 2 | 1 | D4 | R45-001, R47-001 |
| `skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md` | 1 | 1 | D4 | R47-001 |
| `skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md` | 1 | 1 | D4 | R50-002 |
| `skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md` | 1 | 1 | D4 | R50-002 |
| `skill/system-spec-kit/references/intake-contract.md` | 2 | 2 | D4 | R41-001, R47-002 |
| `skill/system-spec-kit/SKILL.md` (routing + body) | 2 | 1 | D4 | R44-002, R47-002 |
| `skill/system-spec-kit/README.md` | 1 | 1 | D4 | R47-002 |
| `skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | 1 | 1 | D4 | R50-001 |

### 2.2 Canonical finding inventory (R1-001 through R50-002)

*Format: `RN-NNN` | File:lines | Severity | One-liner | Downstream impact.*

**Foundational (iterations 1–10)**

| ID | File:lines | Severity | One-liner | Downstream impact |
| -- | ---------- | -------- | --------- | ----------------- |
| R1-001 | `startup-brief.ts:179-192` | P1 | `buildSessionContinuity()` calls `loadMostRecentState()` with no scope; hook-state rejects scope-less calls | Gemini startup never receives prior session continuity even when valid hook state exists |
| R1-002 | `session-stop.ts:60-105,240-309` | P1 | `input.session_id ?? 'unknown'` collapses unrelated sessions onto a shared state file | One bad hook payload poisons the fallback bucket so later sessions pick up the wrong `lastSpecFolder` or `sessionSummary` |
| R2-001, R4-001 | `startup-brief.ts:179-198` | P1 | Dedup of R1-001 | — |
| R2-002 | `hook-state.ts:131-165` | P1 | `loadMostRecentState()` wraps whole scan in one `try`; one malformed file aborts entire lookup; direct caller returns null to all consumers | Resume/startup degrades to cold-start even when a valid sibling exists |
| R3-001 | `code-graph/query.ts:42-58` | P1 | `resolveSubject()` picks first `fq_name`/`name` match with `LIMIT 1`; no `ambiguous_subject` signal | Two overloaded methods collapse silently to the first row; downstream edge/outline queries operate on the wrong node |
| R3-002 | `code-graph/query.ts:319-334` | P1 | Readiness gate fails open; `ensureCodeGraphReady()` exceptions swallowed | Agents get empty query results during graph-build failure, indistinguishable from genuine absence |
| R3-003 | `code-graph/query.ts:551-564` | P2 | Response-level edge trust derived from `result.edges[0]` only | Multi-edge results attribute aggregate trust to a single sample |
| R4-002 | `hook-state.ts:131-166` | P1 | Dedup of R2-002 | — |
| R4-003 | `hook-state.ts:142-155` | P2 | Recent-state authority based on filesystem mtime, not `state.updatedAt` | Touch-based operations (e.g., backup) can mis-rank otherwise-older state |
| R5-001 | `ensure-ready.ts:283-317` | P1 | Successful inline refresh still reports pre-refresh freshness | Downstream consumers see `freshness: 'stale'` and re-trigger refresh unnecessarily |
| R5-002 | `ensure-ready.ts:183-217` | P1 | Partial persistence failures silently treated as successful refresh (file_mtime_ms written before node/edge failure) | Failed files appear fresh on next scan; drift accumulates |
| R6-001 | `reconsolidation-bridge.ts:66-73,243-255,446-454` | P1 | Assistive reconsolidation gated by planner/full-auto switch; default OFF despite docs "default ON" | Advertised default behavior differs from runtime default |
| R6-002 | `reconsolidation-bridge.ts:55-66,80-83,478-482` | P1 | `ASSISTIVE_AUTO_MERGE_THRESHOLD` promises auto-merge; runtime only logs and falls through | Feature flag name overstates capability |
| R7-001 | `api/indexing.ts:111-122` | P1 | `runEnrichmentBackfill` uses `incremental: true, force: false` — fast-path skips unchanged files | Recovery from degraded enrichment misses files that didn't change since the degraded save |
| R7-002 | `post-insert.ts:116-125,159-173` | P1 | Entity extraction soft-fails but flag set `true`; linking runs on stale rows | Auto-entity linkage continues against stale entity rows after extractor failure |
| R8-001 | `post-insert.ts:86-213,223-238` | P1 | `enrichmentStatus = true` for four different outcomes: success, feature-disabled skip, "nothing to do" skip, full deferral | Callers cannot distinguish "skipped," "deferred," "failed," and "succeeded"; cannot recover without re-running |
| R8-002 | `post-insert.ts:116-129,157-181` | P1 | Entity linking gated only by feature flags, not successful extraction | Linking runs against empty/stale entities |
| R9-001 | `shared-payload.ts:592-601` | P1 | `trustStateFromGraphState()` / `trustStateFromStructuralStatus()` collapse `missing` + `empty` into `stale` | Hookless consumers (OpenCode transport) can't tell "graph missing" from "graph stale" |
| R9-002 | `opencode-transport.ts:40-54` | P2 | `coerceSharedPayloadEnvelope()` is shape-only, not contract-level | Type-system passes; semantic provenance gets through unchecked |
| R10-001 | `hooks/gemini/session-prime.ts:55-68` | P1 | Gemini compact-recovery drops cached provenance entirely; Claude preserves it | Cross-runtime prompt divergence; Gemini can't distinguish cached from ordinary recovered text |
| R10-002 | `hooks/claude/shared.ts:109-123` | P2 | Wrapper interpolates provenance directly into `[PROVENANCE:]` without escaping | Drifted/corrupted `payloadContract.provenance` can rewrite prompt-visible marker |

**Domain 1 — Silent Fail-Open Patterns (iterations 11–20, complete)**

| ID | File:lines | Severity | One-liner | Downstream impact |
| -- | ---------- | -------- | --------- | ----------------- |
| R11-001 | `session-stop.ts:199-218,248-276` | P1 | Transcript/producer-metadata failure degrades to warning-only; no machine-readable outcome | Analytics and recovery layers see success-shaped result; cost accounting may double-count |
| R11-002 | `graph-metadata-parser.ts:223-233` | P2 | Legacy fallback returns `ok: true` with no migration marker | Downstream consumers treat legacy output as canonical; migration invisible |
| R11-003 | `code-graph/query.ts:367-385` | P1 | `blast_radius` silently degrades unresolved subjects into seed file paths via `resolveSubjectFilePath(candidate) ?? candidate` | Agents get a non-error-shaped response that conflates "no symbol" with "symbol here" |
| R11-004 | `reconsolidation-bridge.ts:283-295` | P2 | Scope-filtered reconsolidation candidates vanish silently | Legitimate duplicates can be dropped; the save still proceeds as a normal create |
| R11-005 | `post-insert.ts:136-147,187-200` | P2 | `summary`/`graphLifecycle` no-ops normalized to `true` | Feedback loop can't distinguish skip from success |
| R12-001 | `session-stop.ts:85-105,112-117,313-317` | P1 | `runContextAutosave` returns void; no autosave outcome field in `SessionStopProcessResult` | Operators cannot distinguish successful autosave from silent skip |
| R12-002 | `code-graph/query.ts:26-29,441-549` | P2 | Unsupported/misspelled `edgeType` returns ok with empty result | Agent typos produce silent empty results |
| R12-003 | `reconsolidation-bridge.ts:283-294` | P2 | `(opts.limit ?? 3) * 3` pre-filter window can starve in-scope candidates | Higher-signal dupes excluded before scope filter runs |
| R12-004 | `post-insert.ts:96-105` | P2 | `causalLinks` status set true before checking `unresolved.length` | Partial causal-link failure reported as success |
| R12-005 | `post-insert.ts:159-173` | P2 | `entityLinking.skippedByDensityGuard` collapsed into success | Density-guard skip looks identical to successful linking |
| R13-001 | `session-stop.ts:60-67,308-312` | P1 | `runContextAutosave` silently skips when `lastSpecFolder`/`sessionSummary` unset | Continuity loss invisible; operator cannot distinguish from "autosave disabled" |
| R13-002 | `graph-metadata-parser.ts:280-285,457-475,831-860` | P1 | `readDoc()` collapses I/O failure to `null`; `deriveStatus()` misreads as `planned`/`complete` | Transient read failure → indexed as freshly-saved packet with no error signal |
| R13-003 | `code-graph/query.ts:340-364` | P2 | Outline queries degrade unknown/path-mismatched files into ok with `nodeCount: 0` | Spelling errors in `subject` look identical to "file has no symbols" |
| R13-004 | `reconsolidation-bridge.ts:261-270,438-442` | P1 | Any thrown error (checkpoint, reconsolidate, similarity, conflict store) caught and falls through to normal create without structured warning | Four different failure modes collapse into one success-shaped path |
| R13-005 | `post-insert.ts:96-109,210-214` | P2 | Causal-link partial unresolved refs treated as successful run | Partial failure invisible |
| R14-001 | `session-stop.ts:175-193,257-268,274-276` | P1 | `storeTokenSnapshot` writes `lastTranscriptOffset: 0` before producer metadata builds; catch swallows later failure | Committed offset can remain at 0; next stop hook re-parses full transcript; duplicate token accounting |
| R14-002 | `code-graph/query.ts:26-39,442-555` | P2 | Dup of R12-002 | — |
| R14-003 | `post-insert.ts:94-113` | P1 | Partial causal-link failures normalized into successful enrichment | Same as R12-004, confirmed |
| R14-004 | `post-insert.ts:159-177` | P2 | Dup of R12-005 | — |
| R15-001 | `session-stop.ts:61-77,281-309` | P1 | Transcript-driven retargeting silently rewrites autosave destination | One bad transcript tail → autosave into wrong packet |
| R15-002 | `session-stop.ts:294-295,340-369` | P2 | 50 KB tail window can hide real active packet | Long conversations lose packet authority evidence |
| R15-003 | `session-stop.ts:294-295,370-378` | P1 | Transcript I/O failure collapsed into same "ambiguous" path as normal ambiguity | Real I/O failure invisible to retarget logic |
| R16-001 | `code-graph/query.ts:417-436,547-548` | P1 | `includeTransitive: true` runs before switch-level validation; unsupported ops default to CALLS | Agent passing unknown operation gets `calls` traversal silently |
| R16-002 | `reconsolidation-bridge.ts:295-305` | P2 | Malformed vector-search rows coerced into sentinel values | Bad row silently substituted with default; downstream treats it as real candidate |
| R17-001 | `code-graph/query.ts:442-559` | P2 | Dangling edges returned as successful relationships with raw `edge.targetId` | Phantom edge exposed as first-class relationship |
| R17-002 | `post-insert.ts:106-109,126-129,148-151,174-177,201-214` | P2 | Exception-driven enrichment failures still report `executionStatus=ran` | Five different failure types unified under `ran` |
| R18-001 | `code-graph/query.ts:94-99,551-565` | P2 | Query-level `detectorProvenance` silently degrades to global last-index snapshot | Empty result advertises `structured` provenance |
| R18-002 | `graph-metadata-parser.ts:228-242` | P2 | Legacy fallback discards original current-schema validation errors | Diagnostic state erased at migration boundary |
| R19-001 | `code-graph/query.ts:127-166,417-436` | P2 | Transitive traversal silently degrades dangling nodes into ok with null metadata | Phantom relationships accumulate |
| R19-002 | `reconsolidation-bridge.ts:453-511,514-518` | P2 | Assistive reconsolidation failures fall open to ordinary save; no machine-readable signal | Advisory workflow breaks silently |
| R20-001 | `session-stop.ts:199-218,248-268` | P1 | `buildProducerMetadata()` re-stats live transcript; metadata describes later state than parsed one | Cursor/offset and metadata describe different transcript generations |
| R20-002 | `graph-metadata-parser.ts:167-205,223-233` | P2 | Legacy fallback fabricates `created_at`/`last_save_at` via `new Date().toISOString()` | Corrupted file gets freshly-minted timestamps; laundering signal |
| R20-003 | `code-graph/query.ts:94-105,551-564` | P2 | Dup of R18-001 | — |

**Domain 2 — State Contract Honesty (iterations 21–30, complete)**

| ID | File:lines | Severity | One-liner | Downstream impact |
| -- | ---------- | -------- | --------- | ----------------- |
| R21-001 | `response-builder.ts:311-322,569-573` | P1 | `memory_save` response collapses post-insert truth further than `post-insert.ts` does | MCP clients can't tell deferred vs partial vs skipped vs succeeded |
| R21-002 | `hook-state.ts:83-87` | P1 | `JSON.parse(raw) as HookState` with no validation; feeds prompt replay + autosave routing | Malformed parseable state poisons prompt-visible text and continuity targets |
| R21-003 | `graph-metadata-parser.ts:223-233,264-275,1015-1019` | P1 | `refreshGraphMetadataForSpecFolder()` launders malformed modern JSON into canonical refreshed artifact | Corruption signal erased; repair path canonizes broken data |
| R22-001 | `code-graph/query.ts:61-83,94-99,319-364,551-564` | P1 | Self-contradictory success payload: readiness `empty` + `detectorProvenance: structured` | Query response contradicts itself; consumer reads one field or the other |
| R22-002 | `memory-parser.ts:293-330` | P1 | Fallback-recovered `graph-metadata` gets `qualityScore: 1`, +0.12 packet boost | Corrupt-recovered metadata outranks clean spec docs |
| R23-001 | `code-graph/query.ts:319-361` | P1 | Query exposes `empty` readiness while bootstrap canonicalizes same condition as `missing` | Readiness vocabulary diverges across surfaces |
| R23-002 | `graph-metadata-parser.ts:223-233` | P1 | Schema-invalid-as-legacy → first-class `graph_metadata` indexing → retrieval priority upgrade | Broken file promoted to canonical within same indexing pass |
| R23-003 | `hook-state.ts:83-87` | P2 | Compact-cache expiry observationally identical to cache absence | Expiry semantics collapsed into cold state |
| R24-001 | `memory-save.ts:1616-1678,2362-2384` | P1 | `runEnrichmentBackfill` advertised before enrichment runs; only deferred case gets typed recovery | Runtime degradation branches get warning strings; deferred gets structured action |
| R24-002 | `session-resume.ts:174-188,415-429,560-563` | P1 | Cached scope drives `fallbackSpecFolder` but OpenCode transport uses `args.specFolder ?? null` | Transport layer sees null when fallback would have picked a valid packet |
| R25-001 | `post-insert.ts:223-237` | P2 | Deferred-enrichment all-booleans-true contract codified by tests | Test fixture locks in broken contract |
| R25-002 | `code-graph/query.ts:319-334` | P2 | Ambiguous readiness branch effectively unguarded; tests hoist `fresh`/`structured` defaults | Test setup masks the real branch |
| R25-003 | `graph-metadata-parser.ts:223-233` | P2 | Schema-invalid-as-legacy codified as clean success contract | Test fixture locks in laundering |
| R25-004 | `hook-state.ts:83-87` | P1 | Unvalidated `JSON.parse` fans out across Claude + Gemini runtimes | Single corrupt file reaches 5 hook entrypoints |
| R26-001 | `shared-payload.ts:598-601` | P2 | Missing→stale collapse now directly asserted public contract via tests | Regression suite enforces the lie |
| R26-002 | `session-health.ts:136-166` | P2 | `session_health` doesn't attach section-level `structuralTrust` axes | Health surface weaker than bootstrap/resume |
| R27-001 | `post-insert.ts:187-200` | P1 | `graphLifecycle=true` even when `onIndex` returns `skipped:true`; `runEnrichmentBackfill` can't unblock | Backfill permanently blind to specific skip reason |
| R27-002 | `context-server.ts:801-816` | P1 | Routing still recommends `code_graph_query` despite readiness-fail-open gap | Routing layer endorses degraded surface |
| R28-001 | `session-stop.ts:244-275` | P1 | `loadState()` returning `null` on parse failure indistinguishable from genuine cold start; `startOffset = 0` re-parses transcript | Cold-start look-alike triggers transcript replay; inflated token counts |
| R28-002 | `session-stop.ts:60-67,279-309,340-369` | P1 | Null collapse also strips `currentSpecFolder` disambiguator for `detectSpecFolder` | Packet detection loses preferred target |
| R29-001 | `session-resume.ts:174-208` | P1 | Cached-summary `schemaVersion` check fabricated; HookState has no version field | Schema-drift rejection path unreachable for real inputs |
| R29-002 | `session-prime.ts:130-143` | P2 | Claude startup collapses all rejection reasons into same "no cached continuity" state | Schema-mismatch invisible at startup surface |
| R30-001 | `session-bootstrap.ts:321-347` + `session-resume.ts:530-551` | P1 | Same payload carries `trustState=stale` AND `graphOps.readiness.canonical=empty` | Two sibling fields disagree within one response |
| R30-002 | `opencode-transport.ts:64-71,98-149` | P1 | OpenCode transport drops richer structural truth; renders only collapsed provenance label | Hookless OpenCode sees the dishonest label |

**Domain 3 — Concurrency and Write Coordination (iterations 31–40, complete)**

| ID | File:lines | Severity | One-liner | Downstream impact |
| -- | ---------- | -------- | --------- | ----------------- |
| R31-001 | `hook-state.ts:169-176,221-240` | P1 | Deterministic `filePath + '.tmp'` means two writers for the same session swap bytes before rename | Two concurrent producers can corrupt hook-state atomically |
| R31-002 | `session-stop.ts:60-67,119-125,261-268,283-309` | P1 | Multiple `recordStateUpdate()` + final disk reload by `runContextAutosave()` create torn-state autosave window | Autosave persists mix of fields from different stop events |
| R31-003 | `reconsolidation-bridge.ts:282-295` + `reconsolidation.ts:467-508` | P1 | `executeConflict()` has no predecessor-version or scope recheck; merge defends, conflict does not | Concurrent saves can both deprecate same predecessor |
| R31-004 | `graph-metadata-parser.ts:969-989` | P2 | `process.pid + Date.now()` temp path collides at millisecond precision | Same-process writes within one ms → temp file collision |
| R31-005 | `data-loader.ts:59-111` + command YAMLs | P2 | `/tmp/save-context-data.json` is a documented shared handoff path | Parallel Copilot/Claude/Codex/Gemini sessions overwrite each other |
| R32-001 | `hook-state.ts:170-176,221-241` | P1 | `updateState` returns merged even after failed persist | Consumer sees `updated` object that is not on disk |
| R32-002 | `session-stop.ts:60-67,119-125,244-246,261-268,281-289,302-309` | P1 | Dup of R31-002 | — |
| R32-003 | `reconsolidation-bridge.ts:270-306` + `reconsolidation.ts:611-656` | P1 | Scope-retag between filter and commit not re-checked at conflict/merge | Row mutated out of scope between filter and commit still treated as in-scope |
| R32-004 | `graph-metadata-parser.ts:969-989` | P2 | Dup of R31-004 | — |
| R32-005 | `command/memory/save.md`, `spec_kit/deep-research.md`, `spec_kit/deep-review.md` + `generate-context.ts:61-82` | P2 | Multiple command surfaces hardcode the shared path | Documentation at four independent surfaces |
| R33-001 | `hook-state.ts:184-205`; `session-prime.ts:43-46,281-287` | P1 | `clearCompactPrime()` clears by session ID only, not payload identity; newer payload erased on overlap | Fresh precompact write deleted silently |
| R33-002 | `session-stop.ts:119-125,244-268`; `hook-state.ts:221-241` | P1 | Overlapping stop hooks can regress `lastTranscriptOffset` backwards; no monotonicity guard | Duplicate token counting under overlap |
| R33-003 | `hook-state.ts:170-180,221-241`; `session-stop.ts:60-67,119-125,261-309` | P1 | Failed `saveState` does not abort autosave; `runContextAutosave` can persist stale disk state | Autosave proceeds with known-failed persist |
| R34-001 | `session-stop.ts:119-125,261-269,302-318`; `hook-state.ts:221-240` | P1 | `producerMetadataWritten` is attempted-write flag, not durable postcondition | Analytics treat attempted-write as truth |
| R34-002 | `reconsolidation-bridge.ts:261-306`; `reconsolidation.ts:599-694`; `memory-save.ts:2159-2171,2250-2304` | P1 | Complement path: stale-search duplicate window between `runReconsolidationIfEnabled` and `writeTransaction` | Duplicate insert under overlap; "complement" decision is stale |
| R35-001 | `reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508,610-658,952-993` | P1 | Conflict lane not single-winner; two concurrent saves can both supersede same predecessor, forking lineage | Multiple "replacement" memories claim same predecessor |
| R35-002 | `session-stop.ts:119-125,313-317`; `hook-state.ts:170-180,221-240` | P2 | `touchedPaths` appended unconditionally regardless of `saveState` outcome; overstate durability | Second attempted-write flag compounds R34-001 |
| R35-003 | `AGENTS.md:205-207`; `CLAUDE.md:152-155`; `CODEX.md:205-207`; `GEMINI.md:205-207`; `generate-context.ts:61-83` | P2 | All four runtime root docs prescribe shared `/tmp/save-context-data.json` handoff | Cross-runtime collision by design |
| R36-001 | `hook-state.ts:140-155,170-176` | P2 | `loadMostRecentState` stat-then-read race: concurrent rename can swap generation between mtime read and JSON read | Freshness from one generation, content from another |
| R36-002 | `reconsolidation-bridge.ts:453-501`; `memory-save.ts:2159-2170,2250-2304` | P2 | Assistive reconsolidation recommendation built from pre-transaction snapshot; can be stale on delivery | Review recommendation against already-superseded memory |
| R36-003 | `data-loader.ts:63-68`; `generate-context.ts:61-83` | P2 | `NO_DATA_FILE` error text teaches callers to use shared `/tmp/save-context-data.json` path | Runtime error message re-propagates the hazard |
| R37-001 | `session-stop.ts:175-190,244-252,257-268` | P1 | Transient `lastTranscriptOffset: 0` sentinel between two writes; second concurrent stop hook can re-parse from zero | Third distinct mechanism for duplicate token accounting |
| R37-002 | `session-stop.ts:128-145,244-246,281-296,340-369` | P1 | Stale `currentSpecFolder` preference can suppress legitimate packet retarget when another writer advanced the target | Packet authority locked to old generation |
| R37-003 | `reconsolidation-bridge.ts:261-306,453-500` | P2 | Single save can observe two different pre-transaction candidate universes (TM-06 then assistive) | Intra-request split snapshot |
| R38-001 | `hook-state.ts:131-165`; `session-resume.ts:348-366` | P2 | `loadMostRecentState` all-or-nothing `try` block; one bad sibling file aborts entire scan and returns null | One poison-pill file suppresses all sibling recovery |
| R38-002 | `hook-state.ts:243-263`; `session-stop.ts:321-328`; `gemini/session-stop.ts:77-84` | P2 | `cleanStaleStates` all-or-nothing `try` block; partial removed count returned with no indication of skipped files | Aborted cleanup reports normal success |
| R39-001 | `session-stop.ts:60-67,108-117,299-318` | P1 | Autosave outcome (ran/skipped/failed) never surfaced in `SessionStopProcessResult`; callers cannot distinguish success from silent skip | Continuity loss invisible to consumers |
| R39-002 | `reconsolidation-bridge.ts:203-237,282-306` | P1 | Governed scope filter reads each candidate's row individually outside any transaction; mixed-snapshot candidate universe | Row scope can change between consecutive per-candidate lookups |
| R40-001 | `hook-state.ts:170-176,247-255`; `session-stop.ts:321-328` | P2 | `cleanStaleStates` TOCTOU: stat-then-unlink can delete fresh state written between those two calls | Cleanup can erase live state; `removed` count normal |
| R40-002 | `reconsolidation-bridge.ts:203-236,282-295,453-465` | P1 | (Extension of R39-002) same per-candidate scope read / mixed-snapshot problem confirmed in both TM-06 and assistive paths | Confirms R39-002 spans both non-merge reconsolidation paths |

**Domain 4 — Stringly-Typed Governance (iterations 41–50, complete)**

| ID | File:lines | Severity | One-liner | Downstream impact |
| -- | ---------- | -------- | --------- | ----------------- |
| R41-001 | `spec_kit_plan_auto.yaml:338-355,371-372`; `plan.md:93-99`; `intake-contract.md:66-77,217-222` | P2 | Autonomous plan workflow uses `populated` while canonical contract uses `populated-folder`; interpreter-dependent string comparison | Different runtimes can classify folder state differently |
| R41-002 | `AGENTS.md:182-186`; `plan.md:86-89`; `complete.md:74-77` | P2 | Gate 3 trigger list is prose English word list; different runtimes can classify the same request differently | Cross-runtime gate enforcement drift |
| R41-003 | `skill_graph_compiler.py:272-353,630-663`; `skill_advisor.py:203-265` | P1 | Skill-graph topology checks advisory-only; `--validate-only` returns success for graphs that violate routing invariants | "Validation passed" lies about contract satisfaction |
| R41-004 | `manual-playbook-runner.ts:224-246,251-317,438-445` | P1 | Markdown → `Function(...)()` eval with no sandbox; documentation drift can become arbitrary Node-side execution | Code-execution surface keyed on markdown fragments |
| R42-001 | `spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-416`; `plan.md:96-98` | P2 | `intake_only == TRUE` / `folder_state == populated` as quoted string expressions; no mechanical grammar contract | Runner change in expression evaluation can invert branch silently |
| R42-002 | `skill_advisor_runtime.py:93-97,165-203`; `skill_advisor.py:1185-1200,1841-1888`; `graph-metadata.json:1-37` | P2 | Skill-routing authority split across two unsynchronized inventories: SKILL.md discovery vs compiled graph | `health_check()` returns ok even when inventories disagree |
| R42-003 | `manual-playbook-runner.ts:319-375,983-1016` | P2 | Automation eligibility governed by filename substrings + prose-shaped command parsing | Renaming a markdown file changes automation status |
| R43-001 | `skill_advisor_runtime.py:111-141,165-203`; `skill_advisor.py:105-116,140-152,180-187,1669-1694`; `mcp-coco-index/graph-metadata.json:31-50` | P1 | Live skill router does not consume per-skill `intent_signals` / `derived.trigger_phrases`; `signals` map populated but has no consumer in `analyze_request()` | Metadata updates can't affect routing; hand-coded dictionaries remain authoritative |
| R43-002 | `spec_kit_plan_auto.yaml:343-372,375-392`; `plan.md:93-99` | P2 | `/spec_kit:plan` autonomous Step 0 depends on untyped expression DSL with no pinned grammar | Branch logic lives in YAML strings; no direct automated coverage |
| R44-001 | `skill_advisor_runtime.py:111-152`; `skill_advisor.py:165-190,1669-1725` | P1 | (Consolidates R43-001) `intent_signals` silently discarded at scoring boundary; compile/load pipeline works but has no consumer | Invisible discard of graph-metadata routing signals |
| R44-002 | `skill_advisor_runtime.py:161-203`; SKILL.md keyword comment blocks | P2 | `parse_frontmatter_fast()` stores only `key: value` scalar lines; `<!-- Keywords: ... -->` comment blocks stripped before routing | SKILL.md keyword comment hints inert |
| R44-003 | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml` | P2 | Unsigned boolean DSL (`intake_only == TRUE`) | Expression language unspecified |
| R45-001 | `AGENTS.md:182-186`; `002-confirm-mode-checkpointed-review.md:26-32`; `plan.md:86-89`; `memory-save-planner-first.vitest.ts:12-214` | P2 | Gate 3 trigger list includes `analyze`, `decompose`, `phase`; read-only deep-review/deep-research prompts reuse these tokens | False positives: read-only review can trigger unnecessary spec-folder setup |
| R45-002 | `skill_advisor.py:568-577,771-813,1669-1694`; `test_skill_advisor.py:73-186` | P2 | Deep-research prompts containing `audit`/`review` tokens score within 0.02 of `sk-code-review`; no ranking-stability test | Wording-sensitive routing; ties between review and deep-research |
| R45-003 | `skill_graph_compiler.py:559-568,630-663`; `skill_advisor.py:1841-1888`; `test_skill_advisor.py:141-165` | P1 | Topology warning state non-durable: ZERO-EDGE WARNINGS emitted then dropped from serialized graph; `health_check()` returns `status: ok` with `skill_graph_loaded: true` after warnings | "Validation passed" + "health ok" both advertise success while graph violates invariants |
| R45-004 | `manual-playbook-runner.ts:245-271,1203-1217`; `manual_testing_playbook.md:196-230`; `spec.md:131-134` | P1 | `parseScenarioDefinition()` returns null on parse failure; `main()` filters nulls before coverage count; 10/291 active scenario files unparseable on 2026-04-16 | Coverage reports understate active scenario tree |
| R46-001 | `skill_advisor.py:980-1021,1404-1410,1647,1741-1768`; `test_skill_advisor.py:73-186` | P1 | `COMMAND_BRIDGES` registers only `/spec_kit` and `spec_kit:` prefix markers; `detect_explicit_command_intent()` stops at first containment match; all `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority=2` | `/spec_kit:deep-research` → `command-spec-kit` 0.95, `sk-deep-research` 0.70 |
| R46-002 | `skill_graph_compiler.py:272-319,501-568,630-663`; `skill_advisor.py:141-187,321-339`; `test_skill_advisor.py:73-186` | P1 | `validate_edge_symmetry()` never inspects `conflicts_with` edges; unilateral metadata edit silently creates bilateral runtime penalty | Routing behavior changes from unilateral metadata edit with no validation gate |
| R46-003 | `manual-playbook-runner.ts:181-194,427-445,930-943,1112-1117` | P1 | `parsedStepArgs()` routes brace-prefixed text to `evaluateObjectLiteral()`; `substitutePlaceholders()` injects `runtimeState.lastJobId` from prior handler payloads into `Function(...)` string | Tool output is now part of the evaluated code string; trust boundary wider than repository-owned markdown |
| R47-001 | `AGENTS.md:182-185`; `002-confirm-mode-checkpointed-review.md:26-32,44-45`; `026-ruled-out-directions-in-synthesis.md:26-32,44-45` | P2 | Concrete shipped scenarios with `phase transition`/`synthesis phase` — both read-only validation prompts reuse Gate 3 trigger `phase` verbatim | Confirms R45-001 false-positive with repo evidence |
| R47-002 | `spec_kit_plan_auto.yaml:337-373`; `spec_kit_plan_confirm.yaml:360-398`; `intake-contract.md:39-49,56-76`; `SKILL.md:563,931`; `README.md:624-626` | P2 | `/spec_kit:plan` maintains two-vocabulary state machine: local `folder_state` classifier → canonical `start_state`; top-level docs collapse both into one label | Downstream consumers may treat wrong enum as canonical |
| R48-001 | `AGENTS.md:138-145,182-204`; `skill_advisor.py:980-988,1112-1115`; `query-classifier.vitest.ts:24-37,45,170-175,479-489`; `query-router.vitest.ts:68-74,290-295` | P2 | Gate 3's file-modification trigger list omits `save context`, `save memory`, `/memory:save` even though same file declares `MEMORY SAVE RULE` keyed on these phrases | Gate 3 false-negative for repository's own memory-save workflow |
| R48-002 | `spec_kit_plan_auto.yaml:354-391,548-555`; `spec_kit_plan_confirm.yaml:372-416,606-612`; `spec_kit_complete_auto.yaml:465-483,1008-1012` | P2 | `when:` field overloaded as both executable predicate and prose timing note within same asset | Schema cannot be mechanically validated without interpreter-specific conventions |
| R49-001 | `AGENTS.md:142-144,182-186,201-204` | P2 | (Consolidates with R48-001) Write intent governed by two unsynchronized string classifiers: Gate 3 and `MEMORY SAVE RULE` | Equivalent write requests take different governance paths based on wording |
| R49-002 | `spec_kit_plan_auto.yaml:354,372,380,391,555` | P2 | (Consolidates with R48-002) Same `when:` key carries both boolean-like predicates and free-form narrative timing prose | Strict interpreters mis-handle prose; permissive ones accept opaque strings |
| R49-003 | `skill_graph_compiler.py:437-472,623-663` | P1 | `validate_dependency_cycles()` only detects two-node reciprocal cycles; longer `depends_on` loops pass `--validate-only` | Live repro 2026-04-16: `a -> b -> c -> a` returns empty `three_node` array; cyclic graph passes validation |
| R50-001 | `AGENTS.md:182-186`; `spec_kit_deep-research_auto.yaml:159-167,521-526`; `deep-research-reducer.vitest.ts:53-58,145-146,264-270,286-295` | P1 | Gate 3 hard-block trigger list has false-negative for deep-research `resume` write path; `resume` is a tested write flow producing `iteration-NNN.md` + JSONL appends | Packet writes without matching trigger words; spec-folder setup may be skipped |
| R50-002 | `097-async-ingestion-job-lifecycle-p0-3.md:35-37`; `144-advisory-ingest-lifecycle-forecast.md:35-36`; `manual-playbook-runner.ts:438-445,544-548,612-616`; `manual_testing_playbook.md:194-199`; `002-full-playbook-execution/spec.md:131-134` | P2 | Live corpus contains two incompatible argument dialects for the same tool family (`memory_ingest_status({jobId})` vs `memory_ingest_status({ jobId:"<job-id>" })`); shorthand form depends on undefined JS scoping | Runner can crash or silently skip lifecycle checks on documentation-quality edits |

### 2.3 Per-file root-cause analysis — top 10 files

For the 10 files with the most distinct issues (from §9.3), the dominant failure pattern and its root cause:

**1. `hooks/claude/session-stop.ts` (10 distinct issues).** Split-brain autosave + success-shaped durability signals.

Root cause: `processStopHook()` captures `stateBeforeStop = loadState(sessionId)` once, then makes three independent `recordStateUpdate()` calls for different fields (transcriptOffset, producerMetadata, sessionSummary/specFolder), then hands off to `runContextAutosave()` which re-reads state from disk. Every interleaved writer can change the composition of what autosave actually saves. On top of this, the result type `SessionStopProcessResult` exports `producerMetadataWritten` and `touchedPaths` as machine-readable fields, but both are attempted-write flags with no durability re-verification. Combined with `runContextAutosave()` silently skipping when inputs are missing (R13-001), proceeding after `saveState()` failure (R33-003), and never exposing autosave outcome (R39-001), this is the single most concentrated node of distinct issues in the codebase. Fix: S2 (HookState + session-stop overhaul), 2 weeks.

**2. `hooks/claude/hook-state.ts` (9 distinct issues).** Unlocked RMW + TOCTOU + unvalidated parse.

Root cause: Three structurally distinct race classes converge in one file. (a) Writer races: `filePath + '.tmp'` deterministic temp path means two writers for the same session swap bytes before rename (R31-001). (b) Reader races: `loadMostRecentState()` captures mtime from `statSync()` before reading JSON payload, so a concurrent rename mates freshness from one generation with content from another (R36-001). (c) Cleanup races: `cleanStaleStates()` stats an old file, a live writer renames a new generation onto the same path, and `unlinkSync()` deletes the fresh generation (R40-001). Additionally, `JSON.parse(raw) as HookState` has no runtime validation (R21-002), `clearCompactPrime()` clears by session ID not payload identity (R33-001), and the directory scan aborts on one bad sibling (R38-001). Fix: S2 overhaul unifies all of these.

**3. `handlers/save/reconsolidation-bridge.ts` (8 distinct issues).** Pre-transaction snapshots driving conflict/complement/assistive.

Root cause: `runReconsolidationIfEnabled()` runs `vectorSearch()` + scope filtering before the SQLite writer transaction begins. The result set is treated as authoritative when `executeConflict()` / `executeComplement()` / assistive recommendation runs inside the transaction, even though the underlying rows could have changed. Specifically: (a) conflict has no predecessor CAS (R31-003, R35-001); (b) complement has no duplicate re-check (R34-002); (c) assistive computes recommendations from a second independent pre-transaction search (R36-002, R37-003); (d) per-candidate `readStoredScope()` runs fresh per candidate with no batching or transactional guard (R39-002, R40-002). Merge is the counter-example: it DOES have predecessor `updated_at` + `content_hash` CAS. Fix: S1 (transactional reconsolidation), 2 weeks.

**4. `handlers/save/post-insert.ts` (6 distinct issues).** `enrichmentStatus` boolean collapse.

Root cause: Every `enrichmentStatus` field is set via `true` literal rather than by inspecting the helper's return value. Five different helper results (success, feature-disabled, "nothing to do," deferred, failed) all collapse to `true`. The response builder (R21-001) then flattens any `false` booleans to a single generic warning string. Downstream callers and automation cannot mechanically distinguish "re-run work" from "accept legitimate no-op." Fix: M13 (enum-valued status map), 1 week; test migration ~2 days.

**5. `handlers/code-graph/query.ts` (6 distinct issues).** Readiness fail-open + vocabulary divergence.

Root cause: `ensureCodeGraphReady()` exceptions are swallowed at the handler boundary (R3-002); unsupported `edgeType` values return ok with empty result (R12-002); subject resolution fallback silently degrades unresolved subjects to raw paths (R11-003); transitive traversal bypasses the one-hop operation validator (R16-001); dangling edges surface as normal relationships (R17-001); readiness vocabulary diverges from bootstrap (query says `empty`, bootstrap says `missing`, R23-001); and `detectorProvenance` is DB-global (R18-001), so empty results advertise `structured`. The file is a concentration point for Domain 1 silent-fail-open + Domain 2 state-promotion. Fix: Quick wins #8, #13, #14, #16, #17 plus M13 propagation; ~1 week.

**6. `skill_advisor.py` (5 distinct issues).** Invisible-discard + prefix collapse + disambiguation gap.

Root cause: The routing toolchain is fully wired but terminates before scoring (R43-001, R44-001). `intent_signals` are compiled from `graph-metadata.json`, stored in SQLite, deserialized at load time into an in-RAM `signals` map — and then no consumer reads the map in `analyze_request()`. Scoring uses only hard-coded `INTENT_BOOSTERS`, `MULTI_SKILL_BOOSTERS`, and `PHRASE_INTENT_BOOSTERS` tables plus graph topology boosts. On top of this, `COMMAND_BRIDGES` registers only generic prefixes (`/spec_kit`, `spec_kit:`), so all `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority = 2` (R46-001). Ranking stability is absent (R45-002: deep-research and review prompts tied within 0.02). Unilateral `conflicts_with` silently promotes to bilateral penalty (R46-002). Fix: S4 (skill routing trust chain), ~1 week.

**7. `manual-playbook-runner.ts` (4 distinct issues).** `Function(...)` eval + silent drop + inconsistent argument dialects.

Root cause: `parsedStepArgs()` routes brace-prefixed text to `evaluateObjectLiteral()`, which calls `Function(\`return (${replaced});\`)()` with no parser or escaping layer (R41-004). `substitutePlaceholders()` injects `runtimeState.lastJobId` — extracted from prior handler payloads — into the raw string before evaluation (R46-003). So the code string is repository markdown + live API return values. Additionally, `parseScenarioDefinition()` returns null on parse failure and `main()` filters nulls before coverage computation; 10/291 active scenarios were unparseable on 2026-04-16 (R45-004). The live corpus has two incompatible argument dialects (`{ jobId:"<job-id>" }` vs `{jobId}`, R50-002). Fix: S6 (typed step executor + schema-validated fixtures), ~1.5 weeks.

**8. `skill_graph_compiler.py` (4 distinct issues).** Advisory validation + warning amnesia + 2-node-only cycle check + silent `conflicts_with` promotion.

Root cause: `validate_edge_symmetry()` covers `depends_on`/`prerequisite_for`/`siblings` but never inspects `conflicts_with` (R46-002). `validate_dependency_cycles()` only detects two-node reciprocal edges (R49-003; `a → b → c → a` passes `--validate-only`). Topology warnings (symmetry, weight-band, weight-parity, orphan-skill) are printed during compilation but dropped from the serialized graph (R45-003). `health_check()` reports `status: "ok"` whenever one real skill is discovered and the graph loads, regardless of warning state. The CLI returns success exit code when only warnings are present (R41-003). Fix: Quick wins #4, #5, #6 + S4 promotion to hard errors; ~3 days.

**9. `lib/graph/graph-metadata-parser.ts` (4 distinct issues).** Legacy laundering + temp-path collision.

Root cause: `validateGraphMetadataContent()` retries primary-parse failure through `parseLegacyGraphMetadataContent()` and returns `{ ok: true, metadata, errors: [] }` when legacy validates (R11-002). No migration marker is carried forward. Downstream, `refreshGraphMetadataForSpecFolder()` loads this as authoritative existing metadata, merges with freshly-derived metadata, and rewrites as canonical current JSON (R21-003). `readDoc()` collapses I/O failure into `null`; `deriveStatus()` then reinterprets missing docs as `planned`/`complete` (R13-002). Legacy fallback fabricates `created_at`/`last_save_at` via `new Date().toISOString()` (R20-002). Temp-file path uses `${canonicalFilePath}.tmp-${process.pid}-${Date.now()}`, which collides at millisecond precision (R31-004). Fix: S3 (migration propagation), 1 week; plus quick-win #15 for temp path.

**10. `spec_kit_plan_auto.yaml` / `_confirm.yaml` (4 distinct issues).** `when:` overload + untyped boolean DSL + vocabulary fragmentation.

Root cause: Three independent fragmentation points coexist in the plan workflow. (a) Vocabulary token drift: local `folder_state` includes `populated`, canonical `intake-contract.md` uses `populated-folder` (R41-001). (b) Untyped boolean DSL: `when: "intake_only == TRUE"` with no pinned grammar for uppercase literals (R42-001, R43-002, R44-003). (c) Two-layer state machine flattened in top-level docs: `folder_state` local classifier maps to canonical `start_state` via YAML emission; both fields emit on `intake_triggered`/`intake_completed`; `SKILL.md` and `README.md` reference only `folder_state` (R47-002). Additionally, the `when:` key is overloaded for both executable predicates AND prose timing notes (R48-002, R49-002). Fix: S7 (YAML predicate grammar + vocabulary alignment), 1.5 weeks.

---

### 2.4 Deduplication clusters (canonical view, cumulative through iteration 50)

The 129 raw findings compress to approximately **63 distinct issues** after merging. The cluster table below preserves all prior clusters and adds the Domain 4 additions from iterations 48–50.

| Dedup cluster | Iterations | Canonical finding |
| ------------- | ---------- | ----------------- |
| `startup-brief` scope-less `loadMostRecentState()` | R1-001, R2-001, R4-001 | R2-001 |
| `hook-state` directory-level single-try | R2-002, R4-002, R38-001 | R2-002 + R38-001 |
| `code-graph/query.ts` readiness fails open | R3-002, R11-003, R22-001, R23-001, R25-002, R27-002 | R3-002 |
| `post-insert.ts` `enrichmentStatus` boolean collapse | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R21-001, R25-001, R27-001 | R8-001 |
| `graph-metadata-parser` legacy-as-success laundering | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | R11-002 + R21-003 |
| `reconsolidation-bridge` scope-filter silent drop / throws | R11-004, R12-003, R13-004, R16-002, R19-002 | R11-004 + R13-004 |
| `hook-state.ts` unvalidated `JSON.parse` | R21-002, R23-003, R24-002, R25-004, R28-001, R28-002, R29-001 | R21-002 |
| `session-stop.ts` unlocked RMW + autosave races | R31-001, R31-002, R32-001, R32-002, R33-002, R33-003, R34-001, R35-002, R37-001, R37-002 | R31-001 + R31-002 |
| `trustStateFromStructuralStatus` missing→stale collapse | R9-001, R26-001, R30-001 | R9-001 |
| `opencode-transport` drops richer trust axes | R9-002, R30-002 | R30-002 |
| Compact-cache identity-free cleanup | R33-001 | R33-001 |
| Reconsolidation conflict multi-successor fan-out | R31-003, R32-003, R35-001 | R31-003 + R35-001 |
| Complement / assistive pre-transaction snapshots | R34-002, R36-002, R37-003 | R34-002 + R36-002 + R37-003 |
| `/tmp/save-context-data.json` shared path taught at 4 surfaces | R31-005, R32-005, R35-003, R36-003 | R31-005 + R35-003 |
| Hook-state loader torn read (stat vs content generation) | R36-001 | R36-001 |
| `cleanStaleStates` single-try sweep + TOCTOU | R38-002, R40-001 | R38-002 + R40-001 |
| Governed-scope mixed-snapshot candidate universe | R39-002, R40-002 | R39-002 (with R40-002 extension) |
| Gate 3 `analyze`/`decompose`/`phase` false-positive for read-only research | R45-001, R47-001 | R45-001 + R47-001 |
| Gate 3 false-negatives (memory-save, deep-research resume) | R48-001, R49-001, R50-001 | R49-001 (consolidates R48-001) + R50-001 |
| `skill_graph_compiler.py` topology warnings non-durable | R45-003 | R45-003 |
| Manual playbook runner parse/coverage dishonesty | R41-004, R42-003, R45-004, R46-003, R50-002 | R45-004 + R46-003 + R50-002 |
| Skill routing `COMMAND_BRIDGES` prefix collapse | R46-001 | R46-001 |
| Unilateral `conflicts_with` → bilateral penalty | R46-002 | R46-002 |
| `folder_state` / `start_state` two-vocabulary split | R47-002 | R47-002 |
| `when:` key overloaded predicate + prose | R48-002, R49-002 | R49-002 (consolidates R48-002) |
| Dependency-cycle validator only covers 2-node | R49-003 | R49-003 |
| `intent_signals` / keyword comments discarded at scoring | R43-001, R44-001, R44-002 | R43-001 + R44-001 + R44-002 |

---

## 3. P0 Escalation Analysis

### 3.0 How P0 candidates were identified

No individual finding in Phase 016 met the P0 threshold on its own. The review's central methodological contribution was identifying **four interaction-effect composites** where P1 and P2 findings chain into systemic, persistent, or data-integrity failure modes. Each candidate satisfies at least three of these criteria:

1. **Multi-file blast radius.** The failure spans ≥3 files or subsystems.
2. **Data-integrity or control-plane scope.** The failure writes incorrect data to persistent store, steers control-plane decisions to the wrong target, or both.
3. **Silent propagation.** No exception is thrown; no error log is emitted beyond warning level; no test currently fails.
4. **Operator invisibility.** Result objects advertise success; health checks return ok; prose-level log-scraping is required to detect the failure after the fact.
5. **Irreversible or hard-to-reverse.** The failure either writes permanent data (lineage edges, graph metadata) or destroys state that cannot be recovered (deleted hook-state, lost transcript offset).

All four confirmed P0 candidates satisfy criteria 1, 3, 4, and 5. They differ along criterion 2: A and D are control-plane failures (continuity loss), B and C are data-integrity failures (permanent corruption).

---

### 3.1 P0-candidate-A — Cross-runtime tempdir control-plane poisoning

**Constituent findings:** R21-002, R25-004, R28-001, R29-001, R31-001, R33-003, R33-001, R36-001, R38-001, R38-002 (10 findings across hook-state and session-stop).

**Attack/failure scenario.** A single corrupt, drifted, concurrently-replaced, or unreadable temp-state file can simultaneously:

1. Inject forged provenance into Claude prompt text after compaction (R21-002 + R25-004).
2. Misroute Gemini startup continuity via the scope-less `loadMostRecentState` contract (R21-002 + R1-001).
3. Force transcript re-parsing with duplicate token counting when `loadState` returns null (R28-001).
4. Bypass the cached-summary schema guard because persisted state has no `schemaVersion` field (R29-001).
5. Pair one stop-hook's summary with another's packet target via `updateState()` without CAS (R31-001).
6. Proceed with autosave after a known `saveState()` failure (R33-003).
7. Have a fresh precompact payload silently deleted by an older consumer's `clearCompactPrime()` (R33-001).
8. Return freshness from one generation with content from another via torn `statSync`/`readFileSync` (R36-001).
9. Suppress all sibling-state recovery when one file is transiently unreadable (R38-001).
10. Return a partial `cleanStaleStates` sweep as if complete (R38-002).

**Severity justification (blast radius).**
- **Cross-runtime:** Claude + Gemini + OpenCode all consume the same temp directory. One corrupt file degrades five distinct hook entrypoints.
- **Write-side + read-side:** both paths are affected simultaneously.
- **Prompt-visible + on-disk:** provenance metadata ends up in Claude's prompt; autosave targets wrong packet on disk.
- **Tempdir + continuity + analytics + cleanup:** all four subsystems are entangled.

**Remediation plan.** (Structural; ~2 weeks for one engineer.)

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| A1 | Add runtime `HookStateSchema` (Zod) validation to `loadState()` and `loadMostRecentState()`; on validation failure, quarantine to `.bad` rather than returning parseable-but-drifted state | Medium | R21-002, R25-004, R28-001, R29-001 |
| A2 | Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` + retry loop | Small | R31-001, R31-004 |
| A3 | Add `schemaVersion` field to `HookState`; `loadState()` rejects mismatched versions with distinct `schema_mismatch` reason | Medium | R29-001 |
| A4 | Replace per-session `clearCompactPrime()` with identity-based clear (`cachedAt` or `opaqueId` equality) | Small | R33-001 |
| A5 | Re-read mtime after `readFileSync()` in `loadMostRecentState()` and discard candidate if it changed | Small | R36-001 |
| A6 | Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()`; return `{ removed, skipped, errors }` | Small | R38-001, R38-002 |
| A7 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` | Small | R40-001 |
| A8 | Make `updateState()` return `{ ok, merged, persisted }` and have callers surface persistence failures | Small | R31-001, R33-003 |

**Dependency graph within A:** A1 unblocks A3 (schema versioning requires validation); A2 independent; A4–A7 independent; A8 can be done first and refactored with A1.

### 3.2 P0-candidate-B — Reconsolidation conflict + complement duplicate/corruption window

**Constituent findings:** R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 (6+2 findings across `reconsolidation-bridge.ts` and `lib/storage/reconsolidation.ts`).

**Attack/failure scenario.** Two concurrent governed `memory_save` requests planning against overlapping candidates can:

1. **Fork lineage** (R35-001) because `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)`; both saves can create distinct successor rows pointing at the same predecessor.
2. **Deprecate a predecessor already superseded** (R31-003 + R32-003) because `executeConflict()` runs a pure `UPDATE ... WHERE id = ?` with no version or scope recheck.
3. **Insert duplicate complement rows** (R34-002) because `runReconsolidationIfEnabled()` runs `vectorSearch` + scope filter before the writer transaction; concurrent duplicates between plan and commit are missed.
4. **Admit or exclude candidates with mixed-source snapshots** (R39-002 + R40-002) because `readStoredScope()` issues a fresh per-candidate `SELECT` outside any transaction; similarity/content come from one snapshot and scope from another.
5. **Generate stale assistive recommendations** (R36-002 + R37-003) because assistive review forms recommendations from a second pre-transaction search that can differ from TM-06 planning.

**Severity justification (blast radius).**
- **Permanent data corruption:** unlike continuity loss, conflict-fork lineage and duplicate complement rows are written to persistent storage and propagate into every downstream search, causal traversal, and graph-backed retrieval forever.
- **Silent:** all five decisions produce success-shaped results. No exception is thrown.
- **Violates a core invariant:** the memory graph's "single active successor per predecessor" invariant is silently broken; consumers assume it holds.

**Remediation plan.** (Structural; ~3 weeks for one engineer — the largest single workstream.)

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| B1 | Add predecessor `content_hash` + `is_deprecated = FALSE` CAS guard to `executeConflict()`; abort if predecessor already superseded | Medium | R31-003, R35-001 |
| B2 | Move complement decision inside writer transaction, or re-run `vectorSearch()` + scope filter just before insert; fall through to merge/conflict if near-duplicate appeared | Large | R34-002 |
| B3 | Take a single batch snapshot of candidate scopes instead of per-candidate `readStoredScope()` calls; or wrap the scope-filter loop inside the same transaction as the vector search | Medium | R39-002, R40-002 |
| B4 | Assistive review lane re-runs its search inside the writer transaction or flags `advisory_stale: true` when the snapshot predates the commit | Medium | R36-002, R37-003 |
| B5 | Append structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` when scope filter drops results | Small | R11-004, R12-003 |

**Dependency graph within B:** B1 independent (and the most urgent fix for data-corruption-preventing guard); B2 requires B1 (complement must fall through to B1-protected conflict); B3 can run parallel to B1/B2; B4 after B3.

### 3.3 P0-candidate-C — Graph-metadata laundering + search boost

**Constituent findings:** R11-002, R13-002, R20-002, R21-003, R22-002, R23-002 (6 findings across `graph-metadata-parser.ts`, `memory-parser.ts`, and the refresh + indexing pipelines).

**Attack/failure scenario.** A malformed modern `graph-metadata.json`:

1. Gets accepted as legacy with `ok: true` (R11-002), because `validateGraphMetadataContent()` retries primary-parse failure through `parseLegacyGraphMetadataContent()` and returns success with no migration marker.
2. Gets fabricated `created_at` / `last_save_at` via `new Date().toISOString()` (R20-002), erasing the original timestamp evidence.
3. Gets reinterpreted through `deriveStatus()` as `planned` / `complete` when `readDoc()` collapses I/O failure into `null` (R13-002).
4. Gets rewritten as canonical current JSON by `refreshGraphMetadataForSpecFolder()` (R21-003), erasing the corruption evidence at the persistence layer.
5. Gets `qualityScore: 1` and empty `qualityFlags: []` assigned by `memory-parser.ts` (R22-002), because the fallback path treats recovery as first-class.
6. Gets +0.12 packet-search boost in stage-1 candidate generation (R22-002 + R23-002), outranking legitimate spec docs.

**Severity justification (blast radius).**
- **State laundering = consent-boundary violation.** Callers authorize a "refresh" operation and receive a stronger contract than the input justified.
- **Retrieval priority upgrade on corrupt content.** The worst failure mode: corrupt artifact outranks clean content in downstream search.
- **Multi-surface entanglement.** Six different layers (legacy acceptance, timestamp fabrication, status derivation, refresh rewrite, quality assignment, search boost) all participate. Fixing any one in isolation still leaves the laundering signal intact.

**Remediation plan.** (Structural; ~1 week for one engineer.)

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| C1 | `validateGraphMetadataContent()` returns `{ ok: true, metadata, migrated: boolean, migrationSource?: 'legacy' }`; consumers propagate `migrated` all the way through `memory-parser` and ranking | Medium | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 |
| C2 | Preserve original current-schema validation errors in returned diagnostic set when legacy fallback also fails | Small | R18-002 |
| C3 | Distinguish `readDoc()` I/O failure from "file does not exist"; propagate I/O failure as `status: 'unknown'` rather than `planned`/`complete` | Small | R13-002 |
| C4 | `refreshGraphMetadataForSpecFolder()` preserves `migrated` marker in rewritten JSON; indexing layer penalizes (not boosts) `migrated=true` rows until human review | Small | R21-003, R22-002 |
| C5 | Stage-1 candidate generation refuses to apply +0.12 boost to `migrated=true` or `qualityScore: 1` rows (or reduces boost to +0.04) | Small | R22-002, R23-002 |

**Dependency graph within C:** C1 is prerequisite for all others. C2–C5 can run in parallel after C1.

### 3.4 P0-candidate-D — TOCTOU cleanup erasing fresh state under live session load

**Constituent findings:** R40-001, R38-001, R33-002, R37-001 (4 findings across `hook-state.ts` and `session-stop.ts`).

**Attack/failure scenario.** A routine finalize sweep overlapping with a live session can:

1. Delete a freshly-written session state (R40-001) because `cleanStaleStates()` stats an old file, a live writer renames a new generation onto the same path, and then `unlinkSync()` deletes the fresh generation — all while reporting a normal `removed` count.
2. Make the next `loadMostRecentState()` return `null` for all consumers (R38-001) because the scan has a single `try/catch` wrapping the whole loop and any bad sibling aborts everything.
3. Re-parse transcript from offset 0 (R37-001 + R28-001) because the next stop hook sees `lastTranscriptOffset: 0` sentinel and has no state to override it.
4. Compound via overlap-induced offset regression (R33-002) if two stop hooks intersect.

**Severity justification (blast radius).**
- **Triggered by normal maintenance:** unlike the byte-race candidates, this interaction fires on a routine `--finalize` cleanup, not abnormal concurrent write.
- **Failure signal is further from damage:** cleanup returns `removed: N` (looks normal), next startup looks like cold start (looks normal), transcript re-parse inflates token counts (looks like "just high usage"). Operator has to correlate three unrelated anomalies to detect the problem.
- **Continuity loss is irreversible for that session.** The deleted state cannot be recovered.

**Remediation plan.** (Small; ~2 days for one engineer, mostly in `hook-state.ts`.)

| Step | Change | Effort | Addresses |
| ---- | ------ | ------ | --------- |
| D1 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` (re-stat or open+fstat) | Small | R40-001 |
| D2 | Per-file error isolation in `loadMostRecentState()`; continue on individual failure; expose `errors[]` to debug log | Small | R38-001 |
| D3 | Per-file error isolation + richer return type in `cleanStaleStates()`: `{ removed, skipped, errors }` | Small | R38-002 |
| D4 | Eliminate transient `lastTranscriptOffset: 0` sentinel in `storeTokenSnapshot()`; carry final offset through to `recordStateUpdate()` | Small | R37-001 |
| D5 | Add `Math.max()` monotonicity guard on `metrics.lastTranscriptOffset` in `updateState()` | Small | R33-002 |

**Dependency graph within D:** D1–D5 are all independent small changes. Can be done in one sprint.

### 3.5 Watch-priority-1: Domain 4 routing misdirection chain

**Constituent findings:** R46-001 + R43-001/R44-001 + R42-002 + R41-003 + R46-002.

**Rationale for not-yet-P0.** The chain currently has one confirmed concrete step (R46-001: `/spec_kit:deep-research` → `command-spec-kit` 0.95) but whether that mis-route completes into file-modifying behavior depends on whether `command-spec-kit` enforces Gate 3 independently of skill routing. That question remains open.

**Recommend upgrade trigger.** If Phase 017 reveals that `command-spec-kit` proceeds into spec-folder creation when invoked via bridge with `/spec_kit:deep-research` intent, upgrade to P0-candidate-E immediately. The fix is at A0 + A2 (subcommand bridge + `intent_signals` wiring) and is a ~3-day change once the ambiguity is resolved.

### 3.6 Watch-priority-2: Playbook runner `Function(...)` trust-boundary expansion

**Constituent findings:** R41-004 + R45-004 + R46-003 + R50-002.

**Rationale for not-yet-P0.** The playbook runner operates in development/CI rather than production. However, the trust boundary has expanded from "repository-owned markdown" to "repository markdown + live tool-return values" (R46-003). If CI environment is ever expanded to include external handler payloads, severity escalates.

**Recommend upgrade trigger.** Any change that allows externally-influenced tool outputs to reach the playbook runner's `runtimeState.lastJobId`. The fix is Chain C (typed step executor) and is ~1 week.

---

### 3.7 Reinforcement chains — why each P0 candidate's component findings compound

The P0 composites are not simple unions of constituent findings. Each is an **interaction effect** where one finding unmasks another or amplifies its blast radius. The full reinforcement map:

**P0-A Chain.** R21-002 (unvalidated hook-state parse) is the gateway. If it stood alone, one corrupt file would produce degraded prompt replay — annoying but not systemic. But:
- R25-004 extends R21-002 across five hook entrypoints, so one corrupt file reaches Claude session-prime + Claude session-stop + Gemini session-prime + Gemini compact-inject + Claude compact-cache.
- R28-001 ensures that when R21-002's null return fires, the stop hook re-parses the transcript from offset 0.
- R29-001 proves the supposed `schemaVersion` guard cannot catch R21-002's drift because the persisted `HookState` has no version field.
- R33-001 adds a second independent path to corruption: even a clean hook-state file can be silently deleted by `clearCompactPrime()` when overlap occurs.
- R36-001 adds a third path: even a clean file on disk can produce torn reads if rename happens between `statSync()` and `readFileSync()`.
- R31-001 and R33-003 add a fourth: even a clean read can produce corrupted writes because `updateState()` has no persistence check.
- R38-001 and R38-002 close the recovery and cleanup lanes: a single transient failure aborts the whole sibling scan or cleanup sweep.

The interaction: **ten independent mechanisms all produce the same silent failure signal.** Fix any one in isolation and the other nine continue to produce the failure. This is why the remediation plan (A1–A8) addresses them as one coherent overhaul, not individually.

**P0-B Chain.** R31-003 (conflict without CAS) is the core corruption engine. Alone it would allow lost updates on conflict — bad but bounded. But:
- R35-001 extends this into *forked lineage*: `insertSupersedesEdge()` deduplicates only by `(source_id, target_id, relation)`, so two saves with different new memory IDs can both supersede the same predecessor, producing two "current successors" that violate the memory graph's core invariant.
- R32-003 adds a governance-scope dimension: if the predecessor has been retagged out of scope between search and commit, the conflict proceeds anyway.
- R34-002 adds the complement path: even without conflict, two saves can both proceed as complement when they should have merged, producing near-duplicate rows.
- R36-002 and R37-003 add the assistive-recommendation path: advisory output can target already-superseded memories.
- R39-002 and R40-002 add the per-candidate scope-read path: the candidate universe itself is mixed-snapshot because `readStoredScope()` runs outside the writer transaction.

The interaction: **the conflict path, complement path, and assistive path all make pre-transaction decisions that are authoritative post-transaction.** Merge is the lone well-designed path; the other three all share the same root flaw. B1 adds the missing CAS to conflict; B2–B4 propagate the transactional protection to the other paths.

**P0-C Chain.** R11-002 (legacy-as-success) is the entry point. Alone it would produce "silent legacy acceptance" — a documentation gap at worst. But:
- R20-002 stamps the legacy-recovered content with freshly-minted `created_at`/`last_save_at`, erasing the original timestamp evidence. Now the recovered file looks new.
- R13-002 adds a separate path: transient I/O failures produce `status: 'planned'`/`'complete'` rather than `'unknown'`, so consumers cannot distinguish "no doc" from "I/O failed." Combined with R11-002, corrupted files that trigger both paths look like freshly-authored clean packets.
- R21-003 rewrites the recovered content as canonical current JSON at the persistence layer via `refreshGraphMetadataForSpecFolder()`. The corruption evidence is erased from disk.
- R22-002 assigns `qualityScore: 1` and empty `qualityFlags: []` through the `memory-parser` fallback path, making the recovered content indistinguishable from real high-quality content.
- R23-002 completes the pipeline by applying +0.12 boost in stage-1 candidate generation, so the recovered content outranks legitimate spec docs.

The interaction: **six independent layers erase the corruption signal AND upgrade retrieval priority**. This is why "laundering" is the accurate term — the corrupt input gets laundered through the pipeline into a stronger contract than the input justified. C1 propagates a `migrated: true` marker through the entire chain so the boost can be reversed at the ranking layer.

**P0-D Chain.** R40-001 (TOCTOU cleanup) is the trigger. Alone it produces "sometimes cleanup deletes a fresh file" — noticeable but recoverable. But:
- R38-001 ensures that after R40-001 deletes the fresh state, the next `loadMostRecentState()` likely returns `null` because the all-or-nothing try block aborts on the first sibling failure (and the freshly-deleted file produces such a failure).
- R37-001 ensures that when `loadState()` returns null, the `storeTokenSnapshot()` path writes a transient `lastTranscriptOffset: 0` sentinel. If a second stop hook is concurrent, it reads the zero and re-parses the entire transcript.
- R33-002 ensures that without a `Math.max()` monotonicity guard, the re-parsed offset can stick — a later stop hook with the correct offset can still lose to the "zero-read" stop hook under ordering.

The interaction: **a routine `--finalize` cleanup + one concurrent stop hook + one bad sibling file + one subsequent stop hook = continuity loss + inflated token counts + indistinguishability from cold start**. None of the four constituent findings is independently P0-worthy; together they are a systemic failure triggered by normal maintenance.

---

### 3.8 Why only four P0 candidates (and not more)

Twelve additional composite candidates were considered but did not meet the P0 bar after review:

| Candidate | Constituent findings | Why not P0 |
| --------- | -------------------- | ---------- |
| Stop-hook success-flag durability overstatement | R34-001, R35-002, R33-003, R33-002, R37-001 | Overlaps with P0-A and P0-D; folded into both remediation plans. The overstatement is consumer-visible but recoverable by re-reading hook-state. |
| Domain 4 routing misdirection | R46-001, R43-001, R44-001, R42-002, R41-003, R46-002 | Watch-priority-1; upgrade when `command-spec-kit` Gate-3 semantics are resolved. |
| Playbook runner `Function(...)` eval expansion | R41-004, R45-004, R46-003, R50-002 | Watch-priority-2; dev/CI isolation contains blast radius. Upgrade if external payload influence is introduced. |
| Trust-state vocabulary collapse | R9-001, R30-001, R30-002, R26-002 | Structural but not data-integrity. Fixed via M8; impacts operator visibility more than correctness. |
| `post-insert.ts` enrichmentStatus boolean collapse | R8-001 (+ 10 related) | Structural refactor (M13) resolves; not data-integrity. Affects recovery semantics more than correctness. |
| Response-builder step-detail erasure | R21-001, R24-001 | Operator-visible only; recoverable by other means. |
| `session_bootstrap`/`session_resume` self-contradictory payload | R30-001 | Included in Trust-state vocabulary group; not independently P0. |
| Test fixtures canonize degraded contracts | R25-001 through R25-004, R26-001 | Testing concern; no direct runtime effect. Required countermeasure during structural refactors. |
| `/tmp/save-context-data.json` cross-runtime collision | R31-005, R32-005, R35-003, R36-003 | Documented hazard at four surfaces; operators already know to avoid it. Quick-win remediation resolves without structural change. |
| Graph-metadata temp-path collision | R31-004, R32-004 | Byte-level collision only; atomic rename protects final state. Quick-win (unique temp paths) resolves. |
| `spec_kit_plan_auto.yaml` vocabulary fragmentation | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 | Structural but not data-integrity. Fixed via S7 (YAML predicate grammar). |
| `/spec_kit:plan` intake classification drift | R41-001, R47-002 | Subset of vocabulary fragmentation; not independently P0. |

The four that remain as P0 share a property the 12 rejected candidates do not: **they all produce permanent state changes or erasure under normal or routine conditions with no available signal to the operator that the failure occurred.**

---

## 4. Per-Domain Deep Synthesis

### 4.1 Foundational Seams (iterations 1–10)

**Thesis.** The runtime's session, graph, and save seams have asymmetric contract enforcement between producers and consumers. Gemini and OpenCode get a thinner, collapsed subset of what Claude already gets; readiness/freshness labels are not internally consistent; trust vocabulary conflates "missing" with "stale."

**Key patterns.**
1. **Scope contract split between session-start and session-resume.** (R1-001.) `loadMostRecentState()` rejects scope-less calls; `buildSessionContinuity()` makes them anyway; Gemini startup trusts the broken lane.
2. **Readiness/freshness asymmetry.** (R5-001, R5-002.) Inline reindex completes reporting pre-refresh state; partial persistence writes mtime before failure.
3. **Trust-vocabulary collapse.** (R9-001, R9-002.) `missing` and `empty` collapse to `stale`; shape validation is not contract validation.
4. **Compact-cache cross-runtime asymmetry.** (R10-001, R10-002.) Gemini drops provenance; Claude interpolates it unescaped.

**Counter-examples (well-designed surfaces).**
- `hooks/claude/session-prime.ts:65-70` correctly threads cached provenance fields into `wrapRecoveredCompactPayload()`. The contract split is visible because Claude gets it right and Gemini does not; in a world without this contrast, the `shared-payload.ts` collapse would be indistinguishable from an intentional design choice.
- `validateGraphMetadataContent()` (primary path) correctly validates the modern schema. The laundering problem is specifically in the fallback; the primary path is trustworthy.

**Novel insights.**
- The foundational pass pre-announced themes that Domains 1–4 confirmed. Every subsequent domain pattern has a foundational-seam ancestor: Domain 1 silent fail-open is a deepening of R5-002 (partial persistence as success); Domain 2 state laundering is a deepening of R11-002 (legacy as success); Domain 3 concurrency is a deepening of R9-001 (collapsed vocabulary); Domain 4 governance drift is a deepening of R10-002 (unescaped prompt interpolation).
- The foundational layer contains the only finding where **runtime asymmetry is by design** (R10-001, R10-002): Gemini and Claude intentionally have different compact-replay logic. This is structurally distinct from the other asymmetries (R1-001) which are bugs.

**Exemplar findings (full file:line, for cross-reference):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R1-001 | `mcp_server/lib/code-graph/startup-brief.ts:179-192` | P1 | `buildSessionContinuity()` calls `loadMostRecentState()` with no scope; hook-state rejects scope-less calls; Gemini startup loses continuity |
| R2-002 | `mcp_server/hooks/claude/hook-state.ts:131-166` | P1 | Single-try directory scan; one malformed file aborts entire lookup |
| R5-001 | `mcp_server/lib/code-graph/ensure-ready.ts:283-317` | P1 | Inline reindex completes while reporting `freshness: 'stale'` |
| R5-002 | `mcp_server/lib/code-graph/ensure-ready.ts:183-217` | P1 | Partial persistence writes `file_mtime_ms` before node/edge failure; failed files look fresh on next scan |
| R9-001 | `mcp_server/lib/context/shared-payload.ts:592-601` | P1 | `missing` and `empty` collapse to `stale` in two trust-state functions |
| R10-001 | `mcp_server/hooks/gemini/session-prime.ts:55-68` | P1 | Gemini compact-recovery drops provenance; Claude preserves it |
| R10-002 | `mcp_server/hooks/claude/shared.ts:109-123` | P2 | Provenance interpolated unescaped into `[PROVENANCE:]` prompt line |

### 4.2 Domain 1 — Silent Fail-Open Patterns (iterations 11–20)

**Thesis.** The runtime contains many surfaces that return success-shaped payloads after work was skipped, partially applied, or filtered out. These are **truth-contract erosions** where absence, invalid input, or internal failure is re-interpreted as ordinary benign outcome.

**Key patterns.**
1. **Status erasure at the response boundary.** (R12-001, R17-002, R21-001.) `session-stop.ts` and `post-insert.ts` flatten failed/partial/skipped into ordinary success. `response-builder.ts` reduces per-step nuance into at most one generic warning.
2. **Input-contract normalization.** (R12-002, R14-002, R16-001, R16-002.) Unsupported operations and malformed rows are converted into plausible success states.
3. **Absence reinterpreted as truth.** (R13-001, R13-002, R13-003, R13-004.) Autosave silently skips on missing input; unreadable canonical docs become `planned`/`complete`; unresolved outline subjects become "file has no symbols"; thrown reconsolidation errors become "normal create path."
4. **Second-order truth loss.** (R14-001.) Producer-metadata failure fail-opens the transcript cursor.
5. **Provenance drift in successful envelopes.** (R18-001, R20-002, R20-003.) Query-level `detectorProvenance` is DB-global; legacy fallback fabricates timestamps; validation diagnostics degrade.
6. **Packet-target authority drift.** (R15-001, R15-002, R15-003.) Transcript-driven retargeting rewrites autosave destination; 50 KB tail hides real packet; transcript I/O failure collapses into "ambiguous."

**Counter-examples.**
- `lib/storage/reconsolidation.ts` `executeMerge()` has proper predecessor CAS via `updated_at` + `content_hash`. Domain 3 then confirmed that `executeConflict()` lacks this guard; the merge path is the design model.
- `scripts/tests/generate-context-cli-authority.vitest.ts` correctly tests `--stdin` and `--json` modes. The file handoff path is the exception that should be removed.

**Novel insights.**
- Domain 1's deepest pattern is **flag-based success without helper-result inspection** (R8-001, R11-005, R12-004, R12-005). Every `enrichmentStatus` boolean is set via `true` literal rather than by inspecting the helper's return value. This is a single structural fix that resolves ~10 findings at once.
- The canonical counter-example to fail-open is the merge CAS. One extracted refactoring hypothesis: every production path in the save pipeline should have a merge-style `{ ok, reason, attempted_writes, persisted_writes }` return shape.

**Exemplar findings (full file:line):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R8-001 | `handlers/save/post-insert.ts:86-213,223-238` | P1 | `enrichmentStatus = true` for success / feature-disabled skip / "nothing to do" skip / deferral |
| R11-003 | `handlers/code-graph/query.ts:367-385` | P1 | `blast_radius` silently degrades unresolved subjects via `resolveSubjectFilePath(candidate) ?? candidate` |
| R13-002 | `lib/graph/graph-metadata-parser.ts:280-285,457-475,849-860` | P1 | `readDoc()` collapses I/O failure into `null`; `deriveStatus()` misreads as `planned`/`complete` |
| R13-004 | `handlers/save/reconsolidation-bridge.ts:261-270,438-442` | P1 | Any thrown error (checkpoint, reconsolidate, similarity, conflict store) caught; falls through to normal create |
| R14-001 | `hooks/claude/session-stop.ts:175-193,257-268,274-276` | P1 | `storeTokenSnapshot` writes `lastTranscriptOffset: 0` before producer metadata builds; catch swallows later failure |
| R15-001 | `hooks/claude/session-stop.ts:61-77,281-309` | P1 | Transcript-driven retargeting silently rewrites autosave destination |
| R16-001 | `handlers/code-graph/query.ts:417-436,547-548` | P1 | `includeTransitive: true` runs before switch-level validation; unsupported ops default to CALLS |
| R20-001 | `hooks/claude/session-stop.ts:199-218,248-268` | P1 | `buildProducerMetadata()` re-stats transcript; metadata describes later state than parsed one |

### 4.3 Domain 2 — State Contract Honesty (iterations 21–30)

**Thesis.** Collapsed producer state becomes harder to recover from once a downstream layer re-emits it as a stronger contract. The system now contains multiple places where ambiguous or recovered state is strengthened into authoritative-looking signals.

**Key patterns.**
1. **State laundering across boundaries.** (R21-001, R21-002, R21-003.) Step detail dropped into warnings; unvalidated hook state steers prompt + writes; legacy metadata rewritten as canonical.
2. **State promotion at consumer layers.** (R22-001, R22-002, R23-001, R23-002, R23-003.) Readiness vocabulary diverges; fallback metadata gets quality boost; cache expiry becomes cache absence.
3. **Control-plane asymmetry.** (R24-001, R24-002.) Deferred case gets typed recovery; other degradation gets warning strings. Cached scope picks packet but doesn't propagate.
4. **Regression behavior canonizing degraded contracts.** (R25-001 through R25-004, R26-001.) Four tests explicitly assert the collapsed state. Fixing code requires fixing tests.
5. **Health surface weaker than bootstrap/resume.** (R26-002.) `session_health` lost richer axes.
6. **Self-contradictory payloads.** (R30-001, R30-002.) Same payload advertises `trustState=stale` and `graphOps.readiness.canonical=empty` simultaneously.
7. **Theatrical schema-drift vocabulary.** (R29-001, R29-002.) `CACHED_SESSION_SUMMARY_SCHEMA_VERSION` exists; persisted `HookState` has no version field; schema-mismatch rejection unreachable.

**Counter-examples.**
- `session_bootstrap` and `session_resume` DO carry `sections[].structuralTrust` with richer axes. The health surface's problem is specifically that it lost those axes at the envelope boundary — the producer-side contract is correct; the health-side contract is stripped.
- The deferred planner-first save path DOES have a typed `runEnrichmentBackfill` recovery action. The other runtime-degradation branches are structurally inferior to this one case; the deferred path is the design model.

**Novel insights.**
- Domain 2's deepest pattern is **state laundering** (R21-003 + R22-002): corruption signal erased at persistence AND consumer layers simultaneously, then boosted by search ranking. This is the mechanism behind P0-candidate-C.
- The self-contradictory payload (R30-001) is structurally the most alarming Domain 2 finding. A single response advertises two mutually-exclusive trust states. Consumers see whichever field they read; there is no canonical truth. This is a direct argument for vocabulary alignment as a P1 structural refactor.

**Exemplar findings (full file:line):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R21-001 | `handlers/save/response-builder.ts:311-322,569-573` | P1 | `memory_save` response collapses post-insert truth further than `post-insert.ts` does |
| R21-002 | `hooks/claude/hook-state.ts:83-87` | P1 | `JSON.parse(raw) as HookState` with no validation; feeds prompt replay + autosave routing |
| R21-003 | `lib/graph/graph-metadata-parser.ts:223-233,264-275,1015-1019` | P1 | `refreshGraphMetadataForSpecFolder()` launders malformed modern JSON into canonical refreshed artifact |
| R22-002 | `lib/parsing/memory-parser.ts:293-330` | P1 | Fallback-recovered `graph-metadata` gets `qualityScore: 1`, +0.12 packet boost |
| R23-002 | `lib/graph/graph-metadata-parser.ts:223-233` | P1 | Schema-invalid-as-legacy → first-class `graph_metadata` indexing → retrieval priority upgrade |
| R24-002 | `handlers/session-resume.ts:174-188,415-429,560-563` | P1 | Cached scope drives `fallbackSpecFolder` but OpenCode transport uses `args.specFolder ?? null` |
| R28-001 | `hooks/claude/session-stop.ts:244-275` | P1 | `loadState()` returning `null` on parse failure indistinguishable from cold start; `startOffset = 0` re-parses |
| R29-001 | `handlers/session-resume.ts:174-208` | P1 | Cached-summary `schemaVersion` check fabricated; `HookState` has no version field |
| R30-001 | `handlers/session-bootstrap.ts:321-347` + `session-resume.ts:530-551` | P1 | Same payload carries `trustState=stale` AND `graphOps.readiness.canonical=empty` |
| R30-002 | `lib/context/opencode-transport.ts:64-71,98-149` | P1 | Transport drops richer structural truth; renders only collapsed provenance label |

### 4.4 Domain 3 — Concurrency and Write Coordination (iterations 31–40)

**Thesis.** The bug class is **layered**: byte-level races at write time (unlocked `.tmp` swap), snapshot-coherence races at read-then-decide time (stale pre-transaction snapshots driving conflict, merge, complement, assistive, cleanup, and spec-folder targeting decisions), and TOCTOU identity races at cleanup time. Atomic rename prevents torn bytes; it does not protect any decision that was made before the rename and reused afterward.

**Nine confirmed pattern groups.**
1. **Unlocked RMW on deterministic temp paths.** (R31-001, R32-001.) `filePath + '.tmp'` collision; `updateState()` returns merged after failed persist.
2. **Split-brain stop-hook state.** (R31-002, R32-002, R33-002, R33-003, R37-001.) Three independent `recordStateUpdate()` calls plus re-read in `runContextAutosave()`; transient zero-offset sentinel between writes.
3. **Reconsolidation pre-transaction snapshot exposure.** (R31-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002.) Conflict, complement, and assistive all make decisions before the writer transaction; governed scope read per-candidate outside transaction.
4. **TOCTOU identity races.** (R33-001, R36-001, R40-001.) `clearCompactPrime` by session ID; `loadMostRecentState` stat-then-read across rename; `cleanStaleStates` stat-then-unlink across rename.
5. **Directory-level all-or-nothing scans.** (R38-001, R38-002.) Single `try` block wraps whole directory loop; one bad file aborts entire pass.
6. **Success-shaped durability signals.** (R34-001, R35-002.) `producerMetadataWritten` and `touchedPaths` are attempted-write flags exported as postconditions.
7. **Stop-hook autosave outcome silent.** (R39-001.) `SessionStopProcessResult` never exposes autosave outcome.
8. **Stale `currentSpecFolder` preference.** (R37-002.) `detectSpecFolder()` prefers a snapshot that's already stale.
9. **Shared `/tmp/save-context-data.json` at 4 surfaces.** (R31-005, R32-005, R35-003, R36-003.) Command YAMLs, runtime root docs, and `data-loader.ts` error message all teach the same collision-prone path.

**Counter-examples.**
- `executeMerge()` has predecessor `updated_at` + `content_hash` CAS. The merge path is single-writer-safe; the conflict and complement paths are not. This is the clearest "good reference" for P0-candidate-B remediation.
- The SQLite writer transaction IS correctly serialized. The Domain 3 race is specifically about decisions made OUTSIDE the writer transaction that then become authoritative within it. The transaction is not broken; the pre-transaction planning is.
- `storeTokenSnapshot()` writes atomically. The problem (R37-001) is the intermediate zero-offset sentinel; the final state is atomic. The fix is to eliminate the intermediate write, not to add more locking.

**Novel insights.**
- **Atomic rename is not enough.** The dominant failure mode is NOT "two writers overwrite each other." It is "one writer reads, decides, then writes — and the decision was already stale at read time." Seven of nine pattern groups are about decision staleness, not write-time torn bytes.
- **Cleanup races are structurally distinct from writer races.** P0-candidate-D (TOCTOU cleanup) is the most operationally common scenario because it fires on routine `--finalize` rather than abnormal concurrent writes. The iteration 40 pivot to TOCTOU-as-separate-class is a key synthesis insight.

**Exemplar findings (full file:line):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R31-001 | `hooks/claude/hook-state.ts:169-176,221-240` | P1 | Deterministic `filePath + '.tmp'` means two writers swap bytes before rename |
| R31-002 | `hooks/claude/session-stop.ts:60-67,119-125,261-268,283-309` | P1 | Multiple `recordStateUpdate()` + final disk reload by `runContextAutosave()` create torn-state autosave window |
| R31-003 | `handlers/save/reconsolidation-bridge.ts:282-295` + `lib/storage/reconsolidation.ts:467-508` | P1 | `executeConflict()` has no predecessor-version or scope recheck; merge defends, conflict does not |
| R33-001 | `hooks/claude/hook-state.ts:184-205`; `session-prime.ts:43-46,281-287` | P1 | `clearCompactPrime()` clears by session ID, not payload identity |
| R34-002 | `handlers/save/reconsolidation-bridge.ts:261-306`; `reconsolidation.ts:599-694`; `memory-save.ts:2159-2171,2250-2304` | P1 | Complement path: stale-search duplicate window between `runReconsolidationIfEnabled` and `writeTransaction` |
| R35-001 | `handlers/save/reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508,610-658,952-993` | P1 | Conflict lane not single-winner; two concurrent saves can both supersede same predecessor |
| R36-001 | `hooks/claude/hook-state.ts:140-155,170-176` | P2 | `loadMostRecentState` stat-then-read race: concurrent rename can swap generation between mtime read and JSON read |
| R37-001 | `hooks/claude/session-stop.ts:175-190,244-252,257-268` | P1 | Transient `lastTranscriptOffset: 0` sentinel; second stop hook can re-parse from zero |
| R37-002 | `hooks/claude/session-stop.ts:128-145,244-246,281-296,340-369` | P1 | Stale `currentSpecFolder` preference suppresses legitimate packet retarget |
| R38-001 | `hooks/claude/hook-state.ts:131-165`; `session-resume.ts:348-366` | P2 | `loadMostRecentState` all-or-nothing `try` block; one bad sibling aborts scan |
| R39-001 | `hooks/claude/session-stop.ts:60-67,108-117,299-318` | P1 | Autosave outcome never surfaced in `SessionStopProcessResult` |
| R39-002 | `handlers/save/reconsolidation-bridge.ts:203-237,282-306` | P1 | Governed scope filter reads each candidate row individually outside any transaction |
| R40-001 | `hooks/claude/hook-state.ts:170-176,247-255`; `session-stop.ts:321-328` | P2 | `cleanStaleStates` TOCTOU: stat-then-unlink can delete fresh state |
| R40-002 | `handlers/save/reconsolidation-bridge.ts:203-236,282-295,453-465` | P1 | Per-candidate scope read confirmed in both TM-06 and assistive paths |

### 4.5 Domain 4 — Stringly-Typed Governance (iterations 41–50)

**Thesis (sharpened through iteration 50).** Governance is expressed as manually synchronized string tables across docs, YAML assets, Python dictionaries, and markdown playbooks. The failure modes form **four distinct layers**:

1. **Invisible discard.** Routing signals (graph `intent_signals`, SKILL.md keyword comments, topology warnings) are compiled, loaded, and stored through complete pipeline stages, then silently discarded before the scoring step. (R43-001, R44-001, R44-002, R45-003.) The system looks mechanically wired while operating exclusively from hand-maintained Python tables.

2. **String collapse at translation boundaries.** Generic prefixes collapse command families (R46-001); one-sided metadata collapses into bilateral runtime penalties (R46-002); markdown strings collapse into executable JavaScript after runtime value substitution (R41-004, R46-003).

3. **Scope bleed in governance vocabulary.** The same English token (`phase`, `folder_state`) is reused across edit setup, lifecycle narration, and read-only validation prompts, so a prose classifier cannot cleanly separate them. (R45-001, R47-001, R47-002, R48-001, R49-001.) False positives (read-only research triggers Gate 3) AND false negatives (`save context` / `deep-research resume` do not trigger Gate 3) coexist.

4. **Success-shaped partial validation.** Surfaces that look mechanized — a hard block (Gate 3), a `when:` field, a cycle validator — each leave materially different string cases outside the checked contract. (R41-003, R45-003, R49-003.) "VALIDATION PASSED" can be printed while cycle validation only covers 2-node reciprocal pairs, topology warnings are dropped, and `conflicts_with` reciprocity is never checked.

**Counter-examples.**
- `skill-graph-schema.vitest.ts` correctly tests MCP tool dispatch routing. The routing-invariant problem is specifically that this test doesn't cover compiler-time topology invariants; the dispatch-layer contract is well-tested.
- `handler-memory-save.vitest.ts` correctly asserts reconsolidation planning completes before writer-lock acquisition. The pre-transaction-snapshot problem is not that this test is wrong; it's that the test never exercises per-candidate scope mutation during the planning window.

**Novel insights.**
- **Governance signal amnesia is a unified pattern.** (§5 below has the full table.) Every transition from one governance layer to the next silently reduces signal fidelity without any log, test failure, or error code. Gate 3 classifier, Gate 2 skill routing, YAML predicates, playbook scenario parser, dependency-cycle validator, `conflicts_with` symmetry — all share the same structural flaw.
- **The routing toolchain is fully wired but terminates before scoring.** (R43-001 + R44-001 confirmed with live repro.) This is the single most surprising finding in Phase 016: the infrastructure for graph-driven skill routing exists end-to-end — metadata files, compiler, SQLite persistence, load-time deserialization into an in-RAM `signals` map — and then no consumer reads the map. Fix effort is `Small` (one function call insertion). Fix leverage is high (unblocks accurate Gate 2 routing for all commands).
- **`Function(...)` eval trust boundary has expanded.** (R46-003.) The original R41-004 documented that the playbook runner evaluates markdown fragments. Iteration 46 extends this: `substitutePlaceholders()` now injects `runtimeState.lastJobId` from prior handler payloads. The code string `Function(...)()` evaluates is now a composition of repository-authored markdown + live API return values. Threat model: any handler payload copied to `lastJobId` can influence the evaluated code.
- **Two-vocabulary state machine with top-level collapse.** (R47-002.) `/spec_kit:plan` maintains a local `folder_state` classifier that maps to a canonical `start_state`; events emit both fields. But `SKILL.md` and `README.md` reference only the generic `folder_state` label, collapsing the vocabulary distinction for downstream consumers. Three vocabulary fragmentation points coexist in `/spec_kit:plan` alone (R41-001 + R42-001/R43-002/R44-003 + R47-002).
- **False negative confirmed for memory-save and deep-research resume.** (R48-001, R49-001, R50-001.) Prior iterations established Gate 3 false positives; iterations 48–50 confirmed the opposite failure: Gate 3's trigger list does NOT include `save context`, `save memory`, `/memory:save`, or `resume` — even though all three are real write-producing flows. `resume deep research` can produce `iteration-NNN.md` + JSONL writes without matching any Gate 3 trigger word.

**Exemplar findings (full file:line):**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R41-003 | `skill_graph_compiler.py:272-353,630-663`; `skill_advisor.py:203-265` | P1 | Topology checks advisory-only; `--validate-only` returns success for graphs that violate routing invariants |
| R41-004 | `manual-playbook-runner.ts:224-246,251-317,438-445` | P1 | Markdown → `Function(...)()` eval with no sandbox |
| R43-001 | `skill_advisor_runtime.py:111-141,165-203`; `skill_advisor.py:105-116,140-152,180-187,1669-1694` | P1 | Live router does not consume per-skill `intent_signals`; `signals` map populated but discarded at scoring |
| R44-002 | `skill_advisor_runtime.py:161-203`; SKILL.md keyword comment blocks | P2 | `parse_frontmatter_fast()` strips `<!-- Keywords: ... -->` comment blocks |
| R45-003 | `skill_graph_compiler.py:559-568,630-663`; `skill_advisor.py:1841-1888` | P1 | Topology warning state non-durable: ZERO-EDGE WARNINGS dropped from serialized graph |
| R45-004 | `manual-playbook-runner.ts:245-271,1203-1217` | P1 | 10/291 active scenario files unparseable; `null`s filtered before coverage count |
| R46-001 | `skill_advisor.py:980-1021,1404-1410,1647,1741-1768` | P1 | All `/spec_kit:*` subcommands collapse to `command-spec-kit` at `kind_priority=2` |
| R46-002 | `skill_graph_compiler.py:272-319,501-568,630-663`; `skill_advisor.py:141-187,321-339` | P1 | Unilateral `conflicts_with` silently promoted to bilateral runtime penalty |
| R46-003 | `manual-playbook-runner.ts:181-194,427-445,930-943,1112-1117` | P1 | `Function(...)()` runs with live `lastJobId` from tool-return payloads |
| R49-003 | `skill_graph_compiler.py:437-472,623-663` | P1 | `validate_dependency_cycles()` only detects 2-node cycles; `a → b → c → a` passes |
| R50-001 | `AGENTS.md:182-186`; `spec_kit_deep-research_auto.yaml:159-167,521-526` | P1 | Gate 3 hard-block trigger list has false-negative for deep-research `resume` write path |

---

## 5. Systemic Themes (strongest signal)

Phase 016 surfaced ~12 cross-cutting systemic patterns. The five with strongest signal and architectural leverage are:

### 5.1 Success-shaped envelope masking skip / defer / partial / failed state

**Files affected (≥5).** `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts`, `graph-metadata-parser.ts`.

**Representative findings.** R8-001, R12-001, R13-004, R17-002, R21-001, R11-002.

**Why systemic.** The pattern appears in every save-path, every query-path, and every cross-boundary response layer. Callers cannot mechanically recover ground truth from return values. Log-scraping or re-running work becomes the only recovery path.

**Architectural fix.** Introduce a uniform result shape:
```ts
type OperationStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';
type OperationResult<T> = {
  status: OperationStatus;
  reason?: string;
  attempts?: number;
  persistedState?: T;
  warnings?: StructuredWarning[];
};
```
Apply this shape to `enrichmentStatus`, `autosaveOutcome`, `responseBuilder.postInsertEnrichment`, `reconsolidationResult`, and `graphMetadataRefreshResult`. This is ~2 weeks of structural refactoring that resolves ~15 findings. The hardest part is not the code change; it's migrating the regression tests that assert all-true booleans.

### 5.2 Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit)

**Files affected.** `hook-state.ts` + `session-stop.ts`; `reconsolidation-bridge.ts` + `reconsolidation.ts`; `graph-metadata-parser.ts`.

**Representative findings.** R31-001, R31-002, R31-003, R31-004, R34-002, R35-001, R39-002, R40-002.

**Why systemic.** The bug class is not "missing locks." It is "decisions made from stale snapshots and then authoritative after the lock is acquired." Atomic rename and SQLite `writeTransaction` both prevent byte-level torn writes; neither prevents stale-decision commits.

**Architectural fix.** Three principles:
1. **CAS at commit.** Every write that depends on a prior read must include a version or hash guard at the commit step.
2. **Same-transaction re-read.** Decisions made on shared DB rows must be re-read inside the writer transaction, not computed outside and trusted at commit.
3. **Single-snapshot batched reads.** When a planning step needs N rows, take them all in one batched query, not N separate per-candidate queries.

This refactoring is the core of P0-candidate-B remediation (Chain B) and is ~3 weeks. It also resolves parts of P0-candidate-A (HookState `updateState` needs a CAS pattern).

### 5.3 Collapsed state vocabulary (missing / empty / stale / degraded)

**Files affected.** `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts`.

**Representative findings.** R9-001, R22-001, R23-001, R26-001, R30-001, R30-002.

**Why systemic.** The runtime has richer state internally than it exposes. `trustStateFromGraphState()` and `trustStateFromStructuralStatus()` both collapse `missing` and `empty` into `stale`. `OpenCode transport` renders only the collapsed envelope label. Hookless consumers see the dishonest label, NOT the richer sibling contract that already exists in the response payload.

**Architectural fix.** Introduce `absent` and `unavailable` as distinct labels from `stale`:
- `live` = graph exists, fresh data, ready to query
- `stale` = graph exists, data may be outdated, query still valid
- `absent` = graph does not exist for this scope
- `unavailable` = graph should exist but is inaccessible (I/O error, lock held, etc.)

Migrate `trustStateFromGraphState`, `trustStateFromStructuralStatus`, the transport renderer, bootstrap/resume/health consumers, and test fixtures. Medium-to-large effort (~1.5 weeks). Unblocks R26-001, R30-001, R30-002, R26-002 in one coherent change.

### 5.4 Governance signal amnesia

**Files affected (unified pattern).** `skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, SKILL.md files, `graph-metadata.json` files, `manual-playbook-runner.ts`, `AGENTS.md`, `/spec_kit:*` YAML assets.

**Representative findings.** R43-001, R44-001, R44-002, R45-001, R45-003, R45-004, R46-001, R46-002, R47-002, R48-001, R49-001, R49-003.

**Why systemic.** Every transition from one governance layer to the next silently reduces signal fidelity without any log, test failure, or error code. The amnesia table:

| Layer | Artifact consumed | Next layer | Signal fate |
| ----- | ----------------- | ---------- | ----------- |
| Compile | Topology warnings | Serialized graph | Dropped (R45-003) |
| Load | In-memory `signals` map | `analyze_request()` | Dropped; no consumer at scoring (R43-001, R44-001) |
| Parse | `<!-- Keywords -->` blocks | `_build_skill_record()` | Dropped; frontmatter parser exits before comment block (R44-002) |
| Runtime | `conflicts_with` unilateral | Bilateral penalty application | Promoted beyond declared scope with no validator (R46-002) |
| Runner | `lastJobId` from tool payload | `Function(...)()` string | Injected without escaping or schema validation (R46-003) |
| Coverage | Null scenario parse results | Coverage total | Filtered out before count; no error emitted (R45-004) |
| Routing | `/spec_kit:subcommand` specificity | Bridge matching | Collapsed to generic bridge before specific routing runs (R46-001) |
| Docs | Two-layer state machine (`folder_state` → `start_state`) | Top-level consumer docs | Flattened back to one string, hiding the vocabulary split (R47-002) |
| Classifier | `save` intent | Gate 3 trigger list | Absent; memory-save separately enforced later (R48-001, R49-001) |
| Classifier | `resume` intent | Gate 3 trigger list | Absent; deep-research resume produces writes without gate (R50-001) |
| Validator | Dependency-cycle scan | `--validate-only` result | Only 2-node cycles checked; longer cycles silently pass (R49-003) |

**Architectural fix.** Each transition must either (a) **assert that the artifact was faithfully forwarded and consumed**, or (b) **explicitly log that it was intentionally dropped**. Neither currently applies to any row in the table. The fix is not a single code change; it is a system-wide design principle:

1. Every compile-time artifact must have a checksum or provenance marker preserved through load.
2. Every load-time map must have a consumer or be documented as intentionally inert.
3. Every classifier must have a typed enum vocabulary, not prose.
4. Every validator must have a test that proves it catches the invariants it claims to check.

Implementation is iterative: Chains A, B, C, and D below address specific rows of the table. The full refactor is ~4 weeks.

### 5.5 Cross-file anti-pattern roster

Consolidated from the 10 interim-synthesis anti-pattern clusters. Each row lists the anti-pattern, files exhibiting it (≥3 required to enter this roster), and representative findings. This roster is the clearest view of how the ~63 distinct findings distribute across recurring structural motifs.

| Anti-pattern | Files affected | Representative findings | Domains |
| ------------ | -------------- | ----------------------- | ------- |
| Success-shaped envelope masking skip/defer/partial/failed | `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts`, `graph-metadata-parser.ts` | R8-001, R12-001, R13-004, R17-002, R21-001, R11-002 | D1, D2 |
| Unvalidated `JSON.parse` feeding both write-target and prompt-visible text | `hook-state.ts`, `shared-payload.ts`, `graph-metadata-parser.ts` | R21-002, R9-002, R11-002 | D1, D2 |
| Collapsed state vocabulary across trust/readiness/freshness axes | `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts` | R9-001, R22-001, R23-001, R26-001, R30-001, R30-002 | D2 |
| Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit) | `hook-state.ts` + `session-stop.ts`, `reconsolidation-bridge.ts` + `reconsolidation.ts`, `graph-metadata-parser.ts` | R31-001, R31-002, R31-003, R31-004, R34-002, R35-001, R37-003 | D3 |
| Deterministic / shared temp path under concurrency | `hook-state.ts` (`.tmp`), `graph-metadata-parser.ts` (ms-precision), command YAMLs + runtime root docs + `data-loader.ts` error contract | R31-001, R31-004, R31-005, R35-003, R36-003 | D3 |
| Test fixture canonizes degraded contract | `post-insert-deferred.vitest.ts`, `code-graph-query-handler.vitest.ts`, `structural-contract.vitest.ts`, `graph-metadata-schema.vitest.ts`, `hook-session-stop-replay.vitest.ts`, `reconsolidation.vitest.ts` | R25-001 through R25-004, R26-001, R35-001, R35-002 | All |
| Flag-based success without helper-result inspection | `post-insert.ts` (4 fields), `session-stop.ts` (`producerMetadataWritten`, `touchedPaths`) | R8-001, R11-005, R12-004, R12-005, R34-001, R35-002 | D1, D3 |
| TOCTOU identity race (stat vs act on same pathname) | `hook-state.ts` (`loadMostRecentState` stat-then-read, `cleanStaleStates` stat-then-unlink, `clearCompactPrime` read-then-clear) | R33-001, R36-001, R40-001 | D3 |
| Success-shaped governance (string-defined contracts that accept violations) | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `AGENTS.md`, `skill_graph_compiler.py`, `manual-playbook-runner.ts`, `skill_advisor_runtime.py` | R41-001, R41-002, R41-003, R41-004, R42-001, R42-002, R42-003, R49-003 | D4 |
| Invisible signal discard (signals loaded end-to-end but silently dropped at scoring boundary) | `skill_advisor.py`, `skill_graph_compiler.py`, `skill_advisor_runtime.py`, `graph-metadata.json`, SKILL.md files | R43-001, R44-001, R44-002 | D4 |

### 5.6 Reinforcement chains — where findings compound rather than sum

The 10 most significant reinforcement chains, consolidated across all interim syntheses. Each chain is a case where two or more findings produce a systemic failure that neither would cause alone.

| # | Constituent findings | Joint effect |
| - | -------------------- | ------------ |
| 1 | R13-002 + R11-002 | Packet with transient read failures indexed as freshly-saved `planned` packet with +0.12 search boost |
| 2 | R21-002 + R28-001 + R33-002 | Corrupt tempdir file produces re-parsed transcripts, duplicate token counting, cross-session state bleed in same event |
| 3 | R9-001 + R30-001 + R30-002 | Runtime has richer state internally than it exposes; dishonest label is the one that reaches hookless OpenCode consumers |
| 4 | R8-001 + R21-001 + R24-001 | Save-path consumers cannot tell "skipped vs failed vs deferred" and cannot mechanically recover from runtime degradation |
| 5 | R31-001 + R31-002 + R33-003 | Claude stop-hook continuity is multiply vulnerable: concurrent writers corrupt state, stop hook reads torn state, failed persist does not stop autosave |
| 6 | R33-001 + R36-001 + R38-001 | Compact-recovery lane vulnerable on three axes simultaneously: fresh payload erased, freshness mate-with-content mismatch, one bad sibling aborts recovery |
| 7 | R34-001 + R35-002 + R33-003 | `SessionStopProcessResult` exports multiple fields overstating durability while autosave proceeds after persist failure |
| 8 | R31-003 + R35-001 + R34-002 | Reconsolidation has coordination gaps on every non-merge path: merge has CAS, conflict has neither, complement doesn't even check for duplicate between plan and commit |
| 9 | R33-002 + R37-001 + R14-001 | Transcript-offset surface has three distinct regression mechanisms: overlapping stop hook, transient zero-offset sentinel, metadata-failure-induced zero |
| 10 | R35-003 + R36-003 + R31-005/R32-005 | `/tmp/save-context-data.json` hazard at four surfaces; fixing one leaves three to re-propagate |

From Domain 4 iterations 43–50 specifically:

| # | Constituent findings | Joint effect |
| - | -------------------- | ------------ |
| 11 | R45-003 + R43-001/R44-001 + R42-002 | Three layers produce success-shaped output simultaneously: topology warnings dropped, intent_signals discarded, health reports ok despite mismatch |
| 12 | R46-001 + R44-001 + R41-003 | Routing-confidence failure chain: subcommands collapse to generic bridge; `intent_signals` that should distinguish subcommands are inert; topology validation is advisory |
| 13 | R46-002 + R41-003 + R42-002 | Unilateral `conflicts_with` edit creates bilateral consequences; not caught by `validate_edge_symmetry`, not visible in `health_check`, not logged at scoring |
| 14 | R46-003 + R45-004 + R41-004 | Playbook runner trust-boundary compounding: silent scenario drop + live-data eval + markdown-as-code; three ways the runner lies about coverage |
| 15 | R47-002 + R41-001 + R42-001/R43-002 | `/spec_kit:plan` has three vocabulary fragmentation points; any one misfires independently; all three can misfire simultaneously |
| 16 | R45-001 + R47-001 + R45-002 + R41-002 | Gate 3 + Gate 2 governance brittleness: false positives from prose triggers + routing drift from audit vocabulary + both controlled by prose |

---

### 5.7 Deterministic / shared temp path under concurrency

**Files affected.** `hook-state.ts` (`.tmp` deterministic), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs, runtime root docs, `data-loader.ts` error contract.

**Representative findings.** R31-001, R31-004, R31-005, R35-003, R36-003, R32-005.

**Why systemic.** The `/tmp/save-context-data.json` hazard is taught at **four independent surfaces**: command YAMLs, runtime root docs, `data-loader.ts` runtime error message, and command assets. Removing it from one surface leaves three others to re-propagate the same hazard. Additionally, the `.tmp` deterministic suffix in `hook-state.ts` and the pid+Date.now ms-precision suffix in `graph-metadata-parser.ts` both have byte-level collision risks.

**Architectural fix.** Two-part change:
1. **Remove `/tmp/save-context-data.json` from all four surfaces.** (AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md; four command YAMLs; `data-loader.ts` `NO_DATA_FILE` error text; `generate-context.ts` CLI help stays preferring `--stdin`/`--json`.) This is ~1 day of doc editing.
2. **Replace deterministic temp suffixes with `.tmp-<pid>-<counter>-<random>`.** One-line change in `hook-state.ts:saveState()` and `graph-metadata-parser.ts:writeGraphMetadataFile()`. ~2 hours.

---

## 6. Remediation Backlog (actionable)

### 6.1 Quick wins (Small effort, <1 day each, ≤3 file edits, <100 LOC)

Ordered by findings-addressed leverage:

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| 1 | Wire `intent_signals` from `signals` map into `analyze_request()` scoring (§A2 below) | R43-001, R44-001 | 2h |
| 2 | Extend `COMMAND_BRIDGES` with per-subcommand entries for all `/spec_kit:*` subcommands | R46-001 | 2h |
| 3 | Extend `parse_frontmatter_fast()` to capture `<!-- Keywords: ... -->` comment blocks | R44-002 | 2h |
| 4 | Serialize topology warning payloads into compiled graph; expose in `health_check()` | R45-003 | 2h |
| 5 | Add `conflicts_with` reciprocity check to `validate_edge_symmetry()` | R46-002 | 1h |
| 6 | Extend `validate_dependency_cycles()` to detect arbitrary-length cycles (Tarjan's SCC or DFS with color marking) | R49-003 | 3h |
| 7 | Assert `parsedCount == filteredCount` in playbook runner before coverage computation; emit named warning on drop | R45-004 | 2h |
| 8 | Reject invalid `edgeType` in `code-graph/query.ts` with `status: "error"` | R12-002, R14-002 | 1h |
| 9 | Add `Math.max()` offset monotonicity guard in `hook-state.ts` `updateState()` | R33-002 | 1h |
| 10 | Remove `/tmp/save-context-data.json` from `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` | R35-003 | 1h |
| 11 | Update `data-loader.ts` `NO_DATA_FILE` error text to teach `--stdin` / `--json` | R36-003 | 1h |
| 12 | Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` in `hook-state.ts` | R31-001, R31-004 | 1h |
| 13 | Validate outline subject path via `resolveSubjectFilePath()` before `queryOutline()` | R13-003 | 1h |
| 14 | Stop swallowing `ensureCodeGraphReady()` exceptions; surface as `status: "error"` | R3-002, R22-001, R23-001, R25-002, R27-002 | 2h |
| 15 | Use unique temp filenames in `graph-metadata-parser.ts:writeGraphMetadataFile()` | R31-004, R32-004 | 1h |
| 16 | Guard `blast_radius` against unresolved subjects; return `status: "error"` if resolution fails | R11-003 | 1h |
| 17 | Flag dangling edges as corruption in `code-graph/query.ts` payload | R17-001 | 1h |
| 18 | Validate `SharedPayloadKind`/`producer` at runtime (not just TypeScript) | R9-002 | 1h |
| 19 | Add `handleSessionHealth()` structural-trust section | R26-002 | 1h |
| 20 | Identity-based `clearCompactPrime()` (check `cachedAt` or `opaqueId` before nulling) | R33-001 | 2h |
| 21 | Eliminate transient zero-offset sentinel in `storeTokenSnapshot()` | R37-001 | 2h |
| 22 | Add `autosaveOutcome` field to `SessionStopProcessResult` | R39-001 | 2h |
| 23 | Gate `touchedPaths` on confirmed persist | R35-002 | 1h |
| 24 | Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()` | R38-001, R38-002 | 2h |
| 25 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` | R40-001 | 2h |
| 26 | Align `spec_kit_plan_auto.yaml` `folder_state` vocabulary with `intake-contract.md` | R41-001 | 1h |
| 27 | Promote `skill_graph_compiler.py` topology checks to hard errors | R41-003 | 2h |
| 28 | Mark `start_state` vs `folder_state` vocabulary boundary in YAML assets with explicit comments | R47-002 | 1h |
| 29 | Document that `producerMetadataWritten`, `touchedPaths` are attempted-write signals (or remove them) | R34-001, R35-002 | 30m |

**Total quick-win effort: ~50h = ~1 engineer-week** for 29 isolated fixes that address ~40 of the ~63 distinct findings. Quick wins have minimal test-migration overhead because they're additive or localized.

### 6.2 Medium refactors (1–5 days each)

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| M1 | Add runtime `HookStateSchema` (Zod) validation to `loadState()` + `loadMostRecentState()`; quarantine to `.bad` on failure | R21-002, R25-004, R28-001, R29-001 | 3d |
| M2 | Add `schemaVersion` field to `HookState` + migration step; reject mismatched versions with `schema_mismatch` | R29-001 | 2d |
| M3 | Collapse three separate `recordStateUpdate()` calls in `processStopHook()` into single atomic patch | R31-002, R32-002 | 2d |
| M4 | Refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` (or change `detectSpecFolder`'s "prefer currentSpecFolder" rule) | R37-002 | 1d |
| M5 | Add predecessor `content_hash` + `is_deprecated = FALSE` CAS guard to `executeConflict()` | R31-003, R35-001, R32-003 | 3d |
| M6 | Wrap per-candidate `readStoredScope()` inside same transaction as vector search; or batch scope reads | R39-002, R40-002 | 2d |
| M7 | `validateGraphMetadataContent()` returns `{ ok, metadata, migrated, migrationSource? }`; propagate through `memory-parser` and ranking | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | 3d |
| M8 | Trust-state vocabulary expansion: introduce `absent`/`unavailable` distinct from `stale`; migrate producers + consumers + tests | R9-001, R26-001, R30-001, R30-002 | 4d |
| M9 | Replace `Function(...)()` eval in `manual-playbook-runner.ts` with typed step executor + schema-validated arg parser | R41-004, R46-003, R50-002 | 4d |
| M10 | Extract Gate 3 trigger classification into shared module / JSON schema; add read-only disqualifier tokens; add save/resume triggers | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 4d |
| M11 | Define `BooleanExpr` schema for YAML `when:` predicates; replace string literals with typed boolean conditions; separate `when:` (predicate) from `after:` or `trigger:` (prose timing) | R42-001, R43-002, R44-003, R48-002, R49-002 | 4d |
| M12 | Add disambiguation tier to `analyze_request()` for deep-research vs review prompts containing audit vocabulary | R45-002 | 2d |
| M13 | Replace `enrichmentStatus` boolean record with enum-valued `OperationResult<T>` map; propagate per-step results through `memory-save`, `response-builder`, `follow-up-api` | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001 | 5d |

**Total medium-refactor effort: ~40d = ~8 engineer-weeks.** Most impactful: M13 (enum status) alone resolves ~10 findings but requires test migration.

### 6.3 Structural refactors (1–2 weeks each)

| # | Change | Findings | Est. |
| - | ------ | -------- | ---- |
| S1 | **Transactional reconsolidation** — move scope filter + complement decision inside writer transaction; add predecessor CAS to conflict; re-run similarity inside tx for complement | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 | 2w |
| S2 | **HookState schema versioning + runtime validation + unique temp paths + CAS in updateState** — single overhaul across `hook-state.ts`, `session-stop.ts`, `session-prime.ts` (Claude + Gemini), `session-resume.ts` | R21-002, R25-004, R28-001, R29-001, R31-001, R31-002, R32-001, R32-002, R33-001, R33-002, R33-003, R34-001, R35-002, R36-001, R37-001, R37-002, R38-001, R38-002, R40-001 | 2w |
| S3 | **Graph-metadata migration propagation** — `migrated: boolean` flag propagation from `graph-metadata-parser.ts` through `memory-parser.ts` into stage-1 candidate ranking; remove +0.12 boost for `migrated=true` or `qualityScore: 1` rows; update tests | R11-002, R13-002, R20-002, R21-003, R22-002, R23-002, R25-003 | 1w |
| S4 | **Skill routing trust-chain** — wire `intent_signals` into scoring (A2); per-subcommand bridge table (A0); `conflicts_with` reciprocity check (A4); topology warnings serialized + surfaced (A5); health check inventory comparison (A5); disambiguation tier for deep-research vs review (A2b) | R43-001, R44-001, R44-002, R42-002, R46-001, R46-002, R45-003, R45-002 | 1w |
| S5 | **Gate 3 typed intent classifier** — shared module / JSON schema replacing prose; supports read-only disqualifiers; includes save/resume/continue trigger phrases; runtime validation | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 1.5w |
| S6 | **Playbook runner trust-boundary isolation** — replace `Function(...)()` + `substitutePlaceholders()` with typed step executor + schema-validated fixtures; explicit `automatable: boolean` field on scenario metadata; assert `parsedCount == filteredCount` | R41-004, R42-003, R45-004, R46-003, R50-002 | 1.5w |
| S7 | **`when:` YAML predicate typed grammar** — define `BooleanExpr` schema; separate predicate-`when:` from prose-`after:`; add asset-predicate test suite covering Step 0 branch inputs and `intake_triggered`/`intake_completed` event fields | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 | 1.5w |

**Total structural-refactor effort: ~10.5w = ~2.5 engineer-months.** S1 and S2 can run in parallel (different files). S4 can run in parallel with S1/S2 (skill-advisor vs mcp_server). S5, S6, S7 are independent. Entire refactor set in parallel: ~4 weeks wall clock with 3 engineers.

### 6.4 Dependency graph

```
QUICK WINS (29 items, 1 engineer-week, parallel)
  |
  +-- unblocks -->
  |
  v
MEDIUM REFACTORS
  M1 -------> M2 (schema versioning needs validation)
  M7 -------> M8 (migration needs vocabulary expansion)
  M13 -------> S1 (enum status needed for transactional recon)
  |
  v
STRUCTURAL REFACTORS
  S2 (HookState overhaul) depends on M1, M2, M3, M4
  S1 (transactional recon) depends on M5, M6, M13
  S3 (migration propagation) depends on M7
  S4 (skill routing) independent of S1-S3
  S5 (Gate 3 classifier) independent
  S6 (playbook runner) depends on M9, M10
  S7 (YAML predicates) depends on M11
```

### 6.5 Test-suite countermeasures (critical path)

**Tests that MUST be updated as part of the structural refactors** (they currently codify the degraded contract):

| Test file | Current assertion | New assertion required | Fix chain |
| --------- | ----------------- | ---------------------- | --------- |
| `post-insert-deferred.vitest.ts:11-48` | All-true booleans for deferred | Enum status with `'deferred'` | M13 |
| `structural-contract.vitest.ts:90-111` | `status=missing` + `trustState=stale` | Distinct labels per axis | M8 |
| `graph-metadata-schema.vitest.ts:223-245` | Legacy fallback = clean success | `{ ok: true, migrated: true, migrationSource: 'legacy' }` | M7 |
| `code-graph-query-handler.vitest.ts:12-18` | Hoisted `fresh` readiness | Test fail-open branch explicitly | Quick-win #14 |
| `handler-memory-save.vitest.ts:546-557,2286-2307` | Post-insert all-true | Enum status | M13 |
| `hook-session-stop-replay.vitest.ts:14-56` | Autosave disabled | Enabled with failure injection | S2 |
| `opencode-transport.vitest.ts:33-60` | Only `trustState=live` | `missing`/`absent` cases | M8 |
| `hook-state.vitest.ts:4-224` | No `cleanStaleStates` invocation | TOCTOU stat-then-unlink regression | D1 (P0-D) |
| `reconsolidation.vitest.ts:790-855` | Single-writer conflict | Two-concurrent-conflict race | S1 |
| `reconsolidation-bridge.vitest.ts:255-330` | Static mock candidates | Governed-scope mutation during filter | S1 |
| `test_skill_advisor.py:73-186` | No intent_signals assertion | `/spec_kit:deep-research` → `sk-deep-research`; intent_signals boost verification | S4 |
| `transcript-planner-export.vitest.ts:146-217` | Response summaries only | YAML `when:` predicate evaluation | S7 |
| `assistive-reconsolidation.vitest.ts:17-234` | Helper thresholds | Competing candidate insert between recommendation and commit | S1 |
| `skill-graph-schema.vitest.ts:1-156` | Dispatcher routing | Compiler invariants: symmetry, weight-band, orphans, cycle length >2 | S4 |

**Test migration effort breakdown:**

| Test file | LOC affected (est.) | Migration complexity | Depends on |
| --------- | ------------------- | -------------------- | ---------- |
| `post-insert-deferred.vitest.ts` | ~80 | Low (enum replacement) | M13 |
| `structural-contract.vitest.ts` | ~120 | Medium (assertions split across axes) | M8 |
| `graph-metadata-schema.vitest.ts` | ~150 | Medium (migration marker threaded) | S3 |
| `code-graph-query-handler.vitest.ts` | ~50 | Low (hoist removal) | QW #14 |
| `handler-memory-save.vitest.ts` | ~200 | High (entire stub shape changes) | M13 |
| `hook-session-stop-replay.vitest.ts` | ~150 | High (enable autosave + inject failures) | S2 |
| `opencode-transport.vitest.ts` | ~80 | Low (add `missing`/`absent` cases) | M8 |
| `hook-state.vitest.ts` | ~180 | Medium (add TOCTOU + all-or-nothing cases) | S2 |
| `reconsolidation.vitest.ts` | ~300 | High (two-concurrent-writer infrastructure) | S1 |
| `reconsolidation-bridge.vitest.ts` | ~200 | High (governed-scope mutation infra) | S1 |
| `test_skill_advisor.py` | ~250 | Medium (routing-specificity + intent_signals assertions) | S4 |
| `transcript-planner-export.vitest.ts` | ~100 | Low–medium (YAML predicate cases) | S7 |
| `assistive-reconsolidation.vitest.ts` | ~150 | High (competing-candidate insert) | S1 |
| `skill-graph-schema.vitest.ts` | ~150 | Medium (compiler invariant coverage) | S4 |

**Total test migration effort: ~2100 LOC.** At ~300 LOC/day for quality test work, this is ~7 engineer-days of pure test work. In the week-by-week plan, test migration is distributed across weeks 4–9 and consumes ~15% of total effort (matches the estimate in the Section 1 executive summary).

**Code-level exemplar for M13 (enum status refactor):**

Before:
```ts
type EnrichmentStatus = Record<string, boolean>;
const status: EnrichmentStatus = {
  summaries: true,       // true when: success, disabled, nothing-to-do, deferred
  graphLifecycle: true,  // true when: success, skipped (onIndex returns skipped:true)
  causalLinks: true,     // true when: success OR partial-unresolved OR disabled
  entityLinking: true,   // true when: success OR density-guarded OR feature-off
};
```

After:
```ts
type OperationStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';
type OperationResult = {
  status: OperationStatus;
  reason?: string;
  warnings?: string[];
};
type EnrichmentStatus = Record<string, OperationResult>;
const status: EnrichmentStatus = {
  summaries: { status: 'ran' },
  graphLifecycle: { status: 'skipped', reason: 'indexer_disabled_for_file' },
  causalLinks: { status: 'partial', reason: 'unresolved_references', warnings: ['ref_A not found'] },
  entityLinking: { status: 'skipped', reason: 'density_guard_triggered' },
};
```

This structural change resolves R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001, R13-005. The downstream changes in `response-builder.ts`, `memory-save.ts`, and tests are mechanical once the type is in place.

**Code-level exemplar for B1 (predecessor CAS):**

Before:
```ts
// lib/storage/reconsolidation.ts executeConflict()
await db.run(
  `UPDATE memory_index SET is_deprecated = TRUE, deprecated_at = ? WHERE id = ?`,
  [nowIso, predecessor.id]
);
```

After:
```ts
const updated = await db.run(
  `UPDATE memory_index SET is_deprecated = TRUE, deprecated_at = ?
   WHERE id = ?
     AND content_hash = ?
     AND is_deprecated = FALSE`,
  [nowIso, predecessor.id, predecessor.content_hash]
);
if (updated.changes === 0) {
  return {
    outcome: 'conflict_stale_predecessor',
    reason: predecessor.is_deprecated ? 'already_superseded' : 'content_hash_mismatch',
    abortInsert: true,
  };
}
```

This change alone resolves R31-003 and R35-001; the caller must then handle the stale-predecessor outcome by either aborting the save or re-planning against a fresh snapshot.

**New tests required** (no current coverage; should be added before declaring fix "done"):

- Two-concurrent-conflict save against same predecessor (R35-001, P0-B)
- Mixed-snapshot scope filter under governed-scope mutation (R39-002, R40-002, P0-B)
- TOCTOU cleanup → all-or-nothing scan abort → cold-start (R40-001, R38-001, R37-001, P0-D)
- Two-stop overlap exposing transient `lastTranscriptOffset: 0` (R37-001, R33-002, P0-A)
- Compact prime identity race (`readCompactPrime` → write → `clearCompactPrime`) (R33-001, P0-A)
- HookState schema-version mismatch rejection (R29-001, P0-A)
- `Function(...)` with injected adversarial `lastJobId` (R46-003, W2)
- Ranking-stability assertion: `sk-deep-research` vs `sk-code-review` margin ≥ 0.10 for audit-vocabulary prompts (R45-002, S4)
- `/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` (R46-001, S4)
- Unilateral `conflicts_with` does NOT penalize non-declaring skill (R46-002, S4)
- `health_check()` returns `status: "degraded"` when topology warnings present (R45-003, S4)
- Scenario count before vs after null-filter equals (R45-004, S6)
- `intake_triggered`/`intake_completed` events contain both `folderState` and `startState` with distinct values (R47-002, S7)
- `phase transition` prompt preceded by `confirm` does NOT trigger Gate 3 (R45-001, R47-001, S5)
- `synthesis phase` prompt preceded by `verify` does NOT trigger Gate 3 (R47-001, S5)
- `save context` / `save memory` / `/memory:save` prompts DO trigger Gate 3 (R48-001, R49-001, S5)
- `resume deep research` prompt DOES trigger Gate 3 (R50-001, S5)
- `implement` / `rename` prompts trigger Gate 3 regardless of context (regression for false negatives)
- Arbitrary-length `depends_on` cycle (e.g., A→B→C→A) fails `--validate-only` (R49-003, quick-win #6)
- YAML `when:` predicate with `true`/`false` lowercase or `True`/`False` titlecase does NOT match the `TRUE`/`FALSE` contract (R42-001, R43-002, R44-003, S7)

---

## 7. Phase 017 Kickoff Plan

### 7.1 Recommended P0 fix order

**Month 1 (Week 1–4): P0-candidates D, A, C (parallel).**

- **Week 1–2 (1 engineer):** P0-candidate-D — TOCTOU cleanup. Smallest, most isolated, highest operational frequency. Quick wins #24, #25, #9, #21, #22 + new TOCTOU + all-or-nothing + zero-offset-sentinel tests. Also unblocks parts of S2.
- **Week 1–4 (1 engineer):** P0-candidate-A — HookState + cross-runtime tempdir. M1 + M2 + M3 + M4 + quick wins #12, #20, #23, #29. S2 structural refactor completes end of Week 4. Highest blast radius but moderate effort given the existing testing harness.
- **Week 2–4 (1 engineer):** P0-candidate-C — Graph-metadata laundering. M7 + C1–C5 in §3.3. Smaller than A or B; affects search ranking so user-visible impact on retrieval quality.

**Month 2 (Week 5–8): P0-candidate-B + Domain-4 routing chain (parallel).**

- **Week 5–6 (2 engineers):** P0-candidate-B — Transactional reconsolidation. S1 structural refactor: M5 + M6 + conflict CAS + complement-inside-tx + assistive-in-tx. Largest single workstream; two engineers to parallelize test-migration work.
- **Week 5–7 (1 engineer):** S4 skill routing trust chain. A0 + A1 + A2 + A2b + A3 + A4 + A5. Quick wins #1, #2, #3, #4, #5, #6 completed first; medium items M12; structural items S4. This fixes the watch-priority-1 routing chain.
- **Week 7–8 (1 engineer):** S5 Gate 3 typed classifier. Address all R41-002 / R45-001 / R47-001 / R48-001 / R49-001 / R50-001 in one coherent refactor. Critical for eliminating false positives AND false negatives simultaneously.

**Month 3 (Week 9–12): Domain-4 remainder + documentation/regression cleanup.**

- **Week 9–10 (1 engineer):** S6 playbook runner isolation + S7 YAML predicate grammar. Complete Domain 4 structural fixes. This closes the test-scaffolding + command-asset governance loop.
- **Week 10–11 (1 engineer):** M8 trust-state vocabulary expansion (`absent`/`unavailable` distinct from `stale`). Touches bootstrap/resume/health/opencode-transport + many consumers + many test fixtures. The longest test-migration piece.
- **Week 11–12 (1 engineer):** M13 enum status refactor. Last structural piece. Affects `post-insert.ts`, `response-builder.ts`, `follow-up-api.ts`, and many tests. Cleanest when done last because most downstream consumers have already been updated in earlier weeks.

### 7.2 Effort budget summary

| Workstream | Engineers | Duration | Total engineer-weeks |
| ---------- | --------- | -------- | -------------------- |
| P0-candidate-D (TOCTOU cleanup) | 1 | 2w | 2 |
| P0-candidate-A (HookState) | 1 | 4w | 4 |
| P0-candidate-C (Graph-metadata laundering) | 1 | 3w | 3 |
| P0-candidate-B (Transactional reconsolidation) | 2 | 2w | 4 |
| S4 Skill routing chain | 1 | 3w | 3 |
| S5 Gate 3 classifier | 1 | 2w | 2 |
| S6 Playbook runner | 1 | 1.5w | 1.5 |
| S7 YAML predicates | 1 | 1.5w | 1.5 |
| M8 Trust-state vocabulary | 1 | 1.5w | 1.5 |
| M13 Enum status | 1 | 2w | 2 |
| **Total** | 3 avg | 12w | **24.5** |

**Total effort estimate: ~24.5 engineer-weeks (6 engineer-months).** Parallelizable to ~12 weeks wall clock with 3 engineers.

Note: Quick wins (§6.1) can be opportunistically picked up by anyone between structural items. Their ~1 engineer-week total is already absorbed in the workstreams above as they're dependency-prerequisites or documentation-level.

### 7.3 Test suite updates required (by workstream)

- **P0-A (S2):** `hook-state.vitest.ts`, `hook-session-stop-replay.vitest.ts`, `hook-session-start.vitest.ts`, `session-resume.vitest.ts`, `hook-stop-token-tracking.vitest.ts`, `hook-precompact.vitest.ts`, `token-snapshot-store.vitest.ts`.
- **P0-B (S1):** `reconsolidation.vitest.ts`, `reconsolidation-bridge.vitest.ts`, `assistive-reconsolidation.vitest.ts`, `handler-memory-save.vitest.ts`.
- **P0-C (S3):** `graph-metadata-schema.vitest.ts`, `graph-metadata-integration.vitest.ts`, `memory-parser` tests for quality score, stage-1 candidate generation tests.
- **P0-D (quick wins):** `hook-state.vitest.ts` (new TOCTOU + all-or-nothing tests).
- **S4:** `test_skill_advisor.py` extensive additions, `skill-graph-schema.vitest.ts` for compiler invariants.
- **S5:** New `gate3-classifier.test.ts` (or equivalent).
- **S6:** `manual-playbook-runner.test.ts` or equivalent.
- **S7:** New asset-predicate test suite; `transcript-planner-export.vitest.ts` additions.
- **M8:** `structural-contract.vitest.ts`, `opencode-transport.vitest.ts`, `session-bootstrap.vitest.ts`, `session-resume.vitest.ts`, `session-health.vitest.ts`, `shared-payload.vitest.ts`.
- **M13:** `post-insert-deferred.vitest.ts`, `handler-memory-save.vitest.ts`, `memory-save-planner-first.vitest.ts`, `response-builder.vitest.ts`.

### 7.4 Risks and open questions for Phase 017 planning

1. **Does `command-spec-kit` enforce Gate 3 independently of skill routing?** (Determines whether Watch-priority-1 becomes P0-candidate-E.) Resolve in Phase 017 Week 1.
2. **Are the existing regression tests that encode degraded contracts intentionally protecting compatibility, or are they oversights?** (Determines whether test migration is a clean delete-and-replace or requires compatibility shims.) Resolve before starting S1 / S2 / S3.
3. **Can `HookState` gain a `schemaVersion` field without breaking already-quiesced state files?** (Determines whether A3 needs a migration step.) Open question from iteration 32; still unresolved.
4. **What is the actual concurrent-writer surface at runtime?** Seven distinct interleavings characterized by iteration 38; real-load measurement still missing. A 2-day measurement pass before S1/S2 would size the actual blast radius.
5. **Which `/spec_kit:*` subcommands currently exist and need bridge entries?** (Determines scope of A0.) Enumerate: `plan`, `complete`, `implement`, `deep-research`, `deep-review`, `resume`. Additional subcommands may exist in less-trafficked assets.

### 7.5 Week-by-week Phase 017 plan detail

| Week | P0-A (Eng 1) | P0-B (Eng 2) | P0-C (Eng 3) | P0-D + Watch | Support |
| ---- | ------------ | ------------ | ------------ | ------------ | ------- |
| 1 | M1 (Zod HookStateSchema) | M5 (predecessor CAS) | M7 (`migrated` flag propagation) | D1–D5 (2 days solo), then start S4/A0 (subcommand bridges) | Domain 5 pass begins (1 engineer part-time) |
| 2 | M2 (schemaVersion) + quick wins #12, #20 | M6 (per-candidate batched scope read) | M7 complete + S3 (indexing penalty for migrated) | S4/A1–A2 (keyword comments + intent_signals wiring) | Resolve open question #1 (Gate 3 in bridge) |
| 3 | M3 (collapse stop-hook updates) | B2 (complement inside tx) | S3 complete | S4/A2b–A3 (disambiguation + tests) | Domain 5 pass: new tests staged |
| 4 | M4 (refresh lastSpecFolder) + S2 completion | B4 (assistive inside tx or stale-flag) | Test migration for graph-metadata suite | S4/A4–A5 (topology hard + health compare) | P0-C declared done |
| 5 | Test migration for hook-state + session-stop suites | S1 completion + test migration | S5 begins (Gate 3 classifier) — Eng 3 moves to S5 | S4 complete | Run full regression; review coverage |
| 6 | P0-A declared done | Test migration ongoing | S5 typed triggers + read-only disqualifiers | S6 begins (playbook runner) | M8 begins (trust-state vocabulary) |
| 7 | M13 begins (enum status refactor) | P0-B declared done (test migration complete) | S5 completion | S6/C1-C2 (typed step + automatable field) | M8 (vocabulary) continues |
| 8 | M13 propagation through response-builder | S7 begins (YAML predicate grammar) | S7 continues | S6 completion | M8 complete |
| 9 | M13 test migration | S7 completion + test suite | Regression pass | Closing-pass review (11 untouched files §8.2) | Final integration |
| 10 | Final integration + regression | Final integration + regression | Phase 017 closeout | Phase 017 closeout | Phase 017 closeout |

**Wall-clock = 10 weeks.** Engineers 1, 2, 3 run roughly parallel tracks. Support track handles Domain 5 catch-up, open-question resolution, and test-coverage backfill. The plan is tight but feasible; it assumes no major refactors beyond those in §6.

### 7.6 What this plan does NOT fix (parked for Phase 018+)

- **Gemini lane cross-audit.** Only spot-checked in Phase 016; Phase 018 should do a dedicated Gemini parity audit.
- **Context handler readiness fail-open.** `handlers/code-graph/context.ts` hinted at same pattern as `query.ts` but not fully audited.
- **Entity-linker cross-memory blast radius.** R7-002 flagged stale-row linking after soft-fail; cross-memory scope not investigated.
- **Shared payload marker sanitization.** R10-002 identified prompt-injection risk via unescaped `[PROVENANCE:]` interpolation; exploitability not confirmed. If the fix is bounded, add to Phase 017 as quick-win; otherwise park.
- **Handover-state routing enum.** Prose-defined `handover_state` vocabulary never audited.
- **`opencode.json` + `.utcp_config.json` naming contracts.** Stringly-typed MCP namespace pattern (`{manual_name}.{manual_name}_{tool_name}`) never audited.
- **`generate-context.js` trigger-phrase surface.** Memory category / triggers / scope fields feed semantic search; never audited for schema validation.
- **Real-load concurrency measurement.** Seven interleavings characterized; actual production frequencies not measured. Phase 017 structural fixes work regardless of frequency, but Phase 018 measurement would refine test harness priorities.

---

## 8. Research Quality Review

### 8.1 Was 50 iterations the right stopping point?

**Yes, with caveats.** Signal density dropped after iteration 47, and the novel-finding rate collapsed in the last three iterations: iterations 48–50 together surfaced 4 additional findings (R48-001, R48-002, R49-003, R50-001) compared to ~11 findings between iterations 44–47. This matches the research-loop convergence pattern.

However, Domain 5 was never run as a dedicated pass. The subsidiary Domain-5 evidence in every iteration is extensive, but a targeted pass on test-coverage gaps would have produced a more structured coverage-regression inventory. Recommendation: Phase 017 should do a 5-iteration Domain-5 pass in parallel with P0-candidate-A remediation to codify the new tests before they are needed.

### 8.2 Coverage gaps — what this research didn't investigate deeply enough

**Surface-level coverage.** The following files were touched but not deeply audited:

- `mcp_server/lib/code-graph/ensure-ready.ts` — Iteration 5 hinted at partial-persistence fail-open but did not confirm whether `setLastGitHead()` on partial success actually blocks later stale detection for unpersisted files.
- `mcp_server/handlers/code-graph/context.ts` — Iteration 5 hinted at readiness-fail-open inheritance from `code_graph_query` but not fully audited.
- `mcp_server/lib/search/graph-lifecycle.ts` — `onIndex()` returns `{ skipped: true }` under three different conditions; whether they are all semantically equivalent is not established.
- `mcp_server/lib/storage/reconsolidation.ts:executeMerge()` — known to have CAS for `updated_at` + `content_hash`; whether it also checks governance scope is not confirmed (R32-003 hints no).
- `mcp_server/lib/search/entity-linker.ts:527-550,608-640,1096-1132` — R7-002 identified soft-fail + subsequent stale-row linking; cross-memory blast radius or per-memory containment not investigated.
- `mcp_server/handlers/memory-save.ts:2159-2171,2250-2304` — R34-002 hypothesized timeline between reconsolidation planning and `writeTransaction` acquisition; not measured under real load.
- `mcp_server/hooks/claude/shared.ts:109-123` — R10-002 identified prompt-injection risk via `]` or newline in `producer` string; exploitability not confirmed.
- `mcp_server/hooks/claude/compact-inject.ts:393-407,416-422` — R31-001 flagged concurrent producer risk; precise interleaving with Claude session-stop + Gemini session-stop not characterized.
- `command/spec_kit/assets/spec_kit_complete_auto.yaml` / `spec_kit_implement_auto.yaml` / `spec_kit_deep-review_auto.yaml` — sampled at iteration 48/50 but not systematically audited for the same `when:`/`folder_state` vulnerabilities.
- `scripts/memory/generate-context.js` trigger-word surface for memory category / triggers / scope — proposed but not investigated.
- Handover-state routing rules (`handover_state` enum) — proposed but not investigated.
- `opencode.json` + `.utcp_config.json` MCP naming contracts — proposed but not investigated.

**Recommended follow-up.** Phase 017 Week 1 should do a 2-day "closing pass" on these 11 files before structural refactors start, to avoid discovering additional P1/P2 findings mid-refactor.

### 8.3 Weaker findings that need verification before acting on them

The following findings are based on code reading + partial live repro; before any P0 remediation, verify:

- **R34-002 (complement duplicate window).** Hypothesized but not stress-tested. Construct a two-concurrent-save regression (different new memory IDs, same content, same scope) and verify both end up as independent complement rows rather than one merging into the other.
- **R35-001 (conflict fork).** Hypothesized multi-successor fan-out. Construct a two-concurrent-conflict regression and verify both create `supersedes` edges to the same predecessor.
- **R33-001 (compact prime identity race).** Construct a read/write/clear overlap on `pendingCompactPrime` and verify the newer payload is erased.
- **R40-001 (cleanup TOCTOU).** Construct a save-between-stat-and-unlink interleave and verify the fresh state file is deleted.
- **R46-003 (`Function(...)` eval with `lastJobId`).** Construct a scenario with an adversarial `lastJobId` value containing JavaScript injection syntax and verify it executes. Already has a Node-level ReferenceError confirmation in R50-002 for the `{jobId}` shorthand case; but the R46-003 live-data substitution hasn't been adversarially tested.

For each: a ~30-minute test-harness construction should convert hypothesis into confirmed exploit before committing a structural fix.

### 8.4 Open questions still unanswered

*From interim-synthesis-47-iterations §6.3 and additions from iterations 48–50:*

| File | Open question |
| ---- | ------------- |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Does `setLastGitHead()` on partial-persistence success block later stale detection? |
| `mcp_server/handlers/code-graph/context.ts` | Does this inherit readiness-fail-open from `code_graph_query`? |
| `mcp_server/lib/search/graph-lifecycle.ts` | `onIndex()` `skipped: true` — same semantics as `post-insert.ts` booleans? |
| `mcp_server/lib/storage/reconsolidation.ts:executeMerge()` | Does CAS also check governance scope, or only `updated_at` + `content_hash`? |
| `mcp_server/lib/search/entity-linker.ts` | Cross-memory or per-memory stale-entity blast radius? |
| `mcp_server/handlers/memory-save.ts` | Real timeline between reconsolidation planning and `writeTransaction` acquisition under load? |
| `mcp_server/hooks/claude/shared.ts:109-123` | Can a crafted `producer` string with `]` or newline break `[PROVENANCE:]` marker? |
| `mcp_server/hooks/claude/compact-inject.ts` | Does it use the same unlocked `updateState()` pattern? |
| `skill_advisor.py:COMMAND_BRIDGES` | Full enumeration of missing `/spec_kit:*` subcommands; other command families with same prefix-collapse gap? |
| `skill_graph_compiler.py:validate_edge_symmetry()` | How many currently-asymmetric `conflicts_with` edges in live graph? Which skills bilaterally affected? |
| `manual-playbook-runner.ts:substitutePlaceholders()` | Complete enumeration of `runtimeState` fields that can be injected; any from network or external APIs? |
| `command/spec_kit/assets/` | Shared event schema for `intake_triggered` / `intake_completed`, or each asset emits independently? |
| `intake-contract.md:39-49,56-76` | Does it define `folderState` as valid synonym for `startState`, or is `SKILL.md:563` / `README.md:624-626` usage undocumented drift? |
| `command/spec_kit/assets/spec_kit_complete.yaml` / `spec_kit_implement.yaml` / `spec_kit_deep-research.yaml` | Full unsigned-boolean-DSL + `folder_state` vocabulary audit; how many additional branch points share the vulnerability? |
| Gate 3 classifier | Does any runtime validator check intent against a shared list, or does each runtime independently re-implement classification? |
| Regression suites | Which of the `tests/*.vitest.ts` files in the "canonize degraded contract" list are intentionally protecting compatibility vs oversights? |

### 8.5 Would more iterations have added value?

**Not to the Domain-1 through Domain-4 findings.** Signal density dropped after iteration 47; iterations 48–50 mostly refined or consolidated existing findings. 50 was near the right stopping point for those domains.

**Yes for Domain 5.** A dedicated 5–10 iteration pass on test coverage gaps would have produced a concrete regression harness inventory, sized the test-migration cost precisely, and identified any additional "dishonest contract" tests beyond the 8 already known. Recommendation: Phase 017 should either do this Domain-5 pass in parallel with P0 remediation, or accept ~20% extra schedule for test-writing during structural refactor work.

**Partially for the closing pass.** ~2 additional iterations focused on the 11 untouched files (§8.2) would likely surface 3–5 additional P1/P2 findings. Not enough to change the remediation plan materially but sufficient to close the "we might find something new during fixing" risk.

### 8.6 Signal density by iteration range

| Iteration range | Raw findings | Distinct additions | Novel patterns | Commentary |
| --------------- | ------------ | ------------------ | -------------- | ---------- |
| 1–10 (Foundational) | 23 | 10 | 4 | Reconnaissance pass establishing baseline; all 4 patterns (scope split, freshness asymmetry, trust collapse, compact asymmetry) later reinforced |
| 11–20 (Domain 1) | 28 | 14 | 6 | Deepest density; produced the 6 patterns that made "silent fail-open" into a coherent framework |
| 21–30 (Domain 2) | 24 | 11 | 7 | State-laundering was the key novel insight; self-contradictory payloads surfaced at iteration 30 |
| 31–34 (Domain 3 early) | 16 | 8 | 5 | Unlocked RMW, split-brain, conflict, shared temp path all surfaced within 4 iterations |
| 35–38 (Domain 3 middle) | 10 | 6 | 4 | Conflict fork (R35-001) was the single most impactful Domain 3 finding; all-or-nothing scans deepened the pattern |
| 39–40 (Domain 3 late) | 4 | 2 | 1 | TOCTOU identity emerged as distinct class from RMW; R40-001/R40-002 closed the domain |
| 41–44 (Domain 4 early) | 13 | 8 | 4 | Initial governance mapping; `intent_signals` invisible-discard was the breakthrough at iteration 43 |
| 45–47 (Domain 4 middle) | 10 | 6 | 3 | Bridge collapse, warning amnesia, scenario drop all surfaced; signal-amnesia pattern unified the domain |
| 48–50 (Domain 4 late) | 6 | 4 | 2 | Gate 3 false-negatives confirmed (save/resume); YAML `when:` overload established; dependency cycle gap |

**Convergence markers:**
- Iteration 47 was the first iteration where a finding reinforced 3+ existing clusters without adding a new cluster. This is a classic convergence signal.
- Iterations 48, 49, 50 each added only 1–2 new findings with 0 novel patterns. The marginal value of iterations 51+ would be very low for the same domain scope.
- **Alternative stopping point: iteration 40 with Domain 5 starting at iteration 41.** This would have produced a 10-iteration dedicated test-coverage pass. The 10 Domain-4 iterations (41–50) are complete and valuable, but Domain 5's structural test-regression inventory was never produced and remains the largest gap.

### 8.7 Investigator behavior — what worked

Across 50 iterations, three investigator patterns consistently produced high-signal findings:

1. **"What happens if the opposite is true?"** — flipping an assumption (the cache is fresh, the file parse succeeds, the scope has not moved, the metadata is valid) consistently surfaced new fail-open paths. Iterations 13 (R13-002 `readDoc` I/O fail), 28 (R28-001 `loadState` null), 33 (R33-001 compact cache identity), and 46 (R46-001 bridge prefix) all used this flip.

2. **"Who else reads this?"** — tracing producer-side findings into consumers consistently found state laundering. R9-001 + R30-001 + R30-002 chain was discovered by asking "where does the collapsed `trustState` label actually reach?" — the answer (OpenCode transport) revealed that the richer internal state never reached hookless consumers.

3. **"Can the test fail?"** — examining every test fixture for whether it could actually catch the bug surfaced R25-001 through R25-004 plus R35-001 / R35-002 / R45-003 regression gaps. Tests that hoist happy-path mocks or assert collapsed state cannot catch the underlying bug even under CI.

### 8.8 Investigator behavior — what didn't

Two patterns were underutilized:

1. **Live adversarial repro construction.** Only iterations 43, 45, 49, 50 constructed adversarial live repros (`a → b → c → a` cycle, ZERO-EDGE warning, playbook `{jobId}` shorthand, scenario-count mismatch). Earlier iterations relied on code reading. For P0-candidate remediation, ~10 additional adversarial repros are still needed — see §8.3.

2. **Cross-runtime parallel audit.** The Claude hook lane was exhaustively audited; the Gemini hook lane was touched only at R1-001, R10-001, R38-002, R50-001 — approximately 1/5 the coverage of Claude. Gemini may have distinct coordination issues around its compact-cache path that were never surfaced. Phase 017 should either extend audit coverage or confirm Gemini's equivalence with Claude for the already-found issues.

---

## 9. Appendix — Severity Distribution

### 9.1 By domain (raw findings)

| Domain | P1 raw | P2 raw | Total raw | Distinct | Peak iter | Signal trajectory |
| ------ | ------ | ------ | --------- | -------- | --------- | ----------------- |
| Foundational (1–10) | 14 | 9 | 23 | 10 | Iter 5, 8, 10 | Establishing |
| D1 (11–20) | 16 | 12 | 28 | 14 | Iter 13, 17 | High density; fewer novel findings by iter 20 |
| D2 (21–30) | 15 | 9 | 24 | 11 | Iter 21, 24, 30 | Laundering + self-contradictory payloads novel |
| D3 (31–40) | 15 | 11 | 26 | 14 | Iter 33, 35, 37, 40 | Layered: byte, snapshot, TOCTOU |
| D4 (41–50) | 8 | 20 | 28 | ~14 | Iter 43, 45, 46 | Invisible-discard breakthrough at iter 43 |

### 9.2 By severity (distinct)

| Severity | Count | % of ~63 distinct |
| -------- | ----- | ----------------- |
| P0 (individual) | 0 | 0% |
| P0 (escalation candidates) | 4 confirmed + 1 watch-p1 + 1 watch-p2 | — |
| P1 (distinct) | ~33 | ~52% |
| P2 (distinct) | ~30 | ~48% |

### 9.3 By file (top 10 by distinct-issue count)

| Rank | File | Distinct | Domains | Dominant pattern |
| ---- | ---- | -------- | ------- | ---------------- |
| 1 | `hooks/claude/session-stop.ts` | 10 | D1, D2, D3 | Split-brain autosave + success-shaped durability signals |
| 2 | `hooks/claude/hook-state.ts` | 9 | D2, D3 | Unlocked RMW + TOCTOU + unvalidated parse |
| 3 | `handlers/save/reconsolidation-bridge.ts` | 8 | D1, D3 | Pre-transaction snapshots driving conflict/complement/assistive |
| 4 | `handlers/save/post-insert.ts` | 6 | D1, D2 | `enrichmentStatus` boolean collapse |
| 5 | `handlers/code-graph/query.ts` | 6 | D1, D2 | Readiness fail-open + vocabulary divergence |
| 6 | `skill_advisor.py` | 5 | D4 | Invisible-discard + prefix collapse |
| 7 | `manual-playbook-runner.ts` | 4 | D4 | `Function(...)` eval + silent drop + inconsistent argument dialects |
| 8 | `skill_graph_compiler.py` | 4 | D4 | Advisory validation + warning amnesia + 2-node-only cycle check |
| 9 | `lib/graph/graph-metadata-parser.ts` | 4 | D1, D2, D3 | Legacy laundering + temp-path collision |
| 10 | `spec_kit_plan_auto.yaml` / `_confirm.yaml` | 4 | D4 | `when:` overload + untyped boolean DSL + vocabulary fragmentation |

### 9.4 Finding ID → Fix chain cross-reference (cumulative)

*Format: `RN-NNN` | Severity | Workstream | Dependency.*

| Finding | Severity | Fix | Dependency |
| ------- | -------- | --- | ---------- |
| R1-001 / R2-001 / R4-001 | P1 | S2 (HookState) — scope the continuity call, or fix `loadMostRecentState` to not reject scope-less | Independent |
| R1-002 | P1 | S2 — reject or quarantine missing `session_id` payloads | Independent |
| R2-002 / R4-002 | P1 | S2 — per-file isolation in directory scan | Independent |
| R3-001 | P1 | Quick-win — return `ambiguous_subject` on multi-row match | Independent |
| R3-002 | P1 | Quick-win #14 — surface `ensureCodeGraphReady` exceptions as errors | Independent |
| R3-003 | P2 | Quick-win — aggregate edge trust, not first edge | Independent |
| R5-001 | P1 | Medium — refresh readiness/freshness reports after inline reindex completes | Independent |
| R5-002 | P1 | Medium — don't write mtime until nodes+edges persist | Independent |
| R6-001 | P1 | Medium — align assistive-default docs with runtime switch | Independent |
| R6-002 | P1 | Quick-win — rename threshold or implement auto-merge | Independent |
| R7-001 | P1 | Medium — `runEnrichmentBackfill` honors `force=true` recovery | Independent |
| R7-002 | P1 | Medium — gate entity linking on successful extraction (ties to M13) | After M13 |
| R8-001 | P1 | M13 (enum status) | Independent, largest win |
| R8-002 | P1 | After M13 — gate on extraction success | After M13 |
| R9-001 | P1 | M8 (vocabulary expansion) | Independent |
| R9-002 | P2 | Quick-win #18 — runtime `SharedPayloadKind`/`producer` validation | Independent |
| R10-001 | P1 | Medium — Gemini wrapper forwards `payloadContract.provenance` | Independent |
| R10-002 | P2 | Medium — escape provenance fields in `[PROVENANCE:]` wrapper | After HookState schema validation (M1) |
| R11-001 | P1 | M13 — surface transcript/metadata failure as machine-readable outcome | After M13 |
| R11-002 / R11-003 / R11-004 / R11-005 | P1/P2 | S3 (migration propagation) / M13 / quick wins | After M7 / after M13 |
| R12-001 / R13-001 | P1 | Quick-win #22 — `autosaveOutcome` field | Independent |
| R12-002 / R14-002 | P2 | Quick-win #8 — reject invalid `edgeType` | Independent |
| R12-003 | P2 | Medium — scope filter before window cap | Independent |
| R12-004 / R12-005 / R13-005 / R14-003 / R14-004 / R17-002 | P1/P2 | M13 | After M13 |
| R13-002 | P1 | C3 (distinguish I/O failure from missing) | Independent |
| R13-003 | P2 | Quick-win #13 — validate outline subject | Independent |
| R13-004 | P1 | M13 + structured warning on thrown errors | After M13 |
| R14-001 | P1 | M3 (collapse stop-hook writes) + D4 (eliminate zero-offset sentinel) | After M3 + D4 |
| R15-001 / R15-002 / R15-003 | P1/P2 | Medium — retarget reason field, configure tail window, distinguish I/O vs ambiguity | Independent |
| R16-001 | P1 | Quick-win — validate operation before transitive branch | Independent |
| R16-002 | P2 | Medium — reject malformed rows in `reconsolidation-bridge` | Independent |
| R17-001 | P2 | Quick-win #17 — flag dangling edges | Independent |
| R18-001 / R18-002 / R20-002 / R20-003 | P1/P2 | S3 (migration propagation) | After M7 |
| R19-001 / R19-002 | P2 | Medium — surface dangling nodes + assistive failure as corruption | Independent |
| R20-001 | P1 | Medium — snapshot transcript stat before producer metadata builds | Independent |
| R21-001 | P1 | M13 | Independent |
| R21-002 | P1 | S2 (HookState overhaul) | Prereq for R25-004, R28-001, R29-001 |
| R21-003 | P1 | S3 (migration propagation) | After M7 |
| R22-001 / R23-001 | P1 | S4 / Quick-win #14 (code-graph/query.ts readiness) | Independent |
| R22-002 / R23-002 / R25-003 | P1 | S3 | After M7 |
| R23-003 | P2 | S2 (distinguish expiry from absence) | After M1/M2 |
| R24-001 | P1 | M13 — typed recovery action for all degradation branches | Independent |
| R24-002 | P1 | Quick-win — `handleSessionResume` forwards fallback scope | Independent |
| R25-001 / R25-002 / R25-004 / R26-001 | P1/P2 | S2/M8/M13 test-migration | Tied to structural fixes |
| R26-002 | P2 | Quick-win #19 — health surface structural trust | Independent |
| R27-001 / R27-002 | P1 | M13 + code-graph/query readiness fix | After M13 |
| R28-001 / R28-002 | P1 | S2 | After M1 |
| R29-001 / R29-002 | P1/P2 | S2 (schema versioning) | After M1/M2 |
| R30-001 / R30-002 | P1 | M8 | Independent |
| R31-001 / R31-002 / R32-001 / R32-002 / R33-002 / R33-003 / R34-001 / R35-002 | P1/P2 | S2 (HookState + session-stop overhaul) | Structural |
| R31-003 / R32-003 / R35-001 | P1 | S1 (transactional reconsolidation, B1) | Structural |
| R31-004 / R32-004 | P2 | Quick-win #15 — unique temp filenames | Independent |
| R31-005 / R32-005 / R35-003 / R36-003 | P2 | Quick-wins #10 + #11 — remove shared path from 4 surfaces | Independent |
| R33-001 | P1 | S2 (identity-based clearCompactPrime) | After M1 |
| R34-002 / R36-002 / R37-003 | P1/P2 | S1 (B2, B4) | After B1 |
| R36-001 | P2 | S2 (re-read mtime after read) | After M1 |
| R37-001 / R37-002 | P1 | S2 (D4 eliminate sentinel, M4 refresh lastSpecFolder) | After M1 |
| R38-001 / R38-002 / R40-001 | P2 | S2 (per-file isolation + TOCTOU check) | Independent, quick |
| R39-001 | P1 | Quick-win #22 — `autosaveOutcome` field | Independent |
| R39-002 / R40-002 | P1 | S1 (B3) | After B1 |
| R41-001 / R47-002 | P2 | S7 (vocabulary alignment + event field emission) | Independent |
| R41-002 / R45-001 / R47-001 / R48-001 / R49-001 / R50-001 | P1/P2 | S5 (Gate 3 typed classifier) | Independent |
| R41-003 / R45-003 / R46-002 / R49-003 | P1 | S4 (skill routing / compiler invariants) | Independent |
| R41-004 / R45-004 / R46-003 / R50-002 | P1/P2 | S6 (playbook runner isolation) | Independent |
| R42-001 / R43-002 / R44-003 / R48-002 / R49-002 | P2 | S7 (YAML predicate grammar) | Independent |
| R42-002 | P2 | S4 (health check inventory compare) | After A3 |
| R42-003 | P2 | S6 (automatable field) | Independent |
| R43-001 / R44-001 / R44-002 | P1/P2 | S4 (A1 + A2 wiring) | Independent |
| R45-002 | P2 | S4 (A2b disambiguation) | After A2 |
| R46-001 | P1 | S4 (A0 per-subcommand bridges) | Independent, prereq for A2 on subcommand surface |

### 9.5 Signal-amnesia pattern layers (from §5.4)

| Layer count | Finding(s) | Type |
| ----------- | ---------- | ---- |
| Compile | R45-003 | Topology warnings dropped |
| Load | R43-001, R44-001 | `signals` map populated but no consumer |
| Parse | R44-002 | SKILL.md keyword comments stripped |
| Runtime | R46-002 | Unilateral `conflicts_with` → bilateral penalty |
| Runner | R46-003 | `lastJobId` injected into `Function(...)` without escaping |
| Coverage | R45-004 | Null scenario parse results filtered before count |
| Routing | R46-001 | `/spec_kit:*` collapsed to generic bridge |
| Docs | R47-002 | `folder_state` / `start_state` collapsed in top-level docs |
| Classifier | R48-001, R49-001 | `save` intent absent from Gate 3 |
| Classifier | R50-001 | `resume` intent absent from Gate 3 |
| Validator | R49-003 | Only 2-node cycles checked |

**Total layers with signal amnesia: 11.** Each requires an explicit "forward or log-drop" assertion at its transition. None currently have it.

### 9.6 Effort breakdown by workstream and finding count

| Workstream | Effort | Distinct findings addressed | Leverage (findings/week) |
| ---------- | ------ | --------------------------- | ----------------------- |
| Quick wins (§6.1, 29 items) | 1w | ~25 | 25.0 |
| M13 (enum status refactor) | 1w | ~10 | 10.0 |
| S2 (HookState overhaul) | 2w | ~12 | 6.0 |
| S1 (transactional reconsolidation) | 2w | ~8 | 4.0 |
| S3 (migration propagation) | 1w | ~7 | 7.0 |
| S4 (skill routing trust chain) | 1w | ~8 | 8.0 |
| S5 (Gate 3 classifier) | 1.5w | ~6 | 4.0 |
| S6 (playbook runner isolation) | 1.5w | ~4 | 2.7 |
| S7 (YAML predicate grammar) | 1.5w | ~5 | 3.3 |
| M8 (vocabulary expansion) | 1.5w | ~4 | 2.7 |

**Leverage-ranked remediation priority:**
1. **Quick wins first.** 25 findings for 1 week. Highest ROI by a 2.5× margin. Most have no dependencies.
2. **M13 next.** 10 findings for 1 week. Enables S1 dependency chain.
3. **S4 + S3.** 15 findings for 2 weeks parallel. Independent of M13 and of each other. Can start Week 1.
4. **S2 + S1.** 20 findings for 4 weeks parallel. Structural anchor; can start Week 2 after M13.
5. **S5 + S6 + S7 + M8.** 19 findings for 5.5 weeks. Finish out remaining P1/P2 work.

### 9.7 Domain chronological arc

**Foundational (iterations 1–10).** The investigation opened with a reconnaissance pass across session-lifecycle, code-graph, save, and hook paths. Key insights crystallized by iteration 5: the runtime has asymmetric contract enforcement between producers (rich internal state) and consumers (collapsed external state). Iteration 10's cross-runtime compact-cache finding (R10-001: Gemini drops provenance; R10-002: Claude interpolates unescaped) reframed the whole foundational layer as a contract-split issue rather than individual bug list.

**Domain 1 (iterations 11–20).** Silent fail-open patterns. Iteration 11 established the "blast_radius silent degrade" as a cross-cutting motif. Iteration 13 was the pivotal moment: five findings in a single iteration, spanning autosave skip (R13-001), I/O → `null` collapse (R13-002), outline subject misclassification (R13-003), reconsolidation catch-and-swallow (R13-004), and causal-link partial-success (R13-005). After iteration 13, the domain's central thesis was clear: success-shaped payload masking skip/defer/partial/failed state. Iterations 14–20 deepened this with R17-002 (five failure types unified under `ran`), R20-001 (producer metadata describes later transcript state than parsed), and R20-002 (timestamp fabrication in legacy fallback).

**Domain 2 (iterations 21–30).** State contract honesty. Iteration 21 opened the domain with the most important finding of the phase: R21-003, `refreshGraphMetadataForSpecFolder()` launders malformed JSON into canonical. This single finding established "state laundering" as a distinct class from "state collapse." Iterations 22–24 traced laundering into consumer layers (memory-parser `qualityScore: 1`, stage-1 candidate +0.12 boost). Iteration 25 audited regression tests and found four fixtures codifying the degraded contract (R25-001 through R25-004) — a test-migration concern that changed the Phase 017 effort estimate. Iteration 29's R29-001 ("theatrical schema-drift vocabulary") revealed that persisted `HookState` has no version field even though the consumer checks for one — a finding that required deep familiarity with multiple files to surface. Iteration 30's R30-001/R30-002 (self-contradictory payload + transport collapse) closed the domain by showing that richer internal state exists but is never rendered.

**Domain 3 (iterations 31–40).** Concurrency and write coordination. This was the densest domain. Iteration 31 opened with R31-001 (unlocked RMW) and R31-003 (conflict without CAS). Iteration 33 added R33-001 (compact cache identity-free cleanup) as a distinct failure class from writer races. Iteration 35's R35-001 (conflict fork → multi-successor fan-out) was the single most impactful Domain 3 finding: it showed that the memory graph's "one current successor per predecessor" invariant was silently broken. Iterations 36–38 deepened the snapshot-coherence pattern across complement, assistive, per-candidate, and directory-scan paths. Iteration 40 closed the domain with R40-001 (TOCTOU cleanup stat-then-unlink) and R40-002 (per-candidate scope mixed snapshot). By end of Domain 3, nine distinct coordination sub-patterns were characterized.

**Domain 4 (iterations 41–50).** Stringly-typed governance. Iteration 41 surveyed the landscape (YAML assets, AGENTS.md, skill graph, playbook runner). Iteration 43 produced the phase's most unexpected finding: R43-001, the routing toolchain is fully wired but the wire terminates before scoring. Iterations 44–46 deepened this into a systemic signal-amnesia pattern spanning SKILL.md keyword comments, topology warnings, bridge prefix collapse, and `conflicts_with` asymmetry. Iteration 46 added the live-data eval expansion (R46-003). Iterations 47–50 completed the vocabulary mapping and Gate 3 classifier gaps, confirming both false-positives (read-only research triggers Gate 3) and false-negatives (save/resume bypass Gate 3) coexist.

**Domain 5 (never formally started).** Subsidiary evidence was catalogued across all 50 iterations. The dedicated test-coverage pass is deferred to Phase 017 Week 1.

---

## 10. Closing Thesis

Phase 016's 50 iterations reveal a runtime where **every failure is silent**. There are no crashes, no thrown exceptions that stop the pipeline, no compile errors, no test failures. The system looks healthy by every observable metric — health checks return `ok`, validations print `VALIDATION PASSED`, `memory_save` returns `status: "success"`, skill routing reports `0.95` confidence — while operating with reduced fidelity across at least 37 surfaces.

The three structural forces behind this are:

1. **Success-shaped collapse at boundaries.** Every cross-module boundary (post-insert → response-builder, graph-metadata validation → memory-parser → ranking, hook-state writer → stop-hook consumer, skill-graph compiler → advisor scorer) strips signal. The source layer has richer information than the consumer layer sees.

2. **Pre-transaction decisions treated as authoritative post-transaction.** The SQLite writer lock and atomic rename both protect byte-level integrity. Neither protects any decision made before the lock was acquired and reused after. Nine distinct coordination sub-patterns in Domain 3 share this root.

3. **Governance expressed as prose.** Gate triggers, intake vocabularies, skill routing signals, YAML predicates, and `conflicts_with` edges are all manually-synchronized strings. "Validation passed" can be printed while invariants are violated because the invariants themselves are not in code.

Phase 017 has a concrete path to close these gaps:

- **Quick wins** (~1 engineer-week) address 29 isolated findings.
- **Medium refactors** (~8 engineer-weeks) address 4 structural patterns.
- **Structural refactors** (~10 engineer-weeks) address 4 interaction-effect P0 candidates plus Domain-4 governance as a whole.
- **Test migration** (~15% of refactor time) unblocks the regression suite from encoding degraded contracts.

Total effort ~24.5 engineer-weeks, parallelizable to ~12 weeks wall clock. Post-Phase-017, the system will have:

- Truthful success/skip/defer/fail distinctions throughout save paths (enum status).
- Transactional reconsolidation with predecessor CAS and in-transaction scope reads.
- HookState schema versioning with runtime validation and CAS-ful updates.
- Distinct `absent`/`unavailable` trust vocabulary.
- `intent_signals` wired into skill routing with per-subcommand bridge specificity.
- Gate 3 as a typed classifier with read-only disqualifiers and explicit save/resume triggers.
- Playbook runner with typed step executor and schema-validated scenario arguments.
- `when:` YAML predicates with a pinned grammar.
- Graph metadata laundering blocked at the migration boundary with explicit `migrated: true` markers.
- Dependency-cycle validation covering arbitrary-length cycles.

**The work is bounded, sequenced, and staffed at 3 engineers for 3 months.** Phase 016 has done its job: every runtime seam that needed adversarial review has been reviewed, every finding has a severity and a fix path, and every fix has a test-suite countermeasure. Phase 017 can begin Monday.

---

**End of final synthesis and review.**
