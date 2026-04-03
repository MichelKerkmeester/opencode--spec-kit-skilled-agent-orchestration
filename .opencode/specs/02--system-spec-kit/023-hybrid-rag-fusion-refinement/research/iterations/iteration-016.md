# Iteration 16: Hookless Auto-Utilization Improvement Opportunities

## Focus
Deep investigation of hookless auto-utilization improvements -- specifically: (1) auto-surface optimization, (2) session state persistence architecture, (3) profile-based result formatting, (4) auto-context loading, (5) progressive disclosure improvements. All solutions must work without Claude Code hooks.

## Findings

### Finding 1: Session State IS Already SQLite-Persisted (Correction of Iteration 4/8)
Iterations 4 and 8 described the session system as "ephemeral by design." This is only partially true. The session-manager.ts module uses SQLite tables (`session_state`, `session_sent_memories`) for durable state:
- `session_state` stores specFolder, currentTask, lastAction, contextSummary, pendingWork, tenantId/userId/agentId, data JSON
- `session_sent_memories` stores dedup hashes for cross-turn filtering
- Sessions have 30-minute TTL with periodic cleanup (every 30 min) and stale cleanup (every 1 hour, 24h threshold)
- The session_state has a `_recovered` flag for crash recovery

What IS ephemeral: the cognitive `working-memory.ts` in-process Map (attention signals, co-activation weights). This module is wiped when the MCP server process ends. The distinction matters for UX: session identity and dedup are durable; attention-based scoring adjustments are not.

**Improvement opportunity**: The working-memory attention map could optionally persist to SQLite on a periodic flush (e.g., every 5 minutes or on graceful shutdown), enabling cross-restart attention continuity. Currently, attention signals built over many tool calls are lost on MCP restart.

[SOURCE: session-manager.ts:84-99 (SessionState interface), session-manager.ts:181-186 (CONFIG), session-manager.ts:202-258 (init with SQLite schema + intervals)]

### Finding 2: Profile Formatters Provide Intent-Aware Result Presentation (Already Implemented)
The profile-formatters.ts module already implements 4 named presentation profiles:
- **quick**: topResult + oneLineWhy + omittedCount + tokenReduction stats -- minimal for fast decisions
- **research**: results[] + evidenceDigest + followUps[] -- full results with synthesis
- **resume**: state + nextSteps + blockers + topResult -- session recovery shape
- **debug**: full trace + tokenStats -- no omission

Feature-flagged via `SPECKIT_RESPONSE_PROFILE_V1` (default ON). The `applyResponseProfile()` function routes based on the `profile` parameter passed by the caller.

**Gap**: The profile is caller-selected, not auto-detected. The system does NOT automatically choose the best profile based on query intent. For example, a `fix_bug` intent query could auto-select `debug` profile, while a `find_spec` intent could auto-select `quick` profile. The intent classifier already exists (`classifyIntent()`) but is not wired to profile selection.

[SOURCE: profile-formatters.ts:1-112 (module header + types), profile-formatters.ts:402-426 (routing switch)]

### Finding 3: Auto-Surface Architecture Is Hookless But Lives in hooks/ Directory
The `memory-surface.ts` module lives at `mcp_server/hooks/memory-surface.ts` despite being invoked by the MCP context-server dispatch path (fully hookless). This is a naming/organizational concern, not functional.

The auto-surface flow:
1. Non-memory tool call arrives at context-server dispatch
2. Context hint extracted from tool args (input/query/prompt/specFolder/concepts)
3. Constitutional memories fetched (1-min cache, limit 10, SELECT from memory_index WHERE importance_tier='constitutional')
4. Trigger matching via `triggerMatcher.matchTriggerPhrases(contextHint, 5)` -- returns top 5 matches
5. PI-A4: Constitutional memories enriched with retrieval_directive metadata
6. Token budget enforced (4000 tokens for tool-dispatch, 4000 for compaction)
7. On first tool call: T018 Prime Package built with specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls

