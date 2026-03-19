# EX-005: Stage invariant verification

## Preconditions
- MCP server running with default flags
- Pipeline V2 enabled (always true)

## Commands Executed

1. `memory_search({ query:"Stage4Invariant score snapshot verifyScoreInvariant", intent:"understand", includeTrace:true, limit:10 })`

## Raw Output Summary

- searchType: hybrid
- Results: 6 (truncated to 1 for token budget)
- Top result: memoryId 22809, fusion=15.34, rerank=0.5
- Channels: r12-embedding-expansion + bm25
- Cross-encoder reranking applied (provider: "cross-encoder")
- Stage1: 3360ms, 6 candidates | Stage3: 796ms rerank
- Intent: understand (explicit, confidence=1)

### Score Mutation Analysis (adaptiveShadow)
| memoryId | prodScore | shadowScore | prodRank | shadowRank | scoreDelta |
|----------|-----------|-------------|----------|------------|------------|
| 22809 | 0.500 | 0.500 | 1 | 1 | 0 |
| 22807 | 0.417 | 0.417 | 2 | 2 | 0 |
| 25189 | 0.333 | 0.333 | 3 | 3 | 0 |
| 266 | 0.250 | 0.250 | 4 | 4 | 0 |
| 22950 | 0.167 | 0.167 | 5 | 5 | 0 |
| 264 | 0.083 | 0.083 | 6 | 6 | 0 |

- promotedIds: [] (empty)
- demotedIds: [] (empty)
- ALL scoreDelta = 0

### Graph Contribution
- appliedBonus: 0, capApplied: false, rolloutState: bounded_runtime

## Signal Checklist
- [x] No score-mutation symptoms (all scoreDelta = 0)
- [x] Production and shadow scores identical for all results
- [x] No promoted or demoted IDs
- [x] Stage 4 invariant holds — scores are stable between production and shadow paths

## Verdict: **PASS**
Zero score mutation detected across all 6 results. Production and shadow scoring paths produce identical scores and rankings. The Stage 4 invariant holds.
