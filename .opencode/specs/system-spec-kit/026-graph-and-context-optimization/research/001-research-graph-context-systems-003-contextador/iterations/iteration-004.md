# Iteration 4 -- 003-contextador

## Metadata
- Run: 4 of 10
- Focus: Mainframe shared cache end to end across `bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, `summarizer.ts`, plus the hash and budget call sites they depend on
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T10:52:37Z
- Tool calls used: 9

## Reading order followed
1. `external/src/lib/mainframe/bridge.ts` `1-298`
2. `external/src/lib/mainframe/client.ts` `1-200`
3. `external/src/lib/mainframe/rooms.ts` `1-95`
4. `external/src/lib/mainframe/dedup.ts` `1-27`
5. `external/src/lib/mainframe/summarizer.ts` `1-109`
6. `external/src/mcp.ts` `34-90`, `185-280`
7. `external/src/lib/mainframe/budget.ts` `1-102`
8. `external/src/lib/core/hitlog.ts` `1-114`

## Findings

### F4.1 -- Mainframe uses one Matrix room for broadcasts and requests, one Matrix state slot for janitor locking, one state slot for room budget, and one room message type for summaries; there is no dedicated "cache" message type
- Source evidence: `external/src/lib/mainframe/rooms.ts:6-69`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:157-175`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/summarizer.ts:17-21`, `external/src/lib/mainframe/summarizer.ts:79-87`
- Evidence type: source-proven
- What it shows: The room payload shapes are explicit. `broadcast` messages carry `query`, `query_hash`, `scopes`, `pointers`, `tokens_used`, `agent_id`, and `context_validated` under `content["m.ctx"].data`, plus a human-readable `body` string. `request` messages carry `to`, `task`, and `priority`. `summary` messages carry `generatedAt`, `broadcastCount`, and a `scopes[]` digest where each scope stores `scope`, `queryCount`, `queries`, `lastSeen`, and `totalTokens`. Janitor locking is not a message; it is Matrix room state under `m.ctx.janitor_lock`, with `{ locked, agent_id, locked_at }` on acquire and `{ locked, agent_id, released_at }` on release. Room budget is also state, loaded from `m.ctx.budget`, and the tracker expects `{ hourly_limit, used_this_hour, paused }`. There is no dedicated `cache` message type in these files; cache reuse is implemented by scanning prior `broadcast` events.
- Why it matters for Code_Environment/Public: The shared cache is really "query result reuse from room history," not a separate cache object model. That distinction matters when auditing protocol claims, privacy exposure, and retention behavior.
- Affected subsystem: Matrix protocol and shared-cache envelope
- Open questions resolved: Q6
- Risk / ambiguity: `rooms.ts` types only `broadcast | request` in the envelope interface, while summaries are built and parsed in `summarizer.ts` instead. The protocol works in practice because summary handling bypasses the typed `CtxEnvelope`, but the type model is split across files (`external/src/lib/mainframe/rooms.ts:22-29`, `external/src/lib/mainframe/summarizer.ts:79-99`).

### F4.2 -- Query hashes normalize only the keyword bag, not the raw query text, scopes, or pointer payload, and duplicate keywords are not removed
- Source evidence: `external/src/mcp.ts:193-198`, `external/src/lib/core/hitlog.ts:9-18`
- Evidence type: source-proven
- What it shows: The `context` tool lowercases the full query, strips all non-alphanumeric characters, splits on whitespace, and keeps only words with length at least 3 before hashing. `hashKeywords()` then sorts the keyword array and joins it with `|`, so hashes are case-insensitive and order-insensitive, but they are still sensitive to repeated tokens because the array is sorted, not deduplicated. The hash is computed from keywords only; it does not include the original query string, target scopes, route choice, or returned pointer content.
- Why it matters for Code_Environment/Public: Mainframe dedup is closer to "same normalized keyword bag" than "same semantic request." Queries that collapse to the same 3+ character keyword set can alias, while wording changes that change the keyword bag will miss even if the underlying need is the same.
- Affected subsystem: query dedup and cache-key construction
- Open questions resolved: Q6
- Risk / ambiguity: This hash function is short, local, and intentionally simple. The code offers no collision detection or second-stage verification beyond exact `queryHash` equality (`external/src/lib/core/hitlog.ts:10-17`, `external/src/lib/mainframe/dedup.ts:15-24`).

### F4.3 -- Cache hits come from the last 100 room messages, refreshed at most once per minute, with a nominal 24-hour TTL that depends on a timestamp field the broadcast builder never sets
- Source evidence: `external/src/lib/mainframe/bridge.ts:128-143`, `external/src/lib/mainframe/bridge.ts:133-138`, `external/src/lib/mainframe/dedup.ts:8-26`, `external/src/lib/mainframe/rooms.ts:37-53`, `external/src/mcp.ts:200-208`
- Evidence type: source-proven with one inferred gap
- What it shows: `checkHistory()` reads at most 100 messages from the project room, memoizes them in memory for 60 seconds, and passes that slice to `findMatchingBroadcast()`. Dedup then returns the first broadcast whose parsed `queryHash` matches. It applies a 24-hour cutoff only if `event.content["m.ctx"].data.timestamp` exists. But `buildBroadcast()` does not include any `timestamp` field in the payload, so the TTL check depends on some out-of-band field that this code path does not populate. There is also no eviction or freshness rewrite of stored pointers: a hit returns `match.pointers` directly, and the MCP layer records that as a cache hit with `recordQuery(..., true)`.
- Why it matters for Code_Environment/Public: The shared cache currently behaves like a shallow room-history reuse layer, not a strongly fresh cache. In the traced code, freshness is only nominally time-bounded; in practice it may devolve to "first matching broadcast in the last fetched window" unless another producer injects the missing timestamp field.
- Affected subsystem: cache hit semantics and freshness
- Open questions resolved: Q6, partial Q8
- Risk / ambiguity: The missing `timestamp` could be supplied by Matrix event metadata elsewhere, but `dedup.ts` reads only the custom `m.ctx.data.timestamp` field, not `origin_server_ts` or another server timestamp. That makes the freshness weakness source-visible in the traced code (`external/src/lib/mainframe/dedup.ts:20-21`).

### F4.4 -- Janitor locking is a best-effort shared state guard with a 10-minute abandoned-lock timeout, but it is not atomic and can admit double-acquire races
- Source evidence: `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/client.ts:156-173`
- Evidence type: source-proven
- What it shows: On sweep start, `acquireJanitorLock()` reads `m.ctx.janitor_lock`. If it sees `locked: true` from another agent and that lock is younger than 10 minutes, it returns `false`. Otherwise it overwrites room state with its own `{ locked: true, agent_id, locked_at }` claim and returns `true`. Releasing the lock writes `{ locked: false, agent_id, released_at }`. If Matrix access fails, acquire falls back to `true`, meaning the local sweep proceeds without coordination. Because the sequence is a plain `getState()` followed by `setState()` with no compare-and-swap, two agents that read an empty or stale lock at the same time can both decide they acquired it; the last state write wins, but both local janitor passes can still run.
- Why it matters for Code_Environment/Public: The lock prevents many overlapping sweeps, but it is not a strict distributed mutex. That gap is central to Q7 because the system tolerates abandoned locks yet does not guarantee single-writer execution under concurrent starts or transient Operator errors.
- Affected subsystem: janitor coordination across agents
- Open questions resolved: Q7
- Risk / ambiguity: There is no heartbeat or lease renewal. A long-running but healthy sweep can look abandoned after 10 minutes and be pre-empted by another agent (`external/src/lib/mainframe/bridge.ts:222-225`).

### F4.5 -- Budget tracking has two blocking surfaces and one soft alert surface, but local hourly state is shallow and recovery is mostly day rollover or manual resume
- Source evidence: `external/src/lib/mainframe/budget.ts:6-102`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:128-130`, `external/src/lib/mainframe/bridge.ts:153-185`, `external/src/lib/mainframe/bridge.ts:188-194`, `external/src/lib/mainframe/bridge.ts:283-289`
- Evidence type: source-proven
- What it shows: `BudgetTracker` keeps `dailyLimit`, `usedToday`, `currentDate`, optional room budget `{ hourly_limit, used_this_hour, paused }`, a hard `killed` flag, and a one-shot `alertFired` latch. Reads are blocked only by `killed` via `canRead()`. Broadcast writes are blocked by `canSpend(tokens)` if the bridge is killed, the room is paused, the local daily budget would overflow, or the room's hourly budget would overflow. Task requests are exempt from token spend and only check `canRead()`, so coordination is free unless the bridge is hard-killed. Recovery paths are narrow: `resume()` only clears `killed`, `maybeReset()` clears local daily usage and the alert latch on UTC date change, and room budget is only hydrated from room state during `connect()`.
- Why it matters for Code_Environment/Public: This is a cost guard, not a durable quota service. It can stop spending and reading, but its recovery model is mostly local toggles plus daily reset rather than transactional reconciliation with shared room state.
- Affected subsystem: cost controls and operational throttling
- Open questions resolved: Q6, Q7
- Risk / ambiguity: The bridge updates shared room budget state with a read-modify-write cycle after broadcasting, but it never feeds that new state back into `this.budget`. That means the local hourly guard can lag behind the state it just wrote, and concurrent broadcasters can race on the shared counter (`external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/client.ts:163-172`).

