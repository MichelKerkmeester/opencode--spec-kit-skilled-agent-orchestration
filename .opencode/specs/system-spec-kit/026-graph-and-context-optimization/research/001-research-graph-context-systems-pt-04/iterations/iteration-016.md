# Iteration 16 -- 003-contextador

## Metadata
- Run: 16 of 20
- Focus: question closure pass: Mainframe broadcast/request protocol, janitor locking, and privacy/consistency tradeoffs
- Agent: codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-08T07:28:05Z
- Tool calls used: 5

## Focus
Close Q6-Q7 by tracing how Mainframe stores identity, joins rooms, replays broadcasts, posts requests, and coordinates lock/budget state over Matrix.

## Findings
- Q6 answer, transport model: Mainframe stores a persistent local `agentId` plus password in `.contextador/mainframe-agent.json`, logs in or registers against the Matrix server, joins or creates a project room, and caches the last 100 room messages for history reuse (`external/src/lib/mainframe/bridge.ts:26-57`, `external/src/lib/mainframe/bridge.ts:77-125`, `external/src/lib/mainframe/client.ts:20-72`, `external/src/lib/mainframe/client.ts:145-189`). [SOURCE: external/src/lib/mainframe/bridge.ts:26-57] [SOURCE: external/src/lib/mainframe/bridge.ts:77-125] [SOURCE: external/src/lib/mainframe/client.ts:20-72] [SOURCE: external/src/lib/mainframe/client.ts:145-189]
- Q6 answer, message semantics: a broadcast message carries raw query text, `query_hash`, `scopes`, serialized `pointers`, `tokens_used`, `agent_id`, and `context_validated`; request messages carry `to`, `task`, and `priority`; janitor coordination is a room-state lock with `locked`, `agent_id`, and timestamps (`external/src/lib/mainframe/rooms.ts:6-69`, `external/src/lib/mainframe/bridge.ts:128-185`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/bridge.ts:253-293`). [SOURCE: external/src/lib/mainframe/rooms.ts:6-69] [SOURCE: external/src/lib/mainframe/bridge.ts:128-185] [SOURCE: external/src/lib/mainframe/bridge.ts:216-250] [SOURCE: external/src/lib/mainframe/bridge.ts:253-293]
- Q7 answer, privacy/operations: the Matrix client creates rooms with `visibility: "private"` but `preset: "public_chat"`, the room history contains raw query and pointer payloads, and the local machine keeps the Mainframe password on disk; these are practical collaboration shortcuts, not strong privacy or tenancy controls (`external/src/lib/mainframe/client.ts:182-188`, `external/src/lib/mainframe/bridge.ts:27-57`, `external/src/lib/mainframe/bridge.ts:157-175`). [SOURCE: external/src/lib/mainframe/client.ts:182-188] [SOURCE: external/src/lib/mainframe/bridge.ts:27-57] [SOURCE: external/src/lib/mainframe/bridge.ts:157-175]
- Conflict resolution remains shallow: cache reuse is query-hash matching over recent broadcasts and budget/lock coordination is just last-write room state. There is no deeper reconciliation layer for conflicting pointer payloads or concurrent state mutation beyond stale-lock timeout behavior (`external/src/lib/mainframe/bridge.ts:128-143`, `external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/bridge.ts:220-237`). [SOURCE: external/src/lib/mainframe/bridge.ts:128-143] [SOURCE: external/src/lib/mainframe/bridge.ts:169-175] [SOURCE: external/src/lib/mainframe/bridge.ts:220-237]

## Ruled Out
No new approaches were ruled out in this iteration.

## Dead Ends
No permanent dead ends were added in this iteration.

## Sources Consulted
- `external/src/lib/mainframe/bridge.ts:26-57`
- `external/src/lib/mainframe/bridge.ts:77-185`
- `external/src/lib/mainframe/bridge.ts:216-293`
- `external/src/lib/mainframe/rooms.ts:6-69`
- `external/src/lib/mainframe/client.ts:20-189`

## Assessment
- New information ratio: 0.16
- Questions addressed: Q6, Q7
- Questions answered: Q6, Q7

## Reflection
- What worked and why: reading the bridge together with the Matrix client and envelope builders exposed the real collaboration contract quickly.
- What did not work and why: focusing only on `checkHistory()` would have understated the privacy story because the risky data path is in message creation and local credential persistence.
- What I would do differently: add dedicated evidence later for dedup/summarizer behavior if a future prototype wants to reuse the cache layer, because this pass stayed on the contract and risk surface.

## Recommended Next Focus
Resolve Q8-Q9 from `stats.ts`, `budget.ts`, and the provider config layer so the remaining efficiency and model-support claims are closed with exact arithmetic and adapter boundaries.
