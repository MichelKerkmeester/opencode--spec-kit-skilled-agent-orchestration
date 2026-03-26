---
title: "Folder-level relevance scoring"
description: "Describes the four-factor weighted formula (recency, importance, activity and validation) that scores spec folders for two-phase retrieval, with archive folder multipliers and damped aggregation via DocScore."
---

# Folder-level relevance scoring

## 1. OVERVIEW

Describes the four-factor weighted formula (recency, importance, activity and validation) that scores spec folders for two-phase retrieval, with archive folder multipliers and damped aggregation via DocScore.

Instead of searching through every memory equally, this feature first ranks the folders they live in. Recent, important and actively used folders rise to the top while archived folders sink to the bottom. The system then searches within the top folders first. It is like checking the most promising filing cabinets before digging through the dusty ones in the back.

---

## 2. CURRENT REALITY

A four-factor weighted formula scores each spec folder: `score = (recency * 0.40) + (importance * 0.30) + (activity * 0.20) + (validation * 0.10)`. Recency uses a decay function `1 / (1 + days * 0.10)` so a 7-day-old folder scores about 0.59 and a 10-day-old folder about 0.50. Importance averages the tier weights of all memories in the folder. Activity caps at 1.0 when a folder has 5 or more memories. Archive folders (`z_archive/`, `scratch/`, `test-`, `prototype/`) receive a 0.1-0.2 multiplier to keep them out of top results.

This scoring enables two-phase retrieval: first rank folders by aggregated score, then search within the top-ranked folders. The DocScore formula `(1/sqrt(M+1)) * SUM(score(m))` provides damped aggregation so large folders do not dominate by volume alone. Runs behind the `SPECKIT_FOLDER_SCORING` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/folder-relevance.vitest.ts` | Folder relevance scoring |
| `mcp_server/tests/folder-scoring.vitest.ts` | Folder scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Folder-level relevance scoring
- Current reality source: FEATURE_CATALOG.md
