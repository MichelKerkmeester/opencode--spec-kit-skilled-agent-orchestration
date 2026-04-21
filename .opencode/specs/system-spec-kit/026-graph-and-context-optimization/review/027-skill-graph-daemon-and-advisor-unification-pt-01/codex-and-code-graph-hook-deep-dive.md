---
title: "Codex And Code Graph Hook Deep Dive"
description: "Detailed read-only findings on Codex skill-advisor hooks, Codex startup/code-graph parity, Claude/Copilot comparison, and OpenCode code-graph plugin behavior."
importance_tier: "high"
contextType: "review-findings"
review_date: "2026-04-21"
scope: "Codex skill-advisor hooks, Codex startup/code-graph parity, Copilot hook wiring, Claude hook baseline, OpenCode code-graph plugin bridge"
---

# Codex And Code Graph Hook Deep Dive

## Executive Summary

This report separates two hook families that were conflated in earlier discussion:

1. **Skill-advisor prompt hooks**: prompt-time advisor routing that should surface a compact skill recommendation on user prompt submission.
2. **Startup/code-graph lifecycle hooks**: session-start, compaction, stop, or plugin surfaces that prime memory/code-graph context before or around model work.

The findings are:

- **Codex does have a skill-advisor prompt hook implementation and repo-local `.codex/settings.json` wiring.** The Codex hook files exist, are compiled into `dist/`, and `.codex/settings.json` registers `UserPromptSubmit` and `PreToolUse`.
- **Codex does not have a native startup/code-graph lifecycle hook equivalent to Claude `SessionStart`.** Current documents describe Codex startup parity as bootstrap-based, not hook-based. Some packet docs additionally claim `context-prime` parity, but no `.codex/agents/context-prime.toml` exists in this repo.
- **The Codex skill-advisor hook did not visibly inject in this conversation.** The current session log contained no advisor brief markers. The only confirmed advisor invocation was an explicit MCP `advisor_recommend` call.
- **Direct Codex advisor-hook smoke execution currently fail-opens.** The hook ran, but returned `{}` with diagnostic `SIGNAL_KILLED` after the advisor subprocess hit the 1s timeout.
- **The OpenCode code-graph plugin appears to have a live bridge contract mismatch.** The plugin calls the bridge with `--minimal`, but the minimal `session_resume` path does not return `opencodeTransport`, which the plugin parser requires before injecting startup/message/compaction context.
- **Copilot startup hook code exists and smoke-runs, but checked-in hook JSON still points `sessionStart` at the Superset notifier directly rather than the repo-local startup wrapper.** That contradicts the Phase 031 implementation summary.
- **Claude remains the only checked-in runtime with full lifecycle coverage in this repo:** `UserPromptSubmit`, `PreCompact`, `SessionStart`, and `Stop`.

Bottom line: **Codex prompt-hook parity exists in code and config, but Codex startup/code-graph hook parity does not.** The highest-risk runtime issue is the OpenCode code-graph plugin no-op risk; the highest-risk Codex issue is that the configured prompt hook can execute but fail-open before producing an advisor brief.

## Scope And Method

Review target paths:

- `.codex/settings.json`
- `.codex/policy.json`
- `.claude/settings.local.json`
- `.github/hooks/superset-notify.json`
- `.github/hooks/scripts/session-start.sh`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js`
- `.opencode/skill/system-spec-kit/mcp_server/tests/`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/`

Method:

- Used Spec Kit Memory trigger surfacing for prior hook/code-graph context.
- Used Skill Advisor MCP explicitly; it recommended `sk-code-review` for this findings report, but freshness was stale (`LEGACY_ADVISOR_GENERATION_BUMP`).
- Used direct file reads and `rg`/`find` to verify source, docs, configs, tests, and runtime scripts.
- Ran small smoke checks for Codex prompt hook, Codex pre-tool hook, and Copilot session-prime output.
- Inspected session-log evidence for this conversation from the Codex/Superset runtime.

