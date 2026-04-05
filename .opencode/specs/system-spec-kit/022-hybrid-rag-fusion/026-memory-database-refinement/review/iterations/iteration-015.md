# Iteration 015: Query routing and intent

## Findings

### [P1] Failure-oriented "why" queries are misclassified away from `fix_bug`
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`

**Issue**
The classifier gives `find_decision` a very generic `why` signal, but `fix_bug` has no matching positive pattern for natural bug reports phrased as "why is X broken/not working". That lets debugging queries route into explanation/decision behavior instead of bug-fix behavior.

**Evidence**
`INTENT_KEYWORDS.find_decision` includes `why` and `INTENT_PATTERNS.find_decision` is optimized for "why did we choose..." style phrasing at lines 62-65 and 114-120, while `fix_bug` only recognizes explicit repair words like `fix`, `debug`, `error`, `bug`, or patterns such as `how to fix` at lines 40-43 and 76-83. There is no `fix_bug` pattern for "why is ... broken" or "why is ... not working". The current negative-pattern guard only penalizes `understand`, not `find_decision`, at lines 173-184. A direct runtime probe against this file reproduced the bug:
`classifyIntent('why is login broken') -> understand`
`classifyIntent('why is the form not working') -> find_decision`
The existing tests cover `debug why form is not working`, which is rescued by the `debug` token, but do not cover the more natural non-debug phrasing at `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:503-511`.

**Fix**
Add explicit `fix_bug` patterns for failure-oriented "why" phrasing, such as `/why\\s+(?:is|does|did).*(?:broken|failing|not\\s+working|crashing)/i`, and add reciprocal negative patterns so `find_decision` is penalized when `why` is attached to failure language rather than rationale language. Add regression tests for `"why is login broken"` and `"why is the form not working"`.

### [P2] The router prunes lexical and structural channels for short spec/decision lookups
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`

**Issue**
Routing is driven only by complexity tier, not by intent or artifact class. As a result, very short spec/decision lookups are treated as simple queries and forcibly routed to `['vector', 'fts']`, which disables `bm25`, `graph`, and `degree` even when the query is really an exact artifact lookup or rationale lookup.

**Evidence**
The default simple-tier route is hardcoded to `['vector', 'fts']` at lines 57-61, and `routeQuery()` simply maps `classification.tier` to that subset at lines 121-139. The complexity classifier marks any query with `<= 3` terms as simple unless a longer-path condition applies in `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:172-182`. A direct probe of that classifier returned:
`classifyQueryComplexity('find spec') -> simple`
`classifyQueryComplexity('decision rationale') -> simple`
The router tests then enforce that every simple query gets only two channels at `.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:263-269` and `.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:90-96`.

**Fix**
Pass intent or artifact-routing hints into `routeQuery()` and allow short `find_spec` / `find_decision` queries to retain `bm25` at minimum, with `graph` optionally preserved for rationale/relationship lookups. If intent-aware routing is intentionally deferred, add an explicit exception table for artifact/document lookup phrases instead of treating all short queries as cheap semantic lookups.

### [P2] Multi-facet queries are collapsed to one dominant intent, dropping the secondary retrieval need
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`

**Issue**
The classifier returns a single `intent` plus a flat keyword bag, so mixed queries lose facet-level intent structure. For cross-document questions that combine spec lookup and rationale lookup, only one intent survives and downstream fusion/reranking never sees the second retrieval objective.

**Evidence**
`classifyIntent()` computes all per-intent scores, then selects one `topIntent` and returns only that single label at lines 428-455. The return shape has no ranked intents, no tie metadata, and no facet mapping at lines 9-14. A direct runtime probe showed the collapse:
`classifyIntent('what are the requirements and why did we choose this approach') -> find_spec`
with a non-trivial `find_decision` score still present but discarded as routing metadata. Downstream, hybrid search consumes only one intent via `const intent = options.intent || classifyIntent(query).intent;` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996-998`, so adaptive fusion and MMR lambda selection follow only the dominant facet. This is especially notable because query decomposition already exists elsewhere in the subsystem, but these intent/routing surfaces do not preserve that decomposition boundary.

**Fix**
Extend the classifier result to return ranked intents or per-facet intents for decomposed queries, and let downstream routing/fusion combine them instead of forcing a single-label collapse. At minimum, expose the top two intents plus margin/confidence so callers can preserve mixed `find_spec` + `find_decision` behavior when the score gap is small.

## Summary
I found three meaningful issues in the reviewed surfaces: one concrete misclassification bug in `intent-classifier.ts`, one intent-blind channel gating problem in `query-router.ts`, and one multi-facet intent-collapse problem that drops decomposition value before routing/fusion. I did not find a standalone arithmetic defect in `query-router.ts` itself; the main routing risk is that its tier-only policy amplifies intent mistakes and short-query false simplifications.
