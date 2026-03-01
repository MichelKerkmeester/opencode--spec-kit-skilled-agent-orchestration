# Test Agent 9: Tiers & Constitutional - Test Report

**Executed:** 2025-12-26T08:05 UTC
**Total Memories in System:** 128

| Test ID | Description | Expected | Actual | Status |
|---------|-------------|----------|--------|--------|
| T9.1 | Constitutional first | Always top | Constitutional memory (ID 393) appeared at top with similarity: 100 for any query | PASS |
| T9.2 | Constitutional count | Count field | Response includes `constitutionalCount: 1` field | PASS |
| T9.3 | Exclude constitutional | None shown | `includeConstitutional: false` returns `constitutionalCount: 0`, no constitutional in results | PASS |
| T9.4 | Filter critical | Only critical | With `includeConstitutional: false`, all results have `importanceTier: "critical"` | PASS |
| T9.5 | Filter normal | Only normal | With `includeConstitutional: false`, all results have `importanceTier: "normal"` | PASS |
| T9.6 | Tier promotion | Tier changed | Created ID 398 as "normal", promoted to "important" via memory_update, verified change | PASS |
| T9.7 | Deprecated behavior | Reduced visibility | 1 deprecated memory found (ID 371), correctly filtered when `tier: "deprecated"` | PASS |
| T9.8 | Decay calculation | Affects order | useDecay true/false returned identical results; decay effect minimal for recent memories | OBSERVE |
| T9.9 | Weight effect | Affects ranking | Weight stored (0.5-1.0 range observed) but similarity score dominates ranking | OBSERVE |

## Summary
- Total Tests: 9
- Passed: 7
- Observed (needs investigation): 2
- Failed: 0

## Tier Distribution Found

Based on memory_search with tier filtering:
- **Constitutional:** 1 (system-spec-kit/gate-enforcement.md)
- **Critical:** ~7 memories found
- **Important:** 8 memories found
- **Normal:** Majority (~110+ memories)
- **Deprecated:** 1 memory found (ID 371 - old gate enforcement)
- **Temporary:** Not explicitly tested, likely 0

## Detailed Findings

### Constitutional Behavior (T9.1-T9.3)
- Constitutional memories ALWAYS appear at top of ALL searches with similarity: 100
- This is by design - they are "boosted" regardless of semantic relevance
- Can be excluded with `includeConstitutional: false`
- `constitutionalCount` field accurately reports count

### Tier Filtering (T9.4-T9.5)
- Tier filtering works correctly when combined with `includeConstitutional: false`
- Without excluding constitutional, constitutional memory still appears at top even with tier filter
- This is expected behavior: constitutional tier has special treatment

### Tier Promotion (T9.6)
- `memory_update` correctly updates tier
- Embedding NOT regenerated for tier-only changes (expected, tier is metadata)
- Tier change reflected immediately in search results

### Deprecated Tier (T9.7)
- Deprecated memories are queryable but can be filtered to specific tier
- Only 1 deprecated memory exists (old gate enforcement file)
- Deprecated memories don't appear in normal searches unless specifically filtered

### Decay Calculation (T9.8) - OBSERVE
- `useDecay` parameter accepted
- Results with decay ON vs OFF were identical for tested queries
- Possible reasons:
  1. All memories are within ~24-48 hours (minimal decay difference)
  2. Similarity score dominates ranking
  3. Decay factor is subtle
- **Recommendation:** Test with memories spanning weeks/months for observable effect

### Importance Weight (T9.9) - OBSERVE
- Weights observed: 0.5 (default), 0.79, 0.89, 1.0
- Weight is stored and updateable via `memory_update`
- Search results ordered primarily by similarity score
- Weight not shown in search result output (only stored)
- **Recommendation:** Clarify if weight should affect ranking or is for other purposes

## Cleanup Status
- Test memory ID 398 deleted
- Test memory file removed
- No test data remains in system
- Verified: `memory_list` for test folder returns 0 results
