# Temporal contiguity layer

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Describes the pairwise temporal proximity boost that amplifies scores for memories created close together in time, using a clamped window with a cumulative cap of 0.50 per result.

## 2. CURRENT REALITY
The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given an in-memory set of search results, it applies pairwise temporal boosts inside a clamped window (`1..86400` seconds, default 3600). Each pair contributes a distance-weighted boost using factor `0.15`, with a cumulative cap of `0.50` per result.

The module also provides `getTemporalNeighbors()` for direct temporal neighborhood lookups and `buildTimeline()` for chronological timeline construction. This captures the temporal contiguity effect from memory psychology: memories formed close together in time are often contextually related.

## 3. IN SIMPLE TERMS
Memories created around the same time are often about the same topic, like notes taken during the same meeting. This feature gives a search boost to results that were stored close together in time. If one memory from a Tuesday afternoon session is relevant, the others from that same session probably are too. The boost fades as the time gap between memories grows larger.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/temporal-contiguity.vitest.ts` | Temporal contiguity tests |

## 5. SOURCE METADATA
- Group: Graph signal activation
- Source feature title: Temporal contiguity layer
- Current reality source: audit-D04 gap backfill

