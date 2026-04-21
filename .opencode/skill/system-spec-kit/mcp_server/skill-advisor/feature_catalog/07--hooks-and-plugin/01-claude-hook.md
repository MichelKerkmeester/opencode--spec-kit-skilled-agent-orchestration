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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Surface skill recommendations in Claude Code sessions at prompt time, without blocking the prompt when the advisor is degraded.

---

## 2. CURRENT REALITY

`hooks/claude/user-prompt-submit.ts` reads the prompt from stdin, calls the native advisor through `compat/index.ts`, and returns a JSON envelope with `hookSpecificOutput.additionalContext`. The hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and fails open on any daemon-level failure. Raw prompts never appear in diagnostics. Freshness vocabulary is `live / stale / absent / unavailable`; status vocabulary is `ok / skipped / degraded / fail_open`.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`

---

## 4. TEST COVERAGE

- Playbook scenario [CL-001](../../manual_testing_playbook/02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md).
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts` — parity across hooks.

---

## 5. RELATED

- [02-copilot-hook.md](./02-copilot-hook.md).
- [03-gemini-hook.md](./03-gemini-hook.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
