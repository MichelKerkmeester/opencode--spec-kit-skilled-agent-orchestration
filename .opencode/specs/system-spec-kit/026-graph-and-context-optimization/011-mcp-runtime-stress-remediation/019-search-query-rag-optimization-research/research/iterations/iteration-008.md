# Iteration 008: RAG Fusion Trust Tree and Citation Boundaries

## Focus

Map how memory, code graph, advisor, CocoIndex, and causal graph trust signals could compose into answer-level RAG policy.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:12`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:74`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:161`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:297`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:998`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:101`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18`

## Findings

- Memory search recovery payloads classify no-results, partial, and low-confidence states, then recommend concrete actions such as refuse, ask user, or broaden (`recovery-payload.ts:12`, `:74`, `:203`).
- Citation policy is already tied to retrieval quality: good results can be cited, weak recovered results should not be cited (`search-results.ts:297`, `:998`).
- Code graph degraded context surfaces fallback decisions instead of silently producing graph answers under error/full-scan states (`context.ts:62`).
- CocoIndex seed telemetry is now preserved into code graph context via `rawScore`, `pathClass`, and `rankingSignals` (`seed-resolver.ts:20`, `:110`).
- Advisor status exposes freshness/trustState and lane weights, but those signals do not appear to feed a global answer-level trust tree (`advisor-status.ts:101`, `:140`).

## Insights

The systems have local trust contracts, but no composed trust tree. Phase D should create a small response-level object that records which source supported each claim, which source was degraded, which source contradicted or superseded another, and which policy governed citation/refusal.

## Open Questions

- Should contradictions across memory and code graph fail closed, ask user, or lower confidence and cite both sides?
- Can a trust tree be implemented as pure telemetry first, without changing retrieval ranking?

## Next Focus

Convert residual gaps into concrete integration tests and benchmark corpus requirements.

## Convergence

newInfoRatio: 0.31. The main new signal is cross-system composition, not new individual surface defects.

