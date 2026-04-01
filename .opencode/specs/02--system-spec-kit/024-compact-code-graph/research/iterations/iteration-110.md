# Research Iteration 110: Approaching Hook-Level Automation Without Hooks

## Current State

The system already has one genuinely **pre-LLM** priming surface: `buildServerInstructions()` runs during MCP server startup, and its output is passed through `server.setInstructions()` before `server.connect()` completes. In practice, that means the client can receive these instructions at MCP connection time, before any tool call is made. Today that payload is limited to memory counts, stale counts, search channels, and key tools. It is explicitly computed once at startup. [SOURCE: `context-server.ts:605-626`] [SOURCE: `context-server.ts:1573-1587`]

The second mechanism, MCP auto-priming, is meaningfully later. `primeSessionIfNeeded()` only runs inside tool dispatch on the **first MCP tool call**. It sets `sessionPrimed` once, builds a `PrimePackage`, and injects that into response hints after the tool succeeds. So the LLM must already have decided to call a tool, and only then does it get the richer context package. [SOURCE: `context-server.ts:707-715`] [SOURCE: `hooks/memory-surface.ts:365-419`]

That first-call `PrimePackage` is also fairly lightweight and mostly inferred from tool args, not persistent session state. It derives `specFolder` from `toolArgs.specFolder`, derives `currentTask` from `input/query/prompt`, infers graph freshness from the snapshot, detects CocoIndex availability, and emits recommended calls. It does **not** pull "last active spec folder" or "last task" from prior session memory. [SOURCE: `hooks/memory-surface.ts:315-363`]

The agent-based `@context-prime` path is later still. Its own documentation says it is a bootstrap agent for first turn or after `/clear`, and it requires the orchestrator to decide to delegate to it. That means the runtime has already spent tokens reading the user message and deciding to invoke the subagent. [SOURCE: `context-prime.md:22-41`]

Finally, the repo's own feature docs correctly describe the current split: dynamic server instructions are startup-time initialization-time hints, while auto-priming is a first-tool-call response-hint mechanism. [SOURCE: feature catalog entries for dynamic-server-instructions and mcp-auto-priming]

## Analysis

### How close can MCP server instructions get to hook-level?

They can get **close on timing**, but not on **adaptivity**.

`server.setInstructions()` is the closest hookless equivalent to Claude Code's `SessionStart`, because it is delivered at MCP initialization rather than after the model has already chosen an action. That is the one surface here that can influence the model's very first tool-selection decision. [SOURCE: `context-server.ts:1573-1587`]

However, it is still weaker than real hooks in four important ways:

1. **Connection-time, not turn-time.**
   Claude hooks fire relative to session lifecycle and, critically, can be refreshed around compaction or stop boundaries. MCP instructions here are computed once at startup and then remain static for the life of that server process. [SOURCE: `context-server.ts:605-626`]

2. **Static snapshot, not message-aware.**
   Hooks can inspect current session state or the exact pre-turn context. `buildServerInstructions()` currently has no user-message input and no per-turn recomputation path.

3. **Client mediation.**
   With hooks, the runtime itself decides to inject context. With MCP instructions, the client may expose them well, partially, or weakly. The server can set them, but cannot guarantee how prominently the runtime uses them.

4. **No post-response lifecycle symmetry.**
   Claude's `Stop` and `PreCompact` hook classes have no true hookless equivalent at the MCP server layer. A tool server only sees tool calls, not all model responses or compaction events unless the client/runtime explicitly routes those through a tool.

So the answer is: **MCP server instructions can approximate `SessionStart`, but they cannot fully reproduce hook semantics.** They are the best universal pre-LLM injection point available without runtime hooks.

### Should `buildServerInstructions()` be enriched with session state?

Yes — this is the highest-leverage improvement.

Right now the startup instructions already include durable global state: indexed memory count, spec-folder count, stale count, channels, key tools. That proves the pattern is accepted and cheap. [SOURCE: `context-server.ts:610-625`]

The missing leap is to include a compact **session-recovery summary**, for example:

- last active spec folder
- last known task title
- last session freshness / age
- code graph freshness
- CocoIndex availability
- recommended first action
- a one-line "if you are resuming work, call X" instruction

This would move the most useful parts of the `PrimePackage` and `@context-prime` output into the only pre-LLM surface already available. That is exactly the "closest to hook-level pre-injection without hooks" design.

The key design constraint is that this summary should be:
- short
- stable
- non-verbose
- derived from durable session state rather than current prompt
- phrased as decision guidance, not a wall of context

