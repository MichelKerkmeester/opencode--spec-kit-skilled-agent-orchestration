# Iteration 004 - Codex Hook Surface Audit

## Focus

Answer Q1: does Codex CLI expose a prompt-submit hook equivalent to Claude's `UserPromptSubmit`, and what wrapper strategy should the 020 skill-advisor hook surface use?

This iteration audits three evidence layers:

1. Repository-owned hook adapters under `.opencode/skill/system-spec-kit/mcp_server/hooks/`.
2. Codex skill and runtime detection documentation in this checkout.
3. The installed Codex CLI and local wrapper/hook configuration on this machine.

## Source Evidence

- The active strategy names Q1 as: "Does Codex CLI expose a prompt-submit hook equivalent to Claude's `UserPromptSubmit`? If not, what wrapper strategy is cleanest?" [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:20`]
- The hooks overview says `hooks/` is a utility layer and "not a standalone MCP hook registration system." It documents only a Claude lifecycle hook subdirectory in that overview. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:27-44`]
- The Claude hook README lists `PreCompact`, `SessionStart`, and `Stop`, with `SessionStart` injecting context via stdout and registration in `.claude/settings.local.json`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:7-31`] [SOURCE: `.claude/settings.local.json:24-58`]
- The Gemini hook README says `hooks/gemini/` implements the Gemini CLI hook surface and lists session-prime, compact-inject, session-stop, compact-cache, and shared helpers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/README.md:13-21`]
- The repo-level Copilot hook config contains `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `postToolUse` command hooks. [SOURCE: `.github/hooks/superset-notify.json:3-31`]
- The Copilot session-start wrapper calls the compiled system-spec-kit Copilot session-prime hook when present, then sends the Superset `sessionStart` notification. [SOURCE: `.github/hooks/scripts/session-start.sh:4-41`]
- The system-spec-kit install guide still documents Codex as "Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook." [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:131-141`]
- Runtime detection still hard-codes Codex CLI to `hookPolicy: 'unavailable'`, while Claude is `enabled`, Copilot is dynamically detected, and Gemini is dynamically detected. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:21-54`]
- The runtime tests assert that `CODEX_THREAD_ID` means `codex-cli` with `hookPolicy` unavailable. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:55-60`]
- Cross-runtime fallback tests assert that Codex uses `tool_fallback`, not hooks. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:38-46`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:74-81`]
- The `cli-codex` reference documents `.codex/instructions.md` as persistent project context injection and config/profile/session subcommands, but does not document a Codex hook contract. [SOURCE: `.opencode/skill/cli-codex/references/cli_reference.md:371-425`] [SOURCE: `.opencode/skill/cli-codex/references/cli_reference.md:528-579`]
- Exact search in `.opencode/skill/cli-codex/` for `hooks`, `UserPromptSubmit`, `PreToolUse`, and `SessionStart` produced only one unrelated migration-template use of the word "hooks." [SOURCE: `.opencode/skill/cli-codex/assets/prompt_templates.md:353`]
- Local Codex hook config exists at `~/.codex/hooks.json` with `SessionStart`, `UserPromptSubmit`, and `Stop` command hooks wired to the Superset notification hook. [SOURCE: `~/.codex/hooks.json:1-34`]
- The local Codex wrapper enables `codex_hooks` and passes a `notify=[...]` config override to the real Codex binary. [SOURCE: `~/.superset/bin/codex:22-30`] [SOURCE: `~/.superset/bin/codex:102-110`]
- The same wrapper watches Codex TUI session logs for `task_started`, approval request, and `exec_command_begin` events to synthesize Start and PermissionRequest notifications. [SOURCE: `~/.superset/bin/codex:31-99`]
- The Superset notify hook explicitly says Codex passes JSON as an argument, extracts Codex `type` events when no `hook_event_name` is present, and maps `UserPromptSubmit` to `Start`. [SOURCE: `~/.superset/hooks/notify.sh:1-10`] [SOURCE: `~/.superset/hooks/notify.sh:25-54`]
- Installed CLI evidence: `codex --version` returned `codex-cli 0.121.0`; `codex features list` returned `codex_hooks under development true`; top-level `codex --help` lists no `hooks` subcommand, and `codex debug hooks --help` fails with "unrecognized subcommand 'hooks'." [COMMAND: `codex --version`; `codex features list`; `codex --help`; `codex debug hooks --help`]
- Binary string evidence from the installed real Codex binary includes source paths for `session_start.rs`, `user_prompt_submit.rs`, `pre_tool_use.rs`, and `post_tool_use.rs`, plus hook parser strings for `PreToolUse`, `PostToolUse`, `additionalContext`, `hookSpecificOutput`, and "Command blocked by PreToolUse hook." [COMMAND: `strings "$(command -v codex excluding ~/.superset/bin)" | rg "codex-rs/hooks/src/events|PreToolUse|PostToolUse|additionalContext"`]
- OpenAI Codex issue #16486 states that `UserPromptSubmit.hookSpecificOutput.additionalContext` is already treated as the model-visible hook context surface and injected as developer instructions in Codex core. [WEB: `https://github.com/openai/codex/issues/16486`, lines 224-251]
- OpenAI Codex issue #14754 states that Codex v0.114.0 added experimental hooks with `SessionStart` and `Stop`, but that `PreToolUse` and `PostToolUse` were missing at that time. [WEB: `https://github.com/openai/codex/issues/14754`, lines 204-208]
- OpenAI Codex issue #14882 proposed first-class `PreToolUse` and `PostToolUse` hooks, including matcher-group config and block semantics, and was closed as a duplicate of #14754. [WEB: `https://github.com/openai/codex/issues/14882`, lines 203-235]

