---
title: "Mode-aware response profiles"
description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, and `memory_context` now auto-routes an inferred profile when no explicit profile is supplied."
---

# Mode-aware response profiles

## 1. OVERVIEW

Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring now spans both search and context: `memory_search` applies them, and `memory_context` auto-routes an inferred profile when no explicit profile is supplied. Quick mode still bypasses profile shaping because its trigger path does not consume formatted envelopes.

Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, and the live integration now reaches both handlers: `memory_search` can apply response profiles, while `memory_context` auto-routes an inferred profile when no explicit profile is supplied. When the flag is off, the original full response is returned unchanged.

---

## 2. CURRENT REALITY

Four profiles are implemented in the formatter layer:
- **quick**: `topResult + oneLineWhy + omittedCount + tokenReduction` — minimal response for fast decision-making. Computes token savings percentage between original and returned payload.
- **research**: `results[] + evidenceDigest + followUps[]` — full result list with synthesis (context types, average score, importance tiers) and up to 3 suggested next queries.
- **resume**: `state + nextSteps + blockers + topResult` — structured continuation shape for session recovery. Extracts next steps from anchor metadata and why signals.
- **debug**: `full trace + tokenStats` — complete raw response with result count and average tokens per result.

The formatter uses `estimateTokens()` from `formatters/token-metrics.ts` for token accounting. Score resolution supports both `score` and `similarity` fields with normalization. Evidence digest and follow-ups are contextually generated based on matched anchors, score thresholds, and spec folder patterns.

Runtime wiring is now live on both handlers: `memory_search` applies the formatter, and `memory_context` auto-routes an inferred profile when no explicit profile is supplied while still honoring explicit profile precedence. In practice, the context-side profile path is no longer dead code.

Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON (graduated), controlled by `SPECKIT_RESPONSE_PROFILE_V1`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/response/profile-formatters.ts` | Lib | Profile routing, quick/research/resume/debug formatters, token estimation |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token estimation utility |
| `mcp_server/handlers/memory-search.ts` | Handler | Applies response profiles on live search responses |
| `mcp_server/handlers/memory-context.ts` | Handler | Auto-routes an inferred profile when no explicit profile is supplied |
| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-flags.vitest.ts` | Flag behavior for response profiles |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/15-mode-aware-response-profiles.md`
