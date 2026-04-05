# Iteration 013 — Hybrid Hook + Tool Architecture Design

**Focus:** Cross-runtime architecture for hook-based context injection on Claude Code and tool-based fallback on OpenCode, Codex, Copilot, and Gemini
**Status:** complete
**newInfoRatio:** 0.44
**Novelty:** First design pass that connects Claude hook events, existing Gate 1 behavior, `memory_context(mode:"resume")`, and the current MCP auto-surface hooks into one runtime-neutral architecture.

---

## Executive Summary

The cleanest design is a **three-layer hybrid architecture**:

1. **Runtime adapter layer**
   - Claude Code uses real hooks for reliable pre-session and pre-compaction context recovery.
   - OpenCode, Codex, Copilot, and Gemini use instruction-driven tool calls in their runtime docs and wrappers.
2. **Shared context orchestration layer**
   - A small set of scripts decides whether to run `memory_match_triggers()` or `memory_context({ mode: "resume" })`.
   - The same logic is reused by Claude hooks and by generated runtime instructions.
3. **Existing Spec Kit Memory MCP**
   - Remains the single source of truth for retrieval.
   - Continues to own compaction-aware surfacing via `context-server.ts` and `autoSurfaceAtCompaction()`.

This keeps Claude reliable without creating a Claude-only architecture, and it avoids duplicating memory logic outside the MCP server.

## Current State Observations

### 1. Existing MCP hook behavior already gives us the core compaction seam

- `context-server.ts` already treats `memory_context(... mode: "resume")` as a compaction lifecycle call.
- In that path it invokes `autoSurfaceAtCompaction(contextHint)` instead of the generic memory-aware surfacing path.
- This is the right integration seam because it already exists, is tested, and does not require a second compaction algorithm.

### 2. Existing `hooks/` is a utility layer, not a runtime hook registration system

- `mcp_server/hooks/README.md` explicitly says `hooks/` is a helper/export layer for memory surfacing and response hint injection.
- That means Claude-specific runtime hooks should live outside the MCP server and call the MCP tools, not be bolted into `mcp_server/hooks/`.

### 3. Gate 1 already gives us the fallback shape

- `CLAUDE.md` already requires `memory_match_triggers()` on each new user message.
- That means non-hook runtimes do not need a new retrieval model.
- They need a stronger, standardized instruction path for when to escalate from trigger matching to resume recovery.

### 4. `/spec_kit:resume` is already the canonical continuation surface

- Existing command and feature-catalog behavior already define `/spec_kit:resume` as the public recovery entry point.
- The hybrid design should keep that contract and use `memory_context({ mode: "resume" })` as the internal primitive behind it.

## Architecture Diagram

```text
                              +----------------------------------+
                              |     Runtime-Specific Adapter     |
                              |----------------------------------|
User / Session Event -------->| Claude: hooks                    |
                              | Codex/OpenCode/Copilot/Gemini:   |
                              | Gate docs + wrapper prompts      |
                              +----------------+-----------------+
                                               |
                                               v
                              +----------------------------------+
                              | Shared Context Orchestrator      |
                              |----------------------------------|
                              | decide action:                   |
                              | - trigger match                  |
                              | - resume recovery                |
                              | - no-op                          |
                              | render compact context packet    |
                              +----------------+-----------------+
                                               |
                         +---------------------+----------------------+
                         |                                            |
                         v                                            v
         +----------------------------------+         +----------------------------------+
         | memory_match_triggers(prompt)    |         | memory_context({                 |
         |                                  |         |   input,                         |
         | fast per-turn surfacing          |         |   mode: "resume",                |
         |                                  |         |   anchors: [state,next-steps,    |
         +----------------+-----------------+         |            summary,blockers],    |
                          |                           |   specFolder?, sessionId?        |
                          |                           | })                               |
                          |                           +----------------+-----------------+
                          |                                            |
                          +---------------------+----------------------+
                                                |
                                                v
                              +----------------------------------+
                              | Spec Kit Memory MCP Server       |
                              |----------------------------------|
                              | context-server.ts                |
                              | - autoSurfaceAtToolDispatch()    |
                              | - autoSurfaceAtCompaction()      |
                              | - appendAutoSurfaceHints()       |
                              +----------------+-----------------+
                                               |
                                               v
                              +----------------------------------+
                              | Context Packet / Resume Brief    |
                              |----------------------------------|
                              | state, next steps, blockers,     |
                              | matched phrases, surfaced hints  |
                              +----------------+-----------------+
                                               |
                                               v
                              Agent continues through Gate 2/3
```

