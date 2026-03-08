# Codex Cross-AI Review Report — 008-combined-bug-fixes

**Date:** 2026-03-08
**Reviewer:** Codex CLI v0.111.0 (5 agents, orchestrated by Claude Opus 4.6)
**Baseline:** typecheck PASS, 242 test files / 7129 tests PASS
**Scope:** 9 source files + 8 test files + 7 spec docs (17 modified files total)

---

## Agent Verdicts

| Agent | Model | Focus | Verdict | Confidence | Tokens |
|-------|-------|-------|---------|-----------|--------|
| R1 | gpt-5.3-codex | Algorithms & Scoring | **FAIL** | 90 | 56,286 |
| R2 | gpt-5.3-codex | Storage & Lifecycle | **FAIL** | 92 | 59,178 |
| R3 | gpt-5.3-codex | Handlers, Graph & Scripts | **FAIL** | 87 | 130,629 |
| A1 | gpt-5.4 | Architecture Cross-Cutting | **CONDITIONAL_PASS** | 90 | 166,256 |
| A2 | gpt-5.4 | Documentation Alignment | **CONDITIONAL_PASS** | 94 | 145,707 |

**Overall: 3 FAIL / 2 CONDITIONAL_PASS / 0 PASS**

---

## Deduplicated Findings by Severity

### P0 — Critical (0 findings)

None.

### P1 — Important (15 findings, deduplicated to 12)

#### Code Findings

| # | Source | File(s) | Finding |
|---|--------|---------|---------|
| F1 | R1 | `rrf-fusion.ts:334` | `fuseResultsCrossVariant()` fuses via `fuseResultsMulti()` (which normalizes), then subtracts raw `convergenceBonus` at lines 363/373. Mixes normalized and raw scales — convergence correction is wrong when normalization ON, can drive scores negative. |
| F2 | R1 | `rrf-fusion.ts:188` | No finite-number validation on `list.weight`; NaN/Infinity can produce invalid `rrfScore`, and `normalizeRrfScores()` does not sanitize non-finite values, allowing NaN propagation through ranking/sorting. |
| F3 | R1 | `adaptive-fusion.ts:210` | All-zero channel weights not guarded. Fusion still runs and normalization maps all scores to 1.0, yielding misleading "max" scores instead of fallback/neutral behavior. |
| F4 | R2 | `checkpoints.ts:664` | `restoreCheckpoint` creates `working_memory` with `FOREIGN KEY ... ON DELETE CASCADE`; delete-chain risk persists for future deletes/replaces on `memory_index`. |
| F5 | R2 | `checkpoints.ts:873` | Causal-edge restore inserts snapshot edges without self-loop guard, bypassing `insertEdge`'s rejection at `causal-edges.ts:149`. Self-loops can re-enter via checkpoint restore. |
| F6 | R3 | `folder-detector.ts:469` | `resolveSessionSpecFolderPaths` accepts absolute `spec_folder` from session-learning rows without approved-root validation. Poisoned DB row can route writes outside `specs/`. |
| F7 | R3 | `workflow.ts:788` | HTML cleaning removes only `<summary>`/`<details>` tags; other HTML remains and is written to storage. Incomplete "strip HTML before storage" enforcement. |
| F8 | R3 | `memory-crud-health.ts:396` | Orphan-edge auto-repair invoked without local causal-edge DB initialization. Cleanup depends on prior side effects and may silently no-op on fresh sessions. |

#### Architecture Findings (A1 — cross-cutting)

| # | Source | Pattern | Finding |
|---|--------|---------|---------|
| F9 | A1 | Error contracts | Failure contracts differ by layer: shared fusion degrades in-band, storage returns sentinels with warnings, handlers/scripts throw. Inconsistent across 8 of 9 files. |
| F10 | A1 | Type safety | Loose type contracts at boundaries: `Record<string, unknown>`, SQL result casts, permissive index signatures, `as unknown as T` in `tier-classifier.ts:416`. "Trust the shape at runtime" pattern. |
| F11 | A1 | Persistence duplication | `checkpoints.ts` writes to `causal_edges` directly (bypassing `causal-edges.ts`), `memory-crud-health.ts` mixes health/repair SQL, `folder-detector.ts` queries `session_learning` directly via raw SQLite. |

#### Documentation Findings (A2)

| # | Source | File | Finding |
|---|--------|------|---------|
| F12 | A2 | `checklist.md` | Claims 102/111 verified, but actual count is 122/135. Sub-section summaries also inconsistent (003 says 8/8 but has 9/9; 013 says 25/25 but has unchecked items). |
| F13 | A2 | `tasks.md` | Overview counts unreliable: 013 says 37 tasks but includes suffixed IDs; 015 says 73 complete / 11 deferred but section shows 69 checked / 15 deferred. |
| F14 | A2 | `spec.md` / `handover.md` | 11 strategic deferred items lack acceptance criteria. 8 of 15 deferred task IDs have no checklist mapping. Handover doesn't carry forward deferrals. |
| F15 | A2 | `plan.md:9` | Marked `SPECKIT_LEVEL: 2` inside a Level 3 folder — template-compliance mismatch. |

### P2 — Minor (8 findings)

