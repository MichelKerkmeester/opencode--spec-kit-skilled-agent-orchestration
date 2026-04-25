---
title: "Codex CLI SessionStart and UserPromptSubmit Hooks"
description: "Codex CLI adapters using native SessionStart startup context and UserPromptSubmit advisor brief injection, with a prompt-wrapper fallback for older deployments."
trigger_phrases:
  - "codex hook"
  - "codex user-prompt-submit"
  - "codex prompt-wrapper"
  - "codex advisor hook"
---

# Codex CLI SessionStart and UserPromptSubmit Hooks

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Support Codex CLI sessions with native startup-context and prompt-time advisor injection when `[features].codex_hooks = true` is enabled. Older deployments, missing hook configs, or restricted hosts can still use the prompt-wrapper fallback for the advisor path.

---

## 2. CURRENT REALITY

`hooks/codex/session-start.ts` handles native `SessionStart` startup, resume, and clear events and returns `hookSpecificOutput.additionalContext`. `hooks/codex/user-prompt-submit.ts` handles native `UserPromptSubmit` advisor briefs. User-level `~/.codex/hooks.json` registers the compiled `SessionStart` and `UserPromptSubmit` entries alongside Superset `notify.sh`, and `~/.codex/config.toml` must enable `codex_hooks = true`. `hooks/codex/prompt-wrapper.ts` remains the fallback prompt-wrapper path for Codex deployments that do not expose the hook surface. `.codex/policy.json` ships the Bash denylist. The native prompt hook and wrapper share failure semantics and the global disable flag.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`
- `~/.codex/hooks.json`
- `~/.codex/config.toml`
- `.codex/policy.json`

---

## 4. TEST COVERAGE

- Playbook scenario [CL-004](../../manual_testing_playbook/02--cli-hooks-and-plugin/004-codex-hook-and-wrapper.md).
- `tests/codex-session-start-hook.vitest.ts`.
- `tests/codex-user-prompt-submit-hook.vitest.ts`.

---

## 5. RELATED

- [01-claude-hook.md](./01-claude-hook.md).
- [02-copilot-hook.md](./02-copilot-hook.md).
- [03-gemini-hook.md](./03-gemini-hook.md).
