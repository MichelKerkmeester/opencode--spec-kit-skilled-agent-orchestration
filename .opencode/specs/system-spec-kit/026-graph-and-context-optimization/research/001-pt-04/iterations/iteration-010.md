# Iteration 10 -- 003-contextador

## Metadata
- Run: 10 of 13
- Focus: Mainframe test audit plus first production-source trace of the budget tracker
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T12:23:50Z
- Tool calls used: 12

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `1-220`
2. `research/iterations/iteration-009.md` `1-86`
3. `research/deep-research-state.jsonl` `3-10`
4. `external/src/lib/mainframe/budget.ts` `1-102`
5. `external/src/lib/mainframe/budget.test.ts` `1-42`
6. `external/src/lib/mainframe/dedup.test.ts` `1-26`
7. `external/src/lib/mainframe/rooms.test.ts` `1-28`
8. `external/src/lib/mainframe/summarizer.test.ts` `1-53`
9. `external/src/lib/mainframe/client.test.ts` `1-18`
10. `research/iterations/iteration-004.md` `1-142`
11. `external/src/lib/mainframe/bridge.ts` `119-185`, `188-194`, `283-289`

## Findings

Evidence posture for this iteration:
- Source-proven claims below come from `external/src/lib/mainframe/budget.ts`, `external/src/lib/mainframe/bridge.ts`, and the five Mainframe test files read in this pass (`external/src/lib/mainframe/budget.ts:1-102`, `external/src/lib/mainframe/bridge.ts:119-185`, `external/src/lib/mainframe/bridge.ts:188-194`, `external/src/lib/mainframe/bridge.ts:283-289`, `external/src/lib/mainframe/budget.test.ts:1-42`, `external/src/lib/mainframe/dedup.test.ts:1-26`, `external/src/lib/mainframe/rooms.test.ts:1-28`, `external/src/lib/mainframe/summarizer.test.ts:1-53`, `external/src/lib/mainframe/client.test.ts:1-18`).
- The earlier shared-cache and privacy/conflict baseline came from the source-only Mainframe pass in iteration 4, especially the cache/freshness finding and the privacy/conflict findings (`research/iterations/iteration-004.md:41-48`, `research/iterations/iteration-004.md:77-93`).
- No README claims were needed for this iteration; any robustness or adoption posture changes below are derived from source plus test coverage, not from documentation copy (`external/src/lib/mainframe/budget.ts:1-102`, `external/src/lib/mainframe/budget.test.ts:1-42`, `external/src/lib/mainframe/dedup.test.ts:1-26`, `external/src/lib/mainframe/rooms.test.ts:1-28`, `external/src/lib/mainframe/summarizer.test.ts:1-53`, `external/src/lib/mainframe/client.test.ts:1-18`).

### Mainframe test coverage matrix

