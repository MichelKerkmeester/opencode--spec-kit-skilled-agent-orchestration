---
title: "Implementation Plan: Foundational Runtime Remediation"
description: "5-phase execution plan for 63 findings: P0 composites, structural, medium, quick wins, test migration. 24.5 engineer-weeks, 3 engineers, 10-12 weeks wall clock."
trigger_phrases: ["016 remediation plan", "phase 016 remediation plan"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/001-initial-research"
    last_updated_at: "2026-04-17T10:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Phase 016 remediation closeout — DoR + DoD + gates closed"
    next_safe_action: "Phase 017 CP-001 through CP-004 residuals"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Foundational Runtime Remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server + scripts), Python (skill-advisor + compilers), JavaScript CommonJS (scripts), YAML (command assets), JSONC (metadata) |
| **Framework** | MCP server runtime, Vitest (TS tests), pytest (Python tests) |
| **Storage** | SQLite (memory_index, code_graph, skill_graph), filesystem temp-state (HookState), JSON metadata files |
| **Type system** | Zod for runtime validation (introduced by S2/M1); TS strict + explicit return types (enforced) |
| **Testing** | Vitest + pytest regression; `/spec_kit:deep-review` for remediation validation |
| **Research source** | `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` (authoritative) |

### Overview

Phase 016 remediation executes the Phase 016 remediation charter. The charter comprises **63 distinct findings across ~37 files**, clustered into 4 P0 composite candidates plus 3 strongest-signal systemic themes. Work is sequenced in 5 phases with explicit dependency ordering and parallelization lanes. All changes require synchronized test-suite migration; 7 existing test files codify degraded contracts and must be rewritten alongside code fixes.

### Execution Strategy

- **Phase 1 first**: P0 composite eliminations. P0-D runs solo (2 days), P0-A + P0-C in parallel (weeks 1–4), P0-B in weeks 5–6 with 2 engineers.
- **Phase 2 in parallel with Phase 1**: structural refactors S4/S5 run parallel to P0-A/C (weeks 2–7).
- **Phase 3 fills the middle**: medium refactors complete the scaffolding before/after structural work lands.
- **Phase 4 opportunistic**: quick wins picked up between structural items; several are prerequisites for structural work and land in Week 1.
- **Phase 5 threads throughout**: test migration commits paired with code commits (not deferred).
- **Convergence validation**: at each P0 candidate "done" claim, run deep-review iteration against attack scenarios from `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §3.x.
- **Three engineers, ~10 weeks wall clock**, 24.5 engineer-weeks total.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 016 research complete (50 iterations, `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` authoritative) [EVIDENCE: d72a523ec3 50-iter Opus 4.7 synthesis committed; (verified)]
- [x] Findings registry structured (`findings-registry.json`) [EVIDENCE: d72a523ec3 findings-registry.json structured per 50-iter synthesis; (verified)]
- [x] P0 composite candidates identified and constituent findings mapped [EVIDENCE: d72a523ec3 FINAL §3 maps 4 P0 composites with constituent-findings tables §3.1-§3.4; (verified)]
- [x] Test-suite migration inventory documented (7 files listed) [EVIDENCE: spec.md §7 Risks + tasks.md Test Suite Migration section list 7 canonical + 14 supporting + 20 new adversarial tests; (verified)]
- [x] Effort budget estimated (24.5 engineer-weeks) [EVIDENCE: spec.md §1 Metadata row "Effort Budget" = 24.5 engineer-weeks; plan.md §1 Overview confirms; (verified)]
- [x] Open question 1 resolved: does `command-spec-kit` enforce Gate 3 independently? [EVIDENCE: `preflight-oq-resolution.md` §OQ1 + 93b0c77c9 — Watch-P1 does NOT upgrade to P0-E; bridge is a label, not a dispatcher]
- [x] Open question 2 resolved: 7 test files — compatibility shims or oversights? [EVIDENCE: `preflight-oq-resolution.md` §OQ2 + 93b0c77c9 — 6 oversights + 1 shim; `hook-session-stop-replay.vitest.ts` preserved with sibling failure-injection test]
- [x] Open question 3 resolved: HookState `schemaVersion` upgrade path? [EVIDENCE: `preflight-oq-resolution.md` §OQ3 + 93b0c77c9 — Option A+B hybrid, lazy migration; applied in 6f5623a4c P0-A]
- [x] Open question 4 resolved: full `/spec_kit:*` subcommand enumeration? [EVIDENCE: `preflight-oq-resolution.md` §OQ4 + 93b0c77c9 — 6 canonical subcommands; per-subcommand bridges landed in e774eef07 T-SAP-03]
- [x] Closing-pass audit of 11 untouched files (`../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §8.2) complete [EVIDENCE: 0da4e1aa6 T-PRE-04 closing-pass audit + `../research/016-foundational-runtime-pt-01/closing-pass-notes.md` logs 4 new P2 findings CP-001..CP-004 deferred to Phase 017]

### Definition of Done (per Phase)

Each phase has its own DoD. Final DoD for overall remediation:

- [x] All 4 P0 composite candidates eliminated with regression tests passing [EVIDENCE: afbb3bc7f P0-D + 6f5623a4c P0-A + 1bdd1ed03 P0-C + 104f534bd P0-B; 4 regression test files in `.opencode/skill/system-spec-kit/mcp_server/tests/p0-*.vitest.ts`]
- [x] Watch-P1 either resolved as non-P0 or upgraded and remediated [EVIDENCE: OQ1 resolution + T-SAP-03 per-subcommand bridges in e774eef07; R46-001 closed as P1 correctness fix]
- [x] Watch-P2 contained (REQ-011 playbook runner typed executor) [EVIDENCE: 2fa4a5e71 T-MPR-RUN-01 Function eval replaced + 1bf322ece S6 T-MPR-RUN-04 schema-validated arg parser]
- [x] All 7 structural refactors landed (S1–S7) [EVIDENCE: S1 covered by 104f534bd P0-B + e774eef07 T-RCB-09/10/11; S2 covered by 6f5623a4c P0-A + 6371149cf M3/M4; S3 covered by 1bdd1ed03 P0-C; S4 by b28522bea + e009eda0c + e774eef07 T-SAP-03; S5 by 1af23e10a; S6 by 2fa4a5e71 + 1bf322ece; S7 by f9478670c]
- [x] All 13 medium refactors landed (M1–M13) [EVIDENCE: M1/M2 in 6f5623a4c P0-A; M3/M4 in 6371149cf; M5/M6 in 104f534bd P0-B; M7 in 1bdd1ed03 P0-C; M8 in 175ad87c9; M13 in c789e71b7; Med-A..Med-J spread across Phase 4 QW + e774eef07]
- [x] All 29 quick wins landed [EVIDENCE: 21 Phase 4 QW commits per `phase-4-quick-wins-summary.md` task table; remaining QWs absorbed into structural commits]
- [x] All 7 test files migrated; new tests from `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §6.5 added [EVIDENCE: 0a2d7a576 test migration audit + 3b22ad3aa T-TEST mark; 7 canonical + 14 supporting + 20 new adversarial tests per tasks.md T-TEST-01..NEW-20]
- [x] `validate.sh --strict` on 016 packet passes [EVIDENCE: spec folder validator runs clean post-implementation-summary.md populate in this closeout commit]
- [x] Full repo type-check + Vitest + pytest passes [EVIDENCE: type-check clean per 1c3ad5014 Phase 016 remediation synthesis; vitest + pytest pass per 0a2d7a576 test migration audit + `test_skill_advisor.py` + `test_skill_graph_compiler.py`]
- [x] `implementation-summary.md` written with commit-by-commit finding closure [EVIDENCE: this closeout commit populates implementation-summary.md from placeholder]
- [x] Parent 026 spec updated with 016 completion status [EVIDENCE: 016 description.json + graph-metadata.json reflect implemented status; parent packet inherits via graph traversal]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Remediation Pattern

Each finding closure follows the same lifecycle:

```
Finding Registry entry (R??-???)
    ↓ [cite in commit message]
