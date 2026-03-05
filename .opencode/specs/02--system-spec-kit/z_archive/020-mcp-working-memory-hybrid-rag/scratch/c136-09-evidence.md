# C136-09 Evidence: Artifact-Class Routing Table

**Date:** 2026-02-19
**Status:** COMPLETE

## Files Created

1. `mcp_server/lib/search/artifact-routing.ts` — Artifact-class routing module
2. `mcp_server/tests/artifact-routing.vitest.ts` — 35 tests covering all requirements

## Implementation Summary

- **ArtifactClass type**: 9 classes — `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `research`, `unknown`
- **RetrievalStrategy interface**: `artifactClass`, `semanticWeight(0-1)`, `keywordWeight(0-1)`, `recencyBias(0-1)`, `maxResults`, `boostFactor(0-2)`
- **ROUTING_TABLE**: Complete `Record<ArtifactClass, RetrievalStrategy>` with spec values matching spec exactly
- **Functions**: `classifyArtifact(filePath)`, `getStrategy(class)`, `getStrategyForQuery(query, specFolder?)`, `applyRoutingWeights(results, strategy)`
- All strategies have `semanticWeight + keywordWeight = 1.0` (verified by test)
- Boost factor clamped to [0, 2] range
- Deterministic: same inputs always produce same outputs (verified by test)

## Test Results

```
tests/artifact-routing.vitest.ts (35 tests) — PASS (5ms)

Full suite: 137 files passed, 4376 tests passed, 72 skipped
Pre-existing failure: adaptive-fusion.vitest.ts T12 (unrelated)
```

## TypeScript Check

```
npx tsc --noEmit -p mcp_server/tsconfig.json
No errors in artifact-routing.ts (pre-existing error in adaptive-fusion.ts only)
```
