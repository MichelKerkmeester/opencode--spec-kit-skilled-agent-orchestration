# Iteration 32 - traceability - tests

## Dispatcher
- iteration: 32 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:15:50.839Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **The intent-classifier suite's headline accuracy gates exclude two supported intents, so the tests can still report ">80% accuracy" while `find_spec` or `find_decision` regress.** The classifier implements and routes seven intents, including dedicated `find_spec`/`find_decision` keywords, patterns, and explicit spec-lookup boosting (`.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-8,65-72,75-127,270-275,404-485`). But the main coverage corpus is deliberately narrowed to `ClassifiableIntent = Exclude<IntentType, 'find_spec' | 'find_decision'>`, and both "overall accuracy" gates aggregate only that five-intent subset (`.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:7-13,145-156,256-272,505-574`). The two omitted intents only get isolated smoke checks, not inclusion in the advertised quality threshold (`.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:131-142,619-667`).

```json
{
  "claim": "The suite's advertised overall-accuracy checks exclude `find_spec` and `find_decision`, so two production intents can regress without failing the headline classifier-quality gate.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-8",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:65-72",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:75-127",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:270-275",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:404-485",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:7-13",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:145-156",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:256-272",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:505-574",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:619-667"
  ],
  "counterevidenceSought": "I looked for a second aggregate accuracy gate, per-class threshold, or end-to-end routing suite that folds `find_spec` and `find_decision` into the same quality bar. I only found single-query smoke coverage and ranked-intent presence checks.",
  "alternativeExplanation": "If the project intentionally scopes the classifier accuracy SLO to the five 'work execution' intents and treats spec/decision retrieval as best-effort auxiliary intents, then the tests are incomplete documentation rather than a broken gate. The current file names and assertions present the metric as overall classifier accuracy.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the acceptance criteria explicitly define the >80% target as applying only to the five non-retrieval intents, with `find_spec` and `find_decision` covered by a separate contract."
}
```

### P2 Findings
- **`memory-context.vitest.ts` uses raw source-text assertions for key handler guarantees instead of exercising the runtime path.** The file reads `handlers/memory-context.ts` into `MEMORY_CONTEXT_SOURCE` (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:62-65`) and then proves default-mode/trace-plumbing behavior with `toMatch`/`toContain` checks against source text (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:389-390,432-433,656-657`). Those assertions do not verify the live handler path that actually sets `requested_mode = 'auto'` and conditionally wires `options.sessionTransition` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1213-1218,1448-1455`), so refactors that preserve the string but break runtime behavior can slip through.
- **`hybrid-search.vitest.ts` leaves important integration contracts at smoke-test strength.** The enhanced-search `specFolder` case only checks that a result array exists (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:500-503`), even though the production path forwards `specFolder` into vector and graph channels and treats it as a real scope input (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:75-79,1062-1071,1114-1123`). Likewise, the graph-source regression only asserts `results.length > 0` rather than verifying graph attribution or graph-specific rows (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:811-815`). By contrast, the BM25 scoped test does assert IDs stay within the requested folder (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:302-314`), which highlights that the end-to-end enhanced path is currently under-asserted.

## Traceability Checks
- `handler-memory-stats-edge.vitest.ts` meaningfully matches the shipped `memory_stats` contract: the tests assert clamping, archived-folder inclusion, exclude-pattern filtering, and structured MCP error responses with request IDs against the live handler surface (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:87-220`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:59-125,177-320`).
- `handler-memory-triggers.vitest.ts` also tracks the implementation well on the reviewed paths: the suite checks degraded-matching metadata, governed-scope filtering, and caller-limit enforcement on the cognitive branch instead of only validating exports (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:144-328`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:183-339`).
- The main traceability miss in this slice is the classifier-quality story: the code supports seven intents, but the tests' headline pass/fail thresholds only measure five of them.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts` + `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts` - edge-case stats coverage is concrete and contract-shaped, not just smoke-level.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts` + `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` - the reviewed trigger tests cover real response-shaping and scope/cognitive branches.
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` + `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` - Gate D resume precedence is exercised with temp-folder fixtures and an explicit "do not call handleMemorySearch" guard.
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts` + `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` - in-memory SQLite coverage meaningfully checks scope filtering, audit aggregation, and unscoped-enumeration blocking.
- `.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts` + `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` - tool-prefix and layer-map alignment checks are direct and internally consistent for the reviewed L1-L7 surface.

## Next Focus
- Iteration 33 should stay on test traceability and target the remaining "headline metric vs real contract" gaps: add contract-level assertions for `find_spec`/`find_decision`, convert `memory-context` source-text checks into runtime checks, and harden `hybridSearchEnhanced` scoped-result/source-attribution assertions.
