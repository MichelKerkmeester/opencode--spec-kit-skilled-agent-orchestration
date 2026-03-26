---
title: "Legacy V1 pipeline removal"
description: "The 4-stage pipeline is the sole runtime search path. The SPECKIT_PIPELINE_V2 environment variable is not consumed by runtime code."
---

# Legacy V1 pipeline removal

## 1. OVERVIEW

The 4-stage pipeline is the sole runtime search path. The `SPECKIT_PIPELINE_V2` environment variable is not consumed by runtime code. A single orchestrator (`stage1-candidate-gen.ts` through `stage4-filter.ts`) handles all retrieval. There is no alternative code path.

---

## 2. CURRENT REALITY

The 4-stage orchestrator is the only runtime code path. Stage responsibilities are distributed across `stage1-candidate-gen.ts`, `stage2-fusion.ts`, `stage3-rerank.ts`, and `stage4-filter.ts`. There is no `isPipelineV2Enabled()` function; the helper was removed along with the legacy V1 pipeline. The `SPECKIT_PIPELINE_V2` environment variable is not read by any code.

Orphaned chunk detection was added to `verify_integrity()` as the fourth P0 fix: chunks whose parent has been deleted but the chunk record persists (e.g., if FK cascade didn't fire) are now detected and optionally auto-cleaned when `autoClean=true`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Entry point — legacy `postSearchPipeline` path removed; 4-stage pipeline is sole code path |
| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Pipeline orchestration — no V1 fallback |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 candidate generation |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Stage 3 reranking |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering with `verifyScoreInvariant()` |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | `verify_integrity()` with orphaned chunk detection (P0 fix) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration — confirms no V1 path |
| `mcp_server/tests/search-flags.vitest.ts` | Confirms no `isPipelineV2Enabled()` function |

---

## 4. SOURCE METADATA

- Group: Opus review remediation (Phase 017)
- Source feature title: Legacy V1 pipeline removal
- Current reality source: FEATURE_CATALOG.md
