# Iteration 17 -- 003-contextador

## Metadata
- Run: 17 of 20
- Focus: question closure pass: token-savings arithmetic, budget gating, and provider abstraction support
- Agent: codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-08T07:34:18Z
- Tool calls used: 4

## Focus
Close Q8-Q9 by reading the savings math, the budget guardrails that sit around Mainframe, and the exact provider adapters Contextador exposes today.

## Findings
- Q8 answer, measurement model: the token-savings story is coarse estimation, not measured query-by-query proof. `stats.ts` hard-codes `AVG_MANUAL_EXPLORATION_TOKENS = 25000` and `AVG_CACHE_SAVINGS_TOKENS = 25000`, then multiplies those constants by local queries and cache hits to report approximate savings (`external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:43-50`, `external/src/lib/core/stats.ts:75-107`). [SOURCE: external/src/lib/core/stats.ts:26-28] [SOURCE: external/src/lib/core/stats.ts:43-50] [SOURCE: external/src/lib/core/stats.ts:75-107]
- Q8 answer, practical implication: the code does track `queriesServed`, `cacheHits`, `feedbackReports`, `tokensUsedInit`, `tokensUsedQueries`, and `sweepsRun`, so the system has useful telemetry, but the advertised savings percentage remains only an estimate derived from those counters rather than a measured avoided-read baseline (`external/src/lib/core/stats.ts:4-24`, `external/src/lib/core/stats.ts:88-107`). [SOURCE: external/src/lib/core/stats.ts:4-24] [SOURCE: external/src/lib/core/stats.ts:88-107]
- Q9 answer, adapter coverage: the provider layer explicitly supports `anthropic`, `openai`, `google`, `copilot`, `openrouter`, `custom`, and `claude-code`, with detection priority of stored config -> env vars -> `claude-code` default; cloud/custom adapters instantiate AI SDK clients, while `claude-code` is host-only and intentionally throws if used like a direct API client (`external/src/lib/providers/config.ts:6-44`, `external/src/lib/providers/config.ts:76-112`, `external/src/lib/providers/config.ts:114-132`). [SOURCE: external/src/lib/providers/config.ts:6-44] [SOURCE: external/src/lib/providers/config.ts:76-112] [SOURCE: external/src/lib/providers/config.ts:114-132]
- The adjacent `BudgetTracker` is operationally useful but narrow: it enforces daily limit, room hourly limit, pause, kill, and one-shot 80% alerts, while the bridge uses `canRead()` and `canSpend()` to gate history/task reads and broadcasts; it is not a durable quota authority or audited shared-cost ledger (`external/src/lib/mainframe/budget.ts:16-101`, `external/src/lib/mainframe/bridge.ts:128-185`, `external/src/lib/mainframe/bridge.ts:283-289`). [SOURCE: external/src/lib/mainframe/budget.ts:16-101] [SOURCE: external/src/lib/mainframe/bridge.ts:128-185] [SOURCE: external/src/lib/mainframe/bridge.ts:283-289]

## Ruled Out
No new approaches were ruled out in this iteration.

## Dead Ends
No permanent dead ends were added in this iteration.

## Sources Consulted
- `external/src/lib/core/stats.ts:4-107`
- `external/src/lib/mainframe/budget.ts:16-101`
- `external/src/lib/mainframe/bridge.ts:128-185`
- `external/src/lib/mainframe/bridge.ts:283-289`
- `external/src/lib/providers/config.ts:6-132`

## Assessment
- New information ratio: 0.15
- Questions addressed: Q8, Q9
- Questions answered: Q8, Q9

## Reflection
- What worked and why: reading the arithmetic and adapter code directly removed the temptation to rely on README-level wording for both the savings and provider stories.
- What did not work and why: treating budget gating as part of the token-savings proof would have conflated operational limits with empirical measurement.
- What I would do differently: if this were headed toward implementation, I would insist on a measured benchmark harness before repeating any percentage-based savings language.

## Recommended Next Focus
Resolve Q10 from the setup wizard and CLI initialization flow so the onboarding and `.mcp.json` claims are anchored in exactly what files get created and when.
