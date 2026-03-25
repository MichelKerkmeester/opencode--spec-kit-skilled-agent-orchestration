● skill(sk-code--review)

Checking the two previously flagged P1s directly in code and spec state now. I’m reading the relevant source/spec lines and comparing them against a fresh live directory count.

● Read collect-session-data.js
  │ .opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js
  └ L260:290 (31 lines read)

● Search (grep)
  │ "(397|398|directories|dirs)" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md)
  └ 9 lines found

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:120 (98 lines read)

● Count hybrid-rag-fusion directories (shell)
  │ find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion -type d | wc -l
  └ 2 lines...

● skill(sk-code--opencode)

# Iteration 004: P1 Verification

## Agent: copilot / gpt-5.4 / high

## Dimension: correctness + traceability

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md`

## P1-001 (T79) Status
- Current code at `collect-session-data.js:270-283`:
```js
// Fix 2: Also check observations for "Next Steps" title (normalizer may consume the field)
const hasNextSteps = !!collectedData.nextSteps
    || observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''));
const isFileSource = collectedData._source === 'file';
// Correctness: unresolved nextSteps prevent completion claim
const hasUnresolvedNextSteps = (Array.isArray(collectedData.nextSteps) &&
    collectedData.nextSteps.length > 0) ||
    observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''));
if (isFileSource && hasSessionSummary && (hasKeyDecisions || hasNextSteps)) {
    if (hasUnresolvedNextSteps) {
        return 'IN_PROGRESS';
    }
    return 'COMPLETED';
}
```
- `hasNextSteps` logic: checks either `collectedData.nextSteps` or an observation whose title matches `Next Steps`.
- `hasUnresolvedNextSteps` logic: checks either a non-empty `collectedData.nextSteps` array or an observation whose title matches `Next Steps`.
- Verdict: **FIXED**

## P1-002 (T37) Status
- Claimed directory count in `spec.md`: **398**
- Live directory count: **399**
- Delta: **+1**
- Verdict: **STILL_OPEN**

## Summary
- P1-001: **FIXED**
- P1-002: **STILL_OPEN**
- Total P1 remaining: **1**


Total usage est:        1 Premium request
API time spent:         47s
Total session time:     56s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  191.3k in, 2.2k out, 138.0k cached (Est. 1 Premium request)
