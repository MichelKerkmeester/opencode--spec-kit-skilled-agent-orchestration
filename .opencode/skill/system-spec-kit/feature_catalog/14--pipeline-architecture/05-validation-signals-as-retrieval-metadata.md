---
title: "Validation signals as retrieval metadata"
description: "Validation signals as retrieval metadata integrates spec document quality scores into the Stage 2 scoring layer as a bounded multiplier."
---

# Validation signals as retrieval metadata

## 1. OVERVIEW

Validation signals as retrieval metadata integrates spec document quality scores into the Stage 2 scoring layer as a bounded multiplier.

Well-maintained documents should rank slightly higher than neglected ones when both are equally relevant to your question. This feature gives a small ranking nudge to documents that have been reviewed, validated and kept up to date. The nudge is small enough that a truly relevant but less polished document still wins over a well-polished but less relevant one.

---

## 2. CURRENT REALITY

Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).

The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag. Always active.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `mcp_server/lib/search/validation-metadata.ts` | Lib | Validation signal metadata |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/pipeline-architecture-remediation.vitest.ts` | Direct audit traceability coverage for validation metadata ownership |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/validation-metadata.vitest.ts` | Validation metadata tests |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Validation signals as retrieval metadata
- Current reality source: FEATURE_CATALOG.md
