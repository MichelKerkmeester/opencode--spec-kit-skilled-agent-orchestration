# C136-12 Evidence: Telemetry Expansion (Latency/Mode/Fallback/Quality-Proxy)

## Status: COMPLETE

## Files Created
- `mcp_server/lib/telemetry/retrieval-telemetry.ts` — RetrievalTelemetry interface + recording functions + quality proxy computation
- `mcp_server/tests/retrieval-telemetry.vitest.ts` — 22 tests covering defaults, latency accumulation, mode capture, fallback flags, quality proxy 0-1 range, JSON serialization, edge cases

## Files Modified
- `mcp_server/handlers/memory-search.ts` — Import + telemetry recording in postSearchPipeline (latency from trace entries, mode, quality proxy with boost delta)
- `mcp_server/handlers/memory-context.ts` — Import + telemetry recording at L1 orchestration level (mode selection, pressure override, fallback detection)

## Verification
- **Unit tests**: 22/22 passed (`tests/retrieval-telemetry.vitest.ts`)
- **Full suite**: 138 test files passed, 4377 tests passed, 72 skipped (no regressions)
- **TypeScript**: No new type errors (pre-existing TS6307 in adaptive-fusion.ts unrelated)
- **Feature flag**: `SPECKIT_EXTENDED_TELEMETRY` defaults true; `'false'` or `'0'` disables all recording

## Telemetry Dimensions
| Dimension | Fields | Integration Point |
|-----------|--------|-------------------|
| Latency | totalLatencyMs, candidateLatencyMs, fusionLatencyMs, rerankLatencyMs, boostLatencyMs | postSearchPipeline (memory-search) |
| Mode | selectedMode, modeOverrideApplied, pressureLevel, tokenUsageRatio | memory-context L1 handler |
| Fallback | fallbackTriggered, fallbackReason, degradedModeActive | memory-context (pressure override) |
| Quality | resultCount, avgRelevanceScore, topResultScore, boostImpactDelta, extractionCountInSession, qualityProxyScore | postSearchPipeline (memory-search) |

## Quality Proxy Formula
`avgRelevance(40%) + topResult(25%) + resultCountSaturation(20%) + latencyPenalty(15%)` clamped to [0,1]