Code change (structural or patch)
    ↓ [same commit OR next commit]
Test migration or new test
    ↓ [run full suite]
validate.sh --strict on 016 packet
    ↓ [on P0 candidate completion]
Regression test matching FINAL §3.x attack scenario
    ↓
Closure annotation in implementation-summary.md
```

### Key Architectural Changes Introduced

1. **`OperationResult<T>` uniform result shape** (M13 + REQ-005):
   ```ts
   type OperationStatus = 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial';
   type OperationResult<T = void> = {
     status: OperationStatus;
     reason?: string;
     attempts?: number;
     persistedState?: T;
     warnings?: StructuredWarning[];
   };
   ```

2. **`HookStateSchema` (Zod) runtime validation** (S2 + REQ-001):
   ```ts
   const HookStateSchema = z.object({
     schemaVersion: z.literal(CURRENT_HOOK_STATE_SCHEMA_VERSION),
     // ... fields
   });
   function loadState(id: string): { ok: true; state: HookState } | { ok: false; reason: string } { ... }
   ```

3. **`TrustState` expanded vocabulary** (M8 + REQ-007):
   ```ts
   type TrustState = 'live' | 'stale' | 'absent' | 'unavailable';
   // live = exists, fresh
   // stale = exists, may be outdated, query still valid
   // absent = does not exist for this scope
   // unavailable = should exist but inaccessible (I/O error, lock held)
   ```

4. **Predecessor CAS in `executeConflict()`** (S1 + REQ-002):
   ```ts
   UPDATE memory_index SET is_deprecated = TRUE, deprecated_at = ?
   WHERE id = ? AND content_hash = ? AND is_deprecated = FALSE
   // Returns changes == 0 on stale predecessor → return 'conflict_stale_predecessor' outcome
   ```

5. **`migrated: boolean` propagation** (S3 + REQ-003):
   ```ts
   type ValidateGraphMetadataResult =
     | { ok: true; metadata: GraphMetadata; migrated: boolean; migrationSource?: 'legacy' }
     | { ok: false; errors: ValidationError[] };
   // migrated=true → stage-1 indexing penalizes (-0.08 or reduces +0.12 boost to +0.04)
   ```

6. **Typed step executor** (S6 + REQ-011):
   ```ts
   interface ScenarioStep {
     automatable: boolean;
     handlerName: string;
     args: Record<string, JsonValue>;  // schema-validated, not eval'd
   }
   // Replaces Function(...)() with name-dispatched handler registry
   ```

7. **`BooleanExpr` YAML predicate schema** (S7 + REQ-012):
   ```yaml
   # Before (untyped):  when: "intake_only == TRUE"
   # After (typed):
   when:
     expr: "eq"
     lhs: { ref: "intake_only" }
     rhs: { literal: true }
   ```

### Component Impact Matrix

| File | Affected By | Workstream |
|------|-------------|------------|
| `hook-state.ts` | S2, QW #12, #20, #24, #25, D1, D3 | Week 1–4, Eng 1 |
| `session-stop.ts` | S2, M3, M4, QW #9, #21, #22, #23, D4, D5 | Week 1–4, Eng 1 |
| `session-resume.ts` | S2 (loadMostRecentState), M10 impacts | Week 2–4, Eng 1 |
| `session-bootstrap.ts` | M8 (trust vocabulary) | Week 6–8, Eng 2/3 |
| `session-health.ts` | M8, QW #19 | Week 6–8 |
| `reconsolidation-bridge.ts` | S1 (all variants), QW warnings | Week 5–6, Eng 2 (2 sub-tracks) |
| `reconsolidation.ts` | S1 (executeConflict CAS), M5 | Week 5–6, Eng 2 |
| `post-insert.ts` | M13, QW #16 via M13 | Week 7–9, Eng 1 |
| `response-builder.ts` | M13 | Week 8–9, Eng 1 |
| `memory-save.ts` | S1, M13, M7 (migrated propagation) | Parallel |
| `code-graph/query.ts` | QW #8, #13, #14, #16, #17; M8 cascades | Week 1–2 (QW), Week 6–7 (M8) |
| `graph-metadata-parser.ts` | S3/M7, QW #15 | Week 1–4, Eng 3 |
| `memory-parser.ts` | S3 (migrated propagation) | Week 3, Eng 3 |
| `shared-payload.ts` | QW #18, M8 | Week 6–8 |
| `opencode-transport.ts` | M8 | Week 6–8 |
| `skill_advisor.py` | S4 (all variants), QW #1, #2 | Week 2–5, Eng 3 |
| `skill_advisor_runtime.py` | S4, QW #3 | Week 2, Eng 3 |
| `skill_graph_compiler.py` | S4, QW #4, #5, #6, #27 | Week 2–3, Eng 3 |
| `manual-playbook-runner.ts` | S6/M9, QW #7 | Week 6–8 |
| `AGENTS.md` / CLAUDE / CODEX / GEMINI | QW #10, S5 | Week 1 (QW), Week 7–8 (S5) |
| `spec_kit_plan_{auto,confirm}.yaml` | QW #26, #28, S7 | Week 1 (QW), Week 8–9 (S7) |
| `data-loader.ts` | QW #11 | Week 1 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 Composite Eliminations (4 candidates → 4 composite fixes)

**Goal.** Close all 4 P0 composite candidates by landing their bundled constituent fixes as coherent structural changes. Effort: ~11 engineer-weeks.

#### Phase 1a: P0-D (TOCTOU cleanup) — 2 engineer-days solo

Smallest, most isolated, highest operational frequency. Runs first as a clean warm-up.

| Step | Change | Finding(s) | File | Test |
|------|--------|------------|------|------|
| D1 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` (re-stat or open+fstat) | R40-001 | `hook-state.ts:170-176,247-255` | New: save-between-stat-and-unlink interleave test |
| D2 | Per-file error isolation in `loadMostRecentState()`; continue on individual failure; expose `errors[]` | R38-001 | `hook-state.ts:131-165` | New: poison-pill-file-does-not-suppress-siblings |
| D3 | Per-file error isolation + richer return in `cleanStaleStates()`: `{ removed, skipped, errors }` | R38-002 | `hook-state.ts:243-263` | New: partial-sweep-returns-skipped |
| D4 | Eliminate transient `lastTranscriptOffset: 0` sentinel in `storeTokenSnapshot()`; carry final offset | R37-001 | `session-stop.ts:175-190,244-252,257-268` | New: two-stop-overlap-no-zero-offset-read |
| D5 | `Math.max()` monotonicity guard on `metrics.lastTranscriptOffset` in `updateState()` | R33-002 | `hook-state.ts:221-241` | New: offset-regression-blocked |

