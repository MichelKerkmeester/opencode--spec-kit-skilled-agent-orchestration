# Iteration 014 - Implementation Details: Claude Code Hook Scripts and MCP Integration

**Focus:** Design the concrete hook scripts, runtime state, and MCP-side support for the hybrid compact/resume approach
**Status:** complete
**newInfoRatio:** 0.62
**Novelty:** Current Claude Code hook behavior changes one key assumption: `SessionStart` can inject context, but `PreCompact` command hooks cannot. That shifts the recommended design from "inject during PreCompact" to "precompute during PreCompact, inject during SessionStart(source=compact)."

---

## Findings

### 1. Current Claude Code hook behavior changes the integration shape

Based on the current official Claude Code hooks reference:

- `SessionStart` fires for `startup`, `resume`, `clear`, and `compact`.
- `SessionStart` command-hook stdout is added to Claude's context.
- `PreCompact` receives `session_id`, `transcript_path`, `cwd`, `trigger`, and `custom_instructions`.
- For command hooks, stdout is only injected for `SessionStart` and `UserPromptSubmit`.
- `Stop` fires after Claude finishes a response, not when the session terminates.
- `SessionEnd` is the true session-end hook, but it has a short default timeout ceiling.

Implication:

- A command-based `compact-inject.js` should not be treated as the final injection point.
- The correct hybrid design is:
  1. `PreCompact` computes and caches a compact-ready payload.
  2. `SessionStart` with `source: "compact"` injects that payload back into the new compacted session.

If we truly want direct PreCompact-time injection, that requires an HTTP hook plus a local HTTP endpoint, not a command hook.

### 2. What already exists locally

The current repo already provides most of the primitives we need:

- `context-server.ts` already treats `memory_context({ mode: "resume" })` as the compaction-aware memory path.
- `hooks/memory-surface.ts` already has `autoSurfaceAtCompaction(sessionContext)` and token-budgeted surfacing logic.
- `memory_context` already has a dedicated `resume` strategy and supports `profile: "resume"`.
- `generate-context.ts` already supports structured JSON input and explicit `--session-id`.
- `collect-session-data.ts`, `input-normalizer.ts`, and `cli-capture-shared.ts` already preserve transcript/session provenance fields.
- `detectSpecFolder()` already exists and should be reused instead of inventing a separate spec-selection path.

What is missing is a hook-oriented bridge:

- a fast way for hook scripts to call hook-safe context priming logic without going through Claude's own stdio MCP transport
- a Claude transcript normalizer for structured save input
- a tiny local state layer that maps Claude's `session_id` to the server-issued Spec Kit `effectiveSessionId`

### 3. Recommended architecture

Use a three-script hybrid:

1. `session-prime.js`
   - the real injection surface
   - runs on `SessionStart`
   - prints `additionalContext` to stdout

2. `compact-inject.js`
   - the precompute surface
   - runs on `PreCompact`
   - warms and caches the next injected payload

3. `session-stop.js`
   - the save/checkpoint surface
   - runs on `Stop` asynchronously
   - parses transcript deltas, tracks token usage, and calls `generate-context.js`

Optional:

4. `SessionEnd` can reuse `session-stop.js --finalize` for cleanup only, not primary saving.

---

## Recommended File and Module Layout

### Claude hook scripts

Create TypeScript sources under:

```text
.opencode/skill/system-spec-kit/scripts/hooks/claude/
  session-prime.ts
  compact-inject.ts
  session-stop.ts
  shared.ts
  hook-state.ts
  claude-transcript.ts
```

Compiled outputs:

```text
.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/
  session-prime.js
  compact-inject.js
  session-stop.js
  shared.js
  hook-state.js
  claude-transcript.js
```

### MCP-side public bridge

Add a hook-safe public API surface:

```text
.opencode/skill/system-spec-kit/mcp_server/api/hooks.ts
```

This should expose the fast, reusable logic that both scripts and any future MCP tool or HTTP adapter can call.

---

## Shared Runtime State

Use a per-session local state file keyed by Claude's `session_id`.

Recommended location:

```text
${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<claude-session-id>.json
```

Recommended shape:

