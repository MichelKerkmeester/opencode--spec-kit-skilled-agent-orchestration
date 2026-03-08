---
title: "Cache Scoring Re-exports"
description: "Barrel re-export of composite scoring functions from the canonical lib/scoring module into the cache namespace."
trigger_phrases:
  - "cache scoring"
  - "composite scoring re-export"
  - "scoring barrel"
---


# Cache Scoring Re-exports

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. STRUCTURE](#2-structure)
- [3. RELATED DOCUMENTS](#3-related-documents)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/cache/scoring/` re-exports the composite scoring module from `lib/scoring/composite-scoring.ts` into the cache layer namespace. It does not contain original logic. All scoring functions, types, constants and weight configurations originate in the canonical `lib/scoring/` directory.

The re-export provides a shorter import path for cache-layer consumers that need access to:

- Five-factor and legacy six-factor composite scoring functions
- FSRS retrievability calculations
- Importance multipliers, document-type multipliers and pattern alignment bonuses
- Score normalization and batch scoring helpers

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File                   | Description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `composite-scoring.ts` | Re-exports all values and types from `../../scoring/composite-scoring` via `export *` statements. |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:related-documents -->
## 3. RELATED DOCUMENTS

- `../../scoring/composite-scoring.ts` -- canonical source of all scoring logic
- `../../scoring/folder-scoring.ts` -- recency decay used by composite scoring
- `../../scoring/importance-tiers.ts` -- tier configuration consumed by importance scoring
- `../../scoring/interference-scoring.ts` -- TM-01 interference penalty applied during post-processing
- `../cognitive/fsrs-scheduler.ts` -- FSRS v4 retrievability formula

<!-- /ANCHOR:related-documents -->