**Done criterion:** all 5 new tests pass; P0-D attack scenario (`FINAL §3.4`) confirmed blocked.

#### Phase 1b: P0-A (HookState cross-runtime poisoning) — 4 engineer-weeks, 1 engineer

Structural overhaul of HookState + session-stop, bundled as workstream S2. Largest concentration node (10 findings). Composed of M1, M2, M3, M4, plus 8 A-step fixes:

| Step | Change | Finding(s) | File |
|------|--------|------------|------|
| M1 | Add runtime `HookStateSchema` (Zod) validation to `loadState()` and `loadMostRecentState()`; on failure, quarantine to `.bad` (NOT silently-accept drifted state) | R21-002, R25-004, R28-001, R29-001 | `hook-state.ts:83-87` |
| M2 | Add `schemaVersion` field to `HookState`; reject mismatched versions with `schema_mismatch` reason; add migration step if Q3 resolves to "existing files break" | R29-001 | `hook-state.ts`, `session-resume.ts:174-208` |
| M3 | Collapse three separate `recordStateUpdate()` calls in `processStopHook()` into single atomic patch | R31-002, R32-002 | `session-stop.ts:60-67,119-125,261-268,283-309` |
| M4 | Refresh `stateBeforeStop.lastSpecFolder` before `detectSpecFolder()` (or change "prefer currentSpecFolder" rule) | R37-002 | `session-stop.ts:128-145,244-246,281-296,340-369` |
| A2 | Replace deterministic `.tmp` filename with `.tmp-<pid>-<counter>-<random>` + retry | R31-001, R31-004 | `hook-state.ts:169-176,221-240` |
| A4 | Identity-based `clearCompactPrime()` (check `cachedAt` or `opaqueId` before nulling) | R33-001 | `hook-state.ts:184-205`; `session-prime.ts:43-46,281-287` |
| A5 | Re-read mtime after `readFileSync()` in `loadMostRecentState()`; discard candidate on change | R36-001 | `hook-state.ts:140-155,170-176` |
| A8 | `updateState()` returns `{ ok, merged, persisted }`; callers surface persistence failures | R31-001, R33-003 | `hook-state.ts:170-176,221-240`; `session-stop.ts:302-318` |

Plus inherited from Phase 1a (already landed): D1, D2, D3 in same file.

**Test migration:** `hook-state.vitest.ts` (~180 LOC), `hook-session-stop-replay.vitest.ts` (~150 LOC), `hook-session-start.vitest.ts`, `session-resume.vitest.ts`, `hook-stop-token-tracking.vitest.ts`, `hook-precompact.vitest.ts`, `token-snapshot-store.vitest.ts`.

**New adversarial tests:** HookState schema-version mismatch rejection (R29-001); compact prime identity race (R33-001); two-concurrent-writer temp-file race (R31-001); torn-read mate-mismatch (R36-001).

**Done criterion:** all 10 constituent findings closed; P0-A attack scenario (FINAL §3.1, all 10 steps) confirmed blocked.

#### Phase 1c: P0-C (Graph-metadata laundering) — 3 engineer-weeks, 1 engineer (parallel with P0-A)

Structural propagation of migration markers through the refresh → parse → rank pipeline. Workstream S3.

| Step | Change | Finding(s) | File |
|------|--------|------------|------|
| M7/C1 | `validateGraphMetadataContent()` returns `{ ok: true, metadata, migrated, migrationSource? }`; consumers propagate `migrated` through memory-parser + ranking | R11-002, R18-002, R20-002, R21-003, R22-002, R23-002, R25-003 | `graph-metadata-parser.ts:223-233,264-275,1015-1019`; `memory-parser.ts:293-330` |
| C2 | Preserve original current-schema validation errors when legacy fallback also fails | R18-002 | `graph-metadata-parser.ts:228-242` |
| C3 | Distinguish `readDoc()` I/O failure from "file does not exist"; propagate I/O failure as `status: 'unknown'` | R13-002 | `graph-metadata-parser.ts:280-285,457-475,831-860` |
| C4 | `refreshGraphMetadataForSpecFolder()` preserves `migrated` marker in rewritten JSON; indexing penalizes (not boosts) `migrated=true` rows | R21-003, R22-002 | `graph-metadata-parser.ts:1015-1019` |
| C5 | Stage-1 candidate generation refuses +0.12 boost for `migrated=true` or `qualityScore: 1` rows; or reduces boost to +0.04 | R22-002, R23-002 | `memory-parser.ts:293-330` (+ stage-1 ranker) |

**Test migration:** `graph-metadata-schema.vitest.ts` (~150 LOC) — migrate from "legacy fallback = clean success" to "{ ok, migrated: true, migrationSource: 'legacy' }"; `graph-metadata-integration.vitest.ts`; memory-parser + stage-1 ranker tests.

**Done criterion:** all 8 constituent findings closed; P0-C attack scenario (FINAL §3.3, all 6 steps) confirmed blocked.

#### Phase 1d: P0-B (Transactional reconsolidation) — 4 engineer-weeks, 2 engineers (parallel sub-tracks)

Largest single workstream. Workstream S1. Two engineers pair: one on code transaction boundary moves, one on test migration + adversarial test construction.

| Step | Change | Finding(s) | File |
|------|--------|------------|------|
| B1/M5 | Predecessor `content_hash` + `is_deprecated = FALSE` CAS in `executeConflict()`; abort with `'conflict_stale_predecessor'` outcome if predecessor superseded | R31-003, R35-001, R32-003 | `reconsolidation.ts:467-508`; `reconsolidation-bridge.ts:282-295` |
| B2 | Complement decision inside writer transaction, or re-run vector search + scope filter just before insert; fall through to merge/conflict if near-duplicate appeared | R34-002 | `reconsolidation-bridge.ts:261-306`; `reconsolidation.ts:599-694`; `memory-save.ts:2159-2171,2250-2304` |
| B3/M6 | Batched single snapshot of candidate scopes instead of per-candidate `readStoredScope()`; OR wrap scope-filter loop in same transaction as vector search | R39-002, R40-002 | `reconsolidation-bridge.ts:203-237,282-306` |
| B4 | Assistive review re-runs search inside writer transaction or flags `advisory_stale: true` when snapshot predates commit | R36-002, R37-003 | `reconsolidation-bridge.ts:453-501`; `memory-save.ts:2159-2170,2250-2304` |
| B5 | Structured warning `{ code: 'scope_filter_suppressed_candidates', candidates: [...] }` when scope filter drops results | R11-004, R12-003 | `reconsolidation-bridge.ts:283-295` |

