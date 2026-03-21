# Iteration 003 — C2 Type Analyst: Shallow Copy Hazard Analysis

## Shared Reference Matrix

| Property | Shared? | Mutated? | Risk |
|---|---|---|---|
| FILES array + file objects | Yes | **Yes** (DESCRIPTION, _provenance) | **HIGH** |
| observations array + objects | Yes | No | None |
| _manualTriggerPhrases | Yes initially | No (replaced via spread) | None |
| _manualDecisions | Yes initially | No (replaced via spread) | None |
| recentContext | Yes | No | None |
| session object | Yes | No | None |
| git object | Yes | No (only read) | None |
| preflight/postflight | Yes | No | None |

## Confirmation
The ONLY mutation risk in `enrichFileSourceData()` is existing `FILES[i]` objects. All other shared references are either not mutated or replaced with new arrays/values.

## enrichStatelessData() Comparison
Also starts with shallow copy (workflow.ts:1244), but its operations are safer — observations, FILES, trigger phrases, decisions, recentContext are all rebuilt with spread operators, not mutated in place.

## Fix Recommendation
Minimal fix — deep-clone FILES before mutation:
```typescript
const enriched: CollectedDataFull = {
  ...collectedData,
  FILES: collectedData.FILES?.map(f => ({ ...f }))
};
```
This isolates file objects from the original payload. No other nested properties need cloning.
