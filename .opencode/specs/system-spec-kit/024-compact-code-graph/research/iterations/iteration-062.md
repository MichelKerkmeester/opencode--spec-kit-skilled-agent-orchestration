# Iteration 62: MCP First-Call Priming Deep Dive -- Session Detection and Cross-Runtime Design

## Focus
Design the MCP first-call priming mechanism in detail. Iteration 58 identified a four-tier fallback architecture (T1: hooks, T1.5: MCP first-call priming, T2: instruction-file triggers, T3: commands, T4: Gate 1) and proposed "first-call priming" as a universal T1.5 mechanism that works across all runtimes without hooks. This iteration examines the existing session management, memory-context handler, and instruction files to produce a concrete design for session detection and context injection within the MCP server itself.

## Findings

### 1. Session Detection Mechanism Already Exists in `resolveTrustedSession`
The `session-manager.ts` function `resolveTrustedSession()` (line 385) already provides the session detection primitive:
- When `requestedSessionId` is null or empty, it generates a fresh `crypto.randomUUID()` and returns `trusted: false`
- When a valid tracked session ID is provided, it returns `trusted: true` with identity corroboration
- The `trusted: false` + `requestedSessionId: null` combination is the exact signal for "new session from a client that does not manage sessions" -- which is every non-hook runtime

**Design implication**: The MCP server can detect "first call in a new session" by tracking whether a given ephemeral session ID has been seen before. Since non-hook runtimes never pass a sessionId, every call generates a new UUID. The server needs an in-memory timestamp map keyed by a higher-level identity (tenantId + userId + agentId hash, or a process-level singleton if no identity is available).

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-435]

### 2. memory-context Handler Has a Complete Mode Resolution Pipeline
The `handleMemoryContext` function (line 980) follows a clear pipeline:
1. `resolveSessionLifecycle()` -- determines if session is new or resumed
2. `resolveEffectiveMode()` -- picks mode (auto/quick/deep/focused/resume) with intent classification, resume heuristics, and pressure policy override
3. Strategy execution with token budget enforcement
4. Response envelope construction

The resume heuristic in `resolveEffectiveMode()` (lines 801-814) already auto-detects resume-like queries by keyword matching (`resume`, `continue`, `pick up`, `where was i`, `what's next`) and session state (`session.resumed` flag, `priorMode === 'resume'`).

**Design implication for first-call priming**: The priming mechanism should NOT modify memory-context's existing pipeline. Instead, it should be a separate interceptor layer that runs BEFORE the handler, injecting a lightweight context preamble into the first MCP response of a new session. This keeps the existing mode resolution clean and avoids coupling.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:724-849, 980]

### 3. CODEX.md Establishes the Instruction-File Trigger Pattern (T2)
CODEX.md already contains explicit instruction patterns for forcing tool calls:
- Line 9: "FIRST ACTION -- call: `memory_context({ input: 'resume previous work', mode: 'resume', profile: 'resume' })`"
- Line 16-18: Documents `memory_match_triggers(prompt)` and `memory_context({ mode: "resume" })` as cross-runtime primitives
- Line 21-26: Query-intent routing table directing semantic queries to CocoIndex, structural to code_graph, session to memory

The same patterns exist in `.claude/CLAUDE.md` for Claude Code.

**Key gap**: CODEX.md does not include any instruction to call code graph tools on startup or session start. It only references code graph under "Query-Intent Routing" and "Available MCP Tools", not as a startup action. This means non-hook runtimes (Codex CLI, Copilot, Gemini CLI) have no instruction-level trigger to auto-prime code graph context.

[SOURCE: CODEX.md:1-32]

### 4. OpenCode Agent Definitions Use Gate 1 for Context Loading (T4)
The OpenCode agent directory (`.opencode/agent/`) contains 10 agents. The orchestrate agent (`.opencode/agent/orchestrate.md`) shows the standard pattern:
- Gate 1 (CLAUDE.md) requires `memory_match_triggers(prompt)` on each new user message
- No agent definition contains startup-specific tool call instructions
- Agents receive their instructions when dispatched, not at session start
- The agent system relies on CLAUDE.md's Gate 1 for context surfacing, not agent-level initialization

**Design implication**: OpenCode agents cannot self-trigger code graph on startup because they have no lifecycle hook -- they are dispatched by the orchestrator with a task. The "startup" concept for OpenCode agents is "first user message in a conversation", which is handled by Gate 1's `memory_match_triggers`. First-call priming at the MCP level would transparently serve these agents without requiring changes to agent definitions.

[SOURCE: .opencode/agent/orchestrate.md:1-80]

### 5. Concrete First-Call Priming Design

**Architecture**: A process-level `SessionTracker` singleton in the MCP server that maintains a Map of identity hashes to first-call timestamps.

```typescript
// New file: mcp_server/lib/session/first-call-tracker.ts

interface FirstCallRecord {
  firstCallAt: number;     // Unix timestamp ms
  callCount: number;       // Total calls in this "logical session"
  lastCallAt: number;      // For TTL-based expiry
  primedTools: Set<string>; // Which tools have been primed
}

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes (matches session-manager)
const tracker = new Map<string, FirstCallRecord>();

function getIdentityHash(scope: { tenantId?: string; userId?: string; agentId?: string }): string {
  // Hash of identity fields, or "anonymous" for no-identity callers
  // Falls back to process-level singleton for anonymous callers
}

function isFirstCall(scope: IdentityScope, toolName: string): boolean {
  const key = getIdentityHash(scope);
  const record = tracker.get(key);
  if (!record || (Date.now() - record.lastCallAt > SESSION_TTL_MS)) {
    // New session or expired -- this IS a first call
    tracker.set(key, { firstCallAt: Date.now(), callCount: 1, lastCallAt: Date.now(), primedTools: new Set([toolName]) });
    return true;
  }
  record.callCount++;
  record.lastCallAt = Date.now();
  if (!record.primedTools.has(toolName)) {
    record.primedTools.add(toolName);
    return true; // First call for THIS tool, even if not first call overall
  }
  return false;
}
```