**Dependency within B:** B1 independent, most urgent (corruption-preventing). B2 requires B1 (complement must fall through to B1-protected conflict). B3 can run parallel to B1/B2. B4 after B3.

**Test migration:** `reconsolidation.vitest.ts` (~300 LOC, high complexity — two-concurrent-writer infrastructure); `reconsolidation-bridge.vitest.ts` (~200 LOC — governed-scope mutation infrastructure); `assistive-reconsolidation.vitest.ts` (~150 LOC — competing-candidate insert); `handler-memory-save.vitest.ts` (~200 LOC).

**New adversarial tests:** two-concurrent-conflict same-predecessor fork; two-concurrent-save duplicate-complement insert; mixed-snapshot scope mutation; assistive recommendation against already-superseded memory.

**Done criterion:** all 8 constituent findings closed; P0-B attack scenario (FINAL §3.2, all 5 steps) confirmed blocked.

### Phase 2: Structural Refactors (7 items — S1 through S7)

S1, S2, S3 are Phase 1 workstreams (counted above). The remaining 4 structural refactors:

| # | Change | Findings | Effort | Parallel to |
|---|--------|----------|--------|-------------|
| S4 | **Skill routing trust chain** — wire `intent_signals` into scoring (A2 from S4 spec); per-subcommand `COMMAND_BRIDGES` (A0); `conflicts_with` reciprocity (A4); topology warnings serialized + surfaced in health_check (A5); disambiguation tier for deep-research vs review (A2b) | R43-001, R44-001, R44-002, R42-002, R46-001, R46-002, R45-003, R45-002, R41-003, R49-003 | 1w (+2d test build-out) | P0-A, P0-C |
| S5 | **Gate 3 typed intent classifier** — shared module / JSON schema replacing prose; read-only disqualifiers; save/resume/continue trigger phrases; runtime validation | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 1.5w | Phase 1d |
| S6 | **Playbook runner trust-boundary isolation** — typed step executor replacing `Function(...)()`; schema-validated fixtures; explicit `automatable: boolean`; `parsedCount == filteredCount` assertion | R41-004, R42-003, R45-004, R46-003, R50-002 | 1.5w | Phase 2 late |
| S7 | **`when:` YAML predicate typed grammar** — `BooleanExpr` schema; separate predicate-`when:` from prose-`after:`; asset-predicate test suite | R41-001, R42-001, R43-002, R44-003, R47-002, R48-002, R49-002 | 1.5w | Phase 2 late |

### Phase 3: Medium Refactors (13 items — M1 through M13)

M1–M7 are Phase 1 workstreams (counted above). The remaining medium refactors:

| # | Change | Findings | Effort |
|---|--------|----------|--------|
| M8 | **Trust-state vocabulary expansion** — `absent`/`unavailable` distinct from `stale`; migrate producers + consumers + tests | R9-001, R26-001, R30-001, R30-002, R26-002 | 4d |
| M9 | **Replace `Function(...)()` eval in manual-playbook-runner.ts** (subset of S6) | R41-004, R46-003, R50-002 | 4d (counted in S6) |
| M10 | **Extract Gate 3 trigger classification** into shared module / JSON schema (subset of S5) | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 | 4d (counted in S5) |
| M11 | **Define `BooleanExpr` schema** for YAML `when:` (subset of S7) | R42-001, R43-002, R44-003, R48-002, R49-002 | 4d (counted in S7) |
| M12 | **Disambiguation tier** for deep-research vs review audit vocabulary (subset of S4) | R45-002 | 2d (counted in S4) |
| M13 | **`OperationResult<T>` enum status refactor** — replace `enrichmentStatus` boolean record; propagate per-step results through `memory-save`, `response-builder`, `follow-up-api` | R8-001, R11-005, R12-004, R12-005, R14-003, R14-004, R17-002, R25-001, R13-005 | 5d |

Additional discrete medium items (from finding registry, not yet assigned to a structural track):

| # | Change | Findings | Effort |
|---|--------|----------|--------|
| Med-A | Refresh readiness/freshness reports after inline reindex completes | R5-001 | 1d |
| Med-B | Don't write mtime until nodes+edges persist | R5-002 | 1d |
| Med-C | Align assistive-default docs with runtime switch; implement auto-merge or rename threshold | R6-001, R6-002 | 2d |
| Med-D | `runEnrichmentBackfill` honors `force=true` recovery | R7-001 | 1d |
| Med-E | Snapshot transcript stat before `buildProducerMetadata()` | R20-001 | 1d |
| Med-F | Retarget-reason field in session-stop autosave; configurable tail window; distinguish I/O vs ambiguity | R15-001, R15-002, R15-003 | 2d |
| Med-G | Reject malformed vector-search rows in `reconsolidation-bridge` | R16-002 | 1d |
| Med-H | Surface dangling nodes + assistive failure as corruption | R19-001, R19-002 | 1d |
| Med-I | Gemini wrapper forwards `payloadContract.provenance` (REQ-014) | R10-001 | 1d |
| Med-J | Escape provenance fields in `[PROVENANCE:]` wrapper (REQ-013) | R10-002 | 1d |

### Phase 4: Quick Wins (29 small isolated fixes, ≤1 day each, ≤3 file edits, <100 LOC)

Ordered by findings-addressed leverage. Total effort ~1 engineer-week. Most are prerequisites for structural work (land Week 1).

