# Iteration 8: P2 Items Deep Dive and hasTriggerMatch Inconsistency

## Focus
Investigate all 6 P2 refinement items identified in prior iterations, plus the new hasTriggerMatch inconsistency found in iteration 7. For each: find exact code location, assess severity, determine whether it needs fixing, and propose concrete action (fix, defer, or accept-as-designed).

## Findings

### P2-1: Progressive Disclosure Continuation Not Stateful
**Verdict: Working As Designed -- No Fix Needed**

Progressive disclosure uses cursor-based pagination with a 5-minute TTL. The "not stateful" observation from iteration 4 refers to the fact that cursor state is ephemeral (in-memory Map with TTL eviction). However, this is intentional and correct:
- Cursors expire after 5 minutes of inactivity -- appropriate for interactive MCP tool use
- Cursor tokens are opaque strings returned to the caller, who can pass them back for continuation
- The MCP protocol is inherently request-response; long-lived cursors would leak memory
- This follows standard API pagination patterns (Elasticsearch scroll, GraphQL cursors)

[SOURCE: session-state.ts analysis + progressive-disclosure architecture from iteration 4]
[INFERENCE: Based on standard API pagination patterns and MCP protocol constraints]

### P2-2: Goal Refinement Not Persisted Across Calls
**Verdict: Working As Designed With Minor Enhancement Opportunity**

Code location: `session-state.ts` lines 118-122, `updateGoal()` method.

The goal IS persisted across calls within a session -- it lives in the in-memory SessionStateManager singleton (line 223: `const manager = new SessionStateManager()`). The 30-minute TTL (line 19: `SESSION_TTL_MS = 30 * 60 * 1000`) and LRU eviction at 100 sessions (line 22: `MAX_SESSIONS = 100`) are the boundaries.

The real limitation (identified in iteration 4) is that `updateGoal` is called with the current query text on every search call, overwriting any prior goal. This means the goal tracks the latest query, not a persisted session intent. However, this is actually reasonable: in an MCP tool-call context, each search has its own intent. A "sticky" goal would require explicit user action to set and clear, adding UX complexity for minimal gain.

[SOURCE: session-state.ts:118-122 (updateGoal), line 223 (singleton), lines 19-22 (TTL/LRU constants)]

### P2-3: Session State Is Ephemeral Per-Request
**Verdict: Working As Designed -- Intentionally Ephemeral**

The module header states this explicitly at line 14: "STORAGE: In-memory only (ephemeral by design, no SQLite persistence). Sessions expire after 30 minutes of inactivity, LRU eviction at 100 capacity."

The session state tracks:
- `seenResultIds: Set<string>` -- Cross-turn dedup (working correctly, accumulates via `markSeen`)
- `activeGoal: string | null` -- Goal-aware refinement (working, see P2-2)
- `openQuestions: string[]` -- Tracked but noted as unused in iteration 4
- `preferredAnchors: string[]` -- Tracked but noted as unused in iteration 4

Session state surviving process restarts would require SQLite persistence, adding complexity for transient retrieval context. The 30-minute TTL is appropriate for conversational sessions. The openQuestions and preferredAnchors are infrastructure for future use -- not a bug, just planned capability.

[SOURCE: session-state.ts:1-15 (module header, explicit design intent), lines 33-41 (SessionState interface)]

### P2-4: Doc-Type Shift Disproportionality
**Verdict: Real Issue -- Low Severity, Proportional Fix Available**

Code location: `shared/algorithms/adaptive-fusion.ts` lines 82-83 and 142-161.

The constant `DOC_TYPE_WEIGHT_SHIFT = 0.1` applies a flat +/- 0.1 shift regardless of the base weight magnitude. This creates disproportionate effects:

| Intent | Base keywordWeight | +0.1 shift | % increase |
|--------|-------------------|------------|------------|
| find_decision | 0.2 | 0.3 | +50% |
| fix_bug | 0.4 | 0.5 | +25% |
| understand | 0.2 | 0.3 | +50% |
| add_feature | 0.3 | 0.4 | +33% |

