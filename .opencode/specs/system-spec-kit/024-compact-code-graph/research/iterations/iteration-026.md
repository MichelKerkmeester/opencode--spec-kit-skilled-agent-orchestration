# Iteration 026: Copilot CLI Hooks API Analysis

## Focus

Establish the current GitHub Copilot CLI hooks surface from official docs, compare it to Claude Code's hook system, inspect local repo Copilot-related config, and assess whether a future Copilot hook adapter could reuse our existing hook scripts for `024-compact-code-graph`.

## Findings (numbered)

1. GitHub Copilot CLI currently documents eight hook lifecycle events: `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `agentStop`, `subagentStop`, and `errorOccurred`.
   - The most complete list appears in the current Copilot CLI command reference.
   - The higher-level "compare features" page agrees on the same set.
   - The how-to template is behind the reference: it shows a starter file with only `sessionStart`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, and `sessionEnd`, so the template should not be treated as the authoritative event list.

2. Copilot CLI does not support the same handler matrix as Claude Code.
   - Supported in Copilot CLI:
     - `command` hooks: supported on all documented hook events.
     - `prompt` hooks: supported only on `sessionStart`; they auto-submit text before any initial `--prompt`.
   - Not supported in current Copilot CLI docs:
     - `http`
     - `agent`
   - This is materially narrower than Claude Code, which officially supports `command`, `http`, `prompt`, and `agent` handlers.

3. Hook registration format is JSON `version: 1`, and hook configs are loaded from `.github/hooks/*.json`, not from the normal Copilot settings files.
   - Official Copilot CLI docs say hook configuration files are automatically loaded from `.github/hooks/*.json` in the repository.
   - The config object shape is:
     - top-level `version`
     - top-level `hooks`
     - each event name maps to an array of handlers
   - `command` handler fields are `type`, `bash`, `powershell`, optional `cwd`, optional `env`, and optional `timeoutSec`.
   - `prompt` handler fields are `type: "prompt"` and `prompt`.
   - Normal Copilot settings live elsewhere:
     - user: `~/.copilot/config.json`
     - repo: `.github/copilot/settings.json`
     - local repo override: `.github/copilot/settings.local.json`
   - Those settings files are for general CLI configuration and plugin settings, not for hook registration.

4. Local repo evidence matches the official model: this repo uses `.github/hooks/*.json`, and the `cli-copilot` skill itself does not mention hooks.
   - `.opencode/skill/cli-copilot/SKILL.md` contains no `hook` or `hooks` references.
   - At repo root, `.github/hooks/superset-notify.json` exists and uses the documented JSON format with `version: 1`.
   - That file currently registers `command` hooks for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `postToolUse`.
   - Root-level `.github/copilot/settings.json` and `.github/copilot/settings.local.json` do not exist.
   - `~/.copilot/config.json` exists locally, but only contains login metadata in this environment, not hook definitions.
   - `.vscode/settings.json` enables Copilot Chat MCP/instruction behavior, but it is not a Copilot CLI hook config file.

5. Copilot hooks are primarily a guardrail, automation, and observability surface, with only very limited context-injection ability.
   - The official feature-comparison page frames hooks around guardrails, logging, retry/abort policy, protected-path checks, and lifecycle automation.
   - `preToolUse` is the main control point because it can allow, deny, or modify tool arguments.
   - `agentStop` and `subagentStop` can block completion and force another agent turn.
   - `postToolUse` and `errorOccurred` are explicitly non-mutating in current docs.
   - The only documented context-like injection mechanism in Copilot CLI hooks is the `prompt` hook on `sessionStart`, which auto-submits text as if the user typed it. That is a bootstrap mechanism, not a general-purpose command-hook context channel.

6. Command-hook stdout cannot generally inject content into the Copilot conversation.
   - `sessionStart` command hooks: output ignored.
   - `sessionEnd`: output ignored.
   - `userPromptSubmitted`: output ignored; prompt modification is not currently supported in customer hooks.
   - `postToolUse`: output ignored.
   - `errorOccurred`: output ignored.
   - `preToolUse`: stdout JSON is processed for control decisions.
   - `agentStop` / `subagentStop`: stdout JSON is processed for stop/continue control.
   - Net result: Copilot command hooks are not equivalent to Claude Code's `SessionStart` / `UserPromptSubmit` command hooks, where plain stdout can become model-visible context.

7. The documented Copilot stdin JSON schema is relatively small and event-specific.
   - `sessionStart`:
     - `timestamp`
     - `cwd`
     - `source` = `new | resume | startup`
     - `initialPrompt`
   - `sessionEnd`:
     - `timestamp`
     - `cwd`
     - `reason` = `complete | error | abort | timeout | user_exit`
   - `userPromptSubmitted`:
     - `timestamp`
     - `cwd`
     - `prompt`
   - `preToolUse`:
     - `timestamp`
     - `cwd`
     - `toolName`
     - `toolArgs` as a JSON string
     - output control fields: `permissionDecision`, `permissionDecisionReason`, `modifiedArgs`
   - `postToolUse`:
     - `timestamp`
     - `cwd`
     - `toolName`
     - `toolArgs` as a JSON string
     - `toolResult.resultType`
     - `toolResult.textResultForLlm`
   - `errorOccurred`:
     - `timestamp`
     - `cwd`
     - `error.message`
     - `error.name`
     - `error.stack`
   - I'M UNCERTAIN ABOUT THIS: GitHub's current docs clearly document decision control for `agentStop` and `subagentStop`, but I did not find a full stdin example/schema for those two events in the current hooks reference. We should treat their input payload as undocumented unless we confirm it empirically.

8. Copilot's hook system is materially narrower than Claude Code's in the places that matter for `compact-code-graph`.
   - Claude Code exposes a much larger event surface, supports `command`, `http`, `prompt`, and `agent` handlers, allows multiple config scopes, and supports actual conversation/context injection from command hooks on specific events.
   - Copilot CLI is closer to a deterministic policy-and-observability hook system with one narrow prompt bootstrap path.
   - For cross-runtime design, Copilot should be modeled as:
     - good for policy gates and logging
     - acceptable for session bootstrap via `sessionStart` prompt hook
     - poor fit for rich post-event context rehydration or async/background context injection

9. A future Copilot hook adapter could reuse some of our hook scripts, but only through a normalization shim.
   - Good reuse candidates:
     - stateless shell validators
     - audit/logging hooks
     - tool guardrail scripts
     - path/policy enforcement
   - Direct reuse will fail when a script assumes Claude-specific behavior such as:
     - snake_case input fields
     - nested `tool_input` envelopes
     - `hookSpecificOutput`
     - stdout-based context injection
     - `http` or `agent` handlers
   - Copilot uses camelCase fields like `toolName` and `toolArgs`, and `toolArgs` arrives as a JSON string, so adapters need to parse and normalize before dispatching existing logic.
   - `agentStop` / `subagentStop` may still be useful for a continuation loop, but because the input schema is not fully documented, they should be treated as experimental until validated in a live Copilot CLI session.

## Evidence (cite sources/URLs)

- Official GitHub docs:
  - https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
    - authoritative event list, prompt-hook support, `.github/hooks/*.json` loading, `preToolUse` and `agentStop` / `subagentStop` decision control
  - https://docs.github.com/en/copilot/reference/hooks-configuration
    - stdin JSON examples for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, and `errorOccurred`
  - https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
    - current starter template, `.github/hooks/` setup flow, and confirmation that Copilot CLI loads hooks from current working directory
  - https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features
    - conceptual positioning of hooks as guardrails/observability plus the high-level lifecycle event list
- Official Claude docs for comparison:
  - https://code.claude.com/docs/en/hooks
    - full Claude Code hook reference: larger event surface, handler types, config scopes, stdout/context behavior
  - https://code.claude.com/docs/en/hooks-guide
    - practical examples showing stdout-based context injection and broader hook usage
- Local repo evidence:
  - `.opencode/skill/cli-copilot/SKILL.md`
    - no hook references found via `rg -n "hook|hooks" .opencode/skill/cli-copilot/SKILL.md`
  - `.github/hooks/superset-notify.json`
    - real repo hook config using Copilot's `version: 1` JSON structure and `command` handlers
  - `.vscode/settings.json`
    - Copilot Chat/MCP/editor settings only; not a Copilot CLI hook config surface
  - `.github/copilot/settings.json`
    - not present at repo root
  - `.github/copilot/settings.local.json`
    - not present at repo root
  - `~/.copilot/config.json`
    - present locally, but only contains login metadata in this environment

## New Information Ratio (0.0-1.0)

0.64

## Novelty Justification

This pass materially updates the packet's Copilot understanding beyond the earlier "hooks exist but are mostly guardrails" baseline.

New or clarified information from this iteration:

- Copilot CLI now officially documents eight lifecycle events, including `agentStop` and `subagentStop`.
- Copilot CLI does support a second hook type, `prompt`, but only on `sessionStart`.
- Hook registration is definitively `.github/hooks/*.json`, separate from `.github/copilot/settings*.json`.
- Command-hook stdout is ignored on most Copilot events, so command-based context injection is not a viable portability assumption.
- The documented stdin schemas are now specific enough to design a normalization adapter for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, and `errorOccurred`.
- The repo already contains a real Copilot-style hook config at `.github/hooks/superset-notify.json`, while the `cli-copilot` skill itself has no hook guidance.

Overlap with earlier research remains non-trivial, which is why the ratio is not higher: we already knew Copilot hooks existed and were narrower than Claude. The new value here is the current authoritative breakdown and the portability constraints it implies.

## Recommendations for Implementation

1. Treat Copilot v1 as a policy/logging adapter, not a full Claude-equivalent hook runtime.
   - Support `preToolUse`, `postToolUse`, `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `errorOccurred` first.

2. Add a normalization shim before script dispatch.
   - Convert Copilot camelCase payloads into our internal canonical hook envelope.
   - Parse `toolArgs` from its JSON string form before handing it to shared scripts.

3. Reuse shell scripts only where behavior is deterministic.
   - Safe to reuse: command validators, path guards, telemetry, audit logging, policy checks.
   - Do not directly reuse Claude scripts that depend on stdout context injection or Claude-specific output envelopes.

4. Model `sessionStart` prompt hooks as a narrow bootstrap feature.
   - They may be useful for one-time startup instructions or slash-command bootstrapping.
   - Do not design around them as a replacement for Claude's richer context reinjection patterns.

5. Gate `agentStop` and `subagentStop` support behind runtime validation.
   - The decision output is documented.
   - The stdin payload shape is not fully documented in the current reference, so implementation should remain experimental until confirmed with a live Copilot CLI capture.

6. Keep generated Copilot hook config in `.github/hooks/*.json`.
   - Do not place hook definitions in `.github/copilot/settings.json`.
   - Repository-level Copilot settings and hook registration should remain separate in the adapter design.