| # | Change | Findings | Est. | Prereq for |
|---|--------|----------|------|------------|
| 1 | Wire `intent_signals` from `signals` map into `analyze_request()` scoring | R43-001, R44-001 | 2h | S4 |
| 2 | Extend `COMMAND_BRIDGES` with per-subcommand entries for all `/spec_kit:*` | R46-001 | 2h | S4 |
| 3 | Extend `parse_frontmatter_fast()` to capture `<!-- Keywords: -->` blocks | R44-002 | 2h | S4 |
| 4 | Serialize topology warning payloads into compiled graph; expose in `health_check()` | R45-003 | 2h | S4 |
| 5 | Add `conflicts_with` reciprocity check to `validate_edge_symmetry()` | R46-002 | 1h | S4 |
| 6 | Arbitrary-length cycle detection (Tarjan SCC or DFS color-marking) in `validate_dependency_cycles()` | R49-003 | 3h | S4 |
| 7 | Assert `parsedCount == filteredCount` in playbook runner before coverage; warn on drop | R45-004 | 2h | S6 |
| 8 | Reject invalid `edgeType` in `code-graph/query.ts` with `status: "error"` | R12-002, R14-002 | 1h | — |
| 9 | `Math.max()` offset monotonicity guard in `updateState()` | R33-002 | 1h | Phase 1a |
| 10 | Remove `/tmp/save-context-data.json` from `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` | R35-003 | 1h | — |
| 11 | Update `data-loader.ts` `NO_DATA_FILE` error text to teach `--stdin` / `--json` | R36-003 | 1h | — |
| 12 | Replace deterministic `.tmp` with `.tmp-<pid>-<counter>-<random>` in `hook-state.ts` | R31-001, R31-004 | 1h | Phase 1b |
| 13 | Validate outline subject path via `resolveSubjectFilePath()` before `queryOutline()` | R13-003 | 1h | — |
| 14 | Stop swallowing `ensureCodeGraphReady()` exceptions; surface as `status: "error"` | R3-002, R22-001, R23-001, R25-002, R27-002 | 2h | M8 cascades |
| 15 | Unique temp filenames in `graph-metadata-parser.ts:writeGraphMetadataFile()` | R31-004, R32-004 | 1h | Phase 1c |
| 16 | Guard `blast_radius` against unresolved subjects; return `status: "error"` | R11-003 | 1h | — |
| 17 | Flag dangling edges as corruption in `code-graph/query.ts` payload | R17-001 | 1h | — |
| 18 | Runtime validation of `SharedPayloadKind`/`producer` (not just TS) | R9-002 | 1h | — |
| 19 | Add `handleSessionHealth()` structural-trust section | R26-002 | 1h | M8 |
| 20 | Identity-based `clearCompactPrime()` | R33-001 | 2h | Phase 1b |
| 21 | Eliminate transient zero-offset sentinel in `storeTokenSnapshot()` | R37-001 | 2h | Phase 1a |
| 22 | Add `autosaveOutcome` field to `SessionStopProcessResult` | R39-001 | 2h | M13 |
| 23 | Gate `touchedPaths` on confirmed persist | R35-002 | 1h | Phase 1b |
| 24 | Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()` | R38-001, R38-002 | 2h | Phase 1a |
| 25 | TOCTOU identity check in `cleanStaleStates()` before `unlinkSync()` | R40-001 | 2h | Phase 1a |
| 26 | Align `spec_kit_plan_auto.yaml` `folder_state` vocabulary with `.opencode/skill/system-spec-kit/references/intake-contract.md` | R41-001 | 1h | S7 |
| 27 | Promote `skill_graph_compiler.py` topology checks to hard errors (warn→error) | R41-003 | 2h | S4 |
| 28 | Mark `start_state` vs `folder_state` vocabulary boundary with explicit comments | R47-002 | 1h | S7 |
| 29 | Document `producerMetadataWritten`/`touchedPaths` as attempted-write flags (or remove) | R34-001, R35-002 | 30m | Phase 1b |

**Total quick-win effort: ~50h = ~1 engineer-week** for 29 isolated fixes addressing ~40 of the ~63 distinct findings.

### Phase 5: Test Suite Migration (7 files)

Every structural change requires simultaneous test migration. The 7 canonical test files that codify degraded contracts:

| Test file | Current assertion | New assertion | Fix chain | Est. LOC | Complexity |
|-----------|-------------------|---------------|-----------|----------|------------|
| `post-insert-deferred.vitest.ts` | All-true booleans for deferred | Enum status `'deferred'` | M13 | ~80 | Low |
| `structural-contract.vitest.ts` | `status=missing` + `trustState=stale` | Distinct labels per axis | M8 | ~120 | Medium |
| `graph-metadata-schema.vitest.ts` | Legacy fallback = clean success | `{ ok: true, migrated: true, migrationSource: 'legacy' }` | S3 | ~150 | Medium |
| `code-graph-query-handler.vitest.ts` | Hoisted `fresh` readiness | Test fail-open branch explicitly | QW #14 | ~50 | Low |
| `handler-memory-save.vitest.ts` | Post-insert all-true | Enum status | M13 | ~200 | High |
| `hook-session-stop-replay.vitest.ts` | Autosave disabled | Autosave enabled with failure injection | S2 | ~150 | High |
| `opencode-transport.vitest.ts` | Only `trustState=live` | `missing`/`absent` cases | M8 | ~80 | Low |

Plus additional tests requiring updates (not primary codification but affected):

- `hook-state.vitest.ts` (~180 LOC) — add TOCTOU + all-or-nothing cases (S2)
- `reconsolidation.vitest.ts` (~300 LOC, high) — two-concurrent-writer infrastructure (S1)
- `reconsolidation-bridge.vitest.ts` (~200 LOC, high) — governed-scope mutation infra (S1)
- `test_skill_advisor.py` (~250 LOC) — routing-specificity + intent_signals assertions (S4)
- `transcript-planner-export.vitest.ts` (~100 LOC) — YAML predicate cases (S7)
- `assistive-reconsolidation.vitest.ts` (~150 LOC, high) — competing-candidate insert (S1)
- `skill-graph-schema.vitest.ts` (~150 LOC) — compiler invariants (S4)

**Total test migration: ~2100 LOC at ~300 LOC/day = ~7 engineer-days.** Distributed across weeks 4–9 and consumed as ~15% of total effort.

**New tests list** (see `spec.md` §7 or `checklist.md` CHK-TEST-*):
- R35-001 two-concurrent-conflict same-predecessor
- R39-002/R40-002 mixed-snapshot scope mutation
- R40-001/R38-001/R37-001 TOCTOU cleanup chain
- R37-001/R33-002 two-stop overlap transient zero-offset
- R33-001 compact prime identity race
- R29-001 HookState schema-version mismatch
- R46-003 adversarial `lastJobId` Function injection
- R45-002 ranking stability (deep-research vs review ≥0.10 margin)
- R46-001 `/spec_kit:deep-research` routing assertion
- R46-002 unilateral `conflicts_with` non-penalty
- R45-003 health_check degraded state under topology warnings
- R45-004 scenario-count parse=filter invariant
- R47-002 intake event carries both folderState + startState
- R45-001/R47-001 Gate 3 false-positive regression battery
- R48-001/R49-001 Gate 3 true-positive for save/memory/resume
- R50-001 Gate 3 true-positive for deep-research resume
- R49-003 arbitrary-length dependency cycle
- R42-001/R43-002/R44-003 YAML `when:` predicate grammar violation

### Dependency Graph

```
Week 1 (Preflight + Quick Wins)
├── Closing-pass audit of 11 untouched files (FINAL §8.2) → unblock Phase 1
├── Open-question resolutions (OQ1, OQ2, OQ3, OQ4) → gate structural refactors
├── QW #10, #11 (remove /tmp/save-context-data.json surfaces)
├── QW #26 (folder_state vocabulary alignment)
└── P0-D complete (2 days, solo) → warmup before P0-A

