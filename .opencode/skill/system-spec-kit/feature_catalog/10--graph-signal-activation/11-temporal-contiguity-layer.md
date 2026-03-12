# Temporal contiguity layer

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Temporal contiguity layer.

## 2. CURRENT REALITY

The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given an in-memory set of search results, it applies pairwise temporal boosts inside a clamped window (`1..86400` seconds, default 3600). Each pair contributes a distance-weighted boost using factor `0.15`, with a cumulative cap of `0.50` per result.

The module also provides `getTemporalNeighbors()` for direct temporal neighborhood lookups and `buildTimeline()` for chronological timeline construction. This captures the cognitive principle that memories formed close together in time are often contextually related, the temporal contiguity effect from memory psychology.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/temporal-contiguity.vitest.ts` | Temporal contiguity tests |

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Temporal contiguity layer
- Current reality source: audit-D04 gap backfill
