# Interference scoring

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Interference scoring.

## 2. CURRENT REALITY

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty in composite scoring. (Novelty boost remains disabled in the hot path.)

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Interference scoring
- Current reality source: feature_catalog.md