Limitation:

- CocoIndex semantic searches timed out during the preceding investigation, so this report relies on direct source reads, exact search, and smoke commands.
- I cannot prove that no hidden runtime hook ran internally. I can only say the local session log and visible model context contained no hook-injected markers.

## Runtime Hook Inventory

### Claude Code

Claude has the full lifecycle hook set in `.claude/settings.local.json`:

| Event | Config evidence | Entrypoint |
| --- | --- | --- |
| `UserPromptSubmit` | `.claude/settings.local.json:25-35` | `dist/hooks/claude/user-prompt-submit.js` |
| `PreCompact` | `.claude/settings.local.json:36-46` | `dist/hooks/claude/compact-inject.js` |
| `SessionStart` | `.claude/settings.local.json:47-57` | `dist/hooks/claude/session-prime.js` |
| `Stop` | `.claude/settings.local.json:58-68` | `dist/hooks/claude/session-stop.js` |

The hooks README describes the same Claude lifecycle:

- `compact-inject.ts`: PreCompact precompute/cache
- `session-prime.ts`: SessionStart context injection
- `user-prompt-submit.ts`: skill-advisor brief injection
- `session-stop.ts`: transcript/token snapshot path

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:36-45`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:10-28`

### Codex

Codex has prompt-time hook wiring, but no startup lifecycle hook:

| Event | Config evidence | Entrypoint | Status |
| --- | --- | --- | --- |
| `UserPromptSubmit` | `.codex/settings.json:3-13` | `dist/hooks/codex/user-prompt-submit.js` | Exists and registered |
| `PreToolUse` | `.codex/settings.json:14-24` | `dist/hooks/codex/pre-tool-use.js` | Exists and registered |
| `SessionStart` | none found | none found | Missing |
| `PreCompact` | none found | none found | Missing |
| `Stop` | none found | none found | Missing |

Important correction:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md:19` says repo-local `.codex/settings.json` and `.codex/policy.json` registration was deferred.
- That README is stale. `.codex/settings.json` and `.codex/policy.json` now exist and are populated.

### Copilot

Copilot has hook code and wrapper scripts, but the checked-in JSON does not point startup at the repo-local startup wrapper.

Code exists:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.github/hooks/scripts/session-start.sh`
- `.github/hooks/scripts/superset-notify.sh`

But checked-in hook JSON:

- `.github/hooks/superset-notify.json:4-10` routes `sessionStart` directly to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart`.
- It does not route `sessionStart` to `.github/hooks/scripts/session-start.sh`.

That contradicts the Phase 031 summary, which says this phase replaced `sessionStart` with a repo-local wrapper.

Evidence:

- `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/implementation-summary.md:30-33`
- `.github/hooks/superset-notify.json:4-10`
- `.github/hooks/scripts/session-start.sh:1-41`

### OpenCode

OpenCode has a plugin-based code-graph hook:

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`

The plugin declares these surfaces:

- `experimental.chat.system.transform`
- `experimental.chat.messages.transform`
- `experimental.session.compacting`

Evidence:

- `.opencode/plugins/spec-kit-compact-code-graph.js:323-344`
- `.opencode/plugins/spec-kit-compact-code-graph.js:346-394`
- `.opencode/plugins/spec-kit-compact-code-graph.js:396-417`

However, the live bridge path appears contract-mismatched. See finding HOOK-P1-001.

## Conversation Runtime Evidence

The current conversation is running under a Codex/Superset environment, not OpenCode.

Observed environment during investigation:

- `CODEX_CI=1`
- `CODEX_THREAD_ID=019dae9c-20dc-7880-8755-016f9bb5c55c`
- `CODEX_TUI_RECORD_SESSION=1`
- `CODEX_TUI_SESSION_LOG_PATH=/var/folders/.../superset-codex-session-71856_1776750958.jsonl`

The session log was searched for advisor and code-graph injection markers:

- `Advisor:`
- `hookSpecificOutput`
- `additionalContext`
- `promptWrapper`
- `wrappedPrompt`
- `OpenCode Startup Digest`
- `OpenCode Retrieved Context`
- `OpenCode Compaction Resume Note`
- `opencodeTransport`

No matches were found for injected hook output. Only user text mentioning the advisor/hook topics appeared.

Conclusion:

- The Codex skill-advisor hook may be configured, but there is no visible evidence it injected context into this conversation.
- The OpenCode code-graph plugin did not run in this conversation; it is an OpenCode plugin surface, not a Codex/Superset surface.
- The only confirmed advisor invocation in this review flow was the explicit MCP `advisor_recommend` tool call.

## Smoke Checks

### Codex UserPromptSubmit Hook

Command shape:

```bash
printf '%s\n' '{"prompt":"review this TypeScript hook implementation","cwd":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

Observed stdout:

```json
{}
```

Observed stderr diagnostic:

```json
{"timestamp":"2026-04-21T09:00:17.686Z","runtime":"codex","status":"fail_open","freshness":"unavailable","durationMs":1012,"cacheHit":false,"errorCode":"SIGNAL_KILLED"}
```

Interpretation:

- The script executes.
- It fail-opens.
- The advisor subprocess exceeded the default 1000 ms timeout and was killed.
- No `hookSpecificOutput.additionalContext` was emitted.

### Codex PreToolUse Hook

Command with exact listed deny pattern:

```bash
printf '%s\n' '{"tool":"Bash","tool_input":{"command":"git reset --hard origin/main"}}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
```

Observed stdout:

```json
{"decision":"deny","reason":"Codex PreToolUse denied Bash command matching git reset --hard origin/main"}
```

Command with unlisted shorter destructive form:

```bash
printf '%s\n' '{"toolName":"Bash","toolInput":{"command":"git reset --hard"}}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
```

Observed stdout:

```json
{}
```

Interpretation:

- The pre-tool hook works for exactly listed configured patterns.
- `.codex/policy.json` does not include bare `git reset --hard`, only `git reset --hard origin/main` and `git reset --hard origin/master`.
- The hook does not parse `toolInput.command`, only `command`, `tool_input.command`, and `input.command`.

### Copilot Session Prime Hook

Command shape:

```bash
printf '%s\n' '{"source":"startup","session_id":"smoke"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js
```

Observed startup banner excerpt:

```text
Session context received. Current state:

- Memory: startup summary only (resume on demand)
- Code Graph: stale -- 33 files -- 482 nodes -- 165 edges (last scan 2026-04-20; first structural read may refresh inline)
- CocoIndex: missing
- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.

What would you like to work on?
```

Interpretation:

- Copilot session-prime code works when invoked directly.
- Checked-in `.github/hooks/superset-notify.json` does not currently invoke that wrapper for `sessionStart`.

## Findings

### HOOK-P1-001 - OpenCode code-graph plugin bridge cannot receive the transport payload it requires

Severity: P1

Files:

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js`
- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`

Evidence:

- The plugin bridge command passes `--minimal`:
  - `.opencode/plugins/spec-kit-compact-code-graph.js:170-183`
- The bridge converts `--minimal` into `handleSessionResume({ minimal: true })`:
  - `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs:74-90`
- The plugin parser requires `data.opencodeTransport` and `plan.transportOnly === true`:
  - `.opencode/plugins/spec-kit-compact-code-graph.js:124-140`
- The minimal `session_resume` branch returns early before building `payloadContract` or `opencodeTransport`:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560-578`
  - `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js:318-335`
- `opencodeTransport` is built only later on the non-minimal path:
  - `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js:384-413`

Impact:

- The OpenCode plugin can call the bridge successfully and still receive no usable transport plan.
- `loadTransportPlan()` then treats the bridge output as missing transport payload, marks runtime readiness false, and skips injection.
- This affects all three plugin surfaces: startup digest, message retrieval injection, and compaction note.