For `find_decision` with `documentType='decision'`, the keyword weight jumps 50% while semantic drops from 0.3 to 0.2 (33% reduction). For `fix_bug`, the same shift is only 25%.

**Proposed fix**: Use proportional shift: `shift = base * DOC_TYPE_SHIFT_FACTOR` where `DOC_TYPE_SHIFT_FACTOR = 0.2` (20% relative shift). This ensures consistent proportional impact across all intent profiles. Estimated effort: ~30 minutes.

However, the practical impact is low because:
1. The weights are clamped to [0, 1.0] (lines 147-158)
2. The shift only applies when a `documentType` is provided (line 143)
3. Most queries do not have a contextType filter set

[SOURCE: shared/algorithms/adaptive-fusion.ts:82-83 (DOC_TYPE_WEIGHT_SHIFT constant), lines 142-161 (switch statement with flat shifts)]

### P2-5: Auto-Surface Trigger Matching
**Verdict: Downgraded Correctly -- Sophisticated Implementation**

This was already downgraded from P1 in iteration 7. The trigger-matcher.ts (792 lines) uses Unicode-aware boundary regex with n-gram candidate indexing, not naive substring matching. No further action needed.

[SOURCE: Confirmed by iteration 7 findings, trigger-matcher.ts analysis]

### P2-6: Reranker NaN Sort Stability
**Verdict: Theoretical Only -- Already Defended**

Code location: `pipeline/ranking-contract.ts` lines 39-54 (`compareDeterministicRows`), and `pipeline/types.ts` lines 58-68 (`resolveEffectiveScore`).

The sort uses `resolveEffectiveScore()` which has a comprehensive NaN/non-finite defense chain:
```
intentAdjustedScore -> rrfScore -> score -> similarity/100 -> 0 (fallback)
```

Each step checks `Number.isFinite()` before using the value. If ALL four score fields are NaN/undefined, it returns 0. The comparator then has:
1. Primary: `bScore - aScore` (both guaranteed finite by resolveEffectiveScore)
2. Tiebreaker: raw similarity with explicit `Number.isFinite()` guard (line 49-50)
3. Final: `a.id - b.id` (integer IDs, always finite)

For NaN to cause sort instability, a PipelineRow would need `id` to be NaN, which is structurally impossible since IDs come from SQLite integer primary keys.

Additionally, the stage3 reranker has its own defense: `resolveRerankOutputScore()` (stage3-rerank.ts:68-73) which checks `Number.isFinite()` on cross-encoder output and falls back to the input score.

**Conclusion**: No NaN sort instability is possible. The defense is 3 layers deep (resolveEffectiveScore -> compareDeterministicRows -> id tiebreaker). This P2 can be closed.

[SOURCE: pipeline/ranking-contract.ts:39-54 (compareDeterministicRows), pipeline/types.ts:58-68 (resolveEffectiveScore with 4-step isFinite chain), stage3-rerank.ts:68-73 (resolveRerankOutputScore)]

### P2-NEW: hasTriggerMatch Inconsistency (query-classifier vs trigger-matcher)
**Verdict: Real Inconsistency -- Low Impact, Easy Fix**

Code location: `query-classifier.ts` lines 82-86 (`hasTriggerMatch` function).

The `hasTriggerMatch` function in query-classifier.ts uses exact case-insensitive equality:
```typescript
function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean {
  if (triggerPhrases.length === 0) return false;
  const normalized = query.trim().toLowerCase();
  return triggerPhrases.some(tp => tp.trim().toLowerCase() === normalized);
}
```

This checks if the ENTIRE query exactly equals a trigger phrase. Meanwhile, trigger-matcher.ts uses sophisticated Unicode boundary regex to check if a trigger phrase APPEARS WITHIN the query (with word boundary awareness).

These serve different purposes:
- **query-classifier**: Determines query complexity tier (simple/moderate/complex). An exact match means the query IS a trigger phrase, so it is classified as "simple" complexity.
- **trigger-matcher**: Finds memories whose trigger phrases match within the query text. A partial match is appropriate here.

