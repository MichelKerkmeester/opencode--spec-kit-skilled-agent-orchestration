---
title: "Usage-weighted ranking signal"
description: "Tracks access counts per memory and computes a log-scale ranking boost (0-0.10) that rewards frequently accessed memories without letting popularity dominate relevance, gated by the SPECKIT_USAGE_RANKING flag."
---

# Usage-weighted ranking signal

## 1. OVERVIEW

Tracks access counts per memory and computes a log-scale ranking boost (0-0.10) that rewards frequently accessed memories without letting popularity dominate relevance. Memories that are retrieved and used more often receive a small ranking advantage, reflecting the signal that repeated access indicates ongoing value.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_USAGE_RANKING=false` to disable.

The usage tracking module records access counts each time a memory is returned in search results. The ranking signal module computes a log-scale boost from the access count, capped at 0.10 to prevent heavily accessed memories from overwhelming relevance-based scoring. The logarithmic scale ensures diminishing returns — the boost grows quickly for the first few accesses and flattens for very popular memories.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/usage-tracking.ts` | Lib | Access count recording and retrieval |
| `mcp_server/lib/graph/usage-ranking-signal.ts` | Lib | Log-scale boost computation (0-0.10 range) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/usage-weighted-ranking.vitest.ts` | Usage tracking, log-scale boost computation, and cap enforcement |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Usage-weighted ranking signal
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_USAGE_RANKING=false
