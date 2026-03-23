---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) was removed from the live ranking path; only dormant reference and offline-evaluation artifacts remain."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Removed from live ranking in Sprint 8. Relative score fusion (RSF) is retained only as dormant reference and offline-evaluation code.

When multiple search methods return ranked lists, RSF is one alternative way to merge them. That runtime path is no longer active. The remaining module and tests exist for compatibility metadata and offline comparison work, not as a planned live ranking option.

---

## 2. CURRENT REALITY

RRF remains the sole live fusion method. RSF was removed from the shipped hybrid-search ranking path.

The repository still contains the standalone RSF fusion module and tests for three variants: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). Those artifacts can be exercised in isolation for offline comparison, but they are not a supported runtime ranking path.

Sprint 8 removed the dead `isRsfEnabled()` helper and the dead hybrid-search branch that had been guarded behind it. A typed `rsfShadow` metadata slot still exists for compatibility in pipeline types, and `SPECKIT_RSF_FUSION` remains as an inert config and documentation surface, but neither one re-enables production ranking behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/rsf-fusion.ts` | Lib | Relative score fusion |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/rsf-fusion-edge-cases.vitest.ts` | RSF fusion edge cases |
| `mcp_server/tests/rsf-fusion.vitest.ts` | RSF fusion scoring |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Relative score fusion in shadow mode
- Current reality source: feature_catalog.md