```json
{
  "claudeSessionId": "abc123",
  "projectRoot": "/repo",
  "cwd": "/repo",
  "transcriptPath": "/Users/.../.claude/projects/.../abc123.jsonl",
  "speckitSessionId": "server-issued-effective-session-id",
  "lastSpecFolder": "specs/system-spec-kit/024-compact-code-graph",
  "lastPrimeAt": "2026-03-29T10:00:00.000Z",
  "lastPrimeHash": "sha1-of-prime-input",
  "lastSavedAt": "2026-03-29T10:05:00.000Z",
  "lastSavedTranscriptSize": 182334,
  "lastSavedTranscriptMtimeMs": 1743246000000,
  "lastSavedTurnHash": "sha1-of-last-saved-turn",
  "pendingCompactPrime": {
    "createdAt": "2026-03-29T10:12:00.000Z",
    "trigger": "auto",
    "additionalContext": "Spec Kit resume context...",
    "specFolder": "specs/system-spec-kit/024-compact-code-graph",
    "effectiveSessionId": "server-issued-effective-session-id",
    "tokenUsageRatio": 0.91
  },
  "metrics": {
    "assistantTurns": 12,
    "estimatedInputTokens": 15400,
    "estimatedOutputTokens": 9800,
    "estimatedTranscriptTokens": 32100
  }
}
```

This state file is the bridge between:

- Claude `session_id`
- Spec Kit `effectiveSessionId`
- last known `specFolder`
- pending compact payload
- transcript delta/save bookkeeping

---

## Script Design

## 1. `compact-inject.js`

### Purpose

Run on `PreCompact` to precompute a compact-ready Spec Kit context payload and cache it for the next `SessionStart(source=compact)`.

### Hook event

- Claude hook: `PreCompact`
- Matcher: `auto|manual`

### Important behavioral correction

For command hooks, `PreCompact` stdout is not injected into Claude context. Therefore this script should cache data, not rely on stdout injection.

### Inputs

From stdin JSON:

- `session_id`
- `transcript_path`
- `cwd`
- `hook_event_name`
- `trigger`
- `custom_instructions`

### Outputs

- Success: exit `0`, no stdout required
- Failure: non-blocking non-zero exit or stderr-only warning
- Side effect: update hook state with `pendingCompactPrime`

### Fast-path target

- hard target: under 2 seconds
- preferred target: under 750 ms on cache hit

### Recommended behavior

1. Read hook stdin JSON.
2. Load hook state for `session_id`.
3. Resolve `specFolder` from:
   - state `lastSpecFolder`
   - transcript recent messages
   - `detectSpecFolder()` if enough signal exists
   - fallback `undefined`
4. Estimate token pressure from transcript size or rolling metrics.
5. Call new hook-safe API `primeCompactionContext(...)`.
6. Store result as `pendingCompactPrime`.
7. Exit cleanly.

### Pseudo-code

```js
async function main() {
  const event = await readHookJsonFromStdin();
  const state = await loadHookState(event.cwd, event.session_id);

  const specFolder =
    state.lastSpecFolder ??
    await detectSpecFolderFromTranscript(event.transcript_path) ??
    null;

  const tokenUsageRatio = await estimateTranscriptPressure(event.transcript_path, state);

  try {
    const prime = await primeCompactionContext({
      claudeSessionId: event.session_id,
      speckitSessionId: state.speckitSessionId ?? null,
      transcriptPath: event.transcript_path,
      cwd: event.cwd,
      specFolder,
      trigger: event.trigger,
      customInstructions: event.custom_instructions ?? "",
      tokenUsage: tokenUsageRatio
    });

    await saveHookState(event.cwd, event.session_id, {
      ...state,
      transcriptPath: event.transcript_path,
      lastSpecFolder: prime.specFolder ?? specFolder,
      speckitSessionId: prime.effectiveSessionId ?? state.speckitSessionId,
      lastPrimeAt: new Date().toISOString(),
      pendingCompactPrime: prime
    });

    process.exit(0);
  } catch (error) {
    await appendHookWarning(state, "compact prime failed", error);
    process.exit(0);
  }
}
```

### Why not call `memory_context()` directly from the hook script?

Because the live server is stdio MCP, not HTTP. The hook needs a direct local bridge. The correct path is:

- hook script -> `mcp_server/api/hooks.ts`
- not hook script -> Claude's own MCP stdio pipe

That keeps the hook fast, local, and independent of Claude's internal MCP wiring.

---

## 2. `session-prime.js`

### Purpose

Run on `SessionStart` and inject the best available Spec Kit continuation context into Claude.

### Hook event

- Claude hook: `SessionStart`
- Matcher: `startup|resume|compact`

### Inputs

From stdin JSON:

- `session_id`
- `transcript_path`
- `cwd`
- `hook_event_name`
- `source`
- `model`
- optional `agent_type`

### Outputs

