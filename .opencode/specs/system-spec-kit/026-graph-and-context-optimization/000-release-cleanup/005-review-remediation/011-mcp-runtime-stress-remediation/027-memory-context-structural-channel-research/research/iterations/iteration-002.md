# Iteration 002 - Corpus False-Positive / False-Negative Scan

## Focus

Quantify structural signal behavior against the v1.0.3 corpus and Phase E gold battery, then identify weak signals and edge cases. This follows the strategy's iteration 2 focus for RQ1.

## Sources Read

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:23-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:123-185`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:276-294`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:41-90`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:93-190`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:192-198`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:45-100`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:102-145`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:155-184`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/measurements/v1-0-3-summary.json:1-5`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/measurements/v1-0-3-summary.json:23-203`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/findings-rubric-v1-0-3.json:29-174`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/findings-v1-0-3.md:20-35`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/findings-v1-0-3.md:69-103`

## Findings

### P1 - Backend classifier matched the 12-case v1.0.3 channel-family labels in the sampled replay

Using `expectedChannels.includes("code_graph_query")` as the positive label and promoting only `intent === "structural" && confidence > 0.65`, the copied classifier logic from `query-intent-classifier.ts` produced `tp=6`, `fp=0`, `fn=0`, `tn=6` across the 12-case v1.0.3 corpus. The corpus exposes expected channels in `corpus.ts` and the summary confirms 12 cases for the v1.0.3 run (`corpus.ts:41-90`, `corpus.ts:93-198`, `v1-0-3-summary.json:1-5`). This is a useful green signal, but it is a channel-family replay, not proof that operation planning is safe.

### P1 - Advisor structural patterns would miss the code-graph family cases in that same corpus

The advisor's structural patterns are relationship/outline/dependency prompts such as "who calls", "what imports", "outline", "dependency", and "what extends" (`context-server.ts:276-286`). They do not match generic readiness/fallback prompts such as the v1.0.3 code-graph cases, while the backend classifier does match broad tokens like `graph`, `caller`, `imports`, and `outline` (`query-intent-classifier.ts:23-45`, `query-intent-classifier.ts:63-72`). Replaying the advisor patterns against the same channel-family labels yielded `tp=0`, `fp=0`, `fn=6`, `tn=6`. This is not a direct relationship-intent failure, because many gold positives are code-graph readiness/fallback prompts, but it does prove the advisor is too narrow to become the sole router.

### P1 - Current corpus under-tests direct relationship prompts

The v1.0.3 corpus includes a code graph fallback case and four W7 code graph cases (`corpus.ts:41-90`, `corpus.ts:93-190`), while the measurement fixtures define runners for `memory_search`, `code_graph_query`, and `skill_graph_query` (`measurement-fixtures.ts:155-184`). The sampled labels validate channel selection, but they do not provide enough "who calls X", "imports of Y", and "outline file Z" coverage to evaluate operation and subject extraction. That is the missing test layer for actionable routing.

### P2 - Semantic suppressions reduce false positives, but can hide mixed intent

Advisor suppressions include "find code", "implementation of", "similar code", "explain", and "purpose of" (`context-server.ts:288-294`). The backend classifier separately scores semantic patterns such as "find code that", "how does", and "similar to" (`query-intent-classifier.ts:47-82`). This protects semantic searches, but mixed prompts like "explain who calls X and why" can become hybrid or suppressed, so hybrid handling needs an explicit two-channel policy.

## New Info Ratio

0.63. The iteration added empirical channel-family counts and separated classifier reliability from advisor reliability.

## Open Questions Surfaced

- What direct structural gold cases should be added before implementation is declared complete?
- Should hybrid prompts run both semantic memory search and structural graph query, or should the router choose one primary backend?
- Should generic "graph readiness" prompts be considered structural for `memory_context`, or only direct code-structure prompts?

## Convergence Signal

Continue. Corpus results answer part of RQ1, but RQ2 and RQ3 still need contract-level evidence.