The inconsistency is actually CORRECT by design -- they answer different questions:
1. "Is this query itself a trigger phrase?" (exact match, classifier)
2. "Does this query contain any trigger phrases?" (boundary match, matcher)

However, there is a subtle issue: `hasTriggerMatch` in the classifier receives trigger phrases from the caller (test file shows `['save', 'load', 'find']` being passed). If a user types "save context", the classifier will NOT match "save" (because "save context" !== "save"), potentially misclassifying the query as more complex than it should be. A partial match using `startsWith` or word boundary would be more appropriate for classification.

**Proposed fix**: Use word-boundary check in `hasTriggerMatch` rather than exact equality. Something like: `normalized.split(/\s+/).some(word => triggerPhrases.some(tp => tp.trim().toLowerCase() === word))`. Estimated effort: ~15 minutes.

[SOURCE: query-classifier.ts:82-86 (exact === equality), iteration 7 finding on trigger-matcher.ts boundary regex, tests/feature-eval-query-intelligence.vitest.ts:72-74 (test showing exact match pattern)]

## Ruled Out
- P2-1 as a bug: Progressive disclosure cursor pagination is working as designed with standard API patterns
- P2-3 as a bug: Session state ephemerality is explicitly documented as intentional design (module header line 14)
- P2-6 NaN sort instability: 3 layers of Number.isFinite() guards make this structurally impossible

## Dead Ends
- None -- all P2 items were locatable and assessable

## Sources Consulted
- `session-state.ts` (full file, 418 lines) -- P2-1, P2-2, P2-3 analysis
- `shared/algorithms/adaptive-fusion.ts` lines 82-83, 142-161 -- P2-4 doc-type shift
- `pipeline/ranking-contract.ts` (full file, 65 lines) -- P2-6 NaN sort analysis
- `pipeline/types.ts` lines 43-68 -- resolveEffectiveScore chain
- `pipeline/stage3-rerank.ts` lines 64-73 -- resolveRerankOutputScore
- `query-classifier.ts` lines 75-86 -- hasTriggerMatch implementation
- `tests/feature-eval-query-intelligence.vitest.ts` lines 72-74 -- hasTriggerMatch test case

## Assessment
- New information ratio: 0.57
- Questions addressed: P2-1, P2-2, P2-3, P2-4, P2-5, P2-6, hasTriggerMatch inconsistency
- Questions answered: All 7 items assessed with verdicts

## Reflection
- What worked and why: Reading the full session-state.ts file gave complete picture of all three session-related P2 items (P2-1/P2-2/P2-3) in one pass, saving tool calls. The module header explicitly documents the design intent, making it easy to distinguish bugs from intentional design.
- What did not work and why: Searching for "doc_type" and "docType" in stage2-fusion.ts returned nothing because the doc-type shift logic lives in the shared adaptive-fusion module, not in the pipeline stage files. Had to search progressively wider to locate it.
- What I would do differently: Start with the shared/algorithms directory for weight-related searches, since iteration 5 already identified adaptive-fusion.ts as the canonical weight module.

## Recommended Next Focus
All P2 items are now assessed. The complete refinement backlog stands at:

**Actionable (worth fixing):**
- P1-3 (revised): Add direct recency bonus signal in Stage 2 fusion (~2 hours, highest impact)
- P1-4: Raise GRAPH_WEIGHT_CAP from 0.05 to proportional (~1-2 hours)
- P1-2: Constitutional injection count cap (~1 hour)
- P2-4: Doc-type proportional shift (~30 minutes)
- P2-NEW: hasTriggerMatch word-boundary check (~15 minutes)

**Closed (no action needed):**
- P2-1: Working as designed (cursor pagination)
- P2-2: Working as designed (goal tracks current query intentionally)
- P2-3: Working as designed (ephemeral by explicit design)
- P2-5: Already downgraded, implementation is sophisticated
- P2-6: Structurally impossible due to 3-layer NaN defense

Recommend convergence: synthesize all findings into final research.md. Research is comprehensive with 10/10 questions answered and all P1+P2 items triaged.