Stdout JSON:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Spec Kit resume context..."
  }
}
```

### Recommended behavior

1. Read hook stdin JSON.
2. Load hook state.
3. If `source === "compact"` and `pendingCompactPrime` exists and is fresh, reuse it.
4. Otherwise call `primeSessionContext(...)`.
5. Persist returned `effectiveSessionId` as `speckitSessionId`.
6. Persist `lastSpecFolder`.
7. Render a compact textual context block.
8. Return it via `additionalContext`.

### Suggested rendered format

Keep it short and action-oriented:

```text
Spec Kit resume context
- State: working on 024 compact/code-graph hook integration
- Next: define hook bridge API, transcript parser, and save debounce rules
- Blockers: Claude transcript JSONL field mapping still needs live validation
- Top memory: Dual-Graph-like /prime endpoint should be phase 2, not day 1
```

### Pseudo-code

```js
async function main() {
  const event = await readHookJsonFromStdin();
  const state = await loadHookState(event.cwd, event.session_id);

  let prime = null;
  const compactPrimeStillValid =
    event.source === "compact" &&
    state.pendingCompactPrime &&
    !isOlderThan(state.pendingCompactPrime.createdAt, 30_000);

  if (compactPrimeStillValid) {
    prime = state.pendingCompactPrime;
  } else {
    prime = await primeSessionContext({
      claudeSessionId: event.session_id,
      speckitSessionId: state.speckitSessionId ?? null,
      transcriptPath: event.transcript_path,
      cwd: event.cwd,
      source: event.source,
      specFolder: state.lastSpecFolder ?? null
    });
  }

  await saveHookState(event.cwd, event.session_id, {
    ...state,
    transcriptPath: event.transcript_path,
    speckitSessionId: prime.effectiveSessionId ?? state.speckitSessionId,
    lastSpecFolder: prime.specFolder ?? state.lastSpecFolder ?? null,
    lastPrimeAt: new Date().toISOString(),
    pendingCompactPrime: null
  });

  const additionalContext = renderAdditionalContext(prime);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext
    }
  }));
}
```

### `primeSessionContext(...)` should do

Internally it should:

1. reuse cached `effectiveSessionId` if valid
2. otherwise let the server mint a new one
3. call the same core logic as:

```js
memory_context({
  input: "resume previous work continue session",
  mode: "resume",
  profile: "resume",
  anchors: ["state", "next-steps", "summary", "blockers"],
  specFolder,
  sessionId: speckitSessionId,
  includeTrace: false
})
```

4. merge in compaction-surface hints when appropriate
5. return a ready-to-render `additionalContext` payload

### Why `SessionStart` is the real injection point

Because current Claude Code behavior explicitly allows `SessionStart` stdout/additionalContext to enter Claude's context. That is the stable, official injection surface.

---

## 3. `session-stop.js`

### Purpose

Run on `Stop` to checkpoint useful session context without blocking Claude's normal stop behavior.

### Hook event

- Claude hook: `Stop`
- No matcher support
- Configure as `async: true`

### Important behavioral correction

`Stop` is not session termination. It fires after each completed Claude response. Therefore this script must debounce aggressively or it will oversave and waste time.

### Inputs

From stdin JSON:

- `session_id`
- `transcript_path`
- `cwd`
- `permission_mode`
- `hook_event_name`
- `stop_hook_active`
- `last_assistant_message`

### Outputs

- Usually no stdout
- Always exit `0`
- Never block stop unless deliberately turned into a quality gate

### Save policy

Only save when one of these is true:

- transcript grew by at least N bytes since last save
- transcript mtime changed and last assistant message differs materially
- edited files changed since last save
- last assistant message contains explicit completion language
- more than X minutes elapsed since last save

Recommended defaults:

- min transcript delta: 12 KB
- min wall clock between saves: 3 minutes
- save immediately if edited-file set changed

### Recommended behavior

1. Read hook stdin JSON.
2. If `stop_hook_active === true`, exit immediately to avoid loops.
3. Load hook state.
4. Compute transcript delta.
5. If delta is too small, exit.
6. Parse Claude transcript JSONL into normalized structured capture data.
7. Reuse `lastSpecFolder` if available; otherwise run best-effort detection.
8. Write structured JSON to a temp file.
9. Spawn:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --session-id <claude-session-id> \
  /tmp/speckit-save-<session>.json \
  <spec-folder>
```

10. Update hook state metrics and save watermark.

### Pseudo-code