A good target is **150-400 tokens**, not thousands. Too much text in server instructions risks dilution; the goal is startup steering, not full recovery.

### Can MCP notifications push context proactively?

Not in a way that meaningfully matches hook-level automation.

Given the MCP protocol capabilities, `notifications/resources/updated` and `notifications/tools/updated` are **refresh signals**, not guaranteed semantic-context pushes. They can tell the client something changed, but they do not force the client to inject a new synthesized context block into the model prompt before the next reasoning step.

Even if the server started emitting those notifications, three limitations remain:

1. **Client behavior is discretionary.**
   The runtime may refresh resources or tool schemas lazily, or ignore them until the next explicit action.

2. **They are indirect.**
   They advertise change, not "here is the exact context summary you must prepend before the next turn."

3. **They are not guaranteed pre-turn.**
   A notification arriving after connection is still not the same as deterministic pre-LLM injection before the model plans its next action.

In other words: notifications may help keep server-side metadata discoverable, but they are not a substitute for hooks.

A useful design pattern is to use notifications only for **cache invalidation / freshness nudges**, such as:
- "instructions cache stale"
- "session summary resource updated"
- "tool descriptions refreshed"

But that is still secondary to enriched startup instructions.

### Should Gemini use hooks instead?

Yes, if Gemini's runtime offers reliable lifecycle hooks, use them.

If the objective is "match Claude Code hook automation across all runtimes," the right architecture is not "one universal lowest-common-denominator path only." It is **tiered**:

1. **Native runtime hooks where available**
   Best timing, best fidelity, closest to Claude behavior.

2. **MCP startup instructions everywhere**
   Best universal pre-LLM fallback.

3. **First-tool-call auto-priming**
   Best universal post-decision fallback.

4. **Agent priming (`@context-prime`)**
   Last-resort explicit bootstrap path.

So for Gemini: **yes, prefer runtime hooks if the platform supports them**, but still keep enriched MCP startup instructions as the cross-runtime baseline. Otherwise the system fragments and non-hook runtimes remain second-class.

### Fundamental limitations of hookless priming

There are several hard ceilings that no amount of clever prompt engineering removes:

1. **No guaranteed pre-turn dynamic computation without client support.**
   You can compute at server start, but not per user turn unless the client invokes you.

2. **No guaranteed compaction interception.**
   Without a compaction hook or equivalent runtime callback, you cannot reliably save or re-surface state exactly at the compression boundary.

3. **No guaranteed post-response bookkeeping.**
   A tool server cannot observe every completed model response, so Claude-style `Stop` accounting cannot be matched exactly.

4. **No guaranteed tool-free recovery.**
   If the model never decides to call a tool, first-call auto-priming never happens.

5. **Server instructions are broad, not targeted.**
   They must work before the server knows the current prompt, so they are inherently less specific than a hook or tool-triggered summary.

This means the goal should be framed as **"maximize pre-LLM bootstrap quality without hooks"**, not "fully recreate hooks."

## Proposals

### Proposal A — Enrich `buildServerInstructions()` with session recovery state
**Impact:** Highest
**Risk:** Low-Medium
**Closeness to hooks:** Best universal option

Extend startup instructions from global library stats to a compact "resume banner":

- memory stats
- graph freshness
- last active spec folder
- last known task
- session age / freshness
- CocoIndex availability
- recommended first action:
  - "If resuming previous work, call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`."
  - or "Current spec appears active: `specs/...`"

This gives every runtime the same pre-LLM startup steering at connection time.

**Why it works:** it upgrades the only existing pre-LLM path already proven in code. [SOURCE: `context-server.ts:605-626`]

**Suggested LOC:** 60-120 LOC

### Proposal B — Introduce a dedicated "startup context digest" builder
**Impact:** High
**Risk:** Medium
**Closeness to hooks:** Strong

Instead of bloating `buildServerInstructions()` directly, add a helper such as `buildStartupContextDigest()` that merges:
- memory stats
- session-health-style freshness
- last active spec/task
- recommended first action

Then `buildServerInstructions()` composes:
- library overview
- startup digest
- first-action guidance

This is cleaner architecturally and reduces future drift between startup instructions, `session_health`, and `@context-prime`.

**Suggested LOC:** 120-220 LOC

### Proposal C — Mirror the startup digest into tool descriptions for key lifecycle tools
**Impact:** Medium
**Risk:** Low
**Closeness to hooks:** Indirect but helpful