## Findings

### 1. Repo-local system-spec-kit has no first-class Codex hook adapter

The repository has concrete hook adapter directories for Claude, Gemini, and Copilot-like surfaces, but not for Codex. The hook README's overview only calls out Claude lifecycle hooks, and the exact scan under `mcp_server/hooks/` found no `hooks/codex/` sibling.

This means 020/006 cannot simply reuse a checked-in Codex adapter. It must either add `hooks/codex/` or explicitly keep Codex on the existing MCP `session_bootstrap` fallback path.

### 2. The repo's current Codex model is stale relative to installed Codex 0.121.0

The repository still says Codex has no native SessionStart hook and runtime detection hard-codes `hookPolicy: 'unavailable'`. That was probably correct when the earlier runtime matrix was written, but it is no longer true for the installed CLI:

- `codex_hooks` is present and enabled as an under-development feature.
- Local `~/.codex/hooks.json` already uses `SessionStart`, `UserPromptSubmit`, and `Stop`.
- The installed binary contains hook event source paths and schemas for `SessionStart`, `UserPromptSubmit`, `PreToolUse`, and `PostToolUse`.

Therefore the architectural unknown should be reframed:

> Codex is not hookless. The gap is that system-spec-kit has no Codex adapter and no runtime detection/config policy for Codex hooks yet.

### 3. Codex has a prompt-submit injection surface

Q1's direct answer is yes for modern Codex: `UserPromptSubmit` exists and `hookSpecificOutput.additionalContext` is the right candidate for skill-advisor brief injection.

The strongest evidence is the combination of local config (`~/.codex/hooks.json`), the enabled `codex_hooks` feature, binary hook schema strings, and OpenAI issue #16486's code-path description that `additionalContext` becomes developer instructions. The issue is about TUI rendering, not whether the model-visible path exists.

### 4. Codex has tool hook vocabulary, but PreToolUse parity still needs runtime verification

Installed binary strings show `pre_tool_use.rs`, `post_tool_use.rs`, blocking output parser messages, and unsupported-output checks for `PreToolUse`. That indicates the installed binary has at least some tool-hook implementation.

However, repo-owned docs and tests do not describe it, and the top-level CLI has no `hooks` inspection subcommand. OpenAI issue history shows `PreToolUse`/`PostToolUse` were missing in v0.114.0 and later proposed as lifecycle additions. Because this iteration did not run a live hook payload capture, the safe conclusion is:

- Treat `SessionStart` and `UserPromptSubmit` as usable surfaces for 020/006 design.
- Treat `PreToolUse` as promising but not fully specified until a focused runtime test captures payload shape, matcher semantics, and blocking behavior in Codex 0.121.0.

### 5. Superset wrapper evidence is notification-oriented, not advisor-injection-ready

The local wrapper currently uses two approaches:

- Native Codex config: `--enable codex_hooks -c 'notify=[...]'`.
- TUI session-log tailing: synthesize Start and PermissionRequest from `task_started`, approval request, and `exec_command_begin` events.

That proves a wrapper can observe Codex events, but it does not provide the skill-advisor context-injection path by itself. The notification hook maps events for Superset's UI and exits silently when no event type is available. It does not return `hookSpecificOutput.additionalContext`.

For 020, this means the "wrapper strategy" should not be only the Superset notify pattern. The advisor needs a real Codex hook command that returns Codex hook output JSON for `UserPromptSubmit`.

## Q1 Answer

Codex CLI does have a modern hook surface equivalent enough for the skill-advisor use case:

| Surface | Codex 0.121.0 status | Evidence | Use for 020 |
| --- | --- | --- | --- |
| `SessionStart` | Present | `~/.codex/hooks.json`; `codex_hooks`; binary `session_start.rs`; issue #14754 says v0.114.0 had `SessionStart`/`Stop` | Startup preamble and freshness banner |
| `UserPromptSubmit` | Present | `~/.codex/hooks.json`; binary `user_prompt_submit.rs`; issue #16486 says `additionalContext` is model-visible | Primary skill-advisor brief injection |
| `PreToolUse` | Likely present in installed binary, not repo-verified | binary `pre_tool_use.rs`; parser strings; issue history | Defer enforcement until payload/blocking runtime test |
| `PostToolUse` | Likely present in installed binary, not repo-verified | binary `post_tool_use.rs`; parser strings; issue history | Out of scope for prompt advisor; possibly later auditing |

The old answer "no native Codex hook, use prompt wrapping only" is no longer accurate. The better answer is:

1. Prefer native Codex `UserPromptSubmit` hook injection when `codex_hooks` is enabled and `~/.codex/hooks.json` or repo/local config can register the hook.
2. Use `SessionStart` only for a short advisor/system-spec-kit readiness banner, not for per-prompt routing decisions.
3. Keep prompt wrapping as a compatibility fallback for older Codex versions or restricted configs where native hooks cannot be enabled.

## Wrapper Strategy Proposal

### Preferred path: first-class Codex hook adapter

Create a packet-local implementation plan for 020/006 that adds a sibling adapter:

```text
.opencode/skill/system-spec-kit/mcp_server/hooks/codex/
  README.md
  user-prompt-submit.ts
  session-prime.ts
  shared.ts
```

`user-prompt-submit.ts` should:

1. Read Codex hook JSON from argv or stdin because local Superset evidence shows Codex may pass JSON as an argument while Claude pipes stdin.
2. Extract prompt/session/cwd fields defensively.
3. Call the shared advisor brief producer from 020/002.
4. Emit Codex hook output JSON with:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Advisor: live; use sk-code-opencode 0.95/0.23 pass."
  }
}
```

5. Fail open: exit 0 with no additional context on missing advisor binary, timeout, parse error, stale graph, or unsupported hook input.

### Fallback path: prompt wrapping

When native Codex hooks are unavailable:

- For `codex exec`, prepend the advisor brief to the prompt or stdin payload.
- For interactive TUI, prefer a session-start preamble only if the wrapper cannot intercept each prompt safely.
- Never use the Superset `notify` hook alone as the advisor integration because it dispatches notifications and does not inject model-visible context.

Example fallback shape:

```text
<advisor-brief>

<original-user-prompt>
```

The fallback should carry an explicit provenance prefix such as `Advisor brief (wrapper fallback): ...` so transcript readers can distinguish native hook context from wrapper-mutated user prompt text.

### Runtime detection update required

The runtime detector should stop hard-coding Codex to `hookPolicy: 'unavailable'`. It should become dynamic, similar to Gemini and Copilot:

1. Detect Codex runtime from existing env signals.
2. Detect hook capability from either explicit config (`~/.codex/hooks.json`, repo `.codex/hooks.json` if supported) or `codex features list`/feature flag availability.
3. Return:
   - `enabled` when `codex_hooks` is enabled and `UserPromptSubmit` is configured.
   - `disabled_by_scope` when Codex is detected but no hook config is present.
   - `unavailable` only when the binary/version lacks the hook feature or probing fails decisively.

## Implementation Cluster Impact

This iteration changes the likely 020 child mapping:

- 020/006 Codex integration should not be "prompt-wrapper only."
- 020/006 should first build a native `UserPromptSubmit` Codex hook adapter and dynamic Codex hook-policy detector.
- A compatibility fallback can still use prompt wrapping for older Codex versions.
- PreToolUse should get a follow-on verification task, not become a blocker for prompt-time skill-advisor delivery.

## Answered Question

Q1 is answered with caveat:

- `UserPromptSubmit`: yes, enough evidence to design native advisor brief injection.
- `SessionStart`: yes, suitable for startup preamble.
- `PreToolUse`: likely present in installed 0.121.0, but payload/blocking behavior needs a focused runtime capture before using it for enforcement.

## Next Focus

Iteration 5 should return to Q5 and Q7:

1. Specify fail-open behavior for missing binary, timeout, malformed JSON, stale graph, DB lock, and unsupported Codex hook input.
2. Define prompt fingerprint privacy boundaries for native hooks and wrapper fallback, including whether fingerprints stay in memory or use salted TTL hashes.

## Ruled Out

- Treating Codex as permanently hookless.
- Using only `session_bootstrap` for Codex parity after `codex_hooks` is present.
- Using the Superset notification wrapper as the skill-advisor context-injection mechanism.
- Depending on `PreToolUse` for 020/006 prompt routing before a real Codex hook payload capture verifies current semantics.