```js
async function main() {
  const event = await readHookJsonFromStdin();

  if (event.stop_hook_active === true) {
    process.exit(0);
  }

  const state = await loadHookState(event.cwd, event.session_id);
  const transcriptStats = await statTranscript(event.transcript_path);

  if (!shouldCheckpoint(state, transcriptStats, event.last_assistant_message)) {
    process.exit(0);
  }

  const capture = await parseClaudeTranscript(event.transcript_path);
  const specFolder =
    state.lastSpecFolder ??
    await detectSpecFolderFromCapture(capture) ??
    null;

  if (!specFolder) {
    process.exit(0);
  }

  const structured = await buildStructuredSavePayload({
    capture,
    specFolder,
    transcriptPath: event.transcript_path,
    claudeSessionId: event.session_id,
    lastAssistantMessage: event.last_assistant_message,
    metrics: state.metrics
  });

  const tempJsonPath = await writeTempStructuredJson(structured, event.session_id);

  await spawnGenerateContext({
    tempJsonPath,
    specFolder,
    claudeSessionId: event.session_id
  });

  await saveHookState(event.cwd, event.session_id, {
    ...state,
    transcriptPath: event.transcript_path,
    lastSpecFolder: specFolder,
    lastSavedAt: new Date().toISOString(),
    lastSavedTranscriptSize: transcriptStats.size,
    lastSavedTranscriptMtimeMs: transcriptStats.mtimeMs,
    lastSavedTurnHash: hashLastTurn(event.last_assistant_message),
    metrics: updateTokenMetrics(state.metrics, capture)
  });

  process.exit(0);
}
```

### Token usage tracking

Track lightweight estimated metrics in the hook state:

- transcript token estimate
- per-save token delta
- last prime token usage ratio
- moving average of stop-to-stop growth

Use existing token estimators where possible. The save path does not need exact API billing precision; it only needs a stable pressure heuristic for hook decisions.

### Why use `generate-context.js` instead of `memory_save` directly

Because:

- `generate-context.js` is already the required save path for proper memory generation
- it preserves the richer structured session workflow
- it keeps the hook path aligned with existing Spec Kit memory-save rules

If immediate index visibility is required, the follow-on indexing step can be added later behind a debounce threshold.

---

## MCP-Side Support to Add

## 1. New public API module: `mcp_server/api/hooks.ts`

Recommended exports:

```ts
interface PrimeContextArgs {
  claudeSessionId: string;
  speckitSessionId?: string | null;
  transcriptPath: string;
  cwd: string;
  specFolder?: string | null;
  source?: "startup" | "resume" | "compact" | "clear";
  trigger?: "auto" | "manual";
  customInstructions?: string;
  tokenUsage?: number;
}

interface PrimeContextResult {
  effectiveSessionId: string | null;
  specFolder: string | null;
  state: string;
  nextSteps: string[];
  blockers: string[];
  topResult?: Record<string, unknown> | null;
  autoSurfacedContext?: Record<string, unknown> | null;
  additionalContext: string;
  cacheHit: boolean;
}

export async function primeSessionContext(args: PrimeContextArgs): Promise<PrimeContextResult>;
export async function primeCompactionContext(args: PrimeContextArgs): Promise<PrimeContextResult>;
export function renderAdditionalContext(result: PrimeContextResult): string;
```

Why this is the first MCP-side addition:

- hook scripts need a supported local entrypoint
- this avoids trying to talk to Claude's internal stdio MCP process
- it can later power both a new MCP tool and an HTTP adapter

## 2. New transcript helper: `scripts/hooks/claude/claude-transcript.ts`

This is a new parser, not an existing local primitive.

Responsibilities:

- read Claude transcript JSONL
- extract user messages, assistant messages, and tool-call summaries
- preserve:
  - `_sourceTranscriptPath`
  - `_sourceSessionId`
  - created/updated timestamps if available
- normalize into the same structural shape expected by `generate-context.js`

Important note:

- the exact Claude transcript JSONL field mapping still needs validation against a live transcript before implementation
- this is the one place in the design that is still partly inferred

## 3. Optional new MCP tool: `memory_prime`

This is recommended, but not strictly required for v1.

Suggested purpose:

- expose the hook-friendly priming behavior as an explicit tool for manual testing, debugging, and future external integrations

Suggested input:

```json
{
  "input": "resume previous work continue session",
  "mode": "session_start",
  "profile": "resume",
  "sessionId": "server-issued-session-id",
  "specFolder": "specs/system-spec-kit/024-compact-code-graph",
  "tokenUsage": 0.91,
  "source": "compact"
}
```

Suggested output:

```json
{
  "data": {
    "effectiveSessionId": "...",
    "specFolder": "...",
    "state": "...",
    "nextSteps": ["..."],
    "blockers": ["..."],
    "additionalContext": "Spec Kit resume context...",
    "autoSurfacedContext": { "...": "..." }
  }
}
```