| Module | Test file | Behaviors covered (concrete) | Behaviors NOT covered or aspirational | Confidence delta vs F8/F9 source-only |
|--------|-----------|------------------------------|----------------------------------------|----------------------------------------|
| Budget tracker | `external/src/lib/mainframe/budget.test.ts` | Confirms local daily spend blocking after `record()`, room hourly limit blocking, pause blocking spend but not reads, `kill()` blocking both spend and reads until `resume()`, and one-shot 80% alert behavior (`external/src/lib/mainframe/budget.test.ts:4-42`). | No tests cover UTC day rollover, reconnect hydration from room state, persistence across process restarts, `used_today` reconciliation, concurrent broadcasters, or stale local `roomBudget` after `setState()` writes (`external/src/lib/mainframe/budget.test.ts:4-42`, `external/src/lib/mainframe/budget.ts:90-100`, `external/src/lib/mainframe/bridge.ts:169-175`). | Strong upgrade for the cost-control slice of F9: the blocking rules are now test-confirmed, but shared-state durability and race handling remain source-only. |
| Query-hash dedup | `external/src/lib/mainframe/dedup.test.ts` | Confirms exact `queryHash` reuse returns the matching broadcast payload, no-match returns null, and synthetic stale timestamps are rejected (`external/src/lib/mainframe/dedup.test.ts:5-26`). | No tests cover the bridge's 60-second message cache, the 100-message history window, collisions from normalized keyword bags, missing `timestamp` fields on real broadcasts, or end-to-end reuse through `checkHistory()` (`external/src/lib/mainframe/dedup.test.ts:5-26`, `research/iterations/iteration-004.md:41-48`). | Small upgrade for F8: matching and stale-rejection mechanics are test-backed, but the real shared-cache freshness story is still mostly source-only. |
| Room protocol shapes | `external/src/lib/mainframe/rooms.test.ts` | Confirms `buildBroadcast()` emits `m.text` plus `m.ctx.type = "broadcast"` with `query_hash`, `isBroadcast()`/`isRequest()` discriminate correctly, `parseBroadcast()` recovers query and hash, and `buildRequest()` emits the expected request envelope (`external/src/lib/mainframe/rooms.test.ts:4-28`). | No tests cover summaries in the shared room, private-room enforcement, message retention, multi-agent conflicts, malformed envelopes, or whether payload contents are appropriate for privacy-sensitive deployments (`external/src/lib/mainframe/rooms.test.ts:4-28`, `research/iterations/iteration-004.md:77-84`). | Moderate upgrade for the F8 protocol-envelope claim, but almost no upgrade for F9 because payload-shape tests do not validate privacy or conflict policy. |
| Summary generation | `external/src/lib/mainframe/summarizer.test.ts` | Confirms summary creation gates below/at threshold, groups scopes with deterministic counts and token totals, serializes readable text, and tags summary messages so they can be recognized (`external/src/lib/mainframe/summarizer.test.ts:19-53`). | No tests cover any in-tree caller triggering summarization, duplicate summary suppression, room-history truncation, summary privacy, or interaction with real broadcast traffic over time (`external/src/lib/mainframe/summarizer.test.ts:19-53`, `research/iterations/iteration-004.md:68-75`). | Slight upgrade for "summary capability exists," but no upgrade for "summary compaction is active in practice"; that still stays source-only and hedged. |
| Matrix client | `external/src/lib/mainframe/client.test.ts` | Confirms only construction with server URL, default disconnected state, generated agent-id format, and custom agent-id override (`external/src/lib/mainframe/client.test.ts:4-18`). | No tests cover retries, timeouts, auth failures, room creation/join behavior, state read/write correctness, or any robustness surface despite iteration 4's privacy/ops concerns relying heavily on client behavior (`external/src/lib/mainframe/client.test.ts:4-18`, `research/iterations/iteration-004.md:77-84`, `research/iterations/iteration-004.md:86-93`). | Negative delta for F9 confidence: the robustness story remains source-only, and the absence of tests should soften any adoption claim that implies hardened Matrix behavior. |

### Budget tracker first-trace

The production tracker is a local gatekeeper with six tracked dimensions: `dailyLimit`, `usedToday`, `currentDate`, optional room budget `{ hourly_limit, used_this_hour, paused }`, a hard `killed` flag, and a one-shot `alertFired` latch (`external/src/lib/mainframe/budget.ts:16-22`, `external/src/lib/mainframe/budget.ts:24-27`, `external/src/lib/mainframe/budget.ts:65-73`). It blocks in two ways. `canSpend(tokens)` returns false when the bridge is killed, the room budget is paused, the local daily ceiling would overflow, or the room hourly ceiling would overflow; `canRead()` returns false only when hard-killed (`external/src/lib/mainframe/budget.ts:29-46`). The bridge uses those gates asymmetrically: history reads and task requests are guarded by `canRead()`, while broadcasts are guarded by `canSpend(tokensUsed)` (`external/src/lib/mainframe/bridge.ts:128-155`, `external/src/lib/mainframe/bridge.ts:283-289`).

