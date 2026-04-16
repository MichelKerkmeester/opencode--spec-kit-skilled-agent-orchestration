# Iteration 47 - test-quality - tests

## Dispatcher
- iteration: 47 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:36:48.496Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-memory-tiers.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-trigger-fast-match.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-resume-perf.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-trigger-perf-benchmark.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`gate-d-regression-intent-routing.vitest.ts` does not exercise the live canonical-filtering contract it claims to protect.**
   - Evidence: `gate-d-regression-intent-routing.vitest.ts:27-29` mocks `handleMemorySearch` and `handleMemoryMatchTriggers`; `gate-d-regression-intent-routing.vitest.ts:169-196` hard-codes already-sanitized `results` plus `sourceContract`; `gate-d-regression-intent-routing.vitest.ts:318-376` asserts those canned nested payloads as proof that archived/legacy fallback is disabled.
   - Evidence: `handlers/memory-context.ts:803-880` shows quick/deep/focused mode just delegate to the backend handlers and spread their responses back out. If backend canonical filtering regresses, this test still stays green as long as routing still calls the mocked handler.
   - Impact: the Gate D regression suite currently verifies routing arguments, but not the actual "no archived tier / no legacy fallback" behavior named in the test title for quick/deep/focused paths.

```json
{
  "claim": "gate-d-regression-intent-routing.vitest.ts is a false-positive regression test for canonical filtering because it mocks the search/trigger backends to return already-filtered payloads, while handleMemoryContext merely forwards those payloads for quick/deep/focused modes.",
  "evidenceRefs": [
    "mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:27-29",
    "mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:169-196",
    "mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:318-376",
    "mcp_server/handlers/memory-context.ts:803-880"
  ],
  "counterevidenceSought": "I looked for assertions against real backend output or post-routing canonical filtering inside handleMemoryContext; the search/trigger branches contain neither.",
  "alternativeExplanation": "The author may have intended this file to be a routing-only unit test, not a filtering regression test.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 if another non-mocked integration suite already covers quick/deep/focused canonical filtering against the real backends."
}
```

2. **Both Gate D perf tests are telemetry-only and will pass even when their stated SLOs regress.**
   - Evidence: `gate-d-resume-perf.vitest.ts:121-135` computes `happyPathLt300Ms` and `p95Lt500Ms` and then only logs the report; there is no threshold assertion afterwards.
   - Evidence: `gate-d-trigger-perf-benchmark.vitest.ts:34-36` declares `TARGET_P95_MS = 10`; `gate-d-trigger-perf-benchmark.vitest.ts:199-209` computes `withinTarget`; `gate-d-trigger-perf-benchmark.vitest.ts:289-295` only asserts percentile ordering, not the target.
   - Cross-check: the older benchmark siblings still enforce latency gates (`gate-d-benchmark-session-resume.vitest.ts:157-161`, `gate-d-benchmark-trigger-fast-path.vitest.ts:192-195`), so this is not just a repo-wide benchmark convention.
   - Impact: these files no longer protect the performance acceptance criteria implied by their names and metrics, so major latency regressions would still ship under a green suite.

```json
{
  "claim": "gate-d-resume-perf.vitest.ts and gate-d-trigger-perf-benchmark.vitest.ts calculate latency pass/fail signals but never assert them, so both suites pass under serious performance regressions.",
  "evidenceRefs": [
    "mcp_server/tests/gate-d-resume-perf.vitest.ts:121-135",
    "mcp_server/tests/gate-d-trigger-perf-benchmark.vitest.ts:34-36",
    "mcp_server/tests/gate-d-trigger-perf-benchmark.vitest.ts:199-209",
    "mcp_server/tests/gate-d-trigger-perf-benchmark.vitest.ts:289-295",
    "mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:157-161",
    "mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts:192-195"
  ],
  "counterevidenceSought": "I checked for later expectations on the computed booleans/targets and found only console logging plus monotonic percentile assertions.",
  "alternativeExplanation": "These files may have been intended as observational benchmarks that were accidentally left in the normal regression suite.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade to P2 if CI intentionally excludes these files from required test gates and they are documented as manual benchmarks only."
}
```

### P2 Findings
- **`handler-helpers.vitest.ts` silently skips large chunks of coverage when imports fail.** `handler-helpers.vitest.ts:63-94` catches import failures and stores `null`, and many tests then early-return (`handler-helpers.vitest.ts:200-245`, `257-291`, `312-403`, `422-442`, `784-834`). That means a broken helper import can turn this file green instead of red, which weakens it as a regression tripwire.
- **`gate-d-regression-memory-tiers.vitest.ts` pre-filters the failure case before it reaches the subject under test.** `gate-d-regression-memory-tiers.vitest.ts:76-91` removes deprecated rows with `isExcludedFromSearch()` before calling `applyCompositeScoring()`, while `lib/scoring/composite-scoring.ts` has no exclusion logic of its own. The test therefore proves ranking-after-filtering, not the “no legacy fallback surfaces” behavior named in its description.

## Traceability Checks
- The Gate D perf surface no longer matches its own benchmark intent: the older sibling suites still assert latency caps, but `gate-d-resume-perf.vitest.ts` and `gate-d-trigger-perf-benchmark.vitest.ts` only emit metrics.
- The suggested file `mcp_server/tests/gate-d-regression-shared-memory-governance.vitest.ts` is not present in the current tree. Governance coverage for this slice appears to funnel through `governance-e2e.vitest.ts`, which only exercises `filterRowsByScope()` despite `scope-governance.ts` also carrying governed-ingest retention and audit-review logic.

## Confirmed-Clean Surfaces
- **`gate-d-regression-trigger-fast-match.vitest.ts`**: solid focused coverage. It drives the real trigger-cache loader against controlled DB rows and checks the exact precedence implemented by `lib/parsing/trigger-matcher.ts:201-209` (canonical spec-doc rows first, `_memory.continuity` fallback, legacy/archive ignored).
- **`graph-payload-validator.vitest.ts`**: good fail-closed coverage. It exercises the real payload validator and verifies both the accepted trust-shape and the rejection path when structural trust emission collapses fields.
- **`handler-checkpoints.vitest.ts`**: good handler-entry validation for checkpoint scope and confirm-name safety. The file is not a full integration suite, but the argument-validation and response-shape assertions are aligned with the actual handler contracts in `handlers/checkpoints.ts`.

## Next Focus
- Iteration 48 should stay on test-quality and target the graph/governance suites that still rely on mocked or partial flows, especially coverage around retention/audit paths and any remaining Gate D regression files that assert canned envelopes instead of live handler behavior.
