# Temporal contiguity layer

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Temporal contiguity layer.

## 2. CURRENT REALITY

The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given a set of search results, it queries for temporally adjacent memories within a configurable window (default 1 hour, max 24 hours) and applies a boost factor of 0.15 per temporally proximate neighbor, capped at a cumulative maximum of 0.50 per result.

The module also provides `queryTemporalNeighbors()` for direct temporal neighborhood lookups and `buildSpecFolderTimeline()` for constructing chronological timelines within a spec folder. This captures the cognitive principle that memories formed close together in time are often contextually related — the temporal contiguity effect from memory psychology.

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
