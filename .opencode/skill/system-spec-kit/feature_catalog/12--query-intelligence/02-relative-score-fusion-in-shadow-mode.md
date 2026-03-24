---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) was fully removed — module, tests, and shadow metadata deleted. RRF is the sole fusion method."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Removed from live ranking in Sprint 8. The RSF module, its dedicated test files, and the `rsfShadow` metadata field were fully deleted during the v3 remediation sweep.

When multiple search methods return ranked lists, RSF was one alternative way to merge them. RRF won the evaluation and RSF was deprecated. The module was retained temporarily for offline comparison but was never reactivated — it was removed as dead code.

---

## 2. CURRENT REALITY

RRF remains the sole live fusion method. RSF has been fully removed from the codebase.

The standalone RSF fusion module (`rsf-fusion.ts`) and its dedicated test files (`rsf-fusion.vitest.ts`, `rsf-fusion-edge-cases.vitest.ts`, `rsf-vs-rrf-kendall.vitest.ts`, `rsf-multi.vitest.ts`) have been deleted. RSF references in mixed test files (`cross-feature-integration-eval`, `feature-eval-query-intelligence`, `dead-code-regression`) have been surgically removed. The `rsfShadow` metadata field in `Sprint3PipelineMeta` has been removed from `hybrid-search.ts`.

`SPECKIT_RSF_FUSION` may still appear as an inert config surface in documentation but has no runtime effect.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| ~~`mcp_server/lib/search/rsf-fusion.ts`~~ | ~~Lib~~ | Deleted — RSF fusion removed as dead code |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm (sole live method) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |
| ~~`mcp_server/tests/rsf-fusion*.vitest.ts`~~ | Deleted — RSF test files removed |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Relative score fusion in shadow mode
- Current reality source: feature_catalog.md
