---
title: "Scoring"
description: "Folder-level relevance scoring helpers for ranking spec folders from memory metadata."
trigger_phrases:
  - "folder scoring"
  - "composite relevance score"
  - "memory folder ranking"
  - "recency scoring"
---

# Scoring

> Shared scoring helpers for ranking spec folders from memory metadata. The package computes recency, importance, activity and validation signals without owning retrieval or resume workflows.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. STABLE API](#3--stable-api)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The scoring package computes composite relevance scores for spec folders. It is used by memory statistics and ranking surfaces that need a deterministic way to compare folders from memory records.

The main formula combines recency, importance, activity and validation, then applies a multiplier for archive, scratch, test and prototype paths so active spec work ranks above fallback evidence.

```text
score = (recency * 0.40 + importance * 0.30 + activity * 0.20 + validation * 0.10) * archiveMultiplier
```

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
scoring/
├── README.md
└── folder-scoring.ts
```

| File | Purpose |
| ---- | ------- |
| `folder-scoring.ts` | Folder scoring constants, archive detection and score calculators |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:stable-api -->
## 3. STABLE API

| Export | Kind | Purpose |
| ------ | ---- | ------- |
| `computeFolderScores` | Function | Score and sort folders from memory input records |
| `computeSingleFolderScore` | Function | Score one folder from its related memories |
| `computeRecencyScore` | Function | Compute inverse time decay with constitutional-tier exemption |
| `isArchived` | Function | Check whether a folder matches deprioritized path patterns |
| `getArchiveMultiplier` | Function | Return the scoring multiplier for a folder path |
| `simplifyFolderPath` | Function | Produce display-friendly folder labels |
| `findTopTier` | Function | Find the highest importance tier in a memory set |
| `findLastActivity` | Function | Find the newest timestamp in a memory set |
| `ARCHIVE_PATTERNS` | Constant | Public archive pattern list for callers that need matching context |
| `TIER_WEIGHTS` | Constant | Importance tier weights aligned with shared tier semantics |
| `SCORE_WEIGHTS` | Constant | Composite score weights that sum to `1.0` |
| `FolderMemoryInput` | Type | Loose input type for camelCase, snake_case and enriched memory records |

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

Import direction should flow from ranking consumers into `shared/scoring`:

- Memory stats, resume ranking and search support code may import scoring helpers.
- Scoring imports shared types from `../types.ts` only.
- Scoring should not import database adapters, MCP endpoints, memory search implementations or spec workflow code.
- Keep new ranking math in `folder-scoring.ts` unless a second independent scoring domain appears.

This package returns scores and metadata. Callers decide how to display, filter or combine those results with retrieval evidence.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run scoring tests or TypeScript checks after behavior changes:

```bash
npm test -- --runInBand folder-scoring
npx tsc --noEmit
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/scoring/README.md
```

For README-only edits, `validate_document.py` is the required file-level check.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [shared/README.md](../README.md) | Parent shared library overview |
| [shared/types.ts](../types.ts) | `ArchivePattern`, `FolderScore`, `Memory`, `ScoreWeights` and `TierWeights` |
| [shared/algorithms/README.md](../algorithms/README.md) | Retrieval ranking algorithms separate from folder scoring |

<!-- /ANCHOR:related -->

---
