---
title: "Claude Code user-prompt-submit Hook"
description: "Claude Code adapter that emits hookSpecificOutput.additionalContext from the native advisor at prompt time."
trigger_phrases:
  - "claude hook"
  - "claude user-prompt-submit"
  - "hookSpecificOutput claude"
  - "claude advisor hook"
---

# Claude Code user-prompt-submit Hook

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Surface skill recommendations in Claude Code sessions at prompt time, without blocking the prompt when the advisor is degraded.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`hooks/claude/user-prompt-submit.ts` reads the prompt from stdin, calls the native advisor through `compat/index.ts`, and returns a JSON envelope with `hookSpecificOutput.additionalContext`. The hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and fails open on any daemon-level failure. Raw prompts never appear in diagnostics. Freshness vocabulary is `live / stale / absent / unavailable`; status vocabulary is `ok / skipped / degraded / fail_open`.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-001](../../manual_testing_playbook/02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md).` | Manual playbook | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts` | Automated test | parity across hooks |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/01-claude-hook.md`

Related references:

- [02-copilot-hook.md](./02-copilot-hook.md).
- [03-gemini-hook.md](./03-gemini-hook.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
<!-- /ANCHOR:source-metadata -->
