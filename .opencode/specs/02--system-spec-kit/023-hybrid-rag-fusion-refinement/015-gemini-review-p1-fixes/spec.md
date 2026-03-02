# Spec: Gemini Review P1 Fixes

**Parent:** 023-hybrid-rag-fusion-refinement
**Level:** 2
**Status:** In Progress
**Created:** 2026-03-02

## Problem

Gemini code review (two reviews: 88/100 and 85/100, both Conditional Pass) identified two P1 issues requiring fixes before full approval:

1. **Warn-only timer persistence** — `qualityGateActivatedAt` in `save-quality-gate.ts` is stored in-memory only. Server restarts reset the 14-day graduation countdown, preventing the quality gate from ever leaving warn-only mode.

2. **Stage 3 effectiveScore() fallback gap** — `effectiveScore()` in `stage3-rerank.ts` skips `intentAdjustedScore` and `rrfScore` in its fallback chain. Additionally, Stage 3 overwrites the `score` field at line 312, violating the Score Immutability Invariant documented in `stage2-fusion.ts:38-43`.

## Scope

### In Scope
- Persist `qualityGateActivatedAt` to SQLite `config` table using existing kv_store pattern
- Update `effectiveScore()` fallback chain to include `intentAdjustedScore` and `rrfScore`
- Address Stage 3 score immutability invariant violation
- Tests for both fixes

### Out of Scope
- P2 items (memory-save.ts refactor, Stage 2 normalization, negative momentum cap)
- Any pipeline behavioral changes beyond the fallback chain fix

## Success Criteria
- [ ] Quality gate activation timestamp persists across server restarts
- [ ] `effectiveScore()` checks `intentAdjustedScore` -> `rrfScore` -> `score` -> `similarity/100`
- [ ] Stage 3 preserves Stage 2's `score` field (writes to `rerankScore` only, or documents why overwrite is acceptable)
- [ ] All 7,008+ existing tests pass
- [ ] New tests cover persistence and fallback scenarios
