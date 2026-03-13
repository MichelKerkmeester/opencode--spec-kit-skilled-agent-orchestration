# Relative score fusion in shadow mode

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Relative score fusion in shadow mode.

## 2. CURRENT REALITY

RRF remains the live fusion method. RSF no longer runs in the shipped hybrid-search ranking path.

The repository still contains the standalone RSF fusion module and tests for three variants: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). Those artifacts can be exercised in isolation, but they are not wired into live ranking.

Sprint 8 removed the dead `isRsfEnabled()` helper and the dead hybrid-search branch that had been guarded behind it. A typed `rsfShadow` metadata slot still exists for compatibility in pipeline types, and `SPECKIT_RSF_FUSION` remains as an inert config/documentation surface, but production ranking behavior stays on RRF unless a future implementation reintroduces a real runtime path.

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

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Relative score fusion in shadow mode
- Current reality source: feature_catalog.md
