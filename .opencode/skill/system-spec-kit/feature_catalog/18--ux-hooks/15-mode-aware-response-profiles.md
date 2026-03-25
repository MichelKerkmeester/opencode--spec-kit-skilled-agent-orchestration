---
title: "Mode-aware response profiles"
description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
---

# Mode-aware response profiles

## 1. OVERVIEW

Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.

Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.

---

## 2. CURRENT REALITY

Four profiles are implemented in the formatter layer:
- **quick**: `topResult + oneLineWhy + omittedCount + tokenReduction` — minimal response for fast decision-making. Computes token savings percentage between original and returned payload.
- **research**: `results[] + evidenceDigest + followUps[]` — full result list with synthesis (context types, average score, importance tiers) and up to 3 suggested next queries.
- **resume**: `state + nextSteps + blockers + topResult` — structured continuation shape for session recovery. Extracts next steps from anchor metadata and why signals.
- **debug**: `full trace + tokenStats` — complete raw response with result count and average tokens per result.

The formatter uses `estimateTokens()` from `formatters/token-metrics.ts` for token accounting. Score resolution supports both `score` and `similarity` fields with normalization. Evidence digest and follow-ups are contextually generated based on matched anchors, score thresholds, and spec folder patterns.

Runtime wiring is partial: `memory_search` applies the formatter, `memory_context` now accepts the same `profile` parameter at the schema level, but `memory_context` still declares `profile?: string` without using it. In practice, the context-side profile path remains dead code until the handler consumes it.

Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON (graduated), controlled by `SPECKIT_RESPONSE_PROFILE_V1`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/response/profile-formatters.ts` | Lib | Profile routing, quick/research/resume/debug formatters, token estimation |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token estimation utility |
| `mcp_server/handlers/memory-search.ts` | Handler | Applies response profiles on live search responses |
| `mcp_server/handlers/memory-context.ts` | Handler | Declares `profile?: string` but does not consume it |
| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-flags.vitest.ts` | Flag behavior for response profiles |

---

## 4. SOURCE METADATA

- Group: UX hooks
- Source feature title: Mode-aware response profiles
- Current reality source: `mcp_server/lib/response/profile-formatters.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, and `mcp_server/tool-schemas.ts`
