# Iteration 011 — Claude Code Hooks API Reference + Cross-Runtime Hook Support

**Focus:** Claude Code hooks API reference + cross-runtime hook support
**Status:** complete
**newInfoRatio:** 0.88
**Novelty:** High. This iteration replaces several packet assumptions with current Claude/GitHub docs and local runtime evidence collected on 2026-03-29.

---

## Executive Summary

1. Claude Code now exposes a large, explicit hook surface: 25 lifecycle events and 4 handler types (`command`, `http`, `prompt`, `agent`), with per-event support rules, matcher semantics, MCP-aware tool matching, and structured JSON input/output contracts.
2. The current packet assumption that a `PreCompact` command hook can print text to stdout and have that text injected into Claude before compaction is **not supported by the current hook reference**. The docs say plain stdout is added as context only for `SessionStart` and `UserPromptSubmit`.
3. `SessionStart` is the strongest documented entry point for proactive context priming. It explicitly supports context injection via plain stdout or `hookSpecificOutput.additionalContext`.
4. `Stop` is viable for session capture and post-turn analysis, but the inline payload only includes `transcript_path`, `stop_hook_active`, and `last_assistant_message`. If we need token accounting or full-turn reconstruction, the hook script must parse the transcript JSONL file itself.
5. Cross-runtime support is more nuanced than the packet currently states:
   - Codex CLI: I did not find a documented hooks API in current local help or official OpenAI docs checked during this pass.
   - Copilot CLI: does have hooks, but their outputs are mostly ignored except `preToolUse` permission JSON, so they are better for guardrails/logging than context injection.
   - Gemini CLI: public docs still emphasize checkpointing, `/chat`, `/compress`, and MCP, but the installed `@google/gemini-cli 0.33.1` already contains a first-class hook system and a `/hooks` UI. Public docs appear behind the shipped build.

## Local Config Scan

### Claude settings files requested by the task

| Path | State | Findings |
|------|-------|----------|
| `~/.claude/settings.json` | exists | User-level hooks already configured for `UserPromptSubmit`, `Stop`, `PostToolUse`, `PostToolUseFailure`, and `PermissionRequest`; all call the same `notify.sh` helper. |
| `~/.claude/settings.local.json` | missing | No user-local override file present. |
| `.claude/settings.json` | missing | No committed project-level Claude hook config in this repo. |
| `.claude/settings.local.json` | exists | No hooks yet; only env + permissions. Good place for project-local experimentation. |

### Repo-local documentation found

The current packet already assumes a Claude-first hook architecture:

- `specs/02--system-spec-kit/024-compact-code-graph/spec.md`
- `specs/02--system-spec-kit/024-compact-code-graph/plan.md`

Important packet assumptions that need correction:

- The packet says `PreCompact` stdout is injected into Claude context.
- The packet says Copilot and Gemini are "tool-only" runtimes with no hook support.

Both statements are now too strong based on the evidence below.

## Claude Code Hook Model

### Hook locations and scope

Claude Code supports hooks from all of these locations:

| Location | Scope |
|----------|-------|
| `~/.claude/settings.json` | User-global |
| `.claude/settings.json` | Project-shared |
| `.claude/settings.local.json` | Project-local, gitignored |
| Managed policy settings | Organization-wide |
| Plugin `hooks/hooks.json` | Active plugin scope |
| Skill or agent frontmatter | Active component lifetime |

### Handler types

Claude Code supports four hook handler types:

| Type | What it does | Default timeout |
|------|--------------|-----------------|
| `command` | Runs a shell command; JSON arrives on stdin | 600s |
| `http` | Sends JSON as an HTTP POST body | No explicit unique default documented beyond shared `timeout` field; examples use 30s |
| `prompt` | Single-turn LLM evaluation returning `{ "ok": true/false }` | 30s |
| `agent` | Spawns a verifier subagent with tool access | 60s |

Per-event support matters:

- `SessionStart` supports only `command`.
- `PreCompact`, `PostCompact`, `InstructionsLoaded`, `Notification`, `ConfigChange`, `CwdChanged`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `SessionEnd`, `StopFailure`, `SubagentStart`, `TeammateIdle`, `Elicitation`, and `ElicitationResult` support `command` and `http`, but not `prompt` or `agent`.
- `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `TaskCreated`, and `TaskCompleted` support all four handler types.

### Common stdin JSON fields

Every Claude hook receives the common fields below, plus event-specific fields:

| Field | Notes |
|-------|-------|
| `session_id` | Current session id |
| `transcript_path` | Path to the session transcript JSON/JSONL on disk |
| `cwd` | Current working directory |
| `hook_event_name` | Event name |
| `permission_mode` | Present on many but not all events |
| `agent_id` | Present when firing inside a subagent |
| `agent_type` | Present with `--agent` or inside a subagent |

## Claude Code Output Contract

### Exit codes

| Exit code | Meaning |
|-----------|---------|
| `0` | Success; Claude parses stdout for JSON if present |
| `2` | Blocking error for events that can block; stdout/JSON are ignored |
| other non-zero | Non-blocking error; stderr shown in verbose mode and execution continues |

### Stdout / JSON behavior

| Output path | Behavior |
|-------------|----------|
| Plain stdout | Added as model-visible context only for `SessionStart` and `UserPromptSubmit`; otherwise mostly visible only in verbose mode |
| JSON stdout on exit `0` | Parsed for universal fields like `continue`, `stopReason`, `systemMessage`, `suppressOutput`, plus event-specific fields |
| stderr | Becomes error/feedback text depending on event semantics |
| HTTP 2xx JSON body | Same structured behavior as command-hook JSON stdout |
| HTTP non-2xx / timeout | Non-blocking error |

### Universal JSON fields

These work across hook types:

| Field | Meaning |
|-------|---------|
| `continue` | If `false`, Claude stops processing entirely after the hook runs |
| `stopReason` | Message shown to the user when `continue` is `false` |
| `systemMessage` | Warning shown to the user |
| `suppressOutput` | Hides stdout from verbose mode |

### Async command hooks

Claude supports `async: true` only on `command` hooks:

- Async hooks cannot block or return control decisions.
- Their output is delivered on the next conversation turn.
- If they emit JSON with `systemMessage` or `additionalContext`, that content reaches Claude on the next turn.
- Each firing creates a separate background process; there is no deduplication across firings.

### Special output cases

Some events have unique output behavior:

| Event | Special output |
|-------|----------------|
| `SessionStart` | Plain stdout or `hookSpecificOutput.additionalContext` is injected into Claude context |
| `UserPromptSubmit` | Plain stdout or `hookSpecificOutput.additionalContext` is injected into Claude context |
| `PreToolUse` | `hookSpecificOutput.permissionDecision`, `permissionDecisionReason`, `updatedInput`, `additionalContext` |
| `PermissionRequest` | `hookSpecificOutput.decision` with allow/deny, optional `updatedInput`, `updatedPermissions` |
| `PostToolUse` | `decision`, `reason`, `hookSpecificOutput.additionalContext`, and `updatedMCPToolOutput` for MCP tools |
| `CwdChanged` / `FileChanged` | `watchPaths` can update dynamic file watching |
| `WorktreeCreate` | Command hook must print the absolute worktree path on stdout |
| `Elicitation` / `ElicitationResult` | `hookSpecificOutput.action` and `content` can answer or override MCP elicitation flows |

## Claude Code Event Reference

Common fields are omitted below; this table lists only event-specific additions and the main control surface for each event.

| Event | Matcher basis | Extra stdin fields | Main output / control |
|------|---------------|--------------------|-----------------------|
| `SessionStart` | `startup`, `resume`, `clear`, `compact` | `source`, `model`, optional `agent_type` | Plain stdout or `additionalContext` becomes Claude context; `CLAUDE_ENV_FILE` available |
| `InstructionsLoaded` | `load_reason` | `file_path`, `memory_type`, `load_reason`, optional `globs`, `trigger_file_path`, `parent_file_path` | Observability only |
| `UserPromptSubmit` | none | `prompt` | Can block prompt; can add context via stdout or `additionalContext` |
| `PreToolUse` | tool name including MCP names | `tool_name`, `tool_input`, `tool_use_id` | Allow/deny/ask, modify input, add pre-tool context |
| `PermissionRequest` | tool name including MCP names | `tool_name`, `tool_input`, optional `permission_suggestions` | Allow/deny on behalf of user; can mutate input and permissions |
| `PostToolUse` | tool name including MCP names | `tool_name`, `tool_input`, `tool_response`, `tool_use_id` | Can block follow-up behavior, add context, replace MCP tool output |
| `PostToolUseFailure` | tool name including MCP names | `tool_name`, `tool_input`, `tool_use_id`, `error`, optional `is_interrupt` | Can add failure context |
| `Notification` | notification type | `message`, optional `title`, `notification_type` | Cannot block; can add context |
| `SubagentStart` | agent type | `agent_id`, `agent_type` | Can add context to the subagent |
| `SubagentStop` | agent type | `stop_hook_active`, `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message` | Same decision format as `Stop` |
| `TaskCreated` | none | `task_id`, `task_subject`, optional `task_description`, `teammate_name`, `team_name` | Exit 2 or `continue: false` can stop creation |
| `TaskCompleted` | none | `task_id`, `task_subject`, optional `task_description`, `teammate_name`, `team_name` | Exit 2 or `continue: false` can stop completion |
| `Stop` | none | `stop_hook_active`, `last_assistant_message` | Top-level `decision: "block"` prevents stopping |
| `StopFailure` | error type | `error`, optional `error_details`, optional `last_assistant_message` | Logging only; output ignored |
| `TeammateIdle` | none | `teammate_name`, `team_name` | Exit 2 or `continue: false` can keep teammate working |
| `ConfigChange` | config source | `source`, optional `file_path` | Can block config changes except `policy_settings` |
| `CwdChanged` | none | `old_cwd`, `new_cwd` | `watchPaths`; `CLAUDE_ENV_FILE` available |
| `FileChanged` | basename matcher | `file_path`, `event` | `watchPaths`; `CLAUDE_ENV_FILE` available |
| `WorktreeCreate` | none | `name` | Must return/print worktree path |
| `WorktreeRemove` | none | `worktree_path` | Cleanup only |
| `PreCompact` | `manual` or `auto` | `trigger`, `custom_instructions` | No event-specific context injection documented |
| `PostCompact` | `manual` or `auto` | `trigger`, `compact_summary` | Follow-up only |
| `SessionEnd` | exit reason | `reason` | Cleanup only; hard-capped timeout behavior |
| `Elicitation` | MCP server name | `mcp_server_name`, `message`, optional `mode`, `url`, `elicitation_id`, `requested_schema` | Can answer the elicitation programmatically |
| `ElicitationResult` | MCP server name | `mcp_server_name`, `action`, optional `mode`, `elicitation_id`, `content` | Can override/block the user response before it reaches the MCP server |

## Direct Answers To The Research Questions

### 1. All available Claude Code hook events

As of the current hook reference, Claude Code documents these 25 events:

`SessionStart`, `InstructionsLoaded`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Notification`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Stop`, `StopFailure`, `TeammateIdle`, `ConfigChange`, `CwdChanged`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `PreCompact`, `PostCompact`, `SessionEnd`, `Elicitation`, `ElicitationResult`.

### 2. What data does each hook receive?

All hooks receive the common envelope (`session_id`, `transcript_path`, `cwd`, `hook_event_name`, and often `permission_mode`) plus the event-specific fields listed in the table above.

### 3. What can hook scripts output, and how does it get injected?

- Plain stdout:
  - Injected into Claude context only for `SessionStart` and `UserPromptSubmit`.
  - Otherwise mostly only visible in verbose mode.
- JSON stdout on exit `0`:
  - Parsed for universal fields (`continue`, `stopReason`, `systemMessage`, `suppressOutput`).
  - Event-specific fields live under `hookSpecificOutput` for events like `PreToolUse`, `PermissionRequest`, `SessionStart`, `PostToolUse`, `Elicitation`, etc.
- stderr:
  - Used for blocking/error feedback on events that support blocking.
- Async command hooks:
  - Can surface `systemMessage` or `additionalContext` on the next turn, not immediately.

### 4. PreCompact: what is in the input, and what happens with stdout?

**Input**

`PreCompact` receives:

- common fields
- `trigger`: `manual` or `auto`
- `custom_instructions`: user-supplied `/compact` text for manual compaction; empty for auto compaction

**Stdout behavior**

Current docs do **not** say that plain `PreCompact` stdout is injected into Claude's context before compaction.

What the docs do say:

- Plain stdout becomes model-visible context only for `SessionStart` and `UserPromptSubmit`.
- `PreCompact` supports only `command` and `http` hooks.
- `PreCompact` has no event-specific output fields for `additionalContext`.
- Exit code `2` does not block compaction; it is treated as a non-blocking user-visible error case for this event category.

**Design implication**

Our current Phase 1 plan should treat "stdout injection before compaction" as **undocumented behavior requiring direct runtime validation**, not as a safe API contract.

### 5. SessionStart: what is in the input, and what happens with stdout?

**Input**

`SessionStart` receives:

- common fields
- `source`: `startup`, `resume`, `clear`, or `compact`
- `model`
- optional `agent_type`

**Stdout behavior**

`SessionStart` is explicitly documented as a context-injection hook:

- plain stdout on exit `0` is added to Claude's context
- `hookSpecificOutput.additionalContext` is also added to Claude's context
- `CLAUDE_ENV_FILE` is available, so the hook can persist environment setup for later Bash tool calls

### 6. Stop: what transcript data is available?

`Stop` does **not** inline the full transcript.

It provides:

- `transcript_path`: file path to the session transcript on disk
- `last_assistant_message`: final assistant message text
- `stop_hook_active`: whether Claude is already continuing because of a prior stop hook

So:

- If we only need the last answer, `last_assistant_message` is enough.
- If we need token accounting, earlier user turns, or full session summarization, the hook must read and parse `transcript_path`.

### 7. Are there `PostToolUse` or `PreToolUse` hooks?

Yes, both are documented and are core parts of the lifecycle.

- `PreToolUse`: before tool execution, with allow/deny/ask + `updatedInput` + `additionalContext`
- `PostToolUse`: after successful tool execution, with `tool_response`, optional follow-up blocking, `additionalContext`, and `updatedMCPToolOutput` for MCP tools
- `PostToolUseFailure`: after failed tool execution

### 8. How do hooks interact with MCP servers? Can a hook call an MCP tool?

**Documented hook/MCP interaction**

Claude Code hooks are MCP-aware in several ways:

- Tool matchers can target MCP tools directly, for example `mcp__memory__.*`
- `PreToolUse` and `PostToolUse` work with MCP tool names the same way they work with built-in tools
- `PostToolUse` can replace an MCP tool's result via `updatedMCPToolOutput`
- `Elicitation` and `ElicitationResult` exist specifically for MCP server user-input flows

**Calling an MCP tool from inside a hook**

I did **not** find a documented built-in "invoke MCP tool from hook" primitive in the Claude docs.

Practical conclusion:

- A **command hook** can still launch an external process that speaks to an MCP server over stdio/HTTP, but that is just "a script calling some other client," not a first-class hook capability.
- An **agent hook** gets tool access, but the docs only call out tools like `Read`, `Grep`, and `Glob`; they do not document generic MCP tool invocation for agent hooks.
- `PreCompact` and `SessionStart` do not support agent hooks anyway, so our hook scripts should assume they must integrate with MCP through our own client code if needed.

### 9. Can hooks be registered per-project vs globally?

Yes.

- Global: `~/.claude/settings.json`
- Project shared: `.claude/settings.json`
- Project local: `.claude/settings.local.json`
- Also supported: managed policy, plugin hooks, skill hooks, agent hooks

For this repo right now:

- user-global hooks already exist
- project-local file exists but has no hooks yet
- no project-shared hook file exists yet

### 10. Limitations

Confirmed limitations from current Claude docs:

- No documented plain-stdout context injection for `PreCompact`
- `SessionStart` is command-only
- `PreCompact` / `PostCompact` do not support prompt or agent hooks
- Async is command-only
- Async hooks cannot block or control behavior
- Async outputs arrive on the next turn, not immediately
- `SessionEnd` has a special short timeout: 1.5s by default, capped by `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`
- Agent hooks top out at 50 turns
- Hook JSON must be the only stdout content if using structured output
- There is no per-hook disable switch; `disableAllHooks` disables the whole system
- Command hooks run with full user permissions

One thing I **did not** find in the official hook reference:

- a documented hard stdout size limit for hook output

So we should treat output size as an empirical runtime limit and keep any context injection compact.

## Cross-Runtime Comparison

| Runtime | Lifecycle surface | Hook support | Practical fit for hybrid context injection |
|---------|-------------------|--------------|-------------------------------------------|
| Claude Code | `SessionStart`, `Stop`, `PreCompact`, `PostCompact`, tool hooks, task hooks, MCP elicitation hooks | Fully documented | Best hook target, but `PreCompact` injection behavior is the main risk |
| Codex CLI (`codex-cli 0.117.0`) | New session, `resume`, `fork`, MCP config | No documented hooks found in local help or official docs checked this pass | Keep tool-based fallback |
| Copilot CLI | `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `errorOccurred`; auto-compacts near 95% context | Documented hooks | Good for policy/logging; weak for context injection because outputs are mostly ignored |
| Gemini CLI (`@google/gemini-cli 0.33.1`) | `/chat save/resume`, `/compress`, checkpointing, MCP, project/user settings; local build also exposes hook events and `/hooks` | Public docs lag; installed build includes hooks | Potential second hook target, but version-pin and validate before committing architecture to it |

