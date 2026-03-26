---
title: "Stage 3 effectiveScore fallback chain"
description: "Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and cross-encoder mapping."
---

# Stage 3 effectiveScore fallback chain

## 1. OVERVIEW

Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and cross-encoder mapping.

A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.

---

## 2. CURRENT REALITY

`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Pipeline | `effectiveScore()` alias for `resolveEffectiveScore()`, used in cross-encoder mapping and MMR candidate scoring |
| `mcp_server/lib/search/pipeline/types.ts` | Pipeline | `resolveEffectiveScore()` fallback chain implementation and `stage2Score` field on `PipelineRow` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/score-resolution-consistency.vitest.ts` | resolveEffectiveScore fallback chain correctness |
| `mcp_server/tests/pipeline-v2.vitest.ts` | End-to-end pipeline behavior including Stage 3 scoring |

---

## 4. SOURCE METADATA

- Group: Gemini review P1 fixes (Phase 015)
- Source feature title: Stage 3 effectiveScore fallback chain
- Current reality source: FEATURE_CATALOG.md
