# EX-003: Fast recall path

## Preconditions
- MCP server running with default flags
- No prior session state for sessionId "ex003"

## Commands Executed

1. `memory_match_triggers({ prompt:"resume previous session blockers", session_id:"ex003", include_cognitive:true })`

## Raw Output Summary

- matchType: "trigger-phrase-cognitive"
- count: 2 (budget-truncated from 3)
- Results:
  1. memoryId 760: gate-enforcement.md (constitutional), matched phrase "resume", importanceWeight=1, tier=HOT, attentionScore=1
  2. memoryId 25169: resume-happy/spec.md, matched phrase "resume", importanceWeight=0.8, tier=HOT, attentionScore=1

### Cognitive Fields Present
- enabled: true
- sessionId: "ex003"
- turnNumber: 1
- decayApplied: 0
- memoriesActivated: 6
- coActivations: 0
- tierDistribution: HOT=6, WARM=0, COLD=0, DORMANT=0, ARCHIVED=0, total=6
- tokenMetrics: actualTokens=772, hotTokens=772, warmTokens=0, hotCount=3, warmCount=0, coldExcluded=3

## Signal Checklist
- [x] Triggers returned with matched phrases
- [x] Cognitive fields present (attentionScore, tier, tierDistribution, tokenMetrics)
- [x] Session tracking functional (sessionId="ex003", turnNumber=1)
- [x] Attention decay mechanism present (decayApplied=0 for first turn)
- [x] Co-activation tracking present (coActivations=0)

## Verdict: **PASS**
Trigger matching with cognitive features returned expected fields including attention scores, tier distribution, token metrics, and decay tracking. All cognitive contract fields are present.