### F4.6 -- Summary generation exists, but it is only triggered through `MainframeBridge.summarizeRoom()`, which this iteration did not find any in-tree caller for
- Source evidence: `external/src/lib/mainframe/bridge.ts:205-213`, `external/src/lib/mainframe/summarizer.ts:23-29`, `external/src/lib/mainframe/summarizer.ts:26-60`, `external/src/lib/mainframe/summarizer.ts:101-108`
- Evidence type: source-proven with inferred caller absence
- What it shows: `summarizeRoom()` fetches the last 200 room messages and delegates to `summarizeIfNeeded()`. A summary is only generated when there are at least 50 `broadcast` events. The summarizer groups broadcasts by scope, tracks up to 10 distinct queries per scope, sums tokens, keeps the latest seen timestamp string, and posts the result back into the same room as an `m.room.message` with `m.ctx.type = "summary"`. The summary is not written to disk and not stored in Matrix state. In the traced source sweep for iteration 4, no in-tree caller of `summarizeRoom()` or `summarizeIfNeeded()` was found beyond their own definitions.
- Why it matters for Code_Environment/Public: The summary feature is implemented, but it currently looks inert unless some future CLI path, cron, or external caller invokes it. That keeps summary generation in the "available capability" bucket rather than the "proven runtime behavior" bucket.
- Affected subsystem: room compaction and digesting
- Open questions resolved: Q6
- Risk / ambiguity: Because the trigger is count-based only and there is no summary dedup marker, repeated calls after the threshold can post repeated summaries over the same underlying history (`external/src/lib/mainframe/summarizer.ts:23-29`, `external/src/lib/mainframe/summarizer.ts:101-108`).