State loading and persistence are split between the tracker and the bridge. On connect, the bridge reads Matrix room state `m.ctx.budget` and hydrates the tracker with `updateRoomBudget(budgetState)` (`external/src/lib/mainframe/bridge.ts:119-123`). After a successful broadcast, the bridge increments local spend with `record(tokensUsed)`, then separately re-reads room state, increments `used_this_hour` and `used_today`, and writes the whole object back with `setState()` (`external/src/lib/mainframe/bridge.ts:166-175`). The tracker itself only stores `hourly_limit`, `used_this_hour`, and `paused` for shared room budget state; it has no internal slot for shared `used_today`, and nothing in this slice feeds the updated room state back into the tracker's local `roomBudget` after the write (`external/src/lib/mainframe/budget.ts:10-14`, `external/src/lib/mainframe/budget.ts:53-55`, `external/src/lib/mainframe/bridge.ts:169-175`).

Recovery is narrow and mostly local. `resume()` only clears `killed`, while `maybeReset()` resets `usedToday` and `alertFired` when the UTC date string changes; there is no hourly reset logic, no persisted local snapshot, and no reconciliation path if room state diverges while the process is down (`external/src/lib/mainframe/budget.ts:57-63`, `external/src/lib/mainframe/budget.ts:90-100`). The tests confirm the enforced surfaces that matter most operationally today: daily overspend blocking, room-hour blocking, pause semantics, hard kill/read blocking, and one-shot alerting at 80% of the daily limit (`external/src/lib/mainframe/budget.test.ts:4-42`). What they do not confirm is exactly the risky part for a shared multi-agent system: reconnect behavior, concurrent room-state updates, or whether the bridge and tracker can drift after a broadcast (`external/src/lib/mainframe/budget.test.ts:4-42`, `external/src/lib/mainframe/bridge.ts:169-175`).

### F10.1 -- F8 shared-cache confidence rises from pure source-reading to "protocol and hash mechanics smoke-tested," but freshness and real cache lifecycle still do not
- Iteration 4 established the source-only shared-cache story: history reuse comes from scanning prior `broadcast` events with a nominal TTL and a shallow room-history window (`research/iterations/iteration-004.md:41-48`).
- This iteration upgrades two parts of that claim. `rooms.test.ts` proves the `broadcast` and `request` envelope shapes the cache depends on, and `dedup.test.ts` proves exact-hash matching plus stale-timestamp rejection (`external/src/lib/mainframe/rooms.test.ts:4-28`, `external/src/lib/mainframe/dedup.test.ts:5-26`).
- The important hedge remains unchanged: there is still no test for the bridge's 60-second memoized fetch window, 100-message limit, or the real-world missing-timestamp gap discussed in iteration 4, so F8 should move from "source-only" to "partly test-confirmed" rather than to "fully validated" (`research/iterations/iteration-004.md:41-48`, `external/src/lib/mainframe/dedup.test.ts:22-26`).

### F10.2 -- F9 privacy/conflict posture does not materially strengthen from Mainframe tests, because the tests stop at payload shape and constructor smoke checks
- Iteration 4's privacy/conflict story rested on persistent credentials, durable room history containing raw query metadata, and blind shared-state overwrites for budget/lock coordination (`research/iterations/iteration-004.md:77-93`).
- The new tests do not challenge or deepen that story. `rooms.test.ts` only validates envelope structure, while `client.test.ts` only covers URL storage, disconnected default state, and agent-id generation/override (`external/src/lib/mainframe/rooms.test.ts:4-28`, `external/src/lib/mainframe/client.test.ts:4-18`).
- There are still no tests for room privacy semantics, credential storage, last-writer-wins races, lock conflicts, or failure handling across Matrix operations, so F9 should stay mostly source-proven and explicitly hedged in any synthesis (`research/iterations/iteration-004.md:77-84`, `research/iterations/iteration-004.md:86-93`, `external/src/lib/mainframe/client.test.ts:4-18`).