**Improvement opportunity A**: The trigger matcher receives only a single context hint (the current tool call's input/query text). It does not consider the *conversation trajectory* -- prior queries, established focus areas, or the working session's accumulated intent. If the trigger matcher received the session's top-N attention-weighted concepts (from working-memory), it could surface more relevant memories.

**Improvement opportunity B**: The constitutional memory limit of 10 is hardcoded. For users with large memory stores (100+ constitutional memories), this could miss important always-surface content. A dynamic limit based on token budget utilization would be more adaptive.

[SOURCE: hooks/memory-surface.ts:76-84 (MEMORY_AWARE_TOOLS), hooks/memory-surface.ts:86-95 (cache config), hooks/memory-surface.ts:120-138 (extractContextHint), hooks/memory-surface.ts:273-314 (autoSurfaceMemories)]

### Finding 4: Prime Package Is Context-Sparse
The T018 Prime Package (built on first tool call) provides:
- specFolder (from tool args, may be null)
- currentTask (from input/query/prompt, truncated to 200 chars)
- codeGraphStatus (fresh/stale/empty based on lastScan timestamp)
- cocoIndexAvailable (boolean)
- recommendedCalls (string[])

**Gap**: The Prime Package does not include:
- Memory system health (total memories, last index time, hot/warm/cold distribution)
- Recent session state (was there a prior session? What was being worked on?)
- Active spec folder detection (look at git status or recently modified spec folders)
- Open knowledge gaps (from task_preflight records or learning history)

Adding these would give the LLM consumer a richer bootstrap context on first interaction, reducing the number of follow-up queries needed to establish working context.

[SOURCE: hooks/memory-surface.ts:63-70 (PrimePackage interface), hooks/memory-surface.ts:317-349 (buildPrimePackage)]

### Finding 5: Auto-Context for Related Specs Is Not Implemented
When a user references a spec folder (e.g., "check spec 011"), the system searches for matching memories but does NOT automatically load the related spec's metadata (parent phases, sibling specs, dependencies). The memory_context tool does intent-based routing but treats each query independently.

**Improvement opportunity**: When a specFolder parameter is provided, the system could auto-discover and surface:
- Parent spec folder (e.g., 023-hybrid-rag-fusion-refinement for a phase like 011-indexing-and-adaptive-fusion)
- Sibling phases (other phases under the same parent)
- Causal graph neighbors (memories linked via causal_edges)

This is partially available via `memory_drift_why` (causal chain tracing) but is not automatically injected. Auto-injecting a "spec neighborhood" summary when a specFolder is explicitly provided would reduce manual navigation.

[INFERENCE: based on memory-surface.ts auto-surface flow (no spec-neighborhood logic) and session-manager.ts (specFolder stored but not used for auto-expansion)]

### Finding 6: Progressive Disclosure Could Use Smarter Default Page Size
The progressive disclosure system defaults to 5 results per page with 5-minute cursor TTL. The page size is static regardless of:
- Query complexity (broad vs. narrow queries)
- Result score distribution (tight cluster vs. spread scores)
- Profile mode (quick should show 1, research should show more)
- Token budget utilization (if budget allows more, show more)

**Improvement opportunity**: Dynamic page size based on confidence gap analysis. When results have a clear "elbow" in score distribution (already detected by `confidence-truncation.ts`), the first page could include all results above the elbow. When scores are tightly clustered (no clear winner), show fewer results with more detail per result. This leverages existing elbow detection without new algorithms.

[INFERENCE: based on progressive-disclosure.ts defaults (iteration 4: 5/page) and confidence-truncation.ts elbow detection (iteration 9)]

### Finding 7: Intent-to-Profile Auto-Routing Would Be the Highest-Impact Hookless UX Improvement
Synthesizing findings 2-6, the single highest-impact improvement for hookless auto-utilization would be **auto-routing query intent to response profile**:

| Detected Intent | Auto-Profile | Rationale |
|----------------|-------------|-----------|
| understand | research | User wants deep context, needs evidence digest and follow-ups |
| find_spec | quick | User wants a specific answer, top result is sufficient |
| find_decision | research | Decision context needs multiple supporting memories |
| fix_bug | debug | User benefits from full trace and scoring details |
| add_feature | research | Feature context needs related spec neighborhood |
| refactor | quick | Usually looking for a specific pattern or decision |
| security_audit | debug | Audit trail needs full scoring transparency |

This requires ~30 lines of code: a mapping table and a conditional in the response envelope builder. The intent classifier and profile formatters both already exist. Currently both features work but are not connected.

[INFERENCE: based on profile-formatters.ts (4 profiles exist), search-flags.ts classifyIntent() (7 intents exist), and the gap between them (no auto-routing)]

## Ruled Out
- Session state persistence to SQLite as improvement: Already implemented. The session_state and session_sent_memories tables provide durable session tracking.
- Profile system as missing feature: Already implemented with 4 profiles. The gap is auto-selection, not existence.
- Auto-surface as needing fundamental redesign: Architecture is sound. Improvements are incremental (attention-enriched context hints, dynamic constitutional limit).

## Dead Ends
None -- all investigation areas yielded actionable findings or corrections.

## Sources Consulted
- `mcp_server/lib/session/session-manager.ts:84-258` (session types, config, init, SQLite persistence)
- `mcp_server/hooks/memory-surface.ts:1-350` (auto-surface flow, constitutional caching, Prime Package)
- `mcp_server/lib/response/profile-formatters.ts:1-150` (profile types, routing, token reduction)
- `mcp_server/lib/search/progressive-disclosure.ts:59` (progressive response shape)
- Prior iterations: 4 (UX/auto-utilization baseline), 8 (session state verdict), 9 (confidence truncation)

## Assessment
- New information ratio: 0.50
- Questions addressed: hookless auto-utilization depth (6 investigation areas)
- Questions answered: session persistence architecture (corrects iteration 4/8), profile auto-routing gap, auto-context gap, progressive disclosure improvement path

## Reflection
- What worked and why: Reading the actual session-manager init() and SQLite schema setup revealed that session state IS persisted -- the "ephemeral by design" finding from iteration 8 was about working-memory attention signals specifically, not session state broadly. Reading source code corrected a prior simplification.
- What did not work and why: The auto-surface file was not at the expected path (lib/search/auto-surface*.ts as suggested in dispatch instructions). It lives at hooks/memory-surface.ts. Glob found it quickly (1 extra tool call).
- What I would do differently: When the dispatch suggests specific file paths, verify with Glob first rather than attempting direct Read.

## Recommended Next Focus
The highest-impact improvement identified is **intent-to-profile auto-routing** (Finding 7). This connects two existing systems (intent classifier + profile formatters) with minimal code change. A follow-up iteration could draft the exact implementation or investigate whether the working-memory attention persistence (Finding 1) is worth the complexity.

Alternatively, if research is converging, proceed to final synthesis consolidating all 16 iterations into the definitive research output.