### F4.7 -- Mainframe is operationally optional but privacy-sensitive when enabled: agent identity is persistent, credentials are stored locally, and room history carries raw query/context metadata
- Source evidence: `external/src/mcp.ts:66-90`, `external/src/lib/mainframe/bridge.ts:26-57`, `external/src/lib/mainframe/bridge.ts:80-83`, `external/src/lib/mainframe/rooms.ts:37-53`, `external/src/lib/mainframe/client.ts:124-129`, `external/src/lib/mainframe/client.ts:182-188`
- Evidence type: source-proven
- What it shows: Bootstrap only constructs a `MainframeBridge` when either global or project mainframe config is enabled. Once enabled, the bridge loads or creates `.contextador/mainframe-agent.json`, storing a persistent `agentId`, plaintext `password`, and `createdAt` on disk. Broadcasts then post raw query text, scopes, pointers, token counts, and a validation marker into room history. The client uses direct HTTPS fetches to the Operator server with a 3-second timeout. Newly created rooms set `visibility: "private"` but also `preset: "public_chat"`, with an inline comment that says this allows any registered user to join.
- Why it matters for Code_Environment/Public: The design is lightweight to operate, but it trades that simplicity for durable metadata exposure. Persistent identities make cross-session coordination possible, yet they also create a stable audit trail tied to one local workspace, and the room configuration is not obviously private in the strictest sense.
- Affected subsystem: privacy, setup, and Operator dependency
- Open questions resolved: Q7
- Risk / ambiguity: The code proves enablement is optional, but it does not prove deployment guidance, retention policy, or room membership hardening beyond the low-level client calls. Those remain README- or operator-policy-level questions.

