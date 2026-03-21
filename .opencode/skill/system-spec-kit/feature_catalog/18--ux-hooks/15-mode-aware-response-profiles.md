---
title: "Mode-aware response profiles"
description: "Mode-aware response profiles route search and context results through one of four named presentation profiles (quick, research, resume, debug), each optimizing for a different consumer, gated by the SPECKIT_RESPONSE_PROFILE_V1 flag."
---

# Mode-aware response profiles

## 1. OVERVIEW

Mode-aware response profiles route search and context results through one of four named presentation profiles (quick, research, resume, debug), each optimizing for a different consumer, gated by the `SPECKIT_RESPONSE_PROFILE_V1` flag.

Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. This feature lets the caller pick a profile and get results formatted accordingly, saving tokens and reducing cognitive load. When the flag is off, the original full response is returned unchanged.

---

## 2. CURRENT REALITY

Four profiles are implemented:
- **quick**: `topResult + oneLineWhy + omittedCount + tokenReduction` — minimal response for fast decision-making. Computes token savings percentage between original and returned payload.
- **research**: `results[] + evidenceDigest + followUps[]` — full result list with synthesis (context types, average score, importance tiers) and up to 3 suggested next queries.
- **resume**: `state + nextSteps + blockers + topResult` — structured continuation shape for session recovery. Extracts next steps from anchor metadata and why signals.
- **debug**: `full trace + tokenStats` — complete raw response with result count and average tokens per result.

The formatter uses `estimateTokens()` from `formatters/token-metrics.ts` for token accounting. Score resolution supports both `score` and `similarity` fields with normalization. Evidence digest and follow-ups are contextually generated based on matched anchors, score thresholds, and spec folder patterns.

Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default OFF, set `SPECKIT_RESPONSE_PROFILE_V1=true` to enable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/response/profile-formatters.ts` | Lib | Profile routing, quick/research/resume/debug formatters, token estimation |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token estimation utility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-flags.vitest.ts` | Flag behavior for response profiles |

---

## 4. SOURCE METADATA

- Group: UX hooks
- Source feature title: Mode-aware response profiles
- Current reality source: mcp_server/lib/response/profile-formatters.ts module header and implementation
