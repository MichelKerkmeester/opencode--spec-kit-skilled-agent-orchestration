# Iteration 002 - X2 Claude UserPromptSubmit Exact Semantics

## Focus

Pin down the exact Claude `UserPromptSubmit` stdin and stdout contract, how hook output becomes model-visible context, and what the blocking path looks like so a future skill-advisor adapter can target the real runtime surface instead of guessing.

## Inputs Read

- Project hook registration:
  - `.claude/settings.local.json`
  - `.claude/settings.json`
- Live Claude hook runtime:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- Cross-runtime comparison surface:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`
- Official Claude Code hook reference:
  - `https://docs.anthropic.com/en/docs/claude-code/hooks`

## Live Repo Surface Confirmed

### 1. No Claude `UserPromptSubmit` hook is registered today

The checked-in project config currently registers only:

- `PreCompact`
- `SessionStart`
- `Stop`

That means X2 is a contract-capture and adapter-design pass, not a readback of an already-implemented local `UserPromptSubmit` script.

### 2. The current Claude stdin type is too narrow for `UserPromptSubmit`

`hooks/claude/shared.ts` defines `HookInput` for the currently-implemented startup and compact flows:

- `session_id`
- `transcript_path`
- `trigger`
- `source`
- `custom_instructions`
- `stop_hook_active`
- `last_assistant_message`

It does **not** currently model the official `UserPromptSubmit` fields:

- `cwd`
- `permission_mode`
- `hook_event_name`
- `prompt`

So a future adapter should add a dedicated `ClaudeUserPromptSubmitInput` type rather than reusing `HookInput` unchanged.

## Exact Claude `UserPromptSubmit` Contract

### 1. Stdin JSON shape

Anthropic documents `UserPromptSubmit` as a turn-level hook fired **before Claude processes the user prompt**. The hook receives the common fields plus `prompt`.

Concrete official example:

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

Also documented as common optional fields when running in agent/subagent contexts:

- `agent_id`
- `agent_type`

### 2. How output becomes model-visible context

For `UserPromptSubmit`, Claude has **two** supported injection paths on exit code `0`:

1. **Plain text stdout**
   - Any non-JSON stdout text is added as context.
   - It is visible in the transcript as hook output.

2. **JSON with `hookSpecificOutput.additionalContext`**
   - This is also added as context.
   - Anthropic explicitly says this is added **more discretely** than plain stdout.

Official shape:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here",
    "sessionTitle": "My session title"
  }
}
```

Important runtime semantics:

- `sessionTitle` behaves like `/rename`.
- Output injected into context is capped at **10,000 characters**.
- JSON output is only parsed on **exit code 0**.

### 3. Block / allow semantics

`UserPromptSubmit` does **not** use the `PreToolUse`-style `permissionDecision` contract.

Allowed path:

- exit `0` with no JSON output, or
- exit `0` with plain stdout, or
- exit `0` with JSON that contains `hookSpecificOutput.additionalContext` and **omits** `decision`

Blocked path, option A:

- exit `0` with top-level JSON:

```json
{
  "decision": "block",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Optional extra context",
    "sessionTitle": "Optional title"
  }
}
```

Blocked path, option B:

- exit `2`
- stderr is surfaced as the blocking message
- Anthropic documents that this **blocks prompt processing and erases the prompt**

### 4. Exact control boundary

For `UserPromptSubmit`, the valid decision language is:

- top-level `decision: "block"` for structured blocking
- `continue: false` for global stop behavior
- exit code `2` for hard blocking

What is **not** valid for this event:

- `permissionDecision: "deny"`
- `permissionDecision: "allow"`
- `permissionDecision: "ask"`
- `permissionDecision: "defer"`

Those belong to `PreToolUse`, not `UserPromptSubmit`.

## Concrete Adapter Skeleton

Use a dedicated Claude-side adapter that mirrors the existing Gemini separation between input parsing and runtime-specific output shaping, but preserves Claude's native plain-stdout option.

```ts
interface ClaudeUserPromptSubmitInput {
  readonly session_id?: string;
  readonly transcript_path?: string;
  readonly cwd?: string;
  readonly permission_mode?: string;
  readonly hook_event_name?: 'UserPromptSubmit';
  readonly prompt?: string;
  readonly agent_id?: string;
  readonly agent_type?: string;
  readonly [key: string]: unknown;
}

