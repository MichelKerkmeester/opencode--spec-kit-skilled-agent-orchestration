# Review Iteration 05 — Silent Failures (Part 1)

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Error swallowing patterns, catch-and-return-empty, null-guard-return-empty  
**Files reviewed:** `hybrid-search.ts`, `stage1-candidate-gen.ts`, `sqlite-fts.ts`

---

## Summary

**52 total silent failure points** across 3 files:
- `hybrid-search.ts`: 27 points
- `stage1-candidate-gen.ts`: 23 points
- `sqlite-fts.ts`: 2 points

---

## P0 Findings (Critical)

### F05-1: P0 — R12 expansion can silently zero out Stage 1

- **File:** `stage1-candidate-gen.ts:804-830,809,819,851-859`
- **Severity:** P0 (critical)
- **Description:** `Promise.all([...]).catch(() => [])` converts both baseline and expanded branches into empty arrays. If both fail/empty, `r12ExpansionApplied = true` is still set, so the normal single-query hybrid fallback is skipped. This can leave `candidates = []` with only silent empty arrays as evidence.
- **Fix:** When R12 branches both return empty, fall through to the standard hybrid path instead of treating it as successful empty expansion.

### F05-2: P0 — Deep variant fan-out can end with all-empty branches

- **File:** `stage1-candidate-gen.ts:718-748,721-737`
- **Severity:** P0 (critical)
- **Description:** Each variant branch does `if (!variantEmbedding) return []`, and rejected branches convert to `[]`. If all branches empty out, the merge produces no candidates and there is no second check that falls back to the original single hybrid query.
- **Fix:** After deep variant merge, if candidates is empty, fall back to single-query hybrid path.

---

## P1 Findings (High)

### F05-3: P1 — Vector channel errors swallowed in enhanced hybrid

- **File:** `hybrid-search.ts:1055-1084`
- **Description:** Vector channel failure in enhanced path is logged and ignored. If upstream vector SQL throws (e.g., broken JOIN/input state), the channel disappears silently.

### F05-4: P1 — Legacy hybrid vector path also swallows failures

- **File:** `hybrid-search.ts:865-885`
- **Description:** Same masking behavior in the older fallback hybrid path.

### F05-5: P1 — FTS failures collapse to []

- **File:** `hybrid-search.ts:450,467-470` and `sqlite-fts.ts:99-102`
- **Description:** If FTS is unavailable or query throws, lexical channel becomes empty without hard failure.

### F05-6: P1 — BM25 has multiple fail-closed empty-array exits

- **File:** `hybrid-search.ts:349-352,368-370,376-379,395-398`
- **Description:** Scoped BM25 has several fail-closed empty-array exits that contribute to 0 results when other channels are degraded.

### F05-7: P1 — No local fallback for main embedding generation failure

- **File:** `stage1-candidate-gen.ts:608-613,901-905`
- **Description:** Not silent (throws), but if main query embedding cannot be generated, Stage 1 does not recover locally. Only branch-level expansions degrade silently.

---

## Exhaustive Inventory (27 + 23 + 2 = 52 points)

### hybrid-search.ts — 27 silent failure points

| Lines | Pattern | Could cause 0-results? | Sev |
|---|---|---|---|
| 330-331 | guard-return-empty (!isBm25Enabled) | Indirect | P2 |
| 349-352 | logged fail-closed (no DB for scoped BM25) | Scoped only | P1 |
| 357-359 | empty-id guard return-empty | Indirect | P2 |
| 368-370 | catch-and-return-empty (BM25 scope lookup) | Scoped only | P1 |
| 376-379 | logged fail-closed (specFolderMap null) | Scoped only | P1 |
| 395-398 | catch-and-return-empty (BM25 outer) | Yes | P1 |
| 414-416 | catch-and-return-false (isBm25Available) | Indirect | P2 |
| 434-436 | catch-and-return-false (isFtsAvailable) | Yes (disables FTS) | P1 |
| 450 | guard-return-empty (!db or !isFtsAvailable) | Yes | P1 |
| 467-470 | catch-and-return-empty (FTS outer) | Yes | P1 |
| 882-885 | catch-log-drop (vector) | Yes | P1 |
| 912-915 | catch-log-drop (graph) | Indirect | P2 |
| 1081-1084 | catch-log-drop (enhanced vector) | Yes | P1 |
| 1124-1126 | catch-log-drop (enhanced graph) | Indirect | P2 |
| 1168-1170 | catch-log-drop (degree) | No | P2 |
| 1269-1272 | catch-return-null | Indirect | P1 |
| 1327-1330 | catch-log-continue (MPAB) | No | P2 |
| 1366-1368 | catch-log-continue (enforcement) | No | P2 |
| 1460-1462 | catch-log-continue (MMR) | No | P2 |
| 1492-1494 | catch-log-continue (co-activation) | No | P2 |
| 1518-1520 | catch-continue (folder scoring) | No | P2 |
| 1546-1548 | catch-log-continue (truncation) | No | P2 |
| 1719-1720 | terminal return-empty | Manifestation | P2 |
| 1775-1776 | terminal return-empty | Manifestation | P2 |
| 1792 | guard-return-empty (!db) | Yes | P1 |
| 1843-1846 | catch-return-empty (structural) | Yes | P1 |
| 1947-1949 | catch-continue (desc-map) | No | P2 |

### stage1-candidate-gen.ts — 23 silent failure points

(Most dangerous: lines 721-737 deep variant, lines 809/819 R12 expansion)

### sqlite-fts.ts — 2 silent failure points

| Lines | Pattern | Could cause 0-results? | Sev |
|---|---|---|---|
| 56-61 | token-normalization guard -> return [] | Only for stripped queries | P2 |
| 99-102 | catch-return-empty (fts5Bm25Search) | Yes (kills FTS) | P1 |
