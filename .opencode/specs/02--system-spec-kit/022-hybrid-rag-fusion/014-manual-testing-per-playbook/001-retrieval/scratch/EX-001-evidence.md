# EX-001: Intent-aware context pull

## Preconditions
- MCP server running with default flags
- No prior session state for sessionId "ex001"

## Commands Executed

1. `memory_match_triggers({ prompt:"fix flaky index scan retry logic", sessionId:"ex001", include_cognitive:true })`
2. `memory_context({ input:"fix flaky index scan retry logic", mode:"auto", sessionId:"ex001" })`
3. `memory_context({ input:"fix flaky index scan retry logic", mode:"focused", sessionId:"ex001" })`

## Raw Output Summary

### Step 1: memory_match_triggers
- matchType: "trigger-phrase-cognitive"
- count: 1 (budget-truncated from 3)
- Matched phrase: "fix" (constitutional gate-enforcement)
- Cognitive fields present: enabled=true, sessionId="ex001", turnNumber=1, decayApplied=0, memoriesActivated=6, coActivations=0
- Tier distribution: HOT=6, WARM=0, COLD=0
- Token metrics: actualTokens=3967, hotTokens=3967, hotCount=3, coldExcluded=3

### Step 2: memory_context (auto mode)
- Strategy: focused (auto-detected)
- Intent: find_decision (confidence 0.15)
- Pipeline: 4-stage (candidate→fusion→rerank→final-rank→filter)
- Stage1: hybrid, 2 channels, 0 candidates (synthetic prompt), 1121ms
- Stage2: graphSignalsApplied=true, rolloutState=bounded_runtime
- Stage4: evidenceGapDetected=true (expected for synthetic prompt)
- retrievalTrace present with traceId, sessionId, stages

### Step 3: memory_context (focused mode)
- Strategy: focused (explicitly requested)
- Intent: null (not auto-detected in explicit mode)
- Pipeline: same 4-stage structure
- Stage1: hybrid, 2 channels, 0 candidates, 41ms
- Same pipeline metadata structure as auto mode
- retrievalTrace present with different traceId

## Signal Checklist
- [x] memory_match_triggers returned triggers with cognitive fields
- [x] memory_context auto mode returned context (evidence gap expected for synthetic prompt)
- [x] memory_context focused mode returned context
- [x] Both memory_context calls executed full 4-stage pipeline
- [x] Session lifecycle tracked correctly (sessionId="ex001")

## Verdict: **PASS**
Both auto and focused memory_context calls executed the full pipeline. Cognitive features returned in trigger matching. Evidence gap is expected behavior for a synthetic prompt with no matching memory content.
