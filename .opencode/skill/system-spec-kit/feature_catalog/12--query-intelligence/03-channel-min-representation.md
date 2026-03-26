---
title: "Channel min-representation"
description: "Channel min-representation ensures every retrieval channel with results has at least one entry in the top-k window after fusion."
---

# Channel min-representation

## 1. OVERVIEW

Channel min-representation ensures every retrieval channel with results has at least one entry in the top-k window after fusion.

Imagine you ask a librarian for book recommendations and they only check one shelf, ignoring everything else in the library. This feature makes sure that every search method that found something useful gets at least one result in the final answer. That way you see a diverse set of results instead of one dominant source drowning out everything else.

---

## 2. CURRENT REALITY

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.

The architecture is two-layered: `channel-representation.ts` performs the core analysis and appends promoted items to the result list without re-sorting. The pipeline-level wrapper `channel-enforcement.ts` calls the core function and then globally re-sorts the combined list (window + tail + promotions) by score descending so ranking integrity is preserved. This separation keeps the core function pure (append-only, no sort side-effect) while the wrapper guarantees callers always receive a score-ordered list. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag (default: enabled / graduated).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/channel-representation.ts` | Lib | Core analysis: detects under-represented channels, appends promoted items (no re-sort) |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Pipeline wrapper: delegates to core, re-sorts globally by score, returns enforcement metadata |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/channel-representation.vitest.ts` | Core analysis: promotion logic, quality floor, multi-source counting (18 tests) |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Wrapper: score ordering after promotion, precision verification, edge cases (20 tests) |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Channel min-representation
- Current reality source: FEATURE_CATALOG.md
