# Iteration 004 - X4 Codex PreToolUse/PostToolUse Enforcement Contract

## Focus

Determine the real Codex CLI hook contract for `PreToolUse` and `PostToolUse`, including config shape, input schema, blocking vocabulary, idempotency implications, and observability, then turn that into an enforcement contract draft for packet 021+.

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-4.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-strategy.md`
- Local Codex repo surface:
  - `.codex/config.toml`
- Upstream Codex docs:
  - `https://developers.openai.com/codex/config-advanced`
  - `https://developers.openai.com/codex/hooks`
  - `https://developers.openai.com/codex/config-reference`
- Upstream Codex runtime and schema:
  - `https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/config.rs`
  - `https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs`
  - `https://github.com/openai/codex/blob/main/codex-rs/hooks/src/schema.rs`
  - `https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs`
  - `https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/post_tool_use.rs`
  - `https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs`

## Live Repo Surface Confirmed

### 1. This repo has Codex config, but no checked-in Codex hook enablement yet

The local `.codex/config.toml` defines models, MCP servers, profiles, and agents, but it does not set `[features].codex_hooks = true`. That means packet 026 is still designing the Codex hook surface rather than integrating an already-enabled local Codex hook stack. [SOURCE: file:.codex/config.toml:1-120] [SOURCE: https://developers.openai.com/codex/config-advanced]

### 2. Codex hook discovery is additive across config layers, not replace-by-precedence

Codex discovers `hooks.json` files next to active config layers, especially `~/.codex/hooks.json` and `<repo>/.codex/hooks.json`, and runs matching hooks from multiple files. The public hooks docs say matching command hooks run concurrently, and one matching hook cannot stop another matching hook from starting. The discovery code confirms lower-precedence-to-higher-precedence accumulation, not replacement, and it preserves handler order with a monotonically increasing `display_order`. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs]

### 3. `hooks.json` currently supports command hooks only, with matcher groups per event

The upstream hook config parser expects a top-level `hooks` object containing event arrays for `PreToolUse`, `PermissionRequest`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, and `Stop`. Each event contains matcher groups, and each matcher group contains one or more handlers. Handler types `prompt` and `agent` are parsed but skipped at discovery time, and async command hooks are also skipped as unsupported. `timeout` and `timeoutSec` are accepted, defaulting to 600 seconds when omitted. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/config.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs]

### 4. `PreToolUse` is Bash-only today, and its real blocking vocabulary is `deny` or legacy `block`

The docs and runtime agree that current `PreToolUse` only matches `tool_name == "Bash"`. The input JSON includes `session_id`, `turn_id`, `transcript_path`, `cwd`, `hook_event_name`, `model`, `permission_mode`, `tool_name`, `tool_input.command`, and `tool_use_id`. Successful blocking works in three ways:

1. `hookSpecificOutput.permissionDecision = "deny"` plus a non-empty `permissionDecisionReason`
2. Legacy `decision = "block"` plus a non-empty `reason`
3. Exit code `2` with the blocking reason on `stderr`

The important negative result is that `permissionDecision = "allow"` and `"ask"`, legacy `decision = "approve"`, `updatedInput`, `additionalContext`, `continue: false`, `stopReason`, and `suppressOutput` are parsed but unsupported, so they fail open instead of creating richer enforcement behavior. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/schema.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/output_parser.rs]

### 5. `PostToolUse` is feedback and context injection after the side effect, not prevention

`PostToolUse` gets the same shared metadata as `PreToolUse`, plus `tool_response`. It also only matches current Bash tool results. The hook can return `additionalContext`, `decision = "block"` with a `reason`, or `continue: false` with an optional `stopReason`. The critical semantic difference is that this does **not** prevent the Bash command from running. The docs and runtime both say `decision = "block"` only replaces the tool result with hook feedback and continues the model from that feedback. `continue: false` stops normal processing of the original tool result after the command has already run. Exit code `2` sends feedback to the model without blocking. `updatedMCPToolOutput` and `suppressOutput` are parsed but unsupported and fail open. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/schema.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/post_tool_use.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/output_parser.rs]

### 6. Observability is first-class, and run identifiers are stable enough for correlation

The runtime emits `HookStarted` and `HookCompleted` events around previewed hook runs. Completed runs feed both telemetry metrics and analytics: `HOOK_RUN_METRIC`, `HOOK_RUN_DURATION_METRIC`, and `HookRunFact { event_name, hook_source, status }`. Metric tags include `hook_name`, `source`, and `status`. The hook tests also show the generated run IDs include the event kind, the handler ordering, the source file path, and the `tool_use_id`, which is enough to correlate preview, completion, and tool-call scope. [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/post_tool_use.rs]