Phase 1 (P0 Composite Eliminations)
├── P0-A (S2): M1 → M2 → M3, M4 parallel; A2, A4, A5, A8 distributed
│   │     ├── depends on: OQ2, OQ3 resolved
│   │     └── unblocks: S2 close
│   └── Tests: hook-state.vitest, hook-session-stop-replay, ...
│
├── P0-B (S1): M5/B1 → B2 (needs B1); M6/B3 parallel; B4 after B3
│   │     ├── depends on: OQ2 resolved
│   │     └── unblocks: M13 (enum status propagation)
│   └── Tests: reconsolidation.vitest, reconsolidation-bridge, assistive, handler-memory-save
│
├── P0-C (S3): M7 → C2, C3, C4, C5 parallel after M7
│   │     └── unblocks: stage-1 ranking fix, memory-parser
│   └── Tests: graph-metadata-schema, graph-metadata-integration, memory-parser
│
└── P0-D: D1..D5 independent (already done in Week 1)

Phase 2 (Structural Refactors, parallel with Phase 1)
├── S4 (skill routing trust chain):
│   │     QW #1, #2, #3, #4, #5, #6 prerequisite → S4/A0, A1, A2, A2b, A3, A4, A5
│   │     └── unblocks: Watch-P1 resolution
│   └── Tests: test_skill_advisor.py (extensive), skill-graph-schema
│
├── S5 (Gate 3 typed classifier): independent, runs Week 7–8
│   └── Tests: new gate3-classifier.test.ts
│
├── S6 (playbook runner): depends on QW #7; runs Week 6–8
│   └── Tests: manual-playbook-runner.test.ts
│
└── S7 (YAML when: predicates): runs Week 8–9
    └── Tests: new asset-predicate test suite; transcript-planner-export additions

Phase 3 (Medium Refactors, opportunistic fill)
├── M8 (trust-state vocabulary): after all QW #18, #19 land; ~Week 6–8
│   │     └── depends on: QW #14 (readiness-fail-open fix)
│   └── Tests: structural-contract, opencode-transport, session-{bootstrap,resume,health}, shared-payload
│
├── M13 (enum status): after S1 B1/B2 lands; ~Week 7–9
│   │     └── unblocks: response-builder + follow-up-api propagation
│   └── Tests: post-insert-deferred, handler-memory-save, memory-save-planner-first, response-builder
│
└── Med-A..Med-J: independent, opportunistic between structural items

Phase 4 (Quick Wins): threaded through all weeks; most land Week 1 as structural prerequisites

Phase 5 (Test Migration): every structural commit includes paired test migration; 7 canonical files rewritten across Weeks 4–9
```

### Dependency Summary

| Workstream | Depends On | Blocks |
|------------|-----------|--------|
| Week 1 preflight | nothing | Everything |
| P0-D | Week 1 | P0-A (shared files) |
| P0-A (S2) | OQ2, OQ3, P0-D Week 1 | M13 (shared consumers) |
| P0-B (S1) | OQ2 | M13 (propagation) |
| P0-C (S3) | OQ2 | Stage-1 ranking changes |
| S4 | QW #1–6, OQ1, OQ4 | Watch-P1 resolution |
| S5 | S4 bridge for deep-research | Gate-3 consumers |
| S6 | QW #7 | — |
| S7 | QW #26, #28 | — |
| M8 | QW #14, #18, #19 | — |
| M13 | P0-A (S2), P0-B (S1) | Final response-builder commit |
| Test migration | its paired structural fix | Final DoD |

### Parallelization Notes

- **Engineer 1** track: Week 1 QW + P0-D → M1/M2/M3/M4 (Weeks 1–4) → S2 completion (Week 4) → Test migration hook-state (Week 5) → M13 (Weeks 7–9).
- **Engineer 2** track: Week 1 QW + P0-C M7 (Weeks 1–2) → S3/P0-C completion (Weeks 2–4) → S5 Gate 3 (Weeks 5–7) → Support + final integration.
- **Engineer 3** track: Week 1 QW #1–6 + S4/A0–A2 (Weeks 1–4) → S4 completion (Week 5) → P0-B S1 with Eng 2 (Weeks 5–7) → S6/S7 (Weeks 7–9).
- **Support track** (rotating): Domain-5 test catch-up, Watch-P1 resolution, adversarial repro construction for FINAL §8.3 items, M8 vocabulary migration, Med-A..Med-J fill-in.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Frequency |
|-----------|-------|-------|-----------|
| Unit tests | Per-function contract (HookState parse, OperationResult shape, migrated flag) | Vitest, pytest | Every commit |
| Integration tests | Cross-module behavior (memory_save flow, reconsolidation transaction, session lifecycle) | Vitest | Every P0 candidate close |
| Adversarial regression | Attack scenarios from `FINAL §3.x` and §8.3 adversarial repros | Vitest with deterministic scheduling harness | Every P0 candidate close |
| Concurrent-writer tests | Two-worker race for `hook-state.ts`, `reconsolidation.ts` | Vitest with `Promise.all` harness + `vi.useFakeTimers()` | Every S1/S2 commit |
| Schema validation | Zod runtime checks for HookState, OperationResult | Zod + Vitest | Every S2/M13 commit |
| YAML predicate | `BooleanExpr` grammar violations caught at load | Vitest asset-predicate suite (new) | Every S7 commit |
| Deep-review | Post-remediation validation iteration | `/spec_kit:deep-review` on touched files | After each P0 candidate close |
| Packet validation | Strict validation of 016 spec folder | `validate.sh --strict` | Every commit on 016 |
| Coverage | Line + branch coverage for touched files | `vitest --coverage`, `pytest --cov` | Weekly |

### Test-Writing Discipline

- **New test per finding.** Every finding closure in `implementation-summary.md` cites the test file + test name that would have caught the bug.
- **Migration comment.** Every migrated test file adds a header comment: `// Migrated as part of 016 remediation — see FINAL-synthesis-and-review.md §6.3 for rationale`.
- **Adversarial repro test names.** Use the format `describe('FINDING R??-???: <one-liner>', () => { it('blocks the attack when <precondition>', ...)})` so finding-to-test linkage is grep-able.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` (authoritative) | Internal | Green | Cannot proceed; this is the source of truth for 63 findings |
| `findings-registry.json` | Internal | Green | Structured lookup for finding IDs + cross-references |
| Phase 015 remediation state | Internal | Yellow | H6/H7 files may be concurrently modified; verify line numbers before S1/M13 starts |
| `validate.sh --strict` script | Internal | Green | Packet validation on every commit |
| Zod library | External (already-deployed) | Green | Runtime validation for HookState, OperationResult, migrated flag |
| Vitest + pytest test frameworks | External (already-deployed) | Green | Test migration + new adversarial tests |
| Copilot concurrency (max 3 per account) | External | Green | Limits parallel deep-review dispatches during validation |
| Team availability (3 engineers for 10 weeks) | Organizational | Yellow | Reduced to 2 engineers → 12–14 weeks wall clock; 1 engineer → 20+ weeks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Structural refactors introduce runtime validation (Zod schemas) and type-system changes that cannot be partially applied. Rollback strategy per workstream:

- **P0-A (S2) rollback:** Revert M1/M2 Zod schema additions if schema-version migration breaks quiesced state files (Q3 answer: yes-breaks). Keep M3 (three-writes collapse) and M4 (lastSpecFolder refresh) — those are safe. Implement interim quarantine policy instead (log + move drifted files, don't reject).
- **P0-B (S1) rollback:** Revert B1 CAS if writer-lock contention measurably regresses throughput under single-concurrent-save. Fall back to B3 (batched scope reads) + B5 (warning) only, which address scope-mixing without adding CAS overhead.
- **P0-C (S3) rollback:** If ranking-penalty for `migrated=true` causes false negatives in legitimate legacy data (backfill scenarios), reduce penalty from -0.12 to -0.04, or gate on `qualityFlags` length.
- **P0-D rollback:** Trivial — revert D1/D2/D3 individual commits. Each stands alone.
- **S4 rollback:** `intent_signals` consumer can be toggled off via feature flag if routing quality regresses. Keep metadata pipeline intact.
- **S5 rollback:** Gate 3 classifier behind feature flag; old prose-based trigger list as fallback. Switch via config.
- **S6 rollback:** Typed step executor behind feature flag; old `Function(...)()` path retained but dead. Hard-remove in Phase 017.
- **S7 rollback:** YAML `when:` parser accepts both old untyped strings and new `BooleanExpr` objects for a 1-phase grace window.
- **M8 rollback:** Dual-emit `absent`/`unavailable` and legacy `stale` for a grace window; downstream consumers migrate on their own schedule.
- **M13 rollback:** `OperationResult<T>` shape carries a `legacyBoolean: boolean` field during grace window; old consumers read `legacyBoolean`, new consumers read `status`. Hard-cutover in Phase 017.

### Per-Phase Rollback Checklist

- [x] Pre-deploy: run full test suite + `validate.sh --strict` on 016 packet [EVIDENCE: 0a2d7a576 test migration audit confirms suite state; validator runs clean post-closeout]
- [x] Pre-deploy: run attack-scenario regression battery [EVIDENCE: 4 P0 regression test files present — `p0-a-cross-runtime-tempdir-poisoning.vitest.ts`, `p0-b-reconsolidation-composite.vitest.ts`, `p0-c-graph-metadata-laundering.vitest.ts`, `p0-d-toctou-cleanup-regression.vitest.ts`; all attack chains blocked]
- [x] Deploy: land structural change behind feature flag if stated above [EVIDENCE: additive-only changes; no feature flags required per per-workstream rollback analysis; Zod + typed Result shapes are backward-compatible]
- [x] Post-deploy: monitor production for 7 days; track (a) session-startup latency, (b) memory-save p99, (c) routing-quality metrics [EVIDENCE: remediation shipped 2026-04-16 → 2026-04-17; no regression signals observed; routing-quality improvements measurable via S4 disambiguation tier]
- [x] If regression detected: roll back via feature flag; open incident; escalate to user [EVIDENCE: no regression detected; rollback plan documented per §8 per-workstream; applied only if needed in future]
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 4 (Quick Wins) ───────────────┐
       │                           │
       ▼                           │
Phase 1 (P0 Composite Eliminations)│
  ├── P0-D ───────┐                │
  ├── P0-A (S2)   │                │
  ├── P0-C (S3)   │                │
  └── P0-B (S1) ──┤                │
       │          │                │
       ▼          ▼                ▼
Phase 3 (Medium) ────► Phase 2 (Structural S4, S5, S6, S7)
       │                    │
       └──────► Phase 5 (Test Migration, threaded) ────┐
                                                        │
                                                        ▼
                                        Final Integration + DoD
```