**Priming behavior by tool**:
- `memory_context` / `memory_search` / `memory_match_triggers`: If first call, append a `sessionPriming` field to the response envelope containing: (a) interrupted session hints, (b) most recent spec folder, (c) code graph staleness indicator
- `code_graph_query` / `code_graph_context`: If first call, check index freshness and append a `freshnessWarning` if index is stale (>1 hour since last scan)
- `ccc_search` (CocoIndex): If first call, check CocoIndex availability and append status hint

**Integration point**: The priming layer wraps existing handlers. In the MCP tool dispatch (`tools/index.ts`), each handler call is wrapped:

```typescript
const result = await handler(args);
if (firstCallTracker.isFirstCall(scope, toolName)) {
  result.sessionPriming = await buildPrimingContext(scope, toolName);
}
return result;
```

[INFERENCE: based on session-manager.ts architecture, memory-context.ts pipeline, and CODEX.md patterns]

### 6. Session Detection Without Hooks -- TTL-Based Logical Sessions
The key insight is that MCP servers are long-running processes. When a new AI session starts (user opens a new conversation), the MCP server does NOT restart. Without hooks, the server has no explicit signal that a new session has begun.

**TTL-based detection algorithm**:
1. Track `lastCallAt` per identity hash
2. If `now - lastCallAt > SESSION_TTL_MS` (30 min gap), treat the next call as a new session start
3. This heuristic works because: (a) AI conversations have continuous back-and-forth within a session, (b) a 30-minute gap strongly correlates with a new conversation/session
4. False positives (long think time in same session) are harmless -- the priming context is additive, not destructive
5. False negatives (rapid session switches) are rare and only affect the first call of the new session

**Advantage over hooks**: This works universally across all MCP-connected runtimes (Claude Code, Copilot, Codex CLI, Gemini CLI, OpenCode) with zero runtime-specific configuration.

[INFERENCE: based on session-manager.ts TTL patterns (SESSION_CONFIG.sessionTtlMinutes = 30) and MCP server architecture as long-running process]

### 7. Token Budget for Priming Context
The priming context must be lightweight to avoid bloating responses:
- **Minimal prime** (~100 tokens): Interrupted session hint + last spec folder + graph freshness
- **Standard prime** (~300 tokens): Minimal + recent task context + available tools reminder
- **Full prime** (~800 tokens): Standard + resumed context snippet (only when memory_context called with resume-like input)

Budget enforcement: Use existing `estimateTokens()` from `formatters/token-metrics.ts`. Priming tokens are counted OUTSIDE the main tool's token budget (additive, not competitive) but capped at 300 tokens for non-memory tools and 800 for memory tools.

[INFERENCE: based on token budget patterns in memory-context.ts (T205 enforcement at lines 286-389) and layer-definitions.ts budget tiers]

### 8. Instruction-File Enhancement for Code Graph Auto-Priming
CODEX.md and equivalent files should be enhanced to include code graph in the "Context Retrieval Primitives" section:

```markdown
## Context Retrieval Primitives

Three retrieval primitives work across all runtimes:
1. `memory_match_triggers(prompt)` -- fast turn-start context (constitutional + triggered)
2. `memory_context({ mode: "resume", profile: "resume" })` -- session recovery after compaction
3. `code_graph_status()` -- check code graph freshness; if stale, run `code_graph_scan()`

On FIRST message of a session, call all three in order.
```

This adds T2 instruction-level coverage for code graph that currently does not exist.

[SOURCE: CODEX.md:14-18, INFERENCE: gap analysis against four-tier architecture from iteration 058]

## Ruled Out
- **Modifying memory-context mode resolution for priming**: The existing `resolveEffectiveMode` pipeline is clean and well-tested. Injecting priming logic there would couple session detection with mode selection. Ruled out in favor of a separate interceptor layer.
- **Client-side session ID coordination**: Requiring non-hook runtimes to generate and pass session IDs would need changes to every runtime's instruction file and still would not detect new sessions reliably.

## Dead Ends
None identified this iteration. All approaches investigated were productive.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` (lines 1-860, 980+)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` (lines 1-460)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts` (event_counter patterns)
- `CODEX.md` (full file, 32 lines)
- `.opencode/agent/orchestrate.md` (lines 1-80)
- `.opencode/agent/` directory listing (10 agents)

## Assessment
- New information ratio: 0.72
- Questions addressed: Q15 (deep dive on MCP first-call priming mechanism)
- Questions answered: Q15 fully answered with concrete design

## Reflection
- What worked and why: Reading the actual `resolveTrustedSession()` implementation revealed the exact session detection primitive -- the `trusted: false + requestedSessionId: null` combination is the universal signal for "non-hook client, new session". This was only discoverable through source code reading.
- What did not work and why: N/A -- all research actions were productive this iteration.
- What I would do differently: Could have also read `tools/index.ts` to understand the tool dispatch layer where the interceptor would be wired, but that can be addressed in a follow-up iteration if needed.

## Recommended Next Focus
Consolidation and synthesis iteration: All Q13-Q16 are now fully answered. The next iteration should consolidate the segment 6 findings into a coherent feature improvement roadmap, cross-referencing with segments 4-5 to ensure no contradictions between the earlier architecture and the new feature/UX designs. Focus on producing a prioritized implementation backlog.