## Recommended Design

### 1. Keep one retrieval contract across all runtimes

The architecture should standardize on only two retrieval primitives:

- **Fast turn-start surfacing:** `memory_match_triggers(prompt)`
- **Continuation / compaction recovery:** `memory_context({ mode: "resume" })`

Do not create a second hook-only retrieval protocol. Claude hooks should call the same tools the other runtimes call explicitly.

### 2. Treat hooks as transport reliability, not as separate business logic

Claude hooks are valuable because they fire even when the model forgets. They should only improve reliability of the same workflow:

- Session bootstrap
- Pre-compaction resume packet generation
- Lightweight session bookkeeping between tools

They should not replace Gate 1, Gate 2, Gate 3, or `/spec_kit:resume`.

### 3. Use `memory_context(mode:"resume")` as the compaction primitive everywhere

This matters for two reasons:

1. `context-server.ts` already routes that call through `autoSurfaceAtCompaction()`
2. `/spec_kit:resume` already depends on the same recovery model

That makes compaction recovery and interrupted-session recovery converge on one internal contract.

### 4. Avoid depending on `profile: "resume"` for `memory_context`

The safer integration point is:

- `mode: "resume"`
- stable anchors: `["state", "next-steps", "summary", "blockers"]`
- optional `specFolder`
- optional reusable `sessionId`

This avoids coupling the design to response-profile behavior that is still only partially wired for `memory_context`.

## Claude Code Hook Flow

### Hook goals

- Make initial context surfacing automatic and reliable
- Preserve resume-quality state before compaction
- Avoid duplicate or recursive memory calls
- Keep all writes out of hooks by default

### Flow by hook

#### 1. `SessionStart`

Purpose:
- Bootstrap context before the first substantial model turn

Behavior:
1. Normalize runtime payload into a shared event shape
2. Detect likely spec folder, continuation intent, or recent session ID if available
3. Run `memory_match_triggers(prompt)`
4. If continuation signals are present, also run:
   - `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder?, anchors: ["state", "next-steps", "summary", "blockers"], sessionId? })`
5. Render a compact `SESSION BRIEF` for injection

Why:
- This makes Claude reliable on first-turn recovery without changing the public `/spec_kit:resume` contract

#### 2. `PreToolUse`

Purpose:
- Prevent tool execution from happening with zero context when the session has not yet been hydrated

Behavior:
1. Read ephemeral session state
2. Skip if the pending tool is already one of:
   - `memory_context`
   - `memory_match_triggers`
   - `memory_search`
   - `memory_quick_search`
   - `memory_list`
   - `memory_save`
   - `memory_index_scan`
3. Skip if a fresh context packet already exists for the current user turn
4. Otherwise, run one lightweight `memory_match_triggers(prompt/tool context)` pass
5. Cache the result as the turn's active `TOOL BRIEF`

Why:
- This keeps the hook additive, not duplicative
- It respects existing `MEMORY_AWARE_TOOLS` recursion protection

#### 3. `PostToolUse`

Purpose:
- Capture better input for later compaction and resume recovery

Behavior:
1. Record lightweight session telemetry in an ephemeral cache:
   - last tool name
   - last active spec folder
   - last meaningful artifact/path reference
   - last known blockers or next step strings when detectable
2. Do not write to repo files
3. Do not call memory-save flows automatically

Why:
- `PreCompact` becomes much better when it has real session breadcrumbs

#### 4. `PreCompact`

Purpose:
- Produce a high-signal recovery packet before Claude compacts context

Behavior:
1. Build a concise session summary from:
   - hook payload summary
   - last tool/activity cache
   - active spec folder
   - current user goal
2. Run:

```ts
memory_context({
  input: sessionSummary,
  mode: "resume",
  specFolder,
  anchors: ["state", "next-steps", "summary", "blockers"],
  sessionId
})
```

3. Let `context-server.ts` automatically invoke `autoSurfaceAtCompaction()`
4. Render a `COMPACTION BRIEF` for Claude to carry across the compaction boundary

Why:
- This is the key reliability win
- It uses the current MCP implementation exactly as intended

#### 5. `Stop`

Purpose:
- Preserve a last-known resume hint without surprising file mutations

Behavior:
1. Emit or cache a final lightweight `STOP BRIEF`
2. Optionally expose a reminder that `/spec_kit:resume <spec-folder>` is the recovery surface
3. Do not auto-run `generate-context.js`
4. Do not write `handover.md` or memory files unless explicitly requested by the user or command flow

Why:
- Prevents hooks from violating the Memory Save Rule or mutating the workspace unexpectedly

## Tool Fallback Flow for OpenCode, Codex, Copilot, Gemini

These runtimes do not have hooks, so the fallback must remain instruction-driven and tool-visible.

### Rule set

1. **Every new user message**
   - Run `memory_match_triggers(prompt)` as Gate 1 already requires
2. **If the prompt implies continuation, interruption, crash recovery, compaction recovery, or "pick up where we left off"**
   - Run `/spec_kit:resume`
   - Or internally call `memory_context({ mode: "resume" })` with the standard anchors
3. **If trigger results are too thin for the task**
   - Escalate to `memory_context({ input: prompt, mode: "focused" | "deep" })`
4. **If resume results are still thin**
   - Follow the existing recovery chain:
   - anchored `memory_search`
   - `memory_list` for recent candidates
   - user confirmation if necessary

### Fallback flow

```text
New user message
  |
  v
memory_match_triggers(prompt)
  |
  +-- enough context? ---- yes ---> continue with Gate 2 / Gate 3 / task
  |
  no
  |
  v
Continuation or compaction signal?
  |
  +-- yes ---> /spec_kit:resume
  |            or memory_context(mode:"resume", anchors:[state,next-steps,summary,blockers])
  |
  +-- no ----> memory_context(mode:"focused" or "deep")
                   |
                   v
             thin result?
                   |
                   +-- yes ---> anchored memory_search / memory_list / confirm
                   +-- no ----> continue with task
```

### Why this fallback is enough

- It reuses the current Gate 1 behavior instead of replacing it
- It matches the existing `/spec_kit:resume` recovery chain
- It keeps all non-Claude runtimes on the same MCP surface

## Script Specifications

The design should add a small shared script layer under the existing `system-spec-kit/scripts/` pattern.

### 1. `scripts/runtime-context/context-router.ts`

Purpose:
- Pure decision engine for context actions

Inputs:
- `runtime`
- `event`
- `prompt`
- `toolName?`
- `specFolder?`
- `sessionId?`
- `sessionSummary?`
- `hasFreshPacket?`

Outputs:
- action plan JSON:
  - `none`
  - `trigger_match`
  - `resume_context`
  - `focused_context`

Responsibilities:
- Centralize the same decision logic for Claude hooks and non-hook runtime docs
- Keep business rules out of runtime-specific wrappers

### 2. `scripts/runtime-context/mcp-tool-client.ts`

Purpose:
- Minimal local client that calls Spec Kit Memory MCP tools from shell-hook environments

Inputs:
- tool name
- JSON arguments
- timeout / retry policy

Outputs:
- raw MCP JSON response
- normalized exit codes for hook callers

Responsibilities:
- Call only existing MCP tools
- Fail open for non-critical surfacing
- Never mutate memory or spec files

### 3. `scripts/runtime-context/render-context-packet.ts`

Purpose:
- Convert raw MCP results into compact runtime-safe text blocks

Packet types:
- `SESSION BRIEF`
- `TOOL BRIEF`
- `COMPACTION BRIEF`
- `STOP BRIEF`

Responsibilities:
- Cap size aggressively
- Prefer:
  - current state
  - next safe step
  - blockers
  - matched trigger phrases
  - active spec folder
- Avoid dumping raw search results into the prompt

### 4. `scripts/runtime-context/session-state.ts`