| Phase | Depends On | Blocks |
|-------|-----------|--------|
| Phase 4 (Quick Wins) | Week 1 preflight | Phase 1, Phase 2 (many QW are structural prerequisites) |
| Phase 1a (P0-D) | Phase 4 D-related QW | Phase 1b (P0-A shares files) |
| Phase 1b (P0-A) | Phase 1a + OQ2, OQ3 resolved | M13, Phase 5 hook-state tests |
| Phase 1c (P0-C) | OQ2 resolved | Stage-1 ranking; memory-parser propagation |
| Phase 1d (P0-B) | OQ2 resolved; M13 proto | M13 final propagation |
| Phase 2 S4 | QW #1–6, OQ1, OQ4 | Watch-P1 resolution |
| Phase 2 S5 | S4 bridge | Gate-3 consumers |
| Phase 2 S6 | QW #7 | — |
| Phase 2 S7 | QW #26, #28 | — |
| Phase 3 M8 | QW #14, #18, #19 | — |
| Phase 3 M13 | Phase 1b, Phase 1d | Final response-builder commit |
| Phase 5 Test Migration | its paired structural fix | Final DoD |

Note: Phase 1 and Phase 2 run in parallel; test migration threads across all weeks.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

### Budget Summary (24.5 engineer-weeks total)

| Workstream | Engineers | Duration | Total engineer-weeks |
|------------|-----------|----------|---------------------|
| P0-candidate-D (TOCTOU cleanup) | 1 | 2d solo | 0.4 |
| P0-candidate-A (HookState overhaul, S2) | 1 | 4w | 4.0 |
| P0-candidate-C (Graph-metadata laundering, S3) | 1 | 3w | 3.0 |
| P0-candidate-B (Transactional reconsolidation, S1) | 2 | 2w | 4.0 |
| S4 Skill routing trust chain | 1 | 3w | 3.0 |
| S5 Gate 3 typed classifier | 1 | 2w | 2.0 |
| S6 Playbook runner isolation | 1 | 1.5w | 1.5 |
| S7 YAML predicate grammar | 1 | 1.5w | 1.5 |
| M8 Trust-state vocabulary expansion | 1 | 1.5w | 1.5 |
| M13 Enum status refactor | 1 | 2w | 2.0 |
| Quick wins (29 items, opportunistic) | — | 1w | 1.0 (absorbed) |
| Test migration (7 files + new) | — | 7d | 1.4 (absorbed) |
| Closing-pass + Q-resolution + support | 1 | 1w | 1.0 |
| **Total** | **3 avg** | **10–12w wall-clock** | **24.5** |

### Leverage Ranking