Why tests missed it:

- `tests/opencode-plugin.vitest.ts` mocks bridge stdout with an `opencodeTransport` object already present.
- The test does not exercise the real bridge plus real `session_resume --minimal` output shape.

Recommended fix:

1. Prefer making `session_resume({ minimal: true })` return the transport payload needed by the plugin.
2. Alternatively remove `--minimal` from the bridge if full `session_resume` latency is acceptable.
3. Add an integration test that runs the actual bridge or at least asserts real minimal handler output parses through `parseTransportPlan()`.
4. Add a status/tool diagnostic assertion for the exact error `Bridge returned no OpenCode transport payload`.

### HOOK-P1-002 - Codex skill-advisor prompt hook exists and is wired, but direct smoke currently fail-opens before injecting a brief

Severity: P1

Files:

- `.codex/settings.json`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts`

Evidence:

- `.codex/settings.json:3-13` registers `UserPromptSubmit`.
- `handleCodexUserPromptSubmit()` builds a brief and returns `hookSpecificOutput.additionalContext` when rendering succeeds:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-278`
- The direct smoke command returned `{}` with diagnostic `SIGNAL_KILLED` after about 1012 ms.
- The advisor subprocess default timeout is 1000 ms:
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:63`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:216`

Impact:

- Even if the Codex runtime invokes the hook, users may receive no advisor context because the hook fail-opens on timeout.
- The failure is silent to the model because stdout is `{}` and diagnostics go to stderr.
- This matches the observed conversation: no advisor brief was visible.

Recommended fix:

1. Make the Codex hook path use the native advisor path without a slow Python subprocess when possible.
2. Increase or make configurable the hook timeout if the first cold advisor call legitimately exceeds 1s.
3. Warm or validate advisor freshness before hook use, or return a small stale-status advisory instead of empty `{}` when safe.
4. Add a smoke test for the compiled `dist/hooks/codex/user-prompt-submit.js` entrypoint under realistic workspace conditions.

### HOOK-P1-003 - Codex hook-policy detector relies on an invalid `codex hooks list` probe and can misclassify hook support under Superset

Severity: P1

Files:

- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts`

Evidence:

- The detector probes `codex --version`, then `codex hooks list`.
- In this environment, `codex --version` returns `codex-cli 0.121.0` from shell.
- In this environment, `codex hooks list` returns an error: `unexpected argument 'list' found`.
- From Node `spawnSync` with inherited Superset/Codex TUI env, the version probe timed out even while stdout contained the version.
- With relevant TUI session env scrubbed, the same version probe returned quickly.
- `prompt-wrapper.ts` uses `detectCodexHookPolicy()` to decide whether to add the fallback in-memory advisor wrapper.

Impact:

- Hook support can be reported as `partial` or `unavailable` for reasons unrelated to actual `.codex/settings.json` registration.
- If the detector says `partial`, the wrapper does not run, even though the hook-list probe is invalid.
- If the detector says `unavailable` due the Superset wrapper timeout, the wrapper may run unnecessarily.
- Tests encode `codex hooks list` as a success path, so they do not reflect the current installed CLI behavior.

Recommended fix:

1. Replace `codex hooks list` with a supported capability check, or inspect repo-local `.codex/settings.json` as the practical project-level registration source.
2. Probe the real Codex binary without Superset/TUI recording env where appropriate.
3. Add regression coverage for:
   - valid `codex --version` plus invalid `hooks list`
   - inherited Superset env timeout
   - checked-in `.codex/settings.json` present
4. Make `prompt-wrapper` fallback semantics explicit for `partial`: either wrap, or explain why native hook execution is trusted.

### HOOK-P1-004 - Copilot startup banner wrapper exists and works, but checked-in hook JSON does not invoke it

Severity: P1

Files:

- `.github/hooks/superset-notify.json`
- `.github/hooks/scripts/session-start.sh`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/implementation-summary.md`