### F4.8 -- Conflict resolution remains shallow: shared-state writes are blind overwrites, local repair writes do not reconcile against Mainframe summaries or broadcasts, and cache-hit accounting is only partially visible here
- Source evidence: `external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/client.ts:163-172`, `external/src/mcp.ts:203-207`, `external/src/mcp.ts:221-276`, `external/src/lib/mainframe/summarizer.ts:101-108`
- Evidence type: inferred from source
- What it shows: The traced Mainframe path has no merge policy beyond last writer wins on Matrix room state. Budget updates, janitor locks, and summary posts are all plain writes with no revision checks or compare-and-swap. On the local side, `context` can repair missing local `CONTEXT.md` files, record hits, and broadcast pointers, but there is no reverse path that reconciles remote summaries or broadcasts back into local repair logic. The only cache-hit metric visible in this iteration is the boolean `recordQuery(ROOT, cachedOutput.length, true)` call on a Mainframe hit; proving how that aggregates into reported savings requires the deferred `stats.ts` pass.
- Why it matters for Code_Environment/Public: This is the clearest partial answer to Q8. Mainframe currently coordinates presence, history reuse, and advisory locking, but it does not provide deep conflict resolution between shared state and local repair/self-healing paths.
- Affected subsystem: distributed consistency and measurement
- Open questions resolved: partial Q8
- Risk / ambiguity: This finding is partly absence-based. The source clearly shows blind writes and missing reconciliation hooks in the traced path, but a fuller claim about observed cache-hit metrics still depends on `external/src/lib/core/stats.ts`, which was intentionally deferred to iteration 5.

## Mainframe sync flow diagram

```text
context(query)
  -> normalize query into lowercase 3+ char keywords
  -> hashKeywords(sorted keyword bag)
  -> mainframe.checkHistory(queryHash)
     -> if cache older than 60s: fetch last 100 room messages
     -> findMatchingBroadcast(queryHash, optional 24h cutoff)
     -> return prior pointers on hit
  -> else route locally and build pointers
  -> record local hit_log with same queryHash
  -> mainframe.postBroadcast(...)
     -> build broadcast payload
     -> send m.room.message
     -> record local daily spend
     -> update m.ctx.budget room state
  -> optional summarizeRoom()
     -> fetch last 200 room messages
     -> if 50+ broadcasts: post summary message

context_sweep
  -> acquireJanitorLock()
     -> read m.ctx.janitor_lock
     -> reject fresh foreign lock under 10m
     -> otherwise overwrite lock state
  -> run local janitor
  -> releaseJanitorLock()
```

## Newly answered key questions
- Q6: Mainframe sync is a shared room-history reuse layer plus lightweight coordination. It shares prior pointer payloads through `broadcast` messages, free-form task requests through `request` messages, optional scope digests through `summary` messages, and two room-state records for budget and janitor locking (`external/src/lib/mainframe/rooms.ts:37-69`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/summarizer.ts:79-108`).
- Q7: The privacy and ops tradeoff is explicit in code: Mainframe is opt-in, but when enabled it persists a stable local agent identity plus password, posts raw query/context metadata into Matrix room history, and relies on a best-effort Matrix server path with 3-second timeouts and retry logic rather than a stronger distributed coordination backend (`external/src/mcp.ts:66-90`, `external/src/lib/mainframe/bridge.ts:26-57`, `external/src/lib/mainframe/client.ts:81-92`, `external/src/lib/mainframe/client.ts:124-129`).
- Partial Q8: Cache-hit measurement is only partly visible here. The source proves that a Mainframe history hit sets the `cached` flag in `recordQuery(...)`, but it does not prove how that rolls up into the README-level token-savings claim until `stats.ts` is traced (`external/src/mcp.ts:203-207`).

## Open questions still pending
- Q3: How lossy are the serialized pointer payloads versus the raw local `CONTEXT.md` sources once shared through Mainframe?
- Q8: What does `stats.ts` actually compute from the `cached` flag, and does it justify the stated token-reduction percentages?
- Q9: What are the exact setup prerequisites and runtime assumptions around Bun, providers, Operator, and Docker in the user-facing docs?
- Q12: Which README-level claims about Mainframe, caching, or licensing overstate what the traced runtime proves?

## Recommended next focus (iteration 5)
Iteration 5 should do the README-level and stats reality check by reading `external/src/lib/core/stats.ts`, `external/package.json`, `external/README.md`, `external/TROUBLESHOOTING.md`, and `external/LICENSE-COMMERCIAL.md`. The goal is to verify the 93% token-reduction claim against the stats implementation, document setup prerequisites including Bun, providers, and Docker, and document the AGPL plus commercial licensing model precisely.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.73
- status: insight
- findingsCount: 8