### F10.3 -- The budget tracker is now its own documented subsystem: real enforcement is test-backed, but shared-room quota coordination is still shallow
- The source now reads as a distinct subsystem instead of a minor helper: the tracker gates read access, write access, alerting, daily reset, and kill/resume state in one place (`external/src/lib/mainframe/budget.ts:16-22`, `external/src/lib/mainframe/budget.ts:29-46`, `external/src/lib/mainframe/budget.ts:65-73`, `external/src/lib/mainframe/budget.ts:90-100`).
- The bridge integrates it in exactly three places that matter operationally: room-budget hydration on connect, broadcast blocking plus spend recording, and free coordination requests that bypass spend limits but not hard kill (`external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:145-185`, `external/src/lib/mainframe/bridge.ts:283-289`).
- Tests now confirm the concrete enforcement rules users would actually feel first, but they do not prove durable reconciliation or concurrency safety, so this subsystem should be described as a local cost guard layered onto blind Matrix state updates, not as a durable shared quota service (`external/src/lib/mainframe/budget.test.ts:4-42`, `external/src/lib/mainframe/bridge.ts:169-175`).

### F10.4 -- Mainframe coverage gaps are significant enough to soften any "prototype later" recommendation for robustness-sensitive adoption
- `summarizer.test.ts` confirms thresholded summary generation and grouping math, which is useful evidence that summary serialization is implemented (`external/src/lib/mainframe/summarizer.test.ts:19-53`).
- But iteration 4 already showed that summary generation had no discovered in-tree caller, and this iteration adds no test evidence that the feature is scheduled or exercised in practice (`research/iterations/iteration-004.md:68-75`, `external/src/lib/mainframe/summarizer.test.ts:19-53`).
- The client situation is weaker: the file named `client.test.ts` does not test retries, timeouts, auth failures, room joins, or state I/O at all, so robustness-sensitive adoption should be framed as under-tested rather than merely unfinished (`external/src/lib/mainframe/client.test.ts:4-18`).

## Newly answered key questions
- The Mainframe shared-cache story is now partly test-confirmed at the message-shape and hash-match layer, but not at the full cache-lifecycle layer (`external/src/lib/mainframe/rooms.test.ts:4-28`, `external/src/lib/mainframe/dedup.test.ts:5-26`, `research/iterations/iteration-004.md:41-48`).
- The budget tracker really does enforce local daily spend, room-hour ceilings, pause, kill, and one-shot alerts, while still depending on bridge-mediated room-state sync for shared coordination (`external/src/lib/mainframe/budget.ts:29-46`, `external/src/lib/mainframe/budget.ts:65-73`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/budget.test.ts:4-42`).
- Mainframe test coverage does not materially reduce the privacy/conflict risks identified earlier, because those risks mostly live in room configuration, credential handling, and blind shared-state writes that are still untested (`research/iterations/iteration-004.md:77-93`, `external/src/lib/mainframe/client.test.ts:4-18`, `external/src/lib/mainframe/rooms.test.ts:4-28`).

## Open questions still pending
- Do `external/src/lib/mainframe/client.ts` or higher-level integration tests anywhere else validate retries, timeouts, auth failures, and room-state correctness, or is the Matrix transport effectively untested beyond construction smoke checks (`external/src/lib/mainframe/client.test.ts:4-18`)?
- Is the `m.ctx.budget` room state ever reconciled back into the in-memory tracker after the bridge increments `used_today` and `used_this_hour`, or can local and shared views drift until reconnect (`external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/budget.ts:53-55`)?
- Does any runtime path actually invoke summarization automatically, or does summary generation remain an available but dormant capability (`research/iterations/iteration-004.md:68-75`, `external/src/lib/mainframe/summarizer.test.ts:19-53`)?

## Recommended next focus (iteration 11)
- Setup wizard plus framework integrations trace: read `external/src/lib/setup/wizard.ts`, `external/src/lib/frameworks/index.ts`, `external/src/lib/frameworks/hermes.ts`, `external/src/lib/frameworks/openclaw.ts`, and `external/src/lib/ui.ts`.
- Goal: document what the `.mcp.json` "auto-detected" claim actually means in practice, what framework presets exist, and how much real setup automation the code proves for F12.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.46
- status: insight
- findingsCount: 4