Evidence:

- `.github/hooks/scripts/session-start.sh` invokes `dist/hooks/copilot/session-prime.js` and falls back to a banner.
- Direct smoke of `dist/hooks/copilot/session-prime.js` emitted the expected startup banner.
- `.github/hooks/superset-notify.json:4-10` routes `sessionStart` directly to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart`.
- The Phase 031 implementation summary claims the phase replaces `sessionStart` with a repo-local startup wrapper.

Impact:

- Copilot may not receive the repo-local code-graph startup banner in this repository despite the wrapper existing.
- The test suite can still pass if it asserts the Superset direct route rather than the claimed wrapper route.
- Runtime detection can report Copilot as hook-enabled without proving the banner-producing hook is the configured entrypoint.

Recommended fix:

1. Decide the intended Copilot `sessionStart` entrypoint.
2. If repo-local startup banner is intended, update `.github/hooks/superset-notify.json` to call `.github/hooks/scripts/session-start.sh`.
3. Keep Superset fan-out inside `session-start.sh`, as the wrapper already does at line 41.
4. Update `tests/copilot-hook-wiring.vitest.ts` to assert the actual intended behavior, not the stale direct Superset route.

### HOOK-P1-005 - Codex startup/code-graph parity is documented inconsistently and no `context-prime` Codex agent exists

Severity: P1

Files:

- `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.codex/agents/`

Evidence:

- `implementation-summary.md:143` says: "Codex now matches the startup surface through `context-prime`, not through a native SessionStart hook."
- `INSTALL_GUIDE.md:137` says Codex bootstrap parity is via `session_bootstrap` MCP tool, not a native SessionStart hook.
- `.codex/agents/` contains agent TOML files such as `context.toml`, `orchestrate.toml`, `deep-review.toml`, and others.
- `.codex/agents/context-prime.toml` does not exist.

Impact:

- Operators reading the packet can believe Codex has a `context-prime` startup surface that is not present in the repo.
- The actual Codex recovery path is manual/bootstrap-based, not automatic startup hook parity.
- This makes comparisons with Claude and Copilot misleading.

Recommended fix:

1. Either create and document a real `.codex/agents/context-prime.toml`, or remove the `context-prime` claim from packet docs.
2. Keep the install guide as the current source of truth unless a real startup-equivalent surface is added.
3. Add a doc/test check that references to `context-prime` point at an existing runtime file.

### HOOK-P2-001 - Codex hook README is stale about registration state

Severity: P2

Files:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md`
- `.codex/settings.json`
- `.codex/policy.json`

Evidence:

- `codex/README.md:19` says repo-local `.codex/settings.json` and `.codex/policy.json` registration was deferred due `EPERM`.
- `.codex/settings.json` exists and registers hooks.
- `.codex/policy.json` exists and contains a denylist.

Impact:

- Documentation sends maintainers toward a "deferred registration" mental model that is no longer true.
- It obscures the more important current issue: the hook is registered but may fail-open.

Recommended fix:

- Update the README to state:
  - Codex `UserPromptSubmit` and `PreToolUse` are registered in `.codex/settings.json`.
  - Codex startup/code-graph lifecycle hooks are still absent.
  - Prompt hook smoke should be verified because current advisor subprocess timeouts can yield `{}`.

### HOOK-P2-002 - Codex PreToolUse policy and schema coverage are narrower than the operator-facing policy text implies

Severity: P2

Files:

- `.codex/policy.json`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`

Evidence:

- `.codex/policy.json:3` says both `bashDenylist` and `bash_denylist` aliases are provided.
- `CodexPolicyFile` only declares `bashDenylist`.
- `handleCodexPreToolUse()` only reads `policy.bashDenylist`.
- `bashCommandFor()` reads `command`, `tool_input.command`, and `input.command`.
- The smoke payload with `toolInput.command` returned `{}` because that casing is not parsed.
- The bare `git reset --hard` command is not denied because only `git reset --hard origin/main` and `git reset --hard origin/master` are listed.

Impact:

- A policy file using only `bash_denylist` would be ignored.
- Hook payloads using `toolInput` casing would not be inspected.
- Some destructive commands are not blocked unless the exact configured target branch suffix is present.

Recommended fix:

1. Read both `bashDenylist` and `bash_denylist`.
2. Parse both `tool_input` and `toolInput`.
3. Consider adding bare `git reset --hard` to the default denylist.
4. Add tests for snake_case alias, camelCase `toolInput`, and bare destructive reset.

### HOOK-P2-003 - Codex PreToolUse hook creates `.codex/policy.json` if absent

Severity: P2

Files:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`

Evidence:

- `ensurePolicyFile()` calls `mkdirSync()` and `writeFileSync()` if the policy path is missing.
- `loadPolicy()` calls `ensurePolicyFile()` before reading.

Impact:

- A pre-tool hook that is conceptually a read/enforce gate can mutate the workspace.
- In read-only or tightly governed environments, a missing policy file can cause a surprising write attempt.

Recommended fix:

- Fail open or use in-memory default policy when the policy file is missing.
- Move policy generation to setup/bootstrap, not PreToolUse execution.

### HOOK-P2-004 - Runtime hook state docs overstate hook-capable runtime coverage for Codex

Severity: P2

Files:

- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `AGENTS.md`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`

Evidence:

- `hook_system.md:50` correctly says Codex CLI does not support lifecycle hooks and relies on explicit operator recovery.
- `AGENTS.md:92-98` says hook-capable runtimes auto-inject startup context and gives fallback recovery.
- `INSTALL_GUIDE.md:137` says Codex uses `session_bootstrap`.

Impact:

- The broad phrase "hook-capable runtimes" can be misread as covering Codex startup context because Codex has prompt hooks.
- Codex should be documented as:
  - prompt-hook capable for skill advisor
  - not lifecycle-hook capable for startup/code graph

Recommended fix:

- Add a runtime matrix that splits prompt hooks from lifecycle/startup hooks.

### HOOK-P2-005 - The code graph plugin tests mock away the real bridge contract

Severity: P2

Files:

- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`

Evidence:

- Tests construct mocked bridge JSON with `data.opencodeTransport`.
- The real bridge calls `session_resume --minimal`, which does not emit `opencodeTransport`.

Impact:

- Tests can pass while the live plugin injects nothing.
- This is the test coverage reason HOOK-P1-001 survived.

Recommended fix:

- Add an unmocked contract test for bridge stdout.
- Add a minimal handler fixture test that proves `session_resume({ minimal: true })` includes `opencodeTransport` if that remains the intended plugin input.

## Cross-Runtime Matrix

| Runtime | Skill advisor prompt hook | Startup/code-graph hook | Compaction hook | Stop/session-end hook | Current confidence |
| --- | --- | --- | --- | --- | --- |
| Claude | Yes, configured | Yes, configured | Yes, configured | Yes, configured | High |
| Codex | Yes, configured but smoke fail-open | No native lifecycle hook found | No | No | Medium for prompt hook, high for missing lifecycle |
| Copilot | Code exists; configured route appears Superset-local | Code exists and smokes; checked-in JSON does not invoke wrapper | Compact handling code exists in session-prime | Superset route configured | Medium |
| Gemini | Hook files exist; not deep-smoked in this pass | Session-prime file exists | Compact cache/inject files exist | Session-stop file exists | Medium |
| OpenCode | Plugin skill-advisor exists separately | Plugin exists but bridge mismatch likely no-op | Plugin compaction transform exists but depends on same transport plan | Not assessed | Medium-high for mismatch |

## Did The Hooks Run In This Conversation?

### Skill Advisor Hook

No visible evidence.

Evidence searched:

- TUI session log had no `Advisor:`, `hookSpecificOutput`, `additionalContext`, `promptWrapper`, or `wrappedPrompt` marker.
- Direct Codex hook smoke fail-opened with `SIGNAL_KILLED`.
- Explicit MCP `advisor_recommend` calls did run, but those are manual tool calls, not hook injection.

Conclusion:

- I cannot prove the runtime never invoked the hook internally.
- I can say there is no visible injected advisor brief in this conversation, and the compiled hook currently fails open in direct smoke.

### Code Graph Hook

No visible evidence.

Evidence searched:

- No `OpenCode Startup Digest`.
- No `OpenCode Retrieved Context`.
- No `OpenCode Compaction Resume Note`.
- No `opencodeTransport`.

Conclusion:

- This was a Codex/Superset session, not an OpenCode plugin host session.
- The OpenCode plugin would not be expected to run here.
- Separately, the OpenCode plugin bridge mismatch means it likely would not inject in OpenCode until fixed.

## Recommended Remediation Plan

### Priority 1 - Restore OpenCode code-graph plugin delivery

1. Make `session_resume({ minimal: true })` return `opencodeTransport`, or stop using `--minimal`.
2. Add a real bridge contract test.
3. Add runtime-status output that reports missing transport payload clearly.

Acceptance evidence:

- Running the bridge with `--minimal` returns JSON containing `data.opencodeTransport.transportOnly === true`.
- `parseTransportPlan()` accepts the real bridge payload.
- Plugin system, message, and compaction transforms all inject expected text in tests that do not mock the bridge output shape.

### Priority 2 - Make Codex advisor hook reliably visible

1. Fix the cold-path timeout or move Codex hook execution to native/daemon-backed advisor logic.
2. Add compiled-entrypoint smoke coverage.
3. Add session-log verification docs for expected `hookSpecificOutput.additionalContext` markers.

Acceptance evidence:

- Direct `dist/hooks/codex/user-prompt-submit.js` smoke returns `hookSpecificOutput.additionalContext` for a known prompt in a prepared workspace.
- Diagnostics show `status:"ok"` or explicit prompt-safe `stale` behavior, not `SIGNAL_KILLED`.

### Priority 3 - Truth-sync Codex lifecycle docs

1. Update Codex docs to say prompt hook exists and startup lifecycle hook does not.
2. Remove or implement the `context-prime` claim.
3. Split runtime matrices into:
   - prompt-time advisor hooks
   - lifecycle/startup/code-graph hooks

Acceptance evidence:

- No doc claims `.codex/agents/context-prime.toml` exists unless it does.
- Codex install/runtime docs point to `session_bootstrap` for startup recovery.
- Codex hook docs point to `.codex/settings.json` for prompt hook registration.

### Priority 4 - Repair Copilot startup hook wiring

1. Decide whether `.github/hooks/superset-notify.json` should call the repo-local wrapper or Superset directly.
2. If wrapper is intended, update the JSON and test to require `.github/hooks/scripts/session-start.sh`.
3. Keep Superset fan-out as a silent best-effort side effect inside the wrapper.

Acceptance evidence:

- `.github/hooks/superset-notify.json` routes `sessionStart` to the wrapper.
- The wrapper smoke still emits the startup banner.
- Non-banner events still return JSON-safe `{}`.

### Priority 5 - Tighten Codex PreToolUse policy semantics

1. Support `bash_denylist` alias.
2. Support `toolInput.command`.
3. Add bare destructive command patterns where appropriate.
4. Avoid writing a default policy from inside PreToolUse.

Acceptance evidence:

- Tests deny commands from both `bashDenylist` and `bash_denylist`.
- Tests parse `tool_input`, `toolInput`, and direct `command`.
- Missing policy file does not mutate the workspace during hook execution.

## Suggested Follow-Up Tests

Add or update these test cases:

| Test file | New assertion |
| --- | --- |
| `tests/opencode-plugin.vitest.ts` | Real bridge output parses into transport plan |
| `tests/session-resume.vitest.ts` | `minimal: true` includes `opencodeTransport` when used by plugin |
| `tests/codex-user-prompt-submit-hook.vitest.ts` | Compiled entrypoint smoke or integration wrapper does not timeout |
| `tests/codex-hook-policy.vitest.ts` | Current `codex hooks list` failure does not produce misleading policy |
| `tests/codex-pre-tool-use.vitest.ts` | `bash_denylist`, `toolInput`, and bare reset coverage |
| `tests/copilot-hook-wiring.vitest.ts` | `sessionStart` points at the repo-local startup wrapper if that is intended |
| docs lint/check | Runtime docs distinguish prompt hooks from lifecycle hooks |

## Confidence Notes

- High confidence: Codex prompt hook files and `.codex/settings.json` wiring exist.
- High confidence: No Codex `SessionStart`/startup lifecycle hook file or registration was found.
- High confidence: OpenCode plugin bridge/minimal response contract mismatch exists in source and compiled output.
- High confidence: Copilot session-prime code smoke-runs.
- High confidence: Checked-in Copilot JSON points directly at Superset for `sessionStart`.
- Medium confidence: The Codex advisor hook did not run in this conversation. Evidence is absence of visible session-log markers, but hidden runtime internals cannot be ruled out.
- Medium confidence: The Superset wrapper/TUI env is the cause of the Node `codex --version` probe timeout. The probe behaved differently with the inherited env versus scrubbed env, but the exact wrapper interaction was not traced to a single line-level cause.

## Final Assessment

The accurate runtime story is:

- **Claude**: full lifecycle hook parity.
- **Codex**: prompt-time skill-advisor hook parity exists; startup/code-graph lifecycle parity does not.
- **Copilot**: startup hook implementation exists; checked-in registration appears stale or incorrectly routed.
- **OpenCode**: plugin-based code-graph hook exists; live bridge contract likely prevents injection.

The most important correction for future work is to stop treating "has a Codex hook" as one yes/no question. Codex has the advisor prompt hook. It does not have the code-graph startup hook. The reportable bug is not "Codex hook missing" in general; it is "Codex startup/code-graph hook parity is absent, while the existing Codex prompt hook is configured but currently fail-opens in direct smoke."

## Remediation Log 2026-04-21

| Finding | Status | Primary fix file | Regression test citation |
| --- | --- | --- | --- |
| HOOK-P1-001 | Closed | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | `tests/session-resume.vitest.ts`, `tests/opencode-plugin.vitest.ts` |
| HOOK-P1-002 | Closed | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | `tests/codex-user-prompt-submit-hook.vitest.ts` |
| HOOK-P1-003 | Closed | `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | `tests/codex-hook-policy.vitest.ts` |
| HOOK-P1-004 | Closed | `.github/hooks/superset-notify.json` | `tests/copilot-hook-wiring.vitest.ts` |
| HOOK-P1-005 | Closed | `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/implementation-summary.md` | active-doc `rg context-prime` returned no remaining target references |
| HOOK-P2-001 | Closed | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | `tests/codex-user-prompt-submit-hook.vitest.ts` compiled smoke |
| HOOK-P2-002 | Closed with sandbox note | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | `tests/codex-pre-tool-use.vitest.ts` |
| HOOK-P2-003 | Closed | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/setup.ts` | `tests/codex-pre-tool-use.vitest.ts` |
| HOOK-P2-004 | Closed | `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `AGENTS.md`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | doc line evidence in `phase-C-fix-summary.md` |
| HOOK-P2-005 | Closed | `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`, `.opencode/plugins/spec-kit-compact-code-graph.js` | `tests/opencode-plugin.vitest.ts` real bridge contract test |

Sandbox note: direct writes to `.codex/policy.json` were denied with `EPERM` in this run. The runtime and setup defaults now include bare `git reset --hard`, so behavior is hardened even though the checked-in policy file could not be physically updated from this sandbox.