Purpose:
- Ephemeral runtime cache for hook-assisted continuity

Storage:
- temp file or runtime cache outside the repo

Responsibilities:
- Track:
  - last active spec folder
  - reusable `sessionId`
  - last tool name
  - last known artifact/path
  - last concise task summary
- Provide the summary input for `PreCompact`

### 5. `scripts/runtime-context/claude-hook-entry.ts`

Purpose:
- Claude-specific hook adapter

Responsibilities:
- Parse Claude hook payloads
- Call `context-router.ts`
- Invoke `mcp-tool-client.ts` when needed
- Pass results through `render-context-packet.ts`
- Return the correct hook output format for Claude

### 6. `scripts/runtime-context/render-runtime-instructions.ts`

Purpose:
- Generate synchronized fallback instruction snippets for non-hook runtimes

Targets:
- `CLAUDE.md`
- `CODEX.md`
- OpenCode runtime docs or wrappers
- Copilot/Gemini prompt wrappers

Responsibilities:
- Keep the fallback rule set identical across runtimes
- Prevent instruction drift between Claude, Codex, OpenCode, Copilot, and Gemini surfaces

## Integration Points with Existing MCP Server

### 1. `context-server.ts` remains the only runtime coordinator inside the MCP server

Do not move Claude runtime hooks into the server. Keep the server transport-agnostic.

### 2. `memory_context(mode:"resume")` is the compaction entry point

This is the key integration contract:

- Claude `PreCompact` calls `memory_context(mode:"resume")`
- non-hook `/spec_kit:resume` also calls `memory_context(mode:"resume")`
- `context-server.ts` then routes both through `autoSurfaceAtCompaction()`

Result:
- one compaction algorithm
- one recovery primitive
- one public continuation surface

### 3. `memory_match_triggers()` remains the universal turn-start lightweight path

This is already consistent with Gate 1 and should remain the default first call in non-hook runtimes and the first-line hook call on Claude.

### 4. Respect `MEMORY_AWARE_TOOLS` and avoid recursive surfacing

The runtime adapter should skip hook-triggered retrieval when the pending tool is already memory-aware. That keeps external hook behavior aligned with existing server recursion protections.

### 5. Treat `meta.autoSurface` and response hints as observability, not primary transport

The runtime scripts can inspect surfaced counts or hints if useful, but should not depend on envelope internals for correctness. The primary contract remains the tool response payload itself.

### 6. Keep writes out of runtime hooks

No automatic memory saves, no automatic spec writes, no automatic handover writes. Hooks should be read-only context enrichment only.

## Why This Does Not Break the Existing Gate System

### Gate compatibility

- **Gate 1:** strengthened, not replaced
- **Gate 2:** unchanged
- **Gate 3:** unchanged

The hook layer only ensures context is available earlier and more reliably. It does not authorize edits, bypass spec-folder selection, or alter completion rules.

### MCP compatibility

- No new server-side hook registration mechanism
- No duplicate compaction logic
- No change to the public `memory_context` / `memory_match_triggers` contract
- No surprise writes from hooks

### Runtime compatibility

- Claude gains reliability through hooks
- All other runtimes continue to work with explicit tool calls
- `/spec_kit:resume` stays the single human-facing recovery command

## Recommended Rollout

1. Build the shared `runtime-context/` script layer first.
2. Wire Claude `SessionStart` and `PreCompact` first.
3. Add `PreToolUse` and `PostToolUse` only for lightweight caching and dedupe.
4. Generate synchronized fallback instructions for Codex, OpenCode, Copilot, and Gemini.
5. Validate with three scenarios:
   - cold start research task
   - interrupted implementation session resumed via `/spec_kit:resume`
   - Claude compaction followed by successful continuation

## Bottom Line

The best architecture is:

- **Claude:** hooks call the same MCP tools more reliably
- **Other runtimes:** instructions call the same MCP tools explicitly
- **MCP server:** stays the single retrieval engine and keeps compaction logic centralized in `memory_context(mode:"resume")` plus `autoSurfaceAtCompaction()`

That gives us one mental model, one recovery primitive, one public resume surface, and no runtime-specific fork of the actual memory logic.
