# Review Iteration 1: Correctness - Data Flow Merge and Type Safety

## Focus
Correctness dimension: logic correctness of the `normalizeInputData` -> `runWorkflow` merge pattern, type safety of casts, edge case handling for `filesChanged`/`filesModified` mapping, and JSON quality floor arithmetic.

## Scope
- Review target: workflow.ts (merge point), input-normalizer.ts (normalization logic), quality-scorer.ts (JSON floor)
- Spec refs: Rec 1 (filesChanged mapping), Rec 6 (JSON quality floor)
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| scripts/core/workflow.ts | 7/10 | -- | -- | -- |
| scripts/utils/input-normalizer.ts | 7/10 | -- | -- | -- |
| scripts/core/quality-scorer.ts | 9/10 | -- | -- | -- |

## Findings

### P1-001: Unsafe union-type spread merge may produce CollectedDataFull with residual raw fields
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/workflow.ts:618-619]
- Impact: `normalizeInputData` returns `NormalizedData | RawInputData`. When the fast-path (input-normalizer.ts:470-536) triggers, the return is a cloned `RawInputData` cast to `NormalizedData`. The spread merge `{ ...preloadedData, ...normalized }` then casts the result to `CollectedDataFull`. Because the normalized object is a clone of the raw input with selective backfills, any fields NOT explicitly processed by the fast-path (e.g., `filesChanged`, `files_changed`, `technicalContext`) persist as raw input shapes rather than the canonical `CollectedDataFull` shapes. Downstream consumers that expect `CollectedDataFull` types (e.g., `collectSessionData`, contamination filter, quality scorer) receive an object whose runtime shape may not fully conform.
- Skeptic: The fast-path does handle the key fields (`userPrompts`, `recentContext`, `observations`, `FILES`, `filesModified`, `filesChanged`). Remaining fields like `technicalContext` are only processed on the slow-path (line 690-694). If the fast-path triggers (line 470 condition: data has `userPrompts`/`user_prompts`/`observations`/`recentContext`/`recent_context`), `technicalContext` normalization is skipped entirely. However, for preloaded data from JSON payloads, `technicalContext` is rarely present. The practical risk is low but the code path is fragile.
- Referee: Confirmed P1. The dual return type of `normalizeInputData` (`NormalizedData | RawInputData`) combined with the unsafe `as CollectedDataFull` cast creates a correctness gap. While the immediate production impact is mitigated by the fact that most JSON payloads trigger the fast-path and the key fields are covered, the pattern is brittle: any new field added to the slow-path normalizer but not the fast-path will silently pass through unnormalized when the fast-path triggers.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"normalizeInputData returns RawInputData on fast-path, and spread-merge with as-cast to CollectedDataFull produces an object where fields not handled by fast-path retain their raw shape.","evidenceRefs":["scripts/core/workflow.ts:618-619","scripts/utils/input-normalizer.ts:447","scripts/utils/input-normalizer.ts:470-536"],"counterevidenceSought":"Checked whether all CollectedDataFull fields are backfilled on the fast-path. technicalContext (line 690) and TECHNICAL_CONTEXT (line 693) are only on slow-path. Checked downstream consumers for technicalContext usage.","alternativeExplanation":"The fast-path is intentionally optimized for the common JSON-payload case where technicalContext is absent. If no technicalContext is passed, the raw shape equals the expected shape (undefined).","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"If technicalContext is never passed via the preloadedData path (only via file-based loading), then the gap is theoretical and could be downgraded to P2."}
```

### P2-001: filesChanged empty-array not explicitly mapped to FILES: [] on fast-path
- Dimension: correctness
- Evidence: [SOURCE: scripts/utils/input-normalizer.ts:519-536]
- Impact: When `filesChanged: []` (empty array) is passed and no `filesModified` is present, the fast-path condition at line 526 (`fcFast.length > 0`) skips processing. Unlike the `filesModified` empty-array case (line 513-516 explicitly sets `cloned.FILES = []`), the `filesChanged` empty-array case leaves `cloned.FILES` unchanged (possibly undefined or an empty array from prior logic). This is an asymmetry in behavior: `filesModified: []` definitively produces `FILES: []`, but `filesChanged: []` is silently ignored.
- Final severity: P2

### P2-002: Slow-path filesChanged mapping (line 641-664) lacks object-entry handling unlike filesModified
- Dimension: correctness
- Evidence: [SOURCE: scripts/utils/input-normalizer.ts:641-664 vs 595-638]
- Impact: The `filesModified` slow-path (line 595-638) handles both string entries and object entries (`{ path, changes_summary }`). The `filesChanged` slow-path (line 641-664) only handles string entries via regex splitting. If a caller passes `filesChanged` with object entries (e.g., `{ path: "foo.ts", changes_summary: "bar" }`), the mapping would call `.match()` on `[object Object]` producing incorrect results. The `RawInputData` type at line 78 declares `filesChanged` as `string[]`, so the type system prevents this at compile time, but `files_changed` (line 79) and the `as string[]` cast at line 524/646 could mask runtime object entries.
- Final severity: P2

### P2-003: Quality floor comment-to-code mismatch in JSON floor dimension thresholds
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/quality-scorer.ts:265-270]
- Impact: Comments describe threshold meanings in user-facing terms ("At least 4 trigger phrases", "At least 1 key topic"), but the actual checks use breakdown score values (e.g., `breakdown.triggerPhrases >= 10`). These score values encode the internal scoring formula, not literal counts. While the code is correct, the comments may mislead future maintainers into thinking the thresholds are count-based rather than score-based.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: filesChanged mapping (Rec 1) is implemented on both fast-path and slow-path
- Confirmed: JSON quality floor (Rec 6) applies the damped floor correctly per DR-004
- Contradictions: None found
- Unknowns: Whether technicalContext is ever passed via preloadedData path in production

### Overlay Protocols
- N/A (no overlay for this review)

## Ruled Out
- **normalizeInputData return type causing crash**: The union return type (`NormalizedData | RawInputData`) does not cause crashes because the spread merge in workflow.ts accepts any object shape. The risk is silent field-shape mismatch, not a runtime exception.
- **JSON floor creating score inflation**: The floor is capped at 0.70 and damped by 0.85x. Even with all 6 dimensions passing, the maximum floor is `(6/6) * 0.85 = 0.85` capped to `0.70`. This is conservative.
- **filesModified/filesChanged priority conflict**: The code explicitly checks `filesModified` first and only falls through to `filesChanged` when `FILES` is still empty. Priority chain is well-defined.

## Sources Reviewed
- [SOURCE: scripts/core/workflow.ts:587-626] -- runWorkflow merge logic
- [SOURCE: scripts/utils/input-normalizer.ts:440-705] -- normalizeInputData full function
- [SOURCE: scripts/utils/input-normalizer.ts:78-79] -- filesChanged type definition
- [SOURCE: scripts/utils/input-normalizer.ts:900-910] -- validation for filesChanged
- [SOURCE: scripts/core/quality-scorer.ts:119-281] -- scoreMemoryQuality with JSON floor

## Assessment
- Confirmed findings: 4
- New findings ratio: 1.00
- noveltyJustification: First iteration; all 4 findings are new (1 P1 + 3 P2).
- Dimensions addressed: [correctness]

## Reflection
- What worked: Focusing on the data flow merge pattern at workflow.ts:618-619 and tracing both fast-path and slow-path through input-normalizer.ts revealed a real type-safety gap.
- What did not work: N/A (first iteration).
- Next adjustment: Security dimension should examine input validation completeness and whether raw user strings can inject into template rendering or file paths.
