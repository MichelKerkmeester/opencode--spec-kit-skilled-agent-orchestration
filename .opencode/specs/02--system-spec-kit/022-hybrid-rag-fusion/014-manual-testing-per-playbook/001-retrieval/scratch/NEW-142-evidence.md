# 142: Session transition trace contract

## Preconditions
- MCP server running with default flags
- No prior session state for sessionId "markovian-142"

## Commands Executed

1. `memory_context({ input:"resume previous work on rollout hardening", mode:"resume", sessionId:"markovian-142", includeTrace:true })`
2. `memory_context({ input:"resume previous work on rollout hardening", mode:"resume", sessionId:"markovian-142", includeTrace:false })`

## Raw Output Summary

### Step 1: With includeTrace=true
- Strategy: resume
- Mode: resume
- resumeAnchors: ["state", "next-steps", "summary", "blockers"]
- sessionLifecycle: sessionScope="caller", requestedSessionId="markovian-142", effectiveSessionId="markovian-142", **resumed=false**, eventCounterStart=0, resumedContextCount=0
- retrievalTrace present: traceId="tr_mmxu5620_ua5a02", sessionId="markovian-142"
- Stages: candidate (r12-embedding-expansion with expansion terms), candidate (hybrid, 2 channels, 0 candidates)
- artifactRoutingApplied: true (detectedClass: "memory", confidence: 0.33)
- evidenceGapDetected: true (no matching memories for synthetic prompt)
- Token budget: 1200 (resume mode), truncated=true

### Step 2: Without includeTrace (false)
- Strategy: resume
- Mode: resume
- Same resumeAnchors: ["state", "next-steps", "summary", "blockers"]
- sessionLifecycle: **identical** — resumed=false, same sessionId
- retrievalTrace: STILL present in embedded content (traceId="tr_mmxu5q7e_39ay3g")
- Pipeline metadata: same structure, Stage1: 56ms (cached)
- artifactRoutingApplied: true (same detection)

### Trace/Non-Trace Comparison
- **Both responses contain `retrievalTrace`** in the pipeline metadata (embedded in content text)
- The `includeTrace` parameter controls per-result `trace` fields on individual search results, NOT the top-level pipeline trace
- `sessionTransition` fields (previousState, currentState, confidence, signalSources) are **absent in both calls** — this is expected because `sessionLifecycle.resumed=false` (fresh session, no prior state to transition from)
- The non-trace response does NOT expose transition data in top-level metadata (confirmed absent)

### Limitation
- Cannot verify `sessionTransition` fields because a fresh sessionId with no prior events produces no transition data. Testing this contract fully requires an established session with recorded prior events.

## Signal Checklist
- [x] Resume mode activated correctly with state/next-steps anchors
- [x] Session lifecycle tracked (sessionId, resumed flag)
- [x] Trace data present when includeTrace=true
- [x] Non-trace response does not expose sessionTransition in top-level metadata
- [ ] sessionTransition fields (previousState, currentState, confidence, signalSources) present in traced call — N/A for fresh session

## Verdict: **PARTIAL**
The trace/non-trace gating mechanism works at the pipeline level. The non-trace response correctly omits session transition data. However, the `sessionTransition` contract fields cannot be verified because a fresh session with no prior events produces no transition data to compare. The fundamental trace-only gating holds.
