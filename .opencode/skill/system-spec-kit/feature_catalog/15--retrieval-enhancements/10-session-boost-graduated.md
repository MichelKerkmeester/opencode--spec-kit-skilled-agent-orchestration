---
title: "Session attention boost (graduated default-ON)"
description: "Session attention boost re-ranks search results by amplifying memories the user recently interacted with during the current session, gated by SPECKIT_SESSION_BOOST (default true, graduated)."
---

# Session attention boost (graduated default-ON)

## 1. OVERVIEW

Session attention boost re-ranks search results by amplifying memories the user recently interacted with during the current session. When enabled, working_memory attention scores lift recently-accessed results so that ongoing conversational context naturally floats to the top of search results.

The feature graduated to default-ON status as part of the 006-default-on-boost-rollout phase. It shares a combined ceiling of 0.20 with causal boost to prevent runaway score inflation.

---

## 2. CURRENT REALITY

Session boost runs in Stage 2 fusion after RRF merging. It reads `working_memory` attention records for the active session, then applies a multiplier of 0.15 to each matching result's score. The combined session + causal boost is capped at 0.20.

Feature flag: `SPECKIT_SESSION_BOOST` (default `true`). Set to `false` to disable.

Status: **Graduated** — default ON, kill-switch available via env var.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/session-boost.ts` | Lib | Session attention score application |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isSessionBoostEnabled()` flag check |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion invoking session boost |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 fusion integration tests |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Session attention boost
- Graduated via: 006-default-on-boost-rollout
- Kill switch: `SPECKIT_SESSION_BOOST=false`