| # | Source | File | Finding |
|---|--------|------|---------|
| F16 | R1 | `rrf-fusion.ts:149` | Duplicate IDs in list B accumulate convergence bonus multiple times. |
| F17 | R1 | `five-factor-scoring.vitest.ts:423,856` | Tests pass on exceptions via `expect(true).toBe(true)`, masking regressions. |
| F18 | R1 | `five-factor-scoring.vitest.ts:505` | `optimalScore / suboptimalScore` lacks zero-denominator guard. |
| F19 | R2 | `checkpoints.ts:817` | `workingMemory` rows written via `INSERT OR REPLACE` without schema validation. |
| F20 | R2 | `causal-edges.ts:522` | `cleanupOrphanedEdges` multi-step mutation without transaction; partial cleanup on mid-loop failure. |
| F21 | R3 | `memory-crud-health.ts:185` | `specFolders` emitted unredacted while other paths are redacted — path-disclosure gap. |
| F22 | R3 | `community-detection.ts:320` | Debounce fingerprint uses only `COUNT(*) + MAX(id)` — not unique, can return stale assignments. |
| F23 | R3 | `memory-crud-extended.vitest.ts:55` | Causal-edges mock omits `cleanupOrphanedEdges`, so health auto-repair tests can pass even if wiring regresses. |
| F24 | A1 | All files | Public API surface wider than stable API — implementation constants/helpers/test hooks exported alongside entry points. |
| F25 | A2 | `decision-record.md` | No YAML frontmatter, only 2/11 ADRs have full sections, uses banned style word. |

---

## Coverage Gaps (Aggregated)

1. **Runtime test execution blocked** for all Codex agents due to sandbox EPERM on Vitest temp dir creation. All validation was static review only.
2. No test for `fuseResultsCrossVariant()` with normalization ON vs OFF to verify convergence bonus applied exactly once.
3. No tests for NaN/Infinity/non-finite weights in adaptive/RRF fusion.
4. No tests for zero-weight edge cases (all channel weights = 0).
5. No test for merge-mode in-place UPDATE path (`INSERT OR IGNORE` + `UPDATE`) for existing `memory_index` IDs.
6. No test for self-loop rejection during checkpoint restore.
7. No test for `cleanupOrphanedEdges` atomicity under injected failure.
8. No test for session-learning path rejection when DB rows point outside approved roots.
9. No test for stripping arbitrary HTML tags beyond `<summary>`/`<details>`.
10. 8 deferred task IDs have no checklist mapping: T015, T020, T023, T028, T033, T036, T060, T076.

---

## Quality Metrics

### A1: Architecture Alignment Score

**72/100**

| Dimension | Rating |
|-----------|--------|
| Error handling | Inconsistent |
| Type safety | Moderate |
| Module boundaries | Leaky |
| Import graph | Has issues (no cycles, but dynamic imports and DB coupling) |

### A2: Documentation Quality Index (DQI)

**78/100** (aggregate)

| Document | Score | Structure | Content | Style |
|----------|-------|-----------|---------|-------|
| spec.md | 88 | 35/40 | 25/30 | 28/30 |
| plan.md | 80 | 30/40 | 22/30 | 28/30 |
| tasks.md | 77 | 30/40 | 19/30 | 28/30 |
| checklist.md | 72 | 28/40 | 17/30 | 27/30 |
| decision-record.md | 69 | 24/40 | 20/30 | 25/30 |
| implementation-summary.md | 85 | 34/40 | 23/30 | 28/30 |
| handover.md | 74 | 31/40 | 16/30 | 27/30 |

---

## Regression Risks (A1)

1. `checkpoints.ts` ↔ `causal-edges.ts` — Direct writes bypass future invariants, cache invalidation, or mutation side effects.
2. `community-detection.ts` ↔ stage-2 fusion — `applyCommunityBoost()` injects minimally shaped rows; stricter contracts can break ranking.
3. `tier-classifier.ts` ↔ trigger handlers — `filterAndLimitByState()` strips `_classification` and casts back to `T`; DTO tightening can regress without compiler help.
4. `rrf-fusion.ts`/`adaptive-fusion.ts` ↔ hybrid search — downstream code relies on pass-through fields plus `rrfScore` fallback semantics.
5. `folder-detector.ts` ↔ `workflow.ts` — Workflow startup depends on folder-detector's mix of throws and fall-throughs.

---

## Recommendation

**FIX FIRST** — then re-verify

### Immediate Actions (Before Commit)

The 15 P1 findings include 8 code findings. None are P0 (no data loss / security exploits confirmed in production paths), but several represent real correctness risks:

- **F1** (convergence bonus scale mismatch) and **F2** (NaN propagation) affect ranking accuracy
- **F5** (self-loop via restore) and **F6** (path validation gap) are data integrity risks
- **F12-F15** (doc count inaccuracies) should be corrected before the spec folder is considered auditable

### Deferral-Safe Items

- **F9-F11** (architecture patterns) are systemic and not blockers for this consolidation
- **F24** (wide API surface) is a refactor opportunity, not a bug
- **P2 findings** (F16-F25) are quality improvements, not correctness risks

---

## Process Notes

- All agents used `--sandbox read-only` (review profile)
- Tests could not execute within Codex sandbox (EPERM on Vitest temp dirs) — pre-flight baseline was verified separately: **242 files, 7129 tests, all pass**
- `spec_kit_memory` MCP server failed to start on all agents (expected — single-instance server already in use)
- Total tokens consumed: ~558K across 5 agents
