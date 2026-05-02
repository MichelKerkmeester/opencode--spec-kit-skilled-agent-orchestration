# Review 003: Hybrid Search Error Handling Audit

## Dimension: Observability & Resilience

Scope reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/hybrid-search.js`
- Comparison baseline: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts`

## Findings (P0/P1/P2 with file:line citations)

No P0 findings.

Count summary from the reviewed pair:
- The TypeScript source has 19 catch blocks total. Of those, 18 are swallow-or-warn-only: 7 no-log catches at `hybrid-search.ts:414`, `hybrid-search.ts:434`, `hybrid-search.ts:1081`, `hybrid-search.ts:1123`, `hybrid-search.ts:1166`, `hybrid-search.ts:1515`, and `hybrid-search.ts:1944`; plus 11 warn-only catches at `hybrid-search.ts:368`, `hybrid-search.ts:395`, `hybrid-search.ts:467`, `hybrid-search.ts:882`, `hybrid-search.ts:912`, `hybrid-search.ts:1266`, `hybrid-search.ts:1363`, `hybrid-search.ts:1457`, `hybrid-search.ts:1489`, `hybrid-search.ts:1543`, and `hybrid-search.ts:1840`. The only non-warn swallowing catch is the MPAB `console.error` path at `hybrid-search.ts:1324`.
- The built JavaScript mirrors the same pattern: 19 catch blocks total, 18 swallow-or-warn-only. The no-log mirrors are at `hybrid-search.js:198`, `hybrid-search.js:217`, `hybrid-search.js:723`, `hybrid-search.js:763`, `hybrid-search.js:804`, `hybrid-search.js:1102`, and `hybrid-search.js:1470`; the warn-only mirrors are at `hybrid-search.js:151`, `hybrid-search.js:180`, `hybrid-search.js:245`, `hybrid-search.js:546`, `hybrid-search.js:574`, `hybrid-search.js:898`, `hybrid-search.js:969`, `hybrid-search.js:1044`, `hybrid-search.js:1078`, `hybrid-search.js:1127`, and `hybrid-search.js:1373`. The MPAB `console.error` mirror is `hybrid-search.js:936`.

- P1: Channel failures inside `collectAndFuseHybridResults()` are invisible to operators. The vector, graph, and degree channels all use empty catches, so a hard channel exception is indistinguishable from "channel returned zero results" in both source and build outputs (`hybrid-search.ts:1081-1083`, `hybrid-search.ts:1123-1125`, `hybrid-search.ts:1166-1168`, mirrored at `hybrid-search.js:723-725`, `hybrid-search.js:763-765`, `hybrid-search.js:804-806`). The specific vector `_err {}` path can hide up to 2 failures per search request because `executeFallbackPlan()` runs `collectAndFuseHybridResults()` once for the primary pass and once for the retry/tier-2 pass (`hybrid-search.ts:777-780`, `hybrid-search.ts:799-802`, `hybrid-search.ts:819-822`). By contrast, the pipeline orchestrator records degraded state and failed stage metadata whenever stages 2-4 fall back (`pipeline/orchestrator.ts:80-110`, `pipeline/orchestrator.ts:113-177`).

- P1: FTS failures are currently downgraded to "no lexical matches" instead of surfaced degradation. `isFtsAvailable()` suppresses database errors and returns `false` (`hybrid-search.ts:426-437`, mirrored at `hybrid-search.js:208-220`), then `ftsSearch()` warns and returns `[]` on execution errors (`hybrid-search.ts:446-470`, mirrored at `hybrid-search.js:228-248`). Downstream callers treat that the same as a healthy empty result set (`hybrid-search.ts:1086-1093`, `hybrid-search.ts:1700-1706`, `hybrid-search.ts:1760-1763`). This should not abort the whole request, but it should be escalated into degraded metadata or an explicit channel-failure surface; otherwise an enabled FTS lane can be dead in production while the search response still looks successful.

- P2: The top-level `collectAndFuseHybridResults()` fallback preserves uptime but not correctness metadata. Any exception in the enhanced fusion path becomes a `console.warn` plus `return null` (`hybrid-search.ts:1266-1269`, mirrored at `hybrid-search.js:898-901`), and `executeFallbackPlan()` immediately switches to the legacy `hybridSearch()` implementation (`hybrid-search.ts:777-780`, `hybrid-search.ts:799-802`, `hybrid-search.ts:819-822`). That fallback path is availability-correct, but observability-incomplete: the enhanced-path trace and `_s3meta` attachment only exist when an execution object survives (`hybrid-search.ts:1549-1661`, mirrored at `hybrid-search.js:1132-1210`), so operators lose routing, truncation, and degradation evidence exactly when the failure is most important.

- P2: Existing observability is partial and inconsistent across channels. There is some positive instrumentation: graph health counters exist (`hybrid-search.ts:263-298`, mirrored at `hybrid-search.js:74-98`), and successful enhanced runs attach degradation and trace metadata (`hybrid-search.ts:1559-1661`, `hybrid-search.ts:2111-2183`). But neither vector nor FTS nor degree has equivalent failure counters, and several optional paths still fail silently or warn-only, including folder scoring (`hybrid-search.ts:1495-1517`, mirrored at `hybrid-search.js:1096-1104`) and description-cache refresh (`hybrid-search.ts:1936-1948`, mirrored at `hybrid-search.js:1461-1474`). Compared with the orchestrator's explicit degraded contract (`pipeline/orchestrator.ts:14-18`, `pipeline/orchestrator.ts:94-110`, `pipeline/orchestrator.ts:126-177`), the hybrid module exposes too little channel-level failure state for operators to answer a basic question: did vector/FTS/graph fail, or did they just return nothing?

## Recommendations

1. Replace empty channel catches with structured degradation recording. At minimum, capture `channel`, `error`, and `stage` into `s3meta` or `traceMetadata` so vector, graph, degree, folder-scoring, and cache-refresh failures are distinguishable from empty result sets.

2. Keep the availability fallback, but stop returning bare `null` from `collectAndFuseHybridResults()`. Return a degraded execution object, or a typed failure envelope, so callers can preserve routing/budget/truncation metadata the same way `pipeline/orchestrator.ts` preserves stage degradation state.

3. Escalate FTS failures beyond `console.warn + []` when FTS was selected as an active channel. Recommended behavior: keep the request alive, but mark the response as degraded and include an explicit `fts: failed` signal in metadata; if FTS is the only lexical channel for the request, consider raising the log level to `console.error`.

4. Add per-channel failure counters alongside the existing graph metrics. Operators should be able to answer "how often did vector fail this hour?" without tailing logs.

5. Add regression tests for the degraded-path contract in both source and build parity: vector throw, FTS throw, graph throw, and enhanced-fusion throw should all produce observable failure state rather than silent channel disappearance.