### Codex CLI detail

Local `codex --help` shows:

- `resume`
- `fork`
- `mcp`
- `features`

This confirms session persistence and branching, but I did not find a first-class hook/callback API in the local help text or the official OpenAI docs checked in this pass.

### Copilot CLI detail

GitHub now documents a hook system for Copilot CLI and Copilot coding agent:

- hooks live in `.github/hooks/*.json`
- for Copilot CLI, hooks are loaded from the current working directory
- `preToolUse` can emit permission JSON
- `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `postToolUse`, and `errorOccurred` exist, but their outputs are ignored
- Copilot CLI also auto-compresses history near 95% context usage

This means the packet statement "Copilot has no hooks" is outdated, but Copilot hooks are still not a drop-in replacement for Claude's `SessionStart` context injection.

### Gemini CLI detail

Public docs currently document:

- user and project config scopes via `~/.gemini/settings.json` and `.gemini/settings.json`
- checkpointing
- `/chat save` / `/chat resume`
- `/compress`
- MCP support

However, the installed `@google/gemini-cli 0.33.1` package also contains:

- a `hooksConfig.enabled` setting
- a `hooks` schema with `BeforeTool`, `AfterTool`, `BeforeAgent`, `AfterAgent`, `Notification`, `SessionStart`, `SessionEnd`, `PreCompress`, `BeforeModel`, `AfterModel`, and `BeforeToolSelection`
- a `/hooks` command/UI
- a `gemini hooks migrate --from-claude` command
- bootstrap code that prepends `SessionStart` additional context into the input using `<hook_context>...</hook_context>`

So the right statement is not "Gemini has no hooks." It is:

> Gemini hook support appears to exist in the shipped 0.33.1 build, but the public docs I checked have not yet published a stable hook API reference comparable to Claude's.

## Implications For Packet 024

1. **Reclassify Phase 1 risk.** `PreCompact` should be treated as an experimental integration point until we directly validate actual runtime behavior in Claude Code 2.1.87.
2. **Promote SessionStart as the safest documented injection point.** It has explicit model-visible context semantics.
3. **Keep Stop for auto-save/token analysis.** The transcript path is exposed directly.
4. **Update the fallback model in packet docs.**
   - Codex: tool-only
   - Copilot: hooks exist, but mostly not context-injecting
   - Gemini: emerging hook support, not yet docs-stable
5. **Preserve existing user-level Claude hooks.** This machine already has user-global Stop/PostToolUse/PermissionRequest hooks; any project hook registration must merge cleanly and not assume an empty hook array.

## Recommended Next Step

Before implementing Phase 1, run a narrow proof-of-behavior spike in Claude Code:

1. Register a tiny `PreCompact` hook that writes to stdout, stderr, and a file.
2. Force both manual and auto compaction.
3. Observe whether stdout becomes model-visible pre-compaction context, verbose-only output, or is discarded.
4. If stdout is not injected, pivot the architecture:
   - use `SessionStart` for proactive resume context
   - use `UserPromptSubmit` for per-turn context augmentation
   - keep `PreCompact` for logging, summarization, or side effects only

## Sources

### Official external sources

- Claude Code hooks reference: https://code.claude.com/docs/en/hooks
- GitHub Copilot hooks docs:
  - https://docs.github.com/en/copilot/reference/hooks-configuration
  - https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
  - https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-agents/overview
- Gemini CLI docs:
  - https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html
  - https://google-gemini.github.io/gemini-cli/docs/cli/commands.html
- Gemini CLI official repo roadmap signal:
  - https://github.com/google-gemini/gemini-cli/issues/9070

### Local runtime / repo evidence

- `~/.claude/settings.json`
- `.claude/settings.local.json`
- `specs/02--system-spec-kit/024-compact-code-graph/spec.md`
- `specs/02--system-spec-kit/024-compact-code-graph/plan.md`
- local commands run on 2026-03-29:
  - `claude --help`
  - `claude --version`
  - `codex --help`
  - `codex --version`
- installed Gemini package inspected locally:
  - `/opt/homebrew/lib/node_modules/@google/gemini-cli/package.json`
  - `/opt/homebrew/lib/node_modules/@google/gemini-cli/dist/src/config/settingsSchema.js`
  - `/opt/homebrew/lib/node_modules/@google/gemini-cli/dist/src/gemini.js`
  - `/opt/homebrew/lib/node_modules/@google/gemini-cli/dist/src/commands/hooks/migrate.js`