interface ClaudeUserPromptSubmitOutput {
  readonly continue?: boolean;
  readonly stopReason?: string;
  readonly suppressOutput?: boolean;
  readonly systemMessage?: string;
  readonly decision?: 'block';
  readonly reason?: string;
  readonly hookSpecificOutput?: {
    readonly hookEventName: 'UserPromptSubmit';
    readonly additionalContext?: string;
    readonly sessionTitle?: string;
  };
}

function buildUserPromptSubmitOutput(args: {
  additionalContext?: string;
  sessionTitle?: string;
  blockReason?: string;
}): ClaudeUserPromptSubmitOutput {
  const hookSpecificOutput = {
    hookEventName: 'UserPromptSubmit' as const,
    ...(args.additionalContext ? { additionalContext: args.additionalContext } : {}),
    ...(args.sessionTitle ? { sessionTitle: args.sessionTitle } : {}),
  };

  if (args.blockReason) {
    return {
      decision: 'block',
      reason: args.blockReason,
      hookSpecificOutput,
    };
  }

  return Object.keys(hookSpecificOutput).length > 1
    ? { hookSpecificOutput }
    : {};
}
```

Minimal CLI entry sketch:

```ts
async function main(): Promise<void> {
  const input = await parseClaudeUserPromptSubmitStdin();
  if (!input?.prompt) {
    return;
  }

  const advisoryBrief = await buildSkillAdvisorBrief({
    prompt: input.prompt,
    cwd: input.cwd,
    sessionId: input.session_id,
    transcriptPath: input.transcript_path,
  });

  const output = buildUserPromptSubmitOutput({
    additionalContext: advisoryBrief,
  });

  process.stdout.write(JSON.stringify(output));
}
```

## Fixture JSON Samples

### A. Stdin fixture: allow + inject context

```json
{
  "session_id": "sess-x2-001",
  "transcript_path": "/tmp/claude-transcript.jsonl",
  "cwd": "/repo",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Implement the hook-surface regression harness and keep docs in sync."
}
```

### B. Stdout fixture: allow + discrete model-visible injection

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Skill routing signal: system-spec-kit primary, sk-code-opencode secondary. Gate 3 already satisfied by packet context.",
    "sessionTitle": "Hook surface adapter follow-up"
  }
}
```

### C. Stdout fixture: block prompt

```json
{
  "decision": "block",
  "reason": "Prompt requests hook implementation outside the active research-only scope.",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Research packet is design-only. Capture findings instead of editing production hooks."
  }
}
```

### D. Plain stdout fixture: visible transcript injection

```text
Skill routing signal: this prompt maps to system-spec-kit research X2. Prefer JSON additionalContext in production so the injected brief is less noisy in transcript replay.
```

## Integration Guidance for This Codebase

1. **Add a new Claude-specific parser/output helper pair.**
   Do not overload `hooks/claude/shared.ts`'s current `HookInput` until the wider Claude surface is generalized.

2. **Prefer JSON `additionalContext` for production injection.**
   Plain stdout is valid, but the docs say JSON `additionalContext` is added more discretely. That better matches the current Gemini design and reduces transcript noise for later compaction/replay.

3. **Treat top-level `decision: "block"` as the primary structured block path.**
   Use exit code `2` only for hard failures or guardrail violations where stderr should become the blocking message.

4. **Do not borrow `permissionDecision` from tool hooks.**
   That would target the wrong event family and create a false contract.

## Decisions

- **Model the Claude prompt hook separately from SessionStart.** The official stdin contract is broader than the repo's current Claude `HookInput`.
- **Use JSON `hookSpecificOutput.additionalContext` as the canonical adapter output.** It is model-visible while remaining less noisy than plain stdout.
- **Reserve top-level `decision: "block"` for policy blocks.** This is the documented structured control path for `UserPromptSubmit`.
- **Keep a plain-stdout fixture as a parity check only.** It proves the fallback path exists, but it should not be the default production injection strategy.

## Question Status

- **X2 answered**: the packet now has the exact official stdin example, the model-visible output paths, the real block semantics, and a codebase-fitting adapter skeleton with fixtures.

## Next Focus

Iteration 3 should move to X3 and determine whether Copilot's `userPromptSubmitted` surface can inject **model-visible** context, not just notifications, so the cross-runtime adapter contract stays symmetrical where possible.