This tool would be useful for:

- manual dev testing
- replay testing from saved transcripts
- future HTTP adapter reuse

## 4. Optional HTTP `/prime` endpoint

### Can we add it?

Yes, technically.

Claude Code supports HTTP hooks, so a local endpoint such as:

```text
POST http://127.0.0.1:<port>/prime
```

could accept hook JSON and return hook JSON.

### Should we add it first?

No.

Reasons:

- current server is stdio MCP, not HTTP
- adding a listener changes security and startup complexity
- it needs local auth or loopback-only binding
- it is unnecessary for the first implementation if scripts can call `mcp_server/api/hooks.ts`

### Recommended stance

- Phase 1: no HTTP endpoint
- Phase 2: add `/prime` only if we want:
  - HTTP hook support
  - tool-agnostic reuse outside Claude
  - Dual-Graph-style local hook interoperability

If added later:

- bind only to `127.0.0.1`
- disable by default behind a feature flag
- require a local bearer token or nonce
- implement it as a thin adapter over `primeSessionContext()` and `primeCompactionContext()`

---

## Should `autoSurfaceAtCompaction` be enhanced?

### Yes, but only as a lower-level signal builder

Current `autoSurfaceAtCompaction(sessionContext)` is useful, but too narrow to be the whole hook solution because it:

- only accepts a raw session context string
- does not know about Claude `session_id`
- does not return a ready-to-inject `additionalContext` string
- does not manage the server-issued `effectiveSessionId`
- does not incorporate transcript path or compact trigger metadata

### Recommended enhancement

Refactor it into a shared lower-level builder used by both the runtime hook layer and the new hook bridge:

```ts
buildCompactionPrime({
  sessionContext,
  specFolder,
  tokenUsage,
  sessionId,
  transcriptPath
})
```

Then:

- `autoSurfaceAtCompaction()` can stay as the runtime metadata hook
- `primeCompactionContext()` can call the shared builder and also render `additionalContext`

This avoids duplicating compaction retrieval logic while keeping each layer's contract clean.

---

## Recommended `.claude/settings.local.json` Shape

Current state:

- the checked-in `.claude/settings.local.json` has no hook configuration yet

Recommended addition:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js",
            "timeout": 5,
            "statusMessage": "Loading Spec Kit context"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "auto|manual",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/compact-inject.js",
            "timeout": 2,
            "statusMessage": "Preparing compact context"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js",
            "timeout": 20,
            "async": true,
            "statusMessage": "Saving Spec Kit context"
          }
        ]
      }
    ]
  }
}
```

Optional cleanup:

```json
{
  "SessionEnd": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "node \"$CLAUDE_PROJECT_DIR\"/.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js --finalize",
          "timeout": 2,
          "async": true
        }
      ]
    }
  ]
}
```

---

## Final Recommendation

### Best v1 design

- Use `SessionStart` as the actual context injection surface.
- Use `PreCompact` only to precompute and cache a compact-ready prime payload.
- Use `Stop` asynchronously for debounced checkpoint saves.
- Add `mcp_server/api/hooks.ts` as the hook-safe local bridge.
- Do not add `/prime` HTTP in v1.
- Enhance `autoSurfaceAtCompaction` by extracting shared logic, not by turning it into the entire feature.

### Why this is the right hybrid

It matches:

- the current official Claude Code hook contract
- the current Spec Kit memory architecture
- the current stdio-only MCP deployment model

and it avoids:

- relying on unsupported PreCompact stdout injection
- adding network listeners before they are justified
- duplicating resume logic in scripts that should stay thin

---

## Open Questions

1. The exact Claude transcript JSONL field mapping still needs validation against a real local transcript before implementation.
2. We should decide whether stop-time indexing should happen immediately or rely on file watcher/startup scan.
3. We should decide whether `memory_prime` is worth shipping in v1 or if the public API module is enough.

---

## Sources

- [SOURCE: https://code.claude.com/docs/en/hooks] - current Claude Code hook behavior and event contracts
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts] - current runtime wiring for `memory_context`, auto-surface, and compaction-aware dispatch
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts] - current `autoSurfaceAtCompaction()` contract and limits
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts] - current `resume` strategy and anchors
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts] - existing `profile: "resume"` output shape
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts] - structured save path and `--session-id` support
- [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts] - session data/provenance shape
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts] - capture normalization and transcript provenance fields
- [SOURCE: .claude/settings.local.json] - current local Claude settings have no hook config yet
