---
title: "Confidence-based result truncation"
description: "Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail."
---

# Confidence-based result truncation

## 1. OVERVIEW

Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail.

Search results often include a long tail of irrelevant items tacked onto the end. This feature detects the point where results stop being useful and cuts off the rest, like a reader who stops scrolling once the answers clearly run out. Without it, you would get padded results that waste your attention on things that do not actually match your question.

---

## 2. CURRENT REALITY

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled. NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Confidence-based result truncation
- Current reality source: FEATURE_CATALOG.md
