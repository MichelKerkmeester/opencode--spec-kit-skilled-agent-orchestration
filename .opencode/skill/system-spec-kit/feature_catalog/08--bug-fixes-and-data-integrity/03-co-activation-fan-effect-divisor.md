# Co-activation fan-effect divisor

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Co-activation fan-effect divisor.

## 2. CURRENT REALITY

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 hot-path co-activation boost application (`base + boost * coactivation_strength`) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/rrf-degree-channel.vitest.ts` | Fan-effect divisor behavior in `boostScore()` and co-activation boost interactions |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 adjacent scoring-path coverage (learned-feedback weighting surface) |

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: Co-activation fan-effect divisor
- Current reality source: feature_catalog.md