Augment descriptions for tools like `memory_context`, `session_health`, `session_resume`, and maybe `memory_match_triggers` so that even if clients downplay server instructions, the model still sees strong affordances in tool metadata:
- "Use first when resuming work"
- "Use when session may be stale"
- "Returns current spec folder and session quality"

This does not replace startup instructions, but it improves tool-choice bias on runtimes with weak instruction handling.

**Suggested LOC:** 20-60 LOC

### Proposal D — Add a refreshable startup-summary resource plus notifications
**Impact:** Medium
**Risk:** Medium
**Closeness to hooks:** Limited

Expose a structured resource like `session://startup-summary` and emit `notifications/resources/updated` when underlying session state materially changes. This helps clients that actively monitor MCP resources.

But this should be treated as **supplementary**, not primary, because it cannot guarantee prompt injection.

**Suggested LOC:** 120-250 LOC

### Proposal E — Promote runtime-native hooks where available
**Impact:** Highest on supporting runtimes
**Risk:** Medium
**Closeness to hooks:** Exact, where supported

For Gemini or any runtime that exposes startup/compaction/stop hooks:
- use them
- keep startup instructions as fallback
- keep first-tool-call auto-priming as safety net

This creates a layered model instead of forcing all runtimes down the weakest path.

**Suggested LOC:** Runtime-specific; likely 80-200 LOC per runtime integration, outside the MCP server core

## Recommendation

The best design is a **layered priming stack**:

1. **Use native hooks on runtimes that support them**
   That is the only way to truly match Claude Code's timing for `SessionStart`, `PreCompact`, and `Stop`.

2. **Make enriched MCP server instructions the universal baseline**
   This is the strongest cross-runtime pre-LLM mechanism available today, and it already exists in code. It should be expanded from generic memory stats to a compact session recovery digest. [SOURCE: `context-server.ts:605-626`]

3. **Keep first-tool-call auto-priming as the second-line fallback**
   It is useful, but it should no longer carry the main burden of session bootstrap because it always arrives after the model has already decided to use a tool. [SOURCE: `hooks/memory-surface.ts:365-419`]

4. **Treat `@context-prime` as an explicit recovery agent, not the default bootstrap primitive**
   It is too late in the decision pipeline to serve as the main universal answer. [SOURCE: `context-prime.md:22-41`]

So the concise answer is:

- **Yes**, enrich `buildServerInstructions()` with session state.
- **No**, MCP notifications are not enough to proactively push context at hook-level.
- **Yes**, Gemini should use hooks where available.
- **No**, hookless priming cannot fully replicate Claude hook semantics.
- **Yes**, enriched startup instructions are the closest universal approximation.

## Implementation Plan

### Phase 1 — Upgrade startup instructions to a compact recovery digest
Add session-aware fields to `buildServerInstructions()` or a helper it calls:

- last active spec folder
- last known task
- session freshness / age bucket
- graph freshness
- CocoIndex availability
- recommended first action

Keep output concise and deterministic.

**Estimated LOC:** 60-120

### Phase 2 — Unify startup digest with existing priming/session-health logic
Refactor shared derivation logic so these surfaces use the same definitions:

- startup instructions
- `PrimePackage`
- `session_health`
- optionally `session_resume`

That avoids different notions of "fresh/stale/current task."

**Estimated LOC:** 80-160

### Phase 3 — Strengthen tool metadata
Update key tool descriptions so the model sees strong recovery affordances even on clients that weakly surface instructions:

- `memory_context`
- `session_health`
- `session_resume`
- `memory_match_triggers`

**Estimated LOC:** 20-60

### Phase 4 — Optional resource + notification layer
Add a `session://startup-summary` resource and emit `notifications/resources/updated` when the digest materially changes. Use this only as a best-effort enhancement, not as a primary bootstrap mechanism.

**Estimated LOC:** 120-250

### Phase 5 — Runtime-specific hook adoption
For Gemini and any other compatible runtime, implement native startup/compaction/stop hooks and keep MCP startup instructions as fallback. This yields the closest parity with Claude Code while preserving a universal non-hook path.

**Estimated LOC:** 80-200 per runtime integration

### Total estimate
- **Core universal improvement only:** ~160-340 LOC
- **With optional notification/resource layer:** ~280-590 LOC
- **With Gemini/native-hook integration on top:** add ~80-200 LOC per runtime

The highest-value minimal version is: **Phase 1 + Phase 2 + Phase 3**. That should get the system materially closer to hook-level automation without requiring actual hooks, while staying aligned with the current architecture.
