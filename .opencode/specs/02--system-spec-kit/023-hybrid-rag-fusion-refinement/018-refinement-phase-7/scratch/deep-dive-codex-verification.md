---
title: "Deep Dive - Codex: Cross-Verification of All Gemini Findings"
source: "cli-codex (gpt-5.3-codex, read-only sandbox)"
date: 2026-03-02
---

# Deep Dive: Codex Cross-Verification of Gemini Findings

5 Codex agents independently verified Gemini's deep-dive findings. Results:

## SQL Safety — 3 FALSE POSITIVES, 3 CONFIRMED

| # | Finding | Gemini | Codex | Resolution |
|---|---------|--------|-------|------------|
| 1 | memory-crud-list.ts `${whereClause}` | P1 SQL template | **FALSE POSITIVE** | Built from fixed fragments + parameterized values |
| 2 | mutation-ledger.ts `${where}` | P1 SQL template | **FALSE POSITIVE** | Fixed `= ?` conditions + numeric-clamped limit/offset |
| 3 | causal-edges.ts `${parts.join}` | P1 SQL template | **FALSE POSITIVE** | Parts are fixed tokens (`'strength = ?'`) not user input |
| 4 | rsf-fusion.ts Math.max(...spread) | P1 stack overflow | **CONFIRMED** | Lines 101-104 |
| 5 | causal-boost.ts Math.min(...spread) | P1 stack overflow | **CONFIRMED** | Line 227 |
| 6 | evidence-gap-detector.ts Math.max(...spread) | P1 stack overflow | **CONFIRMED** | Line 157 |

**Key correction**: Gemini flagged SQL template literals as P1, but Codex verified the interpolated values come from fixed internal logic (not user input). These are **safe** — parameterized WHERE clauses built from hardcoded fragments. Downgraded from P1 to P2 (code style preference).

## Transaction Boundaries — 3/3 CONFIRMED

| # | Handler | Issue | Codex Verdict |
|---|---------|-------|---------------|
| 1 | memory-crud-delete.ts (single) | No tx wrapper around delete+edges+ledger | **CONFIRMED** (L62-92) |
| 2 | memory-bulk-delete.ts | appendMutationLedgerSafe outside bulk tx | **CONFIRMED** (L186-205) |
| 3 | memory-crud-update.ts | updateMemory+appendLedger not in single tx | **CONFIRMED** (L127-180) |

## Tool Count — CORRECTED

| Claim | Gemini | Codex |
|-------|--------|-------|
| Tools in code | 25 | **25** (confirmed) |
| Tools in doc | 23 | **25** (doc also lists 25) |
| Undocumented | 2 | **0** (all 25 documented) |

**Key correction**: Gemini claimed doc says 23. Codex verified the doc's table of contents actually lists all 25 tools. **No undocumented tools exist.** The "23" number appears to be from an older version of the doc or a miscount.

## Doc Accuracy — 4 CONFIRMED, 1 DISPUTED

| # | Finding | Codex Verdict |
|---|---------|---------------|
| Stage 2 signal count | **DISPUTED**: 12 signal *stages* but only 9 *score-affecting* (testing effect, artifact limiting, anchor metadata don't modify scores) |
| memory_update embedding | **CONFIRMED**: title + content (not title-only). Codex notes: title-only when content_text is empty |
| delete cleanup (8 tables) | **CONFIRMED**: All 8 tables listed with exact DELETE statements |
| SPECKIT_ADAPTIVE_FUSION | **CONFIRMED**: Exists at adaptive-fusion.ts L74 + 7 test/eval references |
| R8 summary in Stage 1 | **CONFIRMED**: querySummaryEmbeddings at stage1-candidate-gen.ts L512 |

## Phase 015-017 Fixes — 7/7 CONFIRMED

| # | Fix | Codex Verdict | Key Evidence |
|---|-----|---------------|--------------|
| 1 | Quality gate persistence | **CONFIRMED** | save-quality-gate.ts:161 loadActivationTimestampFromDb |
| 2 | Canonical ID dedup | **CONFIRMED** | hybrid-search.ts:1108 canonicalResultId() |
| 3 | forceAllChannels | **CONFIRMED** | hybrid-search.ts:1269 tier-2 fallback |
| 4 | Self-loop prevention | **CONFIRMED** | causal-edges.ts:148 sourceId === targetId |
| 5 | 128-bit dedup hash | **CONFIRMED** | session-manager.ts:308 .slice(0, 32) |
| 6 | Orphaned chunks | **CONFIRMED** | vector-index-impl.ts:3856 find_orphaned_chunks() |
| 7 | resolveEffectiveScore | **CONFIRMED** | types.ts:56 4-step fallback chain |

## Cross-Model Agreement Summary

| Category | Gemini Finding | Codex Verification | Agreement |
|----------|---------------|-------------------|-----------|
| SQL template literals | 5 P1 issues | 3 FALSE POSITIVE, 2 not checked | PARTIAL (Codex corrects Gemini) |
| Math spread | 3+ confirmed | 3/3 confirmed | FULL |
| Transaction gaps | 4 issues | 3/3 confirmed | FULL |
| Tool count 25 vs 23 | 2 undocumented | 0 undocumented (doc has 25) | CORRECTED by Codex |
| Stage 2 signals | 12 | 12 stages, 9 score-affecting | NUANCED (both correct) |
| Phase fixes | All verified | 7/7 confirmed | FULL |