### 7. Idempotency is not provided by the platform, so hook side effects must self-dedupe

Because matching hooks from multiple `hooks.json` files all run and command hooks launch concurrently, Codex does not provide a single-writer or first-match-wins contract. Combined with additive layer discovery, the same policy can fire more than once if it exists in multiple layers. The stable correlation fields are `session_id`, `turn_id`, `tool_use_id`, `hook_event_name`, and the hook run ID, so any external audit sink or policy cache needs to treat those as its dedupe key. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/discovery.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs]

## Determination

**X4 is answered, with a constrained verdict.** Codex has a real, documented, machine-parseable hook surface for `PreToolUse` and `PostToolUse`, but it is narrower than a general enforcement bus:

1. `PreToolUse` can deny current Bash commands before execution.
2. `PostToolUse` can inject feedback or developer context after execution, but cannot undo side effects.
3. Both events are limited to Bash today, and the docs explicitly warn that non-shell tools such as MCP, Write, and WebSearch are not intercepted.
4. The decision vocabulary is asymmetric. `deny` and legacy `block` work in `PreToolUse`, `block` works in `PostToolUse`, but `allow`, `ask`, richer rewrites, and output suppression are still reserved or fail-open paths.

That means Codex can support a **partial enforcement-mode advisor**, but only for Bash-backed mutations, not for the full write surface that packet 021+ wants to govern. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/post_tool_use.rs]

## Enforcement Contract Draft

### Recommended contract for 021+

1. **Use `UserPromptSubmit` for model-visible advisor context.** That remains the place to inject spec-folder reminders and routing hints before tool selection.
2. **Use `PreToolUse` only for hard Bash denials.** If the model attempts a Bash mutation without a Gate 3 packet match, return `permissionDecision: "deny"` with a terse policy reason.
3. **Treat `PostToolUse` as audit and repair context, not prevention.** Use it to append developer context, replace tool results with policy feedback, or stop downstream processing after a risky Bash result, but never describe it as a pre-execution guard.
4. **Scope the Codex enforcement claim to Bash-only coverage.** Do not present it as a full write barrier because Codex itself documents gaps around non-shell tools and incomplete `unified_exec` interception.
5. **Require idempotent side effects.** External audit sinks, counters, or registry updates must dedupe on `(session_id, turn_id, tool_use_id, hook_event_name, run_id)` because Codex intentionally runs multiple matching hooks concurrently across additive config layers.
6. **Keep observability tied to the native run identifiers.** If packet 021+ adds advisor telemetry, reuse Codex's hook run IDs and statuses instead of inventing a parallel correlation ID.

### Minimum deny contract

For future Bash enforcement, the stable deny contract is:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Gate 3 packet missing for mutating Bash command."
  }
}
```

Fallback form:

```json
{
  "decision": "block",
  "reason": "Gate 3 packet missing for mutating Bash command."
}
```

Or exit with code `2` and write the reason to `stderr`. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/pre_tool_use.rs]

## Ruled Out

### 1. Treating Codex `PreToolUse` and `PostToolUse` as a full write-surface enforcement boundary

Ruled out because current Codex hook coverage is explicitly Bash-only, interception of shell calls is incomplete even there, and non-shell tools such as MCP, Write, and WebSearch are outside the current hook boundary. [SOURCE: https://developers.openai.com/codex/hooks]

### 2. Relying on `PostToolUse` to prevent policy violations

Ruled out because `PostToolUse` runs after the Bash command has already executed. Its `block` decision changes model continuation, not the side effect that already happened. [SOURCE: https://developers.openai.com/codex/hooks] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/post_tool_use.rs]

## Decisions

- **Record X4 as answered with a Bash-only enforcement verdict.** Codex has enough contract surface for future advisor enforcement, but only on the Bash path.
- **Anchor enforcement on `PreToolUse deny`, not `allow/ask`.** The parser and tests show only deny-style blocking is supported today.
- **Make idempotency a packet requirement, not a platform assumption.** Additive discovery and concurrent launch mean packet 021+ must own dedupe.
- **Use native Codex hook metrics and run IDs for observability.** That keeps packet telemetry aligned with Codex runtime events.

## Question Status

- **X4 answered**: packet 026 now has a concrete Codex hook contract for config shape, input schema, blocking vocabulary, observability, and idempotency limits, plus a draft enforcement model that is precise about the Bash-only boundary.

## Next Focus

Iteration 5 should move to X5 and test whether user-controlled prompt text can poison the advisor brief or hook-fed developer context, then define the minimum neutralization rules for the future multi-runtime hook surface.