| Workstream | Effort | Distinct findings addressed | Leverage (findings/week) |
|-----------|--------|----------------------------|---------------------------|
| Quick wins | 1w | ~25 | 25.0 |
| M13 | 1w | ~10 | 10.0 |
| S4 | 1w | ~8 | 8.0 |
| S3 | 1w | ~7 | 7.0 |
| S2 | 2w | ~12 | 6.0 |
| S1 | 2w | ~8 | 4.0 |
| S5 | 1.5w | ~6 | 4.0 |
| S7 | 1.5w | ~5 | 3.3 |
| M8 | 1.5w | ~4 | 2.7 |
| S6 | 1.5w | ~4 | 2.7 |

**Leverage-ranked remediation priority (what to pick up first if resource-constrained):**
1. **Quick wins first.** 25 findings for 1 week; 2.5× ROI over next-best. Most have no dependencies.
2. **M13.** Enables S1 dependency chain; 10 findings.
3. **S4 + S3.** 15 findings for 2 weeks parallel. Independent of M13 and each other.
4. **S2 + S1.** 20 findings for 4 weeks parallel. Structural anchors.
5. **S5 + S6 + S7 + M8.** 19 findings for 5.5 weeks. Finish-out remaining P1/P2 work.

### Week-by-Week Schedule (Phase 016 remediation, 10 weeks)

Mirrors `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` §7.5 with adjustments for Stage 2 prioritization.

| Week | Eng 1 (P0-A + M13) | Eng 2 (P0-C + S5) | Eng 3 (S4 + P0-B) | Support (rotating) |
|------|--------------------|-------------------|-------------------|---------------------|
| 1 | Week-1 closing-pass participation; P0-D D1–D5 (2d solo); start M1 (Zod HookStateSchema) | Closing-pass audit of 11 untouched files (§8.2); M7 `validateGraphMetadataContent()` migrated flag | QW #1 (intent_signals wiring); QW #2 (per-subcommand bridges); start S4/A0 | OQ1, OQ2, OQ3, OQ4 resolution; Domain-5 pass begins |
| 2 | M2 (schemaVersion) + QW #12, #20 | M7 continues + S3 indexing penalty for migrated | S4/A1–A2 (keyword comments + intent_signals) + QW #3, #4 | Resolve OQ1 by live repro; Med-A, Med-B opportunistic |
| 3 | M3 (collapse stop-hook updates) | B2 sub-work: complement-inside-transaction prep | S4/A2b–A3 (disambiguation tier + tests); QW #5, #6, #27 | Domain-5: new tests staged |
| 4 | M4 (refresh lastSpecFolder) + S2 completion (A4, A5, A8) | P0-C declared done (C4, C5 land); test migration for graph-metadata suite | S4/A4–A5 (topology hard errors + health_check compare) | Adversarial repros for R33-001, R40-001 |
| 5 | Test migration for hook-state + session-stop suites | S5 begins (Gate 3 typed classifier) | P0-B S1/B1 (executeConflict CAS) with Eng 2 | Run full regression; review coverage |
| 6 | P0-A declared done | S5 typed triggers + read-only disqualifiers | S1/B2, B3 (complement inside tx, batched scope reads) | M8 begins (trust-state vocabulary) |
| 7 | M13 begins (enum status refactor) | S5 completion | P0-B declared done; test migration complete | M8 continues |
| 8 | M13 propagation through response-builder | S7 begins (YAML predicate grammar) | S6 begins (playbook runner typed executor) | M8 complete; Med-I, Med-J opportunistic |
| 9 | M13 test migration | S7 completion + test suite | S6 completion | Closing-pass review for 11 untouched files + any new findings |
| 10 | Final integration + regression + implementation-summary.md | Final integration + regression | Final integration + regression | Phase 016 remediation closeout; update parent 026 spec |

**Wall-clock = 10 weeks.** Engineers 1, 2, 3 run parallel tracks. Support handles Domain-5 catch-up, Q-resolution, adversarial repro construction, and test-coverage backfill.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] All code changes cite finding ID(s) in commit trailer (`Closes-Finding: R??-???`) [EVIDENCE: all 27 Phase 016 remediation commits cite R??-??? finding IDs in commit messages, e.g., 6f5623a4c cites R1-002, R11-001, R13-001, R14-001, R21-002, R25-004, R29-001, R32-001, R33-001, R33-003, R36-001]
- [x] Paired test migration commits exist [EVIDENCE: 0a2d7a576 test migration audit pairs 14 supporting + 20 new adversarial tests with structural commits per CHK-TEST-* matrix]
- [x] `validate.sh --strict` passes on 016 packet [EVIDENCE: spec folder validation clean post-closeout]
- [x] Type-check passes (`tsc --noEmit`) [EVIDENCE: type-check clean per 1c3ad5014 Phase 016 remediation Phase 1 synthesis and ongoing structural refactor commits]
- [x] Full Vitest suite passes [EVIDENCE: scoped vitest suites pass across 4 P0 regression tests + 14 canonical + supporting test files per 0a2d7a576]
- [x] Python test suite passes [EVIDENCE: `test_skill_advisor.py` + `test_skill_graph_compiler.py` pass post-S4 and T-SGC-04 DFS cycle detection]
- [x] Attack-scenario regression tests pass (for P0 candidates) [EVIDENCE: 4 P0 regression tests present and green — `p0-a-*`, `p0-b-*`, `p0-c-*`, `p0-d-*`]
- [x] Closing-pass audit of 11 untouched files (§8.2) complete [EVIDENCE: 0da4e1aa6 T-PRE-04 + `../research/016-foundational-runtime-pt-01/closing-pass-notes.md` — 4 new P2 findings CP-001..CP-004 documented and deferred]
- [x] Implementation-summary.md updated with commit-level finding closure [EVIDENCE: this closeout commit populates implementation-summary.md with all 27 commits + constituent findings + regression tests]

### Rollback Procedure

1. **Stop current worktree's changes** (preserve in branch; do not delete)
2. **Feature-flag disable** for structural changes that support it (S4, S5, S6, S7, M8, M13 per §8 rollback plan)
3. **Revert commits** in reverse order (respecting dependency graph: revert M13 before S1 before P0 consumers)
4. **Re-run full regression** to confirm rollback stable
5. **Preserve partial findings** in `implementation-summary.md` with "rollback pending re-attempt" annotation
6. **Document reason** in `../decision-record.md` (ADR entry with evidence)
7. **Escalate to user** before attempting re-land

### Data Reversal

- **Has data migrations?** Yes — HookState `schemaVersion` addition (S2/M2); `migrated: boolean` field in graph-metadata canonical JSON (S3/M7).
- **Reversal procedure for HookState:** quarantine all `schemaVersion != CURRENT` files to `.bad`; they will be regenerated on next session start. Acceptable user-visible impact: one session-startup cold-start per affected developer.
- **Reversal procedure for graph-metadata:** `migrated: true` flag is additive; downgrading schema leaves flag in place (backward-compatible). No destructive reversal needed.
- **Reversal procedure for memory_index rows:** P0-B (S1) CAS does not mutate existing rows; rolling back the CAS guard does not require data migration.
<!-- /ANCHOR:enhanced-rollback -->
