---
title: "Scoring: Retrieval Ranking"
description: "Composite ranking, tier weighting, feedback scoring and folder ranking for indexed spec-doc records."
trigger_phrases:
  - "scoring algorithms"
  - "importance tiers"
  - "folder scoring"
---

# Scoring: Retrieval Ranking

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scoring/` owns retrieval ranking helpers for memory search, folder ranking and validation feedback. It turns raw retrieval signals into bounded scores that callers can sort, explain and compare.

Current state:

- Composite scoring combines similarity, age, access, tier, feedback and pattern signals.
- Tier helpers keep constitutional, critical, important, normal, temporary and deprecated behavior consistent.
- Folder scoring is re-exported from `@spec-kit/shared/scoring/folder-scoring` for one shared implementation.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         SCORING                                  │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌───────────────────┐
│ Search callers │ ───▶ │ composite-scoring  │ ───▶ │ Ranked results    │
└───────┬────────┘      └─────────┬──────────┘      └───────────────────┘
        │                         │
        │                         ▼
        │               ┌────────────────────┐
        ├─────────────▶ │ importance-tiers   │
        │               └────────────────────┘
        │
        │               ┌────────────────────┐
        ├─────────────▶ │ confidence-tracker │
        │               └────────────────────┘
        │
        │               ┌────────────────────┐
        └─────────────▶ │ folder-scoring     │
                        └────────────────────┘

Dependency direction: callers ───▶ scoring helpers ───▶ shared scoring or local math
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
scoring/
+-- composite-scoring.ts     # Composite score assembly and score normalization
+-- confidence-tracker.ts    # Validation feedback and promotion checks
+-- folder-scoring.ts        # Shared folder-ranking re-export
+-- importance-tiers.ts      # Tier configuration and SQL helpers
+-- interference-scoring.ts  # Redundant-result penalty helpers
+-- mpab-aggregation.ts      # Chunk-to-memory score aggregation
+-- negative-feedback.ts     # Negative validation multiplier and recovery
`-- README.md                # Local developer orientation

Allowed direction:
callers → scoring/*.ts
scoring/*.ts → @spec-kit/shared/*
scoring/*.ts → local data rows and pure score helpers

Disallowed direction:
scoring/*.ts → MCP tool handlers
scoring/*.ts → generated dist files
scoring/*.ts → direct CLI process control
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
scoring/
├── composite-scoring.ts
├── confidence-tracker.ts
├── folder-scoring.ts
├── importance-tiers.ts
├── interference-scoring.ts
├── mpab-aggregation.ts
├── negative-feedback.ts
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Role |
|---|---|
| `composite-scoring.ts` | Builds the main score from similarity, retrievability, popularity, recency, tier boosts, interference and negative feedback. |
| `importance-tiers.ts` | Defines tier values, boost factors, decay behavior, search visibility and SQL helper output. |
| `folder-scoring.ts` | Re-exports shared folder ranking so MCP code and shared package code use the same score rules. |
| `confidence-tracker.ts` | Records validation feedback and checks whether a memory record can move to a higher tier. |
| `interference-scoring.ts` | Penalizes redundant spec-doc records in the same folder so near-duplicates rank lower. |
| `mpab-aggregation.ts` | Aggregates chunk-level retrieval scores back to parent memory records after fusion. |
| `negative-feedback.ts` | Applies negative feedback with time-based recovery to reduce repeated low-value results. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

Boundaries:

- Own score formulas, tier constants, feedback multipliers and folder rank helpers.
- Do not own retrieval, embedding generation, database schema changes or response formatting.
- Keep scoring functions deterministic unless a function explicitly records validation feedback.
- Treat `dist/lib/scoring/` as build output, not source.

Main flow:

```text
╭──────────────────────────────────────────╮
│ Retrieval rows from search or memory DB  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Apply tier and document metadata signals │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Add feedback and interference signals    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Normalize or aggregate score             │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Caller sorts or explains ranked results  │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | File | Used For |
|---|---|---|
| `calculateFiveFactorScore` | `composite-scoring.ts` | Main composite score calculation for memory rows. |
| `getFiveFactorBreakdown` | `composite-scoring.ts` | Debug output that explains score components. |
| `getTierConfig` | `importance-tiers.ts` | Tier metadata lookup. |
| `applyTierBoost` | `importance-tiers.ts` | Score adjustment based on importance tier. |
| `computeFolderScores` | `folder-scoring.ts` | Spec folder ranking for resume and discovery surfaces. |
| `recordValidation` | `confidence-tracker.ts` | Persist positive or negative user validation. |
| `aggregateChunkScores` | `mpab-aggregation.ts` | Collapse chunk scores into memory-level results. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
pnpm --dir .opencode/skill/system-spec-kit typecheck
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

| Resource | Relationship |
|---|---|
| [../search/README.md](../search/README.md) | Search callers that consume ranked records. |
| [../storage/README.md](../storage/README.md) | Memory rows, feedback columns and persistence helpers. |
| [../cognitive/README.md](../cognitive/README.md) | Decay and attention concepts used by scoring. |
| [../README.md](../README.md) | Parent library map. |

<!-- /ANCHOR:related -->
